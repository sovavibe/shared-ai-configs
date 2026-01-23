# Performance Optimization Strategy: Identify, Optimize, Validate, Deploy

> **TL;DR:** Measure first → Claude Code analyzes bottleneck → Cursor optimizes → Benchmark improvements → Deploy

This guide covers identifying performance issues, analyzing root causes, implementing optimizations, and validating improvements without breaking functionality.

---

## Performance Categories & Common Issues

```
┌─ RENDER PERFORMANCE (Frontend)
│  ├─ Unnecessary re-renders
│  ├─ Large component trees
│  ├─ Expensive computations in render
│  ├─ Missing memoization
│  └─ Context causing re-render cascades

├─ BUNDLE SIZE
│  ├─ Large vendor libraries
│  ├─ Duplicate dependencies
│  ├─ Unoptimized images
│  └─ Unused code not tree-shaken

├─ NETWORK / API
│  ├─ Too many API calls
│  ├─ Large response payloads
│  ├─ No caching
│  ├─ Sequential requests instead of parallel
│  └─ Slow third-party integrations

├─ DATABASE / BACKEND
│  ├─ N+1 query problems
│  ├─ Missing indexes
│  ├─ Large data transfers
│  └─ Inefficient sorting/filtering

├─ MEMORY
│  ├─ Memory leaks
│  ├─ Large data structures
│  ├─ Event listeners not cleaned up
│  └─ Growing arrays

└─ USER INTERACTION
   ├─ Slow initial load
   ├─ Janky animations
   ├─ Unresponsive buttons
   └─ Laggy scrolling
```

---

## Decision Tree: When to Optimize

```
Does your app have a performance problem?

├─ Are USERS complaining about slowness?
│  ├─ YES → Investigate and optimize
│  └─ NO → Might not be critical

├─ Does it FAIL REQUIREMENTS?
│  ├─ Requirement: Load in <3s → Currently 5s? → Optimize
│  ├─ Requirement: 60 FPS animations → Currently 30 FPS? → Optimize
│  └─ NO REQUIREMENT → Skip (YAGNI)

├─ Is it MEASURABLE?
│  ├─ Have baseline metrics? → Measure first
│  └─ NO → Get metrics before optimizing

└─ Will optimization BLOCK FEATURES?
   ├─ YES → Consider: Important enough to delay?
   └─ NO → Can do in parallel

Decision:
├─ HIGH IMPACT + MEASURABLE → Optimize now
├─ NICE TO HAVE → Backlog for later
└─ NO BASELINE → Get metrics first
```

---

## SECTION 1: Identify Performance Problems

### Step 1.1: Establish Baseline Metrics

Before optimizing, measure current state:

```bash
# Build for production
npm run build

# Check bundle size
npm run build
# Output example:
#   dist/index.html (45 KB)
#   dist/assets/index-abc123.js (850 KB)
#   dist/assets/index-xyz789.css (120 KB)
# Total: ~1.0 MB

# Run Lighthouse in Chrome DevTools
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit (Desktop + Mobile)
4. Record scores:
   - Performance: 68
   - Accessibility: 92
   - Best Practices: 85
   - SEO: 100

# Measure core web vitals locally
npm run dev
# DevTools → Performance tab
# Record actions
# Look for:
  - Largest Contentful Paint (LCP): <2.5s ✅ (Good)
  - First Input Delay (FID): <100ms ✅ (Good)
  - Cumulative Layout Shift (CLS): <0.1 ✅ (Good)
```

### Step 1.2: Identify Bottleneck

```bash
# Use Chrome DevTools Performance tab to find what's slow

npm run dev

# Steps:
1. Open DevTools
2. Performance tab
3. Click Record
4. Perform action that feels slow (e.g., load dashboard)
5. Click Stop
6. Analyze the recording

# Look for:
- Long tasks (>50ms shown in red)
- JavaScript execution time
- Rendering time
- Paint time
```

**Example findings:**

```
Timeline analysis:
- Initial load: 3.2s total
  - HTML parse: 0.2s
  - CSS parse & layout: 0.4s
  - JS download: 0.8s (850 KB!)
  - JS execution: 1.5s ← BOTTLENECK
  - Initial render: 0.3s

Finding: JavaScript parsing/execution is the bottleneck
```

