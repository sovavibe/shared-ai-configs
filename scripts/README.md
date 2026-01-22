# AI Automation Scripts

Scripts for AI-assisted development workflows. These scripts can be used by AI agents (Claude Code, Cursor) or manually.

## Structure

```
scripts/
├── gitlab/           # GitLab MR automation (for old GitLab without MCP)
│   ├── core/                 # API client, MR operations
│   ├── comments/             # Comment management
│   └── add-mr-comment.ts     # Add comment to MR
├── mcp-doctor/       # MCP server diagnostics
│   ├── checks/               # Individual health checks
│   ├── utils/                # Logging utilities
│   └── summary.ts            # Generate health report
└── shared/           # Shared utilities
    ├── logger.ts             # Logging with colors
    ├── config.ts             # Configuration loader
    ├── errors.ts             # Error handling
    └── gitlab-client.ts      # GitLab API client
```

## Usage

### GitLab Scripts (when MCP not available)

```bash
# Get unresolved MR comments
npx tsx scripts/gitlab/comments/get-unresolved.ts --mr 123

# Reply to a thread
npx tsx scripts/gitlab/comments/reply-to-thread.ts --mr 123 --thread abc --message "Fixed"

# Update MR description
npx tsx scripts/gitlab/core/update-mr-description.ts --mr 123 --description "New desc"
```

### MCP Doctor

```bash
# Run all MCP health checks
npx tsx scripts/mcp-doctor/summary.ts
```

## Environment Variables

Scripts read from `.env.aiproject`:

- `GITLAB_TOKEN` - GitLab personal access token
- `GITLAB_URL` - GitLab instance URL
- `GITLAB_PROJECT_ID` - Project ID (numeric)

## Migration Note

When GitLab MCP becomes available for your GitLab version, prefer using MCP tools over these scripts. The scripts are provided for backwards compatibility with older GitLab instances.
