# New Feature Full Cycle: Complete SDLC Workflow

> **TL;DR:** Idea → Analysis (Claude Code) → Architecture (Claude Code) → Planning (Claude Code) → Implementation (Cursor) → Testing (Cursor) → Review (Claude Code) → Merge

This guide walks through the complete Software Development Life Cycle for implementing a new feature, from initial concept to production deployment. Perfect for features that require careful planning and validation.

---

## Overview: The 6-Phase Cycle

```
┌─────────────────────────────────────────────────────────────────────┐
│                        NEW FEATURE FULL CYCLE                        │
├─────────────────────────────────────────────────────────────────────┤
│ Phase 1: ANALYZE      │ Understand requirements                      │
│ (Claude Code, Opus)   │ Extract acceptance criteria                  │
│                       │ Identify scope and constraints               │
├───────────────────────┼──────────────────────────────────────────────┤
│ Phase 2: ARCHITECT    │ Design system approach                       │
│ (Claude Code, Opus)   │ Explore alternative designs                  │
│                       │ Make architectural decisions                 │
├───────────────────────┼──────────────────────────────────────────────┤
│ Phase 3: PLAN         │ Break into implementation tasks              │
│ (Claude Code, Sonnet) │ Create TodoWrite breakdown                   │
│                       │ Estimate effort per task                     │
├───────────────────────┼──────────────────────────────────────────────┤
│ Phase 4: IMPLEMENT    │ Write code and tests                         │
│ (Cursor Agent)        │ Follow plan from Phase 3                     │
│                       │ Iterate and refine                           │
├───────────────────────┼──────────────────────────────────────────────┤
│ Phase 5: TEST         │ Validate functionality                       │
│ (Cursor Agent)        │ Run quality gates                            │
│                       │ Performance validation                       │
├───────────────────────┼──────────────────────────────────────────────┤
│ Phase 6: REVIEW       │ Code quality review                          │
│ (Claude Code, Opus)   │ Security analysis (Snyk)                     │
│                       │ Approval before merge                        │
└─────────────────────────────────────────────────────────────────────┘
```

**Total Timeline:** 5-20 hours depending on complexity

- Simple feature (3-4 UI changes): 5-8 hours
- Medium feature (new component set): 10-15 hours
- Complex feature (system integration): 15-20+ hours

---

## Phase 1: ANALYZE (1-2 hours)

**Goal:** Understand exactly what needs to be built, who uses it, why it matters.

**IDE:** Claude Code | **Model:** Opus | **Tool:** `/analyze`

### Step 1.1: Gather Requirements

Start with the raw user story or feature request:

```markdown
# Initial Request
"Add dark mode support to the customer portal"
```

### Step 1.2: Run Analysis

```bash
# In Claude Code
/analyze "Add dark mode support to the customer portal. Users want to reduce eye strain. We have 100K daily active users. Current UI uses Ant Design 5 with styled-components."
```

**What Opus will extract:**

