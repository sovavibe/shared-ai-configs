# Core GitLab Scripts

Minimal scripts for AI-first code review workflow.

## Scripts

- `get-mr.ts`: Get MR details (target branch, SHAs)
- `get-changes.ts`: Get MR changes (file list, diffs)
- `inline-comment.ts`: Create inline comment in MR

## Usage

AI workflows call these scripts when GitLab MCP is unavailable.

### Get MR Info

```bash
npm run gitlab:mr:get-info -- --mr <MR_ID>
```

**Output**: MR details including:

- Title, description
- Source and target branches
- Author, reviewers
- SHAs (base, start, head)

### Get MR Changes

```bash
npm run gitlab:mr:get-changes -- --mr <MR_ID>
```

**Output**: MR changes including:

- Changed files list
- Line counts (+/-)
- Diff content

### Create Inline Comment

```bash
npm run gitlab:inline-comment \
  --mr <MR_ID> \
  --file <FILE_PATH> \
  --line <LINE_NUMBER> \
  --side new \
  --body "<COMMENT_BODY>"
```

**Options**:

- `--mr`: MR ID (required)
- `--file`: File path (required)
- `--line`: Line number (required)
- `--side`: Side (new/old, default: new)
- `--body`: Comment body (required)
