#!/usr/bin/env bash
# Get all notes/comments from GitLab MR
# Usage: ./mr-notes.sh <MR_ID>
#
# Environment:
#   GITLAB_REPO - Repository in format "group/project"
#   GITLAB_HOST - GitLab hostname (default: gitlab.com)
#
# Output: JSON array of notes
#
# Examples:
#   ./mr-notes.sh 321
#   ./mr-notes.sh 321 | jq '.[].body'

set -euo pipefail

MR_ID="${1:-}"

if [[ -z "$MR_ID" ]]; then
  echo "Usage: $0 <MR_ID>" >&2
  exit 1
fi

# Get repo path from env or git remote
# Handles both "group/project" format and full URLs
get_repo_path() {
  local repo="${GITLAB_REPO:-}"

  if [[ -z "$repo" ]]; then
    repo=$(git remote get-url origin 2>/dev/null || echo "")
  fi

  if [[ -z "$repo" ]]; then
    echo "Error: GITLAB_REPO not set and not in a git repository" >&2
    exit 1
  fi

  # Extract path from URL if needed
  echo "$repo" | sed -E 's|^https?://[^/]+/||; s|^git@[^:]+:||; s|\.git$||'
}

REPO_PATH=$(get_repo_path)
HOST="${GITLAB_HOST:-gitlab.com}"

# URL-encode the project path
ENCODED_REPO=$(echo "$REPO_PATH" | sed 's|/|%2F|g')

# Fetch all notes with pagination
PAGE=1
PER_PAGE=100
ALL_NOTES="[]"

while true; do
  RESPONSE=$(glab api "projects/${ENCODED_REPO}/merge_requests/${MR_ID}/notes?per_page=${PER_PAGE}&page=${PAGE}" --hostname "$HOST" 2>/dev/null || echo "[]")

  # Check if response is empty array
  if [[ "$RESPONSE" == "[]" ]] || [[ -z "$RESPONSE" ]]; then
    break
  fi

  # Merge arrays
  ALL_NOTES=$(echo "$ALL_NOTES" "$RESPONSE" | jq -s 'add')

  # Check if we got less than per_page (last page)
  COUNT=$(echo "$RESPONSE" | jq 'length')
  if [[ "$COUNT" -lt "$PER_PAGE" ]]; then
    break
  fi

  PAGE=$((PAGE + 1))
done

echo "$ALL_NOTES"
