# Model Capabilities & Selection Guide

**Last Updated:** 2026-01-21
**Audience:** All developers, team leads
**Purpose:** Comprehensive model comparison to guide selection for different work types

---

## Overview

The team has access to multiple AI models with different capabilities, speeds, and costs. Choosing the right model is critical for:

- Maximizing productivity
- Controlling token usage
- Ensuring quality for critical work
- Parallelizing independent tasks

---

## Model Comparison Matrix

### Size & Capability

| Model | Provider | Type | Capability | Speed | Cost | Token Limit |
|-------|----------|------|-----------|-------|------|------------|
| **Claude Opus 4.5** | Anthropic | Native | ⭐⭐⭐⭐⭐ Best | Slow | High | 200K |
| **Claude Sonnet 3.5** | Anthropic | Native | ⭐⭐⭐⭐ Excellent | Medium | Medium | 200K |
| **Claude Haiku 3.5** | Anthropic | Native | ⭐⭐⭐ Good | Fast | Low | 200K |
| **Cursor Agent** | Cursor Inc. | Integrated | ⭐⭐⭐⭐ Excellent | Very Fast | Medium | Session |
| **GPT-5.2** | OpenAI | External (PAL) | ⭐⭐⭐⭐⭐ Best | Slow | High | 400K |
| **GLM-4.7** | Alibaba | External (PAL) | ⭐⭐⭐⭐ Excellent | Medium | Low | 256K |

---

## Claude Opus 4.5

### Profile

- **Best for:** Architecture, deep analysis, critical decisions, code review
- **Reasoning depth:** Exceptional (can solve novel problems)
- **Code quality:** Excellent
- **Training data:** Most recent (Feb 2025)

### Strengths

✅ Deepest reasoning capability
✅ Best for architecture decisions
✅ Excellent code review quality
✅ Handles complex multi-step problems
✅ Strong security analysis
✅ Best for creative solutions

### Weaknesses

❌ Slowest response time (5-10 sec typical)
❌ Highest token cost
❌ Overkill for simple tasks
❌ Not ideal for rapid iteration

### Typical Use Cases

| Task | Rating | Why |
|------|--------|-----|
| Architecture design | ⭐⭐⭐⭐⭐ | Needs deep reasoning |
| System refactoring | ⭐⭐⭐⭐⭐ | Complex trade-offs |
| Security review | ⭐⭐⭐⭐⭐ | Critical quality required |
| Bug root cause (complex) | ⭐⭐⭐⭐ | Excellent debugging |
| Code review (critical) | ⭐⭐⭐⭐⭐ | Catches subtle issues |
| Simple feature | ⭐⭐ | Overkill, use Sonnet |
| Routine bug fix | ⭐⭐ | Overkill, use Sonnet |

### Token Cost Example

```
Architecture design for user dashboard:
- Problem analysis: 2K tokens
- Design exploration: 5K tokens
- Decision documentation: 2K tokens
- Total: ~9K tokens
- Time: 3-5 minutes

Value: High-quality architecture preventing rework
```

### When to Use

**Use Opus when:**

1. Decision impacts multiple systems
2. Security/compliance implications
3. Complex technical trade-offs needed
4. Code review for critical paths
5. Root cause unknown (debugging)

**Don't use Opus for:**

- Routine implementation
- Simple bug fixes
- Documentation updates
- Testing straightforward logic

### Token Cost per Task (Typical)

| Task | Tokens | Time |
|------|--------|------|
| Architecture review | 8-15K | 5-10 min |
| Security audit | 10-20K | 8-15 min |
| Code review (PR) | 6-12K | 5-10 min |
| System design | 12-25K | 10-20 min |
| Complex debugging | 15-30K | 15-30 min |

---

## Claude Sonnet 3.5

### Profile

- **Best for:** Implementation, testing, planning, most day-to-day work
- **Reasoning depth:** Strong (handles most problems effectively)
- **Code quality:** Very good
- **Speed:** Balanced (1-3 sec typical)

