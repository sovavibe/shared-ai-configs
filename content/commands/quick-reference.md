# Cursor Quick Reference

## Daily Workflow

```
/session/start     # Start session, check work
/implement         # Implement feature
/review            # Code review
/quality/check     # Run quality gates
/session/end       # Complete task, commit, push
```

## Rules (Auto-Loaded)

| Range   | Category  | When            |
| ------- | --------- | --------------- |
| 001-009 | Core      | Every session   |
| 010-049 | Context   | By file globs   |
| 100-149 | On-demand | Manual @mention |

**Navigation:** `@INDEX.mdc`

## Commands

| Folder     | Purpose                      |
| ---------- | ---------------------------- |
| `core/`    | implement, review, debug     |
| `session/` | start, end, continue         |
| `quality/` | check, lint, gates           |
| `gitlab/`  | MR workflows                 |

## Beads

```bash
bd ready                              # Check work
bd update <id> --status=in_progress   # Claim
bd close <id>                         # Complete
bd sync --flush-only                  # Export to JSONL
```

## Quality

```bash
npm run quality:gates    # All checks
npm run typecheck        # TypeScript
npm run lint             # ESLint
npm run test             # Tests
```

## Token Budget

| Layer       | Tokens      |
| ----------- | ----------- |
| Core        | ~600        |
| Context     | ~300/domain |
| On-demand   | ~400/topic  |
| **Session** | ~1800       |

## Critical Rules

| NEVER              | ALWAYS                |
| ------------------ | --------------------- |
| Use `any`          | Use `unknown` + guard |
| Edit `generated/`  | Use Orval             |
| Skip quality gates | Run before commit     |
| Use markdown TODOs | Use Beads             |
