---
description: 'GitLab MR description update with Beads and Hindsight Alice integration'
version: '2.0.0'
lastUpdated: '2026-01-16'
---

# GitLab MR Description Update

Generate professional, comprehensive MR description by analyzing code changes, following best practices, and learning from previous descriptions.

## Core Principle

**Jira** = sync with team ("what I'm doing")
**Beads** = local management ("how I'm doing")

## Goal

Generate professional, comprehensive MR description by analyzing code changes, following best practices, and learning from previous descriptions.

## Prerequisites

- GitLab MR ID
- Access to Hindsight Alice MCP
- GitLab scripts: `npm run gitlab:mr:get-info`, `npm run gitlab:mr:get-changes`

## Workflow Steps

### Step 1: Get MR Information

**Action**: Fetch MR details

```bash
glab mr view <MR_ID> --output json
```

**Check**:

- MR ID and title
- Source branch and target branch
- Author and reviewers
- Existing description (if any)

**Stop**: "Продолжить?"

---

### Step 2: Get MR Changes

**Action**: Fetch MR file changes and diffs

```bash
glab mr diff <MR_ID>
```

**Check**:

- Changed files list
- Line counts (+/-)
- Diff content for key files
- File types (pages, components, hooks, utils, mocks, etc.)

**Stop**: "Продолжить?"

---

### Step 3: Load Context from Hindsight MCP

**Action**: Load context from Hindsight MCP

**Hindsight MCP** (for patterns, experience, opinions):

```bash
CallMcpTool({
  server: "user-hindsight-alice",
  toolName: "recall",
  arguments: {
    bank_id: 'patterns',
    query: 'MR description patterns, templates, what worked well',
    max_tokens: 4096
  }
})
```

**Questions**:

- What description patterns have we used before? (from Hindsight patterns)
- Which templates work well for this project? (from Hindsight patterns)
- What information is typically missing? (from Hindsight lessons)
- What opinions/experience do we have about MR descriptions? (from Hindsight)

**Stop**: "Продолжить?"

---

### Step 4: Analyze Code Changes

**Action**: Analyze code to understand what changed

**For each category of files**:

- **Pages**: What functionality was added/modified?
- **Components**: What UI components changed?
- **Hooks**: What custom hooks were added/modified?
- **Utils**: What utilities were added?
- **Mocks**: What API endpoints are mocked?
- **Tests**: What tests were added/updated?
- **Config**: What configuration changes?
- **Types**: What types were defined?

**Categorize MR**:

- Type: Feature / Fix / Refactor / Setup / Docs
- Scope: UI / API / Infrastructure / Tests / Config
- Complexity: Low / Medium / High
- Risk Level: None / Low / Medium / High

**Stop**: "Продолжить?"

---

### Step 5: Generate MR Description

**Action**: Generate professional MR description using best practices

**Use this template**:

```markdown
## Overview

[Brief 3-5 sentence description of what changed, why, and impact on codebase. Mention breaking changes if any.]

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that causes existing functionality to break)
- [ ] Code refactoring (internal code changes, no API changes)
- [ ] Documentation update
- [ ] Tests update

## Related Issues

[Jira ticket links if applicable, e.g., {PREFIX}-XXX]

## Changes

### Components Added

[List new components with descriptions]

### Components Modified

[List modified components and what changed]

### Pages Added

[List new pages with descriptions]

### Hooks Added/Modified

[List custom hooks with descriptions]

### Utilities Added

[List utility functions added]

### API Changes

[List API endpoints added/modified]

### Mocks/MSW

[Describe MSW handlers added for API mocking]

### Configuration Changes

[Describe any config updates]

## Technical Details

- **Architecture**: [Any architecture changes]
- **Dependencies**: [New dependencies added or removed]
- **Performance**: [Performance considerations or improvements]
- **Security**: [Security-related changes]

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] Tested on desktop
- [ ] Tested on mobile

**Testing Notes**:
[Describe how testing was performed, what was tested, known limitations]

## Breaking Changes

[List any breaking changes or explicitly state "None"]

## Checklist

- [ ] Code follows project style guide (CONTRIBUTING.md)
- [ ] Self-review completed
- [ ] No `console.log` or `debugger` statements in production code
- [ ] No `any` types, use proper TypeScript types
- [ ] No merge conflicts expected
- [ ] Documentation updated (JSDoc for complex functions)
- [ ] Tests added/updated
- [ ] ESLint passes
- [ ] Build passes
- [ ] No decrease in test coverage
```

