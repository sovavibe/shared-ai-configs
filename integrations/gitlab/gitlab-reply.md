# /gitlab-reply - Reply to GitLab MR Discussion

> **Purpose:** Add a reply to a GitLab discussion thread in a Merge Request.
>
> Use this to respond to code review feedback and continue discussions.

Reply to discussion in MR #$ARGUMENTS:

## Usage

```bash
npm run gitlab:mr:reply \
  --mr <MR_NUMBER> \
  --discussion-id <DISCUSSION_ID> \
  --body "Reply text"
```

## Options

- `-m, --mr` - MR number (IID) [required]
- `-d, --discussion-id` - Discussion thread ID [required]
- `-b, --body` - Reply body text (use quotes for multi-line) [required]

## Finding Discussion ID

Use `/gitlab-get-comments` to get discussion IDs:

```bash
npm run gitlab:mr:get-unresolved -- --mr 321
```

Each comment in the output has a `discussion_id` field.

## Examples

**Simple reply:**
```bash
npm run gitlab:mr:reply \
  --mr 321 \
  --discussion-id "a2d3e4f5g6h" \
  --body "Thanks for the feedback! I'll fix this."
```

**Multi-line reply:**
```bash
npm run gitlab:mr:reply \
  --mr 321 \
  --discussion-id "a2d3e4f5g6h" \
  --body "I've addressed your concerns:

- Fixed the type definitions
- Updated the tests
- Added documentation

Please review again."
```

## Workflow

1. **Get comments:**
   ```bash
   npm run gitlab:mr:get-unresolved -- --mr 321 > comments.json
   ```

2. **Extract discussion_id:**
   ```bash
   cat comments.json | jq '.[0].discussion_id'
   ```

3. **Reply:**
   ```bash
   npm run gitlab:mr:reply --mr 321 --discussion-id "<ID>" --body "Response"
   ```

## Tips

- **Multi-line text**: Use escape sequences or quotes
- **Formatting**: GitLab supports Markdown in replies
- **Mentions**: Use @username to mention team members
- **Resolution**: After replying, you can mark discussion as resolved in GitLab UI

## Related Commands

- `/gitlab-get-comments` — Get discussion IDs
- `/gitlab-process-comments` — Process multiple comments systematically
