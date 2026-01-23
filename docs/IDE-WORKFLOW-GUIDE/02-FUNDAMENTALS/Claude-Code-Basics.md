# Claude Code Basics: Mastering the Chat-First IDE

> **Target Audience:** Developers, Analysts, Tech Leads, and anyone doing analysis or architecture work
>
> **Reading Time:** 30 minutes (skim structure, read details as needed)
>
> **Prerequisites:** Read `Getting-Started.md` first
>
> **What You'll Learn:** How to use Claude Code for analysis, architecture, debugging, and code review

---

## What Is Claude Code?

Claude Code is a **chat-first IDE** powered by Claude Opus (AI). It's not traditional VS Code. Think of it as "a really smart colleague who can reason deeply about your code."

### Claude Code vs Traditional IDEs

| Aspect | Claude Code | VS Code/Cursor |
|--------|-----------|----------------|
| **Primary Interaction** | Chat (type questions) | Keyboard shortcuts |
| **Best At** | Analysis, reasoning, architecture | Code editing, speed |
| **Thinking Depth** | Very deep (Opus reasoning) | Surface-level (suggestions) |
| **Context Awareness** | 200K tokens (entire codebase) | 120K tokens (limited) |
| **Memory** | Multi-session (Hindsight) | Single session only |
| **Iteration Speed** | Medium (thoughtful) | Fast (reflexive) |
| **When to Use** | "Why?" and "Should we?" | "How do I?" |

### Claude Code Is Best For

✅ Analyzing complex bugs
✅ Making architectural decisions
✅ Understanding existing code
✅ Planning features at scale
✅ Security reviews
✅ Performance optimization
✅ Code review and quality gates
✅ Teaching/learning patterns

### Claude Code Is NOT For

❌ Fast coding iterations (use Cursor)
❌ Typing boilerplate quickly (use Cursor)
❌ Line-by-line code editing (use Cursor)

---

## Session Management: The Core Concept

Every Claude Code session has a **lifespan**: start → work → end.

### Understanding Sessions

A **session** is a conversation with Claude Code. Think of it like a Slack DM thread:

```
Session 1: "Setup initial authentication"
├─ Message 1: I need to understand how login works
├─ Message 2: Show me the API response format
├─ Message 3: Let me design the component structure
└─ End of day: Session saved with full history

Session 2 (next day): "Implement password reset"
└─ New conversation, can reference Session 1 if needed (via Hindsight)
```

### Session Lifespan

```
START
  ↓
claude --new                    # Create new session
(or claude --resume name)       # Or resume existing
  ↓
WORK (1-2 hours)
  ├─ Ask questions
  ├─ Get analysis
  ├─ Plan implementation
  ├─ Review code
  └─ (Optional: /rename to name it)
  ↓
END
  ├─ Session auto-saved
  ├─ Can resume anytime
  └─ Or archive and forget
```

### Why Sessions Matter

Sessions provide **continuous context**. Within a session, Claude remembers:

- Files you've referenced
- Decisions you've made
- Errors you've encountered
- Patterns you've discussed

This is powerful for deep work. Once you close the session, start a new one for a different task.

---

## Starting a Session: Three Ways

### Method 1: New Session (Most Common)

```bash
# From any directory
claude --new

# Optional: Name it immediately
/rename "feature-auth-redesign"
```

**Best for:** Starting fresh work on a new task.

### Method 2: Resume Existing Session

```bash
# List all past sessions
claude list-sessions

# Resume one
claude --resume "feature-auth-redesign"
```

**Best for:** Continuing yesterday's work without repeating questions.

### Method 3: Named Sessions (Pro Tip)

```bash
# After opening Claude Code, immediately name it
/rename "week-2-architecture-review"

# Next day, just resume by name
claude --resume "week-2-architecture-review"
```

**Best for:** Long-running projects where context matters.

---

## Loading Project Context: The First Step

Every new session should start with context loading. Copy-paste this block into Claude Code:

```
I'm starting work on a new task. Help me load project context:

#architecture
#src/shared/api
#src/widgets

bd ready
```

Claude Code will respond with:

- Project structure overview
- Available tasks (from Beads)
- Recent architectural patterns
- Files to reference

**Why this matters:** Claude Code needs to "see" your codebase structure before analyzing specific problems.

### Key Context References

