# Git Tracking Strategy

> **TL;DR:** Commit config, ignore generated files. Run `npx shared-ai-configs generate` to recreate.

## Overview

This document defines what should be committed to git vs ignored when using shared-ai-configs in your projects.

---

## What to Commit

| File/Directory                   | Purpose                        | Why Track                        |
| -------------------------------- | ------------------------------ | -------------------------------- |
| `.ai-project.yaml`               | Project configuration          | **Source of truth** for AI setup |
| `docs/`                          | Architecture decisions, guides | Team knowledge base              |
| Custom rules in `rules.custom[]` | Project-specific AI rules      | Extends shared rules             |

### `.ai-project.yaml` — The Only Required File

```yaml
# This file MUST be in git
extends: shared-ai-configs

stack:
  framework: react
  language: typescript

rules:
  custom:
    - path: ./docs/ai-rules/domain-terms.md
      description: 'Project-specific domain terminology'
```

---

## What to Ignore

| File/Directory   | Purpose                      | Why Ignore                         |
| ---------------- | ---------------------------- | ---------------------------------- |
| `.claude/`       | Generated Claude Code config | Regenerate with `generate`         |
| `.cursor/`       | Generated Cursor config      | Regenerate with `generate`         |
| `CLAUDE.md`      | Generated instructions       | Regenerate with `generate`         |
| `AGENTS.md`      | Generated agent docs         | Regenerate with `generate`         |
| `.env.aiproject` | API keys, tokens             | **Security**                       |
| `.memory/`       | Memory Bank data             | Local MCP state                    |
| `.beads/`        | Task tracking DB             | Local state (synced via `bd sync`) |
| `.perles/`       | Orchestration state          | Local TUI state                    |

### Recommended `.gitignore` Additions

```gitignore
# AI Generated (by shared-ai-configs) - DO NOT EDIT
# Regenerate with: npx shared-ai-configs generate
.claude/
.cursor/
CLAUDE.md
AGENTS.md

# Secrets
.env.aiproject

# Local AI State
.memory/
.beads/
.perles/
```

---

## Why This Strategy

### 1. Generated Files Are Reproducible

```
.ai-project.yaml (committed)
        │
        ▼
npx shared-ai-configs generate
        │
        ├──► .claude/     (generated, ignored)
        ├──► .cursor/     (generated, ignored)
        ├──► CLAUDE.md    (generated, ignored)
        └──► AGENTS.md    (generated, ignored)
```

**Benefit:** No merge conflicts on generated files.

### 2. Config in Git = Team Consistency

Everyone gets the same AI setup:

```bash
# New team member
git clone repo
npx shared-ai-configs generate
# Done — same rules as everyone else
```

### 3. Secrets Never in Git

`.env.aiproject` contains sensitive data:

```env
# NEVER commit this
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GITLAB_TOKEN=glpat-...
```

### 4. Local State = No Conflicts

`.beads/`, `.memory/`, `.perles/` are personal working state:

- Different developers have different tasks in progress
- Memory Bank contains session-specific context
- Perles orchestration state is per-developer

---

## Workflow

### Initial Setup

```bash
# 1. Create config (commit this)
cat > .ai-project.yaml << 'EOF'
extends: shared-ai-configs
stack:
  framework: react
  language: typescript
EOF

# 2. Generate files (gitignored)
npx shared-ai-configs generate

# 3. Commit config only
git add .ai-project.yaml
git commit -m "chore: add AI project configuration"
```

### Daily Workflow

```bash
# After pulling changes
git pull
npx shared-ai-configs generate --force

# After editing .ai-project.yaml
npx shared-ai-configs generate --force
git add .ai-project.yaml
git commit -m "chore: update AI configuration"
```

### Team Onboarding

```bash
# Clone and setup
git clone <repo>
cd <repo>
npm install
npx shared-ai-configs generate

# Create local secrets file
cp .env.aiproject.example .env.aiproject
# Edit .env.aiproject with your keys
```

---

## Edge Cases

### Custom Rules in Project

If you have project-specific rules, reference them in `.ai-project.yaml`:

```yaml
rules:
  custom:
    - path: ./docs/ai-rules/domain-terms.md # Committed
    - path: ./docs/ai-rules/api-patterns.md # Committed
```

The rule files in `docs/ai-rules/` **should be committed** — they're project knowledge.

### Beads Issues File

Special case: `.beads/issues.jsonl` can be committed for team visibility:

```gitignore
# In .gitignore
.beads/
!.beads/issues.jsonl  # Optionally track for team sync
```

### CLAUDE.md as Source of Truth

Some projects use `CLAUDE.md` as hand-written documentation (not generated). In that case:

```gitignore
# Don't ignore CLAUDE.md if it's hand-written
# .claude/  # Still ignore the directory
```

---

## Summary

| Category         | Track in Git         | Ignore                                           |
| ---------------- | -------------------- | ------------------------------------------------ |
| **Config**       | `.ai-project.yaml`   | -                                                |
| **Generated**    | -                    | `.claude/`, `.cursor/`, `CLAUDE.md`, `AGENTS.md` |
| **Secrets**      | -                    | `.env.aiproject`                                 |
| **Local State**  | -                    | `.memory/`, `.beads/`, `.perles/`                |
| **Custom Rules** | `docs/ai-rules/*.md` | -                                                |

**Remember:** When in doubt, ask "Can this be regenerated?" If yes, ignore it.
