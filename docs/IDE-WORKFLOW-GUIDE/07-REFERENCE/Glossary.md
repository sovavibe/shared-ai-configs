# Glossary of Terms

**Last Updated:** 2026-01-21
**Audience:** All team members
**Purpose:** Reference for specialized terminology used throughout documentation

---

## IDE & Environment Concepts

### Claude Code

The official Claude CLI for local development. Integrates with Cursor for dual-IDE workflow. Provides AI assistance via command palette and slash commands.

- **Related:** Cursor, dual-IDE workflow
- **See:** CLAUDE.md, Session-Protocol.md

### Cursor

A code editor with built-in AI (Cursor Agent). Used for implementation-heavy work. Synced with Claude Code for shared contexts.

- **Related:** Claude Code, automode, Agent
- **See:** IDE-WORKFLOW-GUIDE

### Dual-IDE Workflow

Working simultaneously in Claude Code (analysis/architecture) and Cursor (implementation). Divides labor: Opus + Sonnet in Code, Agent mode in Cursor.

- **Related:** IDE synchronization, context preservation
- **See:** Advanced-Workflows.md

### Automode (Cursor)

Continuous code generation without pausing between steps. Cursor Agent writes code in rapid iteration. Used for implementation phases.

- **Related:** Agent mode, implementation phase
- **Contrast:** Interactive mode (pause after each change)

### Agent Mode

AI-powered autonomous operation mode. Executes tasks with minimal human intervention. Used in Cursor for rapid implementation.

- **Related:** Automode, Cursor
- **Contrast:** Interactive mode

### MCP (Model Context Protocol)

Framework for extending AI assistant capabilities via plugins. Enables Jira, Confluence, Snyk, GitHub access without leaving IDE.

- **Related:** Tools, servers, integration
- **See:** MCP-GUIDE.md

### Session

Continuous working period with persistent context. Spans multiple files, commits, and MCP operations. Auto-loads via session-start hook.

- **Related:** Context window, token budget, session closure
- **Lifecycle:** Start → Work → Compact → Close

### Context Window

Maximum tokens available per session (200K for Haiku 4.5). Shared among conversation, file content, tool responses. Managed via token optimization.

- **Related:** Token budget, compaction, session lifecycle
- **Capacity:** 200,000 tokens

### Slash Commands

Quick-access operations prefixed with `/`. Examples: `/analyze`, `/architect`, `/plan`, `/review`, `/compact`, `/model <name>`

- **Related:** Command palette, prompting
- **Access:** Type `/` in chat

---

## SDLC & Workflow Concepts

### SDLC (Software Development Life Cycle)

Multi-phase process: Analyze → Architect → Plan → Implement → Test → Review. Each phase has recommended model.

- **Related:** Phases, workflows, models
- **Duration:** 5-6 hours per feature
- **Token cost:** 60-85K

### Full SDLC

Sequential execution of all 6 SDLC phases by different models. Triggered by `full-sdlc` label on task/epic.

- **Related:** SDLC phases, workflows, Perles
- **Trigger:** `bd update <id> --labels="full-sdlc"`

### Interactive SDLC

AI-guided workflow for new ideas. Coordinator asks clarifying questions → auto-creates structure → launches full SDLC.

- **Related:** Coordinator agent, from-prompt workflow
- **Entry:** `perles` → Ctrl+O → Ctrl+P

### Epic Batches

Parallel execution of independent subtasks (up to 5 simultaneously). Used for large refactorings, mass migrations.

- **Related:** Parallelization, swarms, efficiency
- **Trigger:** `bd update <epic> --labels="epic-batches"`
- **Speedup:** 4-5x faster than sequential

### SDLC Phases

1. **Analyze** (Opus) - Requirements, constraints, risks
2. **Architect** (Opus) - Design, interfaces, integration
3. **Plan** (Sonnet) - Steps, dependencies, TodoWrite
4. **Implement** (Sonnet) - Code, tests, commits
5. **Test** (Sonnet) - Coverage, validation, results
6. **Review** (Opus) - Quality, security, approval

### Phase Labels

Track SDLC progress: `phase-sdlc-analyze`, `phase-sdlc-architect`, `phase-sdlc-plan`, `phase-sdlc-implement`, `phase-sdlc-test`, `phase-sdlc-review`