| Reference | What It Shows | When to Use |
|-----------|--------------|-----------|
| `#architecture` | Project structure, layering | Always (first thing) |
| `#src/widgets` | Component patterns | When building UI |
| `#src/shared/api` | API integration patterns | When working with APIs |
| `#src/shared/ui` | Design system components | When styling |
| `@package.json` | Dependencies and scripts | When checking what's available |
| `#src/pages` | Route structure | When working on routing |

---

## Model Switching: Choosing the Right Brain

Claude Code gives you three models. Each has different speeds and capabilities:

### The Three Models

#### 1. **Opus** (Default)

```bash
# You're already using this
# Or explicitly switch:
/model opus
```

**Characteristics:**

- Slowest (30-60 sec per response)
- Deepest reasoning
- Best for complex analysis

**Best for:**

- Architecture decisions
- Root cause debugging
- Security reviews
- Code review
- "Why?" questions

**Time cost:** 3-4 responses per task

### 2. **Sonnet**

```bash
/model sonnet
```

**Characteristics:**

- Medium speed (10-20 sec per response)
- Balanced reasoning
- Good for most tasks

**Best for:**

- Creating plans
- Writing documentation
- Generating test cases
- Code generation
- "How do I?" questions

**Time cost:** 5-6 responses per task

### 3. **Haiku**

```bash
/model haiku
```

**Characteristics:**

- Fastest (2-5 sec per response)
- Basic reasoning
- For quick lookups

**Best for:**

- Syntax checking
- Finding files
- Quick questions
- Verification

**Time cost:** Minimal (1-2 responses)

### Model Switching Strategy

```
START: Use Opus (deep reasoning)
  ↓
Ask: "What's the architectural issue here?"
Opus analyzes deeply
  ↓
SWITCH: /model sonnet (execution)
  ↓
Ask: "Create a step-by-step plan"
Sonnet creates detailed plan
  ↓
SWITCH BACK: /model opus (verification)
  ↓
Ask: "Review this plan for risks"
Opus validates
  ↓
IMPLEMENT: Switch to Cursor for coding
```

This flow takes ~10 minutes but saves hours of wrong decisions.

---

## Context Management: Working Within Token Limits

Claude Code has a **200K token budget** per session. Tokens are basically "words Claude reads/writes". Once you hit the limit, the session ends.

### Understanding Token Usage

| Activity | Token Cost | Example |
|----------|-----------|---------|
| Reading a file (100 lines) | ~200 tokens | Reading component |
| Your message (20 words) | ~30 tokens | A question |
| Claude's response (100 words) | ~150 tokens | Analysis |
| Full codebase index | ~20K tokens | `#architecture` |
| Referenced Beads issues | ~500 tokens | `@beads-123` |

### Stretching Your Token Budget

**Problem:** You're at 150K tokens and still have work to do.

**Solution 1: Use `/compact`**

```bash
/compact
```

This tells Claude to be more concise and reduces context size by ~30%.

**Solution 2: Save Important Context**

Before you run out of tokens, save decisions:

```bash
# Save what you learned for next session
mcp__hindsight-alice__retain "Decision: Use Zustand for global state because Redux is overkill for this project size"

# Next session: retrieve it
mcp__hindsight-alice__recall "state management decisions"
```

**Solution 3: Archive Old Messages**

```bash
/rename "feature-complete-archiving-old-context"
```

Start a fresh session and reference the old one if needed.

**Solution 4: Use Smarter References**

Instead of:

```
@workspace  # Loads entire codebase = huge token cost
```

Use:

```
#src/widgets/Button  # Just Button component = small token cost
```

### Token Monitoring

Check token usage during session:

```bash
# (Not a real command, but Claude Code shows tokens in the UI)
# Look for: "~150K tokens used" indicator in sidebar
```

When you see tokens above 180K, start wrapping up or switching to a new session.

---

## The Hindsight Memory System: Multi-Session Learning

This is Claude Code's superpower: **remembering across sessions**.

### Three Memory Commands

#### 1. `recall` – Retrieve Past Decisions

```bash
mcp__hindsight-alice__recall "authentication flow decisions"
```

Claude Code searches your past session history and returns relevant notes.

**Use when:** You need to remember what you decided 3 sessions ago.

#### 2. `retain` – Save Current Decisions

```bash
mcp__hindsight-alice__retain "Decision: Prefer Ant Design Button over custom button component because of accessibility features and tested behavior"
```