### Step 1.3: Profile React Rendering

```bash
# Use React DevTools Profiler to find expensive components

npm run dev

1. Open DevTools → React DevTools tab
2. Click "Profiler" tab
3. Record a session (click record button)
4. Perform action that's slow
5. Stop recording
6. Analyze which components are rendering

# Look for:
- Components with long render times
- Components rendering frequently
- Unnecessary re-renders
```

**Example findings:**

```
Dashboard component render analysis:
- DashboardPage rendered: 45ms
  - DashboardHeader: 15ms (fine)
  - DashboardCharts: 28ms ← EXPENSIVE
    - ChartOne: 10ms
    - ChartTwo: 18ms ← VERY EXPENSIVE
  - DashboardFooter: 2ms

Finding: ChartTwo component is expensive, renders frequently
```

### Step 1.4: Identify Issue Type

Based on profiling, classify the issue:

| Issue | Symptom | Solution |
|-------|---------|----------|
| **Bundle size** | JS file 850KB, long parse time | Code splitting, lazy load |
| **Expensive render** | ChartTwo takes 18ms | Memoization, optimize algorithm |
| **Frequent re-renders** | Component renders 10x per action | Use useMemo, useCallback |
| **Large data** | Dashboard loads 50MB of data | Pagination, filtering, lazy load |
| **Memory leak** | Memory grows over time | Fix cleanup, remove listeners |
| **Network** | API call takes 2s | Caching, parallel requests |
| **Animation** | Janky scrolling, 30 FPS | Optimize CSS, use transforms |

---

## SECTION 2: Analyze Bottleneck (Claude Code)

### Step 2.1: Create Investigation Ticket

```bash
bd create \
  --title="[PERF] Dashboard load slow (3.2s vs 2s target)" \
  --type=performance \
  --severity=medium \
  --description="Baseline: 3.2s total, target 2s. JS execution is bottleneck (1.5s). See profiling data in Lighthouse report."
```

### Step 2.2: Investigate with Claude Code

```bash
# In Claude Code, analyze the slow component
# Open the profiling report, code, and start investigation

# Questions to answer:
1. What makes ChartTwo expensive?
2. Does it compute lots of data?
3. Does it render frequently?
4. Is there redundant work?
5. Can we memoize or lazy-load?

# Use Grep to search for related code
grep -r "ChartTwo" src/ --include="*.tsx"
# Find the component, its dependencies, how it's used
```

**Investigation Example:**

```typescript
// src/widgets/Dashboard/ui/Charts/ChartTwo.tsx

// ❌ PROBLEM 1: Expensive computation on every render
function ChartTwo({ data }) {
  // This runs on EVERY render, even if data doesn't change
  const processedData = data.map(d => ({
    ...d,
    // Complex calculations here
    calculated: expensiveCalculation(d),
    aggregated: aggregateData(d),
    transformed: transformForChart(d),
    // This happens every render!
  }))

  return <BarChart data={processedData} />
}

// ❌ PROBLEM 2: Component re-renders when parent re-renders
function Dashboard() {
  const [filterValue, setFilterValue] = useState('')

  // When filterValue changes, Dashboard re-renders
  // Which causes ChartTwo to re-render (and re-calculate!)
  // Even though chart data didn't change
  return (
    <>
      <Filter onChange={setFilterValue} />
      <ChartTwo data={expensiveData} />
    </>
  )
}

// ❌ PROBLEM 3: Large library not optimized
import { BarChart } from 'some-chart-library' // 200KB!
```

### Step 2.3: Root Cause Analysis

```markdown
## Performance Root Cause Analysis: ChartTwo

### Symptoms
- ChartTwo renders in 18ms (slow)
- Renders frequently (on parent re-render)
- Dashboard takes 3.2s to load (too slow)

### Investigation Findings

1. **Expensive Computation**
   - expensiveCalculation() on every render
   - Data has 5000 rows
   - Each row: 5 operations * 5000 rows = 25,000 operations
   - Per render: ~18ms

2. **Unnecessary Re-renders**
   - Parent Dashboard re-renders on filter change
   - ChartTwo re-renders even when data unchanged
   - Can see in Profiler: 10 renders during session

3. **Bundle Size Issue**
   - Chart library 200KB
   - Imported on every page, even if not used
   - Not tree-shaken

### Root Cause (Verified)
Multiple issues compounding:
1. Expensive computation not memoized
2. Component re-renders unnecessarily
3. Rendering even when props unchanged

### Optimization Strategy (in priority order)
1. Memoize expensive computation (5x improvement expected)
2. Memoize component with React.memo (prevents unnecessary renders)
3. Code-split chart library (async load, reduce initial bundle)
4. Virtualize if data gets larger (future optimization)
```

