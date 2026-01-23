# Frequently Asked Questions

**Last Updated:** 2026-01-21
**Audience:** All developers
**Format:** Organized by category with quick answers and links

---

## Getting Started

### Q: How do I start using Claude Code?

**A:**

1. Install: `npm install -g claude-code`
2. Navigate to project: `cd /Users/ap/work/Front`
3. Run: `claude`
4. Start asking questions in the chat interface

**See:** Session-Protocol.md → Session Initialization

---

### Q: What's the difference between Claude Code and Cursor?

**A:**

- **Claude Code:** Deep analysis, architecture, Opus access, MCP integration, long-form planning
- **Cursor:** Fast implementation, Agent mode, live code editing, instant feedback

**Best practice:** Claude Code for thinking, Cursor for doing (dual-IDE workflow)

**See:** Advanced-Workflows.md → Dual-IDE Workflow

---

### Q: How do I resume a previous session?

**A:**

```bash
claude --resume "Session Name"  # By name
claude --continue               # Most recent
```

Context auto-loads via session-start hook.

**See:** Session-Protocol.md → Session Lifecycle

---

### Q: What happens if I close Claude Code without saving?

**A:**

- Chat history saved (can resume with `--continue`)
- Uncommitted code changes NOT saved (save manually first)
- Memory banks persist (auto-loaded on resume)

**Recommendation:** Always `git commit` before closing.

---

## Beads & Task Management

### Q: What is Beads and why use it?

**A:**
Beads is AI-integrated task tracking that syncs work between your IDE and the team. Every task can:

- Auto-create subtasks
- Track dependencies
- Export to JSONL for team visibility
- Auto-close when work completes

**Enable:** Auto-detects when `.beads/` directory exists (run `bd init` to create)

**See:** CLAUDE.md → Task Management

---

### Q: How do I claim a task?

**A:**

```bash
bd ready                                    # List available tasks
bd update <task-id> --status=in_progress   # Claim it
```

**See:** CLAUDE.md → Workflow Commands

---

### Q: Can I see what my teammates are working on?

**A:**

```bash
bd ready --all  # All tasks (not just yours)
bd show <id> --include-assignee  # See who's working
```

**Shared visibility:** `issues.jsonl` file in repo

---

### Q: How do I create a task from Claude Code?

**A:**

```bash
bd create --type=task --title="Add dark mode" --priority=high
```

Or let AI create tasks during SDLC phases (Perles orchestration).

**See:** CLAUDE.md → Beads Integration

---

## Quality & Testing

### Q: What are quality gates?

**A:**
Automated checks that MUST pass before commit:

1. ESLint (code style)
2. TypeScript (type checking)
3. Vitest (unit tests, >80% coverage)
4. Build validation
5. Security scan (Snyk)

**Command:** `npm run quality:gates`

**See:** CLAUDE.md → Quality Gates

---

### Q: How do I fix ESLint errors?

**A:**

```bash
npm run lint -- --fix  # Auto-fix common issues
# Remaining errors need manual fixes
```

**See:** Troubleshooting.md → ESLint Issues

---

### Q: Can I skip quality gates with --no-verify?

**A:**
**NO.** Team rules prohibit bypassing gates. Reason: Maintains code quality, prevents technical debt.

**If gates fail:** Fix the issues, re-run gates, then commit.

**See:** CLAUDE.md → CRITICAL Rules

---

### Q: How do I write tests that pass coverage requirements?

**A:**

1. Target >80% coverage (enforced)
2. Test happy path + error cases
3. Use `npm run test -- --watch` during development

**Tool:** Vitest with coverage reporting

**See:** SDLC-Workflow.md → Test Phase

---

### Q: My tests are failing on CI but pass locally. Why?

**A:**
Common causes:

1. Race conditions (async timing)
2. Environment differences (.env vars)
3. File system path issues
4. Cache not cleared

**Debug:** Check CI logs, replicate locally with `npm run test -- --run` (non-watch mode)

**See:** Troubleshooting.md → CI Failures

---

## Git & Commits

### Q: What's the proper commit message format?

**A:**
Conventional Commits format:

```
type(scope): description

type: feat|fix|refactor|perf|test|docs|style|chore
scope: component/feature name
description: what changed and why (imperative)

Example: feat(auth): add OAuth 2.0 social login
```

**See:** SDLC-Workflow.md → Commit Standards

---

### Q: Should I commit frequently or batch changes?

**A:**
**Commit frequently** (every 15-30 min). Benefits:

- Easier to revert if needed
- Better history for debugging
- Cleaner responsibility
- Smaller PR reviews

Each commit must pass quality gates.

---

### Q: How do I write a good PR description?

**A:**

```markdown
## Summary
- What changed and why
- 2-3 bullet points

## Related Issues
- Closes #123
- Related to #456

## Testing
- [ ] Feature works locally
- [ ] Tests pass
- [ ] No console errors
```

