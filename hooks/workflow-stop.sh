#!/bin/bash
# workflow-stop.sh
# Stop hook for workflow loop integration with Beads
#
# This hook is called when Claude attempts to end a session.
# It checks if there are remaining open beads and continues the loop if so.
#
# Environment variables:
#   LOOP_EPIC_ID    - Optional epic ID to filter tasks
#   LOOP_ENABLED    - Set to "1" to enable loop mode (default: disabled)
#   LOOP_MAX_ITER   - Maximum iterations (default: 50)
#
# Output format (JSON):
#   {"continue": false}  - Allow Claude to exit
#   {"continue": true, "reason": "..."}  - Continue the loop

set -euo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
LOOP_ENABLED="${LOOP_ENABLED:-0}"
LOOP_MAX_ITER="${LOOP_MAX_ITER:-50}"
ITER_FILE="${PROJECT_DIR}/.claude/.loop-iter-count"

# Export for beads-completion-check.sh
export LOOP_EPIC_ID="${LOOP_EPIC_ID:-}"

# If loop mode is not enabled, show reminders about session cleanup and hindsight retention
if [ "$LOOP_ENABLED" != "1" ]; then
  echo ""
  echo "╔═══════════════════════════════════════════════════════════╗"
  echo "║ 🚨 SESSION CLOSE PROTOCOL 🚨                             ║"
  echo "╠═══════════════════════════════════════════════════════════╣"
  echo "║ Before committing:                                        ║"
  echo "║ 1. npm run quality:gates                                  ║"
  echo "║ 2. Retain important decisions:                            ║"
  echo "║    mcp__hindsight-alice__retain \"Session summary: [...]\" ║"
  echo "║ 3. Export beads:                                          ║"
  echo "║    bd sync --flush-only                                   ║"
  echo "╚═══════════════════════════════════════════════════════════╝"
  echo ""
  exit 0
fi

# Track iteration count
ITER_COUNT=0
if [ -f "$ITER_FILE" ]; then
  ITER_COUNT=$(cat "$ITER_FILE")
fi
ITER_COUNT=$((ITER_COUNT + 1))
echo "$ITER_COUNT" > "$ITER_FILE"

# Check max iterations
if [ "$ITER_COUNT" -ge "$LOOP_MAX_ITER" ]; then
  rm -f "$ITER_FILE"
  echo '{"continue": false, "reason": "Max iterations reached ('$ITER_COUNT'/'$LOOP_MAX_ITER')"}'
  exit 0
fi

# Run beads completion check
cd "$PROJECT_DIR"
COMPLETION_RESULT=$("$PROJECT_DIR/.claude/hooks/beads-completion-check.sh" 2>/dev/null) || true

if echo "$COMPLETION_RESULT" | grep -q "ALL_BEADS_CLOSED"; then
  # All done - allow exit
  rm -f "$ITER_FILE"
  echo '{"continue": false, "reason": "All beads closed"}'
  exit 0
fi

# Extract remaining count
REMAINING=$(echo "$COMPLETION_RESULT" | grep -oE '[0-9]+' | head -1 || echo "?")

# Continue the loop
echo '{"continue": true, "reason": "Beads remaining: '$REMAINING' (iteration '$ITER_COUNT'/'$LOOP_MAX_ITER')"}'
exit 0
