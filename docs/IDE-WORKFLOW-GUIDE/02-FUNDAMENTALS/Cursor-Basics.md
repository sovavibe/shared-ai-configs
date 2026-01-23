# Cursor Basics: Mastering the Code-First IDE

> **Target Audience:** Developers, QA Engineers, and anyone doing implementation or rapid iteration
>
> **Reading Time:** 30 minutes (skim structure, read details as needed)
>
> **Prerequisites:** Read `Getting-Started.md` first
>
> **What You'll Learn:** How to use Cursor for fast code generation, agent mode, automode, and terminal integration

---

## What Is Cursor?

Cursor is a **code-first IDE** based on VS Code with AI superpowers. Think of it as "VS Code that can write code for you."

### Cursor vs Claude Code

| Aspect | Cursor | Claude Code |
|--------|--------|-----------|
| **Primary Interaction** | Keyboard + inline suggestions | Chat (type questions) |
| **Best At** | Code generation, iteration, speed | Analysis, reasoning, architecture |
| **Thinking Depth** | Quick suggestions | Very deep reasoning |
| **Context Awareness** | 120K tokens (focused) | 200K tokens (complete picture) |
| **Memory** | Single session only | Multi-session (Hindsight) |
| **Iteration Speed** | Very fast (2-3 sec suggestions) | Medium (30-60 sec per response) |
| **Learning Curve** | Low (like VS Code) | Medium (new interface) |
| **When to Use** | "Write this code" | "Why should we?" |

### Cursor Is Best For

✅ Component generation
✅ Fast iteration cycles
✅ Test writing
✅ Bug fixes
✅ Automode for repetitive tasks
✅ When you know what to build
✅ Terminal integration
✅ Familiar IDE workflow

### Cursor Is NOT For

❌ Deep architectural decisions (use Claude Code)
❌ Complex debugging (use Claude Code)
❌ Long-term context tracking (use Claude Code)
❌ Multi-session projects (use Claude Code)

---

## Interface Overview: Cursor vs VS Code

If you've used VS Code, Cursor is 95% the same. Here's what's different:

### New Cursor Elements

```
Cursor window:
┌─────────────────────────────────────────────────┐
│ File tabs (same as VS Code)                     │
├──────────────────┬──────────────────────────────┤
│                  │                              │
│ File explorer    │ Code editor (2-3x wider)    │
│ (left sidebar)   │                              │
│                  │ Cursor suggestions appear   │
│ Same as VS Code  │ as you type →               │
│                  │                              │
├──────────────────┴──────────────────────────────┤
│ Terminal (Cmd+J) - same as VS Code             │
├──────────────────────────────────────────────────┤
│ Chat panel (right sidebar) - CURSOR ONLY        │
│ Ask questions here                             │
└──────────────────────────────────────────────────┘
```

### Key Differences from VS Code

| Element | VS Code | Cursor | Difference |
|---------|---------|--------|-----------|
| **Chat Sidebar** | None | ✅ Right side | Ask Cursor questions |
| **Inline Suggestions** | Auto-complete only | ✅ AI suggestions | Full code suggestions |
| **Terminal** | Same | Same | No change |
| **Keyboard Shortcuts** | Standard | Standard | 95% the same |
| **Extensions** | 50,000+ | Same (compatible) | All VS Code extensions work |
| **Settings** | Preferences | Same | Uses VS Code config |

---

## The Three Operating Modes

Cursor has three distinct modes for different workflows:

### Mode 1: Manual Mode (Default)

You control every interaction.

```bash
# Start Cursor (defaults to Manual mode)
cursor .

# Workflow:
1. Type code
2. Cursor suggests inline
3. Press Tab to accept (or keep typing to ignore)
4. Ask Cursor questions in chat sidebar (Cmd+K)
5. Copy suggestions and refine
```

**Speed:** Medium (3-5 iterations per minute)
**Control:** Full (you decide what to keep/discard)
**Best for:** Careful, deliberate coding

**Example:**

```typescript
// You type:
export const UserCard = ({ user }) => {
  // Cursor suggests the full component body
  // Press Tab to accept, or keep typing to replace
```

