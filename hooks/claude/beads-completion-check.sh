#!/bin/bash
# beads-completion-check.sh
# Checks if there are open beads/tasks remaining
#
# Usage:
#   LOOP_EPIC_ID=PROJ-xxx ./beads-completion-check.sh  # Check specific epic children
#   ./beads-completion-check.sh                         # Check all open issues
#
# Exit codes:
#   0 - All beads closed (outputs ALL_BEADS_CLOSED)
#   1 - Beads remaining (outputs BEADS_REMAINING: N)

set -euo pipefail

EPIC_ID="${LOOP_EPIC_ID:-}"
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"

cd "$PROJECT_DIR"

# Count open issues
if [ -n "$EPIC_ID" ]; then
  # With epic - check children of this epic
  # Note: bd list --parent only works for direct parent-child relationships
  # If your epic uses labels, adjust the filter accordingly
  OPEN_COUNT=$(bd list --parent="$EPIC_ID" --status=open -n 0 2>/dev/null | wc -l | tr -d ' ')

  # If no children found, fall back to label-based filtering
  if [ "$OPEN_COUNT" -eq 0 ]; then
    OPEN_COUNT=$(bd list --label="epic:$EPIC_ID" --status=open -n 0 2>/dev/null | wc -l | tr -d ' ')
  fi
else
  # Without epic - check all open issues
  OPEN_COUNT=$(bd list --status=open -n 0 2>/dev/null | wc -l | tr -d ' ')
fi

if [ "$OPEN_COUNT" -eq 0 ]; then
  echo "ALL_BEADS_CLOSED"
  exit 0
else
  echo "BEADS_REMAINING: $OPEN_COUNT"
  exit 1
fi
