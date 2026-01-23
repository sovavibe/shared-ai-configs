# Shared AI Configs - Features & Capabilities

> **Version:** 1.0.0
> **Last Updated:** 2026-01-22

A comprehensive configuration generator for AI-assisted development across multiple IDEs.

---

## Generation Features

### Multi-Target Generation

Generate configurations for multiple AI assistants from a single `.ai-project.yaml`:

| Target          | Status  | Output                                  | Description               |
| --------------- | ------- | --------------------------------------- | ------------------------- |
| **Claude Code** | Stable  | `.claude/`, `CLAUDE.md`                 | Anthropic's CLI assistant |
| **Cursor**      | Stable  | `.cursor/`, `.cursorrules`, `AGENTS.md` | AI-powered IDE            |
| **Kilo**        | Planned | `.kilo/`                                | Future agent support      |

```yaml
generation:
  targets:
    claude:
      enabled: true
      output_dir: '.claude'
      features: ['rules', 'hooks', 'commands', 'docs', 'settings', 'main']
    cursor:
      enabled: true
      output_dir: '.cursor'
      features: ['rules', 'hooks', 'skills', 'agents', 'notepads', 'mcp', 'cursorrules']
    kilo:
      enabled: false # Future
```

### EJS Templating with Config Interpolation

All output generated from EJS templates with full config access:

| Template             | Output                                 | Interpolation Examples                     |
| -------------------- | -------------------------------------- | ------------------------------------------ |
| `CLAUDE.md.ejs`      | `CLAUDE.md`                            | `project.name`, `stack.type`, `commands.*` |
| `settings.json.ejs`  | `.claude/settings.json`                | `services.mcp.*`, `options.*`              |
| `mcp.json.ejs`       | `.claude/mcp.json`, `.cursor/mcp.json` | `services.mcp.*` with server configs       |
| `.env.aiproject.ejs` | `.env.aiproject`                       | API keys, tokens, integration secrets      |

```ejs
<% if (services?.task_tracking?.type === 'beads') { %>
## Task Tracking
bd ready   # Find available work
<% } %>
```

### CLI Flags

| Flag                  | Description                                          |
| --------------------- | ---------------------------------------------------- |
| `--force`             | Overwrite existing files (normally skipped)          |
| `--clean`             | Remove all generated directories before regenerating |
| `--dry-run`           | Preview what would be generated without writing      |
| `-c, --config <path>` | Custom config path (default: `.ai-project.yaml`)     |
| `-o, --output <dir>`  | Output directory (default: `.`)                      |

```bash
# Full regeneration
npx shared-ai-configs generate --clean --force

# Preview changes
npx shared-ai-configs generate --dry-run

# Custom config location
npx shared-ai-configs generate -c ./config/ai.yaml
```

### Generation Strategies

| Strategy   | Description               | Use Case              |
| ---------- | ------------------------- | --------------------- |
| `generate` | Copy files to target      | Production (default)  |
| `symlink`  | Create symlinks to source | Development/debugging |
| `copy`     | Direct file copy          | Same as generate      |

```yaml
generation:
  strategy: 'generate' # generate | symlink | copy
```

---

## Configuration Features

### Single Source of Truth

`.ai-project.yaml` centralizes all AI assistant configuration:

| Section      | Purpose               | Example Fields                                      |
| ------------ | --------------------- | --------------------------------------------------- |
| `project`    | Project metadata      | `name`, `short_name`, `description`, `role`         |
| `stack`      | Tech stack definition | `type`, `framework`, `language`, `build`, `ui`      |
| `services`   | External integrations | `ide`, `vcs`, `task_tracking`, `mcp`                |
| `commands`   | CLI commands          | `dev`, `build`, `test`, `lint`, `quality_gates`     |
| `options`    | AI behavior settings  | `orchestration`, `sdd_enabled`, `agentic_workflows` |
| `rules`      | Project constraints   | `never[]`, `always[]`, `custom[]`                   |
| `generation` | Output configuration  | `targets`, `strategy`, `gitignore_entries`          |

