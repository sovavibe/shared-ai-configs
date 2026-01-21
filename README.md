# Shared AI Configs

Universal AI-assisted development configuration for multiple projects.

## Features

- **25+ Universal Rules** — Quality, workflow, MCP, security patterns
- **Stack Templates** — React, Node.js, Java, Python (extensible)
- **Integrations** — GitLab, GitHub, Jira, Beads
- **CLAUDE.md Generator** — Template with 60+ placeholders
- **Symlink-based Sync** — Single source of truth, instant updates

## Quick Start

```bash
# 1. Clone this repo (or add as submodule)
git clone git@github.com:your-org/shared-ai-configs.git ~/shared-ai-configs

# 2. Initialize your project
cd /path/to/your-project
~/shared-ai-configs/tools/setup.sh init

# 3. Edit .ai-project.yaml with your settings

# 4. Sync rules and generate CLAUDE.md
~/shared-ai-configs/tools/setup.sh sync
~/shared-ai-configs/tools/setup.sh generate
```

## Structure

```
shared-ai-configs/
├── core/                      # 🌍 UNIVERSAL (25 files)
│   ├── 001-persona.mdc        # Role, principles, style
│   ├── 004-quality.mdc        # Code quality, TypeScript safety
│   ├── mcp/                   # MCP & Tools
│   │   ├── 100-hindsight.mdc
│   │   ├── 105-tool-selection.mdc
│   │   └── ...
│   ├── workflow/              # Git, PR, task management
│   │   ├── 114-git-workflow.mdc
│   │   └── ...
│   ├── advanced/              # 2026 Patterns (SDD, swarms)
│   │   ├── 124-sdd-patterns.mdc
│   │   └── ...
│   ├── security/              # Security & performance
│   └── commands/              # SDLC slash commands
│
├── stacks/                    # 🔧 STACK-SPECIFIC
│   ├── react/                 # React + TypeScript + Ant Design
│   ├── node/                  # Node.js scripts
│   ├── java/                  # Spring Boot (extensible)
│   └── python/                # FastAPI/Django (extensible)
│
├── integrations/              # 🔌 INTEGRATIONS
│   ├── gitlab/                # GitLab MR commands
│   ├── github/                # GitHub PR commands
│   ├── jira/                  # Jira sync
│   └── beads/                 # Task tracking
│
├── templates/                 # 📄 TEMPLATES
│   └── CLAUDE.template.md     # 60+ placeholders
│
├── hooks/                     # 🪝 HOOKS
│   ├── session-start.sh
│   ├── validate-bash.sh
│   └── pre-commit.sh
│
├── workflows/                 # 🔄 SDLC Workflows
├── schema/                    # 📋 Config Schema
│   ├── ai-project.schema.json
│   └── ai-project.example.yaml
│
└── tools/                     # 🛠️ CLI
    └── setup.sh
```

## Commands

```bash
# Initialize project with .ai-project.yaml template
./tools/setup.sh init

# Sync rules via symlinks (based on .ai-project.yaml)
./tools/setup.sh sync

# Generate CLAUDE.md from template
./tools/setup.sh generate

# Link specific file
./tools/setup.sh link core/001-persona.mdc .cursor/rules/001-persona.mdc

# Show status
./tools/setup.sh status
```

## .ai-project.yaml

Project-specific configuration:

```yaml
project:
  name: "My Project"
  language: "Russian"  # or English

stack:
  type: "react"  # react | node | java | python
  framework:
    name: "React"
    version: "18.3"

integrations:
  vcs:
    type: "gitlab"  # gitlab | github
  issues:
    type: "jira"
    key: "PROJ"
  task_tracking:
    type: "beads"
    enabled: true

commands:
  dev: "npm run dev"
  quality_gates: "npm run quality:gates"
  # ... more commands
```

See `schema/ai-project.example.yaml` for full example.

## Adding New Stacks

1. Create `stacks/your-stack/` directory
2. Add rules as `.mdc` files
3. Update `setup.sh` to handle your stack type

## Adding New Integrations

1. Create `integrations/your-tool/` directory
2. Add commands as `.md` files
3. Update `setup.sh` detection logic

## License

MIT