Saves a decision for future recall.

**Use when:** You make an important decision that affects future work.

#### 3. `reflect` – Synthesize Across Sessions

```bash
mcp__hindsight-alice__reflect "What patterns have we used for error handling?"
```

Claude Code synthesizes patterns from across all your sessions.

**Use when:** You're about to make a decision and want to verify it against past patterns.

### Example Workflow: Multi-Session Feature

**Session 1 (Monday): Architecture**

```bash
claude --new
/rename "auth-redesign-architecture"

# Work through architecture questions
/model opus

# Before ending session, save key decision
mcp__hindsight-alice__retain "Auth: Use JWT stored in httpOnly cookie, refresh token rotation every 7 days, logout clears both cookies"
```

**Session 2 (Tuesday): Implementation**

```bash
claude --new
/rename "auth-redesign-implementation"

# At start, recall Monday's decision
mcp__hindsight-alice__recall "auth decisions"

# Implementation proceeds with full context
@beads-123
```

**Session 3 (Wednesday): Review**

```bash
claude --new

# Reflect on all auth decisions
mcp__hindsight-alice__reflect "auth-related decisions"

# Use reflection to write security checklist
```

This is why Claude Code is powerful for complex features: **the context never gets lost**.

---

## MCP Tools: Extending Claude Code's Capabilities

Claude Code can access specialized tools via **MCP** (Model Context Protocol).

### Essential MCP Tools for Your Work

#### Beads: Task Management

```bash
# See available work
bd ready

# View specific task
bd show beads-456

# Claim a task
bd update beads-456 --status=in_progress

# Complete task
bd close beads-456
```

Used in almost every session. Claude Code can suggest this when you mention a task.

#### Snyk: Security Scanning

```bash
mcp__Snyk__snyk_code_scan --path "/Users/ap/work/Front/src" --severity_threshold "high"
```

Finds security vulnerabilities before you commit.

**When to use:** Before `/review` or before final commit.

#### Context7: Library Documentation

```bash
# Look up a library
mcp__MCP_DOCKER__resolve-library-id "tanstack query"

# Get docs for that library
mcp__MCP_DOCKER__get-library-docs "/tanstack/query" --topic "mutations"
```

Get official, up-to-date documentation without Googling.

**When to use:** When working with unfamiliar libraries.

#### Hindsight: Memory System

Already covered above. Use `recall`, `retain`, `reflect`.

#### GitHub Search (zread)

```bash
mcp__zread__search_doc "vitejs/vite" "how to configure hmr"
```

Search GitHub repos for documentation and patterns.

### MCP Command Structure

All MCP commands follow this pattern:

```bash
mcp__[server]__[command] [params]

# Examples:
mcp__Snyk__snyk_code_scan --path "/path" --severity_threshold "high"
mcp__MCP_DOCKER__resolve-library-id "react"
mcp__hindsight-alice__recall "auth decisions"
```

**Pro tip:** You don't need to remember all of these. Just ask Claude Code:

```
I need to run a security scan. What's the Snyk command?
```

Claude Code provides the command with your exact paths.

---

## Slash Commands: Claude Code's Workflow Automation

Slash commands (`/command`) automate common tasks. These are unique to Claude Code.

### The Five Core Commands

#### 1. `/analyze "description"`

Deep analysis of requirements.

```bash
/analyze "We need to improve login performance. Users report 5-10 second delays."
```

Claude Code (Opus) breaks down:

- What's being measured
- Likely causes
- Data needed
- Proposed approach

**Time cost:** 2-3 minutes
**Token cost:** 5-10K tokens

#### 2. `/architect beads-123`

Design a system or component.

```bash
/architect beads-456
```

Claude Code reads the task and designs:

- Component structure
- Data flow
- API integration
- Error handling
- Testing strategy

**Output:** Ready to show to team or implement immediately

**Time cost:** 5-10 minutes
**Token cost:** 10-15K tokens

#### 3. `/plan beads-123`

Create step-by-step implementation plan.

```bash
/plan beads-456
```

Claude Code creates:

- Numbered steps (5-15 steps)
- File locations
- Dependencies
- Risk considerations
- Estimated effort per step

**Output:** Copy to Cursor and follow the plan

**Time cost:** 3-5 minutes
**Token cost:** 5K tokens

