# Multi-Target Generation Architecture

> **Principle:** Write once, generate everywhere (DRY)

## Overview

```
content/rules/react.mdc  ──┬──►  .claude/rules/react.mdc
                           ├──►  .cursor/rules/react.mdc
                           └──►  .kilo/rules/react.mdc (future)
```

## Feature Matrix: Claude Code vs Cursor

| Content Type | Claude Code | Cursor | Format | Single Source? |
|--------------|-------------|--------|--------|----------------|
| **Rules** | `.claude/rules/*.mdc` | `.cursor/rules/*.mdc` | MDC | ✅ YES |
| **Hooks** | `.claude/hooks/*.sh` | `.cursor/hooks/*.js` | Different! | ❌ Two sources |
| **Commands** | `.claude/commands/*.md` | `.cursor/commands/*.md` | Markdown | ✅ YES |
| **Skills** | N/A | `.cursor/skills/*/SKILL.md` | SKILL.md | Cursor-only |
| **Agents** | N/A | `.cursor/agents/*.md` | Markdown | Cursor-only |
| **Notepads** | N/A | `.cursor/notepads/*.md` | Markdown | Cursor-only |
| **Docs** | `.claude/docs/*.md` | N/A | Markdown | Claude-only |
| **Main** | `CLAUDE.md` | `.cursorrules` | Different! | ✅ Template-based |
| **Settings** | `.claude/settings.json` | `.cursor/hooks.json` | JSON | Different structure |
| **MCP** | Referenced in main | `.cursor/mcp.json` | JSON | ✅ Similar structure |

## Content Directory Structure

```
shared-ai-configs/
├── content/
│   ├── rules/                    # 📏 SINGLE SOURCE RULES (MDC)
│   │   ├── core/                 # Always-load rules
│   │   │   ├── 001-persona.mdc
│   │   │   ├── 002-tech-stack.mdc
│   │   │   └── 004-quality.mdc
│   │   ├── workflow/             # Workflow rules
│   │   │   ├── 110-ai-workflow.mdc
│   │   │   ├── 113-task-management.mdc
│   │   │   └── 114-git-workflow.mdc
│   │   ├── mcp/                  # MCP tool rules
│   │   │   ├── 100-hindsight.mdc
│   │   │   └── 105-tool-selection.mdc
│   │   ├── integrations/         # VCS & task tracking
│   │   │   ├── 005-beads.mdc
│   │   │   ├── 119-gitlab-mr.mdc
│   │   │   └── 119-github-pr.mdc
│   │   └── stacks/               # Stack-specific
│   │       ├── react/
│   │       ├── node/
│   │       └── python/
│   │
│   ├── commands/                 # 📟 SINGLE SOURCE COMMANDS
│   │   ├── sdlc/                 # SDLC phase commands
│   │   │   ├── analyze.md
│   │   │   ├── architect.md
│   │   │   ├── plan.md
│   │   │   └── review.md
│   │   ├── session/              # Session management
│   │   │   ├── start.md
│   │   │   └── end.md
│   │   └── integrations/         # VCS-specific commands
│   │       ├── gitlab/
│   │       └── github/
│   │
│   ├── hooks/                    # 🪝 DUAL SOURCE HOOKS
│   │   ├── claude/               # Bash hooks for Claude Code
│   │   │   ├── session-start.sh
│   │   │   ├── validate-bash.sh
│   │   │   └── workflow-stop.sh
│   │   └── cursor/               # JS hooks for Cursor
│   │       ├── session-init.js
│   │       ├── accept-check.js
│   │       └── quality-check.js
│   │
│   ├── cursor-only/              # 🎯 CURSOR-SPECIFIC
│   │   ├── skills/
│   │   │   ├── code-review/SKILL.md
│   │   │   └── tdd-workflow/SKILL.md
│   │   ├── agents/
│   │   │   ├── planner.md
│   │   │   ├── researcher.md
│   │   │   └── verifier.md
│   │   └── notepads/
│   │       ├── canonical-examples.md
│   │       └── form-patterns.md
│   │
│   └── claude-only/              # 🧠 CLAUDE-SPECIFIC
│       ├── docs/                 # Generated documentation
│       │   ├── MCP-GUIDE.md.ejs
│       │   └── SESSION-PROTOCOL.md.ejs
│       └── workflows/            # Orchestration workflows
│           └── sdlc-workflow.md
│
├── templates/                    # 📝 EJS TEMPLATES
│   ├── CLAUDE.md.ejs             # Main Claude instructions
│   ├── cursorrules.ejs           # Main Cursor rules file
│   ├── claude/
│   │   ├── settings.json.ejs
│   │   └── docs/*.ejs
│   └── cursor/
│       ├── hooks.json.ejs
│       └── mcp.json.ejs
│
└── schema/
    └── ai-project.schema.json    # Config validation
```

