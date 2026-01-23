# Beads Integration: Task Management in IDE Workflow

> **Purpose:** Comprehensive guide to Beads task management system, integration with Claude Code and Cursor, and team collaboration patterns.
>
> **Use this when:** "How do I track work?", "What is Beads?", "How do I create/update tasks?", "How do I coordinate with my team?"

---

## What is Beads and Why We Use It

### The Problem It Solves

In traditional development workflows, task tracking often lives in separate tools (Jira, GitHub Issues, Notion). This creates friction:

- **Context switching**: IDE → Browser → Task tracker → back to IDE
- **Async updates**: AI makes changes to code, human forgets to update task status
- **Loss of context**: Decision rationale disappears when task is closed
- **Parallel work struggles**: Hard to see blocking dependencies

### Why Beads (Not Jira/GitHub Issues)

Beads is a **task database tightly integrated into your CLI workflow**. It lives alongside your code:

```
/Users/ap/work/Front/
├── src/
├── package.json
├── .beads/                    # ← Beads database
│   └── issues.jsonl           # All tasks
├── bd.json                    # Beads config
└── CLAUDE.md                  # These instructions
```

**Key Advantages:**

✅ **CLI-first**: `bd create`, `bd update` from terminal
✅ **IDE-aware**: Claude Code and Cursor both understand Beads context
✅ **Semantic search**: Find tasks by meaning, not just keywords
✅ **Dependency tracking**: Mark which tasks block others
✅ **Syncing**: Auto-export to `issues.jsonl` for external tools (CI/CD, dashboards)
✅ **Offline-capable**: Full task database is local
✅ **AI-friendly**: Beads format is designed for LLM understanding

### The Beads Philosophy

**One source of truth**: Your tasks live in one place. When you create a bead, update it, or close it, that's the canonical record. All other tools (GitHub, Jira, dashboards) sync FROM Beads, not the other way around.

---

## Setup: Beads Auto-Detection

### Step 1: Verify `.beads/` Directory Exists

```bash
cd /Users/ap/work/Front

# Check if .beads/ exists
ls -la .beads/

# If not, initialize beads
bd init
```

### Step 2: Verify Setup

```bash
# Check that Beads recognizes your project
bd status

# Expected output:
# Beads Status: Ready
# Project: Front
# Database: /Users/ap/work/Front/.beads/issues.jsonl
# Tasks: 42 (3 in progress, 5 blocked)
```

### Step 3: Load Initial Context

```bash
# See what work is ready for you
bd ready

# Example output:
# Ready Tasks (10):
# - beads-123: Fix login validation
# - beads-124: Add dark mode toggle
# - beads-125: Refactor API client
```

### What Auto-Detection Does

When `.beads/` exists:

- **Claude Code auto-loads** `bd ready` at session start
- **Cursor can reference** `@beads-123` in prompts
- **Commands work**: `bd create`, `bd update`, `bd close`
- **Syncing works**: `bd sync --flush-only` exports to CI/CD
- **Team collaboration**: `bd push`/`bd pull` shares task status

When `.beads/` doesn't exist:

- Beads CLI still available
- But IDE integration is silent
- Auto-syncing on commit doesn't happen
- Run `bd init` to enable integration

---

## Creating Tasks: `bd create`

### Basic Task Creation

```bash
# Simple task
bd create --title="Fix API error handling" --type=task

# With description
bd create \
  --title="Fix API error handling" \
  --type=task \
  --description="Users see 500 errors when network fails. Implement retry logic with exponential backoff."

# Example output:
# Created: beads-456
# Title: Fix API error handling
# Status: backlog
```

### Task Types

| Type | Use For | Example |
|------|---------|---------|
| `task` | Regular work items | "Implement dark mode toggle" |
| `bug` | Issues/fixes | "Login button not clickable on mobile" |
| `feature` | New functionality | "Add export to CSV" |
| `doc` | Documentation | "Write API integration guide" |
| `spike` | Research/investigation | "Evaluate new state management library" |
| `epic` | Large initiatives (multiple tasks) | "Rebuild authentication system" |
| `subtask` | Task breakdown (child of parent) | "Create password reset component" |

### Advanced Options

