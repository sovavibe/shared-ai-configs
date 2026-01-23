# Refactoring Strategy: Plan, Execute, Validate

> **TL;DR:** Assess scope → Get buy-in → Plan approach → Implement incrementally → Test → Document why

This guide covers when to refactor, how to plan refactoring, manage risk, and execute successfully without breaking production.

---

## Refactoring Triggers: When Should You Refactor?

```
Does the code have these smells?

┌─ Is it UNREADABLE?
│  ├─ Function >50 lines?
│  ├─ Variable names unclear?
│  ├─ Complex nested logic?
│  ├─ Too many dependencies?
│  └─ → REFACTOR ✅

├─ Is it DUPLICATED?
│  ├─ Copy-paste code exists?
│  ├─ Same logic in multiple places?
│  ├─ Tests duplicated?
│  └─ → REFACTOR ✅

├─ Is it HARD TO TEST?
│  ├─ Can't unit test a function?
│  ├─ Tests are brittle?
│  ├─ Requires many mocks?
│  └─ → REFACTOR ✅

├─ Is it SLOW?
│  ├─ Performance profiling shows issue?
│  ├─ Known algorithmic inefficiency?
│  ├─ Renders too often?
│  └─ → OPTIMIZE (see Performance-Optimization.md)

├─ Is it BROKEN?
│  ├─ Constant bugs in this code?
│  ├─ Users report issues?
│  ├─ Tests fail frequently?
│  └─ → FIX BUGS FIRST (see Bug-Fix-Workflow.md)

└─ Is it LOW PRIORITY but Nice?
   ├─ Code works fine
   ├─ But could be cleaner
   ├─ Low risk, medium effort
   └─ → DEFER if in crunch
```

### Red Flags: When NOT to Refactor

```
❌ DON'T refactor if:
- Feature freeze or release deadline
- Team is blocked on bugs
- Code is working fine (YAGNI principle)
- You don't understand the code yet
- No tests exist for that code
- Business pressure to ship

✅ DO refactor if:
- It blocks new feature development
- It's a known source of bugs
- Multiple people complain about it
- Team is looking for debt paydown
- Between feature cycles (breathing room)
- You have time and tests
```

---

## Three Refactoring Scales

Choose your approach based on scope:

| Scale | Time | Impact | Risk | IDE Workflow |
|-------|------|--------|------|--------------|
| **Small** | 30-60 min | One file/component | Low | Cursor only |
| **Medium** | 2-4 hours | One feature/system | Medium | Claude Code (plan) → Cursor (impl) |
| **Large** | 1-3 days | Major architectural change | High | Full SDLC (analyze, architect, plan, impl, review) |

---

## SECTION 1: Small Refactoring (30-60 minutes)

**Scope:** Single file, single component, obvious improvement

**Examples:**

- Extract function from large component
- Rename variables for clarity
- Remove dead code
- Consolidate similar functions
- Fix linting issues in one file

### Step 1.1: Scope the Change

```markdown
## Small Refactor: Extract Button Component

### Current State
Button styles duplicated in 3 places:
- src/pages/Dashboard/ui/DashboardPage.tsx (lines 45-60)
- src/pages/Profile/ui/ProfilePage.tsx (lines 30-45)
- src/pages/Settings/ui/SettingsPage.tsx (lines 60-75)

### Desired State
- Create src/shared/ui/PrimaryButton/PrimaryButton.tsx
- Replace duplicated code with component
- All button uses consistent

### Files to Change
- Create: src/shared/ui/PrimaryButton/PrimaryButton.tsx
- Modify: DashboardPage, ProfilePage, SettingsPage (3 files)

### Risk Level: LOW
- No logic changes, just extraction
- Tests don't change (still same styling)
- Revert is simple if needed

### Time Estimate: 30 minutes
- Create component: 10 min
- Update imports: 10 min
- Test: 5 min
- Commit: 5 min
```

### Step 1.2: Create Branch

```bash
git checkout -b refactor/extract-button-component
```

### Step 1.3: Implement in Cursor

