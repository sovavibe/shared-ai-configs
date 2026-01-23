# Quick Start: For Developers

> **Your Role:** Write code, implement features, build components
>
> **Your IDEs:** Cursor (90%) | Claude Code (10%)
>
> **Time to first feature:** 15 minutes

---

## 30-Second Overview

You work primarily in **Cursor**. When you hit a complex architectural issue, switch to **Claude Code** temporarily.

| Task Type | IDE | Time | Command |
|-----------|-----|------|---------|
| Implement feature | Cursor | 30 min | Write code directly |
| Generate tests | Cursor | 20 min | `@test` in context |
| Quick bug fix | Cursor | 10 min | Find and fix |
| Architecture confusion | Claude Code | 30 min | `/architect beads-123` then switch back |
| Code review | Claude Code | 30 min | `/review` then switch back |

**Golden Rule:** If you know what to do → Cursor. If you're confused → Claude Code.

---

## First 5 Minutes: Setup

### 1. Know Your Task

```bash
# Check what's ready
bd ready

# Pick a task
bd show beads-123

# Claim it
bd update beads-123 --status=in_progress
```

### 2. Open Cursor + Load Context

```bash
# Start Cursor
cursor .

# In Cursor, load context:
@beads-123        # Reference the Beads issue
#architecture     # Search for architecture patterns
@workspace        # Include full context if needed
```

### 3. You're Ready to Code

---

## Your Core Workflow (30-Minute Feature)

### Phase 1: Understanding (5 min)

```bash
# In Cursor:
# 1. Read the issue description (@beads-123)
# 2. Find similar components (@workspace search)
# 3. Ask Cursor: "What's the simplest way to..."

# If architecture is unclear, ask:
# "@architecture what should the folder structure be?"
```

### Phase 2: Implementation (20 min)

```bash
# Write your component:
# 1. Create file: src/widgets/MyWidget/MyWidget.tsx
# 2. Cursor suggests code inline
# 3. Tab to accept suggestions
# 4. Refine as needed

# Cursor will auto-suggest:
- Component structure
- Props interface
- Export statements
- TypeScript types
```

### Phase 3: Testing (3 min)

```bash
# In Cursor terminal:
# 1. Generate tests: /test or @test
# 2. Run: npm run test

# Cursor generates test file automatically
# Run quick test to verify
```

### Phase 4: Quality Check (2 min)

```bash
# In Cursor terminal:
npm run quality:gates

# If it fails:
# 1. Read error messages
# 2. Ask Cursor: "How do I fix ESLint error X?"
# 3. Cursor suggests fix
# 4. Apply and re-run
```

---

## When to Switch to Claude Code (Red Flags)

### 🚩 You're Stuck on Architecture

**Symptom:** "I don't know where to put this code" or "Should I use Context or Redux?"

**Action:**

```bash
# Switch to Claude Code (same project)
/architect beads-123

# Claude Code analyzes architecture
# You get design recommendation

# Back to Cursor when ready
```

### 🚩 Complex Feature with Many Dependencies

**Symptom:** "This touches 5 different files and I'm not sure about the sequence"

**Action:**

```bash
# In Claude Code:
/plan beads-123

# You get:
# - Task breakdown (TodoWrite)
# - File dependency map
# - Implementation sequence

# Switch back to Cursor with plan
```

### 🚩 Code Review Found Issues

**Symptom:** PR review came back with "architecture concerns"

**Action:**

```bash
# Go to Claude Code, wait for review feedback
# /review runs security scan + architecture check
# Follow recommendations
# Switch to Cursor to fix
```

---

## Command Cheat Sheet (Your Most-Used Commands)

### Cursor Commands

```bash
Tab              # Accept inline suggestion
Escape           # Reject suggestion
Cmd+K            # Open code generation
Cmd+Shift+L      # Open chat sidebar
@filename        # Reference specific file
#search          # Search codebase
/test            # Generate tests
/debug           # Debug assistant
```

### Cursor + Beads Workflow

```bash
# At session start:
bd ready              # See available tasks

# During work:
bd show beads-123     # Check task details
@beads-123            # Reference in Cursor

# When done:
bd close beads-123    # Mark complete
npm run quality:gates # Verify all good
git add . && git commit -m "feat: ..."
```

### When You Need Claude Code

```bash
# Temporarily switch (same project)
/architect beads-123   # Get architecture guidance
/plan beads-123        # Get implementation plan
/review                # Get code review before PR
```

