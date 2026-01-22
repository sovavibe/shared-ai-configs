#!/bin/bash
# Claude Code Session Start Hook
# Auto-loads context when starting a new session

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f ".env.development.local" ]; then
    export $(grep -v '^#' .env.development.local | xargs) 2>/dev/null || true
fi

echo -e "${GREEN}[Session Start]${NC} Initializing context..."

# Check BD_ENABLED
if [ "$BD_ENABLED" != "1" ] && [ "$BD_ENABLED" != "true" ]; then
    echo -e "${YELLOW}[Beads]${NC} BD_ENABLED not set, skipping beads integration"
else
    echo -e "${GREEN}[Beads]${NC} BD_ENABLED=1, full integration active"
fi

# 1. Prime beads if available AND BD_ENABLED
if [ "$BD_ENABLED" = "1" ] || [ "$BD_ENABLED" = "true" ]; then
    if command -v bd &> /dev/null; then
        bd prime 2>/dev/null && echo -e "${GREEN}[Beads]${NC} Context loaded" || true
    fi
fi

# 1.5. Auto-recall Hindsight context (multi-session TEMPR approach)
# Uses semantic + keyword + graph + temporal retrieval for 91%+ accuracy
echo -e "${YELLOW}[Hindsight]${NC} Recalling multi-session project context (TEMPR)..."
if command -v mcp &> /dev/null; then
    # Dynamic recall prompt based on context (not hardcoded 3 sessions)
    # TEMPR: semantic search + keyword matching + graph traversal + temporal filtering
    # Use HINDSIGHT_RECALL_QUERY env var if set, otherwise use generic query
    RECALL_QUERY="${HINDSIGHT_RECALL_QUERY:-project architecture decisions, API patterns, conventions, recent blockers, active work context}"
    mcp__hindsight-alice__recall "$RECALL_QUERY" 2>/dev/null || true
fi

# 2. Check for in-progress work (only if BD_ENABLED)
if [ "$BD_ENABLED" = "1" ] || [ "$BD_ENABLED" = "true" ]; then
    if command -v bd &> /dev/null; then
        IN_PROGRESS=$(bd list --status=in_progress 2>/dev/null | head -5)
        if [ -n "$IN_PROGRESS" ]; then
            echo -e "${YELLOW}[Beads]${NC} In-progress work detected:"
            echo "$IN_PROGRESS"
        fi
    fi
fi

# 3. Show ready tasks count (only if BD_ENABLED)
if [ "$BD_ENABLED" = "1" ] || [ "$BD_ENABLED" = "true" ]; then
    if command -v bd &> /dev/null; then
        READY_COUNT=$(bd ready 2>/dev/null | wc -l | tr -d ' ')
        if [ "$READY_COUNT" -gt 0 ]; then
            echo -e "${GREEN}[Beads]${NC} $READY_COUNT tasks ready to work"
        fi

        # Also show blocked tasks
        BLOCKED=$(bd blocked 2>/dev/null | head -3)
        if [ -n "$BLOCKED" ]; then
            echo -e "${YELLOW}[Beads]${NC} Blocked tasks:"
            echo "$BLOCKED"
        fi
    fi
fi

echo -e "${GREEN}[Session Start]${NC} Context initialization complete"
