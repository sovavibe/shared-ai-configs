# shared-ai-configs

NPM package for generating AI-assisted development configurations for Claude Code and Cursor IDE.

## Features

- **Config-driven generation** — Single `.ai-project.yaml` defines all outputs
- **Multi-target** — Claude Code (CLAUDE.md, .claude/), Cursor (.cursor/rules/)
- **40+ rules** — Quality, workflow, MCP, security, stack-specific patterns
- **EJS templates** — 60+ placeholders for full customization
- **JSON Schema validation** — Catches config errors before generation

## Installation

```bash
# Global install
npm install -g shared-ai-configs

# Or use npx
npx shared-ai-configs <command>
```

## Quick Start

```bash
# 1. Initialize project with .ai-project.yaml
npx shared-ai-configs init

# 2. Edit .ai-project.yaml with your settings

# 3. Generate configurations
npx shared-ai-configs generate

# 4. Verify everything is correct
npx shared-ai-configs status
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `init` | Create `.ai-project.yaml` template |
| `generate` | Generate all configurations |
| `validate` | Validate `.ai-project.yaml` against schema |
| `status` | Show current configuration status |
| `doctor` | Diagnose issues (missing files, outdated configs) |

### Options

```bash
# Generate with force overwrite
npx shared-ai-configs generate --force

# Validate specific config file
npx shared-ai-configs validate ./custom-config.yaml

# Check health
npx shared-ai-configs doctor
```

## Configuration

`.ai-project.yaml` is the single source of truth:

```yaml
project:
  name: "My Project"
  description: "Customer portal application"

stack:
  type: "react"              # react | node | java | python
  framework: "React 18"
  state: "Zustand 5"
  ui: "Ant Design 5"
  api:
    client: "TanStack Query 5"
    codegen: "Orval 7"
  testing: "Vitest"
  linter: "ESLint"

services:
  vcs:
    type: "git"              # git | none
    main_branch: "main"
  task_tracking:
    type: "beads"            # beads | jira | linear | github-issues | none
    key_prefix: "VP-"
  mcp:
    hindsight:
      enabled: true
    snyk:
      enabled: true
    context7:
      enabled: true

commands:
  dev: "npm run dev"
  build: "npm run build"
  lint: "npm run lint"
  test: "npm run test"
  codegen: "npm run codegen"
  quality_gates: "npm run quality:gates"

options:
  dev_server_port: 5173
  orchestration: true
  agentic_workflows: true

languages:
  chat: "Russian"
  code: "English"

rules:
  critical:
    - "NEVER edit src/shared/api/generated/"
    - "ALWAYS run quality gates before committing"

generation:
  targets:
    claude: true
    cursor: true
```

## Generated Output

```
your-project/
├── .ai-project.yaml         # Your config (tracked in git)
├── CLAUDE.md                # Entry point for Claude Code
├── .claude/
│   ├── docs/                # Generated documentation
│   │   ├── MCP-GUIDE.md
│   │   ├── SESSION-PROTOCOL.md
│   │   ├── SDLC-WORKFLOW.md
│   │   └── ...
│   └── settings.json        # Claude Code settings
└── .cursor/
    └── rules/               # 40+ .mdc rules
        ├── 001-persona.mdc
        ├── 002-tech-stack.mdc
        ├── 005-beads.mdc
        └── ...
```

## Architecture

```
shared-ai-configs/
├── src/
│   └── cli/
│       ├── commands/        # CLI commands
│       │   ├── init.ts
│       │   ├── generate.ts
│       │   ├── validate.ts
│       │   ├── status.ts
│       │   └── doctor.ts
│       ├── utils/
│       │   └── template.ts  # EJS context builder
│       └── types.ts         # TypeScript types
├── templates/
│   ├── CLAUDE.md.ejs        # Main template (60+ placeholders)
│   ├── claude/
│   │   ├── docs/*.ejs       # Documentation templates
│   │   └── settings.json.ejs
│   └── ...
├── content/
│   ├── core/                # Universal rules (25 files)
│   ├── stacks/              # Stack-specific rules
│   │   ├── react/
│   │   ├── node/
│   │   └── ...
│   └── integrations/        # Tool integrations
│       ├── beads/
│       ├── gitlab/
│       └── ...
└── schema/
    └── ai-project.schema.json
```

## Task Tracking Integration

Auto-generates commands based on `services.task_tracking.type`:

| Type | Commands |
|------|----------|
| `beads` | `bd create`, `bd close`, `bd ready`, `bd sync` |
| `jira` | `jira create`, `jira close`, `jira list` |
| `linear` | `linear issue create`, `linear issue close` |
| `github-issues` | `gh issue create`, `gh issue close` |

## MCP Integration

Enable MCP tools in config:

```yaml
services:
  mcp:
    hindsight:
      enabled: true    # Memory & recall
    snyk:
      enabled: true    # Security scanning
    context7:
      enabled: true    # Library docs
    pal:
      enabled: true    # External models
    memory_bank:
      enabled: true    # Allpepper memory
    figma:
      enabled: true    # Design to code
    browser:
      enabled: true    # Chrome automation
```

## Extending

### Add Custom Rules

1. Create `.mdc` file in `content/core/` or `content/stacks/<stack>/`
2. Use frontmatter for metadata:

```markdown
---
description: 'My custom rule'
version: '1.0.0'
alwaysApply: true
---

# My Rule

Content here...
```

### Add New Stack

1. Create `content/stacks/<stack-name>/` directory
2. Add stack-specific `.mdc` rules
3. Update `src/cli/commands/generate.ts` if special handling needed

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run watch

# Test
npm run test

# Lint
npm run lint
```

## Related

- [Claude Code](https://claude.ai/claude-code) — Anthropic's CLI
- [Cursor](https://cursor.sh) — AI-powered IDE
- [Beads](https://github.com/your-org/beads) — Local task tracking

## License

MIT
