# Quality Gates Integration: Automatic Code Quality Verification

> **Purpose:** Comprehensive guide to quality gates system, pre-commit hooks, and integration with IDE workflow. Learn what gates do, how they work, and how to fix common failures.
>
> **Use this when:** "What's this quality gate error?", "How do I fix linting?", "Why won't my commit go through?", "What is ESLint/TypeScript/tests checking?"

---

## What Are Quality Gates?

### The Problem They Solve

In traditional workflows, code quality issues are caught late:

- ❌ Developer pushes code
- ❌ Hours later, CI/CD fails
- ❌ Developer back-and-forth with reviewer
- ❌ Merge delayed by days

With quality gates:

- ✅ Catch issues BEFORE commit
- ✅ Instant feedback in IDE
- ✅ Fewer review cycles
- ✅ Faster merges

### Quality Gates Philosophy

**Fail fast, fix immediately.**

Before pushing any code, gates verify:

1. **ESLint** - Code style, naming, patterns
2. **TypeScript** - Type safety, compilation
3. **Tests** - Unit/integration tests pass
4. **Secretlint** - No hardcoded secrets/credentials

If ANY gate fails, commit is rejected. You fix immediately and retry.

---

## Gate Architecture

### Where Gates Run

```
Developer's Machine:
  ├─ Pre-commit hook (Husky)
  │  └─ Runs: npm run quality:gates
  │     ├─ ESLint
  │     ├─ TypeScript
  │     ├─ Tests
  │     └─ Secretlint
  │     If PASS → allow commit
  │     If FAIL → reject, show errors
  │
  └─ Before push (Husky pre-push)
     └─ Runs: git log checks, branch validation

GitHub Actions (CI/CD):
  ├─ On PR: Run all gates again
  ├─ On merge to main: Extra security gates
  └─ On release: Full test suite + coverage
```

### How It Works

```
git commit
    ↓
Husky pre-commit hook triggers
    ↓
npm run quality:gates
    ├─ ESLint (checks code style)
    ├─ TypeScript (type checking)
    ├─ Tests (vitest)
    └─ Secretlint (detects secrets)
    ↓
All pass? → Allow commit
Any fail? → Show error, prevent commit
    ↓
git push
    ↓
Husky pre-push hook triggers
    ↓
Branch validation, remote checks
    ↓
Push to GitHub
    ↓
GitHub Actions CI/CD runs full test suite
```

---

## Quality Gates: Detailed Breakdown

### Gate 1: ESLint (Code Style & Patterns)

**What it checks:**

- Code style (indentation, spacing, semicolons)
- Variable naming (camelCase, PascalCase)
- Unused variables
- Missing imports
- React patterns (hooks rules, prop-types)
- Console.log left in code
- TODO comments

**Command:**

```bash
npm run lint
```

**Example failure:**

```
ESLint Issues Found:

src/components/Button.tsx
  34:5 error: 'unused' is assigned but never used (no-unused-vars)
  45:0 error: Multiple blank lines not allowed (no-multiple-empty-lines)
  67:3 warning: Unexpected console statement (no-console)

src/hooks/useForm.ts
  12:1 error: Missing 'key' prop in list item (react/jsx-key)

Please fix these issues before committing.
```

**How to fix:**

```bash
# Option 1: Auto-fix (fixes most issues)
npm run lint --fix

# Option 2: Manual fix (for issues that need thought)
# Edit the files mentioned above
# Remove unused variables, fix formatting

# Then verify
npm run lint
```

### Gate 2: TypeScript (Type Safety)

**What it checks:**

- Type correctness
- Missing type annotations (in strict mode)
- Interface compliance
- Function parameter types
- Return types
- Import/export types

**Command:**

```bash
npx tsc --noEmit
```

**Example failure:**

```
src/pages/Profile.tsx:15:5 - error TS2322: Type 'string | undefined' is not assignable to type 'string'.

src/utils/api.ts:8:3 - error TS7005: Variable 'response' implicitly has type 'any'.

src/components/Form.tsx:42:10 - error TS2339: Property 'value' does not exist on type '{}'.

Please fix these type issues before committing.
```

**How to fix:**