### Strengths

✅ Excellent code generation
✅ Strong reasoning for most tasks
✅ Fast response time (1-3 sec)
✅ Good balance of speed/quality
✅ Medium token cost
✅ Best for iterative work

### Weaknesses

❌ Not as deep as Opus for novel problems
❌ Occasional blind spots on architecture
❌ Less suited for security-critical decisions
❌ May miss subtle edge cases

### Typical Use Cases

| Task | Rating | Why |
|------|--------|-----|
| Feature implementation | ⭐⭐⭐⭐⭐ | Excellent code generation |
| Test writing | ⭐⭐⭐⭐⭐ | Covers edge cases well |
| Implementation planning | ⭐⭐⭐⭐ | Clear step breakdowns |
| Routine bug fixes | ⭐⭐⭐⭐ | Quick and effective |
| Code refactoring | ⭐⭐⭐⭐ | Strong on patterns |
| Architecture | ⭐⭐⭐ | Consider Opus instead |
| Security review | ⭐⭐⭐ | Opus preferred |

### Token Cost Example

```
Implement user authentication feature:
- Planning: 2K tokens
- Component implementation: 4K tokens
- Test writing: 2K tokens
- Integration: 1K tokens
- Total: ~9K tokens
- Time: 15-25 minutes (faster than Opus)

Value: Quick, quality implementation ready for review
```

### When to Use

**Use Sonnet when:**

1. Standard feature implementation
2. Writing tests
3. Routine bug fixes
4. Planning and design (not critical)
5. Documentation updates
6. Refactoring well-understood code

**Don't use Sonnet for:**

- Critical architectural decisions
- Security-sensitive code
- Novel technical problems
- Complex system redesign

### Token Cost per Task (Typical)

| Task | Tokens | Time |
|------|--------|------|
| Feature implementation | 8-15K | 10-20 min |
| Test suite | 6-10K | 10-15 min |
| Planning/TodoWrite | 3-8K | 5-10 min |
| Routine bug fix | 3-6K | 5-10 min |
| Documentation | 4-8K | 5-10 min |

---

## Claude Haiku 3.5

### Profile

- **Best for:** Quick analysis, routine operations, high-volume work
- **Reasoning depth:** Good for straightforward problems
- **Code quality:** Good
- **Speed:** Very fast (500ms - 2 sec)

### Strengths

✅ Fastest response time (500ms - 2 sec)
✅ Lowest token cost
✅ Good for high-volume work
✅ Efficient for simple tasks
✅ Excellent for prototyping
✅ Best for quick second opinions

### Weaknesses

❌ Shallow reasoning for complex problems
❌ May miss subtle issues
❌ Not ideal for critical code
❌ Limited for novel problems

### Typical Use Cases

| Task | Rating | Why |
|------|--------|-----|
| Quick analysis | ⭐⭐⭐⭐⭐ | Fast and economical |
| Routine bug fix | ⭐⭐⭐⭐ | Works for simple issues |
| Documentation | ⭐⭐⭐⭐ | Quick and sufficient |
| Performance tips | ⭐⭐⭐⭐ | Good suggestions |
| Error diagnosis | ⭐⭐⭐ | Use Opus if complex |
| Test writing | ⭐⭐⭐ | Sonnet preferred |
| Architecture | ⭐⭐ | Use Opus |

### Token Cost Example

```
Quick API documentation update:
- Analysis: 400 tokens
- Documentation: 600 tokens
- Total: ~1K tokens
- Time: 1-2 minutes

Value: Very economical for routine documentation
```

### When to Use

**Use Haiku when:**

1. Quick analysis needed
2. Simple documentation
3. Routine bug fixes
4. Error diagnosis (if simple)
5. Quick second opinion
6. High-volume routine work

**Don't use Haiku for:**

- Complex architecture
- Security decisions
- Novel technical problems
- Critical code paths

### Token Cost per Task (Typical)

