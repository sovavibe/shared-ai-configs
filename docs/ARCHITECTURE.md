# Shared AI Configs — Architecture

> **Version:** 2.0.0
> **Last Updated:** 2026-01-21

## Vision

**Universal AI-assisted development configuration** that works across multiple IDEs and AI agents:

- Claude Code (Anthropic)
- Cursor (VS Code fork)
- Kilo (future)
- Any MCP-compatible agent (future)

## Core Philosophy

### 1. Single Source of Truth (DRY)

```
Write once → Generate everywhere
```

One MDC rule file generates identical rules for all supported IDEs:

```
content/rules/react.mdc
    ├──► .claude/rules/react.mdc
    ├──► .cursor/rules/react.mdc
    └──► .kilo/rules/react.mdc (future)
```

### 2. Configuration-Driven Generation

Every project aspect is configurable via `.ai-project.yaml`:

```yaml
# Project-specific commands
commands:
  dev: "pnpm dev"           # Used in CLAUDE.md
  build: "pnpm build"
  lint: "pnpm lint"
  test: "pnpm vitest"
  codegen: "pnpm codegen"
  quality_gates: "pnpm quality:gates"  # Used in hooks

# Project-specific services
services:
  vcs:
    type: gitlab            # Determines which VCS rules to include
  task_tracking:
    type: beads             # Determines which tracking rules to include
  mcp:
    hindsight:
      enabled: true         # Include hindsight rules
    snyk:
      enabled: true         # Include security rules
```

### 3. Conditional Content

Templates include/exclude sections based on config:

```ejs
<% if (services?.task_tracking?.type === 'beads') { %>
## Beads Task Tracking
```bash
bd ready           # Find work
bd close <id>      # Complete task
```

<% } %>

```

### 4. IDE-Specific Adaptations

While rules share the same content, some features are IDE-specific:

| Feature | Claude Code | Cursor |
|---------|-------------|--------|
| Hooks format | Bash (`.sh`) | JavaScript (`.js`) |
| Main file | `CLAUDE.md` | `.cursorrules` |
| Settings | `settings.json` | `hooks.json` |
| Skills | N/A | `skills/SKILL.md` |
| Agents | N/A | `agents/*.md` |
| Notepads | N/A | `notepads/*.md` |

### 5. Git Tracking Strategy

**Principle:** Generated files are ignored, config sources are tracked.

| File/Directory | Git Status | Reason |
|----------------|------------|--------|
| `.ai-project.yaml` | **Tracked** | Config source, shared with team |
| `.beads/issues.jsonl` | **Tracked** | Task database, collaborative |
| `.claude/` | Ignored | Generated |
| `.cursor/` | Ignored | Generated |
| `CLAUDE.md` | Ignored | Generated |
| `.perles/` | Ignored | Generated |
| `.beads/*.db` | Ignored | Local SQLite cache |

The generator automatically updates `.gitignore` with appropriate entries.

## System Architecture

```

┌─────────────────────────────────────────────────────────────────┐
│                    .ai-project.yaml                              │
│                    (Project Config)                              │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   shared-ai-configs                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   content/                                │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────┐  │   │
│  │  │ rules/  │  │commands/│  │ hooks/  │  │cursor-only/ │  │   │
│  │  │  (MDC)  │  │  (MD)   │  │(sh/js)  │  │(skills,etc) │  │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  templates/                               │   │
│  │  ┌────────────────┐  ┌────────────────┐                  │   │
│  │  │  CLAUDE.md.ejs │  │ cursorrules.ejs │                  │   │
│  │  │  settings.json │  │  hooks.json    │                  │   │
│  │  └────────────────┘  └────────────────┘                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                 CLI (generate.ts)                         │   │
│  │                                                           │   │
│  │  1. Load config (.ai-project.yaml)                       │   │
│  │  2. Validate against schema                               │   │
│  │  3. Select rules/content based on config                  │   │
│  │  4. Render templates with EJS                             │   │
│  │  5. Generate files for each target                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
┌─────────────────┐ ┌─────────────┐ ┌─────────────┐
│  .claude/       │ │  .cursor/   │ │  .kilo/     │
│  ├── rules/     │ │  ├── rules/ │ │  (future)   │
│  ├── hooks/     │ │  ├── hooks/ │ │             │
│  ├── docs/      │ │  ├── skills/│ │             │
│  └── settings   │ │  └── agents/│ │             │
│                 │ │             │ │             │
│  CLAUDE.md      │ │.cursorrules │ │             │
└─────────────────┘ └─────────────┘ └─────────────┘

```

