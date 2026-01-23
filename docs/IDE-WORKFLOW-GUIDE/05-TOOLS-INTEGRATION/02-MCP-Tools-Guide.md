# MCP Tools Guide: External Capabilities in Your IDE

> **Purpose:** Comprehensive guide to MCP (Model Context Protocol) tools available in Claude Code and Cursor, including multi-session memory, library documentation, security scanning, and external models.
>
> **Use this when:** "How do I remember things across sessions?", "How do I look up library docs?", "How do I scan for security issues?", "What are PAL tools?"

---

## What Are MCP Tools?

### The Problem They Solve

When working on projects, you often need:

- **Long-term memory**: "What decision did we make about error handling last month?"
- **External knowledge**: "What's the API for this library I haven't used before?"
- **Security feedback**: "Does this code have vulnerabilities?"
- **Expert perspective**: "What would an experienced architect think about this design?"

Without MCP tools:

- ❌ Search through chat history
- ❌ Download library docs separately
- ❌ Run security tools manually
- ❌ Can't consult external experts quickly

With MCP tools:

- ✅ Recall decisions from past sessions
- ✅ Look up library docs directly in IDE
- ✅ Scan code automatically for issues
- ✅ Get external expert review instantly

### MCP Architecture

```
Claude Code/Cursor
      ↓
  MCP Protocol
      ↓
 MCP Servers
 ├─ Hindsight (multi-session memory)
 ├─ Context7 (library documentation)
 ├─ Snyk (security scanning)
 ├─ PAL (external models)
 ├─ Jira/Confluence (project management)
 └─ ... more
```

**MCP** = Model Context Protocol = standardized way for Claude to talk to external services without switching tools.

---

## MCP Servers and Their Tools

### 1. Hindsight: Multi-Session Memory

**What it does:** Remember important decisions, learnings, and context across multiple sessions.

**When to use:**

- ✅ Remember architecture decisions from weeks ago
- ✅ Recall past project patterns
- ✅ Find "we tried this before" solutions
- ✅ Share learnings across team members

**Available commands:**

```bash
# Recall past sessions
mcp__hindsight-alice__recall "How do we handle async errors?"

# Save important decisions
mcp__hindsight-alice__retain "Decision: Use Zustand for state (not Redux) because simpler API for team"

# Synthesize multiple decisions
mcp__hindsight-alice__reflect "What patterns have we established for form validation?"
```

**How it works internally:**

1. At session start: Claude Code loads recent sessions via `bd ready` hook
2. During work: You can ask Claude to recall decisions
3. At session end: You save learnings with `/retain`
4. Next session: Hindsight loads your recalls automatically

### 2. Context7: Library Documentation Lookup

**What it does:** Fetch current documentation for any library without leaving your IDE.

**When to use:**

- ✅ "What's the API for TanStack Query mutations?"
- ✅ "How do I use Zustand's persist middleware?"
- ✅ "Show me Ant Design Button component props"
- ✅ "What's the TypeScript type for FormInstance?"

**Available commands:**

```bash
# Look up library (automatically finds best match)
mcp__MCP_DOCKER__resolve-library-id "tanstack query"

# Get full documentation
mcp__MCP_DOCKER__get-library-docs "/tanstack/query" --topic="mutations"

# Another example
mcp__MCP_DOCKER__get-library-docs "/ant-design/ant-design" --topic="form"
```

**How to use in Claude Code:**

```
Q: How do I use Zustand's persist middleware?

Claude will:
1. Resolve library ID for Zustand
2. Fetch latest documentation
3. Search for "persist" topic
4. Show you exact API with examples
```

### 3. Snyk: Security Scanning

**What it does:** Scan code, dependencies, and containers for known vulnerabilities and misconfigurations.

**When to use:**

- ✅ Before committing (check for secrets)
- ✅ After adding dependencies
- ✅ Scanning infrastructure code
- ✅ Container image scanning

**Available commands:**

```bash
# Scan source code for vulnerabilities
mcp__Snyk__snyk_code_scan "/Users/ap/work/Front/src" --severity_threshold="high"

# Scan dependencies (package.json, etc.)
mcp__Snyk__snyk_sca_scan "/Users/ap/work/Front" --path="/Users/ap/work/Front"

# Scan Docker image
mcp__Snyk__snyk_container_scan image="my-app:latest"

# Scan IaC (Terraform, Kubernetes, etc.)
mcp__Snyk__snyk_iac_scan "/Users/ap/work/Front/infrastructure"

# Authenticate first time
mcp__Snyk__snyk_auth
```

