# Quick Start: For System Analysts

> **Your Role:** Break down requirements, understand scope, create specifications
>
> **Your IDE:** Claude Code (100%)
>
> **Time to first analysis:** 10 minutes

---

## 30-Second Overview

You work exclusively in **Claude Code**. Your job: understand what needs to be built, document requirements, create analysis that guides developers.

| Task Type | IDE | Time | Command |
|-----------|-----|------|---------|
| Break down user story | Claude Code | 20 min | `/analyze "request"` |
| Create specification | Claude Code | 30 min | `/architect` + design doc |
| Understand requirements | Claude Code | 15 min | `bd show beads-123` + ask questions |
| Research pattern | Claude Code | 20 min | `Context7` library lookup |
| Document decision | Claude Code | 10 min | `retain "Decision..."` for history |

**Golden Rule:** Your job is to ask "why" and document the answer.

---

## First 5 Minutes: Setup

### 1. Check Available Work

```bash
# See what's waiting for analysis
bd ready

# Pick an issue to analyze
bd show beads-123

# Claim it
bd update beads-123 --status=in_progress
```

### 2. Open Claude Code + Create Analysis

```bash
# In Claude Code:
# 1. Reference the issue:
@beads-123

# 2. Ask to analyze:
/analyze "Add dark mode support"

# 3. Claude Code breaks it down:
#    - Requirements extracted
#    - Questions identified
#    - User stories documented
#    - Analysis bead created
```

### 3. You Have Your Analysis

---

## Your Core Workflow (Requirements Analysis)

### Phase 1: Understand Current State (5 min)

```bash
# In Claude Code:

# 1. What does the issue description say?
bd show beads-123
# Read: title, description, acceptance criteria

# 2. What's been done before?
/recall "dark mode implementation"
# Hindsight shows similar past work

# 3. What's the user trying to achieve?
# Ask Claude Code: "Why would they want dark mode?"
```

### Phase 2: Run /analyze Command (10 min)

```bash
# In Claude Code:

/analyze "Add dark mode support for enterprise users"

# Claude Code automatically:
# ✅ Extracts user stories
# ✅ Identifies acceptance criteria
# ✅ Documents unknowns/questions
# ✅ Proposes architectural approach
# ✅ Creates analysis bead with all findings
```

### Phase 3: Document Findings (5 min)

```bash
# In Claude Code terminal:

# 1. Review analysis output
# (Claude Code shows structured breakdown)

# 2. Update Beads with findings:
bd update beads-123 --comment="Analysis complete: [summary of findings]"

# 3. Save decision to memory:
/retain "Dark mode analysis: CSS variables approach preferred"
```

### Phase 4: Handoff to Architects (5 min)

```bash
# Create next-phase task:
bd create \
  --title="Architect dark mode system" \
  --type=feature \
  --parent=beads-123 \
  --description="Based on analysis, design theme system"
```

---

## Your Three Main Commands

### Command 1: /analyze - Break Down Requirements

```bash
# Use this for: vague requests, complex features, new domains

/analyze "Let users export data to CSV"

# Output:
# - What does "export" mean?
# - What data? All fields?
# - Which formats?
# - Performance requirements?
# - Error handling?
# → Creates analysis bead with all questions answered
```

### Command 2: /architect - Create Specification

```bash
# Use this for: defining technical approach after analysis

/architect beads-123

# Output:
# - System design
# - Component structure
# - Data flow
# - Key decisions
# - Trade-offs documented
# → Creates architecture bead that developers use
```

### Command 3: Hindsight Memory - Track Decisions

```bash
# Use this to remember past analysis

# Save during analysis:
/retain "Decision: Use CSS variables for themes (not styled-components) because of performance and reusability"

# Later, retrieve:
/recall "Dark mode decisions from last sprint"

# Claude Code shows: past decisions, rationale, outcomes
```

---

## Your Analysis Checklist

Before handing off to developers, ensure you have:

```
[ ] User stories written (what user wants to do)
[ ] Acceptance criteria clear (how to know it's done)
[ ] Assumptions documented (what we're assuming is true)
[ ] Questions asked (what's unclear)
[ ] Risks identified (what could go wrong)
[ ] Dependencies found (what else is needed first)
[ ] Rough estimates (time/complexity guessed)
```

---

## The /analyze Command Breakdown

When you run `/analyze "request"`, Claude Code:

### 1. Extracts Requirements

```
❓ Vague: "Add user preferences"
✅ Clear:
  - Store theme preference (light/dark)
  - Persist across sessions
  - Apply globally to all pages
  - Sync across tabs
```

### 2. Identifies User Stories

```
✅ "As a user, I want to switch themes so I can reduce eye strain at night"
✅ "As a dev, I need theme persistence so users don't lose their preference"
✅ "As support, I need clear defaults so new users aren't confused"
```

### 3. Creates Acceptance Criteria

```
[ ] Users can toggle light/dark mode
[ ] Theme persists on refresh
[ ] Theme persists across browser tabs
[ ] All components respect theme
[ ] WCAG AA contrast standards met
```

### 4. Documents Unknowns

```
❓ Should we support system preference detection?
❓ Which components need theming?
❓ Performance acceptable for 50K users?
```

### 5. Proposes Approach

```
Recommendation: CSS variables + Context API + localStorage
Why: Performance, simplicity, existing patterns
```

### 6. Creates Analysis Bead

```
Beads stores full analysis linked to issue
Other analysts can review and refine
Developers reference during implementation
```

---

## From Analysis to Handoff

### Step 1: Analysis Complete

