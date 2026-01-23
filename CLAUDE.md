# Claude Code Instructions

> Full-Stack DevTools Engineer | Commander.js 12 | TypeScript 5.3

## CRITICAL: Non-Negotiable Rules

**IMPORTANT:** These rules are MANDATORY and must ALWAYS be followed:

1. **NEVER** hardcode secrets - use environment variables
2. **NEVER** skip quality gates (`--no-verify`, `HUSKY=0`)
3. **NEVER** use destructive git commands (`reset --hard`, `clean -fd`) without user approval
4. **ALWAYS** run `npm run quality` before committing
5. **ALWAYS** use beads for task tracking
6. **ALWAYS** search existing solutions first (codebase, deps, docs)
7. **ALWAYS** communicate in Russian (code comments in English)

## Quick Start

```bash
# Essential commands - memorize these
npm run watch           # Dev server ()
npm run quality # MANDATORY before commit
       # Generate API types
bd ready              # Check available work
```

**Keyboard shortcuts:**

- **`#`** - Type `#` to see file/symbol suggestions in prompts
- **`@`** - Reference files or symbols directly
- **`/`** - Access slash commands (analyze, architect, plan, review)

## Project Overview

**shared-ai-configs** - NPM package for generating AI-assisted development configurations for Claude Code and Cursor IDE

```text
src/cli/
├── commands/      # init, generate, validate, status, doctor
├── utils/         # config, template, logger
└── types.ts       # TypeScript interfaces
core/              # Universal .mdc rules (28 files)
stacks/            # Stack-specific rules (react/, node/)
integrations/      # Tool integrations (beads/, github/, gitlab/)
templates/         # EJS templates for generation
content/           # Commands, skills, agents, notepads
hooks/             # Shell/JS hooks for Claude/Cursor
schema/            # JSON Schema for .ai-project.yaml

```

**Stack:** tsc | Commander.js 12 | TypeScript 5.3 | Vitest

## Workflow Commands

### Development

```bash
npm run watch           # Dev server
npm run build         # Production build
npm run lint          # ESLint
npm run test          # Vitest
       # Generate API (Codegen)
```

### Task Management (beads)

```bash
bd ready                           # Find available work
bd update <id> --status=in_progress # Claim task
bd close <id>                      # Complete task
bd sync --flush-only               # Export to JSONL
```

### Beads Sync (AI-Assisted)

**Environment:** `BD_ENABLED=1` in `.env.development.local` enables integration.

**AI should automatically:**

1. **At session start:** `bd ready` + `bd blocked` for context
2. **When creating tasks:** `bd create --title="..." --type=task`
3. **When completing work:** `bd close <id>` + `bd sync --flush-only`
4. **Before commit:** ensure `bd sync --flush-only` is executed

**For colleagues WITHOUT BD_ENABLED:** beads is invisible, `issues.jsonl` file doesn't change in their commits.

### Session End (MANDATORY)

```bash
# 1. Run quality gates
npm run quality

# 2. If gates FAIL - fix issues, re-run (see .claude/TROUBLESHOOTING.md)

# 3. Only after gates pass:
git add <files> && git commit -m "type(scope): description"
bd sync --flush-only
```

## Memory & Context

### Session Start (Auto via hooks)

The session-start hook automatically loads context. Manually refresh with:

```bash
bd ready                                    # Available tasks
mcp__hindsight-alice__recall "sac project context"
/mcp                                        # Check server health
```

### During Work

- **ALWAYS** use TodoWrite for multi-step tasks
- Use `retain` to save important decisions
- Use Context7 before implementing unfamiliar APIs
- Use `reflect` for complex decisions requiring synthesis

### Session End

```bash
mcp__hindsight-alice__retain "Session summary: [what was done]"
bd sync --flush-only
```

## Context Handoff Protocol (Claude Code ↔ Cursor)

**Problem:** 5K tokens wasted per IDE switch without structured protocol

