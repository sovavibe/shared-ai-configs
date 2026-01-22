---
description: 'View GitLab MR details'
---

View detailed information about MR #{{mr}}:

## Usage

```bash
# Using glab CLI directly
glab mr view {{mr}} --output json

# Or using wrapper script
./scripts/gitlab-cli/mr-view.sh {{mr}} --json
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
glab mr view {{mr}} --output json | jq -r '.title'

# Get author
glab mr view {{mr}} --output json | jq '.author'

# Get SHA hashes
glab mr view {{mr}} --output json | jq '.diff_refs'

# Get MR diff
glab mr diff {{mr}}
```

## Follow

- `@gitlab-process-comments.md` — Process MR comments
- @beads — Core Beads workflow
