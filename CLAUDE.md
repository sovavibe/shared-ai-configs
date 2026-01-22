# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Rules

**FORBIDDEN GIT COMMANDS** - Never execute these without explicit user approval:

```bash
# NEVER DO THIS - destroys uncommitted work
git reset --hard
git checkout -- .
git clean -fd
git stash drop
git branch -D
```

**Why:** Multiple agents may work in parallel. These commands destroy uncommitted changes irreversibly.

**Instead:**

- `git stash` (preserves changes)
- `git diff` (review first)
- Ask user before any destructive operation
- If lint/commit fails, fix the issues instead of resetting

## Project Overview

NPM package (`shared-ai-configs`) that generates AI-assisted development configurations for Claude Code and Cursor IDE from a single `.ai-project.yaml` config file.

## Commands

```bash
# Development
npm run build          # Compile TypeScript to dist/
npm run watch          # Watch mode compilation
npm run test           # Run tests with Vitest
npm run lint           # ESLint on src/

# CLI usage (after build)
npx shared-ai-configs init       # Create .ai-project.yaml template
npx shared-ai-configs generate   # Generate configurations
npx shared-ai-configs validate   # Validate config against schema
npx shared-ai-configs status     # Show configuration status
npx shared-ai-configs doctor     # Diagnose issues
```

## Architecture

### CLI Entry Point

- `src/cli/index.ts` - Commander.js CLI setup with 5 commands
- `bin/cli.js` - Binary wrapper (aliases: `shared-ai-configs`, `sac`)

### Commands (`src/cli/commands/`)

| Command | File | Purpose |
|---------|------|---------|
| init | `init.ts` | Creates `.ai-project.yaml` template |
| generate | `generate.ts` | Main generator - produces CLAUDE.md, .claude/, .cursor/ |
| validate | `validate.ts` | JSON Schema validation |
| status | `status.ts` | Shows current config state |
| doctor | `doctor.ts` | Diagnoses missing files/outdated configs |

### Generation Flow (`generate.ts`)

1. Load config via `loadConfig()` → validate with `validateConfig()`
2. Normalize targets (Claude/Cursor) with feature flags
3. For each enabled target:
   - Claude: `generateClaudeMd()` → `generateClaudeDir()` (rules, hooks, docs, settings, commands)
   - Cursor: `generateCursorDir()` (rules, skills, agents, notepads, hooks, mcp)
4. Common: `.beads/` (if beads enabled), `.perles/` (if orchestration enabled)
5. Update `.gitignore` with generated paths

### Content Sources

| Directory | Purpose |
|-----------|---------|
| `content/core/` | Universal rules (25+ .mdc files, numbered 001-200) |
| `content/stacks/` | Stack-specific rules (react/, node/) |
| `content/integrations/` | Tool integrations (beads/, gitlab/, jira/) |
| `templates/` | EJS templates for CLAUDE.md and docs |
| `hooks/` | Shell hooks for Claude Code |
| `workflows/` | Workflow orchestration docs |
| `schema/` | JSON Schema + example yaml |

### Rule Numbering Convention

| Range | Category | alwaysApply |
|-------|----------|-------------|
| 001-009 | Core | true |
| 010-049 | Context (glob-matched) | false |
| 100-149 | On-demand (@mention) | false |
| 150+ | Reference/Special | false |

### Key Utilities

- `src/cli/utils/config.ts` - Config loading, validation, defaults (`CONFIG_DEFAULTS`)
- `src/cli/utils/template.ts` - EJS rendering with `renderTemplate()`
- `src/cli/utils/logger.ts` - Chalk-based console output

### Types (`src/cli/types.ts`)

Main interfaces: `Config`, `StackConfig`, `ServicesConfig`, `GenerationConfig`, `GenerateOptions`

Generation supports three strategies: `generate` (copy), `symlink`, `copy`

## Key Patterns

### Rule Selection Logic

`getRulesToInclude(config)` in `generate.ts` determines which .mdc rules to include based on:

- Stack type (react → react-specific rules)
- MCP servers enabled (hindsight, snyk, etc.)
- Task tracking type (beads → 005-beads.mdc)
- VCS type (gitlab → 119-gitlab-mr.mdc, github → 119-github-pr.mdc)
- Dual IDE mode

### Template Context

EJS templates receive full `Config` object. Key placeholders reference `config.project`, `config.stack`, `config.services`, `config.commands`.
