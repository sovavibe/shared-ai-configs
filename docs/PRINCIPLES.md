# Shared AI Configs — Core Principles

> **Philosophy:** These principles form the foundation of the entire system. Every decision must align with them.

## 1. DRY — Don't Repeat Yourself

### Principle

Each unit of knowledge has a **single, unambiguous, authoritative representation** in the system.

### Application

```
❌ BAD:
.claude/rules/react.mdc   (copy)
.cursor/rules/react.mdc   (copy)
.kilo/rules/react.mdc     (copy)

✅ GOOD:
content/rules/react.mdc   (source)
    ├──► .claude/rules/react.mdc  (generated)
    ├──► .cursor/rules/react.mdc  (generated)
    └──► .kilo/rules/react.mdc    (generated)
```

### Rules

1. **Rules** — one MDC file → all IDEs
2. **Commands** — one MD file → all IDEs
3. **Documentation** — one EJS template → different output files
4. **Configuration** — one `.ai-project.yaml` → all settings

---

## 2. Configuration over Convention

### Principle

Everything is configurable through config. **No magic strings** in code.

### Application

```yaml
# .ai-project.yaml — single source of truth

commands:
  dev: "pnpm dev"           # NOT hardcoded "npm run dev"
  lint: "pnpm lint"         # NOT hardcoded "npm run lint"
  quality_gates: "pnpm quality:gates"

services:
  task_tracking:
    type: beads             # NOT hardcoded in code
```

---

## 3. Abstraction Over Specifics

### What to Include

- Technology patterns and best practices
- Architecture guidelines
- Code examples demonstrating patterns

### What to Exclude

- Business logic (domain-terms.md → project docs)
- Version numbers (React 18.3 → React)
- Specific lint rules (handled by `npm run lint`)

```
✅ "Use React hooks for state management"
❌ "Use React 18.3.1 with specific ESLint rules"
```

---

## 4. Version Independence

Rules should work across minor versions. Version constraints belong in `package.json`:

```
✅ Rule: "Use TanStack Query for server state"
❌ Rule: "Use @tanstack/react-query@5.17.0"
```

---

## 5. Agent-Specific Content

Different AI agents have different capabilities and formats:

```
content/
├── agents/
│   ├── claude/      # Claude-specific patterns
│   └── cursor/      # Cursor-specific patterns
```

Duplication between Claude and Cursor is acceptable when necessary for clarity.

---

## 6. Semantic Naming

Rules use descriptive names without numeric prefixes:

```
✅ persona.mdc
✅ quality.mdc
✅ git-workflow.mdc

❌ 001-persona.mdc
❌ 004-quality.mdc
❌ 114-git-workflow.mdc
```

---

## 7. English Only

All content in English for international open-source use:

- Code and comments
- Documentation
- Commit messages
- Issue descriptions

---

## Directory Structure

```
shared-ai-configs/
├── content/
│   ├── agents/          # Agent-specific content
│   │   ├── claude/
│   │   └── cursor/
│   ├── commands/        # Slash command definitions
│   ├── notepads/        # Reference materials
│   └── skills/          # Skill definitions
├── core/                # Universal rules
│   ├── mcp/             # MCP integration
│   ├── workflow/        # Workflow patterns
│   ├── security/        # Security rules
│   └── advanced/        # 2026 patterns
├── stacks/              # Stack-specific rules
│   ├── react/
│   └── node/
├── hooks/               # IDE hooks
│   ├── claude/          # Bash hooks
│   └── cursor/          # JS hooks
├── templates/           # Generation templates
│   ├── claude/
│   ├── cursor/
│   └── mcp/
└── integrations/        # Third-party integrations
    ├── beads/
    ├── gitlab/
    └── github/
```

---

## Quality Gates

All contributions must pass:

```bash
npm run quality   # Lint + format + markdown check
npm run build     # TypeScript compilation
npm test          # Unit tests
```

---

## Contributing

1. Follow semantic naming (no numeric prefixes)
2. Write in English
3. Keep rules abstract (no version numbers)
4. Test generation before committing
5. Update INDEX.mdc when adding rules
