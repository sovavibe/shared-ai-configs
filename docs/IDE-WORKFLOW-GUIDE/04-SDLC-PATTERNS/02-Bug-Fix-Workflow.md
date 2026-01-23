# Bug Fix Workflow: Systematic Bug Diagnosis & Resolution

> **TL;DR:** Reproduce → Isolate → Root Cause (Claude Code Opus) → Fix (Cursor) → Verify → Deploy

This guide covers how to approach bugs systematically, from initial report through production verification. The workflow differs based on bug complexity.

---

## Bug Severity Classification

Use this to determine workflow:

| Severity | Time to Fix | Workflow | Example |
|----------|------------|----------|---------|
| **P0 Critical** | <15 min | Quick-fix (skip planning) | App won't load, auth broken |
| **P1 Major** | 15-45 min | Simple bug workflow | Feature completely broken |
| **P2 Medium** | 45 min - 2 hours | Medium bug workflow | Feature has bugs, partial breakage |
| **P3 Minor** | 2+ hours | Complex bug workflow | Edge cases, hard to reproduce |

---

## Quick Reference: 3 Bug Workflows

```
Bug Report Received
        ↓
   Can you reproduce? ──→ NO ──→ Need more info from reporter
        ↓ YES
   <30 min obvious fix?
        ↓ YES              ↓ NO
   ┌────────────────┐  ┌──────────────────┐
   │ QUICK FIX FLOW │  │ COMPLEX BUG FLOW │
   │ (this doc §1)  │  │ (this doc §2-3)  │
   │ 15-30 minutes  │  │ 1-3 hours        │
   └────────────────┘  └──────────────────┘
        ↓                       ↓
   Fix in Cursor         Isolate in Claude Code
        ↓                       ↓
   Test & commit         Root cause analysis
        ↓                       ↓
   Deploy                Debug in Cursor
        ↓                       ↓
   Monitor               Test & commit
                              ↓
                          Deploy
```

---

## SECTION 1: Quick Fix Workflow (15-30 minutes)

**When to use:** Obviously broken, clear root cause, <30 min to fix

**Examples:**

- Typo in variable name
- Missing prop on component
- Color wrong (easy CSS fix)
- Missing validation
- Console warning about deprecated function

### Step 1.1: Reproduce the Bug

```bash
# Steps
1. Open the app
2. Navigate to affected feature
3. Perform the action that triggers bug
4. Observe the broken behavior
5. Note: steps to reproduce
```

**Example:**

```
Steps to Reproduce:
1. Go to Settings page
2. Click "Update Profile" button
3. Button does nothing (should open modal)

Expected: Modal opens
Actual: Nothing happens
Browser console: No errors
```

### Step 1.2: Identify the Issue

Look for obvious problems:

```bash
# Checklist
- [ ] Typo in function/variable name?
- [ ] Missing props on component?
- [ ] Wrong CSS class applied?
- [ ] Missing event handler?
- [ ] Logic error (condition reversed)?
- [ ] Off-by-one error?
- [ ] Wrong import path?
```

### Step 1.3: Fix in Cursor

```bash
# Open affected file in Cursor
# Make the obvious fix
# Example: Fix missing onClick handler

# BEFORE
<Button>Update Profile</Button>

# AFTER
<Button onClick={handleOpenModal}>Update Profile</Button>
```

### Step 1.4: Test Locally

```bash
npm run dev
# Test the fix works
# Check console for errors
```

### Step 1.5: Commit & Deploy

```bash
git add src/pages/Settings/
git commit -m "fix: add missing onClick handler to Update Profile button"
npm run quality:gates  # Must pass
git push
```

### Step 1.6: Monitor Production

- Watch error tracking for new issues
- Test the fix in production manually
- Get confirmation from bug reporter

---

## SECTION 2: Medium Bug Workflow (45 min - 2 hours)

**When to use:** Reproducible but not obvious, involves investigation

**Examples:**

- Feature works in some cases, fails in others
- Performance issue in specific scenarios
- Styling broken in certain viewport sizes
- Race condition in async flow
- State management issue
- API error handling not working

### Step 2.1: Create Bug Ticket in Beads

```bash
bd create \
  --title="[BUG] Settings modal doesn't open in Firefox" \
  --type=bug \
  --severity=medium \
  --description="Steps to reproduce, expected vs actual behavior"
```

### Step 2.2: Reproduce & Document