```bash
# Create feature with full context
bd create \
  --title="Add dark mode support" \
  --type=feature \
  --description="Users request dark theme for reduced eye strain" \
  --assignee="your-name-or-email" \
  --priority=high \
  --estimate=8 \
  --labels=ui,theme,feature

# Create subtask under parent
bd create \
  --title="Create color palette variables" \
  --type=subtask \
  --parent=beads-100 \
  --assignee="designer@team.com" \
  --estimate=3

# Create bug with priority
bd create \
  --title="Payment form crashes on Safari" \
  --type=bug \
  --priority=critical \
  --description="Reported by 5 users. Form submission errors on Safari 17.2" \
  --estimate=2
```

### Beads Field Reference

| Field | Required | Values | Example |
|-------|----------|--------|---------|
| `title` | ✅ Yes | String, any length | "Fix login validation" |
| `type` | ✅ Yes | task\|bug\|feature\|doc\|spike\|epic\|subtask | task |
| `description` | Optional | Markdown supported | "When user clicks..." |
| `assignee` | Optional | Email or name | "<john@company.com>" |
| `priority` | Optional | critical\|high\|medium\|low | high |
| `status` | Optional | backlog\|ready\|in_progress\|review\|done | backlog |
| `estimate` | Optional | Number (hours) | 8 |
| `labels` | Optional | Comma-separated | "ui,bug,urgent" |
| `parent` | Optional (for subtasks) | Beads ID | beads-100 |
| `blockedBy` | Optional | Beads ID | beads-50 |
| `dueDate` | Optional | ISO format | "2026-02-15" |

---

## Updating Task Status: `bd update`

### Status Workflow

Tasks move through states:

```
backlog → ready → in_progress → review → done
```

**Status meanings:**

- **backlog**: Task exists but not ready to start (waiting on dependencies)
- **ready**: All blockers cleared, task is ready to pick up
- **in_progress**: Someone is actively working on it
- **review**: Work done, waiting for approval
- **done**: Task complete, closed

### Claiming a Task

```bash
# Pick up a task you're going to work on
bd update beads-123 --status=in_progress

# With effort tracking
bd update beads-123 --status=in_progress --assignee="your-name"

# Useful for team: others know you're on it
```

### Status Transitions

```bash
# Move task ready
bd update beads-123 --status=ready

# Start working
bd update beads-123 --status=in_progress

# Submit for review
bd update beads-123 --status=review --comment="Ready for review"

# Close task
bd update beads-123 --status=done --comment="Merged to main"
```

### Adding Comments

```bash
# Comment when updating
bd update beads-123 --status=review --comment="Created tests, ready for review"

# Just comment without status change
bd update beads-123 --comment="Found edge case with null values, investigating"

# Reference other tasks in comment
bd update beads-123 --comment="Blocked by beads-50. Will resume when resolved."
```

### Updating Fields

```bash
# Re-estimate
bd update beads-123 --estimate=12 --comment="Underestimated complexity"

# Change priority
bd update beads-123 --priority=critical

# Add labels
bd update beads-123 --labels="urgent,frontend,api-issue"

# Reassign
bd update beads-123 --assignee="colleague@company.com"

# Mark blocked
bd update beads-123 --blockedBy=beads-50 --comment="Waiting for backend API"
```

### Common Update Patterns

```bash
# Developer workflow
bd create --title="My task"                    # Create
bd update beads-X --status=in_progress         # Start work
# ... code ...
bd update beads-X --status=review              # Push for review
# ... review feedback ...
bd update beads-X --status=done                # Close when approved

# Team workflow
# Analyst creates and assigns to developer
bd create --type=task --assignee="dev@team.com"

# Developer claims it
bd update beads-X --status=in_progress

# Tech lead reviews
bd update beads-X --status=review --comment="LGTM, approved"

# Developer closes
bd update beads-X --status=done
```

---

## Viewing and Filtering Issues

### Quick Views

```bash
# Your ready-to-work tasks
bd ready

# Your active tasks
bd status

# Show specific task
bd show beads-123

# All tasks
bd list

# Tasks assigned to you
bd list --assignee=me

# Tasks blocking me
bd blocked

# Recently closed
bd closed --limit=10
```

### Advanced Filtering

```bash
# By priority
bd list --priority=critical
bd list --priority=high

# By type
bd list --type=bug
bd list --type=feature

# By label
bd list --labels=frontend
bd list --labels=api-issue

# By assignee
bd list --assignee=alice@company.com
bd list --assignee=me

# By status
bd list --status=in_progress
bd list --status=review

# Combined filters
bd list --type=bug --priority=high --status=review
```

### Viewing Task Details