```mermaid
graph LR
    A["Claude Code<br/>(Opus)"] -->|context-handoff.md| B["Cursor<br/>(Agent)"]
    B -->|Implementation| C["Changes"]
    C -->|Commit| D["Back to Claude"]
    D -->|Review| E["✅ Approved"]
```

**Setup:**

```yaml
# .claude/context-handoff/current.md
phase: 'implementation'
task_id: 'SAC-xyz'
scope: "Only modify src/pages/auth/ - don't touch generated API"
api_contract: 'docs/API-CONTRACT.md'
test_plan: 'docs/TEST-PLAN.md'
```

## SDLC Workflow

```mermaid
graph LR
    A["Analyze<br/>(Opus)"] -->|Requirements| B["Architect<br/>(Opus)"]
    B -->|Design| C["Plan<br/>(Sonnet)"]
    C -->|Tasks| D["Implement<br/>(Cursor)"]
    D -->|Code| E["Review<br/>(Opus)"]
    E -->|Approved| F["✅ Merge"]
    E -->|Issues| D
```

**Skip rules:**

- New feature: All 5 phases
- Enhancement: Plan → Implement → Review
- Bug fix: Plan → Implement
- Simple fix: Implement only

## MCP Tools

**Full guide:** `docs/guides/mcp-tools-complete.md`

| Server               | Tools                                         | Use For             |
| -------------------- | --------------------------------------------- | ------------------- |
| **hindsight-alice**  | `recall`, `reflect`, `retain`                 | Long-term memory    |
| **MCP_DOCKER**       | Context7, Jira, Confluence                    | Docs & project mgmt |
| **zread**            | `search_doc`, `read_file`                     | GitHub repos        |
| **Figma**            | `get_design_context`                          | Design to code      |
| **zai-mcp-server**   | `ui_to_artifact`, `diagnose_error_screenshot` | Image analysis      |
| **claude-in-chrome** | `navigate`, `computer`, `read_page`           | Browser automation  |

### MCP Priority Order

1. **beads** → Task context (`bd ready`)
2. **Codebase** → Existing patterns (Glob, Grep)
3. **Hindsight** → Past decisions (`recall`, `reflect`)
4. **Context7** → Library docs (`resolve-library-id` → `get-library-docs`)
5. **WebSearch** → External info (last resort)

### Quick MCP Commands

```bash
# Library docs
mcp__MCP_DOCKER__resolve-library-id "tanstack query"
mcp__MCP_DOCKER__get-library-docs "/tanstack/query" --topic "mutations"

# Memory
mcp__hindsight-alice__recall "How do we handle errors?"
mcp__hindsight-alice__retain "Decision: Use X because Y"

```

### When to Use Context7 vs WebSearch

**Context7** (Library Documentation Lookup):

- ✅ Looking up API documentation for known libraries (React, TanStack Query, Zustand)
- ✅ Checking specific method signatures or parameters
- ✅ Understanding library patterns and best practices
- ✅ Finding examples from official library docs
- ❌ NOT for current events, external data, or non-library info

**WebSearch** (External Information):

- ✅ Current framework updates or latest versions
- ✅ External API documentation not in project
- ✅ Community best practices and discussions
- ✅ Problem solutions from Stack Overflow or blogs
- ❌ NOT for project-internal patterns (use Hindsight instead)

**Pattern:**

```bash
# Unknown library API? → Context7
mcp__MCP_DOCKER__resolve-library-id "name-of-library"
mcp__MCP_DOCKER__get-library-docs "/org/project" --topic "what-you-need"

# Need current info? → WebSearch
mcp__web-search-prime__webSearchPrime search_query="latest react patterns 2026"

# Need project decision? → Hindsight (not WebSearch)
mcp__hindsight-alice__recall "How do we handle [pattern] in this project?"
```

## Documentation