## Generation Targets

### Target: Claude Code

```yaml
# .ai-project.yaml
generation:
  targets:
    claude:
      enabled: true
      output_dir: ".claude"
      features:
        - rules          # content/rules/ → .claude/rules/
        - hooks          # content/hooks/claude/ → .claude/hooks/
        - commands       # content/commands/ → .claude/commands/
        - docs           # templates/claude/docs/ → .claude/docs/
        - settings       # templates/claude/settings.json.ejs → .claude/settings.json
        - main           # templates/CLAUDE.md.ejs → CLAUDE.md
```

### Target: Cursor

```yaml
# .ai-project.yaml
generation:
  targets:
    cursor:
      enabled: true
      output_dir: ".cursor"
      features:
        - rules          # content/rules/ → .cursor/rules/
        - hooks          # content/hooks/cursor/ → .cursor/hooks/
        - commands       # content/commands/ → .cursor/commands/
        - skills         # content/cursor-only/skills/ → .cursor/skills/
        - agents         # content/cursor-only/agents/ → .cursor/agents/
        - notepads       # content/cursor-only/notepads/ → .cursor/notepads/
        - mcp            # templates/cursor/mcp.json.ejs → .cursor/mcp.json
        - cursorrules    # templates/cursorrules.ejs → .cursorrules
```

### Future Target: Kilo

```yaml
# .ai-project.yaml
generation:
  targets:
    kilo:
      enabled: false     # Future support
      output_dir: ".kilo"
      features:
        - rules
        - commands
```

## Generation Logic

### Rule Generation (Multi-Target)

```typescript
// generate.ts
function generateRules(config: Config) {
  const rules = getRulesToInclude(config);

  // Generate for each enabled target
  for (const [target, targetConfig] of Object.entries(config.generation.targets)) {
    if (!targetConfig.enabled) continue;
    if (!targetConfig.features.includes('rules')) continue;

    const outputDir = join(targetConfig.output_dir, 'rules');

    for (const rule of rules) {
      // Same rule → multiple destinations
      copyOrSymlink(rule.source, join(outputDir, rule.target));
    }
  }
}
```

### Hooks Generation (Target-Specific)

```typescript
function generateHooks(config: Config) {
  // Claude hooks (bash)
  if (config.generation.targets.claude?.enabled) {
    copyDir('content/hooks/claude/', '.claude/hooks/');
  }

  // Cursor hooks (js)
  if (config.generation.targets.cursor?.enabled) {
    copyDir('content/hooks/cursor/', '.cursor/hooks/');
  }
}
```

### Template Generation (With Config Context)

```typescript
function generateTemplates(config: Config) {
  // Same template → different outputs based on config
  const context = {
    ...config,
    services: config.services,
    commands: config.commands,
  };

  // Claude main
  if (config.generation.targets.claude?.enabled) {
    render('templates/CLAUDE.md.ejs', context, 'CLAUDE.md');
  }

  // Cursor main
  if (config.generation.targets.cursor?.enabled) {
    render('templates/cursorrules.ejs', context, '.cursorrules');
  }
}
```

## MDC Format (Shared)

Both Claude Code and Cursor use identical MDC format:

```yaml
---
description: 'React component patterns and hooks'
version: '1.0.0'
lastUpdated: '2026-01-21'
alwaysApply: false
globs: ['src/**/*.tsx', 'src/**/*.jsx']
---

# React Patterns

Rule content in markdown...
```

## Conditional Content

### Config-Driven Sections

```yaml
# .ai-project.yaml
services:
  vcs:
    type: gitlab        # → include gitlab commands
  task_tracking:
    type: beads         # → include beads rules
  mcp:
    hindsight:
      enabled: true     # → include hindsight rule
```

### Template Conditionals

```ejs
<% if (services?.vcs?.type === 'gitlab') { %>
## GitLab Workflow
Use `/gitlab-view-mr`, `/gitlab-process-comments` for MR operations.
<% } else if (services?.vcs?.type === 'github') { %>
## GitHub Workflow
Use `gh pr view`, `gh pr create` for PR operations.
<% } %>
```

## Benefits

1. **DRY** — Write rules once, use everywhere
2. **Consistency** — Same patterns across IDEs
3. **Maintainability** — Update one file, regenerate all
4. **Extensibility** — Add new targets (Kilo, etc.) without changing content
5. **Conditional** — Include/exclude based on project config
6. **Token Optimization** — Generate only what's needed

## Implementation Phases

1. ✅ **Phase 9** — Basic generation (rules → both IDEs)
2. 🔄 **Phase 10** — Multi-target architecture (this doc)
3. 📋 **Phase 11** — Cursor-specific features (skills, agents, notepads)
4. 📋 **Phase 12** — Future agent support (Kilo, etc.)
