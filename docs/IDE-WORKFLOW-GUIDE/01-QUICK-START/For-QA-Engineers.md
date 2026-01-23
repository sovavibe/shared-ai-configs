# Quick Start: For QA/Test Engineers

> **Your Role:** Write tests, validate quality, ensure features work correctly
>
> **Your IDE:** Cursor (primary) | Claude Code (complex analysis)
>
> **Time to first test suite:** 20 minutes

---

## 30-Second Overview

You work primarily in **Cursor** for fast test generation. When you need complex test strategy, use **Claude Code**'s analysis.

| Task Type | IDE | Time | Command |
|-----------|-----|------|---------|
| Write unit tests | Cursor | 15 min | `/test` command |
| Generate test suite | Cursor | 20 min | `@test` + describe component |
| Debug failing test | Cursor | 20 min | Run test with debug output |
| Design test strategy | Claude Code | 30 min | `/plan` complex testing approach |
| Integration test | Cursor | 30 min | Write MSW mocks + test |

**Golden Rule:** Can you describe what to test? → Cursor generates it.

---

## First 5 Minutes: Setup

### 1. Know What You're Testing

```bash
# Find component to test
find src/widgets -name "*.tsx" | head -10

# Or check Beads for test tasks
bd ready

# Pick a component or task
@your-component-path
```

### 2. Open Cursor

```bash
# Start Cursor
cursor .

# Reference the component
@src/widgets/MyComponent/MyComponent.tsx
```

### 3. Ask for Tests

```bash
# In Cursor:
# "Write comprehensive tests for this component"

# Cursor generates:
# - Test file (MyComponent.test.tsx)
# - Test cases
# - Mocks for dependencies
```

### 4. Run Tests

```bash
npm run test
```

---

## Your Core Testing Workflow

### Pattern 1: Generate Unit Tests (15 min)

```bash
# Step 1: In Cursor, reference component
@src/widgets/Button/Button.tsx

# Step 2: Ask for tests
"Write unit tests for this component. Test:
- renders with correct text
- handles click events
- disables when loading
- applies className correctly"

# Step 3: Cursor generates test file
# → src/widgets/Button/Button.test.tsx

# Step 4: Run tests
npm run test Button.test

# Step 5: Verify all green
```

### Pattern 2: Test Integration (20 min)

```bash
# Step 1: Reference multiple files
@src/widgets/LoginForm/LoginForm.tsx
@src/shared/api/auth.ts

# Step 2: Ask for integration tests
"Write integration tests for LoginForm:
- Submits form with email + password
- Shows error if API fails
- Redirects on success
- Uses mock API"

# Step 3: Cursor generates:
# - Test with MSW mocks
# - API response fixtures
# - Complete flow test

# Step 4: Run tests
npm run test LoginForm.test

# Step 5: Verify API calls work
```

### Pattern 3: Test Error Cases (10 min)

```bash
# Step 1: Ask for error case tests
"Generate tests for error scenarios:
- Network timeout
- Invalid response
- Server error (500)
- Malformed data"

# Step 2: Cursor creates test cases for each

# Step 3: Run with coverage
npm run test -- --coverage

# Step 4: Review coverage report
```

---

## Test Generation Commands

### Command 1: `/test` - Auto-Generate Tests

```bash
# In Cursor:

# After writing a component:
/test

# Cursor automatically:
# ✅ Creates test file
# ✅ Writes test cases
# ✅ Covers main happy path
# ✅ Adds error scenarios
```

### Command 2: `@test` - Reference Testing Pattern

```bash
# In Cursor:

"@test how do I test async components?

# Cursor suggests:
# - waitFor() for async operations
# - Mock promises
# - Act() wrapper for state updates
```

### Command 3: MSW Mocks - Mock API Calls

```bash
# In Cursor:

# Reference mock folder:
@src/mocks

# Ask: "Create mock for GET /users endpoint"

# Cursor generates MSW handler
# Use in tests for API testing
```

---

## Your Testing Checklist

For every component you test, ensure:

```
[ ] Happy path tested (component works normally)
[ ] Error cases tested (what breaks?)
[ ] Edge cases tested (empty state, loading, etc.)
[ ] Props tested (all prop combinations)
[ ] Events tested (clicks, form submissions)
[ ] Accessibility tested (keyboard navigation, ARIA labels)
[ ] Performance tested (render time acceptable)
```

---

## Common Testing Scenarios

### Scenario 1: Test Button Component

```bash
# In Cursor:

# Reference component:
@src/shared/ui/Button/Button.tsx

# Ask for tests:
"Write tests for this Button:
1. Renders with children text
2. Calls onClick handler
3. Disables when loading prop true
4. Shows loading spinner
5. Has correct aria-label
6. Has correct className"

# Cursor generates full test suite
npm run test Button.test
```

### Scenario 2: Test Form with API Call

```bash
# In Cursor:

@src/widgets/LoginForm/LoginForm.tsx
@src/shared/api/auth.ts

# Ask for tests:
"Write integration tests for LoginForm:
1. Accepts email/password input
2. Validates required fields
3. Submits form data to API
4. Shows error message on failure
5. Clears form and redirects on success
6. Handles network timeout"

# Cursor creates complete test with mocks
npm run test LoginForm.test
```

### Scenario 3: Test Complex State

```bash
# In Cursor:

@src/widgets/Dashboard/Dashboard.tsx
@src/shared/store/dashboardStore.ts

# Ask for tests:
"Test the Dashboard state:
1. Loads data on mount
2. Updates when filters change
3. Handles error state
4. Shows loading spinner
5. Caches results
6. Invalidates cache on refresh"

# Cursor generates state management tests
npm run test Dashboard.test
```