#### 4. `/review`

Comprehensive code quality review.

```bash
/review
```

Claude Code (with Snyk integration):

- Scans code for bugs
- Checks security issues
- Verifies design patterns
- Tests code behavior
- Suggests improvements

**Output:** Checklist of items to fix before commit

**Time cost:** 10-15 minutes
**Token cost:** 15-20K tokens

**Pro tip:** Run `/review` before pushing to GitLab. It catches 80% of common issues.

#### 5. `/model sonnet` or `/model haiku`

Switch models (already covered above).

```bash
/model sonnet    # Switch to faster model
/model opus      # Back to deep reasoning
```

---

## Common Claude Code Workflows

### Workflow 1: Understanding a Complex Bug (30 minutes)

```bash
# 1. New session
claude --new
/rename "bug-user-profile-crash"

# 2. Load context
#architecture
#src/pages/UserProfile
bd show beads-789

# 3. Ask Opus to analyze
/model opus
```

Paste the bug description, error stack trace, and reproduction steps.

```bash
# 4. Opus analyzes and suggests files to check
@src/pages/UserProfile/UserProfile.tsx
@src/shared/api/users.ts

# 5. Ask for deeper analysis
"What's the root cause? Show me step-by-step what goes wrong."

# 6. Once you understand, ask for fix
"Show me the fix for this issue. Make sure it handles edge cases."

# 7. Copy fix to Cursor and test
"I'm switching to Cursor to implement this fix."
```

**Output:** Bug fix ready to commit

---

### Workflow 2: Planning a Large Feature (45 minutes)

```bash
# 1. New session
claude --new
/rename "feature-user-dashboard-redesign"

# 2. Load context and epic details
#architecture
#src/pages
@beads-epic-100

# 3. Analyze requirements
/analyze "From the epic, break down what we need to build"

# 4. Design architecture
/architect beads-epic-100

# 5. Create detailed plan
/plan beads-epic-100

# 6. Break into subtasks
"Based on this plan, create 5-8 smaller tasks that developers can claim independently"

# 7. Save plan
mcp__hindsight-alice__retain "Dashboard redesign plan: [summary]"
```

**Output:** Epic broken into subtasks ready for team assignment

---

### Workflow 3: Security Review Before Release (20 minutes)

```bash
# 1. New session
claude --new
/rename "security-review-v2.1.0"

# 2. Load code
#src/shared/api
#src/pages

# 3. Run security scan
mcp__Snyk__snyk_code_scan --path "/Users/ap/work/Front/src" --severity_threshold "high"

# 4. Analyze results
"I got these Snyk findings. Which are critical? How do we fix them?"

# 5. Review code for patterns
/review

# 6. Document findings
"Create a checklist of security items to address before release"

mcp__hindsight-alice__retain "V2.1.0 security review: [findings]"
```

**Output:** Security checklist + fixes applied

---

### Workflow 4: Teaching Yourself a New Pattern (30 minutes)

```bash
# 1. New session
claude --new
/rename "learning-tanstack-query"

# 2. Get library docs
mcp__MCP_DOCKER__resolve-library-id "tanstack query"
mcp__MCP_DOCKER__get-library-docs "/tanstack/query" --topic "mutations"

# 3. Ask how to use it
"I need to handle form submissions with mutations. Show me the pattern."

# 4. Ask for example
"Apply this pattern to our UserProfile component"

# 5. Ask for best practices
"What mistakes do people make with this pattern? How do we avoid them?"

# 6. Save for next time
mcp__hindsight-alice__retain "TanStack Query mutation pattern: [summary with code example]"
```

**Output:** You now know the pattern, code example saved for future reference

---

## Context Handoff: Moving Between IDEs

Claude Code excels at analysis. Cursor excels at implementation. Here's how to switch:

### When to Handoff

| Trigger | From IDE | To IDE | Action |
|---------|----------|--------|--------|
| "Now I know what to code" | Claude Code | Cursor | Copy task details, start implementation |
| "I'm stuck on architecture" | Cursor | Claude Code | Ask Claude Code for guidance |
| "I need to review this PR" | Git/GitLab | Claude Code | `/review` command |
| "I need to write tests fast" | Claude Code | Cursor | Ask Cursor to generate tests |

### Safe Handoff Pattern

**In Claude Code:**

