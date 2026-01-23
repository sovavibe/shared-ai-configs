# Getting Started: Your First 5 Minutes

> **Target Audience:** Completely new users joining the project (all roles)
>
> **Reading Time:** 5 minutes
>
> **What You'll Learn:** How to start your first session, open the right IDE, and complete your first task without getting stuck

---

## Before You Start (Setup Checklist)

Before opening any IDE, complete this 2-minute checklist:

### ✅ Prerequisites Installed

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Git configured (`git config user.name`)
- [ ] Claude Code CLI installed (`npm install -g @anthropic-ai/claude`)
- [ ] Cursor installed (from cursor.com)
- [ ] Your SSH key added to GitLab (`ssh -T git@gitlab.com` returns your username)

### ✅ Repository Ready

```bash
# Clone and setup (if first time)
git clone git@gitlab.com:yourorg/Front.git
cd Front
npm install

# Verify everything works
npm run dev        # Should start dev server on :5173
npm run quality:gates  # Should pass all checks
```

**If `npm run quality:gates` fails:** See `/Users/ap/work/Front/.claude/TROUBLESHOOTING.md` for common fixes.

### ✅ Know Your Task

Before opening an IDE:

```bash
# See what work is available
bd ready

# Pick a task that matches your skill level
# New users: Pick tasks labeled "good-first-issue"
bd show <task-id>
```

---

## The Decision Tree: Claude Code vs Cursor

**Still not sure which IDE to use?** Answer these questions:

```
Do you know exactly what code to write?
├─ YES → Use CURSOR (implement directly)
└─ NO
   ├─ Did someone explain it already?
   │  ├─ YES → Use CURSOR (ask questions in chat, then code)
   │  └─ NO → Use CLAUDE CODE (analyze requirements first)
   │
   └─ Is this your first feature on this project?
      ├─ YES → Use CLAUDE CODE (learn architecture first)
      └─ NO → Use CURSOR (you know patterns already)
```

**Simple Rule:**

- 🧠 **Confused?** → Claude Code (think first)
- 💻 **Clear?** → Cursor (code immediately)

---

## Scenario 1: Opening Claude Code

**When to use:** First time on project, or tackling complex architecture

### Step 1: Start Claude Code Session

```bash
# From project root (/Users/ap/work/Front)
claude --new

# Give your session a name for easy resumption
/rename "feature-setup-guide"

# Optional: Set model if you need deeper analysis
/model opus
```

You'll see a chat interface open. This is your thinking space.

### Step 2: Load Project Context

Copy-paste this into Claude Code (all at once):

```
Let me start this session by getting context on available work and the architecture.

#architecture
#src/shared/api
bd ready
```

Claude Code will respond with:

- Available tasks
- Project structure overview
- Recent architectural patterns

### Step 3: Pick Your First Task

Claude Code showed you tasks. Pick one with:

- ✅ Clear description (not vague)
- ✅ Not marked "blocked" or "in_progress"
- ✅ Reasonable scope (not "refactor entire app")

**Example:**

```
bd show beads-456
```

### Step 4: Let Claude Code Help You Understand

Ask Claude Code your clarifying questions:

```
@beads-456 where should I put this new component?
What does the API expect from this endpoint?
Show me similar components to reference.
```

Claude Code will point you to files and examples. **This is the value of Claude Code: deep understanding before coding.**

### Step 5: Transition to Implementation

Once you understand the task:

```
I'm ready to implement. I'll switch to Cursor for faster coding.

cd /Users/ap/work/Front && cursor .
```

**Save your Claude Code session** (you can resume later):

```
/rename "feature-auth-implementation"
```

---

## Scenario 2: Opening Cursor

**When to use:** You know what to build, or you're continuing from Claude Code analysis

### Step 1: Start Cursor

```bash
# From project root
cursor .

# Or from command line in Cursor terminal:
cursor /Users/ap/work/Front
```

Cursor looks like VS Code with a chat sidebar on the right.

### Step 2: Load Context

In Cursor chat (bottom right panel):

```
@beads-456
#architecture
What's the simplest way to implement this?
```

Cursor will quickly analyze and suggest an approach.

### Step 3: Start Coding

**Option A: Accept Cursor's Suggestions**

