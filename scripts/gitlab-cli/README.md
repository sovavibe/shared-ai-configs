# GitLab CLI Scripts

Shell scripts wrapping `glab` CLI for GitLab MR operations.

## Prerequisites

- `glab` CLI installed (`brew install glab` or [install guide](https://gitlab.com/gitlab-org/cli#installation))
- `jq` for JSON processing (`brew install jq`)
- Authenticated with `glab auth login`

## Configuration

Scripts auto-detect repository from git remote. Override with:

```bash
export GITLAB_REPO="group/project"
export GITLAB_HOST="gitlab.example.com"  # default: gitlab.com
```

## Scripts

| Script | Description | Usage |
|--------|-------------|-------|
| `mr-view.sh` | View MR details | `./mr-view.sh 321 [--json]` |
| `mr-diff.sh` | Get MR diff | `./mr-diff.sh 321` |
| `mr-notes.sh` | Get all MR notes | `./mr-notes.sh 321` |
| `mr-discussions.sh` | Get discussions (with IDs) | `./mr-discussions.sh 321 [--unresolved]` |
| `mr-comment.sh` | Add MR comment | `./mr-comment.sh 321 -m "message"` |
| `mr-reply.sh` | Reply to discussion | `./mr-reply.sh 321 <DISC_ID> -m "message"` |
| `mr-inline-comment.sh` | Add inline comment | `./mr-inline-comment.sh 321 -f file.ts -l 42 -s new -m "message"` |
| `mr-update.sh` | Update MR | `./mr-update.sh 321 --title "..." --description "..."` |

## Examples

### View MR as JSON

```bash
./mr-view.sh 321 --json | jq '.title, .state'
```

### Get unresolved discussions

```bash
./mr-discussions.sh 321 --unresolved | jq '.[].id'
```

### Reply to discussion

```bash
# First get discussion ID
DISC_ID=$(./mr-discussions.sh 321 --unresolved | jq -r '.[0].id')

# Then reply
./mr-reply.sh 321 "$DISC_ID" -m "Fixed in commit abc123"
```

### Add inline comment

```bash
./mr-inline-comment.sh 321 \
  --file src/components/Button.tsx \
  --line 42 \
  --side new \
  -m "Consider extracting this to a custom hook"
```

## Migration from TypeScript Scripts

| Old Script | New Script |
|-----------|------------|
| `npx tsx scripts/gitlab/core/get-mr.ts --mr 321` | `./mr-view.sh 321 --json` |
| `npx tsx scripts/gitlab/core/get-changes.ts --mr 321` | `./mr-diff.sh 321` |
| `npx tsx scripts/gitlab/comments/get-all-notes.ts --mr 321` | `./mr-notes.sh 321` |
| `npx tsx scripts/gitlab/comments/get-unresolved.ts --mr 321 --open-only` | `./mr-discussions.sh 321 --unresolved` |
| `npx tsx scripts/gitlab/comments/reply-to-thread.ts --mr 321 --discussion-id X --body "msg"` | `./mr-reply.sh 321 X -m "msg"` |
| `npx tsx scripts/gitlab/core/inline-comment.ts ...` | `./mr-inline-comment.sh ...` |