```bash
# Option 1: Add type annotations
// Before
const response = api.fetchUser();

// After
const response: UserResponse = api.fetchUser();

# Option 2: Use type guards
if (email !== undefined) {
  // Now email is definitely string
}

# Option 3: Fix interface mismatches
interface Form {
  name: string;
}
const form: Form = { name: "John" };  // ✅ OK

# Then verify
npx tsc --noEmit
```

### Gate 3: Tests (Unit & Integration)

**What it checks:**

- All unit tests pass
- All integration tests pass
- Test files compile
- Mock setup works
- No flaky tests

**Command:**

```bash
npm run test
```

**Example failure:**

```
FAIL src/components/__tests__/Button.test.tsx

✓ renders button with text (45ms)
✓ handles click event (32ms)
✗ applies correct styling (1200ms)
  Expected: "btn-primary"
  Received: "btn-default"

FAIL src/utils/__tests__/api.test.tsx

✗ retries failed requests (timeout)
  Expected: request to complete in 5000ms
  Received: timed out after 5000ms

2 test suites failed. 12 passed, 2 failed.
```

**How to fix:**

```bash
# Option 1: Run specific test for faster debugging
npm run test -- Button.test.tsx

# Option 2: Run in watch mode
npm run test --watch

# Option 3: Debug test
npm run test -- --debug

# Option 4: Check test coverage
npm run test -- --coverage

# Then verify
npm run test
```

### Gate 4: Secretlint (No Hardcoded Secrets)

**What it checks:**

- Hardcoded API keys
- Hardcoded passwords
- AWS/GCP credentials
- Private tokens
- Database connection strings

**Command:**

```bash
npm run secretlint
```

**Example failure:**

```
Secrets Found:

src/utils/api.ts:5:10
  const API_KEY = "sk_live_51234567890abcdefg";
                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  error: High entropy string detected (potential API key)

src/config/database.ts:3:30
  const DB_URL = "postgres://user:p@ssw0rd@localhost/db";
                                ^^^^^^^^
  error: Potential password detected

2 secrets found. Remove before committing.
```

**How to fix:**

```bash
# Option 1: Move to environment variable
// Before
const API_KEY = "sk_live_51234567890abcdefg";

// After
const API_KEY = process.env.STRIPE_API_KEY;

# Option 2: Move to .env file
# Create .env.local (gitignored)
STRIPE_API_KEY=sk_live_51234567890abcdefg
API_BASE_URL=https://api.example.com

# In code:
const API_KEY = process.env.STRIPE_API_KEY;
const API_URL = process.env.API_BASE_URL;

# Then verify
npm run secretlint
```

---

## Running Quality Gates Manually

### Before Each Commit

```bash
# Run all gates
npm run quality:gates

# Expected output if all pass:
# ✅ ESLint passed
# ✅ TypeScript passed
# ✅ Tests passed
# ✅ Secretlint passed
# All quality gates passed! Ready to commit.

# If any fail:
# ❌ ESLint failed - see errors above
# Fix issues and re-run: npm run quality:gates
```

### Running Individual Gates

```bash
# Just linting
npm run lint

# Just type checking
npx tsc --noEmit

# Just tests
npm run test

# Just secret scanning
npm run secretlint

# Linting + auto-fix
npm run lint --fix

# Tests in watch mode (for development)
npm run test --watch

# Tests with coverage report
npm run test -- --coverage
```

---

## How to Fix Common Gate Failures

### ESLint Failures

#### Issue: Unused variable

```
error: 'userId' is assigned but never used (no-unused-vars)
```

**Fix:**

```javascript
// Option 1: Remove if truly unused
- const userId = props.id;

// Option 2: Use it
const userId = props.id;
console.log(userId);

// Option 3: Prefix with _ if intentionally unused
const _userId = props.id;  // Not used yet, but will be
```

#### Issue: Missing import

```
error: 'useState' is not defined (no-undef)
```

**Fix:**

```javascript
// Add import
+ import { useState } from 'react';
```

#### Issue: Console.log in production code

```
warning: Unexpected console statement (no-console)
```

**Fix:**

```javascript
// Option 1: Remove
- console.log(data);

// Option 2: Use logger if debugging is important
+ logger.debug(data);

// Option 3: Disable for specific line (if intentional)
+ // eslint-disable-next-line no-console
  console.error(error);  // Error should always log
```

