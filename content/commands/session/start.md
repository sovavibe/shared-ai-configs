# Start Session

## Purpose

Complete session startup: load context, check work, claim task.

## Token Usage

| Context Type     | Tokens     |
| ---------------- | ---------- |
| Core (001-009)   | ~500-700   |
| Domain (010-049) | ~1000-1500 |
| **Total**        | ~1500-2200 |

## Steps

### 1. Core Context (Auto-Loaded)

Rules 001-009 load automatically every session.

### 2. Check Work

```bash
bd ready --json
```

### 3. Claim Task

```bash
bd update <id> --status=in_progress
```

### 4. Domain Context (Auto by Globs)

Context rules (010-049) auto-load by file pattern when you open files.

| Work Type | Auto-Loads When       |
| --------- | --------------------- |
| React     | Open `.tsx` files     |
| Testing   | Open `.test.ts` files |
| Styling   | Open styled files     |

### 5. Environment Setup

```bash
# Check environment
cat .env.development

# Generate API clients (if needed)
npm run codegen

# Start development server
npm run dev
```

### 6. Start Dev

```bash
npm run dev
```

## Quick Reference

### Beads Commands

```bash
bd ready --json                       # Find work
bd update <id> --status=in_progress   # Claim task
bd show <id>                          # Task details
bd close <id>                         # Complete task
bd sync                               # Sync with git
```

### Development Commands

```bash
npm run codegen          # Generate API clients
npm run dev              # Start development server
npm run test             # Run tests
npm run build            # Build project
```

## Domain Context Commands

| Work Type    | Command                      |
| ------------ | ---------------------------- |
| React        | `/load-react-context`        |
| Testing      | `/load-testing-context`      |
| Architecture | `/load-architecture-context` |

## Troubleshooting

### Context Not Loading

- Check files exist in `.cursor/rules/`
- Verify file references
- Try `@filename` format

### No Tasks Available

- Check: `bd list --status=open`
- All tasks might be blocked
- Consider creating new tasks

### Development Server Won't Start

- Check `.env.development` variables
- Run `npm run codegen` first
- Check for port conflicts (default: 5173)

## Related

- `/session/end` - Complete session
- `/session/continue` - Resume work
- `/quality/check` - Run quality gates
