---
description: 'Clear code explanation structure for understanding complex code'
version: '1.0.0'
lastUpdated: '2026-01-14'
scope: 'Code explanation and knowledge transfer'
---

# Explain Code

Clear code explanation structure.

## Research (RECOMMENDED)

```bash
CallMcpTool({
  server: "user-web-search-prime",
  toolName: "search",
  arguments: {
    query: 'React [pattern name] best practices 2025',
    limit: 3
  }
})

CallMcpTool({
  server: "user-hindsight-alice",
  toolName: "recall",
  arguments: {
    bank_id: 'patterns',
    query: 'architecture patterns for React',
    max_tokens: 2048
  }
})
```

Skip research for: Simple function (< 10 lines), well-known pattern.

## Format

### 1. Purpose

What does it do? (1-2 sentences)

### 2. How

Step-by-step logic flow

### 3. Why

Design decisions, tradeoffs

### 4. Dependencies

What it relies on (imports, context, props)

### 5. Usage

```tsx
// Example of how to use
```

### 6. Gotchas

- Edge cases
- Common mistakes
- Performance notes

Reference: `@ARCHITECTURE.md`, `@DOMAIN.md`

## Post-Explanation Learning

```bash
CallMcpTool({
  server: "user-hindsight-alice",
  toolName: "retain",
  arguments: {
    bank_id: 'patterns',
    content: 'Explained [pattern/component]',
    context: 'architecture',
    async_processing: true
  }
})
```

Document when: Complex architecture (> 30 min), novel pattern, recurring questions.