| Task | Tokens | Time |
|------|--------|------|
| Quick analysis | 1-3K | 1-2 min |
| Error diagnosis | 2-4K | 2-3 min |
| Documentation | 2-5K | 2-5 min |
| Routine operation | 1-2K | < 1 min |

---

## Cursor Agent (Continuous)

### Profile

- **Best for:** Rapid code implementation, continuous iteration
- **Reasoning depth:** Very good (specialized for code)
- **Code generation:** Exceptional (autonomous)
- **Speed:** Very fast (generates continuously)

### Strengths

✅ Autonomous code generation (no pauses)
✅ Exceptionally fast code writing
✅ Great for iterative implementation
✅ Real-time feedback (live editor)
✅ Excellent for prototyping
✅ Learns from corrections

### Weaknesses

❌ Not ideal for analysis/planning
❌ Limited reasoning depth
❌ Context smaller than Claude Code
❌ Less good at explaining decisions
❌ Occasional hallucinations in generated code

### Use Cases

| Task | Rating | Why |
|------|--------|-----|
| Feature implementation | ⭐⭐⭐⭐⭐ | Fastest code generation |
| Refactoring | ⭐⭐⭐⭐ | Handles patterns well |
| Component generation | ⭐⭐⭐⭐⭐ | Rapid UI building |
| Test generation | ⭐⭐⭐⭐ | Covers common cases |
| Planning | ⭐⭐ | Claude Code better |
| Architecture | ⭐⭐ | Claude Code better |
| Review | ⭐⭐⭐ | Claude Code better |

### When to Use

**Use Cursor Agent when:**

1. Implementation phase (known requirements)
2. Rapid prototyping needed
3. Iterative refinement
4. Component generation
5. Test writing (standard cases)

**Don't use Cursor Agent for:**

- Planning/architecture
- Code review
- Problem analysis
- Decision making

---

## External Models (PAL - Optional)

### GPT-5.2 (OpenAI)

**Use for:**

- Complex reasoning (alternative to Opus)
- Multi-step problem solving
- Novel technical challenges

**Don't use for:**

- Routine work (use Sonnet)
- Time-sensitive (slower than Sonnet)

**Cost:** Medium-High
**Speed:** Slow (5-10 sec)

---

### GLM-4.7 (Alibaba)

**Use for:**

- Quick research questions
- Alternative analysis perspective
- Lightweight investigations

**Don't use for:**

- Critical decisions (use Opus directly)
- Complex code analysis

**Cost:** Low
**Speed:** Medium (2-5 sec)

---

## Decision Tree: Which Model to Use?

```
START: What am I working on?

├─ ARCHITECTURE or CRITICAL DECISION?
│  ├─ Yes → USE OPUS (best reasoning)
│  └─ No → continue
│
├─ IMPLEMENTATION/CODING?
│  ├─ Yes, rapid iteration → USE CURSOR AGENT
│  ├─ Yes, standard → USE SONNET
│  └─ No → continue
│
├─ QUICK ANALYSIS/ROUTINE?
│  ├─ Yes → USE HAIKU (fast & cheap)
│  └─ No → continue
│
├─ PLANNING/DOCUMENTATION?
│  ├─ Complex planning → USE SONNET
│  ├─ Routine doc → USE HAIKU
│  └─ No → continue
│
├─ SECURITY/COMPLIANCE?
│  └─ USE OPUS (highest quality)
│
├─ UNKNOWN ROOT CAUSE?
│  └─ USE OPUS (deep debugging)
│
└─ DEFAULT → USE SONNET (best all-rounder)
```

---

## Model Selection by SDLC Phase

### Phase 1: Analyze

**Primary:** Opus (deep understanding)
**Alternative:** Sonnet (if budget constrained)
**Duration:** 45 min | **Tokens:** 10-15K

### Phase 2: Architect

**Primary:** Opus (design decisions)
**Alternative:** None (critical phase)
**Duration:** 60 min | **Tokens:** 12-18K

