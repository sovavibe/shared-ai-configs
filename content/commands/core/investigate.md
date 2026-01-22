---
description: 'Systematic task investigation: determine type, research, create tasks'
---

# Investigate Task

**Investigate command for systematic task investigation: determine type, research, create tasks.**

## Usage

```bash
@investigate.md [task]
```

## Core Principle

**Jira** = sync with team ("what I'm doing")
**Beads** = local management ("how I'm doing")

## Workflow

The investigate workflow guides agent through systematic investigation:

### Phase 1: Research & Planning

**Objective:** Understand task and gather context

1. **Determine Entry Point:**

   - Jira task? (VP-XXX)
   - User input?
   - MR comment?
   - File/Component reference?

2. **Load Context:**

   - **Beads** - Get full context from task description (includes research, analysis, progress)
   - **Hindsight MCP** (`user-hindsight-alice`) - Recall patterns, lessons, experience
   - Jira (if applicable)
   - Context7 (if researching libraries)
   - Existing similar implementations

3. **Ask Clarifying Questions:**
   - What is the desired outcome?
   - Are there constraints or preferences?
   - Should we use existing solutions or create new?
   - What is priority/criticality?

### Phase 2: Deep Investigation

**Use Semantic Search + Grep Hybrid Approach:**

Semantic search queries:

- "Where do we handle [related feature]?"
- "How does [related architecture] work?"
- "Find components that [do similar thing]"
- "Show me [pattern] implementations"

Grep queries:

- "Find all files using [specific function/component]"
- "Search for [exact pattern]"
- "Locate [specific import]"

**Investigation Steps:**

- Reproduce issue (if bug)
- Trace code execution
- Identify root cause (if bug)
- Search for similar implementations
- Check for existing solutions
- **Store findings in Beads task description** (`bd update <id> --description`) - research results, analysis
- **Store insights via Hindsight MCP** (`retain` or `reflect`) - patterns, lessons, experience

### Phase 3: Create Tasks (if needed)

**See `@session/create-tasks.md` for task creation scenarios:**

| Scenario         | Create Jira?  | Create Beads?         |
| ---------------- | ------------- | --------------------- |
| MR review        | ✅ Yes (Task) | ✅ Yes (Epic)         |
| Feature/Bug      | ✅ Yes (Task) | ✅ Yes (Epic)         |
| Local initiative | ❌ No         | ✅ Yes (Epic or Task) |

### Phase 4: Decision Matrix (if multiple approaches)

**Evaluate multiple approaches:**

| Approach   | Pros | Cons | Complexity | Risk   |
| ---------- | ---- | ---- | ---------- | ------ |
| Approach 1 | ...  | ...  | Medium     | Low    |
| Approach 2 | ...  | ...  | High       | Medium |

**Recommendation:** Select best approach with justification.

## When to Use

- **Bug Investigation:** User reports issue needing analysis
- **Feature Research:** User wants to understand before implementation
- **Pattern Discovery:** User needs to understand existing code
- **Documentation:** User needs technical documentation created
- **MR Analysis:** GitLab MR comment requires investigation

## Semantic Search Integration

**Performance Benefits (Cursor Research):**

- **+12.5% accuracy** in finding relevant code
- **+23.5% accuracy** on some models for context discovery
- Faster investigation with better context

**How to Use Semantic Search in Investigation:**

**1. Understanding Architecture:**

```
Query: "How does [feature] work?"
```

→ Finds components, hooks, services, data flow

**2. Finding Related Code:**

```
Query: "Find components that handle [feature]"
```

→ Finds all relevant components

**3. Discovering Patterns:**

```
Query: "Show me [pattern] implementations"
```

→ Finds similar patterns in codebase

**4. Understanding Context:**

```
Query: "Where do we manage [resource]?"
```

→ Finds state management, API calls, caching

**Follow Up with Grep:**
After semantic search gives you context, use grep for specifics:

```
-Pattern: "[exact function name]"
```

→ Finds all usages and definitions

````

## Examples

```bash
# Investigate Jira task
@investigate.md VP-123

# Investigate user issue
@investigate.md Users getting login errors after password reset

# Investigate MR comment
@investigate.md MR #321 comment about performance issues

# Investigate for documentation
@investigate.md Document authentication flow
````

## MCP Integration

**All intermediate reports and research results MUST be stored:**

1. **Beads task description** (`bd update <id> --description`):

   - Store research results during investigation
   - Store analysis reports
   - Store investigation findings
   - Store context preservation (all in task description)

2. **Hindsight MCP** (`user-hindsight-alice`):
   - Store reflection and lessons learned
   - Store coding patterns and architectural decisions
   - Store experience and opinions
   - Recall patterns from previous work

**This is MCP workflow - all reports go through MCP, not temporary files.**

## References

- `@005-beads.mdc` — Core Beads workflow
- `@session/create-tasks.md` — Create tasks scenarios
- `@existing-solutions-first.mdc` — Search first
- `@communication-style.mdc` — Reporting style
- `@100-hindsight.mdc` — Hindsight MCP usage
