# /plan - Deep Implementation Planning

> **Philosophy:** Opus thinks deeply ONCE → cheap model executes MANY times.
>
> Planning is where intelligence matters most. We invest Opus's capabilities
> in research, synthesis, and decision-making. The resulting plan is so clear
> that any model can implement it.

Create a comprehensive, research-backed implementation plan.

## Phase 1: Context Loading (Memory & History)

### 1.1 Recall from Hindsight

```
mcp__hindsight-alice__recall "What are the architectural patterns and decisions for this project?"
mcp__hindsight-alice__recall "Past implementations similar to [TASK]"
mcp__hindsight-alice__recall "User preferences for [DOMAIN]"
```

### 1.2 Check Project Memory

```
mcp__allpepper-memory-bank__memory_bank_read projectName="Front" fileName="architecture.md"
mcp__allpepper-memory-bank__memory_bank_read projectName="Front" fileName="decisions.md"
```

### 1.3 Review Existing Beads

```bash
bd list --status=closed | grep -i "[RELATED_KEYWORD]"  # Past similar work
bd list --status=open                                   # Current context
```

---

## Phase 2: Codebase Research

### 2.1 Explore Existing Patterns

Use Task tool with Explore agent:

- "How is [SIMILAR_FEATURE] implemented?"
- "What patterns are used for [DOMAIN]?"
- "Find all files related to [COMPONENT]"

### 2.2 Read Architecture Rules

```
Read .cursor/rules/INDEX.mdc
Read relevant rules from .cursor/rules/
Read .cursor/notepads/ for patterns
```

### 2.3 Analyze Dependencies

- Check package.json for relevant libraries
- Understand existing abstractions
- Find reusable components

---

## Phase 3: External Research

### 3.1 Library Documentation (Context7)

```
mcp__MCP_DOCKER__resolve-library-id "[LIBRARY_NAME]"
mcp__MCP_DOCKER__get-library-docs context7CompatibleLibraryID="[ID]" topic="[SPECIFIC_TOPIC]"
```

**Always check docs for:**

- React patterns (hooks, context, etc.)
- Ant Design components
- TanStack Query patterns
- Any new library being introduced

### 3.2 Web Search for Best Practices

```
WebSearch "best practices [TECHNOLOGY] [USE_CASE] 2025"
WebSearch "[PROBLEM] solution React TypeScript"
```

### 3.3 Deep Thinking (Optional - for complex tasks)

```
mcp__pal__thinkdeep for architectural decisions
mcp__pal__consensus for comparing approaches
```

---

## Phase 4: Reflection & Synthesis

### 4.1 Reflect on Findings

```
mcp__hindsight-alice__reflect "Given what I know about this project and the research done, what's the best approach for [TASK]?"
```

### 4.2 Identify Risks & Unknowns

- What could go wrong?
- What needs clarification from user?
- Are there breaking changes?

### 4.3 Choose Approach

If multiple approaches exist:

- List pros/cons
- Consider project conventions
- Ask user if unclear

---

## Phase 5: Create Structured Plan

### 5.1 Create Bead

```bash
bd create --title="[TITLE]" --type=[feature|task|bug] --priority=[0-4]
```

### 5.2 Write Comprehensive Plan

```markdown
## Summary

[1-2 sentences - the goal]

## Research Findings

### From Codebase

- Existing pattern: [what we found]
- Reusable components: [list]
- Files to reference: [paths]

### From Documentation

- [Library] recommends: [approach]
- Best practice: [what we learned]

### From Memory

- Past decision: [relevant context]
- User preference: [if any]

## Architecture Decision

**Chosen approach:** [approach name]
**Rationale:** [why this over alternatives]

**Alternatives considered:**

1. [Alt 1] - rejected because [reason]
2. [Alt 2] - rejected because [reason]

## Implementation Steps

- [ ] Step 1: [description]

  - File: `path/to/file.ts`
  - Pattern: [reference existing pattern if applicable]
  - Docs: [link to relevant docs]

- [ ] Step 2: [description]
  - File: `path/to/file.ts`
  - Pattern: [reference]

[... more steps ...]

## Files Overview

| Action | File      | Purpose | Reference                      |
| ------ | --------- | ------- | ------------------------------ |
| CREATE | `src/...` | ...     | Similar to `src/existing/...`  |
| MODIFY | `src/...` | ...     | Pattern from `src/pattern/...` |

## Testing Strategy

- [ ] Unit tests for [what]
- [ ] Integration tests for [what]
- [ ] Manual testing: [steps]

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Dependencies & Blockers

- **Requires:** [other beads, external APIs]
- **Blocked by:** [if any]
- **New packages:** [if adding any]

## Risks & Mitigations

| Risk     | Likelihood | Mitigation      |
| -------- | ---------- | --------------- |
| [Risk 1] | Medium     | [How to handle] |

## Notes for Implementer

- [Important context]
- [Gotchas to watch out for]
- [Links to relevant resources]
```

### 5.3 Save to Memory

```
mcp__hindsight-alice__retain "Plan beads-XXX: [summary with key decisions]"
```

### 5.4 Add Dependencies (if needed)

```bash
bd dep add beads-XXX beads-YYY  # If depends on another task
```

---

## Phase 6: Output

```
✅ Plan created: beads-XXX
📋 Title: [title]

📚 Research completed:
- [x] Memory loaded (hindsight + project)
- [x] Codebase patterns analyzed
- [x] Documentation checked (Context7)
- [x] Best practices researched

🎯 Ready for implementation in Cursor:
> /implement beads-XXX

Key decisions:
- [Decision 1]
- [Decision 2]
```

---

## Quick Reference: Research Tools

| Need            | Tool                | Example                         |
| --------------- | ------------------- | ------------------------------- |
| Past decisions  | `hindsight__recall` | "auth implementation decisions" |
| Project memory  | `allpepper__read`   | architecture.md                 |
| Library docs    | `Context7`          | React Query mutation patterns   |
| Best practices  | `WebSearch`         | "React form validation 2025"    |
| Deep analysis   | `pal__thinkdeep`    | Complex architecture            |
| Compare options | `pal__consensus`    | Multiple approaches             |
| Explore code    | `Task(Explore)`     | "How is X implemented?"         |