Cursor shows inline code suggestions as you type. Press **Tab** to accept:

```typescript
// Type: function handleClick() {
//       ^ Cursor suggests the function body
// Press Tab to accept
```

**Option B: Ask Cursor for Specific Code**

```
Create a new component in src/widgets/UserCard/UserCard.tsx
Make it accept a user prop with TypeScript
Include proper error handling
```

Cursor generates the full file. You review and edit as needed.

### Step 4: Generate Tests

Once your component is done:

```
Generate tests for UserCard component
```

Cursor creates a test file. Run tests with:

```bash
npm run test UserCard
```

### Step 5: Quality Check

Before committing:

```bash
npm run quality:gates
```

If tests pass, you're ready to commit. If not, Cursor helps you fix the issues.

---

## Your First Task: Step-by-Step Walkthrough

**Scenario: You just joined and have your first task: "Create a Loading Spinner component"**

### Phase 1: Understanding (3 minutes)

**If you're unsure about requirements:**

```bash
# Use Claude Code
claude --new

# Load context
#architecture
@beads-789
```

Claude Code explains the architecture and task requirements.

**If requirements are clear:**

Skip to Phase 2.

### Phase 2: Planning (2 minutes)

**In Claude Code (or from Claude Code notes):**

- Where does this component go? → `src/widgets/LoadingSpinner/`
- What props does it need? → `size?: "small" | "medium" | "large"`
- Any API dependencies? → No, just UI
- Should it have tests? → Yes, snapshot tests

**Document this** (or ask Claude Code to document it):

```
Component: LoadingSpinner
Location: src/widgets/LoadingSpinner/LoadingSpinner.tsx
Props: size, color, speed
Tests: Basic render, size variants
```

### Phase 3: Implementation (10 minutes)

**Switch to Cursor:**

```bash
cursor .
```

**Create the component file:**

```bash
# In Cursor terminal
mkdir -p src/widgets/LoadingSpinner
touch src/widgets/LoadingSpinner/LoadingSpinner.tsx
```

**Write the component** (use Cursor inline suggestions):

1. Type the component name:

   ```typescript
   export const LoadingSpinner = ({ size = "medium" }) => {
   ```

2. Cursor suggests the JSX structure. Review and accept with Tab.

3. Add styling using styled-components:

   ```bash
   // Cursor helps with styled-components syntax
   ```

4. Export the component properly

### Phase 4: Testing (3 minutes)

**Ask Cursor to generate tests:**

```
Generate unit tests for LoadingSpinner component
Include: render test, size prop test, optional props test
```

Cursor creates `LoadingSpinner.test.tsx`.

**Run tests:**

```bash
npm run test LoadingSpinner
```

**Expected result:** ✅ All tests pass

### Phase 5: Quality Check (1 minute)

```bash
npm run quality:gates
```

**Expected result:** ✅ All gates pass

### Phase 6: Commit

```bash
git add src/widgets/LoadingSpinner/
git commit -m "feat(widgets): add LoadingSpinner component with size variants"
```

**Update task status:**

```bash
bd close beads-789
```

**Congratulations!** You just completed your first feature. This workflow scales to any feature size.

---

## Essential Keyboard Shortcuts

### Claude Code

| Shortcut | Action | When to Use |
|----------|--------|-----------|
| **Enter** | Send message | After typing question |
| **Ctrl+L** (Mac: Cmd+L) | Clear chat | Start fresh topic |
| **/model sonnet** | Switch model | Need faster responses |
| **/rename task** | Name session | For easy resumption |
| **Ctrl+Z** | Undo last response | Regenerate answer |

### Cursor

| Shortcut | Action | When to Use |
|----------|--------|-----------|
| **Tab** | Accept suggestion | When inline suggestion appears |
| **Escape** | Dismiss suggestion | Don't want Cursor's suggestion |
| **Cmd+Shift+P** (Ctrl+Shift+P) | Command Palette | Find any VS Code feature |
| **Cmd+K** (Ctrl+K) | Cursor chat | Ask Cursor in sidebar |
| **Cmd+J** (Ctrl+J) | Toggle terminal | Run npm commands |
| **Cmd+//** (Ctrl+/) | Toggle comment | Quick comment/uncomment |

