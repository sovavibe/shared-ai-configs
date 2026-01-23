# Troubleshooting Guide: Symptom-Based Recovery

> **Purpose:** When something breaks, find your symptom and follow the recovery steps
>
> **Organized by:** What you see (symptom), not what broke (cause)

---

## Quick Symptom Index

| Symptom | File | Time | Difficulty |
|---------|------|------|-----------|
| "IDE is unresponsive" | [IDE Issues](#ide-issues) | 5 min | Easy |
| "I lost my context between IDE switches" | [Context Loss](#context-loss-issues) | 30 min | Medium |
| "Beads is out of sync" | [Beads Issues](#beads-synchronization-issues) | 10 min | Easy |
| "Git is showing weird conflicts" | [Git Issues](#git-issues) | 20 min | Hard |
| "My code won't pass quality gates" | [Quality Gates](#quality-gate-failures) | 20 min | Medium |
| "Tests are failing after I switched IDEs" | [Test Failures](#test-failures) | 30 min | Hard |
| "MCP tools aren't working" | [MCP Issues](#mcp-tool-failures) | 15 min | Medium |
| "My session got corrupted" | [Session Issues](#session-corruption) | 30 min | Hard |

---

## IDE Issues

### IDE Unresponsive (Not Responding to Clicks/Commands)

**Symptoms:**

- ❌ Cursor not moving when you type
- ❌ Commands not executing
- ❌ Chat stuck on loading
- ❌ No response to keyboard input

**Cause:** Usually stuck on hidden dialog or alert

**Recovery (5 min):**

```bash
# Step 1: Check for dialogs (most common cause)
# Look at IDE - is there an alert box visible?
# If YES → Click OK to dismiss

# Step 2: If no visible dialog, check console
# IDE → View → Developer Tools → Console
# Look for JavaScript errors
# Screenshot any errors you see

# Step 3: Force refresh IDE
# Claude Code: /compact  (reduces context)
# Cursor: Ctrl+Shift+P → Reload Window

# Step 4: If still stuck, restart
# Close IDE completely
# Open it again
# Session should resume

# Step 5: If still broken
# Check .claude/hooks/ for errors:
ls -la .claude/hooks/
# See if hooks are causing issues
```

**Prevention:**

- Avoid triggering JavaScript alerts (don't click buttons that say "Delete")
- Run `/compact` if context gets huge (>150K tokens)
- Restart IDE if it feels slow

---

### IDE Running Out of Context

**Symptoms:**

- ⚠️ Responses getting shorter
- ⚠️ "Context limit exceeded" message
- ⚠️ IDE asking "Continue in new session?"
- ⚠️ Performance degrading

**Recovery (5 min):**

```bash
# Step 1: Check current context usage
# In Claude Code terminal:
echo "Checking context usage..."

# Step 2: Compact if needed
/compact

# Step 3: Or start new session
claude --new

# Step 4: Use context-handoff to transfer
# Before new session:
cat .claude/context-handoff/current.md

# After new session:
/recall "previous session context"
```

---

### IDE Suggestions Are Wrong/Useless

**Symptoms:**

- ❌ Cursor suggesting wrong code
- ❌ Claude Code giving irrelevant analysis
- ❌ Both IDEs suggesting same mistake repeatedly
- ❌ Quality gate finding issue Cursor didn't

**Recovery (15 min):**

```bash
# Step 1: Clear context and retry
# Claude Code: /compact
# Cursor: Cmd+Shift+P → Clear History

# Step 2: Provide more specific context
# Instead of: "fix this error"
# Use: "@src/auth/login.tsx I'm getting TypeError on line 47, what's wrong?"

# Step 3: Reference specific files
# @filename narrows focus
# Better suggestions with specific context

# Step 4: Ask Claude Code to verify
# "Does this code look right? Why or why not?"
# Forces explicit thinking

# Step 5: Run quality gates to catch issues
npm run quality:gates
```

---

## Context Loss Issues

### Context Lost Between IDE Switches

**Symptoms:**

- 🚨 "Why was this decision made?"
- 🚨 "I don't know what to do next"
- 🚨 "The architecture is unclear"
- 🚨 Having to re-analyze everything

**Root Cause:** Context handoff wasn't done (or was done poorly)

**Recovery (30 min):**

```bash
# Step 1: Check what context exists
bd show beads-123                    # Task details
cat .claude/context-handoff/current.md  # Latest handoff (if any)

# Step 2: Try to recover from Hindsight
mcp__hindsight-alice__recall "beads-123"
# If this returns useful context, you're lucky

# Step 3: Review git history
git log --oneline -- src/relevant-files/
git show <commit-hash>              # See what changed

# Step 4: If still stuck, re-analyze
# Go to Claude Code
/analyze beads-123                  # Re-break down
# This takes 20 min but recovers context

# Step 5: For future - use handoff protocol
# See: Context-Handoff-Protocol.md
```

**Prevention:**

- Always use Context Handoff Protocol before switching IDEs
- Document "what's done" and "what's next" in context-handoff.md
- Use `/retain` to save key decisions

---

### Session Ended Without Saving Progress

**Symptoms:**

- 😱 "I wrote code but it's gone"
- 😱 "Session closed and I lost context"
- 😱 "Can't find my work from yesterday"
- 😱 "Analysis I did is missing"

**Recovery (30 min):**

```bash
# Step 1: Check git for uncommitted work
git status
git diff HEAD

# If code is there (staged/unstaged):
# Code is safe, just commit it
git add .
git commit -m "recover: unsaved session work"

# Step 2: Check Beads for analysis
bd list --status=in_progress

# Step 3: Check Hindsight memory
mcp__hindsight-alice__recall "session work"

# Step 4: Recover git stash (if any)
git stash list              # See stashed work
git stash pop               # Restore most recent

# Step 5: If still lost
# Check local backups:
ls -la ~/.claude/backups/
ls -la .claude/context-handoff/

# Step 6: If truly lost
# File a session recovery:
bd create \
  --title="Lost work from [date]" \
  --type=bug \
  --priority=0
```

---

## Beads Synchronization Issues

### Beads Out of Sync

**Symptoms:**

- ⚠️ Beads status doesn't match actual work
- ⚠️ Issues show "in_progress" but not started
- ⚠️ "bd ready" doesn't show correct issues
- ⚠️ Can't update issue via `bd update`

**Recovery (10 min):**

```bash
# Step 1: Sync Beads database
bd sync --flush-only

# Step 2: Check database health
bd doctor

# If errors reported:
# Step 3: Reset Beads
rm -rf .beads/
bd prime                    # Re-prime from JSONL

# Step 4: Verify sync worked
bd ready
bd list --status=in_progress

# Step 5: If still broken
# Check JSONL file integrity:
cat issues.jsonl | jq '.' | head -20
```

---

### Can't Create/Update Beads Issues

**Symptoms:**

- ❌ `bd create` fails silently
- ❌ `bd update` gives permission error
- ❌ Issues aren't showing in list
- ❌ "Invalid issue format" error

**Recovery (15 min):**

```bash
# Step 1: Verify Beads is enabled
echo $BD_ENABLED              # Should be 1
# If not:
export BD_ENABLED=1
bd prime

# Step 2: Check Beads permission
ls -la .beads/
# Should be writable (not 000)

# Step 3: Try manual creation
bd create \
  --title="Test issue" \
  --type=task \
  --priority=2

# Step 4: If error, get full details
bd create ... 2>&1 | tee bd-error.log
# Review error.log for specific issue

# Step 5: If still stuck
# Manual JSONL creation (last resort):
cat >> issues.jsonl << 'EOF'
{"id":"manual-123","title":"Test","type":"task","status":"open"}
EOF
bd prime
```

---

## Git Issues

### Git Merge Conflicts After IDE Switch

**Symptoms:**

- 🔴 Git shows "CONFLICT" markers
- 🔴 Files with `<<<<< HEAD` sections
- 🔴 Can't merge branch
- 🔴 "Please fix conflicts before merging"

**Recovery (20 min):**

```bash
# Step 1: See what's conflicting
git diff --name-only --diff-filter=U

# Step 2: Understand what happened
git show HEAD:src/conflicting-file.tsx     # Main branch version
git show MERGE_HEAD:src/conflicting-file.tsx  # Your branch version

# Step 3: Fix each conflict manually
# Open file, find <<<< HEAD markers
# Choose which version to keep
# Remove conflict markers
# Save file

# Step 4: Mark as resolved
git add src/conflicting-file.tsx

# Step 5: Complete merge
git commit -m "resolve: merge conflicts from IDE switch"

# Step 6: If merge is complicated
# Abort and redo:
git merge --abort
# Back up to Claude Code for /architect guidance
# Then redo merge cleanly
```

**Prevention:**

- Commit all work before IDE switch
- Use Context Handoff Protocol (includes git status check)
- Don't modify same files in both IDEs simultaneously

---

## Quality Gate Failures

### Quality Gates Fail After IDE Switch

**Symptoms:**

- ❌ `npm run quality:gates` failed
- ❌ ESLint errors appeared
- ❌ TypeScript errors in files you didn't touch
- ❌ Test failures in unexpected places

**Recovery (20 min):**

```bash
# Step 1: Run gates with verbose output
npm run quality:gates 2>&1 | tee gates-error.log

# Step 2: Read error message carefully
# Common errors:
# - ESLint: Code style issue (usually auto-fixable)
# - TypeScript: Type error (logic issue)
# - Tests: Something broken (logic issue)

# Step 3: If ESLint
npm run lint -- --fix              # Auto-fix style
npm run quality:gates              # Re-run

# Step 4: If TypeScript or Tests
# Ask Cursor or Claude Code:
# "Why is this TypeScript error happening?"
# Apply suggested fix

# Step 5: Re-run until passing
npm run quality:gates

# Step 6: Only commit after passing
```

---

## Test Failures

### Tests Failing After IDE Switch

**Symptoms:**

- ❌ Tests passed in Cursor, fail in Claude Code
- ❌ Tests passed yesterday, fail today
- ❌ Test timeout errors
- ❌ Mock not working as expected

**Recovery (30 min):**

```bash
# Step 1: Run test with more info
npm run test -- --verbose

# Step 2: Run specific failing test
npm run test -- src/MyComponent.test.tsx

# Step 3: Get test output
npm run test -- --reporter=verbose --bail

# Step 4: Common issues and fixes:

# Issue: Mock not set up
# Fix: Check src/mocks/ folder
# Ensure handler is defined

# Issue: Async not working
# Fix: Add waitFor() from testing library
# import { waitFor } from '@testing-library/react'

# Issue: Timeout
# Fix: Add timeout parameter
# jest.setTimeout(10000)

# Step 5: Ask IDE for help
# Cursor: /test with full component
# Claude Code: "Why is this test failing?"

# Step 6: Re-run after fix
npm run test
```

---

## MCP Tool Failures

### MCP Tools Not Working

**Symptoms:**

- ❌ Hindsight not working (`/recall` returns nothing)
- ❌ Context7 lookup fails
- ❌ WebSearch returns no results
- ❌ Snyk scan won't run

**Recovery (15 min):**

```bash
# Step 1: Check MCP server health
/mcp

# Step 2: If server shows error, restart
# Claude Code: Exit and reopen
# Cursor: Cmd+Shift+P → Reload

# Step 3: Try MCP call again
mcp__hindsight-alice__recall "test"

# Step 4: If specific tool broken

# For Hindsight:
mcp__hindsight-alice__retain "test message"
# Then: /recall "test"

# For Context7:
mcp__MCP_DOCKER__resolve-library-id "react"

# For Snyk:
mcp__Snyk__snyk_version

# Step 5: If still broken, check logs
# Claude Code: look at terminal for errors
# Cursor: Cmd+Shift+P → Output

# Step 6: Reset MCP configuration
# Edit .claude/settings.json
# Verify mcp.json has all servers
# Restart IDE
```

---

## Session Corruption

### Session Got Corrupted / Won't Load

**Symptoms:**

- 🚨 "Session corrupt" error
- 🚨 IDE won't load previous session
- 🚨 `claude --continue` fails
- 🚨 `.claude/` directory has strange files

**Recovery (30 min):**

```bash
# Step 1: Check session files
ls -la ~/.claude/sessions/
ls -la .claude/context-handoff/

# Step 2: Try manual recovery
claude --new              # Start fresh session

# Step 3: Restore context manually
# If you had context-handoff.md:
cat .claude/context-handoff/current.md
# Re-read to rebuild context

# Step 4: If session directory broken
# Backup then reset:
mv ~/.claude/sessions ~/.claude/sessions.backup
claude --new

# Step 5: Check Beads for work
bd ready                  # See what needs doing

# Step 6: If truly stuck
# Start fresh:
cd /Users/ap/work/Front
rm -rf .claude/context-handoff/*
claude --new
bd prime
```

---

## IDE Performance Issues

### IDE Running Slow

**Symptoms:**

- ⚠️ Responses taking >30 seconds
- ⚠️ IDE lagging/freezing
- ⚠️ Cursor suggestions delayed
- ⚠️ Claude Code thinking forever

**Recovery (10 min):**

```bash
# Step 1: Check context size
# Claude Code: /compact (reduces from 180K to 60K)

# Step 2: Close other apps (frees RAM)
# Check Activity Monitor (Mac) or Task Manager (Windows)

# Step 3: If Claude Code slow:
# Try Sonnet instead of Opus
/model sonnet

# Step 4: If Cursor slow:
# Disable extensions (extensions can be slow)
# Cmd+Shift+P → Extensions: Disable All

# Step 5: Restart IDE completely
# Cold restart often fixes performance

# Step 6: If still slow:
# Check internet connection
# MCP servers can be slow if connection is bad
```

---

## Common Error Messages & Fixes

| Error | Cause | Fix | Time |
|-------|-------|-----|------|
| "Token limit exceeded" | Too much context | `/compact` or new session | 5 min |
| "Connection timeout" | Network issue | Check internet, retry | 5 min |
| "Invalid JSON in Beads" | Corrupted JSONL | `bd prime` | 5 min |
| "Permission denied .beads/" | Wrong permissions | `chmod 755 .beads/` | 5 min |
| "ESLint error" | Code style | `npm run lint -- --fix` | 5 min |
| "TypeScript error" | Type issue | Fix types, verify logic | 15 min |
| "Test failed" | Logic error | Debug test, fix code | 20 min |
| "Git merge conflict" | Both IDEs edited same file | Manual resolve | 20 min |
| "Beads out of sync" | Database stale | `bd sync --flush-only` | 5 min |
| "MCP tool not working" | Server down | Restart IDE, `/mcp` check | 10 min |

---

## Prevention Tips

### Don't Let Problems Happen

```
✅ ALWAYS:
- Run quality gates before committing
- Use Context Handoff Protocol before IDE switch
- Save decisions with /retain
- Keep Beads updated
- Commit work regularly

❌ NEVER:
- Switch IDEs without syncing Beads
- Leave uncommitted code overnight
- Ignore quality gate failures
- Skip context documentation
- Run rm -rf / (obvious, but worth mentioning!)
```

---

## Getting Help

| Problem | Where to Go | Time |
|---------|------------|------|
| "IDE won't respond" | Restart, then check console | 10 min |
| "Context lost" | Use /recall or context-handoff.md | 20 min |
| "Beads broken" | bd doctor and bd sync | 10 min |
| "Git conflict" | Manual resolve or Claude Code /architect | 30 min |
| "Tests failing" | Cursor /test for guidance | 20 min |
| "Performance issue" | /compact or restart IDE | 10 min |
| "Complex problem" | Claude Code in Opus mode | 30 min |

---

## When to Escalate (Ask Tech Lead)

- 🔴 Can't resolve conflict after 30 min
- 🔴 Data loss suspected
- 🔴 Production issue affecting team
- 🔴 Needs architectural decision
- 🔴 Security concern
- 🔴 Can't find root cause after analysis

---

## Advanced: Manual Recovery Procedures

### Reset Beads Completely (Last Resort)

```bash
# WARNING: This loses all local beads state

# Step 1: Backup current state
cp -r .beads/ .beads.backup
cp issues.jsonl issues.jsonl.backup

# Step 2: Reset
rm -rf .beads/
bd prime

# Step 3: Verify
bd ready
bd list

# Step 4: If issues.jsonl got corrupted
# Get fresh from git:
git checkout issues.jsonl
bd prime
```

### Recover Lost Git History

```bash
# If you accidentally deleted commits

# Step 1: Find what you lost
git reflog              # Shows all commits, even deleted

# Step 2: Restore branch to old commit
git reset --hard <commit-hash>

# Step 3: Force push if needed (ask tech lead first!)
git push origin --force-with-lease
```

---

## Quick Reference Card

```
🚨 Emergency Commands:

# IDE frozen?
Cmd+Q (quit) → Restart

# Context too big?
/compact

# Beads broken?
bd sync --flush-only

# Tests failing?
npm run test -- --watch

# Git confused?
git status (always first)

# Need help?
bd ready (see available tasks)
```

---

**Remember:** Most problems have simple fixes. Read the error message carefully first. Google often has the answer. Ask team for help if stuck > 30 min.

🆘 **Still stuck?** Escalate to Tech Lead or create a bug in Beads!