- Functional requirements (what the feature does)
- Non-functional requirements (performance, accessibility, browser support)
- Acceptance criteria (how we know it's done)
- Constraints (design system, technology stack, dependencies)
- Risk factors (breaking changes, complexity, dependencies)
- Out of scope (what we deliberately exclude)

### Step 1.3: Document Analysis in Bead

Create a Beads task to track:

```bash
bd create \
  --title="[ANALYSIS] Dark mode support for customer portal" \
  --type=analysis \
  --description="Feature analysis complete. See architecture decision below." \
  --status=completed
```

### Step 1.4: Analysis Output Example

For "Dark Mode" feature, Opus should provide:

```markdown
## Feature Analysis: Dark Mode Support

### Requirements
- Users can toggle between light and dark theme
- Theme preference persists across sessions (localStorage)
- All pages respect theme setting
- Support for system preference detection (prefers-color-scheme)

### Non-Functional Requirements
- No performance impact (lazy load theme CSS if needed)
- Accessibility: AA compliance for both themes
- Browser support: Chrome, Firefox, Safari, Edge (last 2 years)

### Acceptance Criteria
- [ ] Toggle button visible in header
- [ ] Theme persists after refresh
- [ ] System preference auto-detection works
- [ ] All components render correctly in both modes
- [ ] No console warnings about color contrast

### Constraints
- Use Ant Design 5 token system (no custom CSS variables)
- Implement in styled-components where possible
- Must work with MSW mocks
- No external theme libraries

### Scope
- Customer Portal only (not admin)
- Core pages: Dashboard, Profile, Settings, Transactions

### Out of Scope
- Mobile app (separate codebase)
- Custom color selection
- Theme scheduler (time-based switching)
```

### Success Criteria for Phase 1

- [ ] User story broken into atomic requirements
- [ ] Acceptance criteria documented
- [ ] Constraints and risk factors identified
- [ ] Team alignment on scope
- [ ] Decision: proceed to architecture or request changes

---

## Phase 2: ARCHITECT (2-3 hours)

**Goal:** Design the technical approach to implement the feature.

**IDE:** Claude Code | **Model:** Opus | **Tool:** `/architect`

### Step 2.1: Prepare Architecture Inputs

From Phase 1 analysis, gather:

```bash
# Prepare context for architecture
- Feature requirements (from Phase 1 analysis)
- Codebase structure (FSD architecture)
- Design system (Ant Design 5 + styled-components)
- Current theme handling approach (if any)
- Performance constraints
```

### Step 2.2: Run Architecture Session

```bash
# In Claude Code
/architect beads-ABC123

# Paste in the analysis from Phase 1, then ask:
# "Design a dark mode system for our React Portal using Ant Design 5 tokens,
# styled-components, and Zustand state. Requirements are: toggle, persistence,
# system detection, all pages respect setting, no perf impact."
```

**What Opus should explore:**

1. **State Management**
   - Where should theme state live? (Zustand store)
   - How to persist? (localStorage + Context)
   - How to sync across tabs? (storage event listener)

2. **Component Integration**
   - How to apply theme to all components?
   - Ant Design token override approach
   - CSS-in-JS theme strategy (styled-components)

3. **System Preference Detection**
   - How to detect `prefers-color-scheme`?
   - What's the default behavior?
   - How to let users override system preference?

4. **File Structure**
   - New files/folders needed?
   - Where does theme logic go?
   - How to organize theme tokens?

5. **Dependencies & Trade-offs**
   - Do we need new npm packages?
   - What about bundle size?
   - Performance impact of alternatives?

### Step 2.3: Architectural Decision Document (ADD)

Opus should produce an Architectural Decision Record:

```markdown
## Architecture Decision: Dark Mode Theme System

### Problem
Users need dark mode support with persistence and system preference detection.

### Solution
Use Zustand for theme state + localStorage for persistence + CSS-in-JS theming.

### Implementation Approach

#### 1. State Management (Zustand)
```typescript
// src/shared/store/themeStore.ts
interface ThemeState {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    localStorage.setItem('portal-theme', theme)
    set({ theme })
    applyThemeToDOM(theme)
  },
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('portal-theme', newTheme)
      applyThemeToDOM(newTheme)
      return { theme: newTheme }
    }),
}))
```

#### 2. Ant Design Theme Tokens

```typescript
// src/shared/theme/antTokens.ts
export const lightTheme = {
  token: {
    colorBgBase: '#ffffff',
    colorTextBase: '#000000',
    // ... Ant Design color tokens
  },
}