---

## Your 3 Most-Used Patterns

### Pattern 1: Generate Component + Tests

```bash
# In Cursor:
# 1. Create src/widgets/Card/Card.tsx
# 2. Write component
# 3. Tab to accept suggestions
# 4. Run: /test
# 5. Cursor generates test file
# 6. npm run test to verify
```

### Pattern 2: Fix Bug Fast

```bash
# In Cursor:
# 1. @workspace search for bug symptoms
# 2. Find suspect file
# 3. Ask: "Why might this fail?"
# 4. Apply fix
# 5. npm run test [file]
# 6. npm run quality:gates
```

### Pattern 3: When Architecture Isn't Clear

```bash
# In Claude Code:
/architect beads-123
# Get design guidance

# Back in Cursor:
# Now implement following the design
```

---

## Common Problems & Solutions

| Problem | Solution | Time |
|---------|----------|------|
| "My component doesn't compile" | Ask Cursor: "Fix TypeScript errors" | 5 min |
| "ESLint is complaining" | `npm run lint -- --fix`, then ask Cursor | 5 min |
| "Test is failing" | Run with `-t "test name"` to debug | 10 min |
| "I'm not sure about architecture" | Switch to Claude Code + `/architect` | 30 min |
| "Code review said refactor" | Back to Claude Code + `/review` for guidance | 30 min |
| "Beads issue is unclear" | `bd show beads-123` + @beads reference in Cursor | 5 min |

---

## Feature You'll Use Most

### Automode for Repetitive Tasks

When you have many similar tasks (add propTypes to 10 components, refactor tests, etc.):

```bash
# In Cursor:
# Enable Automode (Cursor settings)
# Ask: "Add PropTypes to all components in src/widgets/"
# Cursor runs non-stop until done
# Review and commit
```

---

## When Not to Use Cursor

❌ **Don't use Cursor for:**

- Critical architecture decisions (go to Claude Code)
- Security reviews (go to Claude Code /review)
- Performance optimization complex analysis (go to Claude Code)
- Learning unfamiliar patterns (go to Context7 in either IDE)

---

## Your First Day Checklist

```bash
# ✅ Setup (5 min)
[ ] Run: bd ready
[ ] Pick a simple task (beads-123)
[ ] Open Cursor

# ✅ First Feature (30 min)
[ ] Read issue description
[ ] Ask Cursor: "What's the simplest approach?"
[ ] Write code
[ ] Generate tests
[ ] Run quality gates

# ✅ Validation (5 min)
[ ] All tests pass
[ ] Quality gates pass
[ ] Ready to commit

# ✅ If Stuck (30 min)
[ ] Switch to Claude Code
[ ] /architect or /plan
[ ] Get guidance
[ ] Back to Cursor
```

---

## Key Concepts to Know

- **Beads:** Task tracking system (`bd ready`, `bd close`, etc.)
- **Quality Gates:** Automatic checks before commit (`npm run quality:gates`)
- **Context Handoff:** Safe way to switch between IDEs (see Context-Handoff-Protocol.md)
- **Architecture Decision:** Use Claude Code when unsure

---

## Next Level: When You're Ready

- Learn **Cursor Automode** for batch operations
- Learn **/architect** in Claude Code for design decisions
- Learn **Context7** for unfamiliar libraries
- Learn **Hindsight memory** to track complex patterns across sessions

---

## Getting Help

| Question | Where to Go | Time |
|----------|------------|------|
| "How do I use Cursor?" | Cursor built-in help (Cmd+?) | 5 min |
| "How should I structure this?" | Claude Code /architect | 30 min |
| "What pattern should I use?" | Context7 lookup + Cursor coding | 15 min |
| "Is my code good quality?" | Claude Code /review | 30 min |
| "I'm stuck and confused" | Claude Code /plan then back to Cursor | 45 min |

---

## Pro Tips

1. **Use Cursor suggestions liberally** - They're usually right, then refine
2. **Generate tests early** - `/test` catches issues fast
3. **Run quality gates often** - Before committing, not after
4. **Switch to Claude Code only when needed** - Context switching has overhead
5. **Keep Beads updated** - Other devs need to know your status

---

**Remember:** 90% in Cursor, 10% in Claude Code. You'll know when you need to switch.

🚀 **Ready to code?** Run `bd ready` and pick your first feature!
