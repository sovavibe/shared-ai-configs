# Feature Parity Matrix: Claude Code vs Cursor

> **Purpose:** Quick reference for feature availability across both IDEs. Use this to understand capability differences and plan IDE selection.

> **Scope:** All SDLC commands, MCP tools, model switching, quality gates, and advanced features.

---

## Quick Reference: At a Glance

| Feature Category | Claude Code | Cursor | Notes |
|------------------|-------------|--------|-------|
| **IDE Type** | Agent-based, chat-first | Editor-focused, code-first | Claude Code: thinking mode; Cursor: implementation mode |
| **Best For** | Analysis, architecture, review | Coding, iteration, speed | Complementary strengths |
| **Primary Model** | Opus (analysis) | Agent mode (automode) | Can switch models in Claude Code |
| **Context Awareness** | Multi-session (Hindsight) | Single session | Claude Code remembers across days |
| **Iteration Speed** | Medium (structured) | Fast (reflexive) | Cursor wins on repetitive tasks |
| **Code Generation** | Structured, documented | Fast, inline | Cursor generates 2-3x faster |

---

## SDLC Commands Matrix

| Command | Claude Code | Cursor | Usage | Model | Phase |
|---------|-------------|--------|-------|-------|-------|
| **/analyze** | ✅ Full | ⚠️ Manual | Break down requirements | Opus | Analyze |
| **/architect** | ✅ Full | ⚠️ Manual | Design systems | Opus | Architect |
| **/plan** | ✅ Full | ⚠️ Manual | Create task breakdown | Sonnet | Plan |
| **/implement** | ❌ N/A | ✅ Full | Write code with context | Agent | Implement |
| **/review** | ✅ Full (Snyk) | ⚠️ Manual | Quality gates + security | Opus | Review |
| **/test** | ✅ Available | ⚠️ Manual | Test generation/validation | Sonnet | Test |
| **/debug** | ✅ Full (via PAL) | ❌ Manual | Root cause analysis | Opus | Debug |

**Key:**

- ✅ Full = Native command with full features
- ⚠️ Manual = Can do it but requires manual steps
- ❌ N/A = Not applicable to IDE's use case

**Why Cursor Doesn't Have Slash Commands:**

- Cursor uses `/` for command palette (built-in VS Code feature)
- Cursor focus: implementation, not SDLC coordination
- You perform steps manually but faster than Claude Code planning

---

## Model Availability & Switching

### Claude Code: Full Model Access

| Model | Availability | Speed | Use Case | Context |
|-------|--------------|-------|----------|---------|
| **Opus** | Native | Slowest | Critical analysis, deep decisions | 200K context |
| **Sonnet** | `/model sonnet` | Medium | Planning, standard code | 200K context |
| **Haiku** | `/model haiku` | Fastest | Quick research, fast iteration | 100K context |
| **Reflect** | `reflect` | Fast | Synthesize across sessions | Hindsight memory |

**Model Strategy:**

- Start with Opus for complex decisions
- Switch to Sonnet for planning
- Use Haiku for quick iterations
- Use Reflect for cross-session synthesis

### Cursor: Unified Agent Mode

| Model | Availability | Behavior | Use Case | Context |
|-------|--------------|----------|----------|---------|
| **Agent Mode** | Native | Auto-selects best model | Code generation, iteration | 120K context |
| **Automode** | ✅ Advanced | Continuous non-stop execution | Repetitive tasks, batch operations | Same session |
| **Manual Mode** | ✅ Standard | User-controlled interactions | Complex decisions, exploration | Same session |

**Model Strategy:**

- Use Agent mode (default) for implementation
- Enable Automode for repetitive tasks (tests, refactoring)
- Manual mode when you need step-by-step control

**Why Different?**

- Cursor optimized for code generation speed
- Claude Code optimized for reasoning depth
- Complementary, not competitive

---

## MCP Tools: Availability & Access

### Hindsight Memory System