### Step 2.4: Predict Improvement

```markdown
## Performance Improvement Projections

### Current State
- ChartTwo render time: 18ms
- Dashboard total load: 3.2s
- JS parse/execution: 1.5s

### After Optimization 1: Memoize Computation
Strategy: Use useMemo to cache processed data
Expected improvement: 15x (18ms → 1.2ms)
Reason: Computation only runs when data changes

### After Optimization 2: React.memo Component
Strategy: Wrap ChartTwo in React.memo
Expected improvement: 5x (1.2ms → 0.24ms per unnecessary render)
Reason: Component doesn't re-render when props unchanged

### After Optimization 3: Code-split Chart Library
Strategy: Dynamic import chart library
Expected improvement: 20% faster initial load (JS parse time)
Reason: 200KB library loaded on-demand, not blocking initial load

### Projected Total Improvement
- ChartTwo: 18ms → 0.24ms per render (~75x faster)
- Dashboard load: 3.2s → ~2.0s (37% improvement)
- Expected results: Target of 2s achieved

### Risk Level: LOW
- No breaking changes
- Behavior unchanged
- Easy to rollback
```

---

## SECTION 3: Implement Optimization (Cursor)

### Step 3.1: Create Optimization Branch

```bash
git checkout -b perf/optimize-dashboard-chart-performance
```

### Step 3.2: Optimization 1 - Memoize Computation

```typescript
// src/widgets/Dashboard/ui/Charts/ChartTwo.tsx

import { useMemo } from 'react'

// BEFORE: Computation on every render
function ChartTwo({ data }) {
  const processedData = data.map(d => ({
    ...d,
    calculated: expensiveCalculation(d),
    aggregated: aggregateData(d),
    transformed: transformForChart(d),
  }))

  return <BarChart data={processedData} />
}

// AFTER: Memoize computation
function ChartTwo({ data }) {
  const processedData = useMemo(() => {
    return data.map(d => ({
      ...d,
      calculated: expensiveCalculation(d),
      aggregated: aggregateData(d),
      transformed: transformForChart(d),
    }))
  }, [data]) // ← Only recalculate when data changes

  return <BarChart data={processedData} />
}
```

### Step 3.3: Optimization 2 - Memoize Component

```typescript
// src/widgets/Dashboard/ui/Charts/ChartTwo.tsx

// BEFORE
function ChartTwo({ data }) {
  // ... memoized computation
  return <BarChart data={processedData} />
}

// AFTER: Memoize the component itself
const ChartTwo = React.memo(function ChartTwo({ data }) {
  const processedData = useMemo(() => {
    return data.map(d => ({
      ...d,
      calculated: expensiveCalculation(d),
      aggregated: aggregateData(d),
      transformed: transformForChart(d),
    }))
  }, [data])

  return <BarChart data={processedData} />
})

export default ChartTwo
```

### Step 3.4: Optimization 3 - Code-split Chart Library

```typescript
// src/widgets/Dashboard/ui/Charts/BarChart.tsx

import { Suspense, lazy } from 'react'

// ❌ BEFORE: Import immediately
// import { BarChart } from 'some-chart-library' // 200KB loaded upfront

// ✅ AFTER: Lazy load chart library
const BarChart = lazy(() =>
  import('some-chart-library').then(module => ({
    default: module.BarChart,
  }))
)

export function ChartComponent({ data }) {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <BarChart data={data} />
    </Suspense>
  )
}
```

### Step 3.5: Bonus Optimization - Optimize Parent