**See:** SDLC-Workflow.md → PR Guidelines

---

### Q: Can I force push to main?

**A:**
**NO.** Direct push to main is disabled. Always use:

1. Feature branch
2. PR with review
3. Merge via GitHub UI

**See:** CLAUDE.md → Git Workflow

---

## Sessions & Tokens

### Q: How many tokens do I have per session?

**A:**
**200,000 tokens** in Haiku 4.5 context window.

**Allocation guide:**

- 5K overhead
- 20K MCP operations
- 140K active work
- 25K reserve

When approaching 150K, prepare to end session.

**See:** Token-Optimization.md → Budget Allocation

---

### Q: What should I do when I run out of tokens?

**A:**

1. Use `/compact` (saves 15-25K tokens)
2. Save context: `mcp__hindsight-alice__retain "Progress: {summary}"`
3. Commit work: `npm run quality:gates && git commit`
4. End session: `/exit`
5. Resume: `claude --continue` (context auto-loads)

**See:** Token-Optimization.md → Session Lifecycle

---

### Q: How do I save important decisions for next session?

**A:**

```bash
mcp__hindsight-alice__retain "Architecture decision: We chose X because Y"
```

When you resume:

```bash
mcp__hindsight-alice__recall "architecture decisions"
```

**See:** MCP-Guide.md → Memory Operations

---

### Q: Can I use `/compact` multiple times?

**A:**
Yes! Recommended every 40-50 exchanges:

1. First use: saves 15-25K
2. Subsequent: saves 8-12K each

**When to use:**

- After 60+ exchanges
- When response time slows (>10 sec)
- Before large operations

**See:** Token-Optimization.md → Compaction

---

## Models & Capabilities

### Q: When should I use Opus vs Sonnet vs Haiku?

**A:**

| Model | When | Cost | Speed |
|-------|------|------|-------|
| **Opus** | Architecture, deep analysis, code review | High | Slow |
| **Sonnet** | Implementation, planning, standard work | Medium | Medium |
| **Haiku** | Quick analysis, routine operations | Low | Fast |

**Rule of thumb:** Opus for critical decisions, Sonnet for implementation, Haiku for quick stuff.

**See:** Model-Capabilities.md → Comparison

---

### Q: Can I switch models mid-session?

**A:**
Yes:

```bash
/model opus   # Switch to Opus
/model sonnet # Switch to Sonnet
/model haiku  # Switch to Haiku
```

Useful when moving between work phases.

**See:** CLAUDE.md → Model Switching

---

### Q: What's the difference between Claude Code Opus and Claude Code Sonnet?

**A:**
Same models as API, accessed locally. Difference:

- **Opus:** Deeper reasoning, better architecture, longer processing
- **Sonnet:** Balanced capability/speed, faster responses

**Cost is API-based** (not local), both available in Code.

---

### Q: Should I use PAL tools (external models)?

**A:**
Use PAL for routine second opinions only:

- ✅ Quick research
- ✅ Alternative perspectives
- ❌ Critical decisions (use Opus directly)
- ❌ Architecture (use Opus directly)
- ❌ Security (use Opus directly)

**See:** CLAUDE.md → PAL Priority

---

## Workflows & Orchestration

### Q: What's the difference between SDLC and Perles?

**A:**

- **SDLC:** 6-phase process (analyze → architect → plan → implement → test → review)
- **Perles:** Orchestration TUI that automates SDLC phases and coordinates multiple agents

**Use Perles when:** Complex multi-phase work, team coordination, parallel execution needed.

**See:** Advanced-Workflows.md → Perles Framework

---

### Q: How do I trigger the full SDLC workflow?

**A:**

```bash
# 1. Create task or epic
bd create --type=task --title="New feature"

# 2. Add label (note the ID, e.g., VP-task-123)
bd update VP-task-123 --labels="full-sdlc"

# 3. Open Perles to monitor
perles
```

Expect 5-6 hours, 60-85K tokens for complete feature.

**See:** Advanced-Workflows.md → Full SDLC

---

### Q: Can multiple developers work on the same epic?

**A:**
Yes! Use **Epic Batches** workflow:

```bash
bd update VP-epic-456 --labels="epic-batches"
```

Orchestrates up to 5 parallel workers on independent subtasks.

**Speedup:** 4-5x faster than sequential work.

**See:** Advanced-Workflows.md → Epic Batches

---

### Q: What's a verification swarm and when should I use it?

**A:**
5 AI specialists investigate production bugs simultaneously:

- Root Cause hunter
- Regression detective
- Integration auditor
- Performance profiler
- Security validator

**Use when:** P0 bug, unknown root cause, complex diagnosis needed.