### 4. PAL: External Models

**What it does:** Consult other AI models (GPT-5, GLM-4.7, etc.) for external perspective.

**When to use:**

- ✅ Get second opinion on design (not via PAL - use Opus directly)
- ✅ Routine implementation guidance
- ✅ Quick fact-checking
- ⚠️ NOT for critical architecture (use Opus directly)

**Available commands:**

```bash
# Chat with external model
mcp__pal__chat \
  "Is my React hook pattern correct?" \
  --model="gpt-5.2" \
  --thinking_mode="high"

# Deep analysis
mcp__pal__thinkdeep \
  "Root cause of this bug" \
  --model="gpt-5.1-codex"

# Code review
mcp__pal__codereview \
  "/Users/ap/work/Front/src/components" \
  --model="gpt-5.2-pro"
```

### 5. Jira/Confluence: Project Management

**What it does:** Create, update, and view Jira issues and Confluence pages without switching tools.

**When to use:**

- ✅ Link code to Jira tickets
- ✅ Update issue status from CLI
- ✅ Search Confluence for documentation
- ✅ Add comments to issues

**Available commands:**

```bash
# Create Jira issue
mcp__MCP_DOCKER__jira_create_issue \
  "PROJ" \
  "Fix login button styling" \
  "Bug" \
  "frontend"

# Search Confluence
mcp__MCP_DOCKER__confluence_search "API error handling patterns"

# Get Confluence page
mcp__MCP_DOCKER__confluence_get_page "page-id-123"
```

### 6. Snyk Integration: Detailed Breakdown

Snyk works with multiple project types:

```bash
# Python project
mcp__Snyk__snyk_sca_scan \
  "/Users/ap/work/Front" \
  --command="python3" \
  --dev

# Node.js project
mcp__Snyk__snyk_sca_scan \
  "/Users/ap/work/Front" \
  --dev

# Terraform IaC
mcp__Snyk__snyk_iac_scan "/Users/ap/work/Front/infrastructure"

# Docker image
mcp__Snyk__snyk_container_scan \
  image="my-app:latest" \
  --exclude_base_image_vulns
```

---

## Tool Invocation: The mcp__ Syntax

### How to Call MCP Tools

**Format:**

```
mcp__[SERVER]__[TOOL]
  --param1="value"
  --param2="value"
```

**Examples:**

```bash
# Hindsight recall
mcp__hindsight-alice__recall "error handling patterns"

# Context7 docs
mcp__MCP_DOCKER__resolve-library-id "react"

# Snyk scan
mcp__Snyk__snyk_code_scan "/path/to/code" --severity_threshold="high"

# PAL chat
mcp__pal__chat "Is this pattern good?" --model="gpt-5.2"
```

### In Claude Code vs Cursor

| Tool | Claude Code | Cursor | Notes |
|------|-------------|--------|-------|
| Hindsight | ✅ Full | ❌ | Multi-session memory for Claude Code only |
| Context7 | ✅ Full | ✅ Full | Both IDEs can look up docs |
| Snyk | ✅ Auto in /review | ⚠️ Manual | Claude Code integrates it, Cursor requires manual invocation |
| PAL | ✅ Full | ⚠️ Limited | Claude Code has better integration |
| Jira/Confluence | ✅ Full | ✅ Full | Both can access project management tools |

---

## Common Workflows Using MCP Tools

### Workflow 1: Researching a Library (Context7)

**Scenario:** You need to implement persistent state with Zustand but haven't used it before.

```bash
# Step 1: Resolve library ID
mcp__MCP_DOCKER__resolve-library-id "zustand"

# Step 2: Get documentation on persistence
mcp__MCP_DOCKER__get-library-docs "/pmndrs/zustand" --topic="persist"

# Step 3: Read through examples in docs
# "Perfect, I see how to use create(persist(...))"

# Step 4: Implement with confidence
# ... write code ...
```

### Workflow 2: Recalling Past Decisions (Hindsight)

**Scenario:** You need to handle form errors. You remember the team decided on a pattern.

```bash
# Step 1: Recall decision from past session
mcp__hindsight-alice__recall "What's our pattern for form error handling?"

# Step 2: Hindsight returns:
# "Decision: Use field-level errors with red borders.
#  Don't show error modals. Display summary above form."

# Step 3: Implement based on recalled decision
# ... confident you're following established pattern ...

# Step 4: When done, save variant if needed
mcp__hindsight-alice__retain "Form error pattern works well with Ant Design Form component"
```

### Workflow 3: Security Scan Before Commit (Snyk)

