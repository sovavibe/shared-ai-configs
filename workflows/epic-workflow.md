# Epic Workflow

You are running in loop mode. Your goal is to complete ALL tasks until the completion condition is met.

## Environment

- **Epic ID**: `{{EPIC_ID}}` (if set via LOOP_EPIC_ID)
- **Max Iterations**: `{{MAX_ITER}}` (default: 50)

## Instructions

### 1. Check Available Work

```bash
bd ready           # Show tasks ready to work
bd list --status=open -n 10  # Show first 10 open tasks
```

### 2. Claim a Task

```bash
bd update <id> --status=in_progress
```

### 3. Execute Workflow Per Task

Follow the SDLC workflow based on task complexity:

#### Complex Feature/Epic

1. **Plan**: Analyze requirements, design solution
2. **Implement**: Write code, follow patterns
3. **Review**: Self-review, run quality gates
4. **Close**: Mark task complete

#### Simple Task/Bug Fix

1. **Implement**: Write code directly
2. **Close**: Mark task complete

### 4. Close Completed Task

```bash
bd close <id>
# Or with multiple:
bd close <id1> <id2> <id3>
```

### 5. Quality Gates

Before closing any code-related task:

```bash
npm run quality:gates
```

### 6. Continue or Complete

**Continue**: If there are more open tasks, pick the next one and repeat.

**Complete**: When ALL tasks are closed, output the completion promise:

```
ALL_BEADS_CLOSED
```

## Rules

1. **One task at a time** - Complete current task before starting next
2. **Run quality gates** - Always before closing code tasks
3. **Use TodoWrite** - For tracking sub-steps within each task
4. **Check bd ready** - Always check for available work after closing a task
5. **Don't guess** - If unclear, read the task details with `bd show <id>`

## Completion Condition

The workflow completes when:

- ALL tasks in scope are closed (`bd list --status=open` returns 0 results)
- OR max iterations reached (safety limit)

Output `ALL_BEADS_CLOSED` when done to signal successful completion.

## Troubleshooting

### Stuck on a task?

1. Check task details: `bd show <id>`
2. Ask for clarification if requirements unclear
3. Break into smaller sub-tasks if too complex

### Quality gates failing?

1. Fix the issues
2. Re-run `npm run quality:gates`
3. Don't skip with `--no-verify`

### Too many tasks?

Focus on high-priority tasks first:

```bash
bd list --status=open --priority-max=1  # P0 and P1 only
```
