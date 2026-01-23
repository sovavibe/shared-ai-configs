# Tools Integration: Comprehensive Guide

> **Overview:** Complete documentation for integrating development tools into your IDE workflow: task management (Beads), external capabilities (MCP tools), and code quality (gates).

---

## 📚 Documentation Structure

This directory contains three comprehensive guides covering all tools you'll use in daily development:

### 1. **Beads Integration** (`01-Beads-Integration.md`) — ~1070 lines

Complete guide to task management system integrated into your CLI workflow.

**Covers:**

- What Beads is and why we use it over Jira/GitHub Issues
- Setup: Enabling `BD_ENABLED=1`
- Creating tasks: `bd create` with all options
- Updating status: Moving tasks through workflow
- Viewing and filtering: Finding your work
- Dependencies and blocking: Managing task relationships
- Syncing: `bd sync --flush-only` explained
- 4 common workflows (epic creation, bug tracking, sprint planning, team coordination)
- Troubleshooting: Connection issues, permissions, sync conflicts
- Integration with Context Handoff Protocol
- Team collaboration patterns

**Use this when:**

- "How do I create a task?"
- "What does Beads do?"
- "How do I track work across both IDEs?"
- "What's blocking this task?"
- "How do I coordinate with my team?"

---

### 2. **MCP Tools Guide** (`02-MCP-Tools-Guide.md`) — ~800 lines

Guide to external capabilities: multi-session memory, library documentation, security scanning, and external models.

**Covers:**

- What MCP (Model Context Protocol) tools are and why they matter
- MCP server breakdown (Hindsight, Context7, Snyk, PAL, Jira/Confluence)
- Tool invocation syntax: `mcp__` commands
- Hindsight: Multi-session memory (recall, retain, reflect)
- Context7: Library documentation lookup
- Snyk: Security scanning (code, dependencies, IaC)
- PAL: External models (chat, thinkdeep, codereview, consensus)
- When to use each tool (decision trees)
- 6 real-world workflows (research library, recall decisions, security scans, external review, Jira linking, Confluence search)
- Token cost comparison
- Tool health checking: `/mcp` command
- Integration with IDE workflow (Claude Code vs Cursor)
- Integration with Context Handoff Protocol

**Use this when:**

- "How do I remember past decisions?"
- "What's the API for this library?"
- "Does this code have security issues?"
- "Should I use Zustand or Redux?"
- "How do I link code to Jira?"
- "Where's that documentation about error handling?"

---

### 3. **Quality Gates Integration** (`03-Quality-Gates-Integration.md`) — ~1025 lines

Complete guide to automatic code quality verification: ESLint, TypeScript, Tests, Secretlint.

**Covers:**

- What quality gates are and why they matter
- Gate architecture: When and where gates run
- Detailed breakdown of each gate:
  - ESLint (code style and patterns)
  - TypeScript (type safety)
  - Tests (unit and integration)
  - Secretlint (no hardcoded secrets)
