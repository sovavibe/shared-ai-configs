# Advanced Workflows Guide

**Last Updated:** 2026-01-21
**Audience:** Senior developers, tech leads, orchestration specialists
**Context Window:** 200K tokens

---

## Overview

Advanced workflows enable handling of complex, multi-phase projects, high-stakes debugging, and team coordination at scale. This guide covers enterprise-grade workflow orchestration patterns used for:

- Multi-day projects requiring sustained context
- Complex refactoring across multiple teams
- Emergency debugging with verification swarms
- Cross-team feature coordination
- System redesign initiatives

---

## Part 1: Perles Orchestration Framework

### What is Perles?

**Perles** is Claude Code's orchestration TUI (Text User Interface) that coordinates multiple agents across complex workflows. It enables:

- **Sequential execution** - Orchestrated SDLC phases (analyze → architect → plan → implement → test → review)
- **Parallel execution** - Multiple agents working on independent tasks simultaneously
- **Error recovery** - Automatic resumption from failure points
- **Progress tracking** - Real-time visibility into multi-phase work

### Accessing Perles

```bash
# Method 1: Direct TUI
perles

# Method 2: From Claude Code
# /rename "My Project"        # Name session for easy resuming
# (Ctrl+O) → (Ctrl+P)         # Open command palette
# Select: "Interactive SDLC from Prompt"

# Method 3: Label-based triggering
bd update VP-epic-1 --labels="full-sdlc"
# Perles monitors and auto-launches when label added
```

### Perles Navigation

| Key Binding | Action |
|------------|--------|
| `↑/↓` | Navigate menu items |
| `Enter` | Execute workflow |
| `Esc` | Back to previous menu |
| `Ctrl+Q` | Quit |
| `Shift+J` | Jump to progress tracking |
| `Ctrl+O` | Open command palette |
| `Ctrl+P` | Search workflows |

---

## Part 2: Workflow Types

### Workflow 1: Interactive SDLC from Prompt

**Best for:** New ideas, exploratory work, small to medium features

**Flow:**

```
1. User describes idea
2. Coordinator AI asks clarifying questions
3. Auto-creates epic + tasks
4. Launches full SDLC cycle
5. Produces implementation + tests
```

**Entry point:**

```bash
perles
# Ctrl+O → Ctrl+P → "Interactive SDLC from Prompt"
```

**Example session:**

```
Coordinator: "What do you want to build?"
You: "I want to add user preferences panel with theme switching"

Coordinator: "Clarifying questions:
  - Should this persist to localStorage or backend?
  - What themes? Light/Dark only or custom colors?
  - Should it affect other users' views?"

You: "Backend storage, light/dark themes, personal only"

[System auto-creates:]
- Epic: "User Preferences System"
  - Task: Analyze requirements (Opus)
  - Task: Architecture design (Opus)
  - Task: Implementation plan (Sonnet)
  - Task: Implement backend (Cursor)
  - Task: Implement frontend (Cursor)
  - Task: Test suite (Sonnet)
  - Task: Code review (Opus)

[Launches Full SDLC]
```

**Token cost:** 40-60K for complete cycle
**Time to completion:** 4-6 hours

### Workflow 2: Full SDLC Cycle

**Best for:** Well-defined features with clear requirements

**Phases (sequential execution):**

```
┌─────────────────────────────────────────────────────┐
│ PHASE 1: ANALYZE (Opus)                            │
│ - Parse requirements                                │
│ - Identify constraints                              │
│ - Uncover edge cases                                │
│ Output: Analysis document + task breakdown          │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│ PHASE 2: ARCHITECT (Opus)                          │
│ - Design system structure                           │
│ - Define interfaces                                 │
│ - Plan integration points                           │
│ Output: Architecture document + diagrams            │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│ PHASE 3: PLAN (Sonnet)                             │
│ - Break into implementation steps                   │
│ - Identify dependencies                             │
│ - Create detailed TodoWrite                         │
│ Output: Implementation plan + checklist             │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│ PHASE 4: IMPLEMENT (Sonnet)                        │
│ - Execute plan step-by-step                         │
│ - Write tests alongside code                        │
│ - Commit incrementally                              │
│ Output: Working implementation + tests              │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│ PHASE 5: TEST (Sonnet)                             │
│ - Run full test suite                               │
│ - Performance testing                               │
│ - Edge case validation                              │
│ Output: Test results + coverage report              │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│ PHASE 6: REVIEW (Opus)                             │
│ - Security audit                                    │
│ - Code quality check                                │
│ - Architecture validation                           │
│ Output: Review notes + approval                     │
└──────────────────────────────────────────────────────┘
```