```typescript
// src/pages/Dashboard/ui/DashboardPage.tsx

// BEFORE: Filter causes ChartTwo to re-render unnecessarily
function Dashboard() {
  const [filterValue, setFilterValue] = useState('')

  return (
    <>
      <Filter value={filterValue} onChange={setFilterValue} />
      <ChartTwo data={data} />
    </>
  )
}

// AFTER: Separate state so filter doesn't affect chart
function Dashboard() {
  const [filterValue, setFilterValue] = useState('')
  const [chartData] = useState(data) // ← Fixed data, won't change

  return (
    <>
      <Filter value={filterValue} onChange={setFilterValue} />
      <ChartTwo data={chartData} />
    </>
  )
}
```

### Step 3.6: Test Locally

```bash
# Development testing
npm run dev

# Manual performance test:
1. Open DevTools Performance tab
2. Clear cache
3. Reload page
4. Record
5. Wait for dashboard to load
6. Stop recording
7. Compare to baseline

# Expected result:
- JS parse/execution time should be ~50% less
- Initial load should be 2.0-2.2s (was 3.2s)
```

### Step 3.7: Benchmark Improvements

```bash
# Automated performance testing
npm run test -- performance.test.ts

# Manual Lighthouse audit
1. Chrome DevTools → Lighthouse
2. Run audit (Desktop)
3. Compare to baseline (was 68)
4. Expected: 85+ (improvement)

# Bundle size check
npm run build
# Expected: 650 KB instead of 850 KB (23% reduction)
```

---

## SECTION 4: Validate & Measure Improvements

### Step 4.1: Performance Test Results

**Baseline vs After Optimization:**

```
BASELINE (Before Optimization)
─────────────────────────────────
Bundle Size:
  JS: 850 KB (parse: 0.8s)
  CSS: 120 KB
  Total: 1.0 MB

Core Web Vitals (Lighthouse):
  LCP: 3.2s ❌ (target: 2.5s)
  FID: 150ms ❌ (target: 100ms)
  CLS: 0.15 ⚠️ (target: 0.1)

Performance Score: 68

React Component Render:
  Dashboard: 45ms
    ChartTwo: 18ms
  Re-renders per session: 10

─────────────────────────────────
AFTER OPTIMIZATION
─────────────────────────────────
Bundle Size:
  JS: 650 KB (parse: 0.55s) ✅ -23%
  CSS: 120 KB
  Total: 770 KB ✅ -23%

Core Web Vitals (Lighthouse):
  LCP: 2.1s ✅ (16% improvement)
  FID: 85ms ✅ (43% improvement)
  CLS: 0.08 ✅ (47% improvement)

Performance Score: 87 ✅ (+19)

React Component Render:
  Dashboard: 28ms ✅ (38% improvement)
    ChartTwo: 0.24ms ✅ (98% improvement!)
  Re-renders per session: 2 ✅ (avoided 8 unnecessary renders)

─────────────────────────────────
RESULTS SUMMARY
─────────────────────────────────
✅ All performance targets met
✅ LCP: 3.2s → 2.1s (34% faster)
✅ FID: 150ms → 85ms (43% faster)
✅ Bundle: 850KB → 650KB (23% smaller)
✅ Lighthouse: 68 → 87 (+19 points)
✅ No functional changes
✅ Zero regressions
```

### Step 4.2: Regression Testing

```bash
# Functional testing - ensure nothing broke
npm run test

# Expected: All tests pass
# If tests fail: Something broke in optimization, fix it

# Manual testing:
1. Load dashboard → data shows correctly
2. Click filter → chart updates
3. Scroll page → smooth (no jank)
4. Charts render correctly
5. All features work
6. No console errors
```

### Step 4.3: Cross-Browser Testing

```bash
# Test on:
- Chrome (Windows): ✅ 2.1s LCP
- Firefox (macOS): ✅ 2.0s LCP
- Safari (iOS): ✅ 2.3s LCP
- Edge (Windows): ✅ 2.1s LCP

# Verify: Performance consistent across browsers
```

### Step 4.4: Real-World Testing (Staging)

If available, test on staging environment:

```bash
# Deploy to staging
# Monitor real user metrics

# Measure:
- Real user load times
- Real user interaction speed
- Error rates (ensure no regressions)
- User feedback

# Compare to production baseline
```

---

## SECTION 5: Document & Deploy

### Step 5.1: Commit with Details