```typescript
// Create new component
// src/shared/ui/PrimaryButton/PrimaryButton.tsx

import styled from 'styled-components'
import { Button } from 'antd'

export interface PrimaryButtonProps {
  children: React.ReactNode
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const StyledButton = styled(Button)`
  background-color: #1890ff;
  border-color: #1890ff;
  height: 40px;
  font-weight: 600;
  padding: 0 24px;

  &:hover {
    background-color: #40a9ff;
    border-color: #40a9ff;
  }

  &:active {
    background-color: #096dd9;
    border-color: #096dd9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export function PrimaryButton({
  children,
  onClick,
  loading,
  disabled,
  type = 'button',
}: PrimaryButtonProps) {
  return (
    <StyledButton
      type={type}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  )
}
```

### Step 1.4: Update Imports

```typescript
// BEFORE: src/pages/Dashboard/ui/DashboardPage.tsx
const StyledButton = styled(Button)`
  background-color: #1890ff;
  // ... repeated styles
`

export function DashboardPage() {
  return (
    <StyledButton onClick={handleClick}>
      Submit
    </StyledButton>
  )
}

// AFTER
import { PrimaryButton } from '@/shared/ui/PrimaryButton'

export function DashboardPage() {
  return (
    <PrimaryButton onClick={handleClick}>
      Submit
    </PrimaryButton>
  )
}
```

### Step 1.5: Test & Verify

```bash
# Visual test: does button look the same?
npm run dev
# Navigate to all 3 pages, verify button appearance

# Run tests
npm run test

# Lint check
npm run lint
```

### Step 1.6: Commit

```bash
git add src/shared/ui/PrimaryButton/
git add src/pages/Dashboard/ui/DashboardPage.tsx
git add src/pages/Profile/ui/ProfilePage.tsx
git add src/pages/Settings/ui/SettingsPage.tsx

git commit -m "refactor: extract reused PrimaryButton component

- Create new PrimaryButton component in shared/ui
- Replace duplicated button styles in 3 pages
- Improves maintainability: one place to update button styling
- No functional changes, just code organization"

npm run quality:gates
git push
```

---

## SECTION 2: Medium Refactoring (2-4 hours)

**Scope:** Feature-level refactoring, clear scope, manageable risk

**Examples:**

- Refactor API call pattern in one feature
- Reorganize component hierarchy
- Extract hooks from components
- Consolidate similar utilities
- Improve test coverage

### Step 2.1: Planning Phase (30 min)

```bash
# In Claude Code - Plan the refactoring
/plan "Refactor the authentication flow from prop drilling to Zustand store"
```

**Plan should include:**

```markdown
## Medium Refactor: Auth Flow Refactoring

### Problem Statement
- Auth state currently passed via props (prop drilling)
- 5+ levels deep in component tree
- Hard to trace data flow
- Testing components requires mocking many props
- New developers confused about how auth works

### Solution Approach
- Extract auth state to Zustand store
- Remove prop drilling
- Simplify component signatures
- Consolidate auth logic

### Scope: What Changes
Files affected:
1. Create: src/shared/store/authStore.ts (NEW)
2. Modify: src/app/App.tsx (setup provider)
3. Modify: 15+ components (remove props, use hook)
4. Modify: tests (use store instead of props)

What doesn't change:
- Auth behavior (same API calls, same logic)
- UI appearance
- User experience

### Risk Assessment
Risk level: MEDIUM

Potential issues:
1. Missing import of hook in some component → Runtime error
   Mitigation: Search for "useAuth" hook usage
2. Tests break because store not initialized
   Mitigation: Setup store in test file
3. Circular dependencies in imports
   Mitigation: Check import order

### Implementation Strategy
Incremental approach (safer):
1. Create Zustand store (no changes yet)
2. Add store provider to App
3. Refactor one page completely (test first)
4. Refactor remaining components
5. Remove prop drilling
6. Update tests

Parallel:
- Keep old prop-based approach working
- Slowly migrate components
- Can rollback per component if needed