**Triggering Full SDLC:**

```bash
# Step 1: Create epic with clear requirements
bd create --type=epic \
  --title="User Authentication System" \
  --description="Implement OAuth 2.0 with social login"

# Step 2: Add to Beads (note the epic ID)
# Result: VP-epic-123

# Step 3: Trigger SDLC workflow
bd update VP-epic-123 --labels="full-sdlc"

# Step 4: Open Perles to monitor
perles
# View shows: phase-sdlc-analyze → phase-sdlc-architect → ...
```

**Phase details:**

| Phase | Model | Duration | Token Cost | Deliverables |
|-------|-------|----------|-----------|--------------|
| Analyze | Opus | 45 min | 12K | Req doc, risks |
| Architect | Opus | 60 min | 15K | Design doc, diagrams |
| Plan | Sonnet | 30 min | 8K | TodoWrite, steps |
| Implement | Sonnet | 120 min | 25K | Code + tests |
| Test | Sonnet | 30 min | 10K | Test report |
| Review | Opus | 45 min | 12K | Approval |
| **Total** | Mixed | 330 min | 82K | Complete feature |

**Token cost:** 60-85K
**Time to completion:** 5-6 hours

### Workflow 3: Epic Parallel Batches

**Best for:** Large epics with independent subtasks (up to 5 parallel)

**How it works:**

```
1. Create epic with 10+ subtasks
2. Tag with "epic-batches" label
3. Perles automatically batches tasks (max 5 per batch)
4. Launches 5 Sonnet workers in parallel
5. Collects results and validates integration
```

**Example: Data Layer Refactoring**

```bash
# Create epic
bd create --type=epic --title="Query Migration to TanStack Query v5"

# Add subtasks (10 features to migrate)
bd create --type=task --title="Migrate user auth queries" --parent=VP-epic-2
bd create --type=task --title="Migrate product queries" --parent=VP-epic-2
bd create --type=task --title="Migrate order queries" --parent=VP-epic-2
bd create --type=task --title="Migrate reporting queries" --parent=VP-epic-2
bd create --type=task --title="Migrate analytics queries" --parent=VP-epic-2
bd create --type=task --title="Add caching strategy" --parent=VP-epic-2
bd create --type=task --title="Update hooks layer" --parent=VP-epic-2
bd create --type=task --title="Write migration tests" --parent=VP-epic-2
bd create --type=task --title="Update documentation" --parent=VP-epic-2
bd create --type=task --title="Performance testing" --parent=VP-epic-2

# Trigger parallel execution
bd update VP-epic-2 --labels="epic-batches"

# Perles creates batches:
# Batch 1: Tasks 1-5 (parallel Sonnet workers)
# Batch 2: Tasks 6-10 (waits for batch 1 to complete)
```

**Parallel execution timeline:**

Without batching: 20 hours (sequential)
With batching: 4-5 hours (5 parallel workers)
**Speedup: 4-5x faster**

**Trigger:**

```bash
bd update VP-epic-2 --labels="epic-batches"
# Perles monitors and auto-launches when batch is ready
```

**Progress tracking:**

```bash
perles
# Shift+J → "SDLC Progress Tracking" view
# Shows all 5 worker statuses in real-time
```

---

## Part 3: Emergency Debugging with Verification Swarms

### What is a Verification Swarm?

A coordinated team of AI agents (verification specialists) that simultaneously investigate a production bug from multiple angles:

- **Root cause hunters** - Trace execution paths
- **Regression detectives** - Find what changed
- **Integration auditors** - Check cross-system impacts
- **Performance profilers** - Identify bottlenecks
- **Security validators** - Ensure no vulnerabilities

### Swarm Activation