- **Related:** Phase tracking, progress monitoring
- **Usage:** Automatic in Perles, manual for troubleshooting

### Perles

Orchestration TUI that coordinates multi-agent SDLC workflows. Manages sequential phases, parallel batches, error recovery.

- **Related:** Orchestration, automation, workflows
- **Access:** `perles` command
- **See:** Advanced-Workflows.md

### Verification Swarm

Coordinated team of 5 specialists investigating production bugs simultaneously. Includes: Root Cause, Regression, Integration, Performance, Security hunters.

- **Related:** Emergency debugging, P0 response
- **Duration:** 15-30 minutes to root cause
- **Trigger:** `bd update <task> --labels="emergency-debug,p0"`

### TodoWrite

Structured task breakdown using Claude Code tool. Creates numbered checklist with dependencies. Updated as progress advances.

- **Related:** Planning, implementation steps
- **Used in:** Plan phase, daily standups
- **Format:** Markdown task list with checkboxes

---

## Task Management (Beads)

### Beads

AI-powered task tracking system integrated with Claude Code. Syncs work items between AI sessions and human team members.

- **Related:** Task management, issue tracking
- **Commands:** `bd ready`, `bd create`, `bd update`, `bd close`
- **File:** `issues.jsonl`

### Task Status

- **pending** - Not yet started
- **in_progress** - Actively being worked on
- **completed** - Finished and verified
- **blocked** - Waiting on external dependency

### Task Priority

- **critical** - P0, immediate attention (e.g., production bugs)
- **high** - P1, important for sprint (e.g., key features)
- **medium** - P2, normal priority (e.g., enhancements)
- **low** - P3, nice-to-have (e.g., tech debt, documentation)

### Task Labels

Custom metadata tags for categorizing work:

- **Workflow:** `full-sdlc`, `epic-batches`, `emergency-debug`
- **Type:** `bug`, `feature`, `enhancement`, `refactor`
- **Status:** `phase-sdlc-implement`, `blocked`, `escalate-to-swarm`

### Epic

Large work item containing multiple related subtasks. Parent for coordinated work across team/sprints.

- **Related:** Task, subtask, hierarchy
- **Structure:** Epic → Tasks → Subtasks

### Sprint

Time-boxed iteration (typically 2 weeks). Groups tasks, defines delivery goals, measures velocity.

- **Related:** Iteration, planning, retrospective
- **Artifacts:** Sprint backlog, sprint board

### Beads Auto-Detection

Automatic Beads integration based on `.beads/` directory presence. When directory exists, IDE hooks auto-load beads context.

- **Trigger:** `.beads/` directory exists
- **Setup:** Run `bd init` to create directory
- **Related:** Integration, automation
- **Auto-sync:** When active, `bd sync` auto-triggers post-commit

---

## Code Quality & Validation

### Quality Gates

Mandatory pre-commit validation: ESLint, TypeScript, Vitest, coverage, security scan, build check.

- **Command:** `npm run quality:gates`
- **Required:** Pass before commit
- **Enforced:** Via Husky pre-commit hook
- **Coverage:** Must be >80%

### Husky

Git hooks automation framework. Runs quality gates before commit/push. Cannot be bypassed with `--no-verify` per team rules.

- **Related:** Quality gates, automation, CI/CD
- **Config:** `.husky/` directory

### ESLint

Static code analyzer for JavaScript/TypeScript. Enforces style, catches errors. Auto-fixable issues fixed before commit.

- **Related:** Code quality, style, linting
- **Config:** `.eslintrc.cjs`

### Vitest

Fast unit test framework (replacement for Jest). Runs in watch mode during development, full suite pre-commit.

- **Related:** Testing, quality, coverage
- **Command:** `npm run test`

### TypeScript

Strict type checking (5.5). Catches type errors compile-time. Core to codebase safety.

- **Related:** Type safety, quality, tooling
- **Check:** `npm run type-check`

### Snyk

Security vulnerability scanner. SAST (code scanning) + SCA (dependency checking). Required for production code.

- **Related:** Security, DevSecOps, compliance
- **Commands:** `snyk_code_scan`, `snyk_sca_scan`
- **See:** MCP-GUIDE.md

---

## Git & Version Control

### Git Commit

Atomic unit of change with message. Follows conventional format: `type(scope): description`

