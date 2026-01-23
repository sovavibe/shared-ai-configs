# Jira CLI Integration

> Integration mode: CLI (`jira-cli` via Homebrew)

## Installation

```bash
# macOS
brew install jira-cli

# After installation, set API token and initialize
export JIRA_API_TOKEN="ATATT3x..."
jira init  # Select Cloud or Server, enter instance URL
```

## Configuration

**`.ai-project.yaml`:**

```yaml
services:
  task_tracking:
    type: 'jira'
    integration_mode: 'cli' # Uses jira-cli
    key_prefix: 'VP-'
    jira:
      instance: 'your-company.atlassian.net'
      board_id: 123
```

**Environment:**

```bash
JIRA_API_TOKEN=ATATT3x...  # Required
JIRA_PROJECT=VP            # Optional, used in queries
```

## Command Reference

### Search Issues (`jira_search`)

```bash
# JQL search with JSON output
jira issue list --raw -q "project = VP AND status != Done ORDER BY updated DESC"

# Assigned to me
jira issue list --raw -q "project = VP AND assignee = currentUser() AND status != Done"

# By labels
jira issue list --raw -q "project = VP AND labels = mr-321 AND status != Done"
```

### Get Issue Details (`jira_get_issue`)

```bash
# View single issue with JSON output
jira issue view VP-123 --raw

# Short format (no comments)
jira issue view VP-123 --raw --no-comments
```

### Create Issue (`jira_create_issue`)

```bash
# Create Task
jira issue create --no-input \
  -t "Task" \
  -s "[MR-321] Code Review Round 1" \
  -b "## Description
Code review task for MR-321

## Scope
- Review changed files
- Check type safety
- Verify tests" \
  -l "code-review" -l "mr-321" \
  -y "High"

# Create Bug
jira issue create --no-input \
  -t "Bug" \
  -s "Login fails on Safari" \
  -b "Steps to reproduce:
1. Open Safari
2. Go to login page
3. Enter credentials
4. Click submit

Expected: Login successful
Actual: Error 500" \
  -y "Critical"
```

### Update Issue (`jira_update_issue`)

```bash
# Update summary
jira issue edit VP-123 --no-input -s "New summary"

# Update description
jira issue edit VP-123 --no-input -b "New description"

# Add labels
jira issue edit VP-123 --no-input -l "new-label"
```

### Add Comment (`jira_add_comment`)

```bash
# Add comment to issue
jira issue comment add VP-123 --no-input -b "## Progress Update

Fixed the type safety issues:
- Added User interface
- Fixed useCallback dependencies

Files changed:
- src/widgets/UserProfile.tsx
- src/hooks/useUserData.ts"
```

### Transition Issue (`jira_transition_issue`)

```bash
# Move to Done
jira issue move VP-123 "Done"

# Move to In Progress
jira issue move VP-123 "In Progress"

# Move to Blocked (if workflow supports)
jira issue move VP-123 "Blocked"

# List available transitions
jira issue move VP-123 --list
```

### List Projects

```bash
jira project list --raw
```

### Current User

```bash
jira me
```

## JSON Output Parsing

All commands with `--raw` flag return JSON. Parse with `jq`:

```bash
# Get issue keys
jira issue list --raw -q "project = VP" | jq -r '.[].key'

# Get issue titles
jira issue list --raw -q "project = VP" | jq -r '.[] | "\(.key): \(.fields.summary)"'

# Get issue status
jira issue view VP-123 --raw | jq -r '.fields.status.name'
```

## Comparison with MCP Mode

| Aspect         | CLI (`jira-cli`)                 | MCP (`mcp-atlassian`) |
| -------------- | -------------------------------- | --------------------- |
| **Setup**      | Simple (`brew install`)          | Requires Python/uv    |
| **Speed**      | Each command is separate process | Persistent connection |
| **Output**     | `--raw` for JSON                 | Native JSON           |
| **Confluence** | Not included                     | Included              |
| **Best for**   | Scripts, CI/CD                   | IDE integration       |

## Troubleshooting

### Authentication Failed

```bash
# Re-initialize with fresh token
export JIRA_API_TOKEN="new_token"
jira init --force
```

### Project Not Found

```bash
# List available projects
jira project list --raw

# Check your access
jira me
```

### JQL Syntax Error

```bash
# Test JQL in browser first:
# https://your-company.atlassian.net/issues/?jql=project%20%3D%20VP
```

## References

- [jira-cli GitHub](https://github.com/ankitpokhrel/jira-cli)
- [JQL Syntax Guide](https://support.atlassian.com/jira-software-cloud/docs/jql-reference/)