**When to use:** Production bug, p0/p1 priority, complex root cause expected

```bash
# Create P0 bug task
bd create --type=task \
  --title="Production: 500 errors on checkout" \
  --priority=critical

# Tag for emergency debugging
bd update VP-task-456 --labels="emergency-debug,p0"

# Perles auto-launches verification swarm
# (if not, trigger manually)
perles → Select "Emergency Verification Swarm"
```

### Swarm Execution

**Role assignments (auto-distributed):**

| Role | Agent | Focus |
|------|-------|-------|
| **Root Cause** | Opus | Call stack analysis, error tracing |
| **Regression** | Sonnet | Git history, recent changes |
| **Integration** | Sonnet | Cross-service communication |
| **Performance** | Haiku | Query optimization, latency |
| **Security** | Opus | Auth, data exposure, injection risks |

**Parallel investigation (all simultaneously):**

```
Opus (Root Cause):
  → Analyzing error logs
  → Tracing call stack
  → Identifying null pointer in line 2847

Sonnet (Regression):
  → Scanning last 10 commits
  → Found: New payment service deployed 2 hours ago
  → Change: Database connection pool size

Sonnet (Integration):
  → Checking payment service API compatibility
  → Verifying timeout configurations
  → Connection pool exhaustion detected!

Haiku (Performance):
  → Query analysis shows 10s response time
  → Previous baseline: 200ms
  → Suggests deadlock or resource contention

Opus (Security):
  → Checking error messages for data exposure
  → No PII leaked in errors
  → Auth still valid, not a compromise
```

**Results consolidation (auto after ~15 minutes):**

```
DIAGNOSIS: Connection Pool Exhaustion
├─ Root Cause: Payment service upgrade increased timeout
├─ Trigger: New service version with 30s default timeout
├─ Impact: Pool depleted within 2 hours under load
├─ Not Regression: Change was intentional
├─ Not Security: No data breach, auth intact
└─ Fix: Reduce timeout to 5s, increase pool size

RECOMMENDED FIX:
  1. Immediate: Rollback to previous version (5 min downtime)
  2. Short-term: Increase pool size to 200 (1 hour fix)
  3. Long-term: Add timeout monitoring and alerting
```

**Time to fix:** 8-12 minutes (vs. 2-3 hours solo debugging)

### Swarm Workflow

```bash
# Step 1: Trigger
bd update <task-id> --labels="emergency-debug"

# Step 2: Monitor in Perles
perles → Shift+J → View progress in real-time

# Step 3: Await consolidation report
# Perles generates markdown report with:
#  - Findings from each role
#  - Consensus diagnosis
#  - Recommended fixes (prioritized)
#  - Implementation steps

# Step 4: Execute fix based on report
# Usually ready to implement within 15 min
```

---

## Part 4: Multi-Day Project Orchestration

### Project Structure

**Day 1: Discovery & Architecture**

```bash
# Morning: Kickoff
perles
# Interactive SDLC from Prompt
# "Build customer dashboard with real-time metrics"

# Coordinator creates:
# - Epic: Customer Dashboard System
# - Tasks for analyze + architect

# Output: Architecture approved, ready for implementation
# Token spent: 35K (fresh session)
# Save context:
mcp__hindsight-alice__retain "Dashboard architecture: {details}"
```

**Day 2: Implementation Begins**

```bash
# Morning: Resume session
claude --resume "Dashboard Project"
# Auto-loads context from hindsight

# Check progress
bd ready --parent=VP-epic-dashboard

# Split work between Claude Code (architecture follow-up)
# and Cursor Agent (implementation)

# Implementation tasks:
bd update VP-task-1 --status=in_progress
# Switch to Cursor Agent for rapid coding
# Claude Code monitors token usage
```

**Day 3: Integration & Testing**

```bash
# Merge implementation branches
# Run full SDLC Test phase

# If issues found, trigger swarm debugging
bd update <failing-test> --labels="emergency-debug"

# Fix and validate
# Prepare for review
```

**Day 4: Review & Deployment**

```bash
# Run SDLC Review phase (Opus)
# Security audit via Snyk
npm run quality:gates

# Prepare release
git tag -a v1.2.0 -m "Dashboard feature"

# Final sync
bd sync --flush-only
```

