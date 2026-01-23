# Token Optimization Guide

**Last Updated:** 2026-01-21
**Audience:** Senior developers, tech leads, engineering managers
**Context Window:** 200K tokens (Haiku 4.5)

---

## Overview

Effective token management is critical for:

- Maximizing productivity within session constraints
- Reducing costs across distributed teams
- Maintaining context fidelity for complex projects
- Enabling long-running investigations without session restart

This guide covers strategies to optimize token usage, recognize when sessions are approaching limits, and plan multi-day work efficiently.

---

## Part 1: Token Fundamentals

### Token Counting Basics

**Token Metrics:**

- 1 token ≈ 4 characters (rough approximation)
- 1 token ≈ 0.75 words (English text)
- Code tokens ≈ 1 token per character (due to syntax)

**Example Token Counts:**

| Content | Tokens |
|---------|--------|
| CLAUDE.md (full) | ~2,500 |
| Single TypeScript file (300 lines) | ~1,200 |
| Git diff (50 files) | ~8,000-12,000 |
| MCP tool response (typical) | 500-2,000 |
| Screenshot OCR (average) | 800-1,500 |
| Full conversation (50 exchanges) | 15,000-25,000 |

### Token Budget Allocation

**Session Budget: 200K tokens**

Recommended allocation for typical day:

- Session overhead (context loading) - 5,000
- Project context (memory banks, CLAUDE.md) - 10,000
- Working buffer (for tool responses) - 20,000
- Active work (implementation, analysis) - 140,000
- Reserve (unexpected needs) - 25,000

**Critical Threshold:** When approaching 160K, begin preparing session closure.

---

## Part 2: Token Cost Analysis by Operation

### MCP Tool Operations

| Operation | Tokens | Cost Category | Notes |
|-----------|--------|---------------|-------|
| `bd ready` | 800-1,500 | Low | Task list retrieval |
| `bd show <id>` | 500-1,200 | Low | Single task details |
| `mcp__hindsight-alice__recall` | 1,500-3,000 | Medium | Memory bank search |
| `mcp__hindsight-alice__retain` | 800-1,500 | Low | Memory write |
| `get-library-docs` (10K tokens) | 10,000+ | High | Large documentation |
| `resolve-library-id` | 500-800 | Low | Identifier lookup |
| `snyk_code_scan` (full project) | 5,000-15,000 | High | Security scanning |
| `snyk_sca_scan` | 8,000-20,000 | High | Dependency scanning |
| Browser screenshot | 1,000-3,000 | Medium | UI analysis |
| Git diff (large) | 8,000-25,000 | High | Multi-file changes |

### IDE/Model Costs

| Operation | Model | Tokens | Cost Category |
|-----------|-------|--------|---------------|
| Planning with TodoWrite | Sonnet | 3,000-8,000 | Medium |
| Deep analysis (thinkdeep) | GLM-4.7 | 2,000-5,000 | Low-Medium |
| Architecture review | Opus | 5,000-15,000 | High |
| Code implementation | Sonnet | 8,000-20,000 | High |
| Full SDLC cycle | Multiple | 40,000-80,000 | Very High |

---

## Part 3: Optimization Techniques

### 1. Context Compaction (`/compact`)

**When to use:**

- After 60+ exchanges in session
- When response generation slows (>10 seconds per response)
- After large tool operations (git diff, scans)

**What it does:**

- Removes verbose intermediate steps
- Consolidates conversation history
- Retains critical context and decisions
- Typically saves 15,000-25,000 tokens

**Example savings:**

```
Before: 145,000 tokens (73 exchanges)
Command: /compact
After: 118,000 tokens (same context, 27,000 saved)
```

**Best practices:**

- Use once per ~30-40 exchanges
- Always save critical decisions with `retain` before compacting
- Verify context after compacting with `bd ready`

### 2. File Reading Strategy

**HIGH COST - Don't do this:**

```bash
# Read entire 10,000-line generated API file
Read /Users/ap/work/Front/src/shared/api/generated/schema.ts
# Cost: ~6,000 tokens
```

**OPTIMIZED - Do this instead:**

```bash
# Search for specific symbol
Grep --pattern "UserDTO" /Users/ap/work/Front/src/shared/api/generated/
# Then read only the 50-line relevant section
# Cost: ~500 tokens saved
```

**Savings achieved: 85%**

### 3. Selective Tool Usage

