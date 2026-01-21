# Session Protocol

> Best practices for starting, working in, and ending Claude Code sessions.

## Session Naming Convention

Use descriptive names that identify the work:

```bash
/rename feature-auth-login       # Feature work
/rename bugfix-redirect-loop     # Bug fixes
/rename refactor-api-layer       # Refactoring
/rename spike-performance        # Research/investigation
```

**Pattern:** `<type>-<scope>-<brief-description>`

---

## Session Start Checklist

When starting a new session, complete this checklist:

### 1. Context Loading (Automatic via hooks)

The session-start hook automatically:

- Primes beads context (`bd prime`)
- Shows in-progress work
- Displays ready task count

### 2. Manual Context Refresh

```bash
# Check available work
bd ready

# Check your active work
bd list --status=in_progress

# Recall project context from memory
mcp__hindsight-alice__recall "What was I working on in the Front project?"

# Check MCP server health
/mcp
```

### 3. Session Preparation

```bash
# Name your session
/rename <task-name>

# Switch model if needed
/model opus      # For planning/architecture
/model sonnet    # For implementation
```

---

## During Session

### Progress Tracking

- **ALWAYS** use TodoWrite for multi-step tasks
- Update beads status when starting work: `bd update <id> --status=in_progress`
- Retain important decisions: `mcp__hindsight-alice__retain "Decision: ..."`

### Context Switching

If switching between tasks:

1. Update current task status
2. Save context: `retain` key decisions
3. Use `/resume <session>` to switch sessions

### Getting Help

- `/help` - Claude Code help
- `recall "How do I..."` - Check if answer is in memory
- Context7 docs - Check official documentation

### Using Hindsight Effectively (TEMPR Approach)

**Hindsight** (Dec 2025) uses TEMPR retrieval: Semantic + Keyword + Graph + Temporal

**How Hindsight recalls from session-start hook:**
```
mcp__hindsight-alice__recall "Front project: architecture decisions, API patterns, React conventions, recent blockers, active work context"
```

This single prompt triggers:
- 🔍 **Semantic search** - Find conceptually related decisions
- 🔤 **Keyword matching** - Find specific terms (TanStack, Ant Design, etc.)
- 📊 **Graph traversal** - Find related concepts (if you mention auth, recalls auth patterns)
- ⏰ **Temporal filtering** - Recent context prioritized

**Optimal recall prompts (best practices 2026):**

```bash
# ✅ Good - Specific domain terms
recall "React component patterns, TypeScript generics, performance optimization"

# ✅ Good - Mix semantic + keywords
recall "How do we handle API errors? TanStack Query patterns? Error boundaries?"

# ✅ Good - Include domain (Front project)
recall "Front project: recent design decisions, current blockers, active tasks"

# ❌ Bad - Too vague
recall "Front project context"

# ❌ Bad - Too broad (triggers 1.5M tokens, slower)
recall "Everything about the project"
```

**Session history depth:**
- Hindsight evaluates agents on 1.5M tokens across multiple sessions
- Multi-session recall: 21.1% → 79.7% accuracy
- No hardcoded "3 sessions" - TEMPR handles optimal depth dynamically

### Using Context7 & WebSearch for Research

**When you encounter an unknown library or API:**

```bash
# 1. First: Try to recall if you've learned about it before
mcp__hindsight-alice__recall "How do I use TanStack Query mutations?"

# 2. If not in memory: Look up official docs via Context7
mcp__MCP_DOCKER__resolve-library-id "tanstack query"
mcp__MCP_DOCKER__get-library-docs "/tanstack/query" --topic "mutations"

# 3. For current/trending info: Use WebSearch
# WebSearch is useful for: breaking changes, version updates, new features

# 4. Save learnings for next time
mcp__hindsight-alice__retain "TanStack Query mutations: Use useMutation hook with onSuccess callback for updates"
```

**Quick Reference:**

| Need | Tool | Command |
|------|------|---------|
| Check memory | Hindsight | `recall "topic"` |
| Library documentation | Context7 | `resolve-library-id` → `get-library-docs` |
| Current information | WebSearch | `web search --query "...2026"` |
| Save learning | Hindsight | `retain "Decision: ..."` |

**When to use what:**

- ✅ **Hindsight recall** - First, always check if you've learned this before
- ✅ **Context7** - For official library/framework documentation
- ✅ **WebSearch** - For news, breaking changes, version info (use sparingly)

---

## Session End Checklist

**CRITICAL:** Complete these steps before ending:

### 1. Quality Gates (MANDATORY)

```bash
npm run quality:gates
```

**If gates fail:** Fix issues immediately. See TROUBLESHOOTING.md.

### 2. Save Work

```bash
# If no git changes needed:
bd sync --flush-only

# If committing changes:
git status && git add <files>
git commit -m "type(scope): description"
```

### 3. Persist Context

```bash
# Save session summary for next time
mcp__hindsight-alice__retain "Session summary: Completed [X], next steps [Y]"
```

### 4. Close Tasks

```bash
bd close <id1> <id2> ...    # Close completed beads
bd sync --flush-only        # Final sync
```

---

## Session Resume

### Resuming Last Session

```bash
claude --continue
```

### Resuming Named Session

```bash
claude --resume feature-auth-login
```

### After Resume

1. Check session context is loaded
2. Review beads status: `bd list --status=in_progress`
3. Use `recall` to refresh memory context
4. Continue work

---

## Session Types

### Planning Session

```bash
claude --permission-mode plan --model opus
/rename plan-<feature>
# Use /analyze, /architect, /plan commands
```

### Implementation Session

```bash
claude --model sonnet
/rename impl-<feature>
# Use TodoWrite, write code, run tests
```

### Review Session

```bash
claude --model opus
/rename review-<feature>
# Use /review command
```

---

## Emergency Recovery

If session ends unexpectedly:

1. **Check last session:**

   ```bash
   claude --continue
   ```

2. **Check beads state:**

   ```bash
   bd list --status=in_progress
   bd doctor
   ```

3. **Recall context:**

   ```bash
   mcp__hindsight-alice__recall "Last session Front project"
   ```

4. **Check git state:**
   ```bash
   git status
   git stash list  # If work was stashed
   ```