| Topic            | Location                                                       |
| ---------------- | -------------------------------------------------------------- |
| **MCP guide**    | `.claude/MCP-GUIDE.md`                                         |
| Session protocol | `.claude/SESSION-PROTOCOL.md`                                  |
| Troubleshooting  | `.claude/TROUBLESHOOTING.md`                                   |
| SDLC workflow    | `.claude/SDLC-WORKFLOW.md`                                     |
| Hooks config     | `.claude/settings.json`                                        |
| Cursor rules     | `.cursor/rules/INDEX.mdc` (41 rules, also work in Claude Code) |

## Sprint/Milestone Close

```bash
# Quick cleanup - delete temp banks, prune old docs
bd sync --flush-only
CUTOFF=$(date -v-7d +%Y-%m-%d)
curl -X DELETE "http://localhost:8888/v1/default/banks/reflections"
curl -X DELETE "http://localhost:8888/v1/default/banks/session"
```

## Tips for Efficiency

1. **Use `#` key** to quickly reference files when asking questions
2. **Name sessions** with `/rename <task>` for easy resume
3. **Check `/mcp`** if tools stop responding
4. **Use `reflect`** for complex decisions requiring synthesis
5. **Compact context** with `/compact` when responses slow down
6. **Resume sessions** with `claude --continue` or `claude --resume <name>`

## Multi-Agent Workflow: Claude Code & Cursor Synchronization

**CRITICAL:** We work in two IDEs simultaneously. All rules, conventions, and workflows must be identical.

### Split SDLC Between IDEs

| SDLC Phase     | IDE                  | Model        | Use When                                             |
| -------------- | -------------------- | ------------ | ---------------------------------------------------- |
| **Analyze**    | Claude Code          | **Opus**     | Breaking down requirements, understanding scope      |
| **Architect**  | Claude Code          | **Opus**     | Design decisions, system architecture, deep analysis |
| **Plan**       | Claude Code          | Sonnet       | Detailed planning, TodoWrite, task breakdown         |
| **Implement**  | **Cursor**           | Agent mode   | Code generation, fast iterations, automode           |
| **Review**     | Claude Code          | **Opus**     | Code quality, security review, Snyk integration      |
| **Fix Issues** | Claude Code → Cursor | Opus → Agent | Analysis in Opus, implementation in Cursor           |

**Key Principle:**

- 🧠 **Critical thinking** (architecture, analysis, deep review) = **Claude Code Opus only**
- 💻 **Implementation** (writing code, tests, iterating) = **Cursor automode**
- 📋 **Planning** (breaking down, TodoWrite) = **Claude Code Sonnet**

### Why Split?

- **Claude Code Opus:** Best for analysis, architecture, decision-making (context awareness, reasoning depth)
- **Cursor Agent:** Best for implementation, iteration, code generation (speed, reflex reactions)
- **Synergy:** Complex analysis in Claude Code → optimized code generation in Cursor

### IDE Synchronization Rules

1. **Rules Parity:** All 41 rules from `.cursor/rules/INDEX.mdc` apply to both IDEs
2. **Git Workflow:** Both IDEs use stealth mode (no auto-push, no auto-commit)
3. **beads Integration:** Both IDEs use `BD_ENABLED=1` for issue tracking
4. **Quality Gates:** Both IDEs enforce `npm run quality` before commit
5. **Changes Sync:** Updates to `.cursor/rules/` must be reflected in `.claude/` documentation

### Language Preference

**All strategic documentation (plans, roadmaps, architectural decisions) must be in Russian** for improved team readability and comprehension. Code comments remain in English per ESLint rules.

### Model Selection Strategy: Opus vs Sonnet

**When to use each model:**

#### 🧠 **Opus**

- ✅ Architectural decisions
- ✅ Deep code review
- ✅ Critical bug analysis
- ✅ Security decisions
- ✅ Complex reasoning

#### 📊 **Sonnet/Haiku (for standard work)**

- ✅ Implementation
- ✅ Test writing
- ✅ Code generation
- ✅ Routine refactoring

**Rule:** Use Opus for critical decisions, Sonnet for implementation.

---

_Code style enforced by ESLint - no need to memorize rules._