**Result:** 15 minutes to diagnosis vs 2-3 hours solo.

**See:** Advanced-Workflows.md → Verification Swarm

---

## MCP & Tools

### Q: How do I know if MCP tools are working?

**A:**

```bash
/mcp  # Health check all MCP servers
```

If issues:

1. Check network connectivity
2. Restart Claude Code
3. Verify MCP configuration

**See:** MCP-Guide.md → Health Check

---

### Q: What MCP tools can I use?

**A:**
Primary tools:

- **Memory:** hindsight-alice (recall, retain, reflect)
- **Docs:** Context7 (library documentation)
- **Tasks:** Beads (task management)
- **Security:** Snyk (code/dependency scanning)
- **Jira:** Issue creation, searching
- **Confluence:** Wiki access

**See:** MCP-Guide.md → Available Tools

---

### Q: How do I resolve a library ID for documentation?

**A:**

```bash
mcp__MCP_DOCKER__resolve-library-id "tanstack query"
# Returns: /tanstack/query

# Then fetch docs:
mcp__MCP_DOCKER__get-library-docs "/tanstack/query" --tokens=10000
```

**See:** MCP-Guide.md → Library Documentation

---

### Q: How do I run Snyk security scans?

**A:**

```bash
# Code scan (SAST)
mcp__Snyk__snyk_code_scan --path "/Users/ap/work/Front/src"

# Dependency scan (SCA)
mcp__Snyk__snyk_sca_scan --path "/Users/ap/work/Front"
```

Results show vulnerabilities with severity + fix guidance.

**See:** MCP-Guide.md → Snyk Integration

---

## Troubleshooting

### Q: Claude Code won't start. What do I do?

**A:**

```bash
# 1. Check installation
which claude

# 2. Verify Node.js version
node --version  # Need 18+

# 3. Update Claude Code
npm install -g claude-code --latest

# 4. Try again
cd /Users/ap/work/Front
claude
```

**See:** Troubleshooting.md → Startup Issues

---

### Q: Quality gates fail and I don't know why

**A:**

```bash
# 1. Check specific failure
npm run quality:gates

# 2. Auto-fix linting
npm run lint -- --fix

# 3. Check types
npm run type-check

# 4. Run tests
npm run test

# Fix remaining issues manually, re-run gates
```

**See:** Troubleshooting.md → Quality Gate Failures

---

### Q: Vitest coverage is low (60% instead of 80%+)

**A:**

```bash
# See what's not covered
npm run test -- --coverage

# Analyze results:
# 1. Add tests for untested lines
# 2. Focus on critical paths first
# 3. Use Sonnet to help write tests

# Re-run:
npm run quality:gates
```

**See:** SDLC-Workflow.md → Test Phase

---

### Q: I accidentally committed secrets. What do I do?

**A:**

1. **IMMEDIATELY:** Rotate the secret (invalidate API key)
2. Remove from commit:

   ```bash
   git rebase -i HEAD~1  # Edit commit
   ```

3. Force push (this time only, team approves):

   ```bash
   git push --force-with-lease
   ```

**Prevention:** Use `.env.local` (gitignored), never hardcode.

**See:** CLAUDE.md → Secrets Management

---

### Q: My session keeps running out of tokens

**A:**

