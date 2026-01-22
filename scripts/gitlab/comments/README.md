# GitLab Comments Scripts

This directory contains scripts for processing GitLab MR comments and notes.

## Available Scripts

### `get-unresolved.ts`

Get unresolved inline comments (Discussions) from GitLab MR.

**Usage:**

```bash
npm run gitlab:mr:get-unresolved -- --mr 320
npm run gitlab:mr:get-unresolved -- --mr 320 --inline-only
npm run gitlab:mr:get-unresolved -- --mr 320 --open-only
```

**Options:**

- `--mr, -m`: Merge Request number (required)
- `--open-only, -o`: Show only unresolved (open) comments (default: true)
- `--inline-only, -i`: Show only inline comments (DiffNote) (default: true)
- `--all, -a`: Show all comments (ignore filters)

**Output:** JSON array of unresolved discussions with inline comments.

### `get-all-notes.ts` ⭐ NEW

Get ALL notes from GitLab MR, including:

- General MR comments (type: null, resolvable: false)
- Inline discussion comments (type: DiffNote)

**Usage:**

```bash
npm run gitlab:mr:get-all-notes -- --mr 321
npm run gitlab:mr:get-all-notes -- --mr 321 --open-only
```

**Options:**

- `--mr, -m`: Merge Request number (required)
- `--open-only, -o`: Show only unresolved notes (default: false)

**Output:** JSON array of all notes (excludes system notes).

**Note:** This script fetches notes via GitLab API directly, not via GitBeaker discussions.

### `reply-to-thread.ts`

Reply to an inline discussion thread in GitLab MR.

**Usage:**

```bash
npm run gitlab:mr:reply -- --mr 320 --discussion-id 123 --body "Response text"
```

**Options:**

- `--mr, -m`: Merge Request number (required)
- `--discussion-id, -d`: Discussion ID (required)
- `--body, -b`: Reply body (required)

### `add-note.ts` ⭐ NEW

Add a general note (comment) to GitLab MR.

**Usage:**

```bash
npm run gitlab:mr:add-note -- --mr 320 --body "General comment"
npm run gitlab:mr:add-note -- --mr 320 --body "Response" --reply-to 157549
```

**Options:**

- `--mr, -m`: Merge Request number (required)
- `--body, -b`: Note body (required)
- `--reply-to, -r`: Note ID to reply to (optional)

**Use cases:**

- Respond to general MR comments (not inline)
- Add clarification questions
- Provide general feedback

## Comment Types

### Inline Comments (DiffNote)

- **Type:** `DiffNote`
- **Resolvable:** `true`
- **Has position:** Yes (file, line, diff refs)
- **Processing:** Use `get-unresolved.ts` + `reply-to-thread.ts`
- **Example:** Line-specific code review comment

### General MR Notes

- **Type:** `null`
- **Resolvable:** `false`
- **Has position:** No
- **Processing:** Use `get-all-notes.ts` + `add-note.ts`
- **Example:** Overall MR feedback, questions, general suggestions

## Workflow Integration

### Inline Comments Workflow

1. Fetch unresolved comments:

   ```bash
   npm run gitlab:mr:get-unresolved -- --mr 321
   ```

2. Create Jira tasks for each comment

3. Process each task:

   - Analyze code
   - Implement fix
   - Verify with lint/build/test

4. Reply to GitLab:

   ```bash
   npm run gitlab:mr:reply -- --mr 321 --discussion-id 123 --body "Fixed..."
   ```

5. Close Jira task

### General Comments Workflow

1. Fetch all notes:

   ```bash
   npm run gitlab:mr:get-all-notes -- --mr 321
   ```

2. Filter for general comments (type: null, resolvable: false)

3. Analyze and decompose:

   - Single actionable item → Create Jira task
   - Multiple related items → Create Epic with subtasks
   - General feedback → Reply directly (no Jira task)

4. Reply to GitLab (if needed):

   ```bash
   npm run gitlab:mr:add-note -- --mr 321 --body "Analysis completed..."
   ```

## Example: Processing General Comment

```bash
# 1. Get all notes
npm run gitlab:mr:get-all-notes -- --mr 321

# 2. Find general comment (type: null)
# Output: { "id": 157549, "type": null, "body": "...", "resolvable": false }

# 3. Analyze and decompose into tasks
# Example decomposition:
# - VP-XXX: Check Makefile structure
# - VP-YYY: Investigate duplicate loggers
# - VP-ZZZ: Reduce schedule-fixtures.ts complexity

# 4. Reply with decomposition
npm run gitlab:mr:add-note -- --mr 321 --reply-to 157549 --body "✅ Analysis completed..."

# 5. Process each Jira task separately
```

## API Reference

See:

- [GitLab API - Merge Request Notes](https://docs.gitlab.com/ee/api/merge_requests.html#list-merge-request-notes)
- [GitLab API - Merge Request Discussions](https://docs.gitlab.com/ee/api/merge_requests.html#list-merge-request-discussions)

## Related Documentation

- `scripts/gitlab/core/api-client.ts` - Centralized GitLab API client
- `scripts/gitlab/comments/get-unresolved.ts` - Source code
- `scripts/gitlab/comments/get-all-notes.ts` - Source code
- `scripts/gitlab/comments/reply-to-thread.ts` - Source code
- `scripts/gitlab/comments/add-note.ts` - Source code
