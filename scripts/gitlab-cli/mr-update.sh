#!/usr/bin/env bash
# Update GitLab MR (description, title, etc.)
# Usage: ./mr-update.sh <MR_ID> [--title "New title"] [--description "New description"]
#
# Environment:
#   GITLAB_REPO - Repository in format "group/project" or full URL
#
# Examples:
#   ./mr-update.sh 321 --title "New title"
#   ./mr-update.sh 321 --description "## Summary\n\nUpdated description"
#   ./mr-update.sh 321 --title "Title" --description "Description"

set -euo pipefail

MR_ID="${1:-}"
shift || true

if [[ -z "$MR_ID" ]]; then
  echo "Usage: $0 <MR_ID> [--title \"...\"] [--description \"...\"]" >&2
  exit 1
fi

# Get repo from env or git remote
get_repo() {
  if [[ -n "${GITLAB_REPO:-}" ]]; then
    echo "$GITLAB_REPO"
  else
    local remote_url
    remote_url=$(git remote get-url origin 2>/dev/null || echo "")
    if [[ -n "$remote_url" ]]; then
      echo "$remote_url" | sed -E 's|.*[:/]([^/]+/[^/]+)(\.git)?$|\1|'
    else
      echo "Error: GITLAB_REPO not set and not in a git repository" >&2
      exit 1
    fi
  fi
}

REPO=$(get_repo)

glab mr update "$MR_ID" -R "$REPO" "$@"