### Phase 3: Plan

**Primary:** Sonnet (clear roadmap)
**Alternative:** Opus (if complex dependencies)
**Duration:** 30 min | **Tokens:** 6-10K

### Phase 4: Implement

**Primary:** Cursor Agent (fastest)
**Secondary:** Sonnet (if in Claude Code)
**Duration:** 120 min | **Tokens:** 20-30K

### Phase 5: Test

**Primary:** Sonnet (coverage strategy)
**Alternative:** Haiku (if simple tests)
**Duration:** 30 min | **Tokens:** 8-12K

### Phase 6: Review

**Primary:** Opus (quality assurance)
**Alternative:** None (critical phase)
**Duration:** 45 min | **Tokens:** 10-15K

---

## Token Cost Comparison

### Implementing a 3-Day Feature

| Approach | Model Mix | Total Tokens | Cost | Time |
|----------|-----------|-------------|------|------|
| All Opus | Opus only | 120K | Very High | 8-10 hrs |
| Optimal (SDLC) | Opus+Sonnet | 75K | High | 5-6 hrs |
| Efficient | Sonnet heavy | 60K | Medium | 6-8 hrs |
| Fast iteration | Cursor only | 40K | Medium | 3-4 hrs |

**Recommendation:** Use SDLC phases (optimal balance of quality/cost/time)

---

## Real-World Examples

### Example 1: Urgent Bug Fix (Production Issue)

**Scenario:** 500 errors on payment processing, root cause unknown

**Model choice: OPUS**

```
1. Opus analyzes logs + code → identifies connection pool exhaustion
2. Sonnet implements quick fix (increase pool size)
3. Total: 20K tokens, 30 min

Why Opus:
- Unknown root cause (needs deep reasoning)
- Production impact (quality critical)
- Complex interactions (payment + database)
```

---

### Example 2: New Feature (Dashboard Widget)

**Scenario:** Add user preferences panel with theme switching

**Model choice: CURSOR AGENT + SONNET**

```
1. Sonnet plans implementation → TodoWrite
2. Cursor Agent generates components rapidly
3. Sonnet writes tests
4. Total: 25K tokens, 2 hours

Why mixed:
- Planning needs clarity (Sonnet)
- Implementation needs speed (Cursor)
- Testing needs coverage (Sonnet)
```

---

### Example 3: System Redesign (Query Library Migration)

**Scenario:** Migrate from Redux to Zustand across 50 features

**Model choice: OPUS (architecture) → SONNET (planning) → CURSOR (implementation)**

```
1. Opus designs migration strategy → 20K tokens
2. Sonnet creates detailed plan → 10K tokens
3. Cursor Agent implements in batches → 80K tokens
4. Sonnet tests each batch → 40K tokens
5. Opus reviews architecture → 15K tokens
Total: 165K tokens, 10-15 hours

Why multi-model:
- Complex architecture needs Opus
- Planning needs clear Sonnet roadmap
- Implementation needs Cursor speed
- Tests need Sonnet coverage
- Review needs Opus quality
```

---

## Performance Benchmarks

### Code Generation Speed

| Model | Lines/Second | Code Quality | Errors |
|-------|-------------|--------------|--------|
| Cursor Agent | ~10-15 | Very Good | ~2-5% |
| Sonnet | ~8-12 | Excellent | ~1-3% |
| Opus | ~5-8 | Exceptional | ~0.5-1% |
| Haiku | ~6-10 | Good | ~3-5% |

**Notes:**

- Cursor Agent generates continuously (no pauses)
- Opus slower but catches more errors
- Error rate includes bugs + style issues

### Analysis Capability

| Model | Simple Problem | Medium Problem | Complex Problem |
|-------|----------------|----------------|-----------------|
| Haiku | 95% success | 70% success | 40% success |
| Sonnet | 98% success | 90% success | 70% success |
| Opus | 99% success | 98% success | 95% success |