| Feature | Claude Code | Cursor | Purpose |
|---------|-------------|--------|---------|
| **recall** | ✅ `mcp__hindsight-alice__recall` | ❌ Not available | Retrieve past context |
| **reflect** | ✅ `mcp__hindsight-alice__reflect` | ❌ Not available | Synthesize across sessions |
| **retain** | ✅ `mcp__hindsight-alice__retain` | ❌ Not available | Save decisions for future |
| **Multi-session context** | ✅ Full | ❌ Single session | Remember across days |

**Implication:** Use Claude Code for complex analysis that benefits from history. Use Cursor for implementation tasks that don't need historical context.

### Context7: Library Documentation

| Feature | Claude Code | Cursor | Purpose |
|---------|-------------|--------|---------|
| **resolve-library-id** | ✅ Full | ✅ Full (via MCP Docker) | Look up library IDs |
| **get-library-docs** | ✅ Full | ✅ Full (via MCP Docker) | Fetch official docs |
| **Coverage** | 500+ libraries | 500+ libraries | Same documentation source |
| **Performance** | Medium (50-150K tokens) | Fast (<20K tokens) | Cursor's smaller context = faster lookup |

**Implication:** Use Context7 in either IDE. Claude Code for detailed research, Cursor for quick lookups.

### Beads: Task Management

| Feature | Claude Code | Cursor | Purpose |
|---------|-------------|--------|---------|
| **bd ready** | ✅ Auto + manual | ✅ Auto + manual | Load available tasks |
| **bd create** | ✅ Full | ✅ Full | Create new issues |
| **bd update** | ✅ Full | ✅ Full | Update issue status |
| **bd close** | ✅ Full | ✅ Full | Complete tasks |
| **bd sync --flush-only** | ✅ Critical | ✅ Critical | Export to JSONL |
| **Auto sync on session end** | ✅ Hook-based | ❌ Manual | Automatic export |

**Implication:** Both IDEs equal for Beads. Claude Code auto-syncs, Cursor requires manual sync.

### Snyk: Security Scanning

| Feature | Claude Code | Cursor | Purpose |
|---------|-------------|--------|---------|
| **snyk_code_scan** | ✅ Full | ✅ Full | SAST analysis |
| **snyk_sca_scan** | ✅ Full | ✅ Full | Dependency scanning |
| **snyk_container_scan** | ✅ Full | ✅ Full | Container security |
| **Integration with /review** | ✅ Auto | ⚠️ Manual | Automatic security checks |

**Implication:** Use Claude Code's /review for automated security. Cursor can scan but requires manual command.

### PAL Tools: External Models

| Feature | Claude Code | Cursor | Purpose |
|---------|-------------|--------|---------|
| **thinkdeep** | ✅ GLM-4.7 | ⚠️ Limited | Complex problem analysis |
| **chat** | ✅ Multiple models | ⚠️ Limited | External model consultation |
| **consensus** | ✅ Multi-model | ❌ N/A | Get multiple expert opinions |

**Implication:** Claude Code has richer external model access. Cursor limited to basic PAL calls.

### WebSearch & Fetch

| Feature | Claude Code | Cursor | Purpose |
|---------|-------------|--------|---------|
| **WebSearch** | ✅ Configured | ✅ Configured | Find current information |
| **WebFetch** | ✅ Configured | ✅ Configured | Retrieve web content |
| **Performance** | Medium (uses context) | Fast (compact) | Same capability, different speed |

**Implication:** Both can research. Claude Code good for deep research, Cursor for quick lookups.

---

## Quality Gates & Automation

### Pre-Commit Hooks

| Gate | Claude Code | Cursor | Enforcement | Recovery |
|------|-------------|--------|-------------|----------|
| **ESLint** | Auto validated | Auto validated | `npm run lint` | Fix in IDE, re-run |
| **TypeScript** | Auto validated | Auto validated | `npm run type-check` | Fix in IDE, re-run |
| **Tests** | Optional check | Optional check | `npm run test` | Fix in IDE, re-run |
| **Secretlint** | ✅ Enforced | ✅ Enforced | `npm run secretlint` | Remove secrets, re-run |
| **Quality Gates** | ✅ Enforced | ✅ Enforced | `npm run quality:gates` | Fix all, re-run |