### Both IDEs

| Shortcut | Action | When to Use |
|----------|--------|-----------|
| **#** | Reference files in chat | When typing in chat box |
| **@** | Reference specific file or symbol | Narrow context |

---

## Common "Stuck" Situations & How to Unstuck

### Situation 1: "I don't know what to code"

**Solution:**

1. Go to Claude Code
2. Ask: `@beads-xxx I don't understand the requirements`
3. Claude Code explains with examples
4. Once clear, switch back to Cursor and code

**Time lost:** 5 minutes

---

### Situation 2: "Tests are failing but I don't know why"

**Solution:**

```bash
# In Cursor terminal
npm run test ComponentName -- --reporter=verbose
```

Read the error message carefully. If still stuck:

```bash
# Switch to Claude Code
claude --resume "your-session-name"

# Ask with test output
I'm getting this test error: [paste error]
```

Claude Code helps you fix it.

**Time lost:** 10 minutes

---

### Situation 3: "npm run quality:gates is failing"

**See:** `.claude/TROUBLESHOOTING.md` (it has a section just for this)

Common fixes:

- ESLint error → Cursor auto-fixes with: `Cmd+K` then ask: fix this lint error
- TypeScript error → Check type definition
- Test error → Run individual test to debug

**Time lost:** 5-15 minutes

---

### Situation 4: "I need to understand the architecture"

**Solution:**

```bash
# Open Claude Code
claude --new

# Ask
@architecture explain how data flows from API to components
```

Claude Code gives you a detailed walkthrough with file references.

**Time lost:** 10 minutes

---

### Situation 5: "I can't find the right file"

**Solution:**

**In Cursor:**

```bash
Cmd+Shift+P (Ctrl+Shift+P on Windows/Linux)
Type: "find in files"
Search for filename or pattern
```

**Or in Cursor chat:**

```
Where is the UserCard component?
```

Cursor finds it instantly.

**Time lost:** 1 minute

---

## When to Ask for Help

### It's OK to Ask When

✅ You've been stuck for 15+ minutes on the same problem
✅ You're not sure if your approach is right
✅ You need architectural guidance for a new feature
✅ Tests are failing and error messages don't help
✅ You can't find something in the codebase
✅ You're unsure about the tech stack (Ant Design, TanStack Query, etc.)

### How to Ask for Help

**In Claude Code:**

```
I'm stuck on [specific thing]. Here's what I tried:
[your attempt]
[error message or unexpected behavior]
```

Claude Code walks through the solution step-by-step.

### It's NOT OK to Ask When

❌ You haven't opened Claude Code first (it's faster than asking people)
❌ You haven't searched the docs (use #architecture)
❌ The answer is in the file you're looking at

---

## Next Steps After Your First Task

Once you complete your first feature (estimated time: 45 minutes):

### ✅ Congratulations Checklist

- [ ] Feature implemented and tested
- [ ] All quality gates pass
- [ ] Commit is clear and descriptive
- [ ] Task is marked complete (`bd close`)

### 📚 Now Learn These Topics

In order of importance:

1. **Context Handoff Protocol** (15 min)
   - How to safely switch between Claude Code and Cursor
   - When to keep context vs. start fresh
   - `docs/IDE-WORKFLOW-GUIDE/03-WORKFLOWS/Context-Handoff-Protocol.md`

2. **Claude Code Basics** (30 min)
   - Deep dive into session management
   - Model switching strategies
   - When to use `/architect` vs `/plan`
   - Next file in this guide: `Claude-Code-Basics.md`

3. **Cursor Basics** (30 min)
   - Agent mode vs automode
   - Terminal integration
   - Advanced inline suggestions
   - Next file in this guide: `Cursor-Basics.md`

4. **Your Role-Specific Guide**
   - Developer? → `docs/IDE-WORKFLOW-GUIDE/01-QUICK-START/For-Developers.md`
   - Analyst? → `docs/IDE-WORKFLOW-GUIDE/01-QUICK-START/For-Analysts.md`
   - QA? → `docs/IDE-WORKFLOW-GUIDE/01-QUICK-START/For-QA-Engineers.md`
   - Tech Lead? → `docs/IDE-WORKFLOW-GUIDE/01-QUICK-START/For-Tech-Leads.md`