### Stack-Specific Rules

Automatic rule loading based on stack type:

| Stack                | Auto-Loaded Rules                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------- |
| `react`              | `tech-stack.mdc`, `architecture.mdc`, `styling.mdc`, `tanstack-query.mdc`, `zustand.mdc` |
| `react` + Ant Design | + `ant-design.mdc`                                                                       |
| `node`               | `functional-patterns.mdc`, `nodejs-scripts.mdc`                                          |
| `python`             | (planned)                                                                                |
| `java`               | (planned)                                                                                |

```yaml
stack:
  type: 'react'
  ui:
    library: 'Ant Design' # Triggers ant-design.mdc
```

### Custom Rules

| Rule Type        | Behavior                  | Example                             |
| ---------------- | ------------------------- | ----------------------------------- |
| `rules.never[]`  | FORBIDDEN actions         | `"Edit generated files"`            |
| `rules.always[]` | MANDATORY actions         | `"Run quality gates before commit"` |
| `rules.custom[]` | Guidelines (non-critical) | `"Prefer existing components"`      |

```yaml
rules:
  never:
    - 'Edit src/shared/api/generated/ - use npm run codegen'
    - 'Hardcode secrets - use environment variables'
  always:
    - 'Run npm run quality:gates before committing'
    - 'Use Beads for task tracking'
  custom:
    - 'Prefer composition over inheritance'
```

### Language Configuration

| Field            | Purpose                   | Values               |
| ---------------- | ------------------------- | -------------------- |
| `languages.chat` | AI communication language | `Russian`, `English` |
| `languages.code` | Code comments language    | `English` (always)   |

```yaml
languages:
  chat: 'Russian' # Plans, analysis, reports
  code: 'English' # Code comments (ESLint enforced)
```

---

## MCP Integration

### Supported Servers

| Server        | Type       | Purpose                        | API Key Env        |
| ------------- | ---------- | ------------------------------ | ------------------ |
| `hindsight`   | HTTP       | Long-term memory               | - (local)          |
| `snyk`        | stdio      | Security scanning              | `SNYK_TOKEN`       |
| `context7`    | stdio      | Library docs                   | `CONTEXT7_API_KEY` |
| `memory_bank` | stdio      | Project memory                 | -                  |
| `figma`       | HTTP       | Design-to-code                 | `FIGMA_API_KEY`    |
| `browser`     | stdio/HTTP | Browser automation, web search | `Z_AI_API_KEY`     |

### Auto-Generated mcp.json

Both IDEs receive identical MCP configuration:

```yaml
services:
  mcp:
    hindsight:
      enabled: true
    snyk:
      enabled: true
```

**Generated output:**

```json
{
  "mcpServers": {
    "hindsight-alice": {
      "url": "http://localhost:8888/mcp/alice/"
    },
    "Snyk": {
      "command": "npx",
      "args": ["-y", "snyk@latest", "mcp", "-t", "stdio"]
    }
  }
}
```

### Browser MCP Bundle

Enabling `browser` activates multiple z.ai services:

| Service            | Type  | Purpose                       |
| ------------------ | ----- | ----------------------------- |
| `zai-mcp-server`   | stdio | Image analysis, UI conversion |
| `web-search-prime` | HTTP  | Web search                    |
| `web-reader`       | HTTP  | URL content fetching          |
| `zread`            | HTTP  | GitHub repo search/read       |

### API Key Template Generation

`.env.aiproject` generated with placeholders for all enabled services:

```bash
# Generated for enabled MCP servers
SNYK_TOKEN=
FIGMA_API_KEY=
Z_AI_API_KEY=

# Task tracking
BD_ENABLED=1

# VCS
GITLAB_TOKEN=glpat-xxxxxxxxxxxx
```

---

## Content System

### Core Rules (`core/`)

Universal rules loaded for all projects:

| File                     | Purpose                |
| ------------------------ | ---------------------- |
| `persona.mdc`            | AI persona definition  |
| `quality.mdc`            | Quality standards      |
| `core-principles.mdc`    | Development principles |
| `existing-solutions.mdc` | Reuse patterns         |
| `INDEX.mdc`              | Rules index            |

**Subdirectories:**

| Directory        | Content                                      |
| ---------------- | -------------------------------------------- |
| `core/mcp/`      | MCP usage patterns, troubleshooting          |
| `core/workflow/` | Git, task management, documentation          |
| `core/security/` | Security practices, error recovery           |
| `core/advanced/` | SDD, token optimization, verification swarms |
| `core/commands/` | analyze, architect, plan, review             |

### Stack Rules (`stacks/`)

Stack-specific patterns:

| Stack    | Files                                                                                                                               |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `react/` | `tech-stack.mdc`, `architecture.mdc`, `styling.mdc`, `ant-design.mdc`, `tanstack-query.mdc`, `zustand.mdc`, `react-performance.mdc` |
| `node/`  | `functional-patterns.mdc`, `nodejs-scripts.mdc`                                                                                     |

### Content Directories

| Directory           | Purpose            | IDE Target |
| ------------------- | ------------------ | ---------- |
| `content/skills/`   | Cursor skills      | Cursor     |
| `content/agents/`   | Agent definitions  | Both       |
| `content/notepads/` | Reference examples | Cursor     |
| `content/commands/` | Slash commands     | Both       |

**Commands structure:**

```
content/commands/
├── core/          # debug, diagram, explain, implement, investigate, review, test
├── gitlab/        # gitlab-* commands
├── session/       # continue, create-tasks, dev, end, start
└── quality/       # metrics
```

### Integrations (`integrations/`)

| Integration | File                   | Trigger                     |
| ----------- | ---------------------- | --------------------------- |
| Beads       | `beads/beads.mdc`      | `task_tracking.type: beads` |
| GitHub      | `github/github-pr.mdc` | `vcs.type: github`          |
| GitLab      | `gitlab/gitlab-mr.mdc` | `vcs.type: gitlab`          |
| Jira        | `jira/sync-jira.md`    | `task_tracking.type: jira`  |

### Hooks (`hooks/`)

| Hook                               | IDE    | Purpose                          |
| ---------------------------------- | ------ | -------------------------------- |
| `claude/session-start.sh`          | Claude | Context loading at session start |
| `claude/pre-commit.sh`             | Claude | Quality gates before commit      |
| `claude/validate-bash.sh`          | Claude | Command validation               |
| `claude/workflow-stop.sh`          | Claude | Session cleanup                  |
| `claude/beads-completion-check.sh` | Claude | Task completion verification     |
| `cursor/session-init.js`           | Cursor | Session initialization           |
| `cursor/accept-check.js`           | Cursor | File accept validation           |
| `cursor/quality-check.js`          | Cursor | Quality verification             |

---

## CLI Commands

| Command    | Description                              | Options                                       |
| ---------- | ---------------------------------------- | --------------------------------------------- |
| `init`     | Create `.ai-project.yaml`                | `--force`, `--stack <type>`                   |
| `generate` | Generate all configs                     | `--force`, `--clean`, `--dry-run`, `-c`, `-o` |
| `validate` | Validate config against schema           | `-c`                                          |
| `status`   | Show current config status               | `-c`                                          |
| `doctor`   | Health check and dependency verification | -                                             |

### init

```bash
npx shared-ai-configs init --stack react
```

Creates `.ai-project.yaml` with sensible defaults for the specified stack.

### generate

```bash
npx shared-ai-configs generate --clean --force
```

Generates all configurations based on `.ai-project.yaml`.

### validate

```bash
npx shared-ai-configs validate
```

Validates against `schema/ai-project.schema.json`. Shows:

- Project name and stack
- Chat/code languages
- VCS type
- Task tracking type
- Generation strategy

### status

