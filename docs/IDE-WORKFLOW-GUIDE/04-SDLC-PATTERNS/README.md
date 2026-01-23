# SDLC Patterns: Complete Reference Guide

> **What belongs here:** Detailed workflow patterns for recurring SDLC scenarios - new features, bug fixes, refactoring, performance optimization.

---

## Quick Navigation

### 1. [New Feature Full Cycle](./01-New-Feature-Full-Cycle.md) (~1,150 lines)

**When:** Building a new feature from scratch
**Time:** 5-20 hours
**Workflow:** Full 6-phase SDLC

- ✅ Complete 6-phase workflow (Analyze → Architect → Plan → Implement → Test → Review)
- ✅ Real example: Dark Mode feature start to finish
- ✅ Timeline & effort estimates per phase
- ✅ What Claude Code vs Cursor does at each step
- ✅ IDE handoff checklists
- ✅ Deliverables and decision documentation
- ✅ Team communication framework
- ✅ Success criteria & validation
- ✅ Decision tree for when to use full cycle

**Best for:** Core features, significant system changes, first-time patterns

---

### 2. [Bug Fix Workflow](./02-Bug-Fix-Workflow.md) (~1,035 lines)

**When:** Issues need investigation and fixing
**Time:** 15 min - 3 hours (depends on complexity)
**Workflows:** 3 tracks (Quick, Medium, Complex)

- ✅ Severity classification (P0-P3) → determines workflow
- ✅ 3 bug workflows: Quick fix (30 min), Medium (2 hours), Complex (3+ hours)
- ✅ Systematic investigation methodology
- ✅ Root cause analysis techniques
- ✅ Reproduction & isolation steps
- ✅ Real-world examples: Simple, Medium, Complex bugs
- ✅ Deep dive: Auth flow intermittent failures
- ✅ Investigation checklist & patterns
- ✅ Common bug patterns (memory leaks, race conditions, timeouts)
- ✅ IDE usage (Claude Code for investigation, Cursor for implementation)

**Best for:** Any bug from user report through production verification

---

### 3. [Refactoring Strategy](./03-Refactoring-Strategy.md) (~1,040 lines)

**When:** Code quality improvement needed
**Time:** 30 min - 3+ days (depends on scope)
**Scales:** Small (1 hour), Medium (2-4 hours), Large (1-3 days)

- ✅ Refactoring triggers & decision tree (when NOT to refactor)
- ✅ 3 scales: Small, Medium, Large with different approaches
- ✅ Risk assessment framework
- ✅ Small example: Extract button component (30 min)
- ✅ Medium example: Auth flow prop drilling → Zustand (3.5 hours)
- ✅ Large example: Migrate class → hooks components (1-2 days)
- ✅ Planning & team buy-in process
- ✅ Incremental implementation strategy
- ✅ Code review & merge process
- ✅ Anti-patterns (what NOT to do)
- ✅ Refactoring checklist

**Best for:** Code quality debt, architectural improvements, consolidation

---

### 4. [Performance Optimization](./04-Performance-Optimization.md) (~970 lines)

**When:** App is slow or needs speed improvement
**Time:** 1-3 hours per optimization
**Focus:** Measure → Analyze → Optimize → Validate

- ✅ Performance categories (render, bundle, network, database, memory)
- ✅ Decision tree: When to optimize vs when to skip
- ✅ Baseline metrics & profiling techniques
- ✅ Bottleneck identification (Chrome DevTools, React Profiler)
- ✅ Root cause analysis for performance issues
- ✅ Optimization implementation with before/after code
- ✅ Performance testing & validation
- ✅ Real example: Dashboard chart rendering (75% improvement)
- ✅ Deep dive: Bundle size optimization (40% reduction)
- ✅ Common optimization patterns (5 techniques)
- ✅ Continuous monitoring checklist

**Best for:** Speed requirements, user experience issues, lighthouse scores

---

## How to Use This Guide

### I have a new feature to build

→ Read **New Feature Full Cycle**
→ Follow the 6-phase workflow
→ Use the Dark Mode example as reference

### I found a bug to fix

→ Read **Bug Fix Workflow**
→ Choose workflow based on severity (Quick / Medium / Complex)
→ Follow investigation methodology
→ Check similar bug examples

### I need to clean up code

→ Read **Refactoring Strategy**
→ Assess scope (Small / Medium / Large)
→ Follow planning process
→ Use examples for pattern matching

### App is too slow

→ Read **Performance Optimization**
→ Establish baseline metrics
→ Profile to find bottleneck
→ Implement optimization pattern
→ Verify improvements

---

## Key Statistics

| Pattern | Duration | Scope | IDE Split | Examples |
|---------|----------|-------|-----------|----------|
| New Feature | 5-20h | Full SDLC | Claude Code + Cursor | Dark Mode (800 lines) |
| Bug Fix | 15m-3h | Investigation → Fix | Claude Code + Cursor | 3 scenarios (1000 lines) |
| Refactoring | 30m-3d | Code quality | Cursor (small) → both (large) | 3 examples (1040 lines) |
| Performance | 1-3h | Speed improvement | Claude Code + Cursor | 2 deep dives (970 lines) |

---

