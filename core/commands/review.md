# /review - Code Review

> **Purpose:** Verify implementation quality before merging.
>
> Review phase ensures code meets requirements, follows patterns,
> and doesn't introduce bugs or security issues.

Review the implementation: $ARGUMENTS

## Phase 1: Gather Context

### 1.1 Get Changed Files

```bash
git status                    # What changed
git diff --stat               # Overview of changes
git log --oneline -5          # Recent commits
```

### 1.2 Load Original Requirements

```bash
bd list --status=closed | tail -5    # Recent closed beads
bd show [IMPLEMENTATION_BEAD_ID]      # Original plan
```

### 1.3 Recall Context

```
mcp__hindsight-alice__recall "Plan and architecture for [FEATURE]"
mcp__hindsight-alice__recall "Requirements and acceptance criteria"
```

---

## Phase 2: Code Review

### 2.1 Read Changed Files

Read each modified file:

- Understand the changes
- Compare to original plan
- Check for patterns

### 2.2 Verify Against Plan

For each acceptance criterion in the plan:

- [ ] Criterion 1 - implemented correctly?
- [ ] Criterion 2 - implemented correctly?
- [ ] Criterion 3 - implemented correctly?

### 2.3 Check Quality Aspects

**Functionality:**

- Does it do what was requested?
- Edge cases handled?
- Error handling present?

**Code Quality:**

- Follows project patterns?
- No code duplication?
- Clear naming?
- Appropriate abstractions?

**Security:**

- No hardcoded secrets?
- Input validation?
- XSS/injection prevention?
- Auth/authz correct?

**Performance:**

- No obvious bottlenecks?
- Efficient algorithms?
- Memoization where needed?
- No memory leaks?

**Testing:**

- Tests added/updated?
- Edge cases covered?
- Mocks appropriate?

---

## Phase 3: Deep Analysis (Optional)

### 3.1 Use PAL Code Review

```
mcp__pal__codereview
  step="Review implementation of [FEATURE]"
  relevant_files=["/path/to/file1.ts", "/path/to/file2.ts"]
  review_type="full"
```

### 3.2 Security Scan

```
mcp__Snyk__snyk_code_scan path="[PROJECT_PATH]"
```

### 3.3 Pre-commit Validation

```
mcp__pal__precommit
  step="Validate changes for [FEATURE]"
  path="[PROJECT_PATH]"
```

---

## Phase 4: Document Findings

### 4.1 Categorize Issues

**Blockers (Must Fix):**

- Security vulnerabilities
- Broken functionality
- Missing requirements
- Build/test failures

**Major (Should Fix):**

- Significant code quality issues
- Missing error handling
- Performance concerns
- Incomplete tests

**Minor (Nice to Have):**

- Style inconsistencies
- Documentation gaps
- Refactoring opportunities
- Non-critical improvements

**Praise (What's Good):**

- Well-implemented patterns
- Good test coverage
- Clean abstractions
- Smart solutions

---

## Phase 5: Create Feedback

### 5.1 If Approved

```
✅ APPROVED

**Summary:** [What was implemented]

**Verification:**
- [x] Acceptance criteria met
- [x] Tests passing
- [x] Code quality acceptable
- [x] No security issues

**Praise:**
- [What was done well]

**Minor suggestions (optional for future):**
- [Non-blocking improvement idea]

Ready to merge!
```

### 5.2 If Changes Requested

```
🔄 CHANGES REQUESTED

**Summary:** [What needs attention]

**Blockers:**
- [ ] [Issue 1] - File: `path/to/file.ts:line`
  - Problem: [description]
  - Suggestion: [how to fix]

- [ ] [Issue 2] - File: `path/to/file.ts:line`
  - Problem: [description]
  - Suggestion: [how to fix]

**Major issues:**
- [ ] [Issue] - [description]

**After fixing, run:**
> /review (to re-review)
```

### 5.3 Create Bug Beads (if needed)

```bash
bd create --title="Fix: [ISSUE_DESCRIPTION]" --type=bug --priority=1
```

---

## Phase 6: Save & Sync

### 6.1 Save Review to Memory

```
mcp__hindsight-alice__retain "Review [FEATURE]: [outcome - approved/changes requested], [key findings]"
```

### 6.2 Sync Beads

```bash
bd sync
```

---

## Output Templates

### Approved

```
✅ Review complete: APPROVED

📋 Feature: [FEATURE_NAME]
📁 Files reviewed: [count]
🧪 Tests: [status]

✓ All acceptance criteria met
✓ Code quality acceptable
✓ No security issues found

👍 Ready to merge!

Next:
> npm run quality:gates
> git commit
```

### Changes Requested

```
🔄 Review complete: CHANGES REQUESTED

📋 Feature: [FEATURE_NAME]
📁 Files reviewed: [count]

🚫 Blockers: [count]
⚠️ Major issues: [count]
💡 Minor suggestions: [count]

Top issues:
1. [Most critical issue]
2. [Second issue]

Next:
> Fix issues above
> /review (re-review)
```

---

## Review Checklist

### Functionality

- [ ] Feature works as described
- [ ] Edge cases handled
- [ ] Error states managed
- [ ] Loading states present
- [ ] Empty states handled

### Code Quality

- [ ] Follows FSD architecture
- [ ] Uses existing patterns
- [ ] No duplicate code
- [ ] Clear naming
- [ ] Proper TypeScript types

### Security

- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] No XSS vulnerabilities
- [ ] Proper auth checks

### Performance

- [ ] No obvious N+1 queries
- [ ] Memoization where needed
- [ ] No memory leaks
- [ ] Reasonable bundle impact

### Testing

- [ ] Unit tests added
- [ ] Tests pass
- [ ] Edge cases covered
- [ ] Mocks appropriate

### Documentation

- [ ] Complex logic commented
- [ ] Public APIs documented
- [ ] README updated if needed

---

## When to Use Deep Review

Use PAL/Snyk analysis when:

- Security-sensitive changes
- Complex business logic
- Performance-critical code
- New patterns introduced
- Large changesets (10+ files)

Skip deep analysis when:

- Simple styling changes
- Documentation updates
- Configuration changes
- Trivial bug fixes