---

## When to Use Claude Code (Complex Testing)

### 🚩 Scenario 1: Complex Test Strategy

**Symptom:** "How should I test this performance-critical component?"

**Action:**

```bash
# In Claude Code:
/plan beads-123

# You get:
# - Performance testing approach
# - Benchmarking strategy
# - What to measure
# - Expected thresholds

# Back to Cursor to implement
```

### 🚩 Scenario 2: Multi-Component Testing

**Symptom:** "This feature touches 10 components, how do I test the entire flow?"

**Action:**

```bash
# In Claude Code:
/architect beads-123

# You get:
# - Integration test strategy
# - Mock dependencies
# - Test sequence
# - Coverage targets

# Back to Cursor to write tests
```

### 🚩 Scenario 3: Debugging Complex Test Failure

**Symptom:** "This test passes locally but fails in CI"

**Action:**

```bash
# Check CI logs
# In Claude Code:
# Describe the symptom
# Get debugging guidance

# Apply fix in Cursor
```

---

## Test Coverage Goals

```
Minimum coverage targets:
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

Quality gates enforce:
npm run test -- --coverage
npm run quality:gates
```

---

## Your Most-Used Cursor Commands

```bash
# Generate tests
/test

# Ask about testing patterns
@test pattern for [scenario]

# Reference testing utilities
@src/mocks
@src/test-utils

# Run tests
npm run test
npm run test -- --watch
npm run test -- --coverage

# Debug test
npm run test -- --debug [testname]
```

---

## MSW (Mock Service Worker) Patterns

### Pattern 1: Mock API Endpoint

```bash
# In src/mocks/handlers.ts

# Ask Cursor:
"Create MSW handler for GET /api/users that returns:"
```

### Pattern 2: Test with Mocked API

```bash
# In your test file:

# Ask Cursor:
"Write test using MSW mock for user login endpoint"

# Cursor generates:
# - Handler setup
# - Test that uses mock
# - Assertion on mock call
```

### Pattern 3: Test API Error

```bash
# Ask Cursor:
"Test error handling when API returns 500"

# Cursor creates:
# - Error handler in MSW
# - Test that triggers error
# - Assertion on error display
```

---

## Quality Gate Integration

Before committing your tests, ensure:

```bash
# Run all tests
npm run test

# Check coverage
npm run test -- --coverage

# Run quality gates
npm run quality:gates

# If anything fails:
# 1. Read error message
# 2. Ask Cursor how to fix
# 3. Apply fix
# 4. Re-run gates
```

---

## Beads Integration

### Creating Test Tasks

```bash
# When you identify component needing tests:
bd create \
  --title="Write tests for UserProfile component" \
  --type=task \
  --priority=2
```

### Updating Test Progress

```bash
# When tests are done:
bd update beads-123 --status=done
bd update beads-123 --comment="Tests complete: 15 test cases, 92% coverage"
```

---

## Your First Test Suite (20 Minutes)

### Template

```bash
# 1. Find component (2 min)
ls src/widgets | grep -i button

# 2. Open Cursor (1 min)
cursor .

# 3. Reference component (1 min)
@src/widgets/Button/Button.tsx

# 4. Ask for tests (2 min)
"Write unit tests for this Button component"

# 5. Review generated tests (5 min)
# Check coverage, readiness

# 6. Run tests (1 min)
npm run test Button.test

# 7. Fix any failures (5 min)
# Cursor helps fix assertions

# 8. Commit (3 min)
git add . && git commit -m "test: add Button component tests"
```

---

## Common Test Problems & Solutions

| Problem | Solution | Time |
|---------|----------|------|
| "Test times out" | Add `timeout: 5000` to test | 5 min |
| "Mock not working" | Check MSW handler setup | 10 min |
| "State not updating" | Wrap in `act()` | 5 min |
| "Coverage is low" | Ask Cursor: "What cases am I missing?" | 15 min |
| "Test fails in CI" | Check for timing issues, env vars | 20 min |
| "Need to mock module" | Ask Cursor: "How do I mock X?" | 10 min |

---

## Pro Tips

1. **Test behavior, not implementation** - Test "shows error" not "sets state.error"
2. **Write tests as you code** - `/test` right after component
3. **Use descriptive names** - "renders button with loading spinner when loading=true" not "test 3"
4. **Mock external dependencies** - Always mock API, storage, etc.
5. **Test error paths** - "What breaks?" is as important as "What works?"
6. **Keep tests fast** - Each test < 100ms if possible
7. **Run tests often** - `npm run test -- --watch` during development

---

## Key Concepts

- **Unit Test:** Test single component in isolation
- **Integration Test:** Test multiple components together
- **Mock:** Fake API/dependency for testing
- **Coverage:** % of code executed by tests
- **MSW:** Mock Service Worker for API mocking

---

## Next Level: Advanced Testing

- Learn **E2E testing** (Cypress/Playwright) for full flows
- Learn **Performance testing** for render optimization
- Learn **Accessibility testing** for a11y compliance
- Learn **Visual regression testing** for UI consistency

---

## Getting Help

| Question | Where to Go | Time |
|----------|------------|------|
| "How do I test this?" | Ask Cursor /test command | 5 min |
| "What test pattern should I use?" | Ask Cursor @test reference | 10 min |
| "How do I mock this?" | Ask Cursor about MSW mocking | 10 min |
| "Test strategy for complex feature?" | Claude Code /plan | 30 min |
| "Test failing in CI but passes locally?" | Claude Code /debug | 30 min |

---

## Remember

Good tests = confident commits. Cursor makes test writing fast.

✅ **Ready to test?** Run `/test` in Cursor and generate your first suite!