```bash
# Create reproduction environment
Steps to Reproduce:
1. Firefox browser (version 121)
2. Go to Settings page
3. Scroll to bottom
4. Click "Update Profile" button
5. Modal doesn't appear

Expected Behavior:
Modal should open and show form

Actual Behavior:
Nothing happens, no console errors

Environment:
- Browser: Firefox 121
- OS: macOS 14.2
- Resolution: 1440x900
```

### Step 2.3: Investigate in Claude Code (Opus)

```bash
# In Claude Code, open the Settings component and related files
# Use Grep to search for related code

# Questions to answer:
1. What does the update button do?
2. Is there a modal component?
3. Is the modal conditional (visibility)?
4. Are there browser-specific issues?
5. Is there async code?
```

**Investigation Example:**

```typescript
// src/pages/Settings/ui/SettingsPage.tsx

// Question 1: What's the onClick handler?
const handleOpenModal = () => setModalOpen(true)

// Question 2: Modal exists?
{modalOpen && <UpdateProfileModal />}

// Question 3: Visibility logic looks ok...

// Question 4: Browser-specific code?
// Check for Firefox-specific issues
const isFirefox = () => typeof navigator !== 'undefined' && /Firefox/.test(navigator.userAgent)

// Question 5: Async code in modal?
useEffect(() => {
  // Maybe this breaks in Firefox?
})
```

### Step 2.4: Isolate the Root Cause

**Root Cause Analysis Checklist:**

```markdown
## Isolation Steps

1. Does it fail in all browsers?
   ✗ No, only Firefox
   → Browser-specific issue

2. Does it fail on all pages?
   ✓ Yes, Settings and Profile
   → System-wide issue

3. Does it fail with all modal types?
   ✗ No, only UpdateProfileModal
   → Component-specific issue

4. Does it fail consistently?
   ✓ Yes, always fails
   → Not timing/race condition

5. Are there console errors?
   ✗ No errors
   → Logic or browser API issue

6. Is it related to specific state?
   → Test with different states
```

### Step 2.5: Create Minimal Reproduction

```typescript
// src/__tests__/modal-firefox.test.tsx
// Minimal repro to verify the issue

import { render, screen } from '@testing-library/react'
import { SettingsPage } from '@/pages/Settings'

test('modal opens in Firefox', () => {
  // Setup Firefox user agent
  Object.defineProperty(navigator, 'userAgent', {
    value: 'Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0',
  })

  render(<SettingsPage />)

  // Click button
  const button = screen.getByRole('button', { name: /update profile/i })
  fireEvent.click(button)

  // Modal should appear
  expect(screen.getByRole('dialog')).toBeInTheDocument()
})
```

### Step 2.6: Hypothesize Root Cause

Based on investigation, form hypothesis:

```markdown
## Root Cause Analysis

### Hypothesis 1: Modal CSS property not supported in Firefox
- Likelihood: Medium
- Evidence: Works in Chrome/Safari, fails in Firefox
- Test: Check for CSS that might not work in older Firefox

### Hypothesis 2: Event listener not attached properly
- Likelihood: Low
- Evidence: Would fail in all browsers
- Status: Ruled out

### Hypothesis 3: Component ref issue in Firefox
- Likelihood: High
- Evidence: Modal uses ref, Firefox sometimes has portal issues
- Test: Check how modal is mounted (DOM portal?)

### Most Likely: Hypothesis 3 (Component ref/portal issue)
- Next step: Check modal portal implementation
```

### Step 2.7: Verify with Debug Info

```typescript
// Add temporary debug code to understand what's happening

const handleOpenModal = () => {
  console.log('Button clicked')
  console.log('Current state:', modalOpen)
  console.log('Is Firefox?', /Firefox/.test(navigator.userAgent))
  setModalOpen(true)
  console.log('State set to true')
}

// Then check browser console to see what prints
```

### Step 2.8: Fix in Cursor

Once root cause is confirmed, fix it:

```typescript
// BEFORE (problematic for Firefox)
const [modalOpen, setModalOpen] = useState(false)

const handleOpenModal = () => setModalOpen(true)

{modalOpen && <UpdateProfileModal />}

// AFTER (works in all browsers)
const [modalOpen, setModalOpen] = useState(false)

const handleOpenModal = () => {
  setModalOpen(true)
  // Force reflow to ensure modal renders
  requestAnimationFrame(() => {
    // Trigger modal animation
  })
}

// Alternative: Use React Portal explicitly
{modalOpen && ReactDOM.createPortal(
  <UpdateProfileModal />,
  document.body
)}
```