### Session Handoff Strategy

**Between sessions:**

```bash
# End of Session N
npm run quality:gates           # Pass or fix
git add <files>
git commit -m "feat: dashboard components"
bd sync --flush-only
mcp__hindsight-alice__retain "Day N summary: {achieved}"
/exit

# Start of Session N+1
claude --resume "Dashboard Project"  # Context auto-loads
bd ready
mcp__hindsight-alice__recall "Dashboard architecture"
/compact (if needed)
```

**Context preservation:**

- Token savings: 15K-20K per session by reusing context
- No context loss: All decisions retained in memory bank
- Smooth transitions: No ramp-up time between sessions

---

## Part 5: Complex Refactoring Workflows

### Challenge: Large-Scale Refactoring

Large refactoring requires:

- Minimal context switching
- Consistent code style across changes
- Parallel work by multiple developers
- High verification rigor

### Solution: Refactoring Batching Pattern

**Example: Migrate state management from Redux to Zustand**

**Phase 1: Preparation (Session 1 - 45 min)**

```bash
# Opus analyzes codebase
# Opus designs migration strategy
# Output: Migration guide + risk assessment

# Estimate: 2 weeks, 8 developers, 160 files affected

# Create epic + batch tasks
bd create --type=epic --title="Redux → Zustand Migration"

# Tasks by slice (50 features):
for slice in auth products orders users analytics; do
  bd create --type=task \
    --title="Migrate $slice to Zustand" \
    --parent=VP-epic-zustand
done
```

**Phase 2: Parallel Implementation (Sessions 2-N - 2 weeks)**

```bash
# Batch 1 (Monday): 5 developers × 5 features each
bd update VP-epic-zustand --labels="epic-batches"

# Each developer:
# - Uses shared store template
# - Follows migration guide from Phase 1
# - Writes tests in parallel
# - No blocking on other developers

# Each feature: 4-6 hours, verified independently
```

**Phase 3: Integration Testing (Session N+1 - 1 day)**

```bash
# Verify all 50 migrated features work together
# Performance comparison (Redux vs Zustand)
# Coverage analysis

# If integration issues:
# - Use verification swarm
# - Locate cross-slice dependencies
# - Fix and verify
```

**Results:**

| Metric | Solo Dev | Batch Parallel |
|--------|----------|----------------|
| Duration | 8-10 weeks | 2 weeks |
| Quality gate failures | 15-20% | 5% |
| Rework needed | 30% | 5% |
| Developer satisfaction | Low (repetitive) | High (parallel) |

---

## Part 6: Cross-Team Coordination

### Multi-Team Feature Workflow

**Scenario:** 3 teams working on interdependent features (frontend, backend, platform)

**Coordination structure:**

```
Frontend Team (3 devs)
├─ UI components
└─ State management

Backend Team (2 devs)
├─ API endpoints
└─ Database schema

Platform Team (1 dev)
├─ Infrastructure
└─ Monitoring
```

### Execution Plan

**Week 1: Alignment**

```bash
# Tech lead (Opus) designs interfaces
# Defines API contracts
# Creates shared type definitions

# Each team leads get briefing
bd create --type=task \
  --title="Backend API contract definition" \
  --assignee=backend-lead

bd create --type=task \
  --title="Frontend component interface design" \
  --assignee=frontend-lead
```

**Week 2: Parallel Work**

```bash
# Each team works independently
# Uses mock implementations as needed (MSW)

# Backend: Real API implementation
# Frontend: Mock API for UI development
# Platform: Infrastructure, monitoring setup

# Daily sync-up: 15-min standup
# Weekly integration: Test cross-team functionality
```

**Week 3: Integration**

```bash
# Swap mocks for real APIs
# Integration test suite
# End-to-end testing

# Issues found:
# - Use verification swarm for critical bugs
# - Quick fixes for minor issues
# - Iterate until stable
```

**Coordination via Beads:**

```bash
# Shared epic
bd show VP-epic-feature --include-all-teams

# Each team tracks own tasks
# Shared fields for coupling points
# Cross-references for dependencies
```

---

## Part 7: Emergency Response Patterns