**Key Principles**:

- **Be Specific**: List actual components, files, functions changed
- **Be Concise**: 3-5 sentences per section maximum
- **Be Factual**: Base everything on actual diff provided
- **Be Professional**: Use active voice, technical terminology
- **Avoid Fluff**: No "enhancements", "improvements" without specifics

**Stop**: "Продолжить?"

---

### Step 6: Update MR Description

**Action**: Update MR description in GitLab

**Using script** (create this script next):

```bash
glab mr update <MR_ID> --description "<GENERATED_DESCRIPTION>"
```

**Alternative**: Manually update description in GitLab UI

**Stop**: "Продолжить?"

---

### Step 7: Store in Hindsight MCP

**Action**: Store patterns, experience, opinions in Hindsight MCP

**Hindsight MCP** (store patterns, experience, opinions):

```
CallMcpTool({
  server: "user-hindsight-alice",
  toolName: "retain",
  arguments: {
    bank_id: 'patterns',
    content: 'MR description generated for [MR_ID]: [Type]. Patterns used: [patterns]. What worked: [successes].',
    context: 'mr-description'
  }
})
```

**Stop**: "Продолжить?"

---

### Step 8: Reflect with Hindsight Alice

**Action**: Analyze description patterns and learn

**Questions for Hindsight Alice**:

- What patterns emerged in this description?
- Which sections worked well?
- What information was missing?
- How can we improve future descriptions?
- What templates should be documented?

**Ask Hindsight Alice**:

```
Analyze this MR description generation session:

MR: [Title]
Type: [Feature/Fix/etc]
Changes: [summary]

What patterns emerge? What worked well? What could be improved?
```

**Stop**: "Продолжить?"

---

### Step 9: Finalize and Store Reflection

**Action**: Store final reflection in Hindsight MCP

**Hindsight MCP** (store final reflection):

```
CallMcpTool({
  server: "user-hindsight-alice",
  toolName: "retain",
  arguments: {
    bank_id: 'lessons',
    content: 'MR description generation: What went well: [successes]. What could be improved: [improvements]. Experience: [experience].',
    context: 'mr-description-reflection'
  }
})
```

**Complete**: MR description updated!

---

## Examples

### Example: Feature MR