**Avoid redundant calls:**

```bash
# ❌ Don't: Multiple separate Grep calls
Grep --pattern "useAuth" src/
Grep --pattern "useQuery" src/
Grep --pattern "useState" src/

# ✅ Do: Single comprehensive Grep
Grep --pattern "use(Auth|Query|State)" src/
# Saves ~1,500 tokens
```

### 4. Memory Bank Pruning

**Before long sessions:**

```bash
# Clean up old memory banks
# Remove reflections older than 7 days
curl -X DELETE "http://localhost:8888/v1/default/banks/reflections"

# Retain only essential decision memory
mcp__hindsight-alice__retain "Active sprint decisions: {summary}"
```

**Token savings:** 3,000-5,000 per session

### 5. Screenshot Optimization

**Reduce OCR token consumption:**

| Technique | Tokens Saved | Use Case |
|-----------|-------------|----------|
| Crop to relevant region (instead of full page) | 30-40% | UI inspection |
| Use `zoom` tool for zoomed region | 20-30% | Detail inspection |
| Ask specific questions instead of general analysis | 40-50% | Error diagnosis |

**Example:**

```
# ❌ General (2,000 tokens):
"Analyze this screenshot for issues"

# ✅ Specific (1,000 tokens):
"What's the error message in the red box?"
```

### 6. Beads Task Context

**Efficient task loading:**

```bash
# ✅ Load only active context
bd ready                    # ~800 tokens (active tasks)

# ❌ Avoid loading full history
bd show <id> --history=full # ~3,000+ tokens
```

---

## Part 4: Session Lifecycle & Planning

### Early Session (0-40K tokens)

**Focus:** High-token operations

- Run comprehensive scans (`snyk_code_scan`)
- Load full documentation (`get-library-docs`)
- Perform git analysis (large diffs)
- Architecture planning and deep analysis

**Typical work:**

- SDLC Analyze phase (Opus deep analysis)
- Architecture decisions
- Complex refactoring planning

### Mid Session (40-120K tokens)

**Focus:** Implementation and iteration

- Standard code implementation
- Test writing
- Integration work
- Regular MCP operations

**Typical work:**

- SDLC Implement phase
- Bug fixing
- Feature development

### Late Session (120-160K tokens)

**Focus:** Winding down

- Use `/compact` if needed
- Complete current task
- Document decisions with `retain`
- Prepare for session closure
- Begin writing final commit

**When to trigger closure:** 155K+ tokens

---

## Part 5: Multi-Day Project Optimization

### Day 1 Setup

```bash
# 1. Load all necessary documentation early
mcp__MCP_DOCKER__resolve-library-id "tanstack query"
mcp__MCP_DOCKER__get-library-docs "/tanstack/query" --tokens=15000

# 2. Run all security scans upfront
mcp__Snyk__snyk_code_scan --path "/Users/ap/work/Front/src"
mcp__Snyk__snyk_sca_scan --path "/Users/ap/work/Front"

# 3. Save high-level architecture decision
mcp__hindsight-alice__retain "Day 1 architecture: {decision details}"

# 4. Create epic with subtasks
bd create --title="Multi-day project" --type=epic

# Token spent: ~60,000
# Remaining: 140,000 for implementation
```

### Day 2 Resume

```bash
# 1. Restore context efficiently
mcp__hindsight-alice__recall "Day 1 architecture"
bd ready --labels="epic:multi-day-project"

# 2. Context compact before full work
/compact

# 3. Continue implementation
# Token spent: ~8,000
# Remaining: 192,000 available (fresh context window)
```

### Token Efficiency for Multi-Day Work

| Approach | Session 1 | Session 2 | Session 3 | Total Cost |
|----------|-----------|-----------|-----------|-----------|
| No planning (reload everything) | 80K | 80K | 80K | 240K |
| With memory banks + compact | 65K | 50K | 50K | 165K |
| Optimized (this guide) | 60K | 45K | 40K | 145K |

**Savings: 95,000 tokens = $1.90 USD (at standard pricing)**

---

## Part 6: Team Budget Management

### Cost Tracking Template

```yaml
Project: Customer Portal UI
Sprint: 2026-01-Q1-Sprint-2
Team: 3 developers

Daily Budget: 600K tokens (200K × 3)
Weekly Budget: 3M tokens

Allocation by Category:
  Architecture & Design: 500K (16%)
  Implementation: 1.8M (60%)
  Testing & QA: 450K (15%)
  Code Review: 200K (7%)
  Documentation: 50K (2%)

Tracking:
  Monday: 580K used (97%)
  Tuesday: 610K used (102% - over budget)
  Wednesday: 520K used (87%)
```