**Scenario:** You're about to push code. Need to verify no secrets are exposed.

```bash
# Step 1: Run code security scan
mcp__Snyk__snyk_code_scan "/Users/ap/work/Front/src" --severity_threshold="high"

# Step 2: Snyk finds issue:
# "Hardcoded API key in utils/api.ts line 42"

# Step 3: Fix it
# Remove hardcoded key, use process.env.API_KEY

# Step 4: Re-scan to verify
mcp__Snyk__snyk_code_scan "/Users/ap/work/Front/src" --severity_threshold="high"

# Step 5: Scan dependencies
mcp__Snyk__snyk_sca_scan "/Users/ap/work/Front"

# Step 6: All clear, proceed with commit
```

### Workflow 4: Getting External Expert Review (PAL)

**Scenario:** You've designed a solution but want external perspective before implementing.

```bash
# Step 1: Set up problem in chat
# "Here's my React hook for form state management. Should I use context or Zustand?"

# Step 2: Claude Code suggests using PAL for external perspective
# "Would you like me to consult an external model for comparison?"

# Step 3: Ask Claude to use PAL
mcp__pal__chat \
  "Compare context vs Zustand for form state management" \
  --model="gpt-5.2" \
  --thinking_mode="high"

# Step 4: External model provides perspective
# "Zustand is better for reusability, Context is better for colocation"

# Step 5: Make informed decision
# "We'll use Zustand for this shared form across multiple pages"
```

### Workflow 5: Linking Code to Jira (Jira Integration)

**Scenario:** You're fixing a bug and need to update Jira.

```bash
# Step 1: See Jira issue
# Issue: "PROJ-123: Login button unclickable on mobile"

# Step 2: Start work
bd update beads-123 --status=in_progress

# Step 3: Fix code
# ... implement fix ...

# Step 4: Add comment to Jira
mcp__MCP_DOCKER__jira_add_comment "PROJ-123" \
  "Fixed issue by adding touch event listeners to button"

# Step 5: Update Jira status
mcp__MCP_DOCKER__jira_transition_issue "PROJ-123" "11"  # 11 = "Done"

# Step 6: Close Beads task
bd update beads-123 --status=done
```

### Workflow 6: Team Documentation Search (Confluence)

**Scenario:** You need to understand error handling patterns the team documented.

```bash
# Step 1: Search Confluence
mcp__MCP_DOCKER__confluence_search "API error handling"

# Step 2: Get full page
mcp__MCP_DOCKER__confluence_get_page "12345678" --convert_to_markdown=true

# Step 3: Read patterns
# "We use: 1) User-friendly error messages, 2) Error logging, 3) Retry logic"

# Step 4: Implement following documented pattern
# ... confident in approach ...
```

---

## Snyk Deep Dive: Security Scanning

### Snyk Code Scan (SAST)

Static Application Security Testing - analyzes source code without running it.

```bash
# Basic scan
mcp__Snyk__snyk_code_scan "/Users/ap/work/Front/src"

# With severity threshold
mcp__Snyk__snyk_code_scan "/Users/ap/work/Front/src" --severity_threshold="high"

# Debug mode (verbose output)
mcp__Snyk__snyk_code_scan "/Users/ap/work/Front/src" --debug
```

**What it detects:**

- Hardcoded secrets (API keys, tokens)
- SQL injection vulnerabilities
- Cross-site scripting (XSS)
- Insecure cryptography
- Unsafe logging

### Snyk SCA Scan (Software Composition Analysis)

Scans dependencies for known vulnerabilities.

```bash
# Scan node dependencies
mcp__Snyk__snyk_sca_scan "/Users/ap/work/Front"

# Include dev dependencies
mcp__Snyk__snyk_sca_scan "/Users/ap/work/Front" --dev

# Show all deps (not just vulnerable)
mcp__Snyk__snyk_sca_scan "/Users/ap/work/Front" --print_deps
```

**What it detects:**

- Outdated packages
- Packages with known CVEs
- License compliance issues
- Transitive dependency vulnerabilities

### Snyk IaC Scan

Infrastructure as Code security analysis.

```bash
# Scan Terraform
mcp__Snyk__snyk_iac_scan "/Users/ap/work/Front/infrastructure"

# Report to Snyk UI
mcp__Snyk__snyk_iac_scan "/Users/ap/work/Front/infrastructure" --report
```

**What it detects:**

- Overly permissive security groups
- Unencrypted storage
- Missing authentication
- Insecure defaults

---

## PAL Tools Deep Dive