**Both IDEs:** Must pass all gates before commit. No `--no-verify` allowed.

### Automated Post-Review

| Feature | Claude Code | Cursor | Purpose |
|---------|-------------|--------|---------|
| **Snyk auto-scan** | ✅ In /review | ⚠️ Manual trigger | Security before approval |
| **Architecture check** | ✅ In /review | ⚠️ Manual check | Verify design decisions |
| **Bug bead creation** | ✅ Auto | ⚠️ Manual | Track issues from review |
| **GitLab MR comments** | ✅ Auto-post | ⚠️ Manual copy-paste | PR feedback |

**Implication:** Use Claude Code for automated review gate. Cursor requires manual verification steps.

---

## Advanced Features: Orchestration & Memory

### Perles: Multi-Agent Orchestration

| Workflow | Claude Code | Cursor | When to Use |
|----------|-------------|--------|------------|
| **Interactive SDLC** | ✅ Full | ❌ N/A | From idea → full SDLC |
| **Full SDLC Cycle** | ✅ Full | ❌ N/A | Analyze → Review cycle |
| **Epic Batches** | ✅ Full | ❌ N/A | Parallel task execution |
| **Single agent** | ✅ Available | ✅ Default | Routine tasks |

**Implication:** Perles is Claude Code-only for complex multi-phase work. Cursor for individual phases.

### Skills System

| Feature | Claude Code | Cursor | Purpose |
|---------|-------------|--------|---------|
| **react-best-practices** | ✅ Loaded | ✅ Loaded | Code quality checking |
| **tdd-workflow** | ✅ Loaded | ✅ Loaded | Test-driven development |
| **token-optimization** | ✅ Loaded | ✅ Loaded | Reduce context usage |
| **Custom skills** | ✅ Can create | ✅ Can create | Domain-specific patterns |

**Both IDEs:** Skills auto-loaded and available for code analysis/suggestions.

### Specification-Driven Development (SDD)

| Feature | Claude Code | Cursor | Purpose |
|---------|-------------|--------|---------|
| **Write specs first** | ✅ Recommended | ⚠️ Possible | Binding contracts |
| **Verify implementation** | ✅ In /review | ⚠️ Manual | Check against spec |
| **Spec generation** | ✅ In /architect | ⚠️ Requires manual | Create design docs |

**Implication:** Claude Code supports SDD workflow natively. Cursor requires manual spec checking.

### Verification Swarms (3-Agent Review)

| Component | Claude Code | Cursor | Role |
|-----------|-------------|--------|------|
| **Coder Agent** | ✅ Included | ⚠️ Manual | Code quality |
| **Security Agent** | ✅ Included (Snyk) | ⚠️ Manual trigger | Security check |
| **Architecture Agent** | ✅ Included | ⚠️ Manual | Design validation |

**Implication:** Claude Code's /review includes all 3 agents. Cursor needs manual execution.

---

## Integration Points Comparison

### GitLab Integration

| Feature | Claude Code | Cursor | Purpose |
|---------|-------------|--------|---------|
| **View MR details** | ✅ Full | ✅ Full | Understand PR context |
| **Post MR comments** | ✅ Auto-reply | ✅ Full (6 commands) | Provide feedback |
| **Create issues** | ✅ Full | ✅ Full | Track bugs from review |
| **Update MR status** | ✅ Full | ✅ Full | Approve or request changes |

**Parity:** Both handle GitLab well. Claude Code auto-posts, Cursor uses manual commands.

### Jira Sync

| Feature | Claude Code | Cursor | Purpose |
|---------|-------------|--------|---------|
| **View issues** | ✅ Via Beads | ✅ Via Beads | Understand tasks |
| **Update status** | ✅ Via Beads | ✅ Via Beads | Mark progress |
| **Link to Beads** | ✅ Native | ✅ Native | Sync across systems |

**Parity:** Both equal. Beads is the sync layer.

### GitHub Integration

| Feature | Claude Code | Cursor | Purpose |
|---------|-------------|--------|---------|
| **Search repo** | ✅ zread MCP | ✅ zread MCP | Find files/issues |
| **Read files** | ✅ zread MCP | ✅ zread MCP | Reference external code |