```bash
# Full task details
bd show beads-123

# Example output:
# ┌─────────────────────────────────────────┐
# │ BEADS-123: Fix login validation         │
# ├─────────────────────────────────────────┤
# │ Status: in_progress                     │
# │ Type: bug                               │
# │ Priority: high                          │
# │ Assignee: you (alice@company.com)       │
# │ Estimate: 3 hours                       │
# │ Labels: auth, validation, bug           │
# │ Created: 2026-01-15                     │
# │ Blocked by: none                        │
# │ Blocks: beads-125                       │
# ├─────────────────────────────────────────┤
# │ Description:                            │
# │ Users can submit empty email field.     │
# │ Should validate before API call.        │
# ├─────────────────────────────────────────┤
# │ Comments:                               │
# │ [2026-01-20 10:30] Alice:               │
# │ "Started work, found regex needs fix"   │
# └─────────────────────────────────────────┘
```

---

## Dependencies and Blocking

### Understanding Blocking

Task A **blocks** Task B when:

- Task B cannot start until Task A is done
- Example: "Backend API endpoint" blocks "Frontend integration"

### Marking Dependencies

```bash
# Task B is blocked by Task A
bd update beads-B --blockedBy=beads-A --comment="Waiting for API endpoint"

# Or when creating
bd create \
  --title="Frontend API integration" \
  --type=task \
  --blockedBy=beads-A \
  --description="Implement user profile endpoint consumption"

# View blocking relationships
bd show beads-B
# Output shows:
# Blocked by: beads-A (Backend API endpoint)
```

### Unblocking Tasks

```bash
# When blocker is resolved
bd update beads-B --blockedBy=none --comment="beads-A is done, unblocking"

# Alternatively, just update status
bd update beads-B --status=ready --comment="Ready to implement, blocker resolved"
```

### Multi-Task Dependencies

```bash
# Epic blocks multiple tasks
bd create --type=epic --title="Authentication redesign"  # beads-A

# Create subtasks
bd create --type=task --parent=beads-A --title="Design spec"  # beads-B1
bd create --type=task --parent=beads-A --title="Backend changes"  # beads-B2
bd create --type=task --parent=beads-A --title="Frontend changes"  # beads-B3

# B2 blocks B3
bd update beads-B3 --blockedBy=beads-B2

# Team works in parallel
# Alice: Works on beads-B1 (design)
# Bob: Works on beads-B2 (backend)
# Charlie: Waits on beads-B3 (frontend, blocked by B2)
```

### Dependency Visualization

```bash
# See all dependencies
bd graph

# Example output:
# beads-100 (epic)
# ├── beads-101: Design ✓ done
# ├── beads-102: Backend → blocks
# │   └── beads-103: Frontend (waiting)
# └── beads-104: Tests (ready)
```

---

## Syncing: `bd sync --flush-only`

### Why Syncing Matters

Beads stores tasks in `.beads/issues.jsonl`. To make this useful for external tools:

- **CI/CD pipelines** need to know task status
- **Dashboards** need to show progress
- **GitHub Actions** need to check for blockers
- **Team visibility** needs shared state

### The Sync Process

```bash
# Export tasks to issues.jsonl (for external consumption)
bd sync --flush-only

# What happens:
# 1. Reads all tasks from Beads database
# 2. Formats as JSONL (one JSON per line)
# 3. Writes to .beads/issues.jsonl
# 4. Git doesn't commit this (it's in .gitignore)
# 5. CI/CD can read it for automation
```

### When to Sync

```bash
# MANDATORY locations:
# 1. Before pushing changes
bd sync --flush-only
git push

# 2. When task status changes significantly
bd update beads-123 --status=done
bd sync --flush-only

# 3. End of session
bd sync --flush-only

# 4. Session start (to get latest team updates)
bd sync --pull   # Get updates
bd sync --flush-only  # Export your changes
```

### Sync in Git Workflow

```bash
# Typical commit sequence
git add src/components/Login.tsx
git commit -m "fix: improve email validation"

# At push time
bd sync --flush-only
git push

# In CI/CD (automated)
# GitHub Actions reads .beads/issues.jsonl
# Marks referenced tasks as "in PR"
# Links PR to task automatically
```

### Sync Output

```bash
bd sync --flush-only

# Output:
# Syncing Beads...
# 📤 Exported 47 tasks to .beads/issues.jsonl
# ✅ Ready for CI/CD consumption
```

---

## Common Beads Workflows