## Directory Structure

```

shared-ai-configs/
├── bin/
│   └── cli.js                    # CLI entry point
│
├── src/cli/
│   ├── commands/
│   │   ├── generate.ts           # Main generation logic
│   │   ├── init.ts               # Initialize .ai-project.yaml
│   │   ├── validate.ts           # Validate config
│   │   ├── status.ts             # Show generation status
│   │   └── doctor.ts             # Check dependencies
│   ├── utils/
│   │   ├── config.ts             # Config loading + defaults
│   │   ├── template.ts           # EJS rendering
│   │   └── logger.ts             # Colored output
│   └── types.ts                  # TypeScript types
│
├── schema/
│   └── ai-project.schema.json    # JSON Schema for validation
│
├── core/                         # Universal rules (semantic names)
│   ├── persona.mdc               # Role, constraints
│   ├── quality.mdc               # Quality gates
│   ├── core-principles.mdc       # Core principles
│   ├── mcp/                      # MCP tool rules
│   │   ├── hindsight.mdc
│   │   ├── tool-selection.mdc
│   │   └── ...
│   ├── workflow/                 # Workflow rules
│   │   ├── git-workflow.mdc
│   │   ├── task-management.mdc
│   │   └── ...
│   ├── security/                 # Security & performance
│   │   ├── security.mdc
│   │   ├── performance.mdc
│   │   └── ...
│   └── advanced/                 # 2026 patterns
│       ├── sdd-patterns.mdc
│       └── ...
│
├── stacks/                       # Stack-specific rules
│   ├── react/
│   │   ├── tech-stack.mdc
│   │   ├── architecture.mdc
│   │   └── ...
│   └── node/
│       ├── functional-patterns.mdc
│       └── ...
│
├── content/
│   ├── agents/                   # Agent-specific content
│   │   ├── claude/               # Claude-specific patterns
│   │   └── cursor/               # Cursor-specific patterns
│   │       ├── bugbot.md
│   │       └── cursor-2.2-patterns.mdc
│   ├── commands/                 # Slash commands (MD)
│   │   ├── core/                 # debug, implement, etc.
│   │   └── gitlab/               # gitlab-* commands
│   ├── skills/                   # Skill definitions
│   └── notepads/                 # Reference materials
│
├── hooks/                        # IDE hooks
│   ├── claude/                   # Bash hooks for Claude Code
│   │   ├── session-start.sh
│   │   ├── pre-commit.sh
│   │   └── ...
│   └── cursor/                   # JS hooks for Cursor
│       ├── accept-check.js
│       └── ...
│
├── integrations/                 # Third-party integrations
│   ├── beads/
│   │   └── beads.mdc
│   ├── gitlab/
│   │   └── gitlab-mr.mdc
│   └── github/
│       └── github-pr.mdc
│
├── templates/
│   ├── CLAUDE.md.ejs             # Main Claude instructions
│   ├── claude/
│   │   ├── settings.json.ejs
│   │   └── docs/                 # Documentation templates
│   ├── cursor/
│   └── mcp/
│       └── mcp.json.ejs          # Shared MCP template
│
└── docs/
    ├── ARCHITECTURE.md           # This file
    ├── PRINCIPLES.md             # Core principles
    └── MULTI-TARGET-ARCHITECTURE.md

```

## Generation Process

### 1. Config Loading

```typescript
// src/cli/utils/config.ts
const config = loadConfig('.ai-project.yaml');
// Validates against schema
// Applies CONFIG_DEFAULTS for missing values
```

### 2. Rule Selection