```bash
git add src/widgets/Dashboard/
git add src/app/

git commit -m "perf: optimize dashboard chart rendering by 75%

Optimizations:
- Memoize expensive data transformation (useMemo)
- Wrap ChartTwo in React.memo to prevent unnecessary re-renders
- Code-split chart library with lazy loading
- Avoid parent re-render affecting chart

Results:
- Dashboard load: 3.2s → 2.1s (34% faster) ✅
- Lighthouse performance: 68 → 87 (+19 points) ✅
- Bundle size: 850KB → 650KB (23% smaller) ✅
- ChartTwo render: 18ms → 0.24ms (98% faster) ✅
- Core Web Vitals: All metrics improved ✅

Tests: All tests passing, no regressions
"

npm run quality:gates
git push
```

### Step 5.2: Code Review

```bash
# Create PR
# Highlight:
- What was slow and why
- What optimizations were made
- Before/after metrics
- No regressions

# Example PR description:
"""
## Performance: Dashboard Optimization

### Problem
Dashboard load time: 3.2s (target: 2.5s)
Primary bottleneck: ChartTwo component expensive rendering

### Solution
1. Memoize expensive computation (useMemo)
2. Prevent unnecessary re-renders (React.memo)
3. Code-split chart library (lazy loading)

### Results
- Load time: 3.2s → 2.1s (34% improvement) ✅
- Lighthouse: 68 → 87 (+19 points) ✅
- Bundle: 850KB → 650KB (23% smaller) ✅
- No functional changes or regressions ✅

### Testing
- [x] All tests passing
- [x] Lighthouse audit: 87/100
- [x] Cross-browser tested
- [x] Manual regression testing
- [x] Staging validation

Closes #PERFORMANCE-123
"""

# Get approval from reviewer
```

### Step 5.3: Deploy

```bash
git checkout main
git pull
git merge --no-ff perf/optimize-dashboard-chart
git push

# Monitor production for 24 hours:
1. Real user metrics improving
2. No error spike
3. No user complaints
4. Performance metrics stable
```

### Step 5.4: Post-Deployment Monitoring

```markdown
## Performance Monitoring Checklist

### Immediate (1 hour after deploy)
- [ ] No error spike in error tracking
- [ ] Page loads successfully
- [ ] Charts render correctly
- [ ] No console errors

### Short-term (24 hours)
- [ ] Real user metrics align with profiling
- [ ] No user complaints
- [ ] Performance stable
- [ ] No unexpected slowdowns

### Long-term (1 week)
- [ ] Metrics continue to improve
- [ ] No performance regression
- [ ] User engagement metrics
- [ ] Document final improvements

### What to Look For
- Error rate should stay same or decrease
- Load times should match profiling (2.0-2.2s)
- User session metrics should improve
- No spike in memory usage
```

---

## Deep Dive Example: Bundle Size Optimization

### Scenario: App Takes Too Long to Load (JS Too Large)

**Initial Profiling:**

```
Bundle size: 1.2 MB
Parse time: 1.2s
Initial render: 2.8s
Lighthouse score: 52 (Poor)
```

**Investigation (Claude Code):**

```bash
# What's taking up space?
npm run build
# Output shows:
#   react: 120 KB (necessary)
#   chart-library: 280 KB (loaded on every page)
#   date-fns: 150 KB (loaded globally)
#   lodash: 100 KB (duplicated, also in other packages)
#   vendor: 300 KB (utilities and helpers)

# Root causes identified:
1. Chart library loaded even on pages without charts (280 KB wasted)
2. date-fns loaded globally, but only used in 2 places (150 KB partial waste)
3. Lodash duplicated (packed twice, 100 KB waste)
4. Vendor bundle could be split better
```

**Optimization (Cursor):**

```typescript
// BEFORE
import { BarChart } from 'chart-library' // Always included (280 KB)
import { format } from 'date-fns' // Always included (150 KB)
import _ from 'lodash' // Included twice (100 KB)

// AFTER
// Lazy-load chart on dashboard only
const BarChart = lazy(() => import('chart-library'))

// Move date formatting to specific component
// (only imported where needed)
import { customFormat } from '@/shared/utils/format'

// Remove lodash, use native JS
const unique = (arr) => [...new Set(arr)]
```