### Step 2.9: Test Fix

```bash
# Test in Cursor
npm run dev

# Test in Firefox specifically
# Test in Chrome/Safari to ensure no regression
# Run automated tests
npm run test
```

### Step 2.10: Commit & Deploy

```bash
git add src/pages/Settings/
git commit -m "fix(modal): ensure modal opens in Firefox using explicit portal"
npm run quality:gates
git push
```

---

## SECTION 3: Complex Bug Workflow (2+ hours)

**When to use:** Hard to reproduce, unclear root cause, involves multiple systems

**Examples:**

- Auth flow fails intermittently
- Performance degrades over time
- Data corruption issues
- Race condition in async operations
- Memory leak
- Complex interaction between features

### Step 3.1: Intake & Clarification

```bash
# Create bug ticket
bd create \
  --title="[BUG] Dashboard loads slowly after 5+ minutes of use" \
  --type=bug \
  --severity=high \
  --description="[detailed description]"

# Get more details from reporter
Questions to ask:
- Does it happen every time or intermittently?
- What's your environment? (OS, browser, network)
- Can you provide a video/screenshot?
- When did this start happening?
- Any pattern? (after specific actions?)
- Browser DevTools memory/performance data?
```

### Step 3.2: Initial Reproduction Attempt

```bash
# Try to reproduce in standard environment
npm run dev

# Steps from bug report
1. Open dashboard
2. Use app normally for 5+ minutes
3. Observe performance degradation

# What to look for:
- Browser console errors (likely none for performance)
- DevTools Performance tab showing slow scripts
- Memory usage increasing over time
- CPU usage high
- Specific action that triggers slowdown
```

**If can't reproduce:** Get more data from reporter (logs, video, browser data)

### Step 3.3: Systematic Investigation (Claude Code + Opus)

```bash
# Open the dashboard component and related files
# Search for potential issues:

# 1. Memory leaks (useEffect without cleanup)
grep -r "useEffect" src/pages/Dashboard/ --include="*.tsx"
# Check for: missing dependencies, missing cleanup functions

# 2. Unnecessary re-renders
grep -r "useState\|useCallback\|useMemo" src/pages/Dashboard/
# Check for: missing memoization, expensive computations

# 3. Polling or infinite loops
grep -r "setInterval\|while\|for" src/pages/Dashboard/
# Check for: uncleared intervals, memory leaks

# 4. Large data structures
grep -r "new Array\|new Object" src/pages/Dashboard/
# Check for: growing arrays without cleanup

# 5. Event listeners not cleaned up
grep -r "addEventListener" src/pages/Dashboard/
# Check for: missing removeEventListener in cleanup
```

### Step 3.4: Performance Profiling

```bash
# Use DevTools Performance tab to record a 1-minute session
# Steps:
1. Open DevTools → Performance tab
2. Click "Record"
3. Use dashboard for 1 minute
4. Click "Stop"
5. Analyze the recording

# Look for:
- Long tasks (red in Timeline)
- Garbage collection pauses
- Increasing memory usage
- CPU throttling
```

**Example findings:**

```
Timeline shows:
- 0-30 sec: 60 FPS, smooth
- 30-45 sec: FPS drops to 30
- 45-60 sec: FPS drops to 10
- Memory: 150MB → 280MB (memory leak!)

Hypothesis: Memory leak in component, likely event listener not cleaned up
```

### Step 3.5: Root Cause Investigation

**Example: Finding the Memory Leak**

```typescript
// src/widgets/Dashboard/ui/DataFetcher.tsx

// ❌ PROBLEM: useEffect fetches data, but never clears
useEffect(() => {
  const fetchData = async () => {
    const data = await api.fetchDashboardData()
    setData(data) // This can happen after unmount
  }

  // Missing: return cleanup function
  fetchData()
}, []) // Missing: correct dependency array

// ❌ PROBLEM: Event listener registered but never removed
useEffect(() => {
  window.addEventListener('resize', handleResize)
  // Missing: removeEventListener in cleanup
}, [])

// ❌ PROBLEM: Interval runs forever
useEffect(() => {
  const interval = setInterval(refreshData, 5000)
  // Missing: return cleanup to clear interval
}, [])
```

### Step 3.6: Hypothesis & Test