```bash
npx shared-ai-configs status
```

Shows:

- Project configuration summary
- Services status (IDE, VCS, task tracking)
- MCP tools status (enabled/disabled)
- Generated files status (exists/missing)
- Recommendations for missing components

### doctor

```bash
npx shared-ai-configs doctor
```

Checks:

| Check                 | Severity | Fix Suggestion                     |
| --------------------- | -------- | ---------------------------------- |
| Node.js version       | error    | Requires 18+                       |
| npm availability      | error    | Install npm                        |
| Config file exists    | warn     | Run `init`                         |
| Claude Code installed | warn     | `npm i -g @anthropics/claude-code` |
| Cursor directory      | warn     | `mkdir -p .cursor`                 |
| gh/glab CLI           | warn     | Platform-specific install          |
| bd (Beads)            | warn     | `npm i -g @anthropic/beads`        |
| MCP env vars          | warn     | Set required tokens                |

---

## Templates Reference

| Template                   | Output                                 | Variables Used                                     |
| -------------------------- | -------------------------------------- | -------------------------------------------------- |
| `CLAUDE.md.ejs`            | `CLAUDE.md`                            | All config sections                                |
| `AGENTS.md.ejs`            | `AGENTS.md`                            | project, stack, services                           |
| `.env.aiproject.ejs`       | `.env.aiproject`                       | services.mcp, services.vcs, services.task_tracking |
| `claude/settings.json.ejs` | `.claude/settings.json`                | services.mcp, options                              |
| `claude/docs/*.ejs`        | `.claude/docs/*`                       | project, commands, services                        |
| `mcp/mcp.json.ejs`         | `.claude/mcp.json`, `.cursor/mcp.json` | services.mcp                                       |
| `perles/config.yaml.ejs`   | `.perles/config.yaml`                  | project, services.task_tracking                    |

---

## Schema Validation

Full JSON Schema at `schema/ai-project.schema.json`:

| Required Fields  | Type                                              |
| ---------------- | ------------------------------------------------- |
| `project.name`   | string                                            |
| `stack.type`     | enum: `react`, `node`, `java`, `python`, `nextjs` |
| `commands.dev`   | string                                            |
| `commands.build` | string                                            |

| Validated Enums               | Values                                             |
| ----------------------------- | -------------------------------------------------- |
| `services.ide.primary`        | `Cursor`, `VSCode`, `WebStorm`, `Neovim`           |
| `services.vcs.type`           | `gitlab`, `github`, `bitbucket`, `none`            |
| `services.task_tracking.type` | `beads`, `jira`, `linear`, `github-issues`, `none` |
| `generation.strategy`         | `generate`, `symlink`, `copy`                      |

---

## Workflow Features

### SDLC Phases

| Phase     | Model  | IDE         | Purpose                |
| --------- | ------ | ----------- | ---------------------- |
| Analyze   | Opus   | Claude Code | Requirements breakdown |
| Architect | Opus   | Claude Code | System design          |
| Plan      | Sonnet | Claude Code | Task breakdown         |
| Implement | Agent  | Cursor      | Code generation        |
| Test      | Sonnet | Cursor      | Testing                |
| Review    | Opus   | Claude Code | Quality assurance      |

### Orchestration (Optional)

```yaml
options:
  orchestration: true
```

Enables Perles workflows in `.perles/`:

- Interactive SDLC from prompt
- Full SDLC cycle
- Epic parallel batches

### Token Optimization

```yaml
options:
  token_optimization: '60-70%'
```

Techniques applied:

- Glob-based rule loading
- MCP tool search
- Decision tree compression
- Progressive loading

---

## Related Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - System design
- [PRINCIPLES.md](PRINCIPLES.md) - Core design principles
- [MULTI-TARGET-ARCHITECTURE.md](MULTI-TARGET-ARCHITECTURE.md) - Target system design
- [GIT-TRACKING-STRATEGY.md](GIT-TRACKING-STRATEGY.md) - What to track in git
