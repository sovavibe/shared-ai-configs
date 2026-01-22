---
description: 'Reply to GitLab MR discussion thread'
---

Reply to discussion in MR #{{mr}}:

## Usage

```bash
npm run gitlab:mr:reply \
  --mr {{mr}} \
  --discussion-id <DISCUSSION_ID> \
  --body "Reply text"
```

## Options

- `-m, --mr` - MR number (IID) [required]
- `-d, --discussion-id` - Discussion thread ID [required]
- `-b, --body` - Reply body (use quotes for multi-line) [required]

## Example

```bash
npm run gitlab:mr:reply \
  --mr 321 \
  --discussion-id "a2d3e4f5g6h" \
  --body "Thanks for feedback! I'll fix this."
```

## Finding Discussion ID

```bash
npm run gitlab:mr:get-unresolved -- --mr {{mr}}
```

## Follow

- `@gitlab-get-comments.md` — Get unresolved comments
- `@005-beads.mdc` — Core Beads workflow
