# /gitlab-get-comments - Get GitLab MR Comments

> **Purpose:** Fetch unresolved or inline comments from a GitLab Merge Request.
>
> Use this to review all pending feedback on your MR before replying or making changes.

Get unresolved comments from MR #$ARGUMENTS:

## Usage

```bash
# Get all unresolved comments (default)
npm run gitlab:mr:get-unresolved -- --mr <MR_NUMBER>

# Get only inline comments (DiffNote)
npm run gitlab:mr:get-unresolved -- --mr <MR_NUMBER> --inline-only

# Get only open comments
npm run gitlab:mr:get-unresolved -- --mr <MR_NUMBER> --open-only

# Get all comments (ignore filters)
npm run gitlab:mr:get-unresolved -- --mr <MR_NUMBER> --all
```

## Options

- `-m, --mr` - MR number (IID) [required]
- `-o, --open-only` - Show only unresolved comments [default: true]
- `-i, --inline-only` - Show only inline comments (DiffNote)
- `-a, --all` - Show all comments (ignore filters)

## Output Format

Returns JSON array of notes with discussion IDs:

```json
[
  {
    "id": 123,
    "type": "DiffNote",
    "body": "Comment text",
    "discussion_id": "a2d3e4f5g6h",
    "position": {
      "new_path": "src/app.tsx",
      "new_line": 42
    },
    "author": { "username": "reviewer" },
    "resolvable": true,
    "resolved": false,
    "created_at": "2026-01-21T10:30:00Z"
  }
]
```

## Key Points

- **discussion_id** is required for replies (use with `/gitlab-reply`)
- Use with `/gitlab-process-comments` to handle multiple comments systematically
- Results include position information for inline comments

## Examples

**Review all feedback:**
```bash
npm run gitlab:mr:get-unresolved -- --mr 321
```

**Get only code review comments:**
```bash
npm run gitlab:mr:get-unresolved -- --mr 321 --inline-only
```

**Pipe to jq for processing:**
```bash
npm run gitlab:mr:get-unresolved -- --mr 321 | jq '.[].body'
```

## Related Commands

- `/gitlab-view-mr` — View full MR details
- `/gitlab-reply` — Reply to discussion
- `/gitlab-process-comments` — Process MR comments workflow
