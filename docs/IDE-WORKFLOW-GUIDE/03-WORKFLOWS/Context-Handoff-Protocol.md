# Context Handoff Protocol: Safe IDE Transitions

> **Purpose:** Transfer critical context between Claude Code and Cursor safely, preventing context loss and ensuring continuity.

> **Time Savings:** ~5K tokens per handoff, prevents 30+ min context recovery time

---

## What is Context Handoff?

**Scenario:** Claude Code completes architecture analysis. Cursor needs to implement. How does Cursor get the full context without losing information?

**Solution:** Structured handoff protocol that preserves:

1. Task context (Beads issue, phase, requirements)
2. Technical decisions (why this approach?)
3. File references (what to modify)
4. Acceptance criteria (how to know when done)
5. Testing strategy (how to verify)

---

## When to Use Handoff Protocol

✅ **USE handoff when:**

- Switching from Claude Code (analysis/architecture) → Cursor (implementation)
- Switching from Cursor (code) → Claude Code (review)
- Multi-day task with IDE breaks
- Complex feature split across multiple sessions
- Team collaboration between IDE users

❌ **SKIP handoff when:**

- Single IDE, single phase
- < 30 minutes per phase
- Simple fix with obvious next step

---

## Handoff Procedure (Step-by-Step)

### STEP 1: Before Switching (in Current IDE)

**In Claude Code (ending phase):**

```bash
# 1. Ensure Beads is synced
bd sync --flush-only

# 2. Check git status
git status
# Ensure: modified files tracked, nothing unexpected

# 3. Update context-handoff.md with current state
# See template below
```

**In Cursor (ending phase):**

```bash
# 1. Quality gates pass
npm run quality:gates

# 2. Commit changes (if complete)
# Or: staged changes ready for next IDE

# 3. Run Beads sync
bd sync --flush-only
```

---

### STEP 2: Document Current State

**Edit `.claude/context-handoff/current.md`:**

Use template below to document:

- What IDE is ending
- What IDE is starting
- Current task status
- What's needed next

```markdown
# Context Handoff: [Date & Time]

## Current State
- **Ending IDE:** Claude Code (or Cursor)
- **Ending Phase:** /architect (or /implement, /review)
- **Duration:** 2 hours
- **Beads Issue:** VP-2847 (Add Dark Mode Support)

## What's Done
- [x] Analyzed user requirements
- [x] Designed theme system architecture
- [x] Identified React component impact
- [x] Created architecture ADR (docs/adr/007-theme-system.md)

## What's Next
- [ ] Create implementation plan (Sonnet)
- [ ] Break into tasks (TodoWrite)
- [ ] Implement theme provider
- [ ] Add theme selector component
- [ ] Test theme persistence

## Code Context
- **Main Files:**
  - `src/app/providers/ThemeProvider.tsx` (create new)
  - `src/theme/theme.ts` (update)
  - `src/shared/hooks/useTheme.ts` (create new)
- **Related Files:**
  - `src/app/App.tsx` (wrap with provider)
  - `src/shared/ui/Button.tsx` (update styling)
  - etc.

## Key Decisions
1. **Theme System:** CSS variables (not styled-components props)
   - Why: Better performance, simpler override
   - Trade-off: Requires IE11+ (acceptable)

2. **Storage:** localStorage (not Redux)
   - Why: Simple, no state management needed
   - Trade-off: Not synced across tabs (acceptable)

3. **Provider:** Context API (not Zustand)
   - Why: Already have Context providers
   - Trade-off: No persistence layer (use localStorage)

## Testing Strategy
- Unit: useTheme hook behavior
- Integration: Theme switching across components
- E2E: Theme persists on page reload

## Acceptance Criteria (from Beads)
- [ ] Users can toggle light/dark mode
- [ ] Theme persists across sessions
- [ ] All components respect theme
- [ ] Performance: <100ms theme switch
- [ ] Accessibility: WCAG AA contrast
```

---

### STEP 3: Validate Handoff

**Checklist before switching:**

- [ ] Beads synced (`bd sync --flush-only` completed)
- [ ] Git clean (no unexpected changes: `git status`)
- [ ] context-handoff.md updated with full context
- [ ] No uncommitted critical code (commit or save to Beads)
- [ ] Quality gates pass (if applicable)
- [ ] Tests pass (if applicable)
- [ ] Decisions documented (why, not just what)

---

### STEP 4: Switch to New IDE

**In New IDE (starting phase):**

```bash
# 1. Load Beads context
bd ready
bd show VP-2847

# 2. Recall Hindsight (Claude Code only)
mcp__hindsight-alice__recall "VP-2847 theme system architecture"

# 3. Read context-handoff file
cat .claude/context-handoff/current.md

# 4. Verify setup
npm run quality:gates  # If applicable
```

