#!/usr/bin/env bash
# Add inline comment to GitLab MR (on specific file/line)
# Usage: ./mr-inline-comment.sh <MR_ID> --file <PATH> --line <N> --side <new|old> -m "message"
#
# Environment:
#   GITLAB_REPO - Repository in format "group/project"
#   GITLAB_HOST - GitLab hostname (default: gitlab.com)
#
# Examples:
#   ./mr-inline-comment.sh 321 --file src/app.tsx --line 42 --side new -m "Consider using useMemo here"
#   ./mr-inline-comment.sh 321 -f src/utils.ts -l 10 -s new -m "Missing error handling"

set -euo pipefail

MR_ID="${1:-}"
shift || true

if [[ -z "$MR_ID" ]]; then
  echo "Usage: $0 <MR_ID> --file <PATH> --line <N> --side <new|old> -m \"message\"" >&2
  exit 1
fi

# Parse arguments
FILE=""
LINE=""
SIDE="new"
MESSAGE=""

while [[ $# -gt 0 ]]; do
  case $1 in
    -f|--file)
      FILE="$2"
      shift 2
      ;;
    -l|--line)
      LINE="$2"
      shift 2
      ;;
    -s|--side)
      SIDE="$2"
      shift 2
      ;;
    -m|--message)
      MESSAGE="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

if [[ -z "$FILE" ]] || [[ -z "$LINE" ]] || [[ -z "$MESSAGE" ]]; then
  echo "Error: --file, --line, and -m are required" >&2
  exit 1
fi

# Get repo path from env or git remote
get_repo_path() {
  local repo="${GITLAB_REPO:-}"

  if [[ -z "$repo" ]]; then
    repo=$(git remote get-url origin 2>/dev/null || echo "")
  fi

  if [[ -z "$repo" ]]; then
    echo "Error: GITLAB_REPO not set and not in a git repository" >&2
    exit 1
  fi

  echo "$repo" | sed -E 's|^https?://[^/]+/||; s|^git@[^:]+:||; s|\.git$||'
}

REPO_PATH=$(get_repo_path)
HOST="${GITLAB_HOST:-gitlab.com}"

# URL-encode the project path
ENCODED_REPO=$(echo "$REPO_PATH" | sed 's|/|%2F|g')

# Get MR diff_refs for SHAs
MR_DATA=$(glab mr view "$MR_ID" -R "$REPO" --output json)
BASE_SHA=$(echo "$MR_DATA" | jq -r '.diff_refs.base_sha')
HEAD_SHA=$(echo "$MR_DATA" | jq -r '.diff_refs.head_sha')
START_SHA=$(echo "$MR_DATA" | jq -r '.diff_refs.start_sha')

# Build position JSON
if [[ "$SIDE" == "new" ]]; then
  POSITION_JSON=$(jq -n \
    --arg base "$BASE_SHA" \
    --arg head "$HEAD_SHA" \
    --arg start "$START_SHA" \
    --arg path "$FILE" \
    --argjson line "$LINE" \
    '{
      position_type: "text",
      base_sha: $base,
      head_sha: $head,
      start_sha: $start,
      new_path: $path,
      new_line: $line
    }')
else
  POSITION_JSON=$(jq -n \
    --arg base "$BASE_SHA" \
    --arg head "$HEAD_SHA" \
    --arg start "$START_SHA" \
    --arg path "$FILE" \
    --argjson line "$LINE" \
    '{
      position_type: "text",
      base_sha: $base,
      head_sha: $head,
      start_sha: $start,
      old_path: $path,
      old_line: $line
    }')
fi

# Create discussion with inline comment via API
PAYLOAD=$(jq -n \
  --arg body "$MESSAGE" \
  --argjson position "$POSITION_JSON" \
  '{body: $body, position: $position}')

glab api -X POST \
  "projects/${ENCODED_REPO}/merge_requests/${MR_ID}/discussions" \
  --hostname "$HOST" \
  --input - <<< "$PAYLOAD"

echo "Inline comment added to $FILE:$LINE"