#### Issue: Missing key in list

```
error: Missing 'key' prop in list item (react/jsx-key)
```

**Fix:**

```javascript
// Before
{items.map((item) => (
  <div>{item.name}</div>
))}

// After - use unique ID
{items.map((item) => (
  <div key={item.id}>{item.name}</div>
))}
```

### TypeScript Failures

#### Issue: Type mismatch

```
error TS2322: Type 'string | undefined' is not assignable to type 'string'
```

**Fix:**

```typescript
// Option 1: Make type optional
- const name: string = getUserName();  // but getUserName() returns string | undefined
+ const name: string | undefined = getUserName();

// Option 2: Add type guard
- const displayName = getUserName().toUpperCase();  // crashes if undefined
+ const userName = getUserName();
+ const displayName = userName ? userName.toUpperCase() : "Unknown";

// Option 3: Use nullish coalescing
+ const displayName = (getUserName() ?? "Unknown").toUpperCase();
```

#### Issue: Implicit 'any' type

```
error TS7005: Variable 'data' implicitly has type 'any'
```

**Fix:**

```typescript
// Before
const data = api.fetch();  // What type is this?

// After - explicit type
interface ApiResponse {
  id: number;
  name: string;
}
const data: ApiResponse = api.fetch();

// Or infer from function
const data = await api.fetch() as ApiResponse;
```

#### Issue: Property doesn't exist

```
error TS2339: Property 'email' does not exist on type 'User'
```

**Fix:**

```typescript
// Before
interface User {
  id: number;
  name: string;
}
const user: User = { id: 1, name: "John" };
const email = user.email;  // ❌ Property doesn't exist

// After
interface User {
  id: number;
  name: string;
  email: string;  // ✅ Added
}
```

### Test Failures

#### Issue: Test assertion fails

```
Expected: "btn-primary"
Received: "btn-default"
```

**Fix:**

```typescript
// Check what the actual behavior is
// Option 1: Code is wrong (implement fix)
- className = "btn-default";
+ className = "btn-primary";

// Option 2: Test expectation is wrong (update test)
- expect(button.className).toBe("btn-primary");
+ expect(button.className).toBe("btn-default");

// Option 3: Need to pass prop
// In test:
+ render(<Button variant="primary" />);
```

#### Issue: Test timeout

```
expected: request to complete in 5000ms
received: timed out after 5000ms
```

**Fix:**

```typescript
// Option 1: Mock the API to respond faster
vi.mock('api', () => ({
  fetchData: vi.fn().mockResolvedValue({ data: 'mocked' })
}));

// Option 2: Increase timeout (if legitimate)
test('slow operation', async () => {
  // ...
}, { timeout: 10000 });

// Option 3: Add jest.useFakeTimers()
vi.useFakeTimers();
// ... test code ...
vi.runAllTimers();
```

### Secretlint Failures

#### Issue: Hardcoded API key

```
error: High entropy string detected (potential API key)
  const API_KEY = "sk_live_51234567890...";
```

**Fix:**

```javascript
// Before
const API_KEY = "sk_live_51234567890abcdefg";

// After - environment variable
const API_KEY = process.env.STRIPE_API_KEY;

// In .env.local (git-ignored)
STRIPE_API_KEY=sk_live_51234567890abcdefg
```

#### Issue: Potential password

```
error: Potential password detected
  const DB_URL = "postgres://user:password@localhost/db";
```

**Fix:**

```javascript
// Before
const DB_URL = "postgres://user:password@localhost/db";

// After
const DB_URL = process.env.DATABASE_URL;

// In .env.local
DATABASE_URL=postgres://user:password@localhost/db
```

---

## Gate Integration with IDE Workflow

### In Claude Code

```bash
# Before committing
npm run quality:gates

# If passes
git add .
git commit -m "feat: add feature"
bd sync --flush-only

# If fails
# 1. Read error message
# 2. Fix issue
# 3. Re-run gates
npm run quality:gates
```

### In Cursor

```bash
# Same process
npm run quality:gates

# Can also use Cursor's quick fix features
# For ESLint issues: usually auto-fixable
npm run lint --fix

# For TypeScript: Cursor shows inline type hints
# For Tests: Cursor can run specific test
```

