# /gitlab-process-comments - Process GitLab MR Comments

> **Purpose:** Systematically process MR feedback threads, implement fixes, and reply with verification.
>
> Use this to work through code review comments one by one, fix issues, and close discussions.

Process comments for MR #$ARGUMENTS:

## Workflow Phases

1. **Setup** - Create task structure for all comments
2. **Process** - For each comment: research → implement → verify → reply
3. **Close** - Generate final reports and close round

## Phase 1: Setup

### Step 0: Context Detection

```bash
# 1. Get unresolved comments (IMPORTANT: use --open-only)
npm run gitlab:mr:get-unresolved -- --mr <MR_NUMBER> --open-only

# 2. Check existing Beads tasks
bd list --status=open | grep "MR-<N>"

# 3. Check Jira tasks
jira_search(jql: "labels = mr-<N> AND status != Done")

# 4. Load patterns
mcp__hindsight-alice__recall "Patterns for [issue area]"
```

**Decision**:
- No comments → Done
- Has comments → Create tasks
- Continue existing round → Check status

### Step 1: Create Beads Epic for Round

```bash
# Create parent epic for this round
EPIC=$(bd create "Epic: MR-<N> Review Round X" --type=epic -p 1)

# For each comment, create task:
bd create "VP-xxx: [description]" --deps epic:$EPIC -p 1

# Store in description:
bd update <TASK_ID> --description="## Задача
[Description from comment]

## Контекст
- Discussion ID: [id]
- File: [path]:[line]
- Jira: VP-xxx

## Acceptance Criteria
- Implementation complete
- Discussion ID validated
- Reply sent to GitLab"
```

## Phase 2: Process Each Comment

### For Each Comment:

```bash
# Step 3: Load context
bd show <TASK_ID>
mcp__hindsight-alice__recall "How did we solve [issue type]?"

# Step 4: Research solution
# Check codebase for similar patterns
# Read Context7 docs if needed

# Step 5: Implement fix
# Edit files
npm run lint -- --fix
npm run build
npm run test -- --run

# Step 6: Validate Discussion ID
npm run gitlab:mr:get-unresolved -- --mr <MR_NUMBER> | grep <DISCUSSION_ID>

# If ID not found → discussion already resolved, skip reply

# Step 7: Reply to thread
npm run gitlab:mr:reply \
  --mr <MR_NUMBER> \
  --discussion-id "<DISCUSSION_ID>" \
  --body "✅ Fixed in [files]

Verified:
- ✅ lint
- ✅ build
- ✅ tests"

# Step 8: Update Beads
bd update <TASK_ID> --description="... Progress: Fixed [what]"

# Step 9: Store in Hindsight
mcp__hindsight-alice__retain "MR-<N>: Fixed [issue] by [approach]. Pattern: [insight]"

# Step 10: Close task
bd close <TASK_ID> --reason="Fixed and verified"
```

## Phase 3: Close Round

### Step 1: Final GitLab Summary

```bash
npm run gitlab:mr:add-comment -- --mr <MR_NUMBER> --body "✅ **Code Review Round X - Complete**

## Processed Comments

| Comment | Status | Jira |
|---------|--------|------|
| [Thread 1] | ✅ Fixed | VP-xxx |
| [Thread 2] | ✅ Fixed | VP-xxx |

## Verification
- ✅ ESLint passed
- ✅ Build successful
- ✅ All tests passed

Ready for next review."
```

### Step 2: Final Jira Comment

```bash
jira_add_comment(
  issue_key: "VP-xxx",
  body: "## Round X Complete

### Fixed Issues
- [Description] ✅
- [Description] ✅

### Lessons Learned
- [Pattern 1]
- [Pattern 2]"
)
```

### Step 3: Close Round

```bash
# Close Beads epic
bd close $EPIC --reason="Round X complete"

# Sync
bd sync --flush-only

# Verify all done
bd list --status=in_progress | grep "MR-<N>"
# Should be empty
```

## Critical Rules

| NEVER | ALWAYS |
|-------|--------|
| Post intermediate progress | Reply AFTER fix verified |
| Use stale Discussion IDs | Validate ID before reply |
| Skip Hindsight storage | Store patterns after fix |
| Process resolved threads | Skip `resolved: true` |

## Common Issues

| Problem | Solution |
|---------|----------|
| **404 when replying** | Validate Discussion ID first |
| **Discussion already resolved** | Skip reply, update Beads status |
| **ID validation fails** | Re-fetch unresolved list |

## Related Commands

- `/gitlab-get-comments` — Get discussion IDs
- `/gitlab-view-mr` — View MR context
- `/gitlab-review-mr` — Full code review workflow