export const darkTheme = {
  token: {
    colorBgBase: '#141414',
    colorTextBase: '#ffffff',
    // ... Ant Design color tokens
  },
}
```

#### 3. Theme Provider Wrapper

```typescript
// src/app/providers/ThemeProvider.tsx
export function ThemeProvider({ children }) {
  const { theme } = useThemeStore()
  const antTheme = theme === 'light' ? lightTheme : darkTheme

  return (
    <ConfigProvider theme={antTheme}>
      <ThemedApp>{children}</ThemedApp>
    </ConfigProvider>
  )
}
```

#### 4. Toggle Control

```typescript
// src/widgets/ThemeToggle/ui/ThemeToggle.tsx
export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <Button
      icon={theme === 'light' ? <SunIcon /> : <MoonIcon />}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    />
  )
}
```

### Trade-offs

| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| **Zustand + localStorage** | Simple, fast, no extra deps | Manual sync needed | ✅ Chosen |
| **Context + localStorage** | More React-native | More boilerplate | ❌ Rejected |
| **Theme library (e.g., next-themes)** | Battle-tested | Extra dependency | ❌ Rejected |

### File Structure

```
src/
├── shared/
│   ├── store/
│   │   └── themeStore.ts (Zustand)
│   ├── theme/
│   │   ├── antTokens.ts (Ant Design tokens)
│   │   ├── colorPalette.ts (color definitions)
│   │   └── helpers.ts (theme utilities)
│   └── ui/
│       └── ThemeProvider/
│           ├── ui.tsx
│           └── index.ts
├── app/
│   └── providers/
│       └── ThemeProvider.tsx (wrap root app)
└── widgets/
    └── ThemeToggle/
        ├── ui/
        │   └── ThemeToggle.tsx
        └── index.ts
```

### Implementation Steps (for Phase 3)

1. Create Zustand store with localStorage sync
2. Define Ant Design token overrides
3. Create ThemeProvider wrapper component
4. Add ThemeToggle button to header
5. Wire everything together
6. Test across pages
7. Add unit/integration tests

### Success Metrics

- [ ] Single source of truth for theme state
- [ ] Theme persists across sessions
- [ ] System preference respected on first visit
- [ ] No layout shift when theme changes
- [ ] All components render in both themes
- [ ] <50ms theme switch latency
- [ ] Bundle size increase <5KB

### Risks & Mitigation

- **Risk:** Flash of wrong theme on page load
  - **Mitigation:** Inline script to apply theme before React hydrates
- **Risk:** Some Ant components ignore token overrides
  - **Mitigation:** Add CSS-in-JS overrides for edge cases
- **Risk:** Third-party components don't respect theme
  - **Mitigation:** Test during implementation, add wrapper styles if needed

### Dependencies

- Ant Design 5 (already present)
- Zustand (already present)
- styled-components (already present)
- No new packages needed

```

### Step 2.4: Review & Approval

Share architecture with team for feedback:

```bash
# Get team input before proceeding to planning
bd create \
  --title="[ARCHITECTURE] Dark mode system design" \
  --type=decision \
  --description="See architecture doc above. Waiting for team review before proceeding to planning."
```

### Success Criteria for Phase 2

- [ ] Technical approach documented
- [ ] Trade-offs analyzed and documented
- [ ] File structure defined
- [ ] No blocker issues identified
- [ ] Team architecture review passed
- [ ] Ready to move to detailed planning

---

## Phase 3: PLAN (2-3 hours)

**Goal:** Break architecture into concrete implementation tasks with effort estimates.

**IDE:** Claude Code | **Model:** Sonnet | **Tool:** TodoWrite + Beads

### Step 3.1: Decompose into Tasks

Using the architecture from Phase 2, create a detailed implementation plan:

```bash
# Create main feature bead
bd create \
  --title="Feature: Dark mode support" \
  --type=epic \
  --status=in_progress
# Note the ID, e.g., VP-1234
```

### Step 3.2: Create TodoWrite Breakdown

```bash
/plan "Create detailed implementation plan for dark mode feature based on the architecture from Phase 2"
```

**Sonnet will create a comprehensive plan with:**