**Results:**

```
Before: 1.2 MB
After: 720 KB (40% reduction!)

Parse time: 1.2s → 0.8s (33% faster)
Initial render: 2.8s → 1.8s (36% faster)
Lighthouse: 52 → 78 (50% improvement)
```

---

## Common Optimization Patterns

### Pattern 1: Memoize Expensive Computation

```typescript
// ❌ BAD: Runs on every render
function Component({ items }) {
  const sorted = items.sort((a, b) => a.value - b.value)
  return <List items={sorted} />
}

// ✅ GOOD: Only re-compute when items change
function Component({ items }) {
  const sorted = useMemo(
    () => items.sort((a, b) => a.value - b.value),
    [items]
  )
  return <List items={sorted} />
}
```

### Pattern 2: Prevent Unnecessary Re-renders

```typescript
// ❌ BAD: Re-renders when parent re-renders
function Child({ data }) {
  return <Chart data={data} />
}

// ✅ GOOD: Only re-renders when props change
const Child = React.memo(function Child({ data }) {
  return <Chart data={data} />
})
```

### Pattern 3: Code-split Large Libraries

```typescript
// ❌ BAD: 200 KB loaded on every page
import { HeavyChart } from 'chart-lib'

// ✅ GOOD: Only loaded when needed
const HeavyChart = lazy(() => import('chart-lib'))

// Usage:
<Suspense fallback={<Skeleton />}>
  <HeavyChart />
</Suspense>
```

### Pattern 4: Batch State Updates

```typescript
// ❌ BAD: Causes 3 re-renders
function Form() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [age, setAge] = useState('')

  const handleReset = () => {
    setName('')
    setEmail('')
    setAge('')
  }
}

// ✅ GOOD: Single re-render with useCallback
function Form() {
  const [data, setData] = useState({ name: '', email: '', age: '' })

  const handleReset = useCallback(() => {
    setData({ name: '', email: '', age: '' })
  }, [])
}
```

### Pattern 5: Virtualize Long Lists

```typescript
// ❌ BAD: Renders 10,000 items (very slow)
function List({ items }) {
  return (
    <div>
      {items.map(item => <Item key={item.id} data={item} />)}
    </div>
  )
}

// ✅ GOOD: Only renders visible items
import { FixedSizeList } from 'react-window'

function List({ items }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={35}
    >
      {({ index, style }) => (
        <Item style={style} data={items[index]} />
      )}
    </FixedSizeList>
  )
}
```

---

## Performance Monitoring Checklist

```markdown
## Continuous Performance Monitoring

### Before Every Deploy
- [ ] Run Lighthouse audit (target: 80+)
- [ ] Check bundle size (no increase)
- [ ] Test on slow network (DevTools throttling)
- [ ] Test on low-end device (via emulation)

### Monthly Performance Review
- [ ] Check Core Web Vitals scores
- [ ] Monitor real user metrics
- [ ] Identify new performance bottlenecks
- [ ] Plan next optimization cycle

### Performance Regressions (When Found)
- [ ] Create performance ticket
- [ ] Profile the issue
- [ ] Fix in next sprint
- [ ] Prevent similar issues

### Documentation
- [ ] Record why each optimization was done
- [ ] Document before/after metrics
- [ ] Share learnings with team
- [ ] Update performance guidelines
```

---

## Key Takeaways

1. **Measure First:** Always get baseline before optimizing
2. **Identify Bottleneck:** Profile to find root cause
3. **Analyze Options:** Consider multiple optimization approaches
4. **Test Improvements:** Verify optimization works
5. **Avoid Regressions:** Test functionality thoroughly
6. **Document Results:** Share improvements with team
7. **Monitor Ongoing:** Watch performance after deploy
8. **Prevent Future Issues:** Document patterns learned
9. **Balance:** Don't over-optimize, consider ROI
10. **Communicate:** Explain performance decisions

---

## Resources

- [Chrome DevTools Performance Tab](https://developer.chrome.com/docs/devtools/performance/)
- [React DevTools Profiler](https://react.dev/learn/react-developer-tools)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Bundle Analyzer](https://github.com/webpack-bundle-analyzer/webpack-bundle-analyzer)