```bash
# 1. Document what you've decided
mcp__hindsight-alice__retain "Decision: Use Zustand for state, API wrapper pattern from src/shared/api"

# 2. Prepare the handoff
"I'm switching to Cursor to implement this. Here's what I need:
- Create component in src/widgets/UserDashboard
- Wire up with Zustand store
- Handle loading/error states"

# 3. Exit Claude Code
# (Don't close it, just open Cursor)
```

**In Cursor:**

```bash
# 1. Load the Beads task
@beads-456

# 2. Ask for quick recap
"What's the architecture I should follow?"

# 3. Start coding
```

See `Context-Handoff-Protocol.md` for detailed handoff procedures.

---

## When Claude Code Is the Right Choice

### Ask Yourself

- ❓ Am I trying to **understand** something? → Claude Code
- ❓ Am I trying to **decide** something? → Claude Code
- ❓ Am I stuck on **why** something breaks? → Claude Code
- ❓ Am I writing **many lines of repetitive code**? → Cursor
- ❓ Do I need **multi-session memory**? → Claude Code
- ❓ Do I have **architectural confusion**? → Claude Code

### Time Breakdown for Typical Task

| Phase | IDE | Time |
|-------|-----|------|
| Understand requirements | Claude Code | 5 min |
| Design/architecture | Claude Code | 10 min |
| Plan implementation | Claude Code | 5 min |
| Implementation | Cursor | 20 min |
| Testing | Cursor | 5 min |
| Code review | Claude Code | 10 min |
| Fix issues | Cursor | 5 min |

**Total:** 60 minutes, distributed between two IDEs optimally.

---

## Troubleshooting Claude Code Issues

### Issue 1: "Session keeps timing out"

**Symptoms:** You get "session ended" message after inactivity

**Solution:**

```bash
# Sessions timeout after ~8 hours. Before that happens:
# Save important context
mcp__hindsight-alice__retain "What I learned so far: [summary]"

# Next session, recall it
mcp__hindsight-alice__recall "feature-topic"
```

### Issue 2: "Claude Code response is too slow"

**Symptoms:** Responses take 60+ seconds

**Cause:** You're using Opus on a complex question

**Solution:**

```bash
# Switch to faster model
/model sonnet

# Try your question again
```

Or use `/compact` to reduce context size.

### Issue 3: "Claude Code gives wrong information"

**Symptoms:** Claude Code suggests code that doesn't work

**Solution:**

```bash
# Regenerate response
Cmd+Z (undo last response)

# Ask more specifically
"Show me this pattern in our actual codebase, not a generic example"

# Reference actual files
@src/widgets/Button/Button.tsx
@src/shared/api/users.ts
```

### Issue 4: "I accidentally closed a session I needed"

**Solution:**

```bash
# List all past sessions
claude list-sessions

# Find the one you want
# Sessions are dated, find the right day

# Resume it
claude --resume "session-name-from-list"
```

Sessions are auto-saved, so nothing is lost.

### Issue 5: "MCP commands aren't working"

**Symptoms:** `mcp__something__command` gives error

**Solution:**

```bash
# Check MCP server health
/mcp

# Should return list of available MCP servers
# If command still fails, try Cursor instead (some tools work better there)
```

---

## Advanced: Custom Memory Banks

Claude Code can save structured information for your team:

### Create a Memory Bank Entry

```bash
mcp__allpepper-memory-bank__memory_bank_write --projectName "Front" --fileName "auth-decisions.md" --content "# Auth Decisions

- JWT in httpOnly cookie
- Refresh token rotation every 7 days
- Logout clears both tokens"
```

### Retrieve Team Memory

```bash
mcp__allpepper-memory-bank__memory_bank_read --projectName "Front" --fileName "auth-decisions.md"
```

Use this to build team knowledge bases that persist across all Claude Code sessions.

---

## Best Practices: Using Claude Code Effectively

### ✅ DO

- ✅ Use Opus for architecture and complex decisions
- ✅ Ask clarifying questions before coding
- ✅ Save important decisions with `retain`
- ✅ Use `/review` before committing
- ✅ Run Snyk scans for security
- ✅ Name your sessions with meaningful names
- ✅ Switch to Cursor once you have a plan
- ✅ Use `#architecture` to understand new code
- ✅ Read error messages fully before asking Claude Code

### ❌ DON'T