```markdown
# Dark Mode Implementation Plan

## Phase 3 Planning Breakdown

### Story 1: Theme State Management (2-3 hours)
**Effort:** Medium | **Blocker:** None | **Dependencies:** None

Subtasks:
- [ ] Create Zustand store at `src/shared/store/themeStore.ts`
      (30 min) - Setup store, implement theme toggle logic
- [ ] Add localStorage persistence in store
      (30 min) - Listen to changes, persist to storage
- [ ] Implement system preference detection
      (45 min) - useEffect for `prefers-color-scheme`
- [ ] Create theme initialization function
      (30 min) - Load from storage or system default
- [ ] Write unit tests for store
      (45 min) - Test all store methods and edge cases

### Story 2: Ant Design Theme Tokens (1-2 hours)
**Effort:** Small | **Blocker:** None | **Dependencies:** Story 1

Subtasks:
- [ ] Create Ant Design light theme tokens
      (30 min) - Define color palette and token overrides
- [ ] Create Ant Design dark theme tokens
      (30 min) - Match dark mode color specifications
- [ ] Create theme helper utilities
      (30 min) - Functions to apply/switch themes
- [ ] Test token application
      (30 min) - Verify ConfigProvider picks up tokens

### Story 3: Theme Provider Component (1-2 hours)
**Effort:** Small | **Blocker:** Story 1, 2 | **Dependencies:** None

Subtasks:
- [ ] Create ThemeProvider wrapper component
      (30 min) - Wrap app root with ConfigProvider
- [ ] Integrate with app root (`src/app/App.tsx`)
      (30 min) - Add provider to app structure
- [ ] Setup system preference listener
      (30 min) - Sync theme if OS preference changes
- [ ] Test provider in browser
      (30 min) - Verify theme works across pages

### Story 4: Theme Toggle Control (1 hour)
**Effort:** Small | **Blocker:** Story 1, 3 | **Dependencies:** None

Subtasks:
- [ ] Create ThemeToggle component
      (30 min) - Button with sun/moon icons
- [ ] Add to app header
      (30 min) - Find header widget, integrate toggle
- [ ] Style toggle for both themes
      (20 min) - Ensure visibility in both light/dark

### Story 5: Testing & Validation (2-3 hours)
**Effort:** Medium | **Blocker:** All | **Dependencies:** None

Subtasks:
- [ ] Test theme persistence (localStorage)
      (30 min) - Toggle, refresh, verify persists
- [ ] Test system preference detection
      (30 min) - Change OS setting, verify auto-applies
- [ ] Visual testing - all pages in both themes
      (1 hour) - Go through Dashboard, Profile, Settings, etc.
- [ ] Cross-browser testing
      (30 min) - Chrome, Firefox, Safari
- [ ] Accessibility testing
      (30 min) - Contrast ratios, keyboard nav
- [ ] Performance check
      (30 min) - Measure theme switch latency, bundle size

### Story 6: Code Review & Merge (1 hour)
**Effort:** Small | **Blocker:** Story 5 | **Dependencies:** None

Subtasks:
- [ ] Create PR with meaningful description
      (15 min) - Link to architecture doc
- [ ] Address code review feedback
      (30 min) - Make requested changes
- [ ] Final run of quality gates
      (15 min) - `npm run quality:gates`

## Timeline & Milestones

```

Day 1 (4-5 hours):
├─ Story 1: Theme State (Cursor) → 2-3 hours
├─ Story 2: Tokens (Cursor) → 1-2 hours
└─ Story 3: Provider (Cursor) → 1-2 hours (overlap with Story 2)

Day 2 (4-5 hours):
├─ Story 4: Toggle (Cursor) → 1 hour
├─ Story 5: Testing (Cursor + Claude Code) → 2-3 hours
└─ Story 6: Review & Merge (Claude Code) → 1 hour

```

**Total Effort:** 8-10 hours over 2 days

## Risk Factors

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Ant Design doesn't respect all tokens | Medium | High | Pre-test in throwaway branch, add CSS overrides if needed |
| Performance hit from theme switching | Low | Medium | Profile before/after, optimize if needed |
| Cross-browser theme issues | Medium | Medium | Test on all major browsers during Story 5 |
| System preference detection fails | Low | Medium | Fallback to explicit user preference only |

## Quality Checklist

Before moving to implementation:
- [ ] All subtasks have time estimates
- [ ] Dependencies clearly marked
- [ ] Blocker tasks identified
- [ ] Team agrees on timeline
- [ ] Any questions resolved
- [ ] Technical blockers mitigated
```