### Pattern 1: Critical Production Bug

**Timeline: 30 minutes to fix**

```bash
# T+0: Bug alert
bd create --type=task --priority=critical \
  --title="Production: X is broken" \
  --labels="emergency-debug,p0"

# T+2: Verification swarm launches
# 5 specialists investigate simultaneously

# T+15: Root cause identified + fix proposed

# T+20: Implement fix (Cursor Agent)

# T+25: Test + quality gates

# T+28: Deploy hotfix

# T+30: Verify + document
```

**Success rate with swarm:** 85%
**Success rate solo:** 30%

### Pattern 2: Mysterious Flaky Tests

**Timeline: 60-90 minutes**

```bash
# Create investigation task
bd create --type=task \
  --title="Flaky test: checkout flow failures" \
  --labels="investigation"

# Option A: Verification swarm
# - Race condition detector
# - Async operation auditor
# - Mock service validator
# - Environment difference checker
# - Test isolation auditor

# Parallel investigation saves 60-70% time
# Usually identifies root cause within 45 min

# Option B: Manual investigation
# Solo detective work
# Could take 2-4 hours
```

---

## Part 8: Quality Assurance Workflows

### Pre-Commit QA Gates

```bash
# Automated in every session
npm run quality:gates

# Runs:
✓ ESLint (code style)
✓ TypeScript (type checking)
✓ Vitest (unit tests)
✓ Test coverage (>80% required)
✓ Build validation
✓ Security scan (Snyk)
```

**If any gate fails:**

```bash
# Perles suggests fixes
# Option 1: Auto-fix (linting)
# Option 2: Interactive fix (with Sonnet guidance)
# Option 3: Exception request (with Opus review)

# Exception workflow:
bd create --type=task \
  --title="QA Exception: {reason}" \
  --assignee=tech-lead

# Tech lead reviews + approves/rejects
```

### Coverage Analysis

**Target:** >80% coverage, >90% critical paths

```bash
# Generate coverage report
npm run test -- --coverage

# Perles analyzes:
# - Coverage by file
# - Gap analysis
# - Risk assessment (low coverage in critical code)

# Create tasks for uncovered code
bd create --type=task \
  --title="Add tests for authentication module (currently 45% coverage)" \
  --priority=high
```

---

## Part 9: Performance & Monitoring

### Performance Monitoring During Development

```bash
# After implementation
npm run build
npm run analyze    # Bundle analysis

# Perles checks:
# - Bundle size changes
# - Runtime performance impact
# - Memory footprint

# If regression detected:
bd create --type=task --priority=high \
  --title="Performance regression: bundle +50KB"
```

### Load Testing Workflow

**For high-traffic features:**

```bash
# Create load test task
bd create --type=task \
  --title="Load test: checkout flow (1000 concurrent users)" \
  --parent=VP-epic-checkout

# Sonnet writes load tests
# Opus reviews for realism
# Execute and analyze results

# If failures:
# - Verify swarm debugs bottlenecks
# - Implement scaling improvements
# - Re-test until targets met
```

---

## Part 10: Governance & Decision Making

### Decision Framework

**When to use each workflow:**

| Scenario | Workflow | When |
|----------|----------|------|
| New idea | Interactive SDLC | < 2 days work |
| Defined feature | Full SDLC | 3-5 days work |
| Epic refactoring | Epic Batches | > 50 subtasks |
| P0 bug | Verification Swarm | Unknown root cause |
| Complex integration | Cross-team | 3+ teams involved |

### When to Escalate

**Solo work insufficient when:**

1. **Unknown root cause** → Verification swarm
2. **Large epic** → Epic batches (> 10 subtasks)
3. **Cross-team dependency** → Orchestrated workflow
4. **Quality concerns** → Add Opus review phase
5. **High risk** → Add architecture review

### Escalation Process

```bash
bd show <task-id>
# If: complexity > can_handle_solo() and token_budget > available

bd update <task-id> --labels="escalate-to-swarm"
# or
bd update <task-id> --labels="escalate-to-opus-review"

# Perles monitors and auto-launches appropriate workflow
```

---

## Part 11: Troubleshooting Workflows

### Common Issues & Solutions

