# Quick Start: For Tech Leads

> **Your Role:** Make architectural decisions, review quality, unblock teams, guide strategy
>
> **Your IDEs:** Claude Code (primary) | Cursor (code review detail)
>
> **Time to first review:** 30 minutes

---

## 30-Second Overview

You work in **Claude Code** for strategic decisions, then **Cursor** for code review detail. Your job: set direction and ensure quality.

| Task Type | IDE | Time | Command |
|-----------|-----|------|---------|
| Make architecture decision | Claude Code | 45 min | `/architect` with Opus |
| Review code quality | Claude Code | 30 min | `/review` with Snyk |
| Approve feature | Claude Code | 20 min | Verification swarms |
| Debug team issue | Claude Code | 30 min | Opus analysis |
| Document decision | Claude Code | 15 min | `/retain` to save for team |

**Golden Rule:** Your decisions guide the team. Document them carefully.

---

## First 5 Minutes: Setup

### 1. Check Strategic Work

```bash
# See blockers and critical issues
bd blocked

# See current epics
bd list --type=epic

# See your decisions needed
bd ready --priority=0
```

### 2. Open Claude Code

```bash
# Start Claude Code
# Highest context needed = best reasoning

# Load strategic context
@workspace          # Full project understanding
#architecture       # Existing patterns
#decisions          # Past decisions
```

### 3. Know Your Decision Scope

```
Level 1: Feature decisions (analyst + architect)
Level 2: Architecture decisions (tech lead + team)
Level 3: Strategic decisions (tech lead + leadership)
→ You're responsible for Level 2-3
```

---

## Your Core Workflow

### Pattern 1: Make Architectural Decision (45 min)

```bash
# Situation: Team asking "Should we use Redux or Zustand?"

# Step 1: Gather requirements (5 min)
bd show beads-123                   # What's being built?
@src/store                          # What exists now?
/recall "State management decisions"  # What was tried before?

# Step 2: Analyze options (20 min)
/architect beads-123
# Claude Code shows:
# - Zustand pros/cons
# - Redux pros/cons
# - Performance implications
# - Team capability fit

# Step 3: Make decision (10 min)
# Choose: Zustand (simpler API, team familiar with small stores)

# Step 4: Document for team (10 min)
/retain "Decision: Zustand because simpler than Redux for our use case, team experienced with Context API patterns"

bd update beads-123 \
  --comment="Architecture decision: Use Zustand for state management. Rationale: [reasons]. Trade-offs: [alternatives]. Document at [ADR link]"
```

### Pattern 2: Code Review + Security Check (30 min)

```bash
# Situation: PR merged, code needs tech lead review

# Step 1: Load the changes (5 min)
# In Claude Code:
git diff develop...HEAD
@src/app                    # See what changed

# Step 2: Run verification (10 min)
/review
# Claude Code runs:
# ✅ Snyk security scan
# ✅ Architecture validation
# ✅ Design pattern checks
# ✅ Performance review
# Creates findings

# Step 3: Create feedback (10 min)
# If issues found:
bd create \
  --title="[Bug] Security issue in auth flow" \
  --type=bug \
  --priority=1
```

### Pattern 3: Unblock Team on Decision (20 min)

```bash
# Situation: Team stuck on "where should we put this component?"

# Step 1: Understand the question (5 min)
# Talk to developer:
"Show me what you're trying to do"
@their-component

# Step 2: Analyze options (10 min)
/architect [feature-id]
# Claude Code shows options

# Step 3: Recommend path (5 min)
bd update beads-123 \
  --comment="Architecture guidance: Put component at [path] because [reasons]"

# Team unblocked
```

---

## Your Decision-Making Framework

### Question 1: Is This a Real Architectural Decision?

**Ask yourself:**

- Does it affect 2+ teams?
- Will it be hard to change later?
- Does it constrain future decisions?

**If YES:** Use `/architect` in Claude Code (full analysis)
**If NO:** Let the developer decide

### Question 2: What's Our Decision Quality?

**Levels of certainty:**

- 🟡 **Yellow (60-70%):** Viable, but room for improvement
- 🟢 **Green (80%+):** High confidence
- 🔴 **Red (< 60%):** Risky, needs more analysis

**Your job:** Get to 🟢 before committing

### Question 3: What Are We Trading Off?

**Every decision has trade-offs:**

- Speed vs Quality
- Flexibility vs Simplicity
- Scalability vs Development Time
- Team Comfort vs Best Practice

**Document all trade-offs** so team understands the choice

---

## Your Review Checklist

### Before Approving Any Feature

```
Architecture:
[ ] Follows our design patterns
[ ] Proper separation of concerns
[ ] No circular dependencies
[ ] Scalable to 10x current size

Security:
[ ] No secrets in code
[ ] Input validation present
[ ] Auth checks in place
[ ] Snyk scan passed

Performance:
[ ] No N+1 queries
[ ] Memoization where needed
[ ] Bundle impact acceptable
[ ] Load time < 3 seconds

Quality:
[ ] Tests written
[ ] Coverage > 80%
[ ] Quality gates pass
[ ] TypeScript strict mode

Maintainability:
[ ] Clear variable names
[ ] Comments on complex logic
[ ] Error handling present
[ ] Logging useful
```

---

## Your Key Commands

### Command 1: `/architect` - Make Design Decision

```bash
# Use when: Architecture decision needed

/architect beads-123

# Output: Design analysis with options, recommendation, trade-offs
```