### When to Use PAL vs Opus

**Use Opus directly (Claude Code):**

- ✅ Critical architecture decisions
- ✅ Deep code review
- ✅ Security analysis
- ✅ Complex debugging

**Use PAL for:**

- ✅ Routine research
- ✅ Quick second opinion
- ✅ Implementation guidance
- ✅ External perspective on solved problems

**Rule of thumb:** If the decision matters and will affect the system for months, use Opus. If it's a "quick sanity check", use PAL.

### PAL Tools Available

```bash
# Chat with external model
mcp__pal__chat "question" --model="gpt-5.2" --thinking_mode="high"

# Deep thinking for complex problems
mcp__pal__thinkdeep \
  --hypothesis="Root cause of the bug" \
  --model="gpt-5.1-codex" \
  --step=1 \
  --total_steps=3

# Code review via external model
mcp__pal__codereview \
  "/Users/ap/work/Front/src" \
  --model="gpt-5.2-pro" \
  --review_type="security"

# Build consensus across models
mcp__pal__consensus \
  "Should we migrate to X or Y?" \
  --models=["gpt-5.2", "claude-opus", "gpt-5.1-codex"]
```

### PAL Model Selection

Available models (varies by subscription):

- **gpt-5.2**: Latest GPT, good reasoning
- **gpt-5.1-codex**: Code specialist
- **gpt-5.2-pro**: Enhanced reasoning
- **claude-opus**: Best Anthropic reasoning (usually keep in Claude Code for critical work)

---

## Token Cost Comparison

MCP tools have different token costs. Plan accordingly:

| Tool | Cost | Use Case |
|------|------|----------|
| Hindsight `recall` | ~500 tokens | Quick lookup |
| Context7 docs | ~2000-5000 tokens | Library research |
| Snyk scan | ~0 tokens (local) | Security check |
| PAL chat | ~5000-10000 tokens | External opinion |
| PAL thinkdeep | ~15000+ tokens | Complex problem |
| PAL consensus | ~20000+ tokens | Multiple models |

**Strategy:** Use Context7 and Hindsight liberally (cheap). Use PAL thoughtfully (expensive).

---

## Tool Health Checking

### Check MCP Server Status

```bash
# See all available MCP tools
/mcp

# Expected output:
# MCP Status:
# ✅ Hindsight (alice) - Connected
# ✅ Context7 - Connected
# ✅ Snyk - Connected
# ✅ PAL - Connected
# ✅ Jira - Connected
# ✅ Confluence - Connected
```

### Troubleshooting Tool Issues

```bash
# Tool not responding?
# 1. Check MCP status
/mcp

# 2. If server shows ❌ Disconnected:
# - Check internet connection
# - Check authentication (especially Snyk, Jira)
# - Restart Claude Code

# 3. For authentication issues
mcp__Snyk__snyk_auth    # Re-authenticate Snyk
mcp__MCP_DOCKER__jira_get_all_projects  # Test Jira connection

# 4. Clear cache if tool seems stuck
# (Usually automatic, but can help)
```

### Authentication

Most tools require one-time auth:

```bash
# Snyk
mcp__Snyk__snyk_auth

# Jira
# Uses browser OAuth, should be automatic

# Confluence
# Uses Jira credentials

# PAL tools
# Inherit Claude authentication, no extra setup needed
```

---

## Integration with IDE Workflow

### In Claude Code

MCP tools are native:

```bash
# Use slash commands to invoke
/recall "past decisions"
/review (includes Snyk scanning)
/architect (uses Context7 for library patterns)

# Or invoke directly
mcp__hindsight-alice__recall "..."
```

### In Cursor

MCP tools are available but not integrated into slash commands:

```bash
# In Cursor, mostly use direct invocation
mcp__MCP_DOCKER__resolve-library-id "library-name"
mcp__Snyk__snyk_code_scan "/path"

# Some tools like Context7 are available via @
@context7
```

### Context Handoff Protocol

When switching between IDEs, MCP tools keep you synced:

```bash
Claude Code:
1. Use /retain to save decisions
2. Update Beads status
3. bd sync --flush-only

↓ Switch to Cursor

Cursor:
1. bd sync --pull (get latest)
2. Ask about past decisions
3. Can't directly recall (no Hindsight), but can see Beads comments

↓ Switch back to Claude Code

Claude Code:
1. mcp__hindsight-alice__recall (get full memory)
2. bd show beads-X (see all comments)
3. Continue work
```

---

## Real-World Integration Examples

### Example 1: Bug Investigation Workflow

