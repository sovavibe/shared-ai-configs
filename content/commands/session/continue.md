---
description: 'Continue work: restore context from Beads/Hindsight/Jira'
version: '1.0.0'
lastUpdated: '2026-01-16'
---

# Continue Work

**Continue work session by restoring context from four pillars:**

## Integration Mode

**Check `.ai-project.yaml` for Jira integration mode:**

```yaml
services:
  task_tracking:
    type: 'jira'
    integration_mode: 'cli'  # 'mcp' or 'cli'
```

| Mode | Jira Commands | Server |
|------|---------------|--------|
| `mcp` | `jira_*` MCP tools | `mcp-atlassian` |
| `cli` | `jira issue ...` Bash | N/A |

## Core Principle

**Jira** = sync with team ("what I'm doing")
**Beads** = local management ("how I'm doing")

## Workflow

### 1. Check Ready Work

```bash
bd ready --json
```

**If tasks available:**

- Claim task: `bd update <id> --status=in_progress`
- Continue to implementation

**If no tasks:**

- Continue to next step

### 2. Restore Context

**Use Beads task descriptions** to get full context (research, analysis, progress):

```bash
# Find interrupted task
bd list --status=in_progress

# Get full context from task description
bd show <id> --json
# → All progress, research, analysis is in task description
```

**Task description contains:**

- What was done
- Current progress
- Research findings
- Analysis results
- Next steps
- → Full context recovery!

```bash
# Full context is already in task description
bd show <id> --json
# → All progress, research, analysis is in task description
```

**Use Hindsight MCP** to recall patterns and lessons:

```bash
CallMcpTool({
  server: "user-hindsight-alice",
  toolName: "recall",
  arguments: {
    bank_id: 'patterns',
    query: 'Previous work patterns, experience, opinions',
    max_tokens: 4096
  }
})
```

### 3. Check Jira Context

<details>
<summary><b>MCP Mode</b></summary>

```typescript
CallMcpTool({
  server: "mcp-atlassian",
  toolName: "jira_search",
  arguments: {
    jql: 'project = <JIRA_PROJECT> AND assignee = currentUser() AND status != Done',
    limit: 10
  }
})
```

</details>

<details>
<summary><b>CLI Mode</b></summary>

```bash
jira issue list --raw -q "project = <JIRA_PROJECT> AND assignee = currentUser() AND status != Done"
```

</details>

### 4. Continue Implementation

- Follow patterns from Hindsight
- Use rules from `.cursor/rules/`
- Create/update tasks in Beads
- Store intermediate research/analysis in Beads task description (`bd update <id> --description`)

### 5. Report Progress

```bash
echo "✅ Context recovered + work completed:

Task: bd-XX - 'Task title'
Jira: {PREFIX}-XXX

Done:
- Changed: `path/to/file.tsx`
- Tests: Passed"
```

## MCP Integration

**All intermediate reports and research results MUST be stored via MCP:**

1. **Beads** (Local CLI):

   - Store research, analysis, progress in task description (`bd update <id> --description`)
   - ✅ Stores in `.beads/` folder (all in task descriptions)

2. **Hindsight MCP** (`user-hindsight-alice`):

   - Store reflection and lessons learned
   - Store coding patterns and architectural decisions
   - Store experience and opinions
   - Recall patterns from previous work

3. **Jira** (MCP: `mcp-atlassian` | CLI: `jira issue ...`):
   - Update task status/comments if team task
   - ✅ NOT local files

## Communication Style

| DO                  | DON'T               |
| ------------------- | ------------------- |
| Provide actual code | Say "Here's how..." |
| Show before/after   | Repeat user's code  |
| Direct explanation  | Verbose preambles   |

## References

- `@beads` — Core Beads workflow
- `@create-tasks.md` — Create tasks scenarios
- `@context-management.mdc` — Context loading protocol
- `.cursor/rules/hindsight.mdc` — Hindsight MCP usage
- `.cursor/commands/mcp.md` — MCP tools reference
