#!/bin/bash
# Claude Code Bash Command Validator
# Validates bash commands before execution

set -e

COMMAND="$1"

# List of prohibited patterns
PROHIBITED_PATTERNS=(
    "rm -rf /"
    "rm -rf ~"
    "rm -rf \$HOME"
    "> /dev/sda"
    "mkfs"
    ":(){:|:&};:"  # Fork bomb
    "chmod -R 777 /"
    "dd if=/dev/random"
)

# Check for prohibited patterns
for pattern in "${PROHIBITED_PATTERNS[@]}"; do
    if [[ "$COMMAND" == *"$pattern"* ]]; then
        echo "BLOCKED: Dangerous command pattern detected: $pattern"
        exit 1
    fi
done

# Warn about potentially destructive commands
WARN_PATTERNS=(
    "git push --force"
    "git reset --hard"
    "npm publish"
    "DROP TABLE"
    "DELETE FROM"
    "--no-verify"
    "HUSKY=0"
)

for pattern in "${WARN_PATTERNS[@]}"; do
    if [[ "$COMMAND" == *"$pattern"* ]]; then
        echo "WARNING: Potentially destructive command: $pattern"
        # Don't block, just warn - the system will handle user confirmation
    fi
done

exit 0