```markdown
## Overview

Implements schedule timeline feature with Gantt chart visualization for voyage schedules. This adds a new page at `/schedule-timeline` with filtering, export to XLSX, and responsive design. Integrates with existing MSW mocking system and follows FSD architecture. No breaking changes.

## Type of Change

- [x] New feature (non-breaking change which adds functionality)
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] Breaking change (fix or feature that causes existing functionality to break)
- [ ] Code refactoring (internal code changes, no API changes)
- [ ] Documentation update
- [ ] Tests update

## Related Issues

[{PREFIX}-456](https://your-org.atlassian.net/browse/{PREFIX}-456)

## Changes

### Components Added

- **ScheduleTimeline**: Main component with Gantt chart visualization using react-beautiful-dnd
- **ScheduleFilters**: Filter panel with date range, origin port, product, and status filters
- **VoyageTimelineCard**: Individual voyage card with drag-drop functionality
- **StatusStatsBar**: Summary statistics bar showing voyage counts by status

### Pages Added

- `/schedule-timeline`: New page displaying voyage timeline with Gantt chart

### Hooks Added

- **useScheduleFilters**: Custom hook for managing filter state and interactions
- **useVoyageData**: Custom hook for fetching and caching voyage data

### Utilities Added

- **calculateDateRange**: Helper for calculating min/max dates from voyage list
- **exportToXLSX**: Export utility using ExcelJS library

### Mocks/MSW

- 50 MSW handlers added for schedule timeline API endpoints including:
  - GET /api/voyages/list
  - GET /api/voyages/:id
  - GET /api/voyages/export
  - Filter and search endpoints

## Technical Details

- **Architecture**: Follows existing FSD (Feature-Sliced Design) structure
- **Dependencies**: Added react-beautiful-dnd for drag-drop, exceljs for XLSX export
- **Performance**: Implemented virtualization for large voyage lists (1000+ items)
- **Security**: All API calls use existing authenticated fetch wrapper

## Testing

- [x] Unit tests added/updated
- [x] Manual testing completed
- [x] Tested on desktop
- [x] Tested on mobile

**Testing Notes**:

- Manual testing performed on Chrome, Firefox, Safari (desktop)
- Mobile testing on iOS Safari and Chrome Android
- Tested filtering with various date ranges and status combinations
- Verified XLSX export functionality
- Mock data validated against API specification

## Breaking Changes

None

## Checklist

- [x] Code follows project style guide (CONTRIBUTING.md)
- [x] Self-review completed
- [x] No `console.log` or `debugger` statements in production code
- [x] No `any` types, use proper TypeScript types
- [x] No merge conflicts expected
- [x] Documentation updated (JSDoc for complex functions)
- [x] Tests added/updated
- [x] ESLint passes
- [x] Build passes
- [x] No decrease in test coverage
```

### Example: Bug Fix MR

```markdown
## Overview

Fixes date parsing issue in Safari browser where date strings from API were not correctly converted to Date objects. This was causing schedule timeline to display incorrect dates on iOS and Safari. The fix uses proper ISO 8601 date format with timezone handling. No breaking changes.

## Type of Change

- [ ] New feature (non-breaking change which adds functionality)
- [x] Bug fix (non-breaking change which fixes an issue)
- [ ] Breaking change (fix or feature that causes existing functionality to break)
- [ ] Code refactoring (internal code changes, no API changes)
- [ ] Documentation update
- [ ] Tests update

## Related Issues

[{PREFIX}-457](https://your-org.atlassian.net/browse/{PREFIX}-457)

## Changes

### Components Modified

- **ScheduleTimeline**: Updated date parsing logic to use dayjs with timezone support

### Utilities Modified

- **parseAPIDate**: Refactored to handle ISO 8601 format with timezone

## Technical Details

- **Root Cause**: Safari doesn't support `Date.parse()` for non-standard date formats
- **Solution**: Use dayjs library with explicit format string and timezone parsing
- **Impact**: Fixes date display issues on all Safari-based browsers (iOS, Safari desktop)

## Testing

- [x] Unit tests added/updated
- [x] Manual testing completed
- [x] Tested on desktop
- [x] Tested on mobile

**Testing Notes**:

- Verified date parsing on Safari 15+, Chrome 120+, Firefox 120+
- Tested on iOS Safari and Chrome Android
- Confirmed schedule timeline displays correct dates on all platforms
- Added unit tests for date parsing edge cases

## Breaking Changes

None

## Checklist

- [x] Code follows project style guide (CONTRIBUTING.md)
- [x] Self-review completed
- [x] No `console.log` or `debugger` statements in production code
- [x] No `any` types, use proper TypeScript types
- [x] No merge conflicts expected
- [x] Documentation updated (JSDoc for complex functions)
- [x] Tests added/updated
- [x] ESLint passes
- [x] Build passes
- [x] No decrease in test coverage
```

---

## Notes

- Always be specific about what changed (list components, files, functions)
- Include testing approach and what was tested
- Mention breaking changes explicitly (or state "None")
- Follow project checklist from CONTRIBUTING.md
- Include related Jira tickets if applicable
- **ALWAYS load context from Hindsight MCP** when checking previous descriptions
- Store patterns, experience, opinions in Hindsight MCP (both `patterns` and `lessons` banks)
- Professional language: active voice, technical terminology, no fluff
