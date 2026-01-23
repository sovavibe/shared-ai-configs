---
description: 'Auto-detect and create tasks: Jira for team sync, Beads for local management'
---

# Create Tasks

**Core**: Jira = team sync | Beads = local management

## Integration Mode

**Check `.ai-project.yaml` first:**

```yaml
services:
  task_tracking:
    type: 'jira'
    integration_mode: 'cli' # 'mcp' or 'cli'
```

| Mode  | Jira Commands         | Server          |
| ----- | --------------------- | --------------- |
| `mcp` | `jira_*` MCP tools    | `mcp-atlassian` |
| `cli` | `jira issue ...` Bash | N/A             |

## Workflow

```mermaid
flowchart TD
    Start([New Work Needed]) --> CheckReady[bd ready --json]
    CheckReady --> HasWork{Has ready<br/>work?}

    HasWork -->|Yes| UseExisting([Use existing work])
    HasWork -->|No| WorkType{Work Type?}

    WorkType -->|MR<br/>Code Review| MR_Path
    WorkType -->|Feature/Bug<br/>For Team| Feature_Path
    WorkType -->|Local<br/>Initiative| Local_Path

    %% MR Path
    MR_Path[Scenario 1: MR Review]
    MR_Path --> MR_Detect[Detect MR number<br/>Get unresolved comments]
    MR_Detect --> MR_CheckJira{Jira Task<br/>exists?}

    MR_CheckJira -->|Yes| MR_CheckBeads[Check Beads tickets<br/>for threads]
    MR_CheckJira -->|No| MR_CreateJira[Create Jira Task<br/>Round N<br/>labels: mr-XXX]

    MR_CreateJira --> MR_CreateEpic[Create Beads Epic<br/>IMMEDIATELY<br/>link to Jira]
    MR_CheckBeads --> MR_CreateEpic

    MR_CreateEpic --> MR_ForEachThread[For each thread]
    MR_ForEachThread --> MR_ThreadType{Thread<br/>complexity?}

    MR_ThreadType -->|Simple<br/>1 action| MR_Task[Create Beads Task<br/>deps: Epic<br/>link Discussion ID]
    MR_ThreadType -->|Complex<br/>2+ actions| MR_SubEpic[Create Beads Sub-Epic<br/>+ multiple Tasks<br/>deps: Parent Epic]

    MR_Task --> MR_MoreThreads{More<br/>threads?}
    MR_SubEpic --> MR_MoreThreads
    MR_MoreThreads -->|Yes| MR_ForEachThread
    MR_MoreThreads -->|No| Done

    %% Feature/Bug Path
    Feature_Path[Scenario 2: Feature/Bug]
    Feature_Path --> Feature_CreateJira[Create Jira Task<br/>labels: feature/bug]
    Feature_CreateJira --> Feature_CreateEpic[Create Beads Epic<br/>IMMEDIATELY<br/>link to Jira]
    Feature_CreateEpic --> Feature_Decompose[Decompose into steps]
    Feature_Decompose --> Feature_CreateTasks[Create Beads Tasks<br/>deps: Epic<br/>1. Setup<br/>2. Implementation<br/>3. Tests]
    Feature_CreateTasks --> Done

    %% Local Initiative Path
    Local_Path[Scenario 3: Local Initiative]
    Local_Path --> Local_NoJira[NO Jira<br/>Team doesn't track]
    Local_NoJira --> Local_Complexity{Initiative<br/>complexity?}

    Local_Complexity -->|Simple<br/>Quick fix| Local_Task[Create Beads Task<br/>Type: Local Initiative]
    Local_Complexity -->|Complex<br/>Multiple steps| Local_Epic[Create Beads Epic<br/>Type: Local Initiative]

    Local_Task --> Done
    Local_Epic --> Local_Decompose[Decompose into<br/>Beads Tasks<br/>deps: Epic]
    Local_Decompose --> Done

    Done([Tasks Created])
```

## Commands by Scenario

### Scenario 1: MR Review