**Parity:** Both equal via MCP.

---

## Feature Summary: When to Use Each IDE

### Use **Claude Code** When You Need

✅ Deep analysis and reasoning
✅ Multi-session context (Hindsight)
✅ Architecture decisions
✅ Code review with security (Snyk + Opus)
✅ Complex debugging
✅ Model switching (Opus → Sonnet → Haiku)
✅ Perles orchestration (multi-agent SDLC)
✅ Specification-driven development

**Typical Session:** 1-2 hours, fewer iterations, more thinking

### Use **Cursor** When You Need

✅ Fast code generation
✅ Quick iterations
✅ Automode for repetitive tasks
✅ Test generation at speed
✅ Inline code editing
✅ Familiar IDE experience
✅ Single-phase focused work

**Typical Session:** 30 minutes - 1 hour, many iterations, rapid feedback

---

## Command Reference: Quick Lookup

### Claude Code: Slash Commands

```bash
/analyze "request"    # Break down requirements (Opus)
/architect beads-123  # Design system (Opus)
/plan beads-123       # Create task breakdown (Sonnet)
/review               # Quality review + Snyk (Opus)
/model sonnet         # Switch to Sonnet
/model haiku          # Switch to Haiku
/compact              # Reduce context size
/rename task-name     # Name current session
```

### Claude Code: MCP Commands

```bash
mcp__hindsight-alice__recall "context"      # Retrieve past sessions
mcp__hindsight-alice__retain "decision"     # Save for future
mcp__Snyk__snyk_code_scan --path "src/"     # Security scan
mcp__MCP_DOCKER__resolve-library-id "lib"   # Look up library
mcp__web-search-prime__webSearchPrime "q"   # Search web
```

### Cursor: Native Commands

```bash
Cmd+Shift+P  # Command palette (all IDE commands)
Cmd+/        # Toggle comment
Cmd+B        # Toggle sidebar
Cmd+J        # Toggle terminal
Tab          # Accept Cursor suggestions
Escape       # Dismiss Cursor suggestions
```

### Cursor: Slash Commands (Agent Mode)

```bash
@file         # Reference specific file
@workspace    # Reference entire workspace
#keyword      # Search in codebase
/debug        # Debug assistant
/test         # Test generation
```

---

## Capability Gaps & Workarounds

| Missing Capability | IDE | Workaround | Impact |
|------------------|-----|-----------|--------|
| Single-session memory in Claude Code | Cursor | Copy context manually | +5 min setup |
| Automated /review in Cursor | Cursor | Run Snyk manually | +10 min overhead |
| Multi-agent orchestration in Cursor | Cursor | Switch to Claude Code | Requires handoff |
| Hindsight memory in Cursor | Cursor | Use context-handoff.md | Requires manual doc |
| Interactive SDLC in Cursor | Cursor | Use Claude Code | Requires handoff |

---

## Feature Maturity Levels

| Feature | Claude Code | Cursor | Maturity | Production Ready |
|---------|-------------|--------|----------|------------------|
| SDLC commands | GA | N/A | Stable | ✅ Yes |
| Hindsight memory | GA | N/A | Stable | ✅ Yes |
| Perles orchestration | EA | N/A | Experimental | ⚠️ Complex tasks only |
| Skills system | Beta | Beta | Evolving | ⚠️ Validate per skill |
| SDD patterns | Beta | N/A | New | ⚠️ New teams only |
| Verification swarms | EA | N/A | Experimental | ⚠️ Critical review only |

---

## Next Steps

- **See:** IDE Decision Flowchart for when to use each IDE
- **See:** Context Handoff Protocol for safe IDE transitions
- **See:** Role-Based Quick Starts for your role-specific guide
- **See:** Troubleshooting Guide for common problems

---

**Remember:** This matrix changes as tools evolve. Check back monthly for updates. Last updated: January 2026.

🎯 **Quick Rule:** Feature not in your IDE? → Check if other IDE has it → Use handoff protocol to switch.