### Step 3.3: Create Beads for Each Story

```bash
# Create individual task beads from the plan
bd create --title="Story 1: Theme State Management" --type=task --parent=VP-1234
bd create --title="Story 2: Ant Design Tokens" --type=task --parent=VP-1234
bd create --title="Story 3: Theme Provider" --type=task --parent=VP-1234
bd create --title="Story 4: Theme Toggle Control" --type=task --parent=VP-1234
bd create --title="Story 5: Testing & Validation" --type=task --parent=VP-1234
bd create --title="Story 6: Code Review & Merge" --type=task --parent=VP-1234
```

### Success Criteria for Phase 3

- [ ] Each story has clear acceptance criteria
- [ ] Effort estimates provided per task
- [ ] Dependencies mapped out
- [ ] Timeline realistic and agreed
- [ ] Risks identified and mitigated
- [ ] Ready for implementation
- [ ] Team understands the plan

---

## Phase 4: IMPLEMENT (6-10 hours)

**Goal:** Write code following the plan from Phase 3.

**IDE:** Cursor | **Mode:** Agent | **Tool:** Cursor automode with editor

### Step 4.1: Setup Implementation Session

```bash
# In Cursor, create new branch
git checkout -b feature/dark-mode

# Open plan from Phase 3 for reference
# Keep TodoWrite visible during work
```

### Step 4.2: Implementation Workflow

Follow the TodoWrite plan from Phase 3 in sequence:

**Story 1: Theme State Management**

```bash
# Create the store file
# Cursor generates: src/shared/store/themeStore.ts

# Key implementation:
- Initialize theme from localStorage or system preference
- Implement toggleTheme action
- Persist to localStorage on change
- Add effect hook for system preference listener
```

**Story 2: Ant Design Tokens**

```bash
# Create token files
# Cursor generates: src/shared/theme/antTokens.ts

# Key implementation:
- Define lightTheme object with Ant Design tokens
- Define darkTheme object with overrides
- Test both themes load correctly
```

**Story 3: Theme Provider**

```bash
# Create provider component
# Cursor generates: src/shared/ui/ThemeProvider/ui.tsx

# Key implementation:
- Wrap app with ConfigProvider
- Pass correct theme object based on state
- Apply to src/app/App.tsx
```

**Story 4: Theme Toggle**

```bash
# Create toggle component
# Cursor generates: src/widgets/ThemeToggle/ui/ThemeToggle.tsx

# Key implementation:
- Create button with sun/moon icons
- Wire to toggleTheme action
- Add to header widget
```

**Story 5: Testing**

```bash
# For each story, create tests
# Cursor generates: __tests__/*.test.ts

# Unit tests:
- themeStore.test.ts (all store methods)
- ThemeProvider.test.tsx (renders, applies theme)
- ThemeToggle.test.tsx (toggle works)

# Manual testing:
- Change theme, refresh → persists
- Change OS setting → auto-applies
- All pages render correctly in both themes
```

### Step 4.3: Commit Strategy

```bash
# Commit after each completed story
git add src/shared/store/
git commit -m "feat(theme): implement Zustand store with localStorage persistence"

git add src/shared/theme/
git commit -m "feat(theme): add Ant Design light/dark token definitions"

git add src/shared/ui/ThemeProvider/
git commit -m "feat(theme): create ThemeProvider wrapper component"

# etc. for each story
```

### Step 4.4: Quality Gates During Implementation

```bash
# After each story, run checks
npm run lint       # Ensure no linting errors
npm run test       # Run tests for that story
npm run dev        # Visual testing in browser
```

### Success Criteria for Phase 4

- [ ] All code committed with meaningful messages
- [ ] No lint errors or warnings
- [ ] Unit tests written and passing
- [ ] Manual testing completed for all stories
- [ ] No console errors in browser
- [ ] Ready for Phase 5 validation

---

## Phase 5: TEST (1-2 hours)

**Goal:** Comprehensive testing before review - functionality, performance, compatibility.

**IDE:** Cursor | **Mode:** Agent or Manual

### Step 5.1: Functional Testing