### Effort Breakdown
- Zustand store: 30 min
- App provider setup: 15 min
- Refactor 1 page: 45 min
- Refactor other pages: 45 min
- Test updates: 45 min
- Testing & validation: 30 min

Total: 3.5 hours

### Success Criteria
- [ ] No prop drilling in auth-related code
- [ ] Tests still pass (updated as needed)
- [ ] useAuth hook available in all components
- [ ] No console errors
- [ ] Code review approved
- [ ] All functionality still works
```

### Step 2.2: Get Team Buy-In

```bash
# Share the plan with team
# Typical feedback:
- "Looks good, go ahead"
- "Can you do this incrementally?"
- "What's the timeline?"
- "Do we have test coverage?"

# Update plan based on feedback
# Get explicit approval before starting
```

### Step 2.3: Create Beads for Tracking

```bash
bd create \
  --title="[REFACTOR] Auth flow: prop drilling → Zustand store" \
  --type=refactor \
  --parent=EPIC_ID \
  --description="See plan above"

bd create --title="Story 1: Create auth Zustand store" --parent=REFACTOR_ID
bd create --title="Story 2: Setup provider in App" --parent=REFACTOR_ID
bd create --title="Story 3: Refactor LoginPage" --parent=REFACTOR_ID
bd create --title="Story 4: Refactor other pages" --parent=REFACTOR_ID
bd create --title="Story 5: Update tests" --parent=REFACTOR_ID
bd create --title="Story 6: Code review & merge" --parent=REFACTOR_ID
```

### Step 2.4: Implement in Cursor

```bash
git checkout -b refactor/auth-zustand-store
```

**Story 1: Create Zustand Store**

```typescript
// src/shared/store/authStore.ts
import { create } from 'zustand'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  error: string | null
  setUser: (user: AuthUser | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  logout: () => set({ user: null, error: null }),
}))
```

**Story 2: Setup Provider**

```typescript
// src/app/App.tsx
import { useAuthStore } from '@/shared/store/authStore'

export function App() {
  // Initialize store from session/localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('auth-user')
    if (savedUser) {
      useAuthStore.setState({ user: JSON.parse(savedUser) })
    }
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* ... */}
      </Routes>
    </Router>
  )
}
```

**Story 3: Refactor One Page**

```typescript
// BEFORE: Prop drilling
function LoginPage({ onLoginSuccess }) {
  const handleLogin = async (credentials) => {
    const user = await authApi.login(credentials)
    onLoginSuccess(user)
  }

  return <LoginForm onSubmit={handleLogin} />
}