- Running gates manually: `npm run quality:gates`
- How to fix common failures: Complete troubleshooting for each gate
- Gate integration with IDE workflow
- When gates are checked (pre-commit, CI/CD, before merge)
- Bypassing gates responsibly (and why you shouldn't)
- Team expectations and discipline
- Troubleshooting gate issues (Husky not running, CI failures, flaky tests)
- Performance optimization
- Quick reference commands

**Use this when:**

- "What's this linting error?"
- "Why won't my commit go through?"
- "How do I fix type errors?"
- "What's a failing test?"
- "How do I move to environment variables?"
- "Are there secrets in my code?"

---

## 🎯 Quick Navigation

### By Task

| Task | Document | Section |
|------|----------|---------|
| Create a task | Beads | "Creating Tasks: `bd create`" |
| Look up library docs | MCP | "Context7: Library Documentation Lookup" |
| Fix linting errors | Quality Gates | "How to Fix Common Gate Failures" |
| Track bug from report to fix | Beads | "Workflow 2: Tracking Bug from Report to Fix" |
| Run security scan | MCP/Quality Gates | "Snyk Deep Dive" / "Secretlint Failures" |
| Remember past decisions | MCP | "Hindsight: Multi-Session Memory" |
| Update task status | Beads | "Updating Task Status: `bd update`" |
| Coordinate with team | Beads | "Team Collaboration Patterns" |
| Share insights across sessions | MCP | "Workflow 1: Researching a Library" |
| Plan sprint | Beads | "Workflow 3: Planning Sprint with Dependencies" |

### By Problem

| Problem | Document | Section |
|---------|----------|---------|
| "Unused variable" error | Quality Gates | "ESLint Failures" |
| "Type 'string \| undefined' is not assignable" | Quality Gates | "TypeScript Failures" |
| "High entropy string detected" | Quality Gates | "Secretlint Failures" |
| "Beads not found" command | Beads | "Troubleshooting Common Issues" |
| "BD_ENABLED=1 not working" | Beads | "Issue 2: BD_ENABLED=1 not working" |
| "How do I recall past decisions?" | MCP | "Hindsight: Multi-Session Memory" |
| "Need second opinion on design" | MCP | "PAL: External Models" |
| "Task blocked by other task" | Beads | "Dependencies and Blocking" |
| "Switching between IDEs" | Beads/MCP | "Integration with Context Handoff Protocol" |
| "Security issue in code?" | MCP/Quality Gates | "Snyk Deep Dive" / "Secretlint" |

### By Role

| Role | Start With | Then | Then |
|------|-----------|------|------|
| **Developer** | Quality Gates | Beads | MCP (Context7) |
| **Tech Lead** | Beads | MCP (Hindsight) | Quality Gates |
| **QA Engineer** | Quality Gates (Tests) | Beads | MCP (Snyk) |
| **Analyst** | Beads | MCP (Context7, PAL) | Quality Gates |

---

## 🔄 Integration Between Tools

### Typical Workflow

```
1. Start Session
   ├─ bd ready              (Beads: see your work)
   ├─ /recall               (MCP: remember past decisions)
   └─ /mcp                  (Check tool status)

2. Do Work
   ├─ Context7              (MCP: look up library docs)
   ├─ Write code
   ├─ bd update             (Beads: update progress)
   └─ npm run test          (Quality gates: verify)

3. Before Commit
   ├─ npm run quality:gates (All 4 gates)
   ├─ Snyk scan             (MCP: security check)
   ├─ bd update status      (Beads: mark done/review)
   └─ bd sync --flush-only  (Export for CI/CD)

4. Before Push
   ├─ npm run quality:gates (Final verification)
   ├─ git push
   └─ Husky pre-push hook   (Automatic checks)

5. End Session
   ├─ /retain               (MCP: save learnings)
   ├─ bd sync --flush-only  (Export for team)
   └─ git push              (All gates must pass)
```

### Tool Interaction

```
Beads ←→ Quality Gates
  ├─ Task status determines what to test
  └─ Gate failures tracked as task comments

Beads ←→ MCP (Hindsight)
  ├─ Task comments create searchable history
  └─ Decision rationale saved for future tasks

Quality Gates ←→ MCP (Snyk)
  ├─ Secretlint is gate, Snyk is MCP
  ├─ Both check security
  └─ Snyk provides detailed analysis

MCP (all) ←→ Context Handoff
  ├─ Hindsight remembers across sessions
  ├─ Beads syncs task state
  └─ Seamless switch between Claude Code and Cursor
```

---

## 📋 Configuration Files

### Key Files

| File | Purpose | Related Docs |
|------|---------|--------------|
| `.beads/issues.jsonl` | Beads database | Beads Integration |
| `.env.development.local` | Enable BD_ENABLED=1 | Beads Integration |
| `.husky/pre-commit` | Quality gates trigger | Quality Gates |
| `tsconfig.json` | TypeScript config | Quality Gates |
| `.eslintrc` | ESLint config | Quality Gates |
| `.secretlintrc` | Secretlint config | Quality Gates |

---

## 🚀 Getting Started

### First Time Setup

```bash
# 1. Enable Beads integration
echo "BD_ENABLED=1" >> .env.development.local

# 2. Verify tools
bd status           # Should show "Ready"
/mcp                # Should show all green ✅

# 3. Test each tool
bd ready            # List your tasks
npm run quality:gates   # Verify gates
mcp__MCP_DOCKER__resolve-library-id "react"  # Test Context7
```

### Learning Path (Recommended)

**Week 1:** Quality Gates

- Run `npm run quality:gates` on every commit
- Learn to fix ESLint, TypeScript, test failures
- Understand why gates matter

**Week 2:** Beads

- Create your first task: `bd create --title="..."`
- Update status: `bd update beads-X --status=in_progress`
- Use `bd ready` daily

**Week 3:** MCP Tools

- Recall decisions: `mcp__hindsight-alice__recall "..."`
- Look up docs: `mcp__MCP_DOCKER__get-library-docs`
- Scan for security: `mcp__Snyk__snyk_code_scan`

**Week 4+:** Integration

- Use all tools together in real workflows
- Switch between Claude Code and Cursor smoothly
- Mentor team members

---

## 🔗 Cross-References

### Related Documentation

See also:

- **IDE Comparison:** `/docs/IDE-WORKFLOW-GUIDE/01-QUICK-START/IDE-Comparison.md`
- **Context Handoff Protocol:** (See Beads and MCP integration sections)
- **CLAUDE.md:** Project-wide tool configuration
- **SDLC Workflow:** How tools fit into analysis → architect → plan → implement → review cycle

### Workflow Guides

- **Building a Feature:** Beads (planning) → Context7 (research) → Quality Gates (implementation) → MCP (review)
- **Bug Investigation:** Beads (tracking) → MCP (memory) → Quality Gates (fixing) → Snyk (security)
- **Team Coordination:** Beads (task visibility) → MCP (shared context) → Quality Gates (consistency)

---

## ❓ FAQ

**Q: Should I use Beads or Jira?**
A: Beads is your primary system. It's integrated into your CLI. Jira is optional for external reporting.

**Q: What if I forget to run quality gates?**
A: Husky pre-commit hook will prevent commit. You must fix gates to proceed.

**Q: Can I bypass quality gates?**
A: Technically yes (`--no-verify`), but you shouldn't. Fix the issue instead. It takes 2 minutes.

**Q: How do I remember decisions across sessions?**
A: Use `mcp__hindsight-alice__retain` at end of session. Next session, use `mcp__hindsight-alice__recall`.

**Q: Should I use PAL for architecture decisions?**
A: No. Use Opus directly in Claude Code for critical decisions. PAL is for routine questions.

**Q: What do I do if Beads is out of sync with team?**
A: Run `bd sync --pull` to import team updates, then `bd sync --flush-only` to export yours.

---

## 📞 Support

### For Issues

1. Check troubleshooting sections in relevant document
2. Verify `/mcp` shows all green
3. Try `bd status` to see Beads health
4. Ask teammate or tech lead if problem persists

### For Questions

**In Claude Code:**

- Ask `/analyze` or `/architect` for guidance
- Use `/recall` to find past decisions
- Use Context7 to look up library docs

**In Cursor:**

- Ask in chat or use @workspace
- Check Context7 for library docs
- Use Beads comments for task context

---

## 📊 Document Statistics

| Document | Lines | Sections | Workflows | Troubleshooting |
|----------|-------|----------|-----------|-----------------|
| Beads Integration | 1071 | 18 | 4 | 6 |
| MCP Tools Guide | 801 | 15 | 6 | 2 |
| Quality Gates | 1026 | 16 | N/A | 6 |
| **Total** | **2898** | **49** | **10** | **14** |

---

**Start with your role above, then dive into the relevant document. Each guide is comprehensive and actionable.**

🎯 **Key principle:** These tools work together to keep you productive while maintaining quality and team coordination. Master them one at a time.
