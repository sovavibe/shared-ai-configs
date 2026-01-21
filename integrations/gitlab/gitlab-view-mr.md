# /gitlab-view-mr - View GitLab MR Details

> **Purpose:** Fetch detailed information about a Merge Request including title, branch, author, and status.
>
> Use this to understand MR context before reviewing code or making changes.

View detailed information about MR #$ARGUMENTS:

## Usage

```bash
npm run gitlab:mr:view -- --mr <MR_NUMBER>
```

## Output Format

Returns JSON with MR metadata:

```json
{
  "iid": 321,
  "title": "feat: add schedule timeline feature",
  "state": "opened",
  "author": {
    "username": "developer",
    "name": "Developer Name",
    "avatar_url": "https://..."
  },
  "source_branch": "feature/schedule-timeline",
  "target_branch": "develop",
  "created_at": "2026-01-20T15:00:00Z",
  "updated_at": "2026-01-21T10:30:00Z",
  "merged_at": null,
  "merged_by": null,
  "changes_count": "50+",
  "upvotes": 0,
  "downvotes": 0,
  "has_conflicts": false,
  "work_in_progress": false,
  "web_url": "https://gitlab.eurochem.ru/...",
  "diff_refs": {
    "base_sha": "abc123...",
    "head_sha": "def456...",
    "start_sha": "abc123..."
  }
}
```

## Processing Output with jq

**Get MR title:**
```bash
npm run gitlab:mr:view -- --mr 321 | jq -r '.title'
```

**Get author info:**
```bash
npm run gitlab:mr:view -- --mr 321 | jq '.author'
```

**Get branch info:**
```bash
npm run gitlab:mr:view -- --mr 321 | jq '{source: .source_branch, target: .target_branch}'
```

**Check if has conflicts:**
```bash
npm run gitlab:mr:view -- --mr 321 | jq '.has_conflicts'
```

## Key Information

- **iid** - MR number (same as --mr argument)
- **state** - Status: opened, merged, closed
- **source_branch** - Feature branch name
- **target_branch** - Destination branch (usually develop/main)
- **has_conflicts** - Boolean indicating merge conflicts
- **diff_refs** - SHA hashes for base, head, and start commits

## Related Commands

- `/gitlab-get-comments` — Get MR comments
- `/gitlab-process-comments` — Process MR comments workflow