// AFTER: Using store
function LoginPage() {
  const { setUser, setLoading, setError } = useAuthStore()

  const handleLogin = async (credentials) => {
    try {
      setLoading(true)
      const user = await authApi.login(credentials)
      setUser(user)
      localStorage.setItem('auth-user', JSON.stringify(user))
      navigate('/dashboard')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return <LoginForm onSubmit={handleLogin} />
}
```

**Story 4-5: Refactor All Components & Update Tests**

```typescript
// Example: Component using auth store
function Header() {
  const { user, logout } = useAuthStore()

  return (
    <header>
      <span>Welcome, {user?.name}</span>
      <Button onClick={logout}>Logout</Button>
    </header>
  )
}

// Example: Updated test
test('Header shows user name from store', () => {
  // Setup store
  useAuthStore.setState({
    user: { id: '1', email: 'user@test.com', name: 'John', role: 'user' }
  })

  render(<Header />)
  expect(screen.getByText('Welcome, John')).toBeInTheDocument()
})
```

### Step 2.5: Test & Validate

```bash
# Manual testing
npm run dev
# Test full auth flow:
- Login works
- User data displays correctly
- Logout works
- Refresh persists login

# Unit tests
npm run test -- authStore.test.ts

# Integration tests
npm run test -- LoginPage.test.tsx
npm run test -- Header.test.tsx

# Type checking
npm run lint

# Quality gates
npm run quality:gates
```

### Step 2.6: Code Review

```bash
# Create PR
git push origin refactor/auth-zustand-store

# PR description:
# Refactor: Auth flow from prop drilling to Zustand store
# - Removes prop drilling (5+ levels deep)
# - Centralizes auth state management
# - Simplifies component tests
# - No functional changes
# - 100% backward compatible

# Get review from 1-2 teammates
# Address feedback
# Merge when approved
```

### Step 2.7: Merge & Monitor

```bash
git checkout main
git pull
git merge --no-ff refactor/auth-zustand-store
git push

# Monitor:
- No new errors
- Auth flow still works
- Users not affected
```

---

## SECTION 3: Large Refactoring (1-3 days)

**Scope:** Major architectural change, significant impact

**Examples:**

- Migrate from prop drilling to Context/Redux
- Rewrite component hierarchy
- Move from class to hooks
- Major API integration refactoring
- Consolidate multiple features

### Step 3.1: Full SDLC Planning (2-3 hours)

Use the `/analyze` and `/architect` workflow:

```bash
# Phase 1: ANALYZE (Claude Code, Opus)
/analyze "We have class components throughout the dashboard. We want to migrate to functional components with hooks to improve readability and enable code reuse."

# Output: Scope, constraints, acceptance criteria

# Phase 2: ARCHITECT (Claude Code, Opus)
/architect "Design a plan to migrate 50+ class components to hooks. How do we maintain functionality? What's the rollback strategy?"

# Output: Architecture decision, migration strategy

# Phase 3: PLAN (Claude Code, Sonnet)
/plan "Create detailed implementation plan for migrating Dashboard components to hooks"

# Output: TodoWrite breakdown, effort estimates
```

### Step 3.2: Risk Assessment

```markdown
## Risk Assessment for Large Refactoring

### Risk Factors
1. **Breaking Changes Risk**: HIGH
   - Migrating hooks changes component behavior
   - Lifecycle timing might be different
   - Test coverage must be comprehensive

2. **Timeline Risk**: MEDIUM
   - Multiple developers needed
   - Merge conflicts likely
   - Needs careful coordination

3. **Quality Risk**: MEDIUM
   - Lots of code changing
   - Easy to introduce bugs
   - Testing critical

### Mitigation Strategy

#### A. Backward Compatibility Branch
- Keep old code working in parallel
- Gradually migrate, feature by feature
- Can rollback easily per component

#### B. Comprehensive Testing
- Before: Full test suite running
- During: Add tests for migrated components
- After: Run full suite + regression tests

#### C. Code Review Process
- Every component review needs 2 approvers
- Manual testing for visual regression
- Cross-browser testing

#### D. Incremental Rollout
- Migrate one feature/page at a time
- Merge to main after each page
- Can revert individual pages if needed

#### E. Communication Plan
- Daily standups during refactoring
- Clear progress tracking with Beads
- Document decisions

### Contingency Plans
If refactoring breaks badly:
1. Can we rollback? (git revert PR)
2. Can we hotfix? (quick patch)
3. Do we roll back or fix forward?
```

### Step 3.3: Create Refactoring Epic

```bash
# Create main epic
bd create \
  --title="[EPIC] Migrate Dashboard to React Hooks" \
  --type=epic \
  --labels="refactor,architecture-improvement" \
  --description="Migrate 50+ class components to functional components with hooks"

# Create sub-tasks per page/feature
bd create --title="Refactor: Dashboard Main" --parent=EPIC_ID
bd create --title="Refactor: Dashboard Charts" --parent=EPIC_ID
bd create --title="Refactor: Dashboard Settings" --parent=EPIC_ID
bd create --title="Tests: Dashboard components" --parent=EPIC_ID
bd create --title="Code Review & Validation" --parent=EPIC_ID
```

### Step 3.4: Parallel Implementation Strategy

```markdown
## Parallel Implementation Timeline

### Phase 1: Preparation (2-3 hours)
- Setup test infrastructure
- Create example migrated component
- Document best practices/patterns
- Get team trained on hooks

### Phase 2: Incremental Migration (2 days)
- Developer A: Migrate Dashboard Main (8 hours)
- Developer B: Migrate Charts (8 hours)
- Developer C: Migrate Settings (8 hours)
- Daily merges to main (avoid massive merge conflicts)

### Phase 3: Testing & Validation (1 day)
- Full integration testing
- Cross-browser testing
- Performance comparison
- User acceptance testing

### Phase 4: Cleanup & Documentation (2-4 hours)
- Remove old class components
- Update documentation
- Code review consolidation
- Deploy

### Coordination
- Daily 10-min sync on blockers
- Discuss merges before pushing
- Test one another's work
- Code review within 24 hours
```

### Step 3.5: Communication Plan

```markdown
## Large Refactoring Communication

### Day 1: Kickoff
- Email: "Starting major refactoring effort"
- Explain: Why are we doing this?
- Timeline: When will it be done?
- Impact: Any user-facing changes? (No)

### Daily: Standups
- Progress update
- Blockers
- ETA changes

### Day 3: Validation
- "Refactoring complete, entering validation phase"
- "Please test and report issues"
- Timeframe for approval

### Day 4: Deployment
- "Refactoring merged to main"
- "Deployed to production"
- "Please monitor for issues"

### Follow-up
- Monitor error tracking
- Get user feedback
- Document lessons learned
```

### Step 3.6: Validation & Rollback Plan

```markdown
## Validation Checklist

### Before Merge
- [ ] All tests passing (90%+ coverage)
- [ ] Code review approved
- [ ] No console errors/warnings
- [ ] Performance baseline met
- [ ] Accessibility standards met
- [ ] Cross-browser tested
- [ ] Manual QA sign-off

### After Merge
- [ ] Monitor error tracking hourly
- [ ] Watch performance metrics
- [ ] Check user feedback
- [ ] Performance data vs baseline
- [ ] No new bug reports

### Rollback Decision
If issues found:
- Within 1 hour: Rollback and fix, re-test
- 1-4 hours: Attempt hotfix, monitor closely
- 4+ hours: Keep, investigate, create fix ticket

Rollback command:
```bash
git revert -m 1 <merge-commit-hash>
git push origin main
```

```

---

## Small Example: Extract Hook

```typescript
// BEFORE: Component with logic
function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await api.fetchDashboard()
        setData(response)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <Spinner />
  if (error) return <Error message={error.message} />
  return <DashboardContent data={data} />
}

// AFTER: Extracted hook
function useDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await api.fetchDashboard()
        setData(response)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

function DashboardPage() {
  const { data, loading, error } = useDashboard()

  if (loading) return <Spinner />
  if (error) return <Error message={error.message} />
  return <DashboardContent data={data} />
}

// Now hook is reusable in other components
function AnalyticsPage() {
  const { data, loading, error } = useDashboard()
  // ...
}
```

---

## Medium Example: Consolidate Utilities

```typescript
// BEFORE: Similar functions scattered

// src/shared/utils/date.ts
export function formatDate(date: Date) {
  return date.toLocaleDateString('en-US')
}

// src/shared/utils/time.ts
export function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US')
}

