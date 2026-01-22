# Shared AI Configs - Features & Capabilities

> **Version:** 1.0.0
> **Last Updated:** 2026-01-22

A comprehensive configuration generator for AI-assisted development across multiple IDEs and agents.

## Table of Contents

1. [Core Features (Implemented)](#core-features-implemented)
2. [MCP Integrations](#mcp-integrations)
3. [Workflow Features](#workflow-features)
4. [Planned Features (Roadmap)](#planned-features-roadmap)

---

## Core Features (Implemented)

### Multi-Target Generation

Generate configurations for multiple AI assistants from a single source:

| Target | Status | Output | Description |
|--------|--------|--------|-------------|
| **Claude Code** | Stable | `.claude/`, `CLAUDE.md` | Anthropic's CLI assistant |
| **Cursor** | Stable | `.cursor/`, `.cursorrules` | AI-powered IDE |
| **Kilo** | Planned | `.kilo/` | Future agent support |

```yaml
# .ai-project.yaml
generation:
  targets:
    claude:
      enabled: true
      output_dir: ".claude"
      features: ["rules", "hooks", "commands", "docs", "settings", "main"]
    cursor:
      enabled: true
      output_dir: ".cursor"
      features: ["rules", "hooks", "skills", "agents", "notepads", "mcp"]
    kilo:
      enabled: false  # Future
```

**Benefits:**

- Write rules once, generate for all IDEs
- Maintain consistency across development environments
- Reduce duplication and drift between configurations

### Template-Based Configuration

All output is generated from EJS templates with 60+ configurable placeholders:

```
templates/
├── CLAUDE.md.ejs           # Main Claude Code instructions
├── claude/
│   ├── settings.json.ejs   # Claude settings
│   └── docs/               # Documentation templates
├── cursor/
│   └── cursorrules.ejs     # Cursor rules file
└── mcp/
    └── mcp.json.ejs        # Shared MCP configuration
```

**Template Context Variables:**

| Variable | Description | Example |
|----------|-------------|---------|
| `project.name` | Project name | `"Customer Portal"` |
| `stack.type` | Tech stack type | `"react"`, `"node"` |
| `commands.dev` | Dev command | `"npm run dev"` |
| `services.mcp.*` | MCP configurations | `hindsight.enabled: true` |

**Conditional Content Example:**

```ejs
<% if (services?.task_tracking?.type === 'beads') { %>
## Task Tracking with Beads
```bash
bd ready           # Find available work
bd close <id>      # Complete task
```
<% } %>
```

### Auto-Generated Rules from Config

Transform YAML configuration into AI-enforced rules:

```yaml
# .ai-project.yaml
rules:
  never:
    - "Edit src/shared/api/generated/ - always use npm run codegen"
    - "Hardcode secrets - always use environment variables"
    - "Skip quality gates - no --no-verify or HUSKY=0"

  always:
    - "Run npm run quality:gates before committing"
    - "Use Beads for task tracking"
    - "Search before creating - check codebase, deps, docs first"

  custom:
    - "Prefer existing components over creating new ones"
    - "Follow FSD architecture patterns"
```

**Generated Output:**

The generator transforms these into properly formatted rules sections in CLAUDE.md and .cursorrules with appropriate severity indicators.

### Quality Gates Integration

Built-in support for pre-commit quality checks:

```yaml
commands:
  quality_gates: "npm run quality:gates"  # Referenced in hooks

generation:
  common:
    quality_gates: true  # Enable quality gate hooks
```

**Hook Integration:**

```bash
# Generated hook: .claude/hooks/validate-bash.sh
#!/bin/bash
npm run quality:gates
```

**Supported Quality Gates:**

- ESLint / TypeScript checks
- Prettier formatting
- Markdown linting
- Test execution
- Custom scripts

### Beads Task Tracking Integration

Native integration with the Beads issue tracking system:

```yaml
services:
  task_tracking:
    type: "beads"
    key_prefix: "{PREFIX}-"
    paths:
      beads: ".beads/"
```

**Auto-Generated Commands:**

| Command | Description |
|---------|-------------|
| `bd ready` | Find available work |
| `bd update <id> --status=in_progress` | Claim task |
| `bd close <id>` | Complete task |
| `bd sync --flush-only` | Export to JSONL |

**Alternative Tracking Systems:**

| Type | Generated Commands |
|------|-------------------|
| `jira` | `jira create`, `jira close`, `jira list` |
| `linear` | `linear issue create`, `linear issue close` |
| `github-issues` | `gh issue create`, `gh issue close` |

### MCP Server Configuration

Declarative MCP (Model Context Protocol) server configuration:

```yaml
services:
  mcp:
    hindsight:
      enabled: true
    snyk:
      enabled: true
      api_key_env: "SNYK_TOKEN"
    context7:
      enabled: true
    figma:
      enabled: true
      api_key_env: "FIGMA_API_KEY"
```

**Generated MCP Configuration:**

```json
{
  "mcpServers": {
    "hindsight-alice": {
      "command": "npx",
      "args": ["-y", "hindsight-alice-mcp"]
    },
    "snyk": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/snyk-mcp"],
      "env": {
        "SNYK_TOKEN": "${SNYK_TOKEN}"
      }
    }
  }
}
```

### JSON Schema Validation

Full validation of `.ai-project.yaml` against JSON Schema:

```bash
# Validate configuration
npx shared-ai-configs validate

# Schema location
schema/ai-project.schema.json
```

**Validation Covers:**

- Required fields (`project`, `stack`, `commands`)
- Enum values for types (`react`, `node`, `gitlab`, `github`)
- MCP server configuration structure
- Generation target options

---

## MCP Integrations

### Hindsight (Memory)

Long-term memory and context persistence:

| Tool | Purpose |
|------|---------|
| `recall` | Retrieve past decisions and context |
| `reflect` | Synthesize complex decisions |
| `retain` | Save important information |

```yaml
services:
  mcp:
    hindsight:
      enabled: true
```

**Usage Pattern:**

```bash
# Session start
mcp__hindsight-alice__recall "Project context"

# During work - save decisions
mcp__hindsight-alice__retain "Decision: Use X because Y"

# Complex analysis
mcp__hindsight-alice__reflect "Architecture options for feature Z"
```

### Snyk (Security)

Security vulnerability scanning:

| Tool | Purpose |
|------|---------|
| `snyk_code_scan` | SAST scanning |
| `snyk_sca_scan` | Dependency scanning |
| `snyk_container_scan` | Container image scanning |
| `snyk_iac_scan` | Infrastructure as Code scanning |

```yaml
services:
  mcp:
    snyk:
      enabled: true
```

**Pre-commit Integration:**

```bash
# Scan before commit
mcp__Snyk__snyk_code_scan --path "/src" --severity_threshold "high"
```

### Context7 (Documentation)

Library documentation lookup:

| Tool | Purpose |
|------|---------|
| `resolve-library-id` | Find library in Context7 |
| `get-library-docs` | Retrieve documentation |

```yaml
services:
  mcp:
    context7:
      enabled: true
```

**Usage Pattern:**

```bash
# Find library
mcp__MCP_DOCKER__resolve-library-id "tanstack query"

# Get specific docs
mcp__MCP_DOCKER__get-library-docs "/tanstack/query" --topic "mutations"
```

### Figma (Design)

Design-to-code integration:

| Tool | Purpose |
|------|---------|
| `get_design_context` | Generate code from Figma design |
| `get_screenshot` | Capture design screenshots |
| `get_metadata` | Get design structure |

```yaml
services:
  mcp:
    figma:
      enabled: true
      api_key_env: "FIGMA_API_KEY"
```

### Memory Bank (Project Memory)

Project-specific knowledge storage:

| Tool | Purpose |
|------|---------|
| `memory_bank_read` | Read stored knowledge |
| `memory_bank_write` | Store new knowledge |
| `memory_bank_update` | Update existing entries |
| `list_project_files` | List stored files |

```yaml
services:
  mcp:
    memory_bank:
      enabled: true
```

**Usage Pattern:**

```bash
# Store analysis results
mcp__allpepper-memory-bank__memory_bank_write \
  projectName="Front" \
  fileName="analysis-api-patterns.md" \
  content="## API Error Handling Analysis..."

# Retrieve later
mcp__allpepper-memory-bank__memory_bank_read \
  projectName="Front" \
  fileName="analysis-api-patterns.md"
```

### Browser Automation (Chrome)

Web interaction and automation:

| Tool | Purpose |
|------|---------|
| `navigate` | Navigate to URLs |
| `computer` | Mouse/keyboard control |
| `read_page` | Parse page content |
| `find` | Find elements |
| `javascript_tool` | Execute JavaScript |

```yaml
services:
  mcp:
    browser:
      enabled: true
```

### PAL (Multi-Model)

Multi-model orchestration and reasoning:

| Tool | Purpose |
|------|---------|
| `chat` | General collaborative thinking |
| `thinkdeep` | Complex problem analysis |
| `planner` | Sequential planning |
| `consensus` | Multi-model decision making |
| `codereview` | Systematic code review |
| `debug` | Root cause analysis |

```yaml
services:
  mcp:
    pal:
      enabled: true
```

---

## Workflow Features

### Session Management

Automated session start/stop hooks:

**Claude Code Hooks (Bash):**

```bash
# .claude/hooks/
├── session-start.sh    # Context loading
├── pre-commit.sh       # Quality gates
└── validate-bash.sh    # Command validation
```

**Cursor Hooks (JavaScript):**

```javascript
// .cursor/hooks/
├── accept-check.js     # File accept validation
└── init.js             # Session initialization
```

**Hook Events:**

| IDE | Event | Trigger |
|-----|-------|---------|
| Claude Code | `UserPromptSubmit` | Before prompt processing |
| Claude Code | `Stop` | After response complete |
| Claude Code | `PreToolUse` | Before tool execution |
| Cursor | `init` | Session start |
| Cursor | `accept` | File accept action |

### Dual-IDE Workflows

Coordinated workflows between IDEs:

| SDLC Phase | Recommended IDE | Model | Use Case |
|------------|-----------------|-------|----------|
| **Analyze** | Claude Code | Opus | Requirements breakdown |
| **Architect** | Claude Code | Opus | System design decisions |
| **Plan** | Claude Code | Sonnet | Task breakdown |
| **Implement** | Cursor | Agent | Code generation |
| **Review** | Claude Code | Opus | Quality assurance |

**Context Handoff:**

```yaml
# .claude/context-handoff/current.md
phase: "implementation"
task_id: "{PREFIX}-xyz"
scope: "Only modify src/pages/auth/"
api_contract: "docs/API-CONTRACT.md"
```

### SDLC Workflow Phases

Six-phase development lifecycle:

```
Analyze → Architect → Plan → Implement → Test → Review
```

| Phase | Agent | Focus |
|-------|-------|-------|
| **Analyze** | Opus | Understand requirements, scope |
| **Architect** | Opus | System design, patterns |
| **Plan** | Opus | Implementation breakdown |
| **Implement** | Sonnet | Code generation |
| **Test** | Sonnet | Testing and validation |
| **Review** | Opus | Quality assurance |

**Skip Rules:**

| Task Type | Phases |
|-----------|--------|
| New feature | All 6 phases |
| Enhancement | Plan → Implement → Review |
| Bug fix | Plan → Implement |
| Simple fix | Implement only |

### Orchestration Mode

Multi-agent workflows for complex tasks:

**Available Workflows:**

| Workflow | Description | Trigger |
|----------|-------------|---------|
| **Interactive SDLC** | From idea to implementation | `from-prompt` |
| **Full SDLC** | Complete development cycle | `full-sdlc` label |
| **Epic Batches** | Parallel task execution | `epic-batches` label |

**Interactive SDLC Flow:**

1. Start with idea description
2. Coordinator asks clarifying questions
3. Auto-creates epic + tasks
4. Runs full SDLC workflow
5. Tracks progress via labels

**Progress Labels:**

- `phase-clarify` - Clarification phase
- `phase-sdlc-analyze` - Requirements analysis
- `phase-sdlc-architect` - Architecture design
- `phase-sdlc-implement` - Code implementation
- `phase-sdlc-review` - Quality review
- `phase-complete` - Workflow complete

### Token Optimization Strategies

Techniques to reduce context overhead:

| Technique | Savings | Description |
|-----------|---------|-------------|
| Glob-based rule loading | 60-70% | Load only relevant rules |
| MCP tool search | 50% | Dynamic tool discovery |
| Decision tree compression | 87% | Tables/diagrams vs text |
| Progressive loading | Variable | Load on demand |

```yaml
options:
  token_optimization: "aggressive"  # minimal | standard | aggressive
```

---

## Planned Features (Roadmap)

### Phase 1: MCP Token Generation (Q1 2026)

**Problem:** Manual API key configuration for each MCP server.

**Solution:** Generate MCP configuration with environment variable placeholders:

```yaml
# .ai-project.yaml
services:
  mcp:
    figma:
      enabled: true
      api_key_env: "FIGMA_API_KEY"  # Name of env var
    snyk:
      enabled: true
      api_key_env: "SNYK_TOKEN"
```

**Generated Output:**

```json
{
  "mcpServers": {
    "figma": {
      "env": {
        "FIGMA_API_KEY": "${FIGMA_API_KEY}"
      }
    }
  }
}
```

**Doctor Command Enhancement:**

```bash
npx shared-ai-configs doctor
# Checks:
# [x] FIGMA_API_KEY is set
# [ ] SNYK_TOKEN is missing
```

### Phase 2: NPM Publish (Q1 2026)

**Goal:** Publish to npm for easy installation.

```bash
# Global install
npm install -g shared-ai-configs

# Project local
npm install --save-dev shared-ai-configs

# npx usage
npx shared-ai-configs generate
```

**Package Structure:**

```json
{
  "name": "shared-ai-configs",
  "version": "1.0.0",
  "bin": {
    "shared-ai-configs": "./bin/cli.js",
    "sac": "./bin/cli.js"
  },
  "files": [
    "bin/",
    "dist/",
    "content/",
    "templates/",
    "schema/"
  ]
}
```

### Phase 3: Custom MCP Server Support (Q2 2026)

**Goal:** Define custom MCP servers in configuration.

```yaml
services:
  mcp:
    # Built-in servers
    hindsight:
      enabled: true

    # Custom servers
    custom:
      my-internal-api:
        type: "http"
        url: "https://api.internal.com/mcp"
        api_key_env: "INTERNAL_API_KEY"

      local-tools:
        type: "stdio"
        command: "node"
        args: ["./tools/mcp-server.js"]
```

**Features:**

- HTTP and stdio transport support
- Custom environment variables
- Validation of server configuration
- Auto-discovery of installed MCP packages

### Phase 4: Plan/Force Mode (Q2 2026)

**Goal:** Preview changes before applying, force regeneration when needed.

```bash
# Plan mode - show what would be generated
npx shared-ai-configs generate --plan

# Output:
# Would create:
#   .claude/rules/persona.mdc (new)
#   .claude/rules/quality.mdc (modified)
#   CLAUDE.md (modified)
# Would skip (no changes):
#   .claude/settings.json

# Force mode - regenerate even unchanged files
npx shared-ai-configs generate --force

# Selective generation
npx shared-ai-configs generate --only=claude
npx shared-ai-configs generate --only=cursor
npx shared-ai-configs generate --only=rules
```

### Phase 5: Plugin System (Q3 2026)

**Goal:** Extensible architecture for custom content.

```yaml
plugins:
  install:
    - name: "sac-plugin-nextjs"
      source: "npm"
    - name: "sac-plugin-company-rules"
      source: "npm"
      config:
        department: "engineering"
```

**Plugin Structure:**

```
sac-plugin-nextjs/
├── content/
│   └── stacks/
│       └── nextjs/
│           ├── app-router.mdc
│           └── server-components.mdc
├── templates/
│   └── nextjs/
│       └── middleware.ejs
└── package.json
```

### Phase 6: Kilo Agent Support (Q3 2026)

**Goal:** Support for Kilo and other emerging AI agents.

```yaml
generation:
  targets:
    claude: true
    cursor: true
    kilo:
      enabled: true
      output_dir: ".kilo"
      features: ["rules", "context"]
```

### Phase 7: Team Sync (Q4 2026)

**Goal:** Team-wide configuration synchronization.

```yaml
team:
  sync:
    enabled: true
    source: "https://company.com/ai-configs"
    override_local: false
```

**Features:**

- Central configuration repository
- Per-project overrides
- Version pinning
- Change notifications

---

## CLI Reference

| Command | Description |
|---------|-------------|
| `init` | Create `.ai-project.yaml` template |
| `generate` | Generate all configurations |
| `validate` | Validate config against schema |
| `status` | Show current generation status |
| `doctor` | Diagnose issues and missing deps |

**Options:**

```bash
--force, -f     # Overwrite existing files
--plan          # Preview changes (planned)
--only=<target> # Generate specific target (planned)
--verbose, -v   # Verbose output
```

---

## Related Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - System design and structure
- [PRINCIPLES.md](PRINCIPLES.md) - Core design principles
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Development guide
- [CHANGELOG.md](../CHANGELOG.md) - Version history