### Workflow 1: Creating Feature Epic with Subtasks

**Scenario:** You're starting a feature "Add user preferences"

```bash
# Step 1: Create epic
bd create \
  --type=epic \
  --title="User Preferences" \
  --description="Allow users to customize theme, language, notifications" \
  --priority=high \
  --estimate=16

# Assume it's beads-200

# Step 2: Break into tasks
bd create --type=task --parent=beads-200 \
  --title="Design preference UI" \
  --assignee=designer@team.com \
  --estimate=4

bd create --type=task --parent=beads-200 \
  --title="Create backend endpoint" \
  --assignee=backend@team.com \
  --estimate=6

bd create --type=task --parent=beads-200 \
  --title="Implement frontend form" \
  --blockedBy=beads-202 \
  --estimate=5

bd create --type=task --parent=beads-200 \
  --title="Write tests" \
  --blockedBy=beads-203 \
  --estimate=3

# Step 3: Assign and start
bd update beads-201 --assignee=me --status=in_progress
# ... work ...
bd update beads-201 --status=done

# Step 4: Unblock next task
bd update beads-203 --blockedBy=none --status=ready

# Step 5: Close epic when all done
bd update beads-200 --status=done --comment="All subtasks complete"
```

### Workflow 2: Tracking Bug from Report to Fix

**Scenario:** User reports "Payment form crashes on Safari"

```bash
# Step 1: Create bug (usually by QA or customer support)
bd create \
  --type=bug \
  --title="Payment form crashes on Safari 17.2" \
  --priority=critical \
  --description="Reported by 3 users. Form submission triggers JS error. Stack trace attached." \
  --labels=bug,payment,safari,critical

# Assume it's beads-500

# Step 2: Triage (tech lead decides severity)
bd update beads-500 --priority=critical --estimate=4

# Step 3: Assign to developer
bd update beads-500 --assignee=developer@team.com

# Step 4: Developer starts investigation
bd update beads-500 --status=in_progress --comment="Investigating. Likely async/await issue."

# Step 5: Developer finds and fixes
# ... code changes ...
bd update beads-500 --comment="Fixed: Added null check in form submission handler"

# Step 6: Move to review
bd update beads-500 --status=review

# Step 7: Code review approved
bd update beads-500 --comment="LGTM, approved by tech lead"

# Step 8: Merged and close
bd update beads-500 --status=done --comment="Merged to main, deployed to production"

# Step 9: Sync for visibility
bd sync --flush-only
```

### Workflow 3: Planning Sprint with Dependencies

**Scenario:** Plan 2-week sprint with front-end and backend work

```bash
# Create sprint epic
bd create --type=epic --title="Sprint 25" --estimate=80

# Frontend tasks
bd create --type=task --parent=beads-SPRINT \
  --title="Update form validation" \
  --assignee=alice@team.com \
  --priority=high \
  --estimate=8

bd create --type=task --parent=beads-SPRINT \
  --title="Refactor API client" \
  --assignee=alice@team.com \
  --priority=medium \
  --estimate=8

# Backend tasks
bd create --type=task --parent=beads-SPRINT \
  --title="Implement user preferences endpoint" \
  --assignee=bob@team.com \
  --priority=high \
  --estimate=6

bd create --type=task --parent=beads-SPRINT \
  --title="Add caching layer" \
  --assignee=bob@team.com \
  --priority=medium \
  --estimate=5

# Create dependency: frontend waits for backend endpoint
bd update beads-FORM-VALIDATION --blockedBy=beads-BACKEND-ENDPOINT

# QA tasks (depend on above)
bd create --type=task --parent=beads-SPRINT \
  --title="Integration testing" \
  --assignee=qa@team.com \
  --blockedBy=beads-BACKEND-ENDPOINT \
  --estimate=4

# Team starts work
bd update beads-BACKEND-ENDPOINT --status=in_progress --assignee=bob
bd update beads-FORM-VALIDATION --status=ready  # Waiting for backend

# When backend done
bd update beads-BACKEND-ENDPOINT --status=done
bd update beads-FORM-VALIDATION --blockedBy=none --status=ready

# Sync daily
bd sync --flush-only

# Sprint ends
bd update beads-SPRINT --status=done --comment="Sprint 25 complete, 4 tasks delivered"
```

### Workflow 4: Multi-Team Coordination

**Scenario:** Design, Backend, and Frontend teams working on user profiles

