---
description: 'Get unresolved comments from GitLab MR'
---

Get unresolved comments from MR #{{mr}}:

## Usage

```bash
# All unresolved (default)
npm run gitlab:mr:get-unresolved -- --mr {{mr}}

# Only inline comments (DiffNote)
npm run gitlab:mr:get-unresolved -- --mr {{mr}} --inline-only

# All comments (ignore filters)
npm run gitlab:mr:get-unresolved -- --mr {{mr}} --all
```

## Options

- `-m, --mr` - MR number (IID) [required]
- `-o, --open-only` - Show only unresolved comments [default: true]
- `-i, --inline-only` - Show only inline comments (DiffNote) [default: true]
- `-a, --all` - Show all comments (ignore filters) [default: false]

## Output

JSON array of notes (NOT wrapped in object):

```json
[
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
```

> **NOTE**: As of 2026-01-19, this script uses Discussions API and DOES return `discussion_id`.
> You can directly use the `discussion_id` field for replies with `reply-to-thread.ts`.

## Follow

- `@gitlab-view-mr.md` — View MR details
- `@gitlab-reply.md` — Reply to discussion
- `@gitlab-process-comments.md` — Process MR comments workflow
- @beads — Core Beads workflow
