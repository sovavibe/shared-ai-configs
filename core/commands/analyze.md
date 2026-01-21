# /analyze - Requirements Analysis

> **Purpose:** Transform vague requests into clear, actionable requirements.
>
> This is the first phase of the SDLC. Opus invests time in understanding
> the problem deeply, so subsequent phases have crystal-clear direction.

Analyze the request: $ARGUMENTS

## Phase 1: Understand the Request

### 1.1 Parse User Intent

- What is the user actually trying to achieve?
- What problem are they solving?
- Who are the end users affected?

### 1.2 Load Context

```
mcp__hindsight-alice__recall "Previous work related to [TOPIC]"
mcp__hindsight-alice__recall "User preferences and constraints"
```

### 1.3 Check Existing Work

```bash
bd list --status=open | grep -i "[KEYWORD]"   # Related open work
bd list --status=closed | grep -i "[KEYWORD]" # Past similar work
```

---

## Phase 2: Gather Information

### 2.1 Explore Codebase

Use Task tool with Explore agent:

- "What existing features relate to [REQUEST]?"
- "How is similar functionality implemented?"
- "What constraints exist in the current architecture?"

### 2.2 Check Documentation

```
Read relevant docs/ files
Read related .cursor/notepads/
```

### 2.3 External Research (if needed)

```
WebSearch "[DOMAIN] requirements best practices"
WebSearch "[SIMILAR_PRODUCT] features"
```

---

## Phase 3: Define Requirements

### 3.1 User Stories

Format: "As a [user type], I want [goal], so that [benefit]"

### 3.2 Acceptance Criteria

Format: "Given [context], when [action], then [result]"

### 3.3 Scope Definition

- **In scope:** [what's included]
- **Out of scope:** [what's explicitly excluded]
- **Future consideration:** [potential follow-ups]

---

## Phase 4: Identify Unknowns

### 4.1 Questions for Stakeholder

- [Question 1 - needs clarification]
- [Question 2 - decision needed]

### 4.2 Technical Uncertainties

- [Uncertainty 1 - needs investigation]
- [Uncertainty 2 - depends on architecture]

### 4.3 Assumptions Made

- [Assumption 1 - state explicitly]
- [Assumption 2 - needs validation]

---

## Phase 5: Create Analysis Bead

### 5.1 Create Bead

```bash
bd create --title="Analysis: [FEATURE_NAME]" --type=feature --priority=2
```

### 5.2 Write Analysis Document

```markdown
## Problem Statement

[1-2 sentences describing the core problem]

## Background

- Current situation: [what exists now]
- Pain points: [what's wrong]
- Trigger: [why now]

## User Stories

1. As a [user], I want [goal], so that [benefit]
2. As a [user], I want [goal], so that [benefit]

## Acceptance Criteria

- [ ] Given [context], when [action], then [result]
- [ ] Given [context], when [action], then [result]
- [ ] Given [context], when [action], then [result]

## Scope

### In Scope

- [Feature 1]
- [Feature 2]

### Out of Scope

- [Explicitly excluded 1]
- [Explicitly excluded 2]

### Future Considerations

- [Potential follow-up 1]

## Constraints

- Technical: [existing system limitations]
- Business: [timeline, resources]
- Compliance: [regulations, policies]

## Questions & Unknowns

### Needs Clarification

- [ ] [Question 1]
- [ ] [Question 2]

### Assumptions

- [Assumption 1] - awaiting confirmation
- [Assumption 2] - based on [source]

## Related Work

- Existing: [related features in codebase]
- Past: [similar beads completed]
- Blocked by: [dependencies if any]

## Success Metrics

- [How will we measure success?]
- [What does "done" look like?]

## Next Phase

Ready for: /architect beads-XXX
```

### 5.3 Save to Memory

```
mcp__hindsight-alice__retain "Analysis beads-XXX: [FEATURE] - [key requirements summary]"
```

---

## Phase 6: Output

```
✅ Analysis complete: beads-XXX
📋 Feature: [FEATURE_NAME]

📝 Summary:
[2-3 sentence summary of what was analyzed]

❓ Questions requiring answers:
- [Question 1]
- [Question 2]

📌 Key decisions needed:
- [Decision 1]

🎯 Next step:
> /architect beads-XXX

Or if questions need answers first:
> Answer the questions above, then run /architect
```

---

## When to Skip Analysis

Skip directly to `/plan` when:

- Requirements are already crystal clear
- It's a simple bug fix
- User provided detailed specifications
- Following up on existing analysis

Run full analysis when:

- Vague or ambiguous request
- New feature with multiple stakeholders
- Complex domain with unknowns
- Strategic decision implications