### Budget Overage Prevention

**Early warning system:**

1. **Session start:** Check remaining project budget

   ```bash
   bd show <project-id> | grep "tokens-budget"
   ```

2. **Mid-session:** Monitor token consumption
   - Every 20K tokens, pause and assess progress
   - Ask: "Is this work worth the token cost?"

3. **Team decision points:**
   - Complex refactoring: Get approval before starting (costs 40-80K)
   - New feature: Architect first (prevents expensive rework)
   - Large scan: Schedule during high-budget periods

### Cost Optimization at Team Level

| Strategy | Token Savings | Implementation |
|----------|---------------|-----------------|
| Shared memory banks | 20-30% | One `retain` per pattern, share across team |
| Centralized architecture | 15-25% | Reduce duplicate analysis |
| Scheduled scans (off-peak) | 10-15% | Run security scans once, share results |
| Batch code reviews | 20-30% | Review 5 PRs in one session, not separately |
| Documentation cache | 25-35% | Build reusable decision library |

---

## Part 7: Real-World Examples

### Example 1: Token Savings - Bug Investigation

**Scenario:** Production bug requiring deep analysis

**Approach A (Inefficient) - 28,000 tokens:**

1. Load entire codebase files (12K tokens)
2. Run full security scan (8K tokens)
3. Multiple exploratory Git diffs (5K tokens)
4. Redundant MCP calls (3K tokens)

**Approach B (Optimized) - 8,500 tokens:**

1. Targeted Grep search for error pattern (400 tokens)
2. Read specific bug-related file (800 tokens)
3. Minimal git diff (1,200 tokens)
4. Single `recall` for related past issues (300 tokens)
5. Efficient MCP tool chain (2,000 tokens)
6. Analysis and documentation (3,800 tokens)

**Result: 70% savings (19,500 tokens)**

### Example 2: Multi-Feature Sprint Planning

**Scenario:** Sprint with 5 new features, 3 developers, 3 days

**Budget Allocation:**

- Day 1, Session 1: Architecture phase (Opus) - 50K tokens
- Day 1, Session 2: Planning phase (Sonnet) - 40K tokens
- Day 2-3: Implementation phase (Cursor Agent) - 60K tokens per session
- Review phase: 30K tokens

**Total: 270K tokens per developer = 810K for team**

**Without optimization: 1.2M tokens (48% overage)**

---

## Part 8: When to Start a New Session

### Session Retirement Checklist

**Close session when:**

- [ ] Token count exceeds 155,000
- [ ] Response generation > 15 seconds consistently
- [ ] Memory errors or context loss detected
- [ ] Major work phase complete (good break point)
- [ ] Quality gates passed and commit ready

**Don't close session if:**

- [ ] Deep investigation is mid-progress
- [ ] Complex refactoring requires continuous context
- [ ] Token count below 120K and actively working

### Session Handoff Protocol

```bash
# 1. Save critical context
mcp__hindsight-alice__retain "Session summary: {achievements}"
mcp__hindsight-alice__retain "Next steps: {unfinished work}"

# 2. Run quality gates
npm run quality:gates

# 3. Prepare commit
git add <files>
git commit -m "type(scope): description"

# 4. Sync Beads
bd sync --flush-only

# 5. Close old session
/exit

# 6. New session will auto-load context
bd ready  # Automatic via session-start hook
```

---

## Part 9: Common Optimization Mistakes

### ❌ Mistake 1: Loading Everything Upfront

```bash
# Bad: Load all docs at start
get-library-docs /tanstack/query --tokens=20000
get-library-docs /react --tokens=15000
get-library-docs /typescript --tokens=12000
# Total: 47K tokens before any work

# Better: Load on-demand during implementation
```

### ❌ Mistake 2: Redundant MCP Calls

```bash
# Bad: Multiple separate calls
bd ready
bd ready (again to double-check)
bd blocked
bd blocked (again)

# Better: Single comprehensive call
bd ready --include-blocked
```

### ❌ Mistake 3: Not Using `/compact`

```bash
# After 70 exchanges, session slows
# Haiku: "Response time: 12 seconds"
# Should have compacted at exchange 50
/compact
# Response time: 2 seconds (after compaction)
```

