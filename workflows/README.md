# Workflow Loop Integration

Autonomous workflow orchestration for Claude Code with Beads task management.

## Quick Start

### Enable Loop Mode

```bash
# Start Claude with loop mode enabled
LOOP_ENABLED=1 LOOP_MAX_ITER=30 claude

# Or with a specific epic
LOOP_ENABLED=1 LOOP_EPIC_ID=VP-xxx claude
```

### Manual Execution (without loop mode)

```bash
# Just use the workflow prompt directly
claude --prompt workflow/epic-workflow.md
```

## Configuration

### Environment Variables

| Variable        | Default | Description                           |
| --------------- | ------- | ------------------------------------- |
| `LOOP_ENABLED`  | `0`     | Set to `1` to enable loop mode        |
| `LOOP_EPIC_ID`  | (empty) | Optional epic ID to scope tasks       |
| `LOOP_MAX_ITER` | `50`    | Maximum iterations before forced exit |

### How It Works

1. **Stop Hook** intercepts Claude's exit attempts
2. **Completion Check** runs `beads-completion-check.sh`
3. **Decision**:
   - If open beads remain → continue loop
   - If all beads closed → allow exit
   - If max iterations → force exit

## Files

| File                                 | Purpose                        |
| ------------------------------------ | ------------------------------ |
| `epic-workflow.md`                   | Simple workflow (single model) |
| `sdlc-workflow.md`                   | Full SDLC with model switching |
| `../hooks/beads-completion-check.sh` | Checks for open beads          |
| `../hooks/workflow-stop.sh`          | Stop hook with loop logic      |

## Workflows

### Epic Workflow (Simple)

Work through all tasks until complete:

```bash
LOOP_ENABLED=1 LOOP_EPIC_ID=VP-xxx claude \
  --prompt .claude/workflow/epic-workflow.md
```

### SDLC Workflow (Multi-Model)

Full SDLC phases with model switching:

```bash
LOOP_ENABLED=1 claude \
  --prompt .claude/workflow/sdlc-workflow.md
```

**Model allocation:**
| Phase | Model |
|-------|-------|
| Analyze, Architect, Plan | Opus |
| Implement, Review | Sonnet |

Uses `Task` tool with explicit `model` parameter to spawn subagents.

## Completion Signals

The loop ends when Claude outputs:

- `ALL_BEADS_CLOSED` - Normal completion (all tasks done)
- Max iterations reached - Safety exit

## Safety Features

1. **Max Iterations** - Prevents infinite loops
2. **Iteration Counter** - Stored in `../.loop-iter-count`
3. **Manual Override** - Ctrl+C always works
4. **Fallback** - If LOOP_ENABLED not set, acts as normal session

## Troubleshooting

### Loop not continuing?

- Check `LOOP_ENABLED=1` is set
- Check hooks are executable: `chmod +x ../hooks/*.sh`
- Check settings.json has Stop hook configured

### Loop never ends?

- Check `bd list --status=open` - are tasks actually being closed?
- Check max iterations with `LOOP_MAX_ITER`

### Permission issues?

```bash
chmod +x ../hooks/*.sh
```

## Integration with Beads

This system integrates with the Beads task management:

- Uses `bd list` to check open tasks
- Uses `bd close` to mark tasks complete
- Respects epic/parent filtering via `LOOP_EPIC_ID`
