#!/usr/bin/env bash
# View GitLab MR details
# Usage: ./mr-view.sh <MR_ID> [--json]
#
# Environment:
#   GITLAB_REPO - Repository in format "group/project" or full URL
#                 Default: uses git remote origin
#
# Examples:
#   ./mr-view.sh 321
#   ./mr-view.sh 321 --json
#   GITLAB_REPO="customer-portal/Front" ./mr-view.sh 321

set -euo pipefail

MR_ID="${1:-}"
OUTPUT_FORMAT="${2:-}"

if [[ -z "$MR_ID" ]]; then
  echo "Usage: $0 <MR_ID> [--json]" >&2
  exit 1
fi

# Get repo from env or git remote
get_repo() {
  if [[ -n "${GITLAB_REPO:-}" ]]; then
    echo "$GITLAB_REPO"
  else
    # Try to get from git remote
    local remote_url
    remote_url=$(git remote get-url origin 2>/dev/null || echo "")
    if [[ -n "$remote_url" ]]; then
      # Extract path from URL (handles both https and ssh)
      echo "$remote_url" | sed -E 's|.*[:/]([^/]+/[^/]+)(\.git)?$|\1|'
    else
      echo "Error: GITLAB_REPO not set and not in a git repository" >&2
      exit 1
    fi
  fi
}

REPO=$(get_repo)

# Build glab command
if [[ "$OUTPUT_FORMAT" == "--json" ]]; then
  glab mr view "$MR_ID" -R "$REPO" --output json
else
  glab mr view "$MR_ID" -R "$REPO"
fi