**Issue 1: Workflow Hangs**

```bash
# Check Perles status
perles → Shift+J → View progress

# If stuck for >5 min:
# Option 1: Check network (MCP tools connectivity)
/mcp  # Health check

# Option 2: Manual recovery
bd update <task-id> --labels="phase-recovery"

# Perles resumes from checkpoint
```

**Issue 2: Token Overflow During Workflow**

```bash
# Perles warns at 150K tokens
# Options:
# 1. /compact (saves 15-25K)
# 2. Defer non-critical tasks
# 3. End current phase + resume next session

bd update <epic-id> --labels="phase-sdlc-implement"
# System remembers stopping point
```

**Issue 3: Quality Gate Failure in Workflow**

```bash
# Perles pauses, presents failures
# Options:
# 1. Auto-fix (for linting)
# 2. Manual fix (code changes)
# 3. Exception request (tech lead approval)

# After fix:
npm run quality:gates  # Re-run
# Workflow resumes if passing
```

---

## Part 12: Workflow Templates

### Quick-Start: 1-Day Feature

```bash
# Create task
bd create --type=task --title="Add user avatar display"

# Trigger
bd update VP-task-123 --labels="full-sdlc"

# Monitor
perles

# Expected: 3-4 hours, ready for merge
```

### Quick-Start: 1-Week Refactor

```bash
# Create epic
bd create --type=epic --title="Component library modernization"

# Add 8-10 subtasks (per component)

# Trigger
bd update VP-epic-456 --labels="epic-batches"

# Monitor & manage
# Monitor progress, handle blockers
perles

# Expected: 5 days with 4-5 parallel workers
```

### Quick-Start: P0 Bug Response

```bash
# Create critical task
bd create --type=task --priority=critical \
  --title="Payment processing broken"

# Trigger swarm
bd update VP-task-789 --labels="emergency-debug,p0"

# Await report (~15 min)
# Execute fix immediately
# Expected fix time: 30-45 min total

# Verify + deploy
npm run quality:gates
git commit && git push
```

---

## Part 13: Reference

### Workflow Comparison Matrix

| Aspect | Interactive SDLC | Full SDLC | Epic Batches | Swarm Debug |
|--------|-----------------|-----------|-------------|------------|
| Best for | New ideas | Defined tasks | Large epics | P0 bugs |
| Duration | 4-6 hrs | 5-6 hrs | Days/weeks | 15-30 min |
| Token cost | 50-70K | 60-85K | 80-150K total | 20-30K |
| Complexity | Medium | High | High | High |
| Parallelization | No | No | Yes (5x) | Yes (5x) |
| Manual intervention | Low | Medium | Medium | Low |
| Success rate | 85% | 90% | 80% | 85% |

### Model Assignments by Workflow

| Workflow Phase | Model | Reasoning |
|----------------|-------|-----------|
| Requirements analysis | Opus | Deep comprehension needed |
| Architecture design | Opus | Complex trade-offs |
| Implementation planning | Sonnet | Clear roadmap creation |
| Code implementation | Sonnet/Cursor | Speed and efficiency |
| Testing | Sonnet | Coverage strategy |
| Code review | Opus | Quality assurance |
| Debug investigation | Opus | Complex reasoning |
| Performance analysis | Haiku | Fast profiling |

---

## Summary

Advanced workflows multiply productivity by:

1. **Parallelization** - Multiple agents work simultaneously (5-10x speedup)
2. **Specialization** - Each agent focuses on expertise (better quality)
3. **Orchestration** - Coordinated handoffs (no context loss)
4. **Recovery** - Auto-resume from failures (resilience)
5. **Documentation** - Built-in decision tracking (knowledge retention)

Use these workflows for:

- **10% of work** = Large, complex projects
- **90% of work** = Single-agent standard flow

Choose the right workflow to dramatically improve delivery speed and quality.

---

## Related Documentation

- **TOKEN-OPTIMIZATION.md** - Token budgeting for workflows
- **SDLC-WORKFLOW.md** - Standard SDLC details
- **SESSION-PROTOCOL.md** - Session management
- **CLAUDE.md** - Command reference
- **MCP-GUIDE.md** - Tool availability