### Mode 2: Agent Mode (Recommended for Most Tasks)

Cursor automatically makes smart decisions about your code.

**How it starts:** Usually enabled by default. Check bottom right of Cursor window.

```
Status bar (bottom right):
[Agent mode] [○○○] Thinking...
```

**Workflow:**

```
1. Ask question in chat: "Create a UserCard component"
2. Agent mode analyzes context
3. Cursor generates full component with proper structure
4. Agent suggests follow-ups: "Need tests?" "Need styling?"
5. You approve or refine
```

**Speed:** Fast (2-4 iterations per minute)
**Control:** Medium (Agent makes decisions)
**Best for:** Feature generation when you know high-level what you want

**Example:**

```bash
# In chat (Cmd+K):
"Create a UserCard component that displays user name, email, and avatar"

# Agent mode:
1. Creates file
2. Generates component with TypeScript
3. Imports Ant Design Button
4. Suggests tests
5. Asks: "Want to add loading state?"
```

### Mode 3: Automode (Advanced)

Cursor runs continuously without waiting for your approval.

**⚠️ Caution:** Only for trusted, repetitive tasks.

```bash
# Enable in Chat settings:
Settings → Automode → Enable

# Or inline in chat:
"Generate tests for all components in src/widgets/ (use automode)"
```

**Workflow:**

```
1. Give task: "Add error handling to all API calls"
2. Start automode
3. Cursor runs continuously:
   - Finds all API files
   - Adds error handling
   - Generates tests
   - No waiting for approval between steps
4. When done, review all changes
```

**Speed:** Very fast (entire batch in minutes)
**Control:** Low (you review after completion)
**Best for:** Batch refactoring, test generation, large-scale changes

**⚠️ Safety:** Only use automode on:

- Well-understood tasks
- Backed up code
- With git staging enabled

---

## Starting Cursor: Three Approaches

### Approach 1: Fresh Cursor Session

```bash
# Open Cursor in current directory
cursor .

# Or specify a path
cursor /Users/ap/work/Front
```

Cursor opens with no previous context. You need to load project context.

**Best for:** New tasks, focused work sessions

### Approach 2: Continue from Terminal

```bash
# You're in project directory
cd /Users/ap/work/Front

# Open Cursor (uses current directory)
cursor .
```

### Approach 3: Open via Command Palette

```bash
# Within VS Code or Cursor, open command palette
Cmd+Shift+P (Ctrl+Shift+P on Windows/Linux)

# Type: "New Cursor session"
```

---

## Loading Context: Essential Setup

Every new Cursor session needs context. Do this first thing:

### Quick Context Load (2 minutes)

```
@beads-456
@workspace
#architecture
What's the simplest way to implement this?
```

**What this does:**

- `@beads-456` - Loads the specific task
- `@workspace` - Indexes your entire codebase (Cursor reads files)
- `#architecture` - Shows project structure
- Question - Asks Cursor for advice based on context

### Selective Context (Faster, for small changes)

Don't load entire workspace for small bug fixes:

```
@src/widgets/Button
What's the issue with this component?
```

This is faster because Cursor only reads the Button component.

### Context References (What to Use When)

| Reference | Use Case | Speed | Token Cost |
|-----------|----------|-------|-----------|
| `@beads-123` | Task-specific context | Medium | 200 tokens |
| `@workspace` | Full codebase indexing | Slow | 30K+ tokens |
| `@src/widgets` | Component patterns | Medium | 5K tokens |
| `@src/shared/api` | API integration patterns | Medium | 3K tokens |
| `@package.json` | Dependencies | Fast | 300 tokens |
| `#keyword` | Search files by name | Very fast | <100 tokens |

### Pro Tip: Smart Context Loading

```
# Instead of loading everything:
# Bad: @workspace (too slow, 30K tokens)

# Good:
# - For UI work: @src/widgets + @src/shared/ui
# - For API work: @src/shared/api + @src/pages/SpecificPage
# - For tests: @src/specs or files you're testing
```

**Rule:** Only load what you need.

---

## Inline Suggestions: The Core Feature

