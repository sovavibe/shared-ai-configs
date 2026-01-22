---
description: 'Automated code review: quality gates, security check, type safety validation'
---

# Code Review

**Automated code review: quality gates, security check, type safety validation**

## Usage

```bash
@review.md [scope]
```

## Workflow

The review workflow guides agent through comprehensive code review:

### 1. Run Quality Gates

```bash
npm run lint      # ESLint validation
npm run build     # TypeScript compilation
npm run test      # Vitest tests
```

### 2. Code Quality Analysis

**Type Safety:**

- No `any` types without type guard
- No `as` assertions
- Proper TypeScript strict compliance
- Interface/type definitions

**Immutability:**

- No array mutation (use spread operators)
- No object property mutation
- Immutable state updates in React
- Pure functions

**Component Quality:**

- File size ≤ 300 lines
- Function size ≤ 30 lines
- Props count ≤ 8
- Nesting ≤ 3 levels
- No props drilling > 2 levels

**Patterns:**

- Functional components only
- No `var` keyword
- No inline `style={}`
- No `console.log`, `debugger`
- No `index` as key

### 3. Security Check

**Secrets:**

- No hardcoded secrets (API keys, tokens, passwords)
- No sensitive data in code
- Use `.env` files properly

**Error Handling:**

- Proper error boundaries
- Try-catch where needed
- User-friendly error messages
- Error logging

**Input Validation:**

- Zod validation for forms
- DOMPurify for user HTML
- XSS prevention
- CSRF protection

### 4. Report Generation

Generate report with three priority levels:

**🔴 Critical (must fix):**

- ESLint errors
- TypeScript errors
- Build failures
- Security vulnerabilities
- Type safety violations

**🟡 Important (should fix):**

- Code size violations
- Performance issues
- Missing tests
- Poor error handling

**🟢 Nice to have (optional):**

- Style improvements
- Documentation gaps
- Minor refactoring

## Examples

```bash
# Review entire codebase
@review.md

# Review specific file
@review.md src/pages/Dashboard.tsx

# Review recent changes
@review.md Review last commit

# Review specific directory
@review.md src/widgets/auth/
```

## Integration with Quality Gates

This command integrates with `.cursor/hooks/quality-check.js`:

- Hook runs automatically after agent completion
- Continues work if quality gates fail
- Agent updates `.cursor/scratchpad.md` with DONE when all gates pass

## References

- `@code-quality.mdc` — Code quality standards
- `@quality` — Critical rules overview
- `@suppressions-policy.mdc` — ESLint suppression guidelines
- `@react-patterns.mdc` — React development patterns
- `@testing.mdc` — Testing standards