- ❌ Use Claude Code for writing 100+ lines of code (use Cursor)
- ❌ Forget to save decisions (use `retain`)
- ❌ Use Opus for simple lookups (use Haiku instead)
- ❌ Reference entire workspace (use specific files with `@`)
- ❌ Ignore Snyk security warnings
- ❌ Close Claude Code without naming the session
- ❌ Try to memorize patterns (save them with `retain`)
- ❌ Ask the same question twice in same session

---

## Integration with Your Workflow

### Daily Usage Pattern

```
Morning: claude --resume "yesterday-session"
  ├─ Recall important decisions
  ├─ Check Beads for today's tasks
  └─ Plan work

Midday: /model sonnet + /plan beads-xxx
  └─ Create detailed implementation plan

Afternoon: cursor . (implement from plan)
  └─ Code implementation

Evening: claude --new + /review
  ├─ Review code before commit
  ├─ Run Snyk scans
  ├─ Document decisions
  └─ Save to Hindsight
```

### Weekly Usage Pattern

**Monday:**

- `/analyze` new epic requirements
- `/architect` system design
- Create task breakdown

**Tuesday-Thursday:**

- Implement tasks in Cursor
- Daily `/review` before commit

**Friday:**

- `/review` all week's work
- `reflect` on patterns learned
- `retain` key decisions for next sprint

---

## Keyboard Shortcuts for Claude Code

| Shortcut | Action | Context |
|----------|--------|---------|
| **Cmd+L** (Ctrl+L) | Clear chat | Start fresh topic |
| **Cmd+K** (Ctrl+K) | Code block | Insert code reference |
| **Cmd+Z** | Undo last response | Regenerate answer |
| **Enter** | Send message | Send question to Claude |
| **Tab** | Autocomplete | In input field |
| **Escape** | Dismiss autocomplete | Cancel suggestion |
| **#** | Reference files | Type # for suggestions |
| **@** | Reference specific file | Type @ for file picker |

---

## Next Steps

### Immediate (Today)

1. Open Claude Code
2. Follow the "Getting Started" workflow above
3. Try `/analyze` on your first task
4. Use `#architecture` to learn project structure

### Short Term (This Week)

1. Practice `/architect` on a design task
2. Use `/review` before your first commit
3. Save decisions with `retain`
4. Try model switching (`/model sonnet`)

### Medium Term (This Month)

1. Use Hindsight memory system regularly (`recall`, `retain`, `reflect`)
2. Master context handoff between Claude Code and Cursor
3. Teach a teammate how to use Claude Code
4. Build team memory banks

---

## FAQ: Claude Code Specific Questions

**Q: Should I keep Claude Code open while coding in Cursor?**
A: Yes! You can ask Claude Code questions while Cursor is open. Switch between windows as needed. But be aware of: token usage in Claude Code (it keeps adding tokens while open).

**Q: What's the difference between Hindsight `recall` and looking at old messages in Claude Code?**
A: `recall` searches across ALL sessions. Old messages only show in current session. Use `recall` to find decisions from weeks ago.

**Q: Can I use Claude Code on my phone?**
A: No, Claude Code runs on desktop/laptop only. But you can view and resume sessions if needed.

**Q: How do I know if I should use Opus vs Sonnet?**
A: Start with Opus. If responses are too slow, switch to `/model sonnet`. If still too slow, use `/model haiku`.

**Q: What happens if I hit the 200K token limit?**
A: Session automatically ends. You can start a new session and use `recall` to get context from the previous one.

**Q: Is Claude Code better than Cursor, or vice versa?**
A: They're complementary, not competitive. Claude Code for thinking, Cursor for coding. Use both, not one.

---

## Additional Resources

- **Getting Started:** First 5 minutes guide
- **Cursor Basics:** When Claude Code isn't the right choice
- **Context Handoff Protocol:** Safe IDE switching
- **Feature Matrix:** Detailed comparison with Cursor
- **Troubleshooting Guide:** When things break

---

**Document Stats:**

- Total lines: ~750
- Sections: 20+
- Code examples: 15+
- Commands: 30+
- Tables: 10+
- Estimated reading time: 30-40 minutes
- Estimated to master: 1-2 weeks with practice

---

🧠 **Claude Code is powerful because it thinks deeply. Combine it with Cursor for speed, and you have an unbeatable team.**

Last updated: January 2026