## File Naming Convention

```
01-New-Feature-Full-Cycle.md
   └─ PHASE-NUMBER-PHASE-NAME

02-Bug-Fix-Workflow.md
   └─ SCALE-NUMBER-SCALE-NAME

03-Refactoring-Strategy.md
   └─ SCALE-APPROACH-PATTERN

04-Performance-Optimization.md
   └─ ACTIVITY-PATTERN
```

Each file is self-contained:

- ✅ Standalone (can read in any order)
- ✅ Cross-referenced (links to related patterns)
- ✅ Examples included (real code, real scenarios)
- ✅ Checklists provided (copy-paste ready)
- ✅ Timelines clear (realistic estimates)

---

## IDE Workflow Summary

### Claude Code (Analysis & Review)

**When:** Thinking, designing, investigating

- Phase 1 ANALYZE (new feature analysis)
- Phase 2 ARCHITECT (design decisions)
- Phase 3 PLAN (detailed planning)
- Bug investigation (root cause)
- Refactoring planning
- Performance profiling & analysis
- Phase 6 REVIEW (code quality)

**Key tools:** `/analyze`, `/architect`, `/plan`, `/review`, Snyk

### Cursor (Implementation)

**When:** Coding, building, iterating

- Phase 4 IMPLEMENT (write code)
- Phase 5 TEST (validation)
- Bug fixes (implement solution)
- Refactoring (execute changes)
- Performance optimization (code changes)

**Key tools:** Cursor Agent, automode

---

## Decision Framework

```
├─ New feature from scratch?
│  └─ Use: New Feature Full Cycle
│     Time: 5-20 hours
│     Go: Phase 1 ANALYZE
│
├─ User reported a bug?
│  ├─ Can you fix it in 30 min?
│  │  └─ Use: Quick Fix Workflow
│  │     Go: Section 1
│  ├─ Takes 30 min - 2 hours?
│  │  └─ Use: Medium Bug Workflow
│  │     Go: Section 2
│  └─ Unclear or complex?
│     └─ Use: Complex Bug Workflow
│        Go: Section 3
│
├─ Code needs improvement?
│  ├─ Single file/component?
│  │  └─ Use: Small Refactoring
│  │     Time: 30-60 min
│  ├─ Feature-level change?
│  │  └─ Use: Medium Refactoring
│  │     Time: 2-4 hours
│  └─ Major architecture?
│     └─ Use: Large Refactoring
│        Time: 1-3 days
│
└─ App is slow?
   └─ Use: Performance Optimization
      Time: 1-3 hours per optimization
      Go: Step 1.1 (establish baseline)
```

---

## Quick Checklist Selection

Need a quick checklist? Here are the key ones per file:

**New Feature Full Cycle:**

- Phase 1 Success Criteria (p. ~80)
- Phase 3 Risk Factors (p. ~140)
- Phase 5 Full test checklist (p. ~160)
- IDE Handoff Checklist (p. ~175)

**Bug Fix Workflow:**

- Bug Severity Classification (top of doc)
- Bug Investigation Checklist (p. ~650)
- Quick Fix Workflow (p. ~50)

**Refactoring Strategy:**

- Refactoring Triggers (p. ~30)
- Red Flags: When NOT to refactor (p. ~50)
- Risk Assessment (p. ~250)
- Refactoring Checklist (p. ~850)

**Performance Optimization:**

- Decision Tree (p. ~70)
- Baseline Metrics (p. ~150)
- Performance Categories (top of doc)
- Monitoring Checklist (p. ~850)

---

## Common Questions

**Q: When should I use Full Cycle vs simplified approach?**
A: Use full 6-phase for core features that require careful planning. Skip phases for simple bugs or obvious fixes.

**Q: Can I do multiple workflows in parallel?**
A: Yes, but coordinate with team. Bug fixes can happen during refactoring. Performance optimization can happen between features.

**Q: What if I don't have baseline metrics?**
A: Establish them first. Optimization without baseline is guessing.

**Q: How do I know when refactoring is done?**
A: When code is more readable, tests pass, and metrics improve.

**Q: Should I include optimization in new features?**
A: Include basic optimization patterns (memoization, lazy loading). Major optimization is separate.

---

## Related Documentation

- **IDE Decision Flowchart:** `00-IDE-DECISION-FLOWCHART.md` (when to use Claude Code vs Cursor)
- **Session Protocol:** `.claude/SESSION-PROTOCOL.md` (how to structure working sessions)
- **MCP Guide:** `.claude/MCP-GUIDE.md` (tools for analysis & investigation)
- **Troubleshooting:** `.claude/TROUBLESHOOTING.md` (when gates fail, how to fix)

---

## Version History

| Date | Author | Change |
|------|--------|--------|
| 2026-01-21 | Claude | Initial creation of 4-file SDLC patterns library |

---

## Contributing to This Guide

When you encounter a new pattern or edge case:

1. Document it with real example
2. Add to appropriate file (or create new file if novel)
3. Update this README
4. Commit with pattern explanation

---

**Last Updated:** 2026-01-21
**Total Content:** 4,199 lines across 4 files
**Coverage:** New Features, Bug Fixes, Refactoring, Performance Optimization
