# Claude Code Instructions

> {{project.role}} | {{stack.framework.name}} {{stack.framework.version}} | {{stack.language.name}} {{stack.language.version}} | {{stack.ui.library}} {{stack.ui.version}}

## CRITICAL: Non-Negotiable Rules

**IMPORTANT:** These rules are MANDATORY and must ALWAYS be followed:

1. **NEVER** edit `{{paths.codegen_output}}` - ALWAYS use `{{commands.codegen}}`
2. **NEVER** hardcode secrets - ALWAYS use environment variables
3. **NEVER** skip quality gates - NO `--no-verify` or `HUSKY=0`
4. **ALWAYS** run `{{commands.quality_gates}}` before committing
5. **ALWAYS** use {{integrations.task_tracking.type}} for task tracking - NEVER markdown TODOs
6. **ALWAYS** search before creating - check codebase, deps, docs first
7. **ALWAYS** communicate in {{project.language}} - Plans, reports, analysis → {{project.language}}; Code comments → English
8. **NEVER** create markdown reports in git - Store findings in Memory Bank via MCP instead

### Rule #8 Explanation: Knowledge Storage Strategy

**Where to store what:**

| Information Type | Storage Location | Tool | Why |
|------------------|------------------|------|-----|
| **Session findings** | Memory Bank | `mcp__allpepper-memory-bank__memory_bank_write` | Multi-session reuse, no git pollution |
| **Architecture decisions** | `{{paths.claude_docs}}docs/decisions.md` | Manual edit | Persistent, searchable, version-controlled |
| **Important learnings** | Hindsight | `mcp__hindsight-alice__retain` | Auto-recalled next session via TEMPR |
| **Task tracking** | {{integrations.task_tracking.type}} | `{{commands.task_ready}}`, `{{commands.task_close}}` | Issue database, dependencies, status |

## Quick Start

```bash
# Essential commands - memorize these
{{commands.dev}}           # Dev server ({{options.dev_server_port}})
{{commands.quality_gates}} # MANDATORY before commit
{{commands.codegen}}       # Generate API types
{{commands.task_ready}}    # Check available work
```

**Keyboard shortcuts:**

- **`#`** - Type `#` to see file/symbol suggestions in prompts
- **`@`** - Reference files or symbols directly
- **`/`** - Access slash commands (analyze, architect, plan, review)

## Project Overview

**{{project.name}}** - {{project.description}}

```text
{{architecture.structure}}
```

**Stack:** {{stack.build.tool}} {{stack.build.version}} | {{stack.framework.name}} {{stack.framework.version}} | {{stack.state.server}} | {{stack.state.client}} | {{stack.ui.library}} {{stack.ui.version}} | {{stack.ui.styling}} | {{stack.api.codegen}} | {{stack.api.mocks}}

## Token Optimization Strategy

**Target:** {{options.token_optimization}} token reduction per session

**Techniques:**
- Glob-based auto-loading: Load only rules matching file type
- MCP Tool Search: Dynamically load 3-5 relevant tools per task
- Decision tree compression: Use diagrams/tables instead of explanations
- Progressive loading: Don't load everything at session start

## Specification-Driven Development (SDD)

**Pattern:** Write executable specs BEFORE code generation (2026 paradigm)

**Files:**
- `requirements.md` - What to build (immutable spec)
- `design.md` - Architecture decisions
- `tasks.md` - Actionable breakdown with dependencies

**Benefit:** Specs survive context switches (5K tokens saved vs recreating understanding)

## Workflow Commands

### Development

```bash
{{commands.dev}}              # Dev server
{{commands.build}}            # Production build
{{commands.lint}}             # Linting
{{commands.test}}             # Tests
{{commands.codegen}}          # Generate API
```

### Task Management ({{integrations.task_tracking.type}})

```bash
{{commands.task_ready}}                           # Find available work
{{commands.task_update}} <id> --status=in_progress  # Claim task
{{commands.task_close}} <id>                      # Complete task
{{commands.task_sync}}                            # Export to JSONL
```

### Session End (MANDATORY)

```bash
# 1. Run quality gates
{{commands.quality_gates}}

# 2. If gates FAIL - fix issues, re-run

# 3. Only after gates pass:
git add <files> && git commit -m "type(scope): description"
{{commands.task_sync}}
```

## Memory & Context

### Session Start (Auto via hooks)

The session-start hook automatically loads context. Manually refresh with:

```bash
{{commands.task_ready}}                         # Available tasks
mcp__hindsight-alice__recall "{{project.name}} project context"
/mcp                                            # Check server health
```

### During Work

