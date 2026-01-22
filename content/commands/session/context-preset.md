# Context Presets

## Purpose

Load optimized context presets for specific development scenarios.

## Available Presets

### 1. Quick Start (~600 tokens)

**Use for:** Quick questions, minimal context needed

```bash
# Auto-loaded: 001-005 (Core)
# Token budget: ~600
```

**What loads:**

- `@001-persona.mdc` - Role, stack
- `@002-tech-stack.mdc` - Technologies
- `@003-workflow.mdc` - Workflows
- `@004-quality.mdc` - Code quality
- `@005-beads.mdc` - Task management

---

### 2. React Development (~1800 tokens)

**Use for:** React components, hooks, forms

```bash
# Loads: Core + React rules
@010-react-patterns @011-tanstack-query @012-zustand @030-styling @031-ant-design
```

**What loads (in addition to Core):**

- React component patterns
- TanStack Query (useQuery, useMutation)
- Zustand state management
- Styling guidelines (styled-components, Tailwind)
- Ant Design patterns

---

### 3. Testing (~2000 tokens)

**Use for:** Writing tests, quality assurance

```bash
# Loads: Core + Testing rules
@040-testing @041-msw-patterns @042-english-only @043-existing-solutions
```

**What loads (in addition to Core):**

- Vitest patterns
- MSW mocking
- Component testing
- Test conventions

---

### 4. Architecture (~2200 tokens)

**Use for:** Architectural decisions, design, planning

```bash
# Loads: Core + Architecture + MCP
@020-architecture @021-core-principles @022-api-client @100-hindsight @101-jira
```

**What loads (in addition to Core):**

- FSD architecture
- Core principles (SOLID, immutability)
- API client patterns
- Hindsight MCP
- Jira integration

---

### 5. Debug (~1500 tokens)

**Use for:** Debugging, bug fixes, investigation

```bash
# Loads: Core + React + Testing
@010-react-patterns @040-testing
```

**What loads (in addition to Core):**

- React patterns (for understanding code)
- Testing patterns (for verification)

---

## Comparison Table

| Preset       | Tokens | Best For                         |
| ------------ | ------ | -------------------------------- |
| Quick Start  | ~600   | Quick questions, minimal context |
| React Dev    | ~1800  | React components, forms, hooks   |
| Testing      | ~2000  | Writing tests, QA                |
| Architecture | ~2200  | Design, architectural decisions  |
| Debug        | ~1500  | Bug fixes, investigation         |

## Usage Patterns

### Daily Workflow

```
Morning:
  → bd ready (check work)
  → Claim task

During work:
  → Open files → rules auto-load by globs
  → Or manually: @010-react-patterns

End of day:
  → /session/end
```

### Feature Development

```
1. /session/start
2. Open .tsx files → React rules auto-load
3. Implement feature
4. Open .test.ts → Testing rules auto-load
5. Write tests
6. /quality/check
7. /session/end
```

### Bug Investigation

```
1. Open related files → rules auto-load
2. Use @100-hindsight for patterns
3. Fix bug
4. Write regression test
5. /quality/check
```

## Auto-Loading by Globs

Most context loads automatically when you open files:

| File Pattern  | Rules Loaded            |
| ------------- | ----------------------- |
| `*.tsx`       | React patterns, styling |
| `*.test.ts`   | Testing patterns        |
| `*.styled.ts` | Styling rules           |
| `api/*.ts`    | API client patterns     |

## Manual Loading

When auto-load isn't enough, use `@mention`:

```
@010-react-patterns    # Explicit React context
@100-hindsight         # MCP patterns
@101-jira              # Jira integration
```

## Related

- `/session/start` - Full session startup
- `/session/end` - Complete session
- `rules/INDEX.mdc` - All rules reference
