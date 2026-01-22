---
description: 'Systematic debugging: hypothesis generation, instrumentation, root cause analysis'
---

# Debug Mode

## Workflow

```mermaid
flowchart TD
    Start([Bug Reported]) --> Phase1[Phase 1: Hypothesis Generation<br/>Create 3-5 plausible hypotheses]

    Phase1 --> Sources[Generate from:<br/>- Error messages<br/>- Code analysis<br/>- Git history<br/>- Known patterns]
    Sources --> SemanticSearch1[Semantic Search:<br/>- Find patterns<br/>- Identify context<br/>- Locate similar issues]

    SemanticSearch1 --> Phase2[Phase 2: Instrumentation<br/>Add strategic logging]
    Phase2 --> LogPoints[Add logs:<br/>- Entry/exit points<br/>- State changes<br/>- API calls<br/>- Error objects]

    LogPoints --> Phase3[Phase 3: Reproduction<br/>Gather runtime data]
    Phase3 --> Reproduce[Steps:<br/>1. Reproduce consistently<br/>2. Capture logs<br/>3. Record steps<br/>4. Note environment]

    Reproduce --> SemanticSearch2[Semantic Search:<br/>- Find similar errors<br/>- Understand data flow]
    SemanticSearch2 --> Phase4[Phase 4: Root Cause Analysis<br/>Identify true cause]

    Phase4 --> Compare[Compare hypotheses<br/>vs observed behavior]
    Compare --> Eliminate{All hypotheses<br/>eliminated?}

    Eliminate -->|Yes| Phase1
    Eliminate -->|No| Validate{Root cause<br/>validated?}

    Validate -->|No| NeedMoreData{Need more<br/>data?}
    NeedMoreData -->|Yes| Phase2
    NeedMoreData -->|No| Phase1

    Validate -->|Yes| Phase5[Phase 5: Fix Implementation<br/>Minimal correct fix]

    Phase5 --> FixSteps[1. Fix root cause<br/>2. Add regression test<br/>3. Update docs<br/>4. Run quality gates]
    FixSteps --> Verify{Fix resolves<br/>issue?}

    Verify -->|No| Phase4
    Verify -->|Yes| RemoveLogs[Remove debug logs]
    RemoveLogs --> Commit[Commit with:<br/>- Root cause explanation<br/>- Fix description<br/>- Test coverage]

    Commit --> End([Bug Fixed])
```

## Semantic Search Integration

Use semantic search throughout debugging:

| Phase                      | Query Examples                                    |
| -------------------------- | ------------------------------------------------- |
| Hypothesis Generation      | "Where do we handle error responses?"             |
| Understanding Architecture | "How does authentication flow work?"              |
| Finding Patterns           | "Show me how other components handle async state" |
| Root Cause Analysis        | "Find similar error handling in codebase"         |

**Benefits**: +12.5% accuracy in finding relevant code, +23.5% for context discovery

## Debugging Checklist

- [ ] Created 3-5 hypotheses
- [ ] Added instrumentation for each hypothesis
- [ ] Reproduced bug consistently
- [ ] Collected runtime data
- [ ] Identified root cause
- [ ] Implemented minimal fix
- [ ] Added regression test
- [ ] Verified fix resolves issue
- [ ] Ran quality gates
- [ ] Removed debug logs

## Examples

```bash
@debug.md Users see blank page after clicking "Save"
@debug.md TypeError: Cannot read properties of undefined
@debug.md List takes 10 seconds to load with 100 items
```

## Commit Template

```bash
git commit -m "fix: [bug description]

Root cause: [explanation]
- Fix: [what was changed]
- Test: [added regression test]
Refs: {PREFIX}-XXX"
```

## References

- `@search-patterns.md` — Semantic search best practices
- `@quality` — Core development rules
- `@testing.mdc` — Testing for regression