```bash
# 1. Start with problem
# "Users reporting random crashes in payment form"

# 2. Use PAL to brainstorm causes
mcp__pal__chat "What causes form crashes in React?" \
  --model="gpt-5.2" --thinking_mode="high"

# 3. Review code for issues
mcp__Snyk__snyk_code_scan "/Users/ap/work/Front/src" --severity_threshold="high"

# 4. Recall if team discussed this before
mcp__hindsight-alice__recall "Form crash patterns we've seen"

# 5. Check if deps are outdated
mcp__Snyk__snyk_sca_scan "/Users/ap/work/Front"

# 6. Implement fix based on findings

# 7. Update task
bd update beads-123 --status=review --comment="Fixed: Added error boundary to form"
```

### Example 2: Architecture Decision Workflow

```bash
# 1. Problem
# "Should we use Zustand or Redux for this feature?"

# 2. Get current best practices
mcp__MCP_DOCKER__get-library-docs "/pmndrs/zustand"
mcp__MCP_DOCKER__get-library-docs "/reduxjs/redux"

# 3. Recall team preferences
mcp__hindsight-alice__recall "State management patterns we prefer"

# 4. Use Opus directly (critical decision)
# "Compare these options based on our codebase"
# (This uses Claude Code's Opus model directly)

# 5. Save decision
mcp__hindsight-alice__retain "Decision: Use Zustand because lighter, team already familiar, smaller bundle"

# 6. Update architecture documentation
mcp__MCP_DOCKER__confluence_get_page "architecture-doc"
```

### Example 3: Security-First Commit Workflow

```bash
# Before commit, run all security checks

# 1. Scan source code
mcp__Snyk__snyk_code_scan "/Users/ap/work/Front/src" --severity_threshold="high"

# 2. Scan dependencies
mcp__Snyk__snyk_sca_scan "/Users/ap/work/Front" --dev

# 3. Scan IaC if modified
mcp__Snyk__snyk_iac_scan "/Users/ap/work/Front/infrastructure"

# 4. If all clear
bd sync --flush-only
git commit -m "feat: add user preferences"
git push

# All security checks completed in < 1 minute
```

---

## Quick Reference

### Most Used Commands

```bash
# Remember decisions across sessions
mcp__hindsight-alice__recall "Question?"

# Look up library docs
mcp__MCP_DOCKER__resolve-library-id "library-name"
mcp__MCP_DOCKER__get-library-docs "/org/library" --topic="feature"

# Security scan before commit
mcp__Snyk__snyk_code_scan "/path" --severity_threshold="high"

# Get external expert opinion
mcp__pal__chat "question" --model="gpt-5.2"

# Save important decision
mcp__hindsight-alice__retain "Decision: Use X because Y"
```

### Problem → Solution Mapping

| Problem | MCP Tool |
|---------|----------|
| "I forgot how we handle this" | Hindsight recall |
| "What's the API for this library?" | Context7 |
| "Does this code have security issues?" | Snyk |
| "Get a second opinion" | PAL chat |
| "What's the best practice?" | Context7 + PAL |
| "Need to update Jira" | Jira tools |
| "Search team docs" | Confluence |

---

## Best Practices

### ✅ DO

1. **Save decisions with Hindsight** - Use `/retain` regularly
2. **Use Context7 before coding** - Don't guess library APIs
3. **Scan for security every commit** - Make it automatic
4. **Use PAL for opinions** - Not for critical decisions
5. **Check tool status** - Use `/mcp` if things seem slow
6. **Authenticate once** - Set up Snyk, Jira, etc. early

### ❌ DON'T

1. **Don't guess library APIs** - Always use Context7
2. **Don't ignore Snyk warnings** - Fix before commit
3. **Don't make critical decisions via PAL** - Use Opus directly
4. **Don't re-invent patterns** - Recall via Hindsight first
5. **Don't skip authentication** - Set up tools once, use forever
6. **Don't let MCP tools get out of sync** - Keep `/mcp` green

---

## Key Takeaway

**MCP tools extend your capabilities without leaving your IDE.**

- **Hindsight**: Remember across sessions
- **Context7**: Learn any library fast
- **Snyk**: Secure your code automatically
- **PAL**: Get external expertise
- **Jira/Confluence**: Manage projects without context switching

**Workflow:** Think (Hindsight + Context7) → Build (code) → Review (Snyk) → Decide (PAL or Opus) → Document (Confluence/Beads)

---

**Next:** See `Quality-Gates-Integration.md` to learn about automatic code quality checks and security verification before every commit.