// src/pages/Dashboard/utils.ts
export function formatDateTime(date: Date) {
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}

// AFTER: Consolidated with clear naming

// src/shared/utils/format.ts
export function formatDate(date: Date, locale = 'en-US') {
  return date.toLocaleDateString(locale)
}

export function formatTime(date: Date, locale = 'en-US') {
  return date.toLocaleTimeString(locale)
}

export function formatDateTime(date: Date, locale = 'en-US') {
  return `${formatDate(date, locale)} ${formatTime(date, locale)}`
}

export function formatRelativeTime(date: Date) {
  // e.g., "2 hours ago"
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  return `${hours} hours ago`
}
```

---

## Large Example: Component Hierarchy Refactor

```
BEFORE:
App
├── Dashboard
│   ├── DashboardHeader (lots of props)
│   │   ├── DashboardTitle
│   │   ├── DashboardSearch
│   │   └── DashboardActions
│   ├── DashboardMain (tightly coupled)
│   │   ├── DashboardCharts (needs 20 props!)
│   │   └── DashboardTable
│   └── DashboardFooter

Problems:
- Too many props passing through layers
- Components tightly coupled
- Hard to test individual pieces
- Changing one component affects many others

AFTER (using better separation):
App
├── DashboardLayout (new wrapper)
│   ├── Header (provides DashboardHeader context)
│   ├── Content (provides DashboardContent context)
│   └── Footer
├── Dashboard
│   ├── DashboardHeader (consume context)
│   │   ├── DashboardTitle
│   │   ├── DashboardSearch
│   │   └── DashboardActions
│   ├── DashboardCharts (consume context, use hooks)
│   ├── DashboardTable (consume context, use hooks)
│   └── DashboardFooter