### Pre-Commit Hook (Automatic)

When you try to commit without passing gates:

```bash
git commit -m "feat: add feature"

# Husky pre-commit hook runs automatically
# npm run quality:gates

# If gates fail:
husky - pre-commit hook failed (add --no-verify to bypass)
error: ESLint failed - cannot commit

# Fix the issue
npm run lint --fix

# Retry commit
git commit -m "feat: add feature"
```

### Before Push (Automatic)

When you try to push without passing gates:

```bash
git push

# Husky pre-push hook runs
# Validates branch, checks for blocked patterns

# If checks fail:
husky - pre-push hook failed
error: Branch naming policy not followed

# Fix and retry
```

---

## Understanding When Gates Are Checked

### Local Development

```
User edits code
    ↓
Pre-commit hook: npm run quality:gates
├─ if PASS → commit allowed
└─ if FAIL → commit rejected
    ↓
User fixes issue
    ↓
git commit (retry)
    ↓
Pre-commit hook again
    ↓
if PASS → commit succeeds
if FAIL → cycle repeats
```

### CI/CD (GitHub Actions)

```
Developer: git push

GitHub receives push
    ↓
Workflow triggered: quality-gates.yml
    ├─ Checkout code
    ├─ Install dependencies
    ├─ Run: npm run quality:gates
    ├─ Run: npm run test (full suite)
    ├─ Run: npm run build
    └─ Run: security scan (Snyk)
    ↓
All pass? → PR shows ✅
Any fail? → PR shows ❌ (blocks merge)
```

### Before Merge to Main

```
PR review complete
    ↓
Reviewer approves
    ↓
Merge button available
    ↓
On merge:
├─ Run full test suite
├─ Build for production
├─ Run security scans
└─ Deploy if all pass
```

---

## Bypassing Gates (Responsibly)

### When You Might Need to Bypass

⚠️ **Use extreme caution. This should be rare.**

Legitimate reasons:

- ✅ Emergency production fix (but still run gates before final push)
- ✅ Hotfix that's blocking critical issue
- ✅ Intentional debugging code (must clean up immediately)

Illegitimate reasons:

- ❌ "I'm too tired to fix linting"
- ❌ "These tests are annoying"
- ❌ "We'll fix it in the next sprint"

### How to Bypass (When Justified)

```bash
# Skip pre-commit hook ONLY
git commit --no-verify -m "hotfix: urgent fix"

# ⚠️ WARNING: This is tracked in git log
# team will see you used --no-verify
```

**Better approach:** Fix the gate failure, commit normally

```bash
npm run quality:gates

# Fix issues
npm run lint --fix

# Commit normally
git commit -m "hotfix: urgent fix"
```

### Never Use These Flags

```bash
# ❌ DON'T use HUSKY=0
HUSKY=0 npm run build

# ❌ DON'T skip tests in CI
# (CI/CD will catch you anyway)

# ❌ DON'T modify .husky files
# (It's version-controlled for team consistency)
```

---

## Team Expectations

### Gate Rules for Team

| Gate | Failure = | Action |
|------|-----------|--------|
| ESLint | Code style issue | Fix auto-fix, commit, push |
| TypeScript | Type safety issue | Fix manually, commit, push |
| Tests | Functionality broken | Debug, fix code, commit, push |
| Secretlint | Security issue | Move to env var, commit, push |

**Rule:** No code is allowed to main if gates fail. Period.

### Team Discipline

- ✅ Always run `npm run quality:gates` before pushing
- ✅ Fix any failures immediately
- ✅ Don't commit secrets (Secretlint prevents this)
- ✅ Don't merge PRs with red status
- ✅ Question teammates who bypass gates

### Code Review Integration

When reviewing code:

```
Does PR show:
├─ ✅ All gates passing?
│   └─ Code review can proceed
├─ ❌ Any gate failing?
│   ├─ Request changes
│   └─ Require dev to fix gates first
└─ ⚠️ Gates not run yet?
    └─ Ask dev to run locally first
```

---

## Troubleshooting Gate Issues

### Issue: Husky hooks not running

**Problem:** `git commit` works without gates