```bash
# Design team creates design task
bd create --type=task \
  --title="User profile design system" \
  --assignee=designer@team.com \
  --estimate=8 \
  --labels=design,ui

# beads-DESIGN created

# Backend team creates API task (blocks frontend)
bd create --type=task \
  --title="User profile API endpoint" \
  --assignee=backend-lead@team.com \
  --estimate=6 \
  --labels=api,backend

# beads-API created

# Frontend team creates component task (depends on API)
bd create --type=task \
  --title="User profile component" \
  --assignee=frontend@team.com \
  --blockedBy=beads-API \
  --estimate=8 \
  --labels=ui,component

# beads-COMPONENT created

# Each team updates independently
bd update beads-DESIGN --status=in_progress
bd update beads-API --status=in_progress

# Design finishes
bd update beads-DESIGN --status=done --comment="Design specs in Figma: [link]"

# Backend finishes
bd update beads-API --status=done --comment="Endpoint live at /api/user/profile"

# Automatically unblock frontend
bd update beads-COMPONENT --blockedBy=none --status=ready

# Frontend can now start
bd update beads-COMPONENT --status=in_progress

# Daily sync for team visibility
bd sync --flush-only
# All teams see each other's progress
```

---

## Troubleshooting Common Issues

### Issue 1: "Beads not found" / "bd command not found"

**Problem:** Terminal says `bd: command not found`

**Solution:**

```bash
# Check if Beads is installed
which bd

# If not found, install globally
npm install -g @beads/cli

# Verify
bd status
```

### Issue 2: Beads integration not working

**Problem:** Beads isn't auto-loading in Claude Code or Cursor

**Solution:**

```bash
# Verify .beads/ directory exists
ls -la .beads/
# Should show: beads.db, issues.jsonl, config.yaml

# If missing, initialize beads
bd init

# Restart Claude Code completely
# Session hooks need to detect .beads/ directory

# Test manually
bd ready
# Should show tasks
```

### Issue 3: Sync conflicts or out-of-sync state

**Problem:** `bd sync --flush-only` fails or says "out of sync with team"

**Solution:**

```bash
# Check sync status
bd status

# Pull latest from team
bd sync --pull

# Resolve any merge conflicts (Beads should auto-merge most)
bd sync --check

# Force local state as truth
bd sync --force

# Then export
bd sync --flush-only
```

### Issue 4: Task disappeared or data loss

**Problem:** A task I created is gone

**Solution:**

```bash
# Check git history
git log --oneline .beads/issues.jsonl

# Recover from specific commit
git show COMMIT_HASH:.beads/issues.jsonl > issues.jsonl

# Or use Beads recovery
bd recover --from=backup

# Check if task is archived (closed tasks)
bd list --status=done --limit=100
```

### Issue 5: Permissions error when updating task

**Problem:** "Permission denied: Cannot update beads-X"

**Solution:**

```bash
# Usually happens when:
# 1. Task is assigned to someone else
# 2. Task is locked (in review)

# Check task status
bd show beads-X

# If assigned to someone else, ask them to reassign
# Or ask tech lead to unlock

# If you need to update, request permission
bd update beads-X --comment="Requesting update permission from @assignee"
```

### Issue 6: Large .beads/issues.jsonl file

**Problem:** Git complains about large file size

**Solution:**

```bash
# Check file size
ls -lh .beads/issues.jsonl

# Archive old tasks
bd archive --before=2025-06-01

# This moves done tasks to archive
# New issues.jsonl is smaller

# Re-sync
bd sync --flush-only
```

---

## Integration with Context Handoff Protocol

When switching between Claude Code and Cursor, tasks transfer via Beads:

### Before Switching IDEs

```bash
# 1. Update task status
bd update beads-123 --status=in_progress

# 2. Sync to export state
bd sync --flush-only

# 3. Commit work
git add src/
git commit -m "fix: improve validation"

# 4. Create handoff note (optional but recommended)
bd update beads-123 --comment="Switching to Cursor. Current progress: validation fixed, need tests"
```

### Switching to New IDE

```bash
# 1. Load Beads context
bd ready

# 2. Pick up where previous IDE left off
bd show beads-123

# 3. See the comment from previous session
# "Switching to Cursor. Current progress: validation fixed, need tests"

# 4. Update status and continue
bd update beads-123 --comment="Resumed in Cursor. Writing tests now."
```

### Bi-Directional Sync

