---
description: 'Get unresolved comments from GitLab MR'
---

Get unresolved comments from MR #{{mr}}:

## Usage

```bash
# All discussions (with discussion_id for replies)
./scripts/gitlab-cli/mr-discussions.sh {{mr}}

# Only unresolved discussions
./scripts/gitlab-cli/mr-discussions.sh {{mr}} --unresolved

# All notes (without discussion_id)
./scripts/gitlab-cli/mr-notes.sh {{mr}}

# Using glab api directly
glab api "projects/:fullpath/merge_requests/{{mr}}/discussions"
```

## Output

JSON array of discussions:

```json
[
  {
    "id": "abc123def",
    "notes": [
      {
        "id": 123,
        "type": "DiffNote",
        "body": "Comment text",
        "position": {
          "new_path": "src/app.tsx",
          "new_line": 42
        },
        "author": { "username": "user" },
        "resolvable": true,
        "resolved": false
      }
    ]
  }
]
```

> **NOTE**: Use `discussion_id` (e.g., "abc123def") for replies with mr-reply.sh script.

## jq Examples

```bash
# Get unresolved discussion IDs
./scripts/gitlab-cli/mr-discussions.sh {{mr}} --unresolved | jq -r '.[].id'

# Get file paths with unresolved comments
./scripts/gitlab-cli/mr-discussions.sh {{mr}} --unresolved | jq -r '.[].notes[0].position.new_path'

# Count unresolved discussions
./scripts/gitlab-cli/mr-discussions.sh {{mr}} --unresolved | jq 'length'
```

## Follow

- `@gitlab-view-mr.md` — View MR details
- `@gitlab-reply.md` — Reply to discussion
- `@gitlab-process-comments.md` — Process MR comments workflow
- @beads — Core Beads workflow