---

## Quick Reference: CLI Commands You'll Use Every Day

```bash
# Task Management
bd ready                          # See available work
bd show <task-id>                 # View task details
bd update <task-id> --status=in_progress  # Claim task
bd close <task-id>                # Mark task complete

# Development
npm run dev                        # Start dev server
npm run test ComponentName         # Run tests for component
npm run quality:gates              # Check all quality rules (DO THIS BEFORE COMMITTING)

# IDE Start/Resume
claude --new                       # New Claude Code session
claude --resume session-name       # Resume past session
cursor .                           # Open Cursor

# Git
git add <files>                    # Stage changes
git commit -m "type(scope): msg"   # Commit
git push origin feature-branch     # Push to GitLab
```

---

## FAQs for New Users

**Q: Claude Code or Cursor first?**
A: If confused about requirements → Claude Code first. If clear on what to do → Cursor first.

**Q: Can I use both IDEs at the same time?**
A: Yes! Claude Code for thinking, Cursor for coding. Switch between them using the context handoff protocol.

**Q: My session keeps timing out. How do I save progress?**
A: Sessions are auto-saved. Resume anytime with `claude --resume session-name`. But if you leave for >8 hours, context is lost. Save important decisions with `mcp__hindsight-alice__retain "decision summary"`.

**Q: What if I break the code?**
A: Use `git status` and `git diff` to see changes. Reset with `git checkout -- <file>` or `git reset --hard` to undo everything.

**Q: My IDE is slow. What do I do?**
A: Use `/compact` in Claude Code to reduce context size. In Cursor, close extra terminals or tabs.

**Q: Is there a way to undo a commit?**
A: Yes, but be careful. See `.claude/TROUBLESHOOTING.md` section "Git Recovery".

**Q: Can I switch models in Cursor?**
A: No, Cursor uses fixed Agent mode. For model switching, use Claude Code with `/model sonnet` or `/model haiku`.

**Q: How long does a typical session last?**
A: Claude Code: 1-2 hours (thinking-heavy). Cursor: 30-60 minutes (coding sprint). You can do multiple sessions per day.

---

## Your Success Metrics

**By the end of your first day:**

- [ ] Repository cloned and `npm run dev` works
- [ ] First task completed and committed
- [ ] You've used both Claude Code and Cursor at least once
- [ ] You know which IDE to use for your next task

**By the end of your first week:**

- [ ] 3-5 features completed
- [ ] You've recovered from at least one stuck situation
- [ ] You understand the project's component structure
- [ ] You know the keyboard shortcuts without thinking

**By the end of your first month:**

- [ ] 15+ features completed
- [ ] You're comfortable with complex architectural tasks
- [ ] You help new team members with onboarding
- [ ] You know when to use Claude Code vs Cursor without deciding

---

## Still Need Help?

### Resources in Order of Importance

1. **This guide** (you're reading it) - 5 min
2. **Claude Code Basics** (next in this folder) - 30 min
3. **Cursor Basics** (next in this folder) - 30 min
4. **Your role-specific guide** (01-QUICK-START) - 15 min
5. **Feature Matrix** (in this folder) - 20 min
6. **Troubleshooting Guide** (08-TROUBLESHOOTING) - as needed
7. **Slack #dev channel** - ask after trying docs first

---

## Session End Checklist

Every time you finish work, before closing your IDE:

```bash
# 1. Check what changed
git status

# 2. Run quality checks
npm run quality:gates

# 3. If gates pass, commit
git add <files>
git commit -m "type(scope): description"
git push origin feature-branch

# 4. Mark task complete
bd close <task-id>

# 5. In Claude Code (if still open)
/rename "session summary"
```

**Expected time:** 3 minutes

---

**Remember:** Your first week is the hardest. By task #5, you'll be working at full speed. Ask questions when stuck—that's what the team is here for.

🚀 **You've got this. Now go build something amazing.**

---

**Document Stats:**

- Total lines: ~550
- Sections: 15
- Checklists: 4
- Keyboard shortcuts: 10+
- Decision trees: 2
- Estimated reading time: 5-10 minutes
- Estimated to complete first task: 45 minutes