```markdown
## Root Cause Analysis

### Symptoms
- Dashboard slows down after 5+ minutes
- Memory grows from 150MB to 280MB
- No console errors
- Happens in Chrome, Firefox, Safari

### Investigation Findings
1. DataFetcher component mounts once
2. useEffect fetches data every 5 seconds
3. Resize event listener added but never removed
4. Interval runs without being cleared

### Root Cause Hypothesis (VERIFIED)
Multiple issues compounding:
1. Resize listener accumulating (one per fetch)
2. Interval running multiple times (not cleared on unmount)
3. Abandoned fetch promises cause memory to grow

### Fix Strategy
1. Clean up event listeners in useEffect return
2. Clear intervals on component unmount
3. Abort fetch requests if component unmounts
4. Verify memory usage stays constant
```

### Step 3.7: Fix Implementation (Cursor)

```typescript
// src/widgets/Dashboard/ui/DataFetcher.tsx

// ✅ FIXED: Proper cleanup in useEffect
useEffect(() => {
  let isMounted = true
  const controller = new AbortController()

  const fetchData = async () => {
    try {
      const data = await api.fetchDashboardData({
        signal: controller.signal
      })
      if (isMounted) {
        setData(data)
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to fetch data:', error)
      }
    }
  }

  fetchData()

  // Cleanup: abort pending requests
  return () => {
    isMounted = false
    controller.abort()
  }
}, [])

// ✅ FIXED: Remove event listener on cleanup
useEffect(() => {
  const handleResize = () => {
    // Handle resize
  }

  window.addEventListener('resize', handleResize)

  // Cleanup: remove event listener
  return () => {
    window.removeEventListener('resize', handleResize)
  }
}, [])

// ✅ FIXED: Clear interval on cleanup
useEffect(() => {
  const interval = setInterval(refreshData, 5000)

  // Cleanup: clear interval
  return () => clearInterval(interval)
}, [])
```

### Step 3.8: Test & Verify

```bash
# Test fix in Cursor
npm run dev

# Reproduce original issue
1. Open dashboard
2. Use app for 10+ minutes
3. Monitor memory in DevTools

# Expected: Memory stays constant (~150MB)
# If memory still grows: more investigation needed

# Run full test suite
npm run test

# Run performance profiling again
DevTools → Performance → Record 1-minute session
# Memory should stay flat
```

### Step 3.9: Regression Testing

```bash
# Before committing, ensure fix doesn't break other features

# Unit tests
npm run test -- DataFetcher.test.tsx

# Integration tests
npm run test -- Dashboard.test.tsx

# Manual testing
npm run dev
# Test all dashboard features:
- [ ] Data loads on page open
- [ ] Data refreshes periodically
- [ ] Window resize handled
- [ ] No console errors
- [ ] Memory stays constant over 10 minutes
```

### Step 3.10: Commit & Deploy

```bash
git add src/widgets/Dashboard/
git commit -m "fix(dashboard): prevent memory leak by cleaning up event listeners and intervals

- Add AbortController to cancel in-flight requests on unmount
- Remove resize event listener in cleanup
- Clear data refresh interval on unmount
- Fixes dashboard slowdown after 5+ minutes of use (fixes #ISSUE_NUM)"

npm run quality:gates
git push
```

### Step 3.11: Post-Merge Monitoring

```bash
# After deployment, monitor:

# 1. Error tracking - no new errors
# 2. Performance metrics - dashboard fast
# 3. User feedback - complaints stop
# 4. Memory usage - stays constant

# Create follow-up ticket if needed
bd create \
  --title="[FOLLOW-UP] Dashboard performance monitoring" \
  --type=task \
  --description="Monitor dashboard memory/perf for 1 week after fix"
```

---

## Deep Dive Example: Complex Bug Investigation

### Real-World Scenario: Auth Flow Fails Intermittently

**Bug Report:**

```
User: "Login fails randomly, sometimes have to try 3-4 times"
Frequency: ~20% of login attempts
Environment: All browsers, all devices
Started: After recent API changes
```

### Investigation Timeline

**T=0:00 - Initial Intake (5 min)**

```bash
bd create --title="[BUG] Login fails intermittently" --type=bug --severity=critical

Questions asked:
- Does it fail at specific time of day? No
- Related to network? Unclear
- Error message shown? No (silent failure)
- Works if retry? Yes, usually works on 2nd attempt
- Happens on all browsers? Yes
```

**T=0:05 - Attempt Reproduction (15 min)**

```bash
# Try to reproduce locally
npm run dev

# Clear cache, fresh browser
1. Click login
2. Enter credentials
3. Submit
4. Observe: works 1st time

# Can't reproduce locally - suggests server/timing issue
```