### Command 2: `/review` - Full Quality Review

```bash
# Use when: PR ready for final approval

/review

# Output:
# - Snyk security scan
# - Architecture validation
# - Bug findings
# - Suggestions
```

### Command 3: `Verification Swarms` - Multi-Agent Review

```bash
# Use when: Critical code needs multiple expert opinions

# In .claude/PERLES-ORCHESTRATION-GUIDE.md
# Full details on swarms

# Triggers:
# - Security-critical code
# - Architectural changes
# - High-impact bugs
```

### Command 4: `/retain` - Save Decision for Team

```bash
# Use after every major decision

/retain "Decision: [What] because [Why] trade-off [What we gave up]"

# Example:
/retain "Decision: Use CSS variables for theme system because performance and simplicity. Trade-off: IE11+ only (acceptable)"

# Team can recall with /recall
```

---

## Strategic Decisions You'll Make

| Decision | Timeline | Process | Communication |
|----------|----------|---------|-----------------|
| Architecture (new system) | 1-2 hours | /architect + team discussion | ADR + Beads |
| Technology choice (new dep) | 2-3 hours | /architect with comparison | Design doc + demo |
| Performance optimization | 1-2 hours | /architect + /review | Performance report |
| Refactoring strategy | 4+ hours | /plan + team input | Roadmap + tasks |
| Security decision | 1-2 hours | /review + Snyk analysis | Security doc |

---

## Your Team Communication

### Decision Communication Template

```markdown
## Decision: [What did we decide?]

### Why?
[Rationale - why this choice is best]

### Alternatives Considered
- Alternative 1: [why not]
- Alternative 2: [why not]

### Trade-offs
- We gain: [benefits]
- We lose: [costs]

### Impact
- Affects: [teams/systems]
- Timeline: [how long to implement]
- Risk: [potential issues]

### Next Steps
- Developer does: [action]
- We measure: [success criteria]
```

---

## When to Escalate (Ask for Help)

```
| Situation | Action | Time |
|-----------|--------|------|
| Very uncertain decision | Use PAL for second opinion | 30 min |
| Critical code failing | Use Claude Code debug analysis | 30 min |
| Complex multi-team issue | Use Perles orchestration | 2+ hours |
| Can't decide between options | Use verification swarms | 1 hour |
| Need external expertise | Use Context7 research | 20 min |
```

---

## Your First Decision Review (30 Minutes)

### Template

```bash
# 1. Understand the ask (5 min)
bd ready --priority=0
bd show beads-123

# 2. Load context (5 min)
@workspace
#architecture

# 3. Analyze with /architect (10 min)
/architect beads-123

# 4. Make recommendation (5 min)
bd update beads-123 \
  --comment="Decision: [choice] because [reasons]"

# 5. Save to memory (5 min)
/retain "Decision: [captured for future reference]"
```

---

## Monitoring Team Health

Use these metrics to know if team is healthy:

```
✅ Good Signs
- Decisions documented and consistent
- Team knows architecture direction
- Minimal rework from reviews
- Tests passing, coverage high
- PRs merged quickly without blockers

🚩 Warning Signs
- Lot of back-and-forth on PRs
- Team doesn't know direction
- High test failures
- Quality gate violations
- Slow PR review cycle
```

**If warning signs:** Invest in architecture documentation + team alignment

---

## Beads Management for Tech Leads

```bash
# View blockers (what's stuck)
bd blocked

# View high priority work
bd list --priority=0

# Create strategic work
bd create --type=epic --priority=1

# Track team capacity
bd list --status=in_progress --limit=50

# Monitor quality
bd list --type=bug
bd list --type=security
```

---

## Key Concepts

- **ADR:** Architecture Decision Record (document major decisions)
- **Trade-off:** What you give up to get something
- **Verification Swarm:** Multiple agents reviewing code
- **Verification Gates:** Quality checks before approval
- **Strategic Decision:** Affects multiple teams long-term

---

## Advanced: Verification Swarms (Multi-Agent Review)

Use when:

- Security-critical code
- Architectural changes
- High-risk bugs
- New patterns
- Performance optimization

**See:** `.claude/PERLES-ORCHESTRATION-GUIDE.md` for full details

---

## Building Trust as Tech Lead

```
1. Make decisions consistently
2. Document your reasoning
3. Admit when you're wrong
4. Ask team for input
5. Follow through on commitments
6. Celebrate good decisions
7. Learn from mistakes
```

---

## Pro Tips

1. **Ask why before deciding** - Understanding the problem > rushing to solution
2. **Document everything** - `/retain` saves future discussions
3. **Review early and often** - Don't wait until PR for feedback
4. **Be open to alternatives** - Best idea should win, not rank
5. **Measure decisions** - Did it work? Did we hit performance targets?
6. **Teach as you review** - Help team understand why decisions matter

---

## Getting Help

| Question | Where to Go | Time |
|----------|------------|------|
| "Is this architecture good?" | `/architect` in Claude Code | 30 min |
| "What are the security implications?" | `/review` with Snyk | 30 min |
| "Need second opinion on decision?" | PAL for external perspective | 20 min |
| "How should we approach this refactor?" | `/plan` in Claude Code | 45 min |
| "Is this code production-ready?" | Verification swarms | 1 hour |

---

## Remember

Your decisions shape the team's technical direction. Take time to think deeply. Document carefully. Communicate clearly.

🎯 **Ready to lead?** Run `bd blocked` and help unblock your team!
