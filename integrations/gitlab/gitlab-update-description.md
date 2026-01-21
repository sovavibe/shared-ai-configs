# /gitlab-update-description - Update GitLab MR Description

> **Purpose:** Generate and update professional MR descriptions using AI, analyzing code changes and learning from patterns.
>
> Use this to create comprehensive MR descriptions that communicate scope, impact, and testing.

Update description for MR #$ARGUMENTS:

## Quick Start

```bash
# 1. Get MR information
npm run gitlab:mr:get-info -- --mr <MR_NUMBER>

# 2. Get MR changes (writes to file)
npm run gitlab:mr:get-changes -- --mr <MR_NUMBER>

# 3. Analyze changes and generate description
# (Use Claude to analyze the diff file)

# 4. Update MR description
npm run gitlab:mr:update-description \
  --mr <MR_NUMBER> \
  --body "Your generated description here"
```

## Workflow Steps

### Step 1: Get MR Information
```bash
npm run gitlab:mr:get-info -- --mr 321
```
Check: title, branches, author, existing description

### Step 2: Get MR Changes
```bash
npm run gitlab:mr:get-changes -- --mr 321
# Outputs to /tmp/mr-diff-xyz.txt
```

### Step 3: Analyze Changes
Load file and analyze:
- Changed files list
- File types (pages, components, hooks, utils, etc.)
- Line counts (+/-)
- Which layers of FSD were modified

### Step 4: Generate Description

Use this template:

```markdown
## Overview

[Brief 3-5 sentence description of what changed, why, and impact. Mention breaking changes if any.]

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (causes existing functionality to break)
- [ ] Code refactoring (internal changes, no API changes)
- [ ] Documentation update

## Related Issues

[Jira ticket links if applicable, e.g., VP-XXX]

## Changes

### Components Added/Modified
- **ComponentName**: [Brief description]

### Pages Added
- `/page-path`: [Brief description]

### Hooks Added
- **useHookName**: [Brief description]

### API Changes
- GET /api/endpoint - [description]
- POST /api/endpoint - [description]

## Technical Details

- **Architecture**: [Any architecture changes]
- **Dependencies**: [New dependencies added or removed]
- **Breaking Changes**: [None or list changes]

## Testing

- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] Tested on desktop and mobile

## Checklist

- [ ] Code follows project style guide
- [ ] No `console.log` or `debugger` in production code
- [ ] No `any` types, use proper TypeScript
- [ ] No merge conflicts expected
- [ ] Documentation updated
- [ ] ESLint passes
- [ ] Build passes
- [ ] No test coverage decrease
```

### Step 5: Update Description

```bash
npm run gitlab:mr:update-description \
  --mr 321 \
  --body "Generated description from above template"
```

## Key Principles

- **Be Specific**: List actual components, files, functions changed
- **Be Concise**: 3-5 sentences per section maximum
- **Be Factual**: Base everything on actual diff provided
- **Be Professional**: Use active voice, technical terminology
- **Avoid Fluff**: No "enhancements", "improvements" without specifics

## Pattern Storage

After creating descriptions, store patterns in Hindsight:

```bash
# Store description pattern for future learning
mcp__hindsight-alice__retain "MR description: [type], key patterns: [list], what worked: [approach]"
```

## Related Commands

- `/gitlab-view-mr` — View MR details before updating
- `/gitlab-get-comments` — Review feedback before finalizing description
- `/gitlab-review-mr` — Comprehensive MR review