Inline suggestions are Cursor's superpower. As you type, Cursor suggests code.

### How Inline Suggestions Work

```typescript
// Step 1: You type function signature
export const formatDate = (date: Date) => {
  // Step 2: Cursor predicts what comes next (greyed out)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  // Step 3: Press Tab to accept, or keep typing to ignore
}
```

### Accepting Suggestions

| Action | Effect | Use When |
|--------|--------|----------|
| **Tab** | Accept entire suggestion | Suggestion looks perfect |
| **Cmd+Right** (Ctrl+Right) | Accept word-by-word | Partial accept |
| **Keep typing** | Ignore suggestion | Want different code |
| **Escape** | Dismiss suggestion | Distraction |

### Requesting Specific Suggestions

Ask Cursor to generate code in chat:

```
In chat (Cmd+K):
"Create a React hook called useUserData that fetches user info from /api/users"

# Cursor generates the full hook
# You can:
1. Copy to file
2. Modify and accept
3. Ask for variations
```

### Disabling Suggestions (If Too Distracting)

```bash
Settings → Cursor Settings → Disable inline suggestions
# Or: Settings → "codeium inline" disable
```

---

## Chat Interface: Asking Cursor Questions

Chat is in the right sidebar. Open with **Cmd+K** (Ctrl+K on Windows/Linux).

### Basic Chat Usage

```
Cmd+K  → Chat opens
Type your question
Press Enter to send
```

### Chat Syntax (Context References)

You can reference files and symbols in chat:

| Syntax | Meaning | Example |
|--------|---------|---------|
| `@file.tsx` | Include specific file | `@UserCard.tsx generate tests` |
| `@folder/` | Include entire folder | `@src/widgets/ show architecture` |
| `#keyword` | Search files | `#Button find all Button components` |
| `@workspace` | Entire codebase | `@workspace audit security` |

### Multi-turn Chat

Chat remembers context within a session:

```
Chat:
You: "Create a UserCard component"
Cursor: [generates component]

You: "Add loading state to UserCard"
Cursor: [modifies component, remembers previous context]

You: "Now create tests"
Cursor: [tests for UserCard with loading state]
```

Each message builds on previous context.

### Chat vs Inline Suggestions

When to use each:

| Task | Use Chat | Use Inline |
|------|----------|-----------|
| Generate new component | ✅ Chat | ❌ (slow to type) |
| Add missing import | ❌ (overkill) | ✅ Inline |
| Understand error | ✅ Chat | ❌ (need explanation) |
| Extend existing code | ⚠️ Either | ✅ Often better |
| Write single function | ⚠️ Either | ✅ Often better |
| Refactor large file | ✅ Chat | ❌ (complex) |

---

## Terminal Integration: Running Commands

Cursor has an integrated terminal (just like VS Code).

### Opening Terminal

```bash
Cmd+J   # Toggle terminal on/off
Ctrl+J  # On Windows/Linux
```

Terminal opens at bottom of window.

### Running Common Commands

```bash
# Run dev server
npm run dev

# Run tests (specific test)
npm run test ComponentName

# Run all tests
npm run test

# Quality gates (run before commit!)
npm run quality:gates

# Code generation (when API changes)
npm run codegen

# Git commands
git add .
git commit -m "message"
git push origin branch-name
```

### Asking Cursor to Run Commands

```
In chat:
"Run tests for the Button component and show me any failures"

# Cursor:
1. Runs: npm run test Button
2. Shows output
3. Highlights failures
4. Suggests fixes
```

### Terminal Workflow

**Typical developer flow:**

```
1. Write code in editor
2. Open terminal (Cmd+J)
3. npm run test ComponentName
4. Tests fail
5. Switch to chat (Cmd+K)
6. "Why is this test failing?" (paste error)
7. Cursor explains and suggests fix
8. Accept fix
9. Re-run tests (up arrow in terminal, Enter)
10. Tests pass
```

---

## Agent Mode: Advanced Code Generation

Agent mode lets Cursor make intelligent decisions while generating code.

### Understanding Agent Mode

Agent mode operates at a higher level than inline suggestions:

```
Manual mode: "Type + Tab + accept"
Agent mode: "Ask what you want + Agent builds it"
```

### Enabling Agent Mode

Check bottom right of Cursor window:

```
Status bar shows:
[o] Agent mode OFF  → Click to enable
[●] Agent mode ON   → Ready to use
```

### Using Agent Mode

```
1. Open chat (Cmd+K)
2. Describe what you want:
   "Create a login form component with email/password fields and validation"
3. Agent mode kicks in:
   - Reads context (@workspace)
   - Analyzes existing patterns
   - Generates component
   - Suggests tests
   - Asks clarifying questions
```

### Agent Mode Example Interaction

```
You: "Add dark mode toggle to the header"

Agent (Agent mode):
1. Reads HeaderComponent.tsx
2. Checks existing dark mode implementation
3. Generates toggle button with proper styling
4. Updates layout to include toggle
5. Suggests: "Should I add localStorage persistence?"
6. Asks: "Want to update all pages to support dark mode?"

You: "Yes, but only pages in src/pages, not widgets"

Agent:
1. Finds all pages
2. Updates each to accept dark mode
3. Tests to ensure no breakage
4. Done
```

### When Agent Mode Excels

- ✅ Complex features (login flows, dashboards)
- ✅ Cross-file changes
- ✅ Pattern application (add feature to 10 components)
- ✅ Refactoring at scale

### When to Avoid Agent Mode

- ❌ Very specific, small changes (use inline suggestions)
- ❌ Untested code paths (review manually first)
- ❌ Security-critical changes (review before committing)

---

## Automode: Batch Operations

Automode runs Cursor continuously without waiting for your approval.

### When to Use Automode

✅ Generate tests for 20+ components
✅ Add error handling to all API calls
✅ Update all imports after refactoring
✅ Format entire codebase
✅ Add TypeScript types to untyped code

### When NOT to Use Automode

❌ First time doing a pattern (review each step)
❌ Untested territory
❌ Security-critical changes
❌ Code you don't fully understand

### Starting Automode

```
1. Open chat (Cmd+K)
2. Type your task
3. At end, type: (use automode)

Example:
"Generate vitest unit tests for all components in src/widgets/.
Include: render tests, prop tests, error handling tests. (use automode)"

4. Press Enter
5. Cursor runs continuously
6. Review all changes when done
```

### Monitoring Automode

```
While running:
- Watch chat panel for progress
- See files being modified in editor
- Watch terminal for test runs

Stopping automode:
- Click "Stop" in chat panel
- Or Escape key
```

### Automode Safety Checklist

Before starting automode:

- [ ] Git is committed (create branch if needed)
- [ ] You understand the task completely
- [ ] Task is well-scoped (not "refactor entire app")
- [ ] Task is repetitive (not one-off)
- [ ] You have time to review after

---

## Keyboard Shortcuts: Essential Commands

### Navigation

| Shortcut | Action | Use When |
|----------|--------|----------|
| **Cmd+P** | Open file by name | Want to jump to a file |
| **Cmd+Shift+P** | Command palette | Need IDE command |
| **Cmd+Shift+F** | Find across files | Search codebase |
| **Cmd+F** | Find in file | Search in current file |
| **Cmd+G** | Go to line | Jump to line number |

### Editing