```bash
# Run the app
npm run dev

# Test checklist:
- [ ] Toggle button visible in header
- [ ] Click toggle → theme changes
- [ ] Refresh page → theme persists
- [ ] Change browser dark mode → theme updates
- [ ] All pages render in both themes
- [ ] No console errors
- [ ] No layout shift when switching themes
```

### Step 5.2: Unit & Integration Tests

```bash
# Run full test suite
npm run test

# Verify coverage
npm run test -- --coverage

# Acceptance criteria:
- [ ] All tests pass
- [ ] Coverage >80%
- [ ] No skipped tests
```

### Step 5.3: Performance Testing

```bash
# Build for production
npm run build

# Check bundle size
# Verify theme switching latency (<50ms)
# Test with DevTools Performance tab
```

### Step 5.4: Accessibility Testing

```bash
# Automated checks
npm run lint  # ESLint a11y rules

# Manual checks:
- [ ] Color contrast AA or better in both themes
- [ ] Keyboard navigation works
- [ ] Screen reader announces theme state
- [ ] Icons have alt text
```

### Step 5.5: Cross-Browser Testing

```bash
# Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

# Verify:
- [ ] Theme applies correctly
- [ ] localStorage works
- [ ] System preference detection works
- [ ] No visual glitches
```

### Step 5.6: Run Quality Gates

```bash
# Final check before review
npm run quality:gates

# Must pass ALL checks:
✅ Linting
✅ Type checking
✅ Tests
✅ Build
```

### Success Criteria for Phase 5

- [ ] All tests passing (unit + integration)
- [ ] No console warnings/errors
- [ ] Passes quality gates
- [ ] Performance targets met (<50ms switch, <5KB bundle increase)
- [ ] Accessibility compliance verified
- [ ] Ready for code review

---

## Phase 6: REVIEW (1-2 hours)

**Goal:** Get expert review before merging to main - security, architecture, code quality.

**IDE:** Claude Code | **Model:** Opus | **Tool:** `/review` + Snyk

### Step 6.1: Prepare for Review

```bash
# Create PR
git push origin feature/dark-mode
# Go to GitHub, create PR to main

# PR description template
```

**PR Template:**

```markdown
## Dark Mode Feature Implementation

### Summary
Adds dark mode support to the customer portal with theme persistence and system preference detection.

### Related Issue
Closes #ISSUE_NUMBER

### Changes
- Theme state management via Zustand store
- Ant Design token overrides for light/dark themes
- ThemeProvider wrapper for ConfigProvider
- ThemeToggle component in header
- Full test coverage

### Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change

### Testing
- [x] Unit tests written and passing
- [x] Integration tests passing
- [x] Manual testing completed (all pages, both themes)
- [x] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [x] Accessibility testing (color contrast AA+)
- [x] Performance verified (<50ms theme switch)

### Checklist
- [x] Code follows project style guidelines
- [x] Self-review completed
- [x] Comments added for complex logic
- [x] Tests added/updated
- [x] Documentation updated (if needed)
- [x] No console errors/warnings
- [x] Quality gates passing

### Screenshots
[Include before/after theme screenshots]

### Performance Impact
- Bundle size increase: ~3KB
- Theme switch latency: ~20ms
- No runtime performance impact
```

### Step 6.2: Security Scan with Snyk

```bash
# In Claude Code, run security scan
/snyk_code_scan --path "/Users/ap/work/Front/src" --severity_threshold "high"

# Verify no security issues in new code
```

### Step 6.3: Code Review with Opus

```bash
# In Claude Code
/review

# What Opus will check:
- Code quality and standards compliance
- Architectural alignment with Phase 2 design
- Test coverage adequacy
- Performance implications
- Security concerns
- Maintainability and documentation
```

**Typical Review Feedback (example):**