Benefits:
- No prop drilling through layout
- Each component is independent
- Easy to test with mock context
- Reusable across pages
```

---

## Refactoring Anti-Patterns (What NOT to do)

```markdown
## Anti-Pattern 1: Boiling Ocean
❌ DON'T: "Let's refactor EVERYTHING at once"
✅ DO: Break into manageable pieces, merge frequently

## Anti-Pattern 2: Changing Logic During Refactoring
❌ DON'T: Refactor AND fix bugs AND add features in one PR
✅ DO: Pure refactoring - no logic changes, just reorganization

## Anti-Pattern 3: No Testing
❌ DON'T: "We'll test after we refactor"
✅ DO: Test before refactor (establish baseline), test during, test after

## Anti-Pattern 4: Skipping Code Review
❌ DON'T: "It's just refactoring, no functional changes"
✅ DO: Get peer review, ensure no regressions

## Anti-Pattern 5: No Rollback Plan
❌ DON'T: "We'll fix it if it breaks"
✅ DO: Have clear rollback procedure before starting

## Anti-Pattern 6: Poor Communication
❌ DON'T: Silently refactor, surprise team with changes
✅ DO: Communicate early, explain why, get buy-in

## Anti-Pattern 7: Performance Regression
❌ DON'T: Assume refactored code is same speed
✅ DO: Profile before/after, verify no performance hit

## Anti-Pattern 8: Incomplete Refactoring
❌ DON'T: Refactor partially, leave codebase in mixed state
✅ DO: Complete refactoring or revert, don't mix old/new
```

---

## Refactoring Checklist

Use this for any refactoring:

```markdown
## Refactoring Checklist

### Planning Phase
- [ ] Clear problem statement (why refactor?)
- [ ] Scope clearly defined
- [ ] Risk assessment complete
- [ ] Team buy-in obtained
- [ ] Timeline estimated
- [ ] Rollback plan documented

### Implementation Phase
- [ ] Branch created
- [ ] Tests pass before changes
- [ ] Refactoring preserves behavior (no logic changes)
- [ ] No console errors/warnings
- [ ] New tests added if needed
- [ ] Code review approved

### Validation Phase
- [ ] All tests passing
- [ ] Manual testing completed
- [ ] Cross-browser tested
- [ ] Performance verified (no regression)
- [ ] Accessibility maintained
- [ ] Ready to merge

### Post-Merge Phase
- [ ] Monitor error tracking
- [ ] Monitor performance metrics
- [ ] Document lessons learned
- [ ] Update internal docs if needed
- [ ] Close related Beads tickets

### Documentation
- [ ] Commit message explains why
- [ ] Code comments added if complex
- [ ] Architecture docs updated if relevant
- [ ] Team communicated about changes
```

---

## Key Takeaways

1. **Scale Your Approach:** Small (fast, high risk) vs Medium (planned) vs Large (full SDLC)
2. **Plan Before Coding:** Understand scope and risks upfront
3. **Get Buy-In:** Team alignment prevents conflicts
4. **Test Thoroughly:** Refactoring without tests is risky
5. **Refactor Incrementally:** Many small changes safer than one big change
6. **Preserve Behavior:** Refactoring doesn't add features, just improves code
7. **Communicate:** Keep team informed throughout
8. **Monitor After Merge:** Watch for unexpected issues
9. **Rollback Ready:** Have clear plan if things go wrong
10. **Document Decisions:** Future maintainers will thank you
