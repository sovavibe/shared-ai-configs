# Jira MCP Integration (mcp-atlassian)

> Integration mode: MCP (`mcp-atlassian` via uvx)

## Installation

```bash
# Install uv (Python package manager)
pip install uv
# OR on macOS
brew install uv

# Test mcp-atlassian
uvx mcp-atlassian --help
```

## Configuration

**`.ai-project.yaml`:**

```yaml
services:
  task_tracking:
    type: 'jira'
    integration_mode: 'mcp' # Uses mcp-atlassian
    key_prefix: 'VP-'
    jira:
      instance: 'your-company.atlassian.net'
      board_id: 123
```

**Environment (`.env.development.local`):**

```bash
JIRA_URL=https://your-company.atlassian.net
JIRA_USERNAME=user@company.com
JIRA_API_TOKEN=ATATT3x...

# Optional: Confluence
CONFLUENCE_URL=https://your-company.atlassian.net/wiki
CONFLUENCE_USERNAME=user@company.com
CONFLUENCE_API_TOKEN=ATATT3x...
```

## MCP Server Configuration

Automatically generated in `.claude/mcp.json` when `integration_mode: 'mcp'`:

```json
{
  "mcpServers": {
    "mcp-atlassian": {
      "type": "stdio",
      "command": "uvx",
      "args": ["mcp-atlassian"],
      "env": {
        "JIRA_URL": "${env:JIRA_URL}",
        "JIRA_USERNAME": "${env:JIRA_USERNAME}",
        "JIRA_API_TOKEN": "${env:JIRA_API_TOKEN}"
      }
    }
  }
}
```

## Available MCP Tools

### Jira Tools

| Tool                    | Description              |
| ----------------------- | ------------------------ |
| `jira_search`           | Search issues using JQL  |
| `jira_get_issue`        | Get single issue details |
| `jira_create_issue`     | Create new issue         |
| `jira_update_issue`     | Update existing issue    |
| `jira_add_comment`      | Add comment to issue     |
| `jira_transition_issue` | Change issue status      |

### Confluence Tools (Bonus)

| Tool                     | Description      |
| ------------------------ | ---------------- |
| `confluence_search`      | Search pages     |
| `confluence_get_page`    | Get page content |
| `confluence_create_page` | Create new page  |
| `confluence_update_page` | Update page      |

## Tool Usage Examples

### Search Issues (`jira_search`)

```typescript
CallMcpTool({
  server: 'mcp-atlassian',
  toolName: 'jira_search',
  arguments: {
    jql: 'project = VP AND status != Done ORDER BY updated DESC',
    limit: 50,
  },
});
```

### Get Issue (`jira_get_issue`)

```typescript
CallMcpTool({
  server: 'mcp-atlassian',
  toolName: 'jira_get_issue',
  arguments: {
    issue_key: 'VP-123',
  },
});
```

### Create Issue (`jira_create_issue`)

```typescript
CallMcpTool({
  server: 'mcp-atlassian',
  toolName: 'jira_create_issue',
  arguments: {
    project_key: 'VP',
    summary: '[MR-321] Code Review Round 1',
    issue_type: 'Task',
    description: `## Description
Code review task for MR-321

## Scope
- Review changed files
- Check type safety
- Verify tests`,
    labels: ['code-review', 'mr-321'],
    priority: 'High',
  },
});
```

### Update Issue (`jira_update_issue`)

```typescript
CallMcpTool({
  server: 'mcp-atlassian',
  toolName: 'jira_update_issue',
  arguments: {
    issue_key: 'VP-123',
    summary: 'Updated summary',
    description: 'Updated description',
  },
});
```

### Add Comment (`jira_add_comment`)

```typescript
CallMcpTool({
  server: 'mcp-atlassian',
  toolName: 'jira_add_comment',
  arguments: {
    issue_key: 'VP-123',
    body: `## Progress Update

Fixed the type safety issues:
- Added User interface
- Fixed useCallback dependencies

Files changed:
- src/widgets/UserProfile.tsx
- src/hooks/useUserData.ts`,
  },
});
```

### Transition Issue (`jira_transition_issue`)

```typescript
CallMcpTool({
  server: 'mcp-atlassian',
  toolName: 'jira_transition_issue',
  arguments: {
    issue_key: 'VP-123',
    transition_name: 'Done',
  },
});
```

## Comparison with CLI Mode

| Aspect              | MCP (`mcp-atlassian`) | CLI (`jira-cli`)         |
| ------------------- | --------------------- | ------------------------ |
| **Setup**           | Requires Python/uv    | Simple (`brew install`)  |
| **Speed**           | Faster (persistent)   | Each command is separate |
| **Output**          | Native JSON           | Requires `--raw` flag    |
| **Confluence**      | Included              | Not included             |
| **IDE Integration** | Native MCP tools      | Bash commands            |
| **Best for**        | IDE/AI workflows      | Scripts, CI/CD           |

## Troubleshooting

### MCP Server Not Starting

```bash
# Check uvx is installed
uvx --version

# Test mcp-atlassian directly
JIRA_URL=https://your-company.atlassian.net \
JIRA_USERNAME=user@company.com \
JIRA_API_TOKEN=your_token \
uvx mcp-atlassian

# Check environment variables
env | grep JIRA
```

### Authentication Failed

1. Verify API token at: <https://id.atlassian.com/manage-profile/security/api-tokens>
2. Check username matches Atlassian account email
3. Ensure JIRA_URL includes `https://` prefix

### Tool Not Found in IDE

1. Restart Claude Code / Cursor
2. Check `/mcp` for server status
3. Verify `.claude/mcp.json` contains `mcp-atlassian`

### Confluence Not Working

```bash
# Set Confluence-specific variables
CONFLUENCE_URL=https://your-company.atlassian.net/wiki
CONFLUENCE_USERNAME=user@company.com
CONFLUENCE_API_TOKEN=same_as_jira_token
```

## References

- [mcp-atlassian GitHub](https://github.com/sooperset/mcp-atlassian)
- [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
- [JQL Syntax Guide](https://support.atlassian.com/jira-software-cloud/docs/jql-reference/)