```markdown
## Code Review: Dark Mode Feature

### ✅ Strengths
1. Clear separation of concerns (store, tokens, provider, UI)
2. Comprehensive test coverage (87%)
3. Proper TypeScript typing
4. Follows FSD architecture
5. Accessibility considerations included

### ⚠️ Suggestions
1. Add JSDoc comments to store functions
2. Consider memoizing ThemeProvider to prevent unnecessary re-renders
3. Add error boundary around ThemeProvider
4. Document token override process for future maintainers

### 🔒 Security Review
- No hardcoded secrets ✅
- No XSS vulnerabilities ✅
- localStorage usage is safe ✅
- No sensitive data exposed ✅

### Performance Analysis
- Theme switch latency: 22ms (under 50ms target) ✅
- Bundle size increase: 2.8KB (under 5KB) ✅
- No unnecessary re-renders ✅

### Approval
✅ **APPROVED** - Ready to merge after addressing suggestions
```

### Step 6.4: Incorporate Feedback

```bash
# Make requested changes in Cursor
git add .
git commit -m "review: address code review feedback on dark mode feature"

# Re-run quality gates
npm run quality:gates

# Re-run tests to confirm changes don't break anything
npm run test
```

### Step 6.5: Merge to Main

```bash
# After approvals and feedback addressed
git checkout main
git pull origin main
git merge feature/dark-mode
git push origin main

# Close PR and related Beads
```

### Step 6.6: Post-Merge Monitoring

```bash
# After merge:
1. Monitor error tracking for new issues
2. Check performance metrics
3. Verify theme persistence in production (if applicable)
4. Get user feedback

# Create ticket for any production issues
```

### Success Criteria for Phase 6

- [ ] Code review completed
- [ ] Snyk scan shows no high-severity issues
- [ ] All feedback addressed
- [ ] Quality gates passing
- [ ] Approved by reviewer
- [ ] Merged to main
- [ ] Post-merge monitoring in place

---

## Complete Example: Dark Mode Full Cycle

### Initial Request (Phase 1)

```
User: "Add dark mode to reduce eye strain for evening users"
```

### Analysis Output (Phase 1)

```
Feature: Dark Mode Support
- Functional Requirements: Toggle, persistence, system detection
- Acceptance Criteria: 5 items including visual, performance, accessibility
- Constraints: Use Ant Design 5, no new dependencies
- Timeline: 10 hours estimated
```

### Architecture Decision (Phase 2)

```
Approach: Zustand store + localStorage + Ant Design tokens
File structure: theme/, store/, widgets/ structure
Trade-offs: Zustand chosen over Context for simplicity
```

### Implementation Plan (Phase 3)

```
6 Stories:
1. Store (2-3h) → Zustand + localStorage
2. Tokens (1-2h) → Ant Design light/dark
3. Provider (1-2h) → ConfigProvider wrapper
4. Toggle (1h) → UI component + header
5. Testing (2-3h) → Unit, integration, manual, accessibility
6. Review (1h) → Code review, security, merge
```

### Implementation (Phase 4)

```
Cursor Agent Mode:
- Story 1: themeStore.ts (commits: store-impl, store-tests)
- Story 2: antTokens.ts (commits: tokens-light, tokens-dark)
- Story 3: ThemeProvider.tsx (commits: provider, app-integration)
- Story 4: ThemeToggle.tsx (commits: toggle, header-integration)
```

### Testing (Phase 5)

```
✅ All unit tests passing
✅ Integration tests passing
✅ Manual testing: all 4 pages, both themes
✅ Cross-browser: Chrome, Firefox, Safari, Edge
✅ Accessibility: AA contrast in both themes
✅ Performance: 22ms switch, 2.8KB added
✅ Quality gates: ALL PASS
```

### Review & Merge (Phase 6)

```
✅ Code review approved
✅ Snyk security scan passed
✅ PR merged to main
✅ Post-merge monitoring active
```

**Total Time: ~10 hours over 2 days**

---

## IDE Handoff Checklist

### Claude Code → Cursor Handoff (Before Phase 4)

Use this checklist when transitioning from analysis/architecture to implementation:

- [ ] Architecture documented and approved
- [ ] Implementation plan created in TodoWrite
- [ ] All Beads created for tracking
- [ ] No architectural questions remaining
- [ ] Code structure/file names decided
- [ ] Technology choices finalized
- [ ] Team alignment confirmed
- [ ] Cursor branch ready for work

