---
description: 'Reply to GitLab MR discussion thread'
---

Reply to discussion in MR #{{mr}}:

## Usage

```bash
# Using wrapper script
./scripts/gitlab-cli/mr-reply.sh {{mr}} <DISCUSSION_ID> -m "Reply text"

# Using glab api directly
glab api -X POST "projects/:fullpath/merge_requests/{{mr}}/discussions/<DISCUSSION_ID>/notes" \
  -f body="Reply text"
```

## Options

- First arg: MR number (IID) [required]
- Second arg: Discussion thread ID [required]
- `-m, --message`: Reply body (use quotes for multi-line) [required]

## Example

```bash
./scripts/gitlab-cli/mr-reply.sh 321 "a2d3e4f5g6h" -m "Thanks for feedback! Fixed in commit abc123."
```

## Finding Discussion ID

```bash
# Get all unresolved discussion IDs
./scripts/gitlab-cli/mr-discussions.sh {{mr}} --unresolved | jq -r '.[].id'
```

## Follow

- `@gitlab-get-comments.md` — Get unresolved comments
- `@beads` — Core Beads workflow
