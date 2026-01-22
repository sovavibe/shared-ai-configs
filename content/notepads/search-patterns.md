# Search Patterns Skill

Domain-specific knowledge for effective code search with semantic search and grep.

## Semantic Search Best Practices

### What is Semantic Search?

Cursor's semantic search understands the **meaning** of your queries, not just the literal text. It uses embeddings to find code that's semantically related to your question.

### Performance Improvements (Cursor Research)

- **+12.5% accuracy** in average responses
- **+23.5% accuracy** on some models for context discovery
- **+0.3% code retention** on all projects
- **+2.6% code retention** on large projects (>1000 files)
- **-2.2% dissatisfied follow-ups** (fewer reworks)

### When to Use Semantic Search

Use semantic search when you want to find code by **meaning** or **functionality**:

**✅ Good semantic search queries:**

- "Where do we handle authentication?"
- "Find components that display user data"
- "How does the order creation flow work?"
- "Show me the state management patterns"
- "Where is error handling logic?"
- "Find pagination logic"
- "How do we manage API errors?"

**❌ Don't use semantic search for:**

- Exact function names
- Specific variable names
- Exact string matches
- Quick keyword lookups

### When to Use Grep

Use grep (Grep tool) when you need **exact matches**:

**✅ Good grep queries:**

- "Find all files importing axios"
- "Search for 'useAuth' function definitions"
- "Locate all console.log statements"
- "Find all instances of 'TODO'"
- "Search for 'export const' in utils"
- "Find all files using 'styled-components'"

**❌ Don't use grep for:**

- Finding components by functionality
- Understanding architecture
- Searching for patterns/concepts

## Hybrid Approach: Combine Both

### Best Practice Workflow

Cursor automatically combines semantic search + grep, but you can be explicit:

```typescript
// Step 1: Use semantic search to understand architecture
Query: "How does authentication flow work?"
→ Finds: AuthProvider, useAuth hook, login components, API endpoints

// Step 2: Use grep for specific implementations
Pattern: "useAuth"
→ Finds: All files using the hook
```

### Example: Understanding a Feature

**Scenario:** You need to understand how user profiles work

**Step 1: Semantic search for architecture**

```
Query: "How does user profile management work?"
```

**Result:** Finds ProfileProvider, useProfile hook, ProfilePage, API endpoints, form components

**Step 2: Grep for specific usage**

```
Pattern: "useProfile"
```

**Result:** Lists all components consuming the profile hook

**Step 3: Semantic search for state patterns**

```
Query: "Where do we store user profile state?"
```

**Result:** Finds Zustand store, TanStack Query cache, local storage hooks

## Real-World Examples

### Example 1: Finding Bug Context

**Problem:** Users see blank page after clicking "Save"

**Approach:**

1. **Semantic search:** "Where do we handle save operations?"
   - Finds save buttons, form submissions, API calls
2. **Grep:** "handleSubmit"
   - Finds all form submit handlers
3. **Semantic search:** "How do we handle API errors?"
   - Finds error boundaries, error handlers, notification logic
4. **Result:** Discovered missing error boundary in save flow

### Example 2: Understanding Data Flow

**Problem:** Need to understand order creation flow

**Approach:**

1. **Semantic search:** "How does order creation work?"
   - Finds OrderForm, useCreateOrder, API endpoints, validation
2. **Grep:** "createOrder"
   - Finds all mutations and calls
3. **Semantic search:** "Where do we validate order data?"
   - Finds Zod schemas, form validation, API validation
4. **Result:** Clear picture of entire flow

### Example 3: Finding Similar Patterns

**Problem:** Need to implement feature similar to existing pagination

**Approach:**

1. **Semantic search:** "Show me pagination implementations"
   - Finds all components with pagination logic
2. **Grep:** "usePagination"
   - Finds reusable pagination hooks
3. **Semantic search:** "How do we handle page changes?"
   - Finds event handlers, state updates, API requests
4. **Result:** Reuse existing hook with minor modifications

## Effective Query Patterns

### Semantic Search Query Templates

**For finding components by functionality:**

```
"Find components that [action] [resource]"
"Show me components that [feature]"
"Where do we implement [feature]?"
```

**For understanding flows:**

```
"How does [feature] flow work?"
"What is the data flow for [feature]?"
"Trace the execution of [feature]"
```

**For finding patterns:**

```
"Show me [pattern] implementations"
"How do we handle [concern]?"
"Find all [pattern] in the codebase"
```

**For finding context:**

```
"Where is [feature] implemented?"
"How do we manage [resource]?"
"Show me [resource] management"
```

### Grep Pattern Templates

**For finding usage:**

```
"Find all files using [function/component]"
"Locate [function] calls"
```

**For finding definitions:**

```
"Search for 'export [function]'"
"Find [function] definitions"
```

**For finding specific patterns:**

```
"Locate all [pattern] statements"
"Find instances of [pattern]"
```

## Integration with Commands

### /investigate Command

Uses semantic search to:

- Find context for investigation
- Understand architecture
- Discover related code
- Identify patterns

Example:

```bash
@investigate.md Users getting errors after password reset
```

**Internal workflow:**

1. Semantic search: "password reset flow"
2. Grep: "resetPassword"
3. Semantic search: "error handling for auth"
4. Combine results for investigation

### /debug Command

Uses semantic search for hypothesis generation:

- Find similar bugs
- Discover related code
- Understand context

Example:

```bash
@debug.md TypeError: Cannot read properties of undefined
```

**Internal workflow:**

1. Semantic search: "How do we handle undefined properties?"
2. Find similar error patterns
3. Grep for specific property access
4. Generate hypotheses

### /diagram Command

Uses semantic search to:

- Understand data flows
- Find component relationships
- Discover state management

Example:

```bash
@diagram.md dataflow User authentication
```

**Internal workflow:**

1. Semantic search: "authentication flow"
2. Find all auth-related components
3. Trace data flow
4. Generate diagram

## Best Practices Summary

### ✅ DO

- Use semantic search for understanding architecture
- Use grep for exact matches (names, strings)
- Let Cursor combine both automatically
- Start with semantic search for context
- Follow up with grep for specifics
- Use semantic search for finding patterns
- Use grep for finding implementations

### ❌ DON'T

- Use semantic search for exact function names
- Use grep for understanding architecture
- Limit yourself to one search type
- Search without understanding the goal
- Skip semantic search for complex flows
- Use grep when you need to understand "why"

### 📊 Performance Tips

- **For large projects (>1000 files):** Semantic search is 23.5% more accurate
- **For understanding flows:** Start with semantic search, follow with grep
- **For finding bugs:** Use semantic search for hypothesis generation
- **For finding implementations:** Use grep for exact matches

## Cursor's Automatic Behavior

Cursor automatically combines semantic search + grep when:

- You ask general questions ("How does X work?")
- You need context for implementation
- You're investigating issues
- You're debugging

You don't need to specify which tool to use — Cursor chooses based on your query.

## References

- Cursor Blog: https://cursor.com/blog/semsearch
- `.cursor/commands/core/investigate.md` — Investigation workflow
- `.cursor/commands/core/debug.md` — Debugging with semantic search
- `.cursor/notepads/search-strategies.md` — Search examples
