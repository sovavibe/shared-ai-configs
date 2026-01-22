#!/usr/bin/env bash
# Get discussions from GitLab MR (includes discussion_id for replies)
# Usage: ./mr-discussions.sh <MR_ID> [--unresolved]
#
# Environment:
#   GITLAB_REPO - Repository in format "group/project"
#   GITLAB_HOST - GitLab hostname (default: gitlab.com)
#
# Output: JSON array of discussions
#
# Examples:
#   ./mr-discussions.sh 321
#   ./mr-discussions.sh 321 --unresolved
#   ./mr-discussions.sh 321 | jq '.[].id'  # Get discussion IDs

set -euo pipefail

MR_ID="${1:-}"
FILTER="${2:-}"

if [[ -z "$MR_ID" ]]; then
  echo "Usage: $0 <MR_ID> [--unresolved]" >&2
  exit 1
fi

# Get repo path from env or git remote
# Handles both "group/project" format and full URLs
get_repo_path() {
  local repo="${GITLAB_REPO:-}"

  if [[ -z "$repo" ]]; then
    # Try to get from git remote
    repo=$(git remote get-url origin 2>/dev/null || echo "")
  fi

  if [[ -z "$repo" ]]; then
    echo "Error: GITLAB_REPO not set and not in a git repository" >&2
    exit 1
  fi

  # Extract path from URL if needed (handles https:// and git@ formats)
  echo "$repo" | sed -E 's|^https?://[^/]+/||; s|^git@[^:]+:||; s|\.git$||'
}

REPO_PATH=$(get_repo_path)
HOST="${GITLAB_HOST:-gitlab.com}"

# URL-encode the project path
ENCODED_REPO=$(echo "$REPO_PATH" | sed 's|/|%2F|g')

# Fetch all discussions with pagination
PAGE=1
PER_PAGE=100
ALL_DISCUSSIONS="[]"

while true; do
  RESPONSE=$(glab api "projects/${ENCODED_REPO}/merge_requests/${MR_ID}/discussions?per_page=${PER_PAGE}&page=${PAGE}" --hostname "$HOST" 2>/dev/null || echo "[]")

  if [[ "$RESPONSE" == "[]" ]] || [[ -z "$RESPONSE" ]]; then
    break
  fi

  ALL_DISCUSSIONS=$(echo "$ALL_DISCUSSIONS" "$RESPONSE" | jq -s 'add')

  COUNT=$(echo "$RESPONSE" | jq 'length')
  if [[ "$COUNT" -lt "$PER_PAGE" ]]; then
    break
  fi

  PAGE=$((PAGE + 1))
done

# Apply filter if requested
if [[ "$FILTER" == "--unresolved" ]]; then
  # Filter for unresolved discussions (resolvable=true AND resolved!=true)
  echo "$ALL_DISCUSSIONS" | jq '[.[] | select(.notes[0].resolvable == true and .notes[0].resolved != true)]'
else
  echo "$ALL_DISCUSSIONS"
fi