| Shortcut | Action | Use When |
|----------|--------|----------|
| **Tab** | Accept Cursor suggestion | Inline suggestion appears |
| **Escape** | Dismiss suggestion | Don't want suggestion |
| **Cmd+/** | Toggle comment | Want to comment/uncomment |
| **Cmd+Shift+L** | Multi-cursor (all occurrences) | Want to edit multiple places |
| **Cmd+D** | Next occurrence | Select next matching word |

### Chat & AI

| Shortcut | Action | Use When |
|----------|--------|----------|
| **Cmd+K** | Open chat | Want to ask Cursor |
| **Cmd+L** | Clear chat | Start new conversation |
| **Cmd+Shift+K** | Generate code from selection | Have selected text, want to extend |
| **Cmd+I** | Quick fix (AI) | Cursor suggests fix for error |

### Terminal & Debugging

| Shortcut | Action | Use When |
|----------|--------|----------|
| **Cmd+J** | Toggle terminal | Want to run commands |
| **Cmd+Shift+D** | Open debugger | Want to debug code |
| **Cmd+Shift+B** | Run build task | Want to build project |

### Window Management

| Shortcut | Action | Use When |
|----------|--------|----------|
| **Cmd+B** | Toggle sidebar | Want more screen space |
| **Cmd+Shift+G** | Focus git panel | Want to see git changes |
| **Cmd+Shift+X** | Extensions | Want to install extension |

---

## Common Cursor Workflows

### Workflow 1: Fast Component Creation (15 minutes)

```bash
# 1. Open Cursor
cursor .

# 2. Load task context
@beads-123
#architecture

# 3. Ask Cursor to create component
"Create a PricingCard component with title, price, features list, and CTA button"

# 4. Copy generated code to new file
src/widgets/PricingCard/PricingCard.tsx

# 5. Refine if needed
# (Cursor suggests improvements in inline suggestions)

# 6. Generate tests
"Generate tests for PricingCard component"

# 7. Run tests
npm run test PricingCard  (in terminal)

# 8. Commit
git add src/widgets/PricingCard
git commit -m "feat(widgets): add PricingCard component"
```

**Total time:** 15 minutes
**Key:** Let Cursor generate, you refine

---

### Workflow 2: Bug Fix with Terminal (10 minutes)

```bash
# 1. Find component with bug
Cmd+P → type component name

# 2. Run test to confirm bug
Terminal: npm run test ComponentName

# 3. Analyze error
Read error message in terminal

# 4. Ask Cursor in chat
@ComponentName.tsx
"Why is this test failing? [paste error]"

# 5. Apply suggested fix
Cursor suggests code changes
You accept with Tab or chat response

# 6. Re-run test
Terminal: npm run test ComponentName (or press up arrow)

# 7. If fixed, commit
git add <file>
git commit -m "fix(component): resolve test failure"
```

**Total time:** 10 minutes
**Key:** Terminal + Chat working together

---

### Workflow 3: Batch Test Generation (20 minutes with automode)

```bash
# 1. Open chat (Cmd+K)
# 2. Type task with automode flag

"Generate comprehensive Vitest unit tests for all components in src/widgets/.
Include: render tests, prop validation, edge cases, error scenarios.
Use realistic test data from the project.
(use automode)"

# 3. Monitor progress
Terminal shows test generation
Files appear in editor

# 4. When complete (5-15 min)
Stop automode

# 5. Quick review
Cmd+P → search for new test files
Skim a few to ensure quality

# 6. Run all tests
Terminal: npm run test

# 7. Fix any failures
If tests fail, ask Cursor

# 8. Commit
git add src/widgets
git commit -m "test: add comprehensive unit tests for widgets"
```

**Total time:** 20 minutes
**Key:** Automode saves hours of manual work

---

### Workflow 4: Feature Implementation with Cursor (30 minutes)

```bash
# 1. Load context
claude --new (analyze requirements in Claude Code)
/architect beads-epic-100
/plan beads-epic-100

# 2. Switch to Cursor
cursor .

# 3. Implement from plan
@beads-epic-100
Follow the plan from Claude Code
Use Agent mode for faster generation

# 4. Write components
Agent mode: "Create UserDashboard component with these sections:
- Header with user info
- Stats cards showing metrics
- Recent activity list
- Settings button"

# 5. Generate tests
Agent mode: "Create tests for UserDashboard"

# 6. Run quality gates
Terminal: npm run quality:gates

# 7. Commit if gates pass
git add src/
git commit -m "feat(dashboard): add UserDashboard with metrics and activity"

# 8. Back to Claude Code for review
claude --resume "session-name"
/review

# 9. If review finds issues
Switch back to Cursor, fix, re-test, re-commit
```

**Total time:** 30 minutes
**Key:** Handoff between Claude Code (planning) and Cursor (implementation)

---

## When Cursor Is the Right Choice

### Ask Yourself

- ✅ Do I know exactly what to code? → Cursor
- ✅ Am I implementing from a plan? → Cursor
- ✅ Do I need fast iterations? → Cursor
- ✅ Am I writing tests? → Cursor
- ✅ Is this a familiar pattern? → Cursor
- ❌ Am I confused about architecture? → Claude Code
- ❌ Do I need multi-session memory? → Claude Code
- ❌ Is this a one-of-a-kind problem? → Claude Code

### Time Breakdown: When Cursor Shines

| Task | Without Cursor | With Cursor |
|------|---|---|
| Create component | 20 min | 5 min |
| Write tests | 30 min | 8 min |
| Bug fix | 15 min | 5 min |
| Refactor 5 components | 60 min | 15 min |
| Add error handling to 10 files | 45 min | 8 min |

---

## Troubleshooting Common Cursor Issues

### Issue 1: "Cursor suggestions are wrong"

**Symptoms:** Generated code doesn't match what you wanted

**Solution:**

```
1. Escape to dismiss suggestion
2. Keep typing your version
3. Or ask in chat: "@component.tsx this is wrong because..."
4. Cursor learns from feedback
```

### Issue 2: "Cursor is too slow"

**Symptoms:** Suggestions take 10+ seconds

**Cause:** Large file or complex context

**Solution:**

```
Option 1: Close other Cursor tabs
Option 2: Restart Cursor
Option 3: Use Haiku model (faster, less accurate)
Option 4: Reduce context (@workspace → @folder)
```

### Issue 3: "Tests won't pass after automode"

**Symptoms:** Automode generated code that fails tests

**Solution:**

```
1. Review the generated code
2. Run: npm run test
3. Fix failures manually or ask in chat
4. Don't run automode on untested patterns
```

### Issue 4: "Chat doesn't understand context"

**Symptoms:** Cursor gives generic answers instead of project-specific

**Solution:**

```
Be more specific:
Bad: "Create a button component"
Good: "@src/shared/ui/Button create a variation with loading state"

Or load context first:
@workspace
@src/widgets
#architecture
"What's the pattern for..."
```

### Issue 5: "I accidentally accepted wrong suggestion"

**Solution:**

```
1. Cmd+Z to undo
2. Or manually delete/fix
3. Keep typing to override

Pro tip: Review before pressing Tab
```

---

## Integration with Claude Code

Cursor and Claude Code work together:

### When to Switch Between Them

| Situation | From | To | Why |
|-----------|------|----|----|
| "What should I build?" | Cursor | Claude Code | Need architectural advice |
| "Now I know what to build" | Claude Code | Cursor | Need to implement fast |
| "Tests are failing" | Cursor | Claude Code | Need to understand root cause |
| "This refactoring is complex" | Cursor | Claude Code | Need to design approach |
| "Time to review PR" | Cursor | Claude Code | Need `/review` command |

See `Context-Handoff-Protocol.md` for detailed handoff procedures.

---

## Extensions: Enhancing Cursor

Cursor is compatible with all VS Code extensions. Recommended extensions:

### Essential Extensions

```bash
# Open extensions panel: Cmd+Shift+X

# Search for:
1. "ES7+ React/Redux/React-Native snippets" - for React templates
2. "Prettier" - code formatter
3. "ESLint" - linting
4. "Thunder Client" - API testing
5. "Git Lens" - git history
```

### Installing Extensions

```bash
Cmd+Shift+X → Search extension name → Click Install
```

---

## Advanced: Custom Keyboard Shortcuts

Bind Cursor commands to custom shortcuts:

```bash
# Open keyboard shortcuts
Cmd+K Cmd+S

# Search for common commands
"Generate tests" → Right-click → Add keybinding

# Assign shortcut
Cmd+Shift+T (or your preferred combination)
```

---

## Best Practices: Using Cursor Effectively

### ✅ DO

- ✅ Use inline suggestions while typing
- ✅ Ask specific questions in chat
- ✅ Load relevant context (@beads, not @workspace)
- ✅ Run tests after generation
- ✅ Use automode for repetitive tasks
- ✅ Check suggestions before accepting
- ✅ Combine with terminal for workflow
- ✅ Use Agent mode for complex features

### ❌ DON'T

- ❌ Accept suggestions without reading them
- ❌ Load entire @workspace for small changes
- ❌ Run automode on untested patterns
- ❌ Ignore test failures
- ❌ Use Cursor for architectural decisions (use Claude Code)
- ❌ Skip quality:gates before commit
- ❌ Assume Cursor's code is always correct
- ❌ Use automode on security-critical code without review

---

## Settings: Customizing Cursor

### Recommended Settings

Open settings: Cmd+, (Comma)

```
Search for:

1. "Editor: Format on Save" → Enable
   (Auto-format code with Prettier)

2. "Editor: Tab Size" → Set to 2
   (Match project convention)

3. "Files: Auto Save" → Set to "afterDelay"
   (Auto-save every 1000ms)

4. "Terminal: Integrated Shell" → Set to your shell
   (bash, zsh, etc.)

5. "Cursor: Inline Completions" → Enable/disable based on preference
   (If distracting, disable)
```

### Project-Specific Settings

Settings saved in project:

```
.vscode/settings.json
```

These auto-apply when you open the project in Cursor.

---

## Daily Cursor Workflow

```
Morning:
1. cursor .
2. @beads-xxx (load task)
3. @workspace (or specific folder)
4. Review requirements

Coding:
1. Create files
2. Accept inline suggestions (Tab)
3. Ask Agent mode for complex parts
4. Terminal: npm run test

Quality Check:
1. Terminal: npm run quality:gates
2. If fails: fix in editor
3. If passes: commit

End of Day:
1. Switch to Claude Code
2. /review (security scan)
3. Back to Cursor: fix any issues
4. Final commit
```

---

## Next Steps

### Immediate (Today)

1. Open Cursor
2. Load a task with `@beads-xxx`
3. Write a simple component
4. Accept inline suggestions with Tab
5. Run `npm run test` in terminal

### Short Term (This Week)

1. Try Agent mode on a feature
2. Use chat for questions (Cmd+K)
3. Practice keyboard shortcuts
4. Experiment with automode on tests

### Medium Term (This Month)

1. Master context switching (Claude Code ↔ Cursor)
2. Use Agent mode for complex features
3. Automode for batch operations
4. Teach a teammate Cursor basics

---

## FAQ: Cursor-Specific Questions

**Q: What's the difference between inline suggestions and chat?**
A: Inline suggestions appear as you type (quick, reflexive). Chat is for asking questions (deeper analysis). Use inline for small additions, chat for large blocks or questions.

**Q: Can I use Cursor without Claude Code?**
A: Yes! Cursor works standalone. But for architecture/planning, Claude Code is better. They complement each other.

**Q: Does Cursor support TypeScript?**
A: Yes, fully. Cursor understands TypeScript types and gives better suggestions with TS.

**Q: How do I use Cursor with a large team?**
A: Both developers can use Cursor simultaneously. Each has their own session. Use git to merge changes normally.

**Q: Can I run Cursor on a remote server?**
A: Yes, via VS Code Remote. Same as VS Code.

**Q: Is Cursor better than Claude Code?**
A: They're different. Cursor for coding speed, Claude Code for thinking depth. Use both.

**Q: What's the cost of Cursor?**
A: Check cursor.sh pricing. As of Jan 2026, it's paid subscription or free tier.

**Q: Can I use Cursor offline?**
A: No, Cursor requires internet. It queries AI models continuously.

---

## Resources

- **Getting Started:** First 5 minutes
- **Claude Code Basics:** When you need deep analysis
- **Context Handoff Protocol:** Safe IDE switching
- **Feature Matrix:** Detailed comparison
- **Troubleshooting Guide:** When things break

---

**Document Stats:**

- Total lines: ~750
- Sections: 20+
- Code examples: 15+
- Keyboard shortcuts: 25+
- Tables: 12+
- Workflows: 4+
- Estimated reading time: 30-40 minutes
- Estimated to master: 1-2 weeks with practice

---

⚡ **Cursor is fast because it focuses on code generation. Combine it with Claude Code for architecture, and you ship 3x faster.**

Last updated: January 2026
