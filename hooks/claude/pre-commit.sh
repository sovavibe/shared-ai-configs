#!/bin/bash
# Claude Code Pre-commit Hook
# Validates code quality and syncs beads before allowing commits

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Load environment variables
if [ -f ".env.development.local" ]; then
    export $(grep -v '^#' .env.development.local | xargs) 2>/dev/null || true
fi

# Beads sync (auto-detect if .beads/ exists)
if [ -d ".beads" ] && command -v bd &> /dev/null && [ -f ".beads/issues.jsonl" ]; then
    echo -e "${YELLOW}[Pre-commit]${NC} Syncing beads..."
    bd sync --flush-only 2>/dev/null || true
    git add .beads/issues.jsonl 2>/dev/null || true
    echo -e "${GREEN}[Beads]${NC} Synced"
fi

echo -e "${YELLOW}[Pre-commit]${NC} Running quality gates..."

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo -e "${RED}[Pre-commit]${NC} npm not found, skipping quality gates"
    exit 0
fi

# Check if we're in a node project
if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}[Pre-commit]${NC} No package.json found, skipping"
    exit 0
fi

# Run quality gates if script exists
if npm run --silent 2>/dev/null | grep -q "quality:gates"; then
    npm run quality:gates
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}[Pre-commit]${NC} Quality gates passed"
    else
        echo -e "${RED}[Pre-commit]${NC} Quality gates failed - fix issues before committing"
        exit 1
    fi
else
    echo -e "${YELLOW}[Pre-commit]${NC} No quality:gates script, running individual checks..."

    # Run lint if available
    if npm run --silent 2>/dev/null | grep -q "lint"; then
        npm run lint || exit 1
    fi

    # Run type check if available
    if npm run --silent 2>/dev/null | grep -q "typecheck"; then
        npm run typecheck || exit 1
    fi
fi

echo -e "${GREEN}[Pre-commit]${NC} All checks passed"
exit 0
