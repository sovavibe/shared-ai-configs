---
description: 'End development session: complete task, quality gates, commit, push'
---

# End Development Session

## Workflow

```mermaid
flowchart TD
    Start([End Session]) --> Step1[Step 1: Complete Task<br/>bd close ID]

    Step1 --> Step2[Step 2: Verify Changes<br/>git status]
    Step2 --> Step3[Step 3: Run Quality Gates<br/>npm run quality:gates]

    Step3 --> QG_TypeScript[TypeScript Compilation]
    QG_TypeScript --> QG_ESLint[ESLint]
    QG_ESLint --> QG_Tests[Tests]
    QG_Tests --> QG_Build[Build]
    QG_Build --> QG_Custom[Custom Quality Checks]

    QG_Custom --> QG_Pass{All checks<br/>passed?}

    QG_Pass -->|No| QG_Fix{Can auto-fix?}
    QG_Fix -->|ESLint| AutoFix[npm run lint --fix]
    QG_Fix -->|TypeScript| ManualFix[Fix type errors<br/>manually]
    QG_Fix -->|Tests| FixTests[Fix failing tests]

    AutoFix --> Step3
    ManualFix --> Step3
    FixTests --> Step3

    QG_Pass -->|Yes| Step4[Step 4: Commit Changes<br/>git add .<br/>git commit -m "..."]

    Step4 --> CommitFormat{Commit<br/>format valid?}
    CommitFormat -->|No| FixCommit[Use conventional<br/>commits format:<br/>feat/fix/refactor/etc]
    FixCommit --> Step4

    CommitFormat -->|Yes| Step5[Step 5: Push Changes<br/>git push]

    Step5 --> PushOK{Push<br/>successful?}
    PushOK -->|Conflict| Rebase[git pull --rebase<br/>Resolve conflicts]
    Rebase --> Step5

    PushOK -->|Permission| CheckAuth[Check SSH keys<br/>or tokens]
    CheckAuth --> Step5

    PushOK -->|Yes| Step6[Step 6: Sync Beads<br/>bd sync<br/>optional, hooks handle]

    Step6 --> SyncOK{Sync<br/>successful?}
    SyncOK -->|No| RetrySync[Retry or<br/>skip if network issue]
    RetrySync --> Step6

    SyncOK -->|Yes| Summary[Session Summary:<br/>✅ Task complete<br/>✅ Quality gates passed<br/>✅ Changes committed<br/>✅ Changes pushed<br/>✅ Beads synced]

    Summary --> End([Ready for Next Session])

    style Start fill:#e1f5e1
    style End fill:#ffe1e1
    style Step3 fill:#fff4e1
    style QG_Pass fill:#ffe1f0
    style PushOK fill:#ffe1f0
    style SyncOK fill:#ffe1f0
    style Summary fill:#e1ffe1
```

## Quick Reference

### Commands

```bash
bd close <id>            # Complete task
npm run quality:gates    # Run all gates
git add .                # Stage changes
git commit -m "feat: ..." # Commit
git push                 # Push
bd sync                  # Sync beads (optional)
```

### Conventional Commits

| Prefix      | Use              |
| ----------- | ---------------- |
| `feat:`     | New feature      |
| `fix:`      | Bug fix          |
| `refactor:` | Code refactoring |
| `test:`     | Adding tests     |
| `docs:`     | Documentation    |
| `style:`    | Code style       |
| `chore:`    | Maintenance      |

### Quality Gates

| Gate       | Command                 |
| ---------- | ----------------------- |
| TypeScript | `npm run typecheck`     |
| ESLint     | `npm run lint`          |
| Tests      | `npm run test`          |
| Build      | `npm run build`         |
| All        | `npm run quality:gates` |

## Troubleshooting

### ESLint Errors

```bash
npm run lint -- --fix    # Auto-fix
```

### TypeScript Errors

- Check for type errors
- Use `unknown` + type guards instead of `any`

### Git Push Failing

```bash
git pull --rebase        # Merge conflicts
git push
```

### Beads Sync Failing

```bash
bd start                 # Start daemon if not running
```

## Skip Options

| Option           | When                         |
| ---------------- | ---------------------------- |
| `--skip-task`    | No task claimed this session |
| `--skip-quality` | Already ran quality gates    |
| `--skip-git`     | Handle git manually          |

## Related

- `/start-session` - Start new session
- `/check-quality` - Run quality gates independently