1. Use `/compact` every 30-40 exchanges (saves 15-25K)
2. Load docs once, reuse (don't re-request)
3. Use targeted Grep instead of broad file reads
4. Batch similar operations

**See:** Token-Optimization.md → Optimization Techniques

---

### Q: Cursor Agent keeps making syntax errors

**A:**

1. Check file format (TypeScript vs JavaScript)
2. Verify tsconfig.json is correct
3. Run tests to catch errors:

   ```bash
   npm run test -- --watch
   ```

4. Fix errors, let Agent learn from corrections

**See:** Troubleshooting.md → Cursor Issues

---

## Team & Collaboration

### Q: How do I review a teammate's PR?

**A:**

1. Read the PR description (what changed and why)
2. Review code changes (logic, style, tests)
3. Run locally: `git fetch && git checkout <branch> && npm install && npm run test`
4. Comment on specific lines
5. Approve or request changes

**See:** SDLC-Workflow.md → Code Review

---

### Q: What should I do if my work blocks a teammate?

**A:**

1. Mark task as blocked:

   ```bash
   bd update <task-id> --status=blocked --notes="Waiting for X"
   ```

2. Notify teammate via Slack
3. Pair if helpful

**See:** CLAUDE.md → Task Management

---

### Q: How do I know what work is available?

**A:**

```bash
bd ready  # In Claude Code chat or terminal
```

Shows all available tasks sorted by priority.

**See:** CLAUDE.md → Available Work

---

### Q: Can non-Beads users see my work?

**A:**
Yes! If they initialize Beads (`.beads/` directory exists), they see your work in `issues.jsonl`.

If not initialized, invisible to them. They use other task tracking (Jira, GitHub issues).

**See:** CLAUDE.md → Beads Integration

---

## IDE Setup & Configuration

### Q: How do I set up environment variables?

**A:**
Create `.env.development.local` (gitignored):

```
VITE_API_URL=http://localhost:3000
REACT_QUERY_DEVTOOLS=true
```

**Never commit:** `.env.local`, `.env.*.local`, secrets

**See:** CLAUDE.md → Environment Setup

---

### Q: How do I enable Beads integration?

**A:**

1. Initialize beads in your project:

   ```bash
   bd init
   ```

2. Restart Claude Code (hooks will auto-detect `.beads/` directory)
3. Verify with `bd ready`

**See:** CLAUDE.md → Beads Integration

---

### Q: Do I need special setup for dual-IDE workflow?

**A:**
Both Claude Code and Cursor should:

1. Open same project folder
2. Share `.cursor/rules/` and `.claude/` directories
3. Both have access to git and npm
4. Both can run quality gates

**No extra setup needed** - git keeps them in sync.

**See:** CLAUDE.md → Dual-IDE Workflow

---

## Performance & Best Practices

### Q: How can I speed up my workflow?

**A:**

1. **Memorize top 10 keyboard shortcuts** (#, @, /, Cmd+S, etc.)
2. **Use `/compact`** regularly (extends sessions)
3. **Load docs once** per session
4. **Use targeted searches** (Grep with filters)
5. **Commit frequently** (makes history cleaner)
6. **Run tests in watch mode** (instant feedback)

**See:** Token-Optimization.md → Best Practices

---

### Q: What's the fastest way to implement a feature?

**A:**

1. Use Cursor Agent for implementation (fastest)
2. Claude Code for architecture review (quality)
3. Run quality gates before commit
4. Commit and deploy

**vs Full SDLC:** 1-2 hours (Cursor Agent) vs 5-6 hours (full SDLC)

**Use full SDLC when:** Complex, architectural impact, risky

**See:** Advanced-Workflows.md → Workflow Selection

---

### Q: How do I avoid context switching?

**A:**

1. **Work on one task** until natural break
2. **Don't jump between projects** mid-session
3. **Use memory banks** to save context (can resume anytime)
4. **Close distractions** (Slack, email notifications)

**Token savings:** 20-30% by minimizing context reloads

**See:** Token-Optimization.md → Context Management

---

## Documentation & Learning

### Q: Where do I find documentation?

**A:**

- **Quick reference:** Keyboard-Shortcuts.md, Glossary.md, FAQ.md
- **Getting started:** Session-Protocol.md, CLAUDE.md
- **Advanced:** Advanced-Workflows.md, Token-Optimization.md
- **Troubleshooting:** Troubleshooting.md
- **MCP tools:** MCP-Guide.md
- **Models:** Model-Capabilities.md

**Location:** `/Users/ap/work/Front/docs/IDE-WORKFLOW-GUIDE/`

---

### Q: How do I contribute to documentation?

**A:**

1. Update relevant .md file
2. Keep it concise and scannable
3. Add examples where helpful
4. Link to related docs
5. Commit with `docs(category): description`

**See:** CLAUDE.md → Documentation

---

### Q: Where are the project rules?

**A:**
**Master reference:** `/Users/ap/work/Front/CLAUDE.md`

Key rules:

- NEVER edit `src/shared/api/generated/` (always use `npm run codegen`)
- NEVER hardcode secrets (always use environment variables)
- NEVER skip quality gates (no `--no-verify`)
- ALWAYS run `npm run quality:gates` before committing
- ALWAYS use Beads for task tracking

**See:** CLAUDE.md → CRITICAL Rules

---

## What's Next?

**New to the team?**

1. Read: CLAUDE.md (10 min)
2. Read: Session-Protocol.md (10 min)
3. Practice: Run `npm run dev` and `npm run quality:gates`
4. Try: Claim first task with `bd ready` and `bd update`

**Need deep dive?**

- Advanced workflows? → Advanced-Workflows.md
- Token optimization? → Token-Optimization.md
- MCP tools? → MCP-Guide.md

**Still stuck?**

- Check Troubleshooting.md for your issue
- Ask in team Slack with question + error
- Reference Glossary.md for undefined terms

---

## Related Documentation

- **Keyboard-Shortcuts.md** - Quick command reference
- **Glossary.md** - Term definitions
- **Model-Capabilities.md** - Model comparison
- **Token-Optimization.md** - Efficiency guide
- **Advanced-Workflows.md** - Complex workflows
- **Session-Protocol.md** - Session details
- **CLAUDE.md** - Master reference
- **Troubleshooting.md** - Problem solving

Good luck! Welcome to the team.
