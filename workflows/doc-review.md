# Documentation Review Workflow

Multi-round documentation review workflow for MD/MDC files.

## Environment

- **Epic ID**: VP-gvwl (Documentation Review)
- **Round**: `{{REVIEW_ROUND}}` (default: 1)
- **Agent ID**: `{{AGENT_ID}}` (e.g., "opus-1", "sonnet-2")

## Review Criteria

For each file, evaluate:

1. **Consistency** - Does content match actual codebase?
2. **Accuracy** - Are code examples, paths, commands correct?
3. **Completeness** - Are all relevant aspects covered?
4. **Best Practices** - Does it follow industry standards?
5. **Mermaid Diagrams** - Are diagrams valid and accurate?
6. **Links** - Are all internal/external links working?
7. **Style** - Does it match project documentation style?
8. **Relevance** - Is the content still needed?

## Workflow Per Task

### 1. Get Next Task

```bash
# Find unclaimed tasks for this round
bd list --parent=VP-gvwl --status=open -n 1

# Or check all ready tasks
bd ready | grep "Review:"
```

### 2. Claim Task

```bash
bd update <task-id> --claim --add-label="round-{{ROUND}}"
```

### 3. Extract File Path

From task title like `Review: .cursor/rules/INDEX.mdc`:

- Extract path after "Review: "
- Handle multi-file tasks (comma-separated or wildcards)

### 4. Review File(s)

For each file:

```
1. Read file content
2. Check against codebase:
   - Verify code examples exist
   - Verify paths are valid
   - Verify commands work
   - Check referenced files exist
3. Validate Mermaid diagrams (if any)
4. Check links
5. Evaluate against best practices
```

### 5. Document Findings

```bash
# CRITICAL: Use comments, NOT notes (comments preserve history)
bd comment add <task-id> "
## Round {{ROUND}} Review ({{AGENT_ID}})
Date: $(date +%Y-%m-%d)

### Issues Found:
- [ ] Issue 1: description
- [ ] Issue 2: description

### Positive Aspects:
- Aspect 1
- Aspect 2

### Recommendations:
- Recommendation 1
- Recommendation 2

### Verdict: PASS | NEEDS_FIXES | CRITICAL
"
```

**WARNING**: Do NOT use `--notes` as it overwrites previous content. Always use `bd comment add`.

### 6. Update Status

```bash
# If review complete for this round, add label
bd update <task-id> --add-label="reviewed-round-{{ROUND}}"

# Do NOT close - allow more rounds
# Status stays in_progress or revert to open for next round
bd update <task-id> --status=open
```

### 7. Continue

Pick next task and repeat.

## Multi-Agent Coordination

To avoid conflicts between parallel agents:

1. **Claim atomically**: Use `bd update --claim` (fails if already claimed)
2. **Label rounds**: Each round adds `round-N` label
3. **Check before claim**:

```bash
# Skip if already has this round's label
bd show <task-id> | grep "round-{{ROUND}}" && echo "SKIP" || echo "PROCESS"
```

## Round Strategy

| Round | Focus                            | Agent  |
| ----- | -------------------------------- | ------ |
| 1     | Structure, Links, Basic accuracy | Sonnet |
| 2     | Deep code verification           | Sonnet |
| 3     | Best practices, Style            | Opus   |
| 4     | Consolidation → Actionable spec  | Opus   |

## Completion Condition

Round completes when ALL tasks have label `reviewed-round-{{ROUND}}`.

Check:

```bash
# Count tasks without this round's label
bd list --parent=VP-gvwl --status=open -n 0 | wc -l
```

## Example Review Output

```markdown
## Round 1 Review (sonnet-agent-1)

Date: 2026-01-20

### File: .cursor/rules/INDEX.mdc

### Issues Found:

- [ ] Line 45: Reference to `@050-deprecated.mdc` - file doesn't exist
- [ ] Line 78: Mermaid diagram has invalid syntax (missing arrow)
- [ ] Line 120: Command `npm run lint:fix` should be `npm run lint -- --fix`

### Positive Aspects:

- Well-structured table of contents
- Clear categorization of rules
- Good cross-references between related rules

### Recommendations:

- Remove deprecated file reference
- Fix Mermaid syntax
- Update command to match package.json

### Verdict: NEEDS_FIXES
```

## DO NOT

- Close tasks (multi-round review)
- Make changes to files (review only)
- Skip files even if they look fine (document positive findings too)
- Overwrite previous round notes (append with new section)
