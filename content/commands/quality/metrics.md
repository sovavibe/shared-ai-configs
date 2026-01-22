---
description: 'Track AI assistance effectiveness and session metrics'
---

# Session Metrics

## Quick Health Check

```bash
# Tasks completed today
bd list --status=closed --since=today

# Current work in progress
bd list --status=in_progress

# Quality gate status
npm run quality:gates
```

## Key Metrics

### Session Metrics

| Metric                  | How to Check              | Target          |
| ----------------------- | ------------------------- | --------------- |
| Tasks completed         | `bd list --status=closed` | 1-3/session     |
| Quality gate first-pass | Track manually            | >80%            |
| Commit frequency        | `git log --since="8am"`   | Every 2-4 hours |
| Context switches        | Self-assessment           | <3/session      |

### Code Quality

| Metric            | Command                      | Target      |
| ----------------- | ---------------------------- | ----------- |
| Test coverage     | `npm run test -- --coverage` | >80%        |
| TypeScript errors | `npm run typecheck`          | 0           |
| ESLint errors     | `npm run lint`               | 0           |
| Build size        | `npm run build`              | <300KB main |

### MCP Usage

Track which tools were most useful:

| Tool      | Use Case       | Effectiveness |
| --------- | -------------- | ------------- |
| Beads     | Task tracking  | Essential     |
| Context7  | Library docs   | High          |
| Hindsight | Pattern recall | Medium        |
| Grep/Glob | Code search    | High          |

## Retrospective Questions

After each major task, capture learnings:

### What Worked Well?

```bash
# Store in Hindsight for future reference
retain("Pattern: [description of what worked]", context="patterns")
```

### What Slowed Us Down?

- Missing context?
- Unclear requirements?
- Complex codebase area?
- Tool issues?

### What Should We Remember?

```bash
# Capture important decisions
retain("Decision: [what and why]", context="decisions")

# Capture new patterns learned
retain("Learned: [pattern description]", context="learnings")
```

## Quality Trends

### Weekly Review

```bash
# Commits this week
git log --oneline --since="1 week ago" | wc -l

# Tasks completed
bd stats

# Test coverage trend
npm run test -- --coverage
```

### Monthly Review

- Total tasks completed
- Average quality gate pass rate
- Most common error types
- Codebase growth (lines, files)

## Improvement Actions

Based on metrics, consider:

| Issue                 | Action                      |
| --------------------- | --------------------------- |
| Low first-pass rate   | Review before running gates |
| High context switches | Better task decomposition   |
| Frequent same errors  | Add to BUGBOT patterns      |
| Slow MCP tools        | Check fallback strategies   |

## Store Session Summary

At session end:

```bash
# Quick summary to Hindsight
retain("Session [date]: Completed [tasks]. Key learnings: [summary]", context="sessions")
```