- **Format:** `feat(auth): add OAuth 2.0 support`
- **Related:** Version control, change tracking
- **Must pass:** Quality gates before commit

### Git Diff

Detailed change listing showing additions/deletions by file. Used in code review and impact analysis.

- **Related:** Change review, scope analysis
- **Command:** `git diff`, `git diff --staged`

### Git Branch

Isolated development line. Feature branches prevent conflicts. Main branch is production.

- **Related:** Workflow, isolation, merging
- **Naming:** `feature/`, `bugfix/`, `refactor/`

### Feature Branch

Temporary branch for implementing feature. Merged via PR after review.

- **Related:** Git branch, pull request, workflow
- **Prefix:** `feature/stage-3-improve-config`

### Pull Request (PR)

Formal code review mechanism. Changes must pass gates + human review before merge to main.

- **Related:** Code review, integration, quality
- **Required:** All changes via PR, never direct push to main

### Conventional Commits

Standardized commit message format enabling automated changelog generation.

- **Format:** `type(scope): description [body] [footer]`
- **Types:** `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `style`, `chore`

---

## Architecture & Design

### FSD Architecture (Feature-Sliced Design)

Codebase organization by feature slice, not by layer. Each slice is independent, composable.

- **Structure:** `app/`, `pages/`, `widgets/`, `shared/`
- **Related:** Project structure, layering, modularity
- **Benefit:** Easy feature isolation and team parallelization

### MSW (Mock Service Worker)

Browser API mocking for testing without real backend. Intercepts network calls, returns mock responses.

- **Related:** Testing, mocking, development
- **Config:** `src/mocks/` directory
- **See:** 004-msw-mocking.md ADR

### API Generation (Orval)

Automatic TypeScript type generation from OpenAPI spec. Eliminates manual type definitions, keeps sync.

- **Command:** `npm run codegen`
- **Related:** Type safety, automation, API integration
- **Files:** Generated into `src/shared/api/generated/`

### Ant Design 5

Enterprise React component library. Primary UI framework for Customer Portal.

- **Related:** UI, components, styling
- **Theme:** Customizable via token system

### Styled Components

CSS-in-JS styling library. Component-scoped styles, dynamic theming support.

- **Related:** Styling, CSS, component architecture

### TanStack Query 5

Data fetching & caching library. Replaces Redux for server state. Handles loading, errors, invalidation.

- **Related:** State management, data fetching, caching
- **Version:** 5.x with hooks-based API

### Zustand 5

Lightweight state management for client state. Simple API, no boilerplate.

- **Related:** State management, client state
- **When:** For theme, UI state (not server data)

---

## Token & Context Management

### Token

Atomic unit of text processing. Roughly 4 characters or 0.75 words. Determines API costs.

- **Related:** Cost, context window, efficiency
- **Budget:** 200K per session
- **Tracking:** Monitor in IDE

### Token Budget

Allocation of tokens for session work. 200K total, distributed across conversation/tools/results.

- **Related:** Efficiency, planning, constraints
- **Allocation:** 140K work, 20K tools, 25K reserve, 15K overhead

### Context Window

Total available tokens per session. Cannot exceed 200K. Session ends at limit.

- **Related:** Token budget, session lifecycle
- **Capacity:** 200,000 tokens (Haiku 4.5)

### Compaction (Token Optimization)

Summarizing conversation history to free tokens. Typical savings: 15-25K tokens.

- **Command:** `/compact`
- **Use:** Every 40-50 exchanges or when <80K remaining
- **Impact:** Response time improves after compaction

### Token Awareness

Monitoring token usage to stay within budget. Key to extended sessions without restart.

- **Related:** Efficiency, planning
- **Threshold:** Alert at 150K, urgent at 170K

---

## Team & Organizational

### Sprint

2-week iteration cycle. Contains planned work, daily standups, end-of-sprint review.

- **Related:** Planning, delivery, rhythm
- **Artifacts:** Backlog, board, retro notes

### Standups

15-minute daily synchronization. Share progress, blockers, plans.

- **Related:** Communication, alignment
- **Format:** "Yesterday, today, blockers"

### Code Review

Human validation of code changes before merge. Checks quality, security, architecture alignment.

- **Related:** Quality, collaboration, learning
- **Process:** PR → review → approval → merge

### Tech Lead

Senior engineer responsible for architecture, decisions, escalations.

- **Related:** Leadership, decisions, approval
- **Authority:** Architecture review, QA exceptions

### Knowledge Base

Shared documentation of patterns, decisions, learnings. Lives in memory banks and doc files.

- **Related:** Learning, reuse, documentation
- **Tools:** Hindsight memory, ADR files, guides

### Oncall

Scheduled responsibility for production support. Monitors alerts, handles incidents.

- **Related:** Operations, reliability
- **Escalation:** P0 = swarm debug

---

## Model & AI Concepts

### Opus

Claude 3.5 Opus. Most capable model. Used for:

- Architecture decisions
- Deep analysis
- Security review
- Complex reasoning
- Expensive operations (15-25K tokens typical)

### Sonnet

Claude 3.5 Sonnet. Balanced capability/speed. Used for:

- Implementation
- Planning
- Testing
- Standard analysis

### Haiku

Claude 3.5 Haiku. Fastest, most economical. Used for:

- Quick analysis
- Routine operations
- Token-constrained work

### PAL (Opus Assistant Layer)

External model access (GPT-5, GLM-4.7). Used via MCP for:

- Routine second opinions (use Sonnet for efficiency)
- External perspectives
- NOT for critical decisions (use Opus directly)

### Cursor Agent

Autonomous implementation mode in Cursor. Works without pausing, rapid iteration.

- **Related:** Automode, implementation
- **Use:** Implementation phase work

### Model Switching

Changing active model mid-session. Useful when moving between work phases.

- **Command:** `/model opus`, `/model sonnet`, `/model haiku`

---

## Architecture Decision Records

### ADR (Architecture Decision Record)

Formal documentation of significant technical decisions, rationale, alternatives considered.

- **Location:** `docs/architecture/adr/`
- **Format:** Markdown with context, decision, consequences
- **Related:** Documentation, decisions, knowledge

### Decision Log

Running record of technical decisions made during project. Enables understanding and avoiding repeats.

- **Related:** Knowledge, history, patterns
- **Tool:** Memory banks, `reflect` operation

---

## Security & Compliance

### Secrets Management

Environment variables for sensitive data (API keys, tokens, credentials). Never hardcoded.

- **Related:** Security, environment, configuration
- **File:** `.env.local`, `.env.development.local`
- **Rule:** NEVER commit secrets

### Authentication

User identity verification. OAuth 2.0 for social login, JWT for token-based auth.

- **Related:** Security, user management

### Authorization

Permission/role checking after authentication. Determines what user can access.

- **Related:** Security, access control

### API Security

Protecting API endpoints from unauthorized access, injection attacks, data exposure.

- **Related:** Backend, security, validation

---

## Performance & Optimization

### Bundle Size

Total JavaScript/CSS delivered to browser. Target: <300KB gzipped main bundle.

- **Related:** Performance, delivery, user experience
- **Tool:** `npm run analyze`

### Lazy Loading

Deferred loading of code/components until needed. Reduces initial bundle.

- **Related:** Performance, user experience
- **Implementation:** React.lazy, code splitting

### Caching Strategy

Rules for when data expires and requires refresh. Critical for performance, data freshness trade-off.

- **Related:** Performance, TanStack Query
- **Strategies:** Time-based, event-based, manual

### Performance Testing

Load testing to validate system behavior under stress. Critical for production-bound features.

- **Related:** QA, reliability, capacity planning
- **Tool:** Load test frameworks, Snyk performance

---

## Related Documentation

All terms link to detailed guides:

- **CLAUDE.md** - Commands, configuration
- **SESSION-PROTOCOL.md** - Session workflow
- **SDLC-WORKFLOW.md** - Phase details
- **Advanced-Workflows.md** - Orchestration
- **Token-Optimization.md** - Efficiency
- **Keyboard-Shortcuts.md** - Commands
- **FAQ.md** - Common questions
- **MCP-GUIDE.md** - Tools
- **Model-Capabilities.md** - Model details
- **TROUBLESHOOTING.md** - Problem solving

---

## How to Use This Glossary

1. **Search** Ctrl+F for unfamiliar terms
2. **Follow links** to related documentation
3. **Add new terms** when encountering undefined concepts
4. **Cross-reference** with other guides for detailed information

This glossary ensures shared understanding across the team and documentation.