```bash
# Analysis done, update Beads:
bd update beads-123 --status=review

# Add summary as comment:
bd update beads-123 --comment="Analysis: 5 user stories, 8 acceptance criteria, 3 risks identified"
```

### Step 2: Create Architecture Task

```bash
# Next phase:
bd create \
  --title="Design theme system architecture" \
  --type=design \
  --parent=beads-123 \
  --description="Based on analysis (see parent issue), design the system"
```

### Step 3: Save to Memory

```bash
# Document for future reference:
/retain "Dark mode analysis: Users want fast switching, persistence critical, CSS variables approach"
```

### Step 4: Developers Know What to Do

```
# Developers see:
1. Analysis bead with requirements
2. Architecture bead with design
3. Clear understanding of scope
→ Minimal back-and-forth
```

---

## When to Use Each Tool

| Situation | Tool | Time |
|-----------|------|------|
| "What does the business want?" | `/analyze` | 20 min |
| "How should we build this?" | `/architect` | 30 min |
| "Did we analyze this before?" | `/recall` | 5 min |
| "Where should this live?" | `Context7` + ask | 15 min |
| "What patterns exist?" | `bd show` + search | 10 min |

---

## Common Analyst Tasks

### Task 1: Analyze Vague Feature Request

**Situation:** User says "Make it faster"

```bash
# In Claude Code:
/analyze "Performance improvements needed for dashboard"

# Output:
# - What's slow? (page load, data fetch, rendering?)
# - Who's affected? (all users, power users?)
# - Target performance? (< 3 seconds?)
# - Metrics to measure?
```

### Task 2: Break Down Complex Feature

**Situation:** "Add admin dashboard with user management"

```bash
# In Claude Code:
/analyze "Admin dashboard for user management"

# Output breaks into:
# - User listing
# - User detail view
# - Edit user role
# - Reset password
# - Delete user
# Each as separate acceptance criterion
```

### Task 3: Document Decision Making

**Situation:** "Should we use Zustand or Redux?"

```bash
# In Claude Code:
/architect beads-123

# Claude Code shows:
# - Pros/cons of each
# - Best fits for our use case
# - Performance implications
# - Team familiarity

# Save decision:
/retain "Decision: Use Zustand because simpler API, fewer files than Redux"
```

---

## Hindsight Memory: Your Personal Knowledge Base

### Save Decisions

```bash
/retain "Decision: CSS variables for theme system - benefits: performance, simplicity, override flexibility"
```

### Recall Past Decisions

```bash
/recall "How did we decide on theme system last sprint?"

# Returns: Past analysis, decisions made, rationale
```

### Use Memory in Analysis

```bash
# When analyzing new feature:
/recall "Authentication patterns we've used"

# See: Past approaches, what worked, what didn't
# Apply learnings to current analysis
```

---

## Your Communication with Developers

After analysis, create clear handoff:

```bash
# Example Beads comment:

## Analysis Summary: Dark Mode Support

### User Stories
1. "As a user, I want theme switching for eye comfort"
2. "As support, I need persistent preference"

### Acceptance Criteria
- [ ] Toggle button on header
- [ ] Theme persists across sessions
- [ ] WCAG AA contrast standards
- [ ] Performance < 100ms theme switch

### Architectural Recommendation
- CSS variables (not styled-components)
- Context API (not Redux)
- localStorage (not server-stored)

### Rationale
- Performance: Variables faster than component remounting
- Scope: Not complex enough for Redux
- Simplicity: localStorage sufficient for single-user preference

### Next Phase
@developer: See /architect task for design, then implement
```

---

## Pro Tips for Analysts

1. **Always ask why** - "Why does the user want this?" reveals true needs
2. **Document assumptions** - "We assume X" prevents surprises
3. **Identify risks early** - "This might break Y" helps developers prepare
4. **Save decisions** - `/retain` prevents re-analyzing same question
5. **Link to patterns** - "Similar to dark mode" helps developers find examples
6. **Be specific** - "All users" not "people" makes requirements clear

---

## Your First Analysis (15 Minutes)

### Template

```bash
# 1. Load task (2 min)
bd ready
bd show beads-123

# 2. Run analysis (8 min)
/analyze "Your feature description here"

# 3. Update Beads (3 min)
bd update beads-123 --comment="Analysis: [summary of findings]"

# 4. Create next task (2 min)
bd create --title="Architecture: [feature]" --parent=beads-123
```

---

## Key Concepts

- **User Story:** "As a [role], I want [action] so I can [outcome]"
- **Acceptance Criteria:** Concrete, testable requirements
- **Analysis Bead:** Beads issue tracking your analysis work
- **Hindsight:** Long-term memory across sessions
- **Specification:** Blueprint that developers follow

---

## Next Level: Advanced Analysis

- Learn **Context7** for library research during analysis
- Learn **/architect** for specification-driven development
- Learn **Perles orchestration** for complex, multi-phase analysis
- Learn **Verification swarms** for peer review of analysis

---

## Getting Help

| Question | Where to Go | Time |
|----------|------------|------|
| "How do I write user stories?" | Ask Claude Code in /analyze | 10 min |
| "What's the best approach?" | /architect in Claude Code | 30 min |
| "Is this similar to past work?" | /recall to check Hindsight | 5 min |
| "How do I document this?" | Create analysis bead in Beads | 5 min |
| "What patterns exist?" | Context7 + search codebase | 15 min |

---

## Remember

Your analysis is the blueprint for developers. Clear analysis = less rework = faster delivery.

📋 **Ready to analyze?** Run `bd ready` and pick your first analysis task!