**Impact:** Haiku good for known patterns, Opus needed for novel issues

---

## Optimization Strategies

### Strategy 1: Staged Delegation

```
ANALYZE (Opus, 10K) → Find root cause & design
PLAN (Sonnet, 5K) → Create detailed steps
IMPLEMENT (Cursor, 20K) → Generate code fast
TEST (Sonnet, 8K) → Write comprehensive tests
REVIEW (Opus, 10K) → Quality assurance

Total: 53K tokens (vs 120K if all Opus)
Benefit: 56% token savings, same quality
```

### Strategy 2: Parallel Work

```
Team has 3 developers + 200K token budget

Option A (Sequential):
- Dev 1: Full SDLC (85K)
- Dev 2: Full SDLC (85K)
- Dev 3: Waits (0K)
Problem: Dev 3 idle, doesn't scale

Option B (Parallel batches):
- Opus: Architect all 3 features (30K)
- Sonnet: Plan all 3 features (15K)
- Cursor (Dev 1): Implement Feature A (25K)
- Cursor (Dev 2): Implement Feature B (25K)
- Cursor (Dev 3): Implement Feature C (25K)
- Sonnet: Test all 3 (30K)
- Opus: Review all 3 (25K)
Total: 175K tokens, all 3 devs working, faster delivery
```

### Strategy 3: Context Preservation

```
Session 1:
- Opus: Architecture (20K)
- Save decision with mcp__hindsight-alice__retain
- Cost: 20K tokens

Session 2:
- Recall architecture (1K, not 20K)
- Sonnet: Implement based on saved design (20K)
- Cost: 21K tokens (vs 40K if re-designed)
Savings: 19K tokens!
```

---

## Team Guidelines

### Daily Work

- **Default:** Use Sonnet (best all-rounder)
- **When uncertain:** Ask yourself "Is this critical?"
  - Yes → Use Opus
  - No → Use Sonnet or Haiku

### Architecture & Design Meetings

- **Always use Opus** for discussions
- Document decisions with `mcp__hindsight-alice__retain`
- Reuse across sessions (save 15-20K tokens per project)

### Implementation Sprints

- **Cursor Agent for speed** (continuous generation)
- **Sonnet for quality** (code review in Claude Code)
- **Haiku for docs** (quick documentation)

### Production Issues

- **Always start with Opus** (if root cause unknown)
- **Verification swarms** for P0 bugs (5 agents in parallel)

---

## Quick Reference Card

### Pick your model in 10 seconds

```
Q: Do I need deep reasoning?
A: Yes → OPUS | No → continue

Q: Am I implementing code?
A: Yes (Cursor) → CURSOR AGENT | Yes (Code) → SONNET | No → continue

Q: Is this routine/quick?
A: Yes → HAIKU | No → continue

Q: Is this critical (security/architecture)?
A: Yes → OPUS | No → SONNET
```

### Token Budget Guide

- **Opus**: 10-30K per use (critical work only)
- **Sonnet**: 5-20K per use (standard work)
- **Haiku**: 1-5K per use (routine work)
- **Cursor**: 5-30K per implementation (all-in for features)

---

## Summary

| Model | Best For | Speed | Cost | When |
|-------|----------|-------|------|------|
| **Opus** | Architecture, security, debugging | Slow | High | Critical decisions |
| **Sonnet** | Implementation, planning, testing | Medium | Medium | Most work |
| **Haiku** | Quick analysis, documentation | Fast | Low | Routine tasks |
| **Cursor** | Code generation, iteration | Very Fast | Medium | Rapid implementation |

**Golden Rule:** Use the simplest model that solves your problem. Save Opus for when it matters most.

---

## Related Documentation

- **CLAUDE.md** - Model switching commands
- **Token-Optimization.md** - Token budgeting
- **Advanced-Workflows.md** - Multi-model workflows
- **SDLC-Workflow.md** - Phase recommendations
- **FAQ.md** - "When should I use X model?"
