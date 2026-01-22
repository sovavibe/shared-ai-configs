---
description: 'View GitLab MR details'
---

View detailed information about MR #{{mr}}:

## Usage

```bash
npm run gitlab:mr:view -- --mr {{mr}}
```

## Output

MR details as JSON:

```json
{
  "iid": 321,
  "title": "MR Title",
  "state": "opened",
  "source_branch": "feature/branch",
  "target_branch": "develop",
  "changes_count": "100+",
  "has_conflicts": false
}
```

## jq Examples

```bash
# Get title
npm run gitlab:mr:view -- --mr 321 | jq -r '.title'

# Get author
npm run gitlab:mr:view -- --mr 321 | jq '.author'

# Get SHA hashes
npm run gitlab:mr:view -- --mr 321 | jq '.diff_refs'
```

## Follow

- `@gitlab-process-comments.md` — Process MR comments
- @005-beads.mdc — Core Beads workflow
