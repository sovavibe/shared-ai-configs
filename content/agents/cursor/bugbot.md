---
description: 'Quick reference for code review: security, architecture, testing, code quality standards'
version: '1.0.0'
lastUpdated: '2026-01-20'
alwaysApply: false
---

# Bugbot Quick Reference

> **Stack**: Node.js 20+ | TypeScript 5.5 | React 18 | Vitest

Quick reference for code review based on project standards.

## 🔒 SECURITY

**Abstract Standard**: Code should follow security best practices and prevent vulnerabilities.

**Review Focus**:

- Input validation patterns
- Secret management approach
- Code injection prevention
- Data sanitization practices

**Assessment**: Review against security standards and best practices.

## 🏗 ARCHITECTURE

**Abstract Standard**: Code should follow project architecture patterns and maintain proper layer separation.

**Review Focus**:

- Layer separation and import rules
- Business logic organization
- Dependency management
- Component composition patterns

**Assessment**: Review against FSD architecture rules.

## 💾 DATA ACCESS

**Abstract Standard**: Data access should follow patterns for efficiency and reliability.

**Review Focus**:

- API access patterns
- Data fetching efficiency
- Error handling and retry strategies
- Caching strategies

**Assessment**: Review against data access patterns and performance standards.

## 🔄 ASYNC (Event Loop)

**Abstract Standard**: Async operations should be non-blocking and efficient.

**Review Focus**:

- Async/await patterns
- Promise handling strategies
- Event loop blocking prevention
- Concurrency management

**Assessment**: Review against async patterns and performance standards.

## 🧪 TESTING

**Abstract Standard**: Tests should follow project testing patterns and maintain quality.

**Review Focus**:

- Test structure and organization
- Test data management
- Mocking strategies
- Test coverage and quality

**Assessment**: Review against `.cursor/rules/040-testing.mdc`.

## 📝 CODE QUALITY

**Abstract Standard**: Code should follow project code quality standards and maintainability principles.

**Review Focus**:

- File and component size limits (see `.cursor/rules/004-quality.mdc` for current limits)
- Function complexity and length (see project standards)
- Nesting depth and parameter count (see project standards)
- Type safety practices (avoid `any`, use type guards)
- Code organization patterns (extract constants, use functional patterns)
- Documentation standards (JSDoc for public APIs)

**Assessment**: Review against `.cursor/rules/004-quality.mdc` and project standards.

## 🚫 COMMON ISSUES

**Abstract Standard**: Code should avoid common anti-patterns and follow best practices.

**Review Focus**:

- Performance anti-patterns (N+1 queries, blocking operations)
- Error handling patterns (retry strategies, exponential backoff)
- Separation of concerns (business logic placement)
- Code maintainability (magic numbers, constants extraction)
- Async operation patterns (non-blocking I/O)
- Code quality tooling (ESLint suppressions with proper justification)

**Assessment**: Review against project best practices and anti-patterns documentation.

## 📚 SEE ALSO

- `.cursor/rules/115-pr-review.mdc` — Detailed PR review guidelines
- `CLAUDE.md` — Main project rules
- `.cursor/rules/122-nodejs-scripts.mdc` — Scripts standards