**Handoff Meeting:**

1. Walk through architecture design
2. Explain Phase 3 plan and task breakdown
3. Show where code goes (file structure)
4. Explain any tricky parts or decisions
5. Confirm developer understanding
6. Start implementation

### Cursor → Claude Code Handoff (Before Phase 6)

Use this checklist when transitioning from implementation to review:

- [ ] All code committed with meaningful messages
- [ ] All tests written and passing
- [ ] Quality gates passing (npm run quality:gates)
- [ ] PR created with detailed description
- [ ] No outstanding TODOs or FIXMEs
- [ ] Performance metrics captured
- [ ] Cross-browser testing completed
- [ ] Accessibility testing passed
- [ ] Ready for code review

**Review Meeting:**

1. Walk through key implementation decisions
2. Show test coverage breakdown
3. Highlight any edge cases handled
4. Explain any deviations from plan
5. Provide performance metrics
6. Answer reviewer questions

---

## Decision Tree: When to Use Full Cycle

```
Should I use the Full Cycle approach?

┌─ Is this a NEW feature? ──→ YES ──→ Is it CORE to the system? ──→ YES ──→ Use Full Cycle ✅
│                                │
│                                └─ NO ──→ Use Simplified (skip architecture) ⚡
│
└─ Is this a BUG FIX? ──→ YES ──→ Go to Bug-Fix-Workflow.md

Is this REFACTORING? ──→ YES ──→ Go to Refactoring-Strategy.md

Is this OPTIMIZATION? ──→ YES ──→ Go to Performance-Optimization.md

Simple/obvious change? ──→ YES ──→ Skip to Implementation (Phase 4)
```

---

## Team Communication Throughout Cycle

### Phase 1 (Analysis) - 15 min sync

- Present requirements breakdown
- Clarify scope and constraints
- Get team buy-in on approach

### Phase 2 (Architecture) - 30 min design review

- Walk through technical approach
- Discuss trade-offs
- Get architecture approval

### Phase 3 (Plan) - 30 min planning meeting

- Review task breakdown
- Confirm timeline estimates
- Assign story owners if multiple developers

### Phase 4 (Implementation) - Daily standup (5 min)

- Progress update
- Any blockers
- Adjustments to plan if needed

### Phase 5 (Testing) - QA sync (15 min)

- Show completed feature
- Manual testing by QA
- Feedback on functionality

### Phase 6 (Review) - Code review + merge meeting

- Walk through changes
- Review feedback
- Merge decision

---

## Troubleshooting Common Issues

### "Feature takes longer than estimated"

1. Check if architecture was correct (Phase 2)
2. Identify bottleneck story
3. Consider pair programming
4. Break story into smaller pieces
5. Update plan and communicate delay

### "Quality gates failing"

See `/Users/ap/work/Front/.claude/TROUBLESHOOTING.md`

### "Cross-browser testing reveals issues"

1. Document issue (browser, symptom)
2. Create separate bug ticket
3. Decide: fix before merge or separate PR?
4. If before: fix in Phase 5, re-test
5. If after: document in post-merge ticket

### "Code review suggests major changes"

1. Understand the concern
2. Assess impact: small vs large refactoring?
3. If small: make changes in Phase 6
4. If large: discuss with reviewer, may need to revisit Phase 2/3
5. Re-run tests after changes

---

## Key Takeaways

1. **Full Cycle:** Only for new core features (5-20 hours)
2. **Analysis First:** Understand before designing
3. **Architecture Matters:** Design decisions affect implementation
4. **Plan with Detail:** TodoWrite prevents rework
5. **IDE Split:** Claude Code (thinking) → Cursor (coding)
6. **Test Thoroughly:** Don't skip Phase 5
7. **Review Carefully:** Code review before merge
8. **Communication:** Keep team aligned at phase gates
9. **Adjustments:** Plans evolve, that's normal
10. **Documentation:** Decisions recorded for future reference
