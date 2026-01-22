# /architect - System Architecture Design

> **Purpose:** Make technical decisions that will guide implementation.
>
> Architecture phase answers "HOW" - what components, patterns, and
> technologies will solve the problem defined in analysis.

Design architecture for: $ARGUMENTS

## Phase 1: Load Context

### 1.1 Read Analysis (if exists)

```bash
bd show [ANALYSIS_BEAD_ID]  # If continuing from /analyze
```

### 1.2 Load Memory

```
mcp__hindsight-alice__recall "Architecture patterns used in this project"
mcp__hindsight-alice__recall "Past architectural decisions similar to [FEATURE]"
```

### 1.3 Check Project Architecture

```
mcp__allpepper-memory-bank__memory_bank_read projectName="Front" fileName="architecture.md"
Read .cursor/notepads/api-patterns.md
Read .cursor/notepads/react-patterns.md
```

---

## Phase 2: Analyze Current System

### 2.1 Explore Existing Architecture

Use Task tool with Explore agent:

- "What is the overall architecture of this project?"
- "How are similar features structured?"
- "What are the integration points?"

### 2.2 Identify Patterns

```
Read .cursor/rules/INDEX.mdc
Identify relevant architectural rules
```

### 2.3 Map Dependencies

- External APIs: [what services are involved]
- Internal modules: [what parts of codebase affected]
- Data flow: [how data moves through system]

---

## Phase 3: External Research

### 3.1 Library Documentation

```
mcp__MCP_DOCKER__resolve-library-id "[RELEVANT_LIBRARY]"
mcp__MCP_DOCKER__get-library-docs context7CompatibleLibraryID="[ID]" topic="architecture"
```

### 3.2 Best Practices

```
WebSearch "[PATTERN] architecture React TypeScript 2025"
WebSearch "[DOMAIN] system design best practices"
```

### 3.3 Deep Analysis (for complex decisions)

For complex architectural decisions:

- Analyze multiple options systematically
- Document trade-offs for each approach
- Consider scalability and maintainability

---

## Phase 4: Design Architecture

### 4.1 Component Design

- What components are needed?
- How do they interact?
- What are their responsibilities?

### 4.2 Data Design

- What data structures?
- How is state managed?
- What's the API contract?

### 4.3 Integration Design

- How does it fit with existing system?
- What are the boundaries?
- What needs to change?

---

## Phase 5: Evaluate Options

### 5.1 List Alternatives

For each major decision, list 2-3 options

### 5.2 Compare Trade-offs

| Approach | Pros | Cons | Complexity   |
| -------- | ---- | ---- | ------------ |
| Option A | ...  | ...  | Low/Med/High |
| Option B | ...  | ...  | Low/Med/High |

### 5.3 Make Decision

Choose approach with rationale

---

## Phase 6: Create Architecture Bead

### 6.1 Create Bead

```bash
bd create --title="Architecture: [FEATURE_NAME]" --type=feature --priority=2
```

### 6.2 Write Architecture Document

```markdown
## Overview

[1-2 sentences describing the architectural approach]

## Context

### Problem Being Solved

[From analysis or direct request]

### Current Architecture

[How the system works now]

### Constraints

- Must integrate with: [existing systems]
- Cannot change: [protected areas]
- Must support: [requirements]

## Architecture Decision

### Chosen Approach

**[APPROACH_NAME]**

[Description of the approach]

### Rationale

- [Reason 1]
- [Reason 2]
- [Reason 3]

### Alternatives Considered

#### Option A: [Name]

- **Description:** [what it is]
- **Pros:** [advantages]
- **Cons:** [disadvantages]
- **Rejected because:** [reason]

#### Option B: [Name]

- **Description:** [what it is]
- **Pros:** [advantages]
- **Cons:** [disadvantages]
- **Rejected because:** [reason]

## Component Architecture

### Component Diagram
```

[Component A] ──── calls ────► [Component B]
│ │
│ ▼
└─── observes ────► [State Store]

```

### Components

#### [Component 1]
- **Responsibility:** [what it does]
- **Location:** `src/path/to/component`
- **Depends on:** [other components]
- **Exposes:** [public API/interface]

#### [Component 2]
- **Responsibility:** [what it does]
- **Location:** `src/path/to/component`
- **Depends on:** [other components]
- **Exposes:** [public API/interface]

## Data Architecture

### State Management
- **Approach:** [Zustand/Context/TanStack Query]
- **Store location:** `src/path/to/store`
- **Key state:** [what's stored]

### Data Flow
```

User Action → Component → Hook → API → Server
▲ │
└──── State Update ◄───┘

````

### API Contract
```typescript
// Request
interface RequestDTO {
  field: type;
}

// Response
interface ResponseDTO {
  field: type;
}
````

## Integration Points

### External Dependencies

| System | Integration | Protocol     |
| ------ | ----------- | ------------ |
| [API]  | [purpose]   | REST/GraphQL |

### Internal Dependencies

| Module    | Dependency   | Type   |
| --------- | ------------ | ------ |
| [Feature] | [shared/api] | Import |

## Non-Functional Requirements

### Performance

- Target: [metrics]
- Strategy: [how to achieve]

### Security

- Considerations: [what to protect]
- Approach: [how]

### Scalability

- Growth expectation: [estimate]
- Handling: [approach]

## Migration/Rollout Strategy

- [ ] Phase 1: [initial change]
- [ ] Phase 2: [next step]
- [ ] Rollback plan: [if needed]

## Risks & Mitigations

| Risk     | Probability  | Impact       | Mitigation |
| -------- | ------------ | ------------ | ---------- |
| [Risk 1] | Low/Med/High | Low/Med/High | [Strategy] |

## Open Questions

- [ ] [Question needing answer]
- [ ] [Technical decision pending]

## Next Phase

Ready for: /plan beads-XXX

````

### 6.3 Link to Analysis (if exists)
```bash
bd dep add [THIS_BEAD] [ANALYSIS_BEAD]  # This depends on analysis
````

### 6.4 Save to Memory

```
mcp__hindsight-alice__retain "Architecture beads-XXX: [FEATURE] - [key architectural decisions]"
mcp__allpepper-memory-bank__memory_bank_update projectName="Front" fileName="decisions.md" content="[append decision]"
```

---

## Phase 7: Output

```
✅ Architecture complete: beads-XXX
📋 Feature: [FEATURE_NAME]

🏗️ Key Decisions:
- [Decision 1]: [chosen option]
- [Decision 2]: [chosen option]

📦 Components:
- [Component 1] - [purpose]
- [Component 2] - [purpose]

🔗 Integration:
- [Integration point 1]
- [Integration point 2]

❓ Open questions:
- [Question if any]

🎯 Next step:
> /plan beads-XXX
```

---

## When to Skip Architecture

Skip directly to `/plan` when:

- Using established patterns exactly
- Simple CRUD operation
- Bug fix or minor enhancement
- Clear precedent in codebase

Run full architecture when:

- New system component
- Multiple valid approaches exist
- Cross-cutting concerns
- Performance/security critical
- Will be referenced by future work
