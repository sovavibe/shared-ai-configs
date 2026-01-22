#!/usr/bin/env bash
# Get GitLab MR diff
# Usage: ./mr-diff.sh <MR_ID>
#
# Environment:
#   GITLAB_REPO - Repository in format "group/project" or full URL
#
# Examples:
#   ./mr-diff.sh 321
#   ./mr-diff.sh 321 > /tmp/mr-diff.txt

set -euo pipefail

MR_ID="${1:-}"

if [[ -z "$MR_ID" ]]; then
  echo "Usage: $0 <MR_ID>" >&2
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

glab mr diff "$MR_ID" -R "$REPO"