---

### STEP 5: Resume Work

**In New IDE (continuation):**

```bash
# 1. Update Beads status
bd update VP-2847 --status=in_progress

# 2. Start next phase
# If Claude Code: /plan VP-2847
# If Cursor: /implement VP-2847

# 3. Update context-handoff as work progresses
# (keep it current for next handoff)
```

---

## IDE-Specific Considerations

### Claude Code → Cursor Handoff

**What transfers:** Analysis, architecture, planning
**What needs setup in Cursor:**

- Read context-handoff.md (Claude analysis)
- Check Beads issue description
- Verify quality gates work

**Risks to watch:**

- Cursor doesn't have Hindsight (can't recall multi-session context)
- Cursor has different MCP tool availability
- Cursor automode might need calibration

**Mitigation:**

- Document all decisions explicitly in context-handoff
- Store complex decisions in Beads comments
- Use Hindsight before switching: `retain "VP-2847: Architecture decision..."`

### Cursor → Claude Code Handoff

**What transfers:** Implementation progress, code insights
**What needs setup in Claude Code:**

- Load `git diff` to see what changed
- Review quality gates results
- Check for any failed tests or issues

**Risks to watch:**

- Claude Code might approach review differently
- Security/architecture concerns might require redesign

**Mitigation:**

- Document implementation approach in Beads
- Store test results in context-handoff
- Flag any concerns before switching

---

## Common Handoff Failures & Recovery

### Failure 1: Context Lost Between Switches

**Symptom:** "Why did they make this decision?" / "I don't know what to do next"

**Root Cause:** context-handoff.md not updated or not detailed enough

**Recovery:**

```bash
# 1. Check Beads comments
bd show VP-2847
# Review all comments for context

# 2. Check Hindsight
mcp__hindsight-alice__recall "VP-2847"

# 3. Read git log
git log --oneline -- src/theme/

# 4. Check git diff
git diff develop...HEAD -- src/theme/

# 5. Manual recovery: Re-read the analysis/architecture
# Expected time: 15-30 minutes
```

**Prevention:** Update context-handoff with decisions BEFORE switching

---

### Failure 2: Code Conflicts or Merge Issues

**Symptom:** "Git merge conflict" / "These changes don't match"

**Root Cause:** Both IDEs modified same file, or uncommitted changes lost

**Recovery:**

```bash
# 1. Check what's uncommitted
git status

# 2. Review recent Beads updates
bd show VP-2847

# 3. Manually resolve conflicts
git diff --name-only --diff-filter=U

# 4. Resolve conflicts in appropriate IDE
# (Usually: Claude Code for analysis, Cursor for code resolution)

# 5. Verify quality gates
npm run quality:gates

# 6. Commit with resolution message
git commit -m "resolve: merge VP-2847 theme implementation"
```

**Prevention:** Commit between IDE switches, always sync Beads first

---

### Failure 3: Quality Gates Fail After Switch

**Symptom:** "ESLint failed" / "TypeScript error" / "Test failed"

**Root Cause:** New IDE uses different rules or setup

**Recovery:**

```bash
# 1. Check what failed
npm run quality:gates  # Full output

# 2. Fix issues in current IDE
# ESLint: Fix style violations
# TypeScript: Fix type errors
# Tests: Debug and fix

# 3. Re-run gates
npm run quality:gates

# 4. If still failing, switch back to fixing IDE
# (Usually: Cursor for code fixes)
```

**Prevention:** Run quality gates BEFORE switching IDEs

---

### Failure 4: Beads Out of Sync

**Symptom:** "Beads status wrong" / "Issue not updated"

**Root Cause:** Forgot to `bd sync --flush-only` before switch

**Recovery:**

```bash
# 1. Run sync now
bd sync --flush-only

# 2. Check database health
bd doctor

# 3. Verify issue status
bd show VP-2847

# 4. Update manually if needed
bd update VP-2847 --status=in_progress
```

**Prevention:** Always run `bd sync --flush-only` before switching

---

## Handoff Checklist Template

Copy this checklist to task Beads comment before switching IDEs:

```
## Pre-Handoff Checklist (IDE: Claude Code → Cursor)

**BEFORE switching:**
- [ ] Beads synced: `bd sync --flush-only`
- [ ] Git status clean: `git status`
- [ ] context-handoff.md updated with full analysis
- [ ] All decisions documented (why, not just what)
- [ ] Tests pass (if applicable)
- [ ] No uncommitted critical code

**AFTER switching:**
- [ ] Beads status updated
- [ ] context-handoff.md read and understood
- [ ] Hindsight recalled (Claude Code only)
- [ ] Quality gates verified
- [ ] Ready to continue work

**Estimated time to switch:** 10-15 minutes
```