**Solution:**

```bash
# Reinstall Husky hooks
npm run prepare

# Verify hooks are set up
ls .husky/

# Should show: _/pre-commit, pre-push, etc.
```

### Issue: Gates pass locally but fail in CI/CD

**Problem:** Different Node version, different OS

**Solution:**

```bash
# Match CI environment
node --version
npm --version

# Check CI config
cat .github/workflows/quality-gates.yml

# Likely causes:
# 1. Different Node version
# 2. Dependency cache issue
# 3. Environment variables missing

# Fix: Run same tests CI runs
npm run quality:gates
npm run test
npm run build
```

### Issue: TypeScript errors only in CI

**Problem:** Works locally, fails in CI

**Solution:**

```bash
# Fresh install (simulates CI environment)
rm -rf node_modules
npm ci  # Use ci, not install

# Run type check
npx tsc --noEmit

# If still fails:
# - Check .env files
# - Check tsconfig.json
# - Verify all types are installed
```

### Issue: Tests fail randomly (flaky tests)

**Problem:** Test passes sometimes, fails sometimes

**Solution:**

```bash
# Run specific test multiple times
npm run test -- Button.test.tsx --repeat=10

# If fails randomly:
# Likely causes:
# 1. Async timing issues
# 2. Mock not reset between tests
# 3. Global state pollution

# Fix:
beforeEach(() => {
  vi.clearAllMocks();
  // Reset any global state
});
```

### Issue: Secretlint false positives

**Problem:** Gate fails on non-secret string

**Solution:**

```bash
# Check what Secretlint found
npm run secretlint

# Example: long entropy string that's not secret
// Ignore with comment
// secretlint-disable-next-line
const LONG_STRING = "asfasdfjasdfjasdfjasdfj";

// Or configure Secretlint to ignore in .secretlintrc
```

---

## Performance Optimization

### Gates Taking Too Long?

```bash
# Measure time
time npm run quality:gates

# Typical times:
# ESLint: 5-10 seconds
# TypeScript: 10-20 seconds
# Tests: 30-60 seconds (depends on test count)
# Total: 45-90 seconds

# To speed up:

# 1. Run tests in parallel
npm run test -- --workers=4

# 2. Run only changed files (in watch mode)
npm run test --watch

# 3. Skip expensive tests in pre-commit
# (Keep them in CI)
```

### Selective Gates

```bash
# Run only specific gates
npm run lint          # Just linting (5s)
npx tsc --noEmit      # Just type check (15s)
npm run test          # Just tests (40s)

# Use when you know what you changed
# If only styling: npm run lint
# If only types: npx tsc --noEmit
# If logic: npm run test
```

---

## Quick Reference

### Gate Commands

```bash
# All gates
npm run quality:gates

# Individual gates
npm run lint              # ESLint
npx tsc --noEmit          # TypeScript
npm run test              # Tests
npm run secretlint        # Secrets

# With options
npm run lint --fix        # Auto-fix linting
npm run test --watch      # Watch mode
npm run test -- --coverage # Coverage report
```

### Common Fixes

| Gate | Common Issue | Quick Fix |
|------|--------------|-----------|
| ESLint | Unused variable | `npm run lint --fix` |
| TypeScript | Type mismatch | Add type annotation |
| Tests | Failing assertion | Debug and fix code |
| Secretlint | Hardcoded secret | Move to .env file |

### When to Run

| When | Command | Why |
|------|---------|-----|
| Before commit | `npm run quality:gates` | Prevent broken commits |
| During development | `npm run test --watch` | Catch issues early |
| Before push | `npm run quality:gates` | Final check |
| Before PR | `npm run quality:gates` | Prevent CI failures |
| Code review | (Check PR status) | Verify all gates pass |

---

## Key Takeaway

**Quality gates protect your code automatically:**

- **ESLint**: Code style consistency
- **TypeScript**: Type safety
- **Tests**: Functionality correctness
- **Secretlint**: Security compliance

Run `npm run quality:gates` before every commit. Fix failures immediately. Push with confidence.

---

**Next:** See `Beads-Integration.md` to learn how to track your work while gates ensure quality, and `MCP-Tools-Guide.md` for automated security scanning with Snyk.