**T=0:20 - Check Recent Changes (10 min)**

```bash
# Look at API changes from "after recent API changes"
git log --oneline src/shared/api/ | head -10

d26b53a api: update auth endpoints for new token format
c86169bc api: add retry logic to requests
d3e8e9902 api: change timeout from 5s to 3s

# Hypothesis: New timeout too aggressive?
# Hypothesis: Retry logic conflicting with auth?
```

**T=0:30 - Investigation in Claude Code (30 min)**

```bash
# Open auth-related files
# Search for potential issues

1. Check auth request flow
2. Check error handling
3. Check retry logic
4. Check timeout configuration
```

**Example findings:**

```typescript
// src/shared/api/auth.ts

// ❌ PROBLEM: Retry logic interferes with auth
export const authApi = {
  login: async (credentials) => {
    return request('/auth/login', {
      method: 'POST',
      body: credentials,
      retries: 3,  // ← ISSUE: Retrying auth requests!
      timeout: 3000, // ← Issue: 3s might be too short
    })
  }
}

// ❌ Why this is a problem:
// 1. User submits login
// 2. Request times out at 3s
// 3. Retry logic kicks in
// 4. Retry conflicts with original request
// 5. One fails, one succeeds intermittently
```

**T=1:00 - Root Cause Identified (20 min)**

```markdown
## Root Cause: Auth Retries + Aggressive Timeout

### Timeline of Failure
1. Login request sent (attempt 1)
2. Server slow (high load)
3. Request hits 3s timeout
4. Retry logic kicks in (attempt 2)
5. Original request still pending
6. Race condition: which response wins?
7. Sometimes attempt 1 succeeds, sometimes attempt 2
8. Retry causes double auth attempt
9. Server state conflict → login fails

### Why It's Intermittent
- Depends on server latency
- Depends on which retry wins race
- Depends on server state
- Happens when server is slow
```

**T=1:20 - Fix Implementation (30 min)**

```typescript
// src/shared/api/auth.ts

export const authApi = {
  login: async (credentials) => {
    return request('/auth/login', {
      method: 'POST',
      body: credentials,
      retries: 0,  // ✅ FIXED: Don't retry auth requests
      timeout: 10000, // ✅ FIXED: Give auth 10s (idempotent requests safe)
    })
  }
}

// Better approach: Retry only safe operations
// - GET requests: safe to retry
// - POST to idempotent endpoints: safe to retry
// - Auth requests: NOT safe to retry (state change on server)
```

**T=1:50 - Testing (30 min)**

```bash
# Load test the login flow
npm run dev

# Simulate slow server:
DevTools → Network → Slow 3G

# Try login multiple times
1. Click login
2. Submit
3. Wait for response (simulating slow server)
4. Verify: Always succeeds on first attempt (no retry)

# Run auth tests
npm run test -- auth.test.tsx
# Should all pass

# Manual regression testing
- Login on fast network: ✅ works
- Login on slow network: ✅ works
- Login on very slow network: ✅ works
```

**T=2:20 - Deployment (10 min)**

```bash
git add src/shared/api/
git commit -m "fix(auth): prevent login retry loop that caused intermittent failures

- Remove retries from POST /auth/login (not idempotent)
- Increase timeout from 3s to 10s for slower networks
- Retry only safe GET operations
- Fixes intermittent 'login fails sometimes' issue (fixes #12345)"

npm run quality:gates
git push
```

**T=2:30 - Post-Merge Monitoring**

```
Monitor for 1 week:
- Error tracking: Login success rate (was ~80%, should be 100%)
- User feedback: No more complaints
- Performance: No slowdown from longer timeout
```

**Result:** Bug resolved, root cause understood, fix prevents future similar issues

---

## Bug Investigation Checklist

Use this checklist for any complex bug:

```markdown
## Bug Investigation Checklist

### Reproduction (10-15 min)
- [ ] Can reproduce bug locally?
- [ ] Happens consistently or intermittently?
- [ ] Specific browser/OS/version?
- [ ] Specific user actions or timing?
- [ ] Clear error message or silent failure?
- [ ] Environment matters? (dev vs staging vs production)

### Information Gathering (10-15 min)
- [ ] Check recent code changes (git log)
- [ ] Check deployment history (when did this start?)
- [ ] Check error logs/monitoring
- [ ] Check user data/context from bug report
- [ ] Confirm scope (one user or widespread?)

### Isolation (15-30 min)
- [ ] Is it in specific component? Use grep to find related code
- [ ] Is it browser-specific? Test all major browsers
- [ ] Is it timing-related? Use DevTools to profile
- [ ] Is it state-related? Check component state
- [ ] Is it data-related? Check input data

### Hypothesis Formation (10 min)
- [ ] What's the most likely cause?
- [ ] What's the second most likely?
- [ ] What evidence supports each?
- [ ] What test would prove/disprove?

### Root Cause Verification (15-30 min)
- [ ] Create minimal repro test case
- [ ] Add debug logging
- [ ] Use DevTools profiling
- [ ] Check similar code patterns
- [ ] Verify hypothesis with minimal repro

### Fix (30-60 min)
- [ ] Implement fix in Cursor
- [ ] Test fix doesn't break anything else
- [ ] Run full test suite
- [ ] Get code review
- [ ] Commit with detailed message

### Verification (15-30 min)
- [ ] Original bug now fixed?
- [ ] Regression testing passed?
- [ ] Performance impact neutral?
- [ ] Works in all browsers?

### Post-Merge (ongoing)
- [ ] Monitor error tracking
- [ ] Monitor performance metrics
- [ ] Monitor user feedback
- [ ] Create follow-up tickets if needed
```

---

## Common Bug Patterns

### Pattern 1: Memory Leak

**Symptoms:** App slows down over time, memory grows

**Root causes:**

- useEffect without cleanup function
- Event listeners not removed
- Intervals not cleared
- Subscriptions not unsubscribed

**Quick test:** Check DevTools memory over 10 minutes

### Pattern 2: Race Condition

**Symptoms:** Intermittent failures, sometimes works sometimes doesn't

**Root causes:**

- Async operations without proper sequencing
- Network race (retry vs original request)
- State updates after unmount

**Quick test:** Enable slow network in DevTools, try to reproduce

### Pattern 3: Browser Compatibility

**Symptoms:** Works in Chrome, fails in Firefox/Safari

**Root causes:**

- Using newer JS/CSS features
- Browser-specific bugs
- Different DOM timing
- Polyfills missing

**Quick test:** Test in all major browsers

### Pattern 4: Timeout/Performance

**Symptoms:** Occasional failures, more under load

**Root causes:**

- Timeout too aggressive
- Slow network not considered
- Expensive operations blocking

**Quick test:** Throttle network in DevTools

### Pattern 5: State Management Bug

**Symptoms:** Feature works, but data out of sync

**Root causes:**

- State not updated correctly
- Stale closures
- Race condition in state updates
- Missing validation

**Quick test:** Check Redux/Zustand state in DevTools

---

## IDE Usage for Bug Fixing

### Claude Code (Investigation)

- Open affected files
- Use Grep to search for related code
- Identify patterns and potential issues
- Formulate hypothesis
- Profile with DevTools

### Cursor (Implementation)

- Fix the code
- Write test for reproduction
- Run tests locally
- Verify fix works

### Decision Tree: Claude Code or Cursor?

```
Bug needs fixing?

├─ Understand root cause?
│  ├─ YES → Claude Code (Opus) for analysis
│  └─ NO → Start with Claude Code to investigate
│
└─ Have hypothesis?
   ├─ YES → Move to Cursor for implementation
   └─ NO → More investigation in Claude Code
```

---

## Troubleshooting: Can't Find Root Cause?

1. **Get more data:** Ask user for browser console logs, network tab
2. **Narrow scope:** Does it happen on specific page? Browser? Device?
3. **Try git bisect:** Find the commit that broke it
4. **Add logging:** Temporary console.log to trace execution
5. **Search codebase:** Similar patterns might have been fixed before
6. **Ask for help:** Complex bugs sometimes need pair debugging
7. **Create minimal repro:** Isolate the bug to smallest case possible
8. **Check dependencies:** Did a library update break something?

---

## Key Takeaways

1. **Reproduction First:** Can't fix what you can't reproduce
2. **Investigate Systematically:** Use checklists, gather data methodically
3. **Root Cause Matters:** Fix the cause, not the symptom
4. **Test Thoroughly:** Regression testing prevents new bugs
5. **Document Investigation:** Helps future maintainers
6. **Learn Patterns:** Memory leaks, race conditions, etc. repeat
7. **Monitor After Fix:** Watch error tracking for improvement
8. **Prevent Future Bugs:** Consider architectural changes to prevent pattern