### ❌ Mistake 4: Over-Scanning

```bash
# Bad: Full project scans multiple times
snyk_code_scan /Users/ap/work/Front/src   # 12K
snyk_code_scan /Users/ap/work/Front/src   # 12K (duplicate)

# Better: Schedule once per day, cache results
snyk_code_scan /Users/ap/work/Front/src --cache-valid=24h
```

---

## Part 10: Advanced Techniques

### Token-Aware Decision Making

**Before starting work, ask:**

1. **Token cost:** What MCP operations are needed?
2. **Complexity:** Will this require multiple sessions?
3. **Team impact:** Is this the highest priority use?
4. **Alternatives:** Can this be done more cheaply?

**Decision matrix:**

| Priority | Token Cost | Status |
|----------|-----------|--------|
| Critical bug | 20K | ✅ Proceed |
| Nice-to-have refactor | 40K | ⏳ Defer if budget tight |
| Documentation | 8K | ✅ Proceed |
| Experimental feature | 60K | ❌ Defer to next sprint |

### Streaming Responses for Context Awareness

**Use during high-token situations:**

- Monitor response generation in real-time
- Cancel expensive operations before completion
- Switch to simpler approach mid-conversation

**Example:**

```
User: "Analyze all 50 files for performance issues"
Haiku: "This will cost ~45K tokens, generating response..."
User: "Stop. Just analyze the top 5 by file size."
# Saved: ~35K tokens
```

### Token-Aware Cursor Integration

**In Cursor, when implementing:**

- Keep Claude Code open for analysis (context preserved)
- Use Cursor Agent for iterative implementation
- Avoid switching models mid-implementation
- Share memory banks between IDEs

**Token savings: 20-30% by avoiding re-analysis**

---

## Part 11: Reference Tables

### Token Budget by Task Type

| Task Type | Tokens | Duration | Priority |
|-----------|--------|----------|----------|
| Simple bug fix | 5K-8K | 30 min | Standard |
| Feature implementation | 20K-35K | 2-3 hrs | Standard |
| Architecture review | 15K-25K | 1-2 hrs | High |
| Full SDLC cycle | 40K-80K | 4-8 hrs | High |
| Security audit | 25K-50K | 2-4 hrs | Critical |
| Documentation | 8K-15K | 1-2 hrs | Low |

### Tool Cost Reference

| Tool | First Use | Subsequent | Savings Method |
|------|-----------|-----------|-----------------|
| MCP Library docs | 10K+ | 0 (cached) | Load once per session |
| Git diff | 5K-25K | Use grep for specific | Be targeted |
| Snyk scan | 8K-20K | Skip if recent | Schedule once daily |
| Browser screenshot | 1K-3K | Use crop/zoom | Reduce image size |
| Beads task data | 2K-8K | Use filtering | Load active only |

---

## Quick Reference

**Token Status Indicators:**

- 🟢 **0-80K:** Optimal state, all operations available
- 🟡 **80-150K:** Working normally, start thinking about next steps
- 🟠 **150-170K:** Prepare to close, use `/compact` if needed
- 🔴 **170K+:** Session end imminent, finalize work

**One-Minute Actions to Save Tokens:**

1. Use `/compact` every 40 exchanges
2. Grep before read (targeted file access)
3. Load docs once, reuse throughout session
4. Batch similar operations
5. Use memory banks for patterns

**Session Duration Targets:**

- Light work (docs, reviews): 2-3 hours
- Standard implementation: 3-4 hours
- Deep analysis: 2-3 hours (lighter token usage)
- Full SDLC: Span across 2-3 sessions

---

## Related Documentation

- **SESSION-PROTOCOL.md** - Session lifecycle details
- **MCP-GUIDE.md** - Tool-specific token costs
- **SDLC-WORKFLOW.md** - Multi-phase project planning
- **CLAUDE.md** - Command reference

---

## Summary

Effective token optimization is about:

1. **Awareness** - Know token costs of your operations
2. **Planning** - Front-load expensive operations early
3. **Efficiency** - Use targeted tools instead of broad scans
4. **Batching** - Group similar operations
5. **Memory** - Retain decisions to avoid re-analysis
6. **Discipline** - Use `/compact` regularly

By following these strategies, teams can reduce token usage by 30-50% while maintaining code quality and team productivity.
