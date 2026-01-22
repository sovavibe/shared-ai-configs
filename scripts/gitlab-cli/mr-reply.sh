#!/usr/bin/env bash
# Reply to GitLab MR discussion thread
# Usage: ./mr-reply.sh <MR_ID> <DISCUSSION_ID> -m "message"
#
# Environment:
#   GITLAB_REPO - Repository in format "group/project"
#   GITLAB_HOST - GitLab hostname (default: gitlab.com)
#
# Examples:
#   ./mr-reply.sh 321 abc123def -m "Fixed in commit xyz"
#   ./mr-reply.sh 321 abc123def -m "Done!"

set -euo pipefail

MR_ID="${1:-}"
DISCUSSION_ID="${2:-}"
shift 2 || true

if [[ -z "$MR_ID" ]] || [[ -z "$DISCUSSION_ID" ]]; then
  echo "Usage: $0 <MR_ID> <DISCUSSION_ID> -m \"message\"" >&2
  exit 1
fi

# Parse message from args
MESSAGE=""
while [[ $# -gt 0 ]]; do
  case $1 in
    -m|--message)
      MESSAGE="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

if [[ -z "$MESSAGE" ]]; then
  echo "Error: Message is required (-m \"message\")" >&2
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

# Create reply via API
glab api -X POST \
  "projects/${ENCODED_REPO}/merge_requests/${MR_ID}/discussions/${DISCUSSION_ID}/notes" \
  --hostname "$HOST" \
  -f body="$MESSAGE"

echo "Reply added to discussion $DISCUSSION_ID"
