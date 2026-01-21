# /gitlab-review-mr - Code Review GitLab MR

> **Purpose:** Comprehensive AI-first code review generating actionable feedback and Jira/Beads tasks.
>
> Use this to conduct thorough code reviews, identify issues by priority, and create structured tasks for fixes.

Review MR #$ARGUMENTS:

## Workflow

1. **Setup** - Load context and validate MR
2. **Analysis** - Review code quality and identify issues
3. **Tasks** - Create Jira tasks + Beads epics for each issue
4. **Reporting** - Generate summary and store patterns

## Quick Start

```bash
# Step 1: Get MR details
npm run gitlab:mr:get-info -- --mr <MR_NUMBER>

# Step 2: Get MR changes
npm run gitlab:mr:get-changes -- --mr <MR_NUMBER>

# Step 3: Run quality checks
npm run lint:strict -- --base develop   # Strict linting
npm run typecheck                       # Type check
npm run build                           # Build check
npm run test -- --run                   # Tests

# Step 4: Analyze & Create Tasks
# (Use Claude to review)
```

## Priority Ranking

| Priority | Criteria | Action |
|----------|----------|--------|
| **🔴 P0 - Blocker** | Security, data corruption, broken builds | MUST FIX before merge |
| **🔴 P1 - Critical** | Type safety, missing error handling | MUST FIX before merge |
| **🟡 P2 - Important** | React hooks, architecture issues | Should fix in this round |
| **🟢 P3 - Nice to Have** | Style, docs, minor optimizations | Can defer to later |

## Analysis Checklist

### Automated Checks (Run First)
- ✅ ESLint strict mode (`npm run lint:strict`)
- ✅ TypeScript strict mode
- ✅ Build passes
- ✅ Tests pass

### Architecture Review (Manual Focus)

| Category | What to Check | Priority |
|----------|--------------|----------|
| **FSD Layers** | Correct import directions, layer boundaries | 🟡 Important |
| **Components** | Single responsibility, proper abstraction | 🟡 Important |
| **State** | Zustand store structure, caching | 🟡 Important |
| **Security** | No hardcoded secrets, input validation | 🔴 Critical |
| **API** | Error handling, loading states | 🟡 Important |
| **Performance** | Unnecessary re-renders, memoization | 🟢 Nice |
| **Testing** | Critical path coverage | 🔴 Critical |

## Create Tasks for Issues

For each Critical/Important issue:

```bash
# 1. Create Jira Task
jira_create_issue(
  project: "VP",
  summary: "[MR-<N>] [Category] [Issue Title]",
  type: "Task"
)

# 2. Create Beads Epic
bd create "Epic: [Jira-ID] [Category] [PRIORITY]" --type=epic -p <P0-P4>

# 3. Create Beads Subtasks
bd create "Atomic action" --deps epic:<EPIC_ID> -p 1
```

## Generate Summary

### Inline Comments for Critical Issues

```bash
npm run gitlab:inline-comment \
  --mr <MR_ID> \
  --file <FILE_PATH> \
  --line <LINE_NUMBER> \
  --body "🔴 **[CATEGORY] Title**

**Issue**: [Clear description]
**Fix**: [Specific solution]
**Why**: [Impact/importance]

**Jira**: VP-XXX"
```

### MR Summary Comment

```bash
npm run gitlab:mr:add-comment -- --mr <MR_ID> --body "## 🎯 Code Review Summary

**Assessment**: [EXCELLENT/GOOD/NEEDS WORK]

---

## Issues by Priority

**🔴 P0 Blockers** ([Count])
- [Issues that MUST be fixed]

**🔴 P1 Critical** ([Count])
- [Type safety, error handling]

**🟡 P2 Important** ([Count])
- [React hooks, architecture]

**🟢 P3 Nice to Have** ([Count])
- [Style, documentation]

---

## ✅ Strengths
- ✅ [Strength 1]
- ✅ [Strength 2]

---

## 📋 Tasks Created

Jira Tasks: [Count]
Beads Epics: [Count] (tracked in beads)

---

**Recommendation**: [APPROVE / REQUEST CHANGES / NEEDS WORK]"
```

## Store Patterns

After review, save insights to Hindsight:

```bash
mcp__hindsight-alice__retain "MR-[N] Code Review: Found [issue count] issues. Patterns: [list]. What worked: [approach]"
```

## Related Commands

- `/gitlab-get-comments` — Get existing comments to address
- `/gitlab-view-mr` — View MR details before reviewing
- `/gitlab-process-comments` — Process multiple feedback threads