---

## Example Handoff Walkthrough

### Real Example: Dark Mode Feature (VP-2847)

#### Claude Code Session Ending

```bash
# In Claude Code, /architect phase complete

# Step 1: Update context-handoff.md
# [see template above]

# Step 2: Validate
bd sync --flush-only
git status
# All clean ✓

# Step 3: Save to Hindsight
mcp__hindsight-alice__retain "VP-2847: Architecture Decision - CSS variables for theme system. Why: Performance + simplicity. Trade-off: IE11+ required."

# Step 4: Update Beads
bd update VP-2847 --comment="Architecture phase complete. Handed off to Cursor for implementation. See .claude/context-handoff/current.md for full context."
```

#### Cursor Session Starting

```bash
# In Cursor, /implement phase

# Step 1: Load context
bd show VP-2847
cat .claude/context-handoff/current.md

# Step 2: Verify setup
npm run quality:gates
# All pass ✓

# Step 3: Continue work
bd update VP-2847 --status=in_progress
/implement VP-2847
# → Implements theme provider based on architecture

# Step 4: Commit when section done
git commit -m "feat: implement theme provider with CSS variables

Based on architecture VP-2847 (CSS variables approach):
- ThemeProvider context wrapper
- useTheme hook
- CSS variable injection
- localStorage persistence"

# Step 5: Update handoff for next switch
# (Add implementation insights, code file references, etc.)
```

#### Claude Code Session Resuming (Review)

```bash
# Back in Claude Code, /review phase

# Step 1: Load context
git diff develop...HEAD
bd show VP-2847
cat .claude/context-handoff/current.md

# Step 2: Review implementation against architecture
/review
# → Snyk scan runs
# → Architecture validation runs
# → Approval or feedback

# Step 3: Approve or create feedback
bd update VP-2847 --comment="✅ Code review passed. Implementation matches architecture spec. Ready for testing phase."
```

---

## Best Practices

### ✅ DO

- **DO** update context-handoff.md immediately when switching
- **DO** include "why" not just "what" in decisions
- **DO** run `bd sync --flush-only` before switching
- **DO** validate quality gates before switching
- **DO** commit code between major IDE switches
- **DO** use Hindsight to preserve key decisions

### ❌ DON'T

- **DON'T** leave uncommitted code when switching
- **DON'T** forget to update Beads status
- **DON'T** skip quality gates
- **DON'T** write minimal context-handoff ("just continue from here")
- **DON'T** switch IDEs mid-thought (finish phase first)

---

## When Handoff Goes Wrong: Recovery Matrix

| Problem | Symptom | Solution | Time |
|---------|---------|----------|------|
| Context lost | "Why was this designed this way?" | Check Hindsight, Beads comments, git log | 15 min |
| Code conflict | Git merge conflict | Resolve in IDE, run quality gates | 20 min |
| Quality gates fail | TypeScript/ESLint error | Fix in current IDE, re-run gates | 15 min |
| Beads out of sync | Status wrong | `bd sync --flush-only`, `bd doctor` | 5 min |
| Tests failing | `npm test` fails | Debug in IDE, fix, retest | 20-30 min |

**All recoveries < 30 minutes if caught early**

---

## Advanced: Multi-Day Handoff Recovery

For features spanning 2+ days across both IDEs:

```bash
# Day 1 - Claude Code (architecture)
1. Document decisions in context-handoff.md
2. Save to Hindsight: retain "Full architecture decision"
3. Store in Beads comment: full architecture spec
4. Commit: "docs: architecture ADR for VP-2847"

# Day 2 - Cursor (implementation)
1. Read context-handoff.md
2. Recall Hindsight (Claude Code not available, but manual notes exist)
3. Reference Beads comment
4. Continue implementation
5. Update context-handoff with progress

# Day 3 - Claude Code (review)
1. Read context-handoff.md (includes implementation notes)
2. Review code: git diff
3. Verify against architecture
4. Close issue or create feedback
```

---

## See Also

- **IDE Decision Flowchart** - When to use each IDE
- **Feature Matrix** - Capability comparison
- **IDE Transition Checklist** - Quick validation before switch
- **Troubleshooting** - IDE-switching problems and recovery

---

**Remember:** Good handoff = 10 minutes of setup time saves 30+ minutes of context recovery. Worth it every time.

🎯 **Golden Rule:** If you wouldn't understand this task from the handoff file, it needs more detail.