- **ALWAYS** use TodoWrite for multi-step tasks
- Use `retain` to save important decisions
- Use Context7 before implementing unfamiliar APIs
- Use `reflect` for complex decisions requiring synthesis

### Session End

```bash
mcp__hindsight-alice__retain "Session summary: [what was done]"
{{commands.task_sync}}
```

## SDLC Workflow

**Model switching:** {{options.model_switching}}

**Skip rules:**
- New feature: All 5 phases
- Enhancement: {{options.skip_rules.enhancement}}
- Bug fix: {{options.skip_rules.bugfix}}
- Simple fix: {{options.skip_rules.simple_fix}}

## Context Handoff Protocol ({{ide.secondary}} ↔ {{ide.primary}})

**Problem:** 5K tokens wasted per IDE switch without structured protocol

**Setup:**

```yaml
# {{paths.context_handoff}}
phase: "implementation"
task_id: "{{integrations.task_tracking.key_prefix}}xyz"
scope: "Only modify src/pages/auth/ - don't touch generated API"
api_contract: "docs/API-CONTRACT.md"
test_plan: "docs/TEST-PLAN.md"
```

## Dual-IDE Workflow: {{ide.secondary}} & {{ide.primary}} Synchronization

**CRITICAL:** We work in two IDEs simultaneously. All rules, conventions, and workflows must be identical.

### Split SDLC Between IDEs

| SDLC Phase | IDE | Model | Use When |
|-----------|-----|-------|----------|
| **Analyze** | {{ide.secondary}} | **Opus** | Breaking down requirements, understanding scope |
| **Architect** | {{ide.secondary}} | **Opus** | Design decisions, system architecture, deep analysis |
| **Plan** | {{ide.secondary}} | Sonnet | Detailed planning, TodoWrite, task breakdown |
| **Implement** | **{{ide.primary}}** | Agent mode | Code generation, fast iterations, automode |
| **Review** | {{ide.secondary}} | **Opus** | Code quality, security review, Snyk integration |

### IDE Synchronization Rules

1. **Rules Parity:** All rules apply to both IDEs
2. **Git Workflow:** Both IDEs use stealth mode (no auto-push, no auto-commit)
3. **{{integrations.task_tracking.type}} Integration:** Both IDEs use task tracking
4. **Quality Gates:** Both IDEs enforce `{{commands.quality_gates}}` before commit
5. **Language:** {{project.language}} for strategic docs, English for code

## MCP Tools

| Server | Tools | Use For |
|--------|-------|---------|
| **hindsight-alice** | `recall`, `reflect`, `retain` | Long-term memory |
| **MCP_DOCKER** | Context7, Jira, Confluence | Docs & project mgmt |
| **pal** | `chat`, `thinkdeep`, `debug`, `codereview` | External models |
| **Snyk** | `snyk_code_scan`, `snyk_sca_scan` | Security scanning |
| **zread** | `search_doc`, `read_file` | GitHub repos |
| **Figma** | `get_design_context` | Design to code |
| **zai-mcp-server** | `ui_to_artifact`, `diagnose_error_screenshot` | Image analysis |
| **claude-in-chrome** | `navigate`, `computer`, `read_page` | Browser automation |

### MCP Priority Order

1. **{{integrations.task_tracking.type}}** → Task context
2. **Codebase** → Existing patterns (Glob, Grep)
3. **Hindsight** → Past decisions (`recall`, `reflect`)
4. **Context7** → Library docs
5. **PAL** → External models for complex tasks
6. **WebSearch** → External info (last resort)

## Documentation

| Topic | Location |
|-------|----------|
| **MCP guide** | `{{paths.claude_docs}}MCP-GUIDE.md` |
| Session protocol | `{{paths.claude_docs}}SESSION-PROTOCOL.md` |
| Troubleshooting | `{{paths.claude_docs}}TROUBLESHOOTING.md` |
| SDLC workflow | `{{paths.claude_docs}}SDLC-WORKFLOW.md` |
| Cursor rules | `{{paths.cursor_rules}}INDEX.mdc` |

## Tips for Efficiency

1. **Use `#` key** to quickly reference files when asking questions
2. **Name sessions** with `/rename <task>` for easy resume
3. **Check `/mcp`** if tools stop responding
4. **Use `reflect`** for complex decisions requiring synthesis
5. **Compact context** with `/compact` when responses slow down
6. **Resume sessions** with `claude --continue` or `claude --resume <name>`

---

_Code style enforced by {{stack.linter}} - no need to memorize rules._

---
_Generated from shared-ai-configs template. Source: {{shared_configs.source}}_