```bash
# Check existing
bd ready --json
git branch --show-current
glab mr list --source-branch=$(git branch --show-current)
npm run gitlab:mr:get-unresolved -- --mr <MR_NUMBER>

# Check/Create Jira Task (use appropriate mode)

# MCP Mode (integration_mode: 'mcp'):
CallMcpTool({
  server: "mcp-atlassian",
  toolName: "jira_search",
  arguments: { jql: 'project = <JIRA_PROJECT> AND labels = mr-<MR> AND issuetype = Task AND status != Done' }
})
CallMcpTool({
  server: "mcp-atlassian",
  toolName: "jira_create_issue",
  arguments: {
    project_key: "<JIRA_PROJECT>",
    summary: "[MR-<MR_NUMBER>] Code Review Round 1",
    issue_type: "Task",
    labels: ["mr-<MR_NUMBER>", "code-review", "round-1"]
  }
})

# CLI Mode (integration_mode: 'cli'):
jira issue list --raw -q "project = <JIRA_PROJECT> AND labels = mr-<MR> AND issuetype = Task AND status != Done"
jira issue create --no-input -t "Task" -s "[MR-<MR_NUMBER>] Code Review Round 1" -l "mr-<MR_NUMBER>" -l "code-review" -l "round-1"

# Create Beads Epic IMMEDIATELY
PARENT_EPIC=$(bd create "Epic: Review MR-<MR_NUMBER>" --type=epic -p 1 --json | jq -r '.id')
bd update $PARENT_EPIC --description="Jira: {PREFIX}-XXX
Type: MR Review"

# Per thread → Beads ticket
TASK=$(bd create "{PREFIX}-YYY: ${thread.title}" --deps epic:$PARENT_EPIC -p 1 --json | jq -r '.id')
bd update $TASK --description="GitLab Discussion ID: ${thread.id}
File: ${thread.file}:${thread.line}"
```

### Scenario 2: Feature/Bug

```bash
# Create Jira Task (use appropriate mode)

# MCP Mode:
CallMcpTool({
  server: "mcp-atlassian",
  toolName: "jira_create_issue",
  arguments: {
    project_key: "<JIRA_PROJECT>",
    summary: "Implement user auth",
    issue_type: "Task",
    labels: ["feature"]
  }
})

# CLI Mode:
jira issue create --no-input -t "Task" -s "Implement user auth" -l "feature"

# Create Beads Epic IMMEDIATELY
PARENT_EPIC=$(bd create "Epic: {PREFIX}-XXX: Implement user auth" --type=epic -p 1 --json | jq -r '.id')
bd update $PARENT_EPIC --description="Jira: {PREFIX}-XXX
Type: Feature"

# Decompose into steps
TASK1=$(bd create "Setup DB schema" --deps epic:$PARENT_EPIC -p 1 --json | jq -r '.id')
TASK2=$(bd create "Create API endpoints" --deps epic:$PARENT_EPIC -p 1 --json | jq -r '.id')
TASK3=$(bd create "Add tests" --deps epic:$PARENT_EPIC -p 1 --json | jq -r '.id')
```

### Scenario 3: Local Initiative

```bash
# Simple → Task only
TASK=$(bd create "Fix typo in README" -p 1 --json | jq -r '.id')

# Complex → Epic + Tasks
EPIC=$(bd create "Epic: Refactor utils" --type=epic -p 1 --json | jq -r '.id')
TASK1=$(bd create "Extract functions" --deps epic:$EPIC -p 1 --json | jq -r '.id')
```

## Critical Rules

| ✅ DO                         | ❌ DON'T                    |
| ----------------------------- | --------------------------- |
| Jira Task → always Beads Epic | Create Jira Epic for Beads  |
| Link Beads only to Jira Task  | Link Beads to Jira Epic     |
| MR threads → separate tickets | Mix threads in one ticket   |
| Local work → no Jira          | Create Jira for small tasks |
| Store mapping in Beads        | Use JSON files for mapping  |

## References

- @beads - Core Beads workflow
- @tool-selection - MCP tools reference
