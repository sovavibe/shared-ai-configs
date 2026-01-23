# AI Automation Scripts

Scripts for AI-assisted development workflows. These scripts can be used by AI agents (Claude Code, Cursor) or manually.

## Structure

```
scripts/
├── gitlab-cli/       # GitLab MR automation (using glab CLI)
│   ├── mr-view.sh            # View MR details
│   ├── mr-diff.sh            # Get MR diff
│   ├── mr-notes.sh           # Get all notes
│   ├── mr-discussions.sh     # Get discussions (with IDs)
│   ├── mr-comment.sh         # Add MR comment
│   ├── mr-reply.sh           # Reply to discussion
│   ├── mr-inline-comment.sh  # Add inline comment
│   ├── mr-update.sh          # Update MR
│   └── README.md             # Detailed usage guide
├── mcp-doctor/       # MCP server diagnostics
│   ├── checks/               # Individual health checks
│   ├── utils/                # Logging utilities
│   └── summary.ts            # Generate health report
└── shared/           # Shared utilities
    ├── logger.ts             # Logging with colors
    ├── config.ts             # Configuration loader
    └── errors.ts             # Error handling
```

## Usage

### GitLab Scripts (using glab CLI)

```bash
# View MR details
./scripts/gitlab-cli/mr-view.sh 321 --json

# Get MR diff
./scripts/gitlab-cli/mr-diff.sh 321

# Get unresolved discussions
./scripts/gitlab-cli/mr-discussions.sh 321 --unresolved

# Reply to discussion
./scripts/gitlab-cli/mr-reply.sh 321 "discussion-id" -m "Fixed!"

# Add inline comment
./scripts/gitlab-cli/mr-inline-comment.sh 321 -f src/app.tsx -l 42 -s new -m "Consider..."

# Or use glab directly
glab mr view 321 --output json
glab mr diff 321
glab mr note 321 -m "Comment"
```

### MCP Doctor

```bash
# Run all MCP health checks
npx tsx scripts/mcp-doctor/summary.ts
```

## Prerequisites

- `glab` CLI installed (`brew install glab`)
- `jq` for JSON processing (`brew install jq`)
- Authenticated with `glab auth login`

## Environment Variables

For scripts that need explicit repo config:

```bash
export GITLAB_REPO="group/project"        # or full URL
export GITLAB_HOST="gitlab.example.com"   # default: gitlab.com
```

Scripts auto-detect repository from git remote if not set.

## Migration from TypeScript Scripts

The old TypeScript scripts using GitBeaker API have been replaced with shell scripts using `glab` CLI:

| Old (TypeScript)                                             | New (Shell)                                               |
| ------------------------------------------------------------ | --------------------------------------------------------- |
| `npx tsx scripts/gitlab/core/get-mr.ts --mr 321`             | `./scripts/gitlab-cli/mr-view.sh 321 --json`              |
| `npx tsx scripts/gitlab/comments/get-unresolved.ts --mr 321` | `./scripts/gitlab-cli/mr-discussions.sh 321 --unresolved` |
| `npx tsx scripts/gitlab/comments/reply-to-thread.ts ...`     | `./scripts/gitlab-cli/mr-reply.sh ...`                    |