```bash
# Claude Code pushes changes
bd sync --flush-only

# Cursor pulls updates
bd sync --pull

# No manual handoff file needed - Beads is the source of truth
```

---

## Team Collaboration Patterns

### Pattern 1: Async Review Process

```bash
# Developer finishes work
bd update beads-123 --status=review --comment="Ready for review by @tech-lead"

# Tech lead reviews when available
# Leaves comments on task
bd update beads-123 --comment="LGTM, one small suggestion on line 42"

# Developer implements feedback
bd update beads-123 --comment="Feedback applied, ready for re-review"

# Tech lead approves
bd update beads-123 --comment="Approved, merge when ready"

# Developer closes
bd update beads-123 --status=done
```

### Pattern 2: Daily Standup via Beads

No meeting needed - just check:

```bash
# Each team member runs
bd list --assignee=me --status=in_progress

# Leadership runs
bd list --status=blocked
bd list --priority=critical

# Team sees everyone's progress in 30 seconds
```

### Pattern 3: Escalation Path

```bash
# Task has blocker
bd update beads-123 --blockedBy=beads-500 --comment="Blocked on backend API"

# Team uses filters to find all blocked work
bd list --blockedBy=beads-500

# Leadership prioritizes blocker
bd update beads-500 --priority=critical

# Blocker team sees it's critical
bd ready --priority=critical
```

### Pattern 4: Parallel Sprints

```bash
# Frontend sprint
bd create --type=epic --title="Sprint 25 - Frontend"
bd create --parent=SPRINT-FE --title="..." --assignee=alice
bd create --parent=SPRINT-FE --title="..." --assignee=alice

# Backend sprint
bd create --type=epic --title="Sprint 25 - Backend"
bd create --parent=SPRINT-BE --title="..." --assignee=bob
bd create --parent=SPRINT-BE --title="..." --assignee=bob

# Leadership sees progress
bd list --parent=SPRINT-FE --status=done
bd list --parent=SPRINT-BE --status=done
```

---

## Best Practices

### ✅ DO

1. **Create tasks early and often** - Even rough ideas should be beads, not Slack messages
2. **Add description** - Future you will forget context
3. **Use labels** - Makes filtering easy ("bug", "frontend", "urgent")
4. **Mark blockers** - Don't hide dependencies
5. **Update status regularly** - Keeps team aware
6. **Sync before pushing** - Ensures CI/CD sees current state
7. **Comment on decisions** - Leave breadcrumbs for future investigation
8. **Review blocked tasks daily** - Remove blockers quickly

### ❌ DON'T

1. **Don't create Slack threads about tasks** - Use Beads comments
2. **Don't forget to estimate** - Estimation helps predict blockers
3. **Don't leave tasks in "review" for days** - Follow up or auto-close
4. **Don't create duplicate tasks** - Search first, reuse if similar
5. **Don't ignore "blocked" tasks** - They block the team
6. **Don't skip `bd sync --flush-only`** - External tools rely on it
7. **Don't reassign constantly** - Causes confusion
8. **Don't close tasks without comment** - Team needs to know it's done

---

## Quick Reference

### Command Cheat Sheet

```bash
# Create
bd create --title="..." --type=task

# View
bd ready                          # Your ready tasks
bd show beads-123                 # Task details
bd list --status=in_progress      # Filter tasks

# Update
bd update beads-123 --status=review
bd update beads-123 --comment="..."
bd update beads-123 --blockedBy=beads-50

# Sync
bd sync --flush-only              # Export
bd sync --pull                    # Import

# Clean
bd close beads-123                # Archive done task
bd list --status=done --limit=100 # See recent done
```

### Status Flow

```
backlog → ready → in_progress → review → done
   ↓       ↓           ↓            ↓      ↓
   |   Not started  Working     Pending   Closed
   |               feedback
   └─ Waiting
```

### Priority Levels

- **critical**: Drop everything, fix now
- **high**: This sprint
- **medium**: Next sprint
- **low**: When you have time

---

## Key Takeaway

**Beads is your task database, integrated into your workflow.**

- Create tasks with `bd create`
- Update status with `bd update`
- View progress with `bd ready`
- Sync with `bd sync --flush-only`
- Team stays coordinated automatically

See: **Integration with Context Handoff Protocol** section for switching between Claude Code and Cursor while keeping task state synchronized.

---

**Next:** See `MCP-Tools-Guide.md` to learn about multi-session memory, security scanning, and external models.