```typescript
// src/cli/commands/generate.ts
function getRulesToInclude(config: Config): RuleSpec[] {
  const rules: RuleSpec[] = [];

  // Always include core rules
  rules.push(...CORE_RULES);

  // Stack-specific rules
  if (config.stack?.type) {
    rules.push(...getStackRules(config.stack.type));
  }

  // MCP rules based on enabled services
  if (config.services?.mcp?.hindsight?.enabled) {
    rules.push({ source: 'core/mcp/hindsight.mdc', target: 'hindsight.mdc' });
  }

  // VCS rules
  if (config.services?.vcs?.type === 'gitlab') {
    rules.push({ source: 'integrations/gitlab/gitlab-mr.mdc', target: 'gitlab-mr.mdc' });
  }

  return rules;
}
```

### 3. Multi-Target Generation

```typescript
// For each enabled target
for (const [targetName, targetConfig] of Object.entries(config.generation?.targets || {})) {
  if (!targetConfig.enabled) continue;

  // Generate rules
  generateRulesForTarget(rules, targetConfig.output_dir);

  // Generate hooks (target-specific source)
  generateHooksForTarget(targetName, targetConfig.output_dir);

  // Generate templates
  generateTemplatesForTarget(targetName, config, targetConfig.output_dir);
}
```

### 4. Template Rendering

```typescript
// src/cli/utils/template.ts
function renderTemplate(templatePath: string, config: Config): string {
  const template = fs.readFileSync(templatePath, 'utf-8');

  return ejs.render(template, {
    // Spread config for easy access
    ...config,
    project: config.project,
    stack: config.stack,
    services: config.services,
    commands: config.commands,

    // Helper functions
    hasService: (name: string) => config.services?.mcp?.[name]?.enabled,
    isVcs: (type: string) => config.services?.vcs?.type === type,
  });
}
```

## Hook Integration

### Project Commands in Hooks

Hooks can reference project-specific commands from config:

```bash
# content/hooks/claude/validate-bash.sh
#!/bin/bash
# Runs project's quality gates (from .ai-project.yaml commands.quality_gates)
<%= commands?.quality_gates || 'npm run quality:gates' %>
```

### Hook Events

**Claude Code:**

- `UserPromptSubmit` — Before prompt processing
- `Stop` — After response complete
- `PreToolUse` — Before tool execution
- `PostToolUse` — After tool execution

**Cursor:**

- `init` — Session start
- `accept` — File accept action
- `stop` — Chat stop/end

## Configuration Schema

See `schema/ai-project.schema.json` for full schema.

Key sections:

```yaml
# .ai-project.yaml
project:
  name: string
  path: string (auto-detected)
  language: string (Russian/English)

stack:
  type: react | node | python | nextjs
  framework:
    name: string
    version: string

services:
  ide:
    paths:
      claude: string (.claude/)
      cursor: string (.cursor/)
    dual_mode: boolean

  vcs:
    type: gitlab | github

  task_tracking:
    type: beads | jira | none
    key_prefix: string (VP-)

  mcp:
    hindsight: { enabled: boolean }
    snyk: { enabled: boolean }
    context7: { enabled: boolean }
    pal: { enabled: boolean }

commands:
  dev: string
  build: string
  lint: string
  test: string
  codegen: string
  quality_gates: string

generation:
  strategy: generate | symlink | copy
  targets:
    claude:
      enabled: boolean
      output_dir: string
      features: string[]
    cursor:
      enabled: boolean
      output_dir: string
      features: string[]

rules:
  critical: string[]  # Always include
  custom: string[]    # Project-specific additions
```

## Benefits

1. **Consistency** — Same rules, same patterns across all IDEs
2. **Maintainability** — Update one file, regenerate all
3. **Flexibility** — Per-project customization via config
4. **Extensibility** — Add new IDE support without changing content
5. **Token Optimization** — Generate only what's needed
6. **Type Safety** — JSON Schema validation + TypeScript

## Usage

```bash
# Initialize new project
npx shared-ai-configs init

# Generate configs
npx shared-ai-configs generate

# Validate config
npx shared-ai-configs validate

# Check dependencies
npx shared-ai-configs doctor

# Show status
npx shared-ai-configs status
```
