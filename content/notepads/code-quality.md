# Code Quality Skill

Domain-specific knowledge for maintaining high code quality standards.

## TypeScript Strict Mode

### Type Safety Rules

**NEVER use:**

- `any` type → use `unknown` + type guard
- `as` assertions → use type guards
- `var` keyword → use `const` or `let`
- Implicit returns → explicit returns

### Type Guard Pattern

```typescript
interface User {
  id: string
  name: string
}

const isUser = (x: unknown): x is User =>
  typeof x === 'object' &&
  x !== null &&
  'id' in x &&
  typeof x.id === 'string' &&
  'name' in x &&
  typeof x.name === 'string'

// Usage
const data: unknown = fetchData()
if (isUser(data)) {
  console.log(data.name) // TypeScript knows data is User
}
```

### Proper Typing Examples

```typescript
// ✅ GOOD: Type guard
const parseUser = (data: unknown): User | null => {
  if (isUser(data)) return data
  return null
}

// ❌ BAD: as assertion
const parseUser = (data: unknown): User => {
  return data as User // Unsafe!
}

// ✅ GOOD: Proper interface
interface ApiResponse<T> {
  data: T
  error: string | null
}

// ❌ BAD: any
const response: any = await fetch()
```

## Immutability Rules

### Array Operations

```typescript
// ❌ BAD: Mutation
const items = [1, 2, 3]
items.push(4) // Mutates
items.pop() // Mutates
items.sort() // Mutates

// ✅ GOOD: Immutable
const items = [1, 2, 3]
const withAdd = [...items, 4] // Add
const withoutLast = items.slice(0, -1) // Remove
const sorted = [...items].sort() // Sort
const updated = items.map((i) => i + 1) // Update
```

### Object Operations

```typescript
// ❌ BAD: Mutation
const user = { name: 'John', age: 30 }
user.age = 31 // Mutates

// ✅ GOOD: Immutable
const user = { name: 'John', age: 30 }
const updated = { ...user, age: 31 } // Update
const withEmail = { ...user, email: 'john@example.com' } // Add
```

### React State Updates

```typescript
// ❌ BAD: Direct mutation
const [items, setItems] = useState([1, 2, 3])
items.push(4)
setItems(items)

// ✅ GOOD: Immutable update
const [items, setItems] = useState([1, 2, 3])
setItems((prev) => [...prev, 4]) // Add
setItems((prev) => prev.filter((i) => i !== 2)) // Remove
setItems((prev) => prev.map((i) => i + 1)) // Update
```

## Code Size Limits

| Metric    | Max       | Critical | Action                       |
| --------- | --------- | -------- | ---------------------------- |
| File      | 300 lines | >300     | Split into multiple files    |
| Component | 150 lines | >150     | Extract sub-components       |
| Function  | 30 lines  | >30      | Split into smaller functions |
| Props     | 8         | >8       | Extract to interface/config  |
| Nesting   | 3 levels  | >3       | Flatten with early returns   |

### Example of Splitting Large Components

```typescript
// ❌ BAD: 200+ lines in one component
export const UserProfile: FC<Props> = ({ userId }) => {
  // Header section (30 lines)
  // Info section (50 lines)
  // Actions section (40 lines)
  // Settings section (60 lines)
  // Footer section (20 lines)
};

// ✅ GOOD: Split into sub-components
export const UserProfile: FC<Props> = ({ userId }) => {
  const { data } = useUserData(userId);
  if (!data) return <Loading />;

  return (
    <Wrapper>
      <ProfileHeader user={data} />
      <ProfileInfo user={data} />
      <ProfileActions userId={userId} />
      <ProfileSettings userId={userId} />
      <ProfileFooter />
    </Wrapper>
  );
};
```

## ESLint Suppression Policy

**IRON RULE:** Refactor first (99%), suppress only when justified (1%).

### Format

```typescript
// eslint-disable-next-line <rule> -- WHY: <reason>. TODO(PROJ-XXX): <fix_description>
```

### Required Components

1. **`<rule>`** — Specific ESLint rule name (e.g., `no-magic-numbers`)
2. **`WHY:`** — Clear reason from allowed list
3. **`TODO(PROJ-XXX):`** — Jira task reference
4. **`<fix_description>`** — What needs to be done

### Valid WHY Reasons

- **External API**: Untyped response, no types available
- **Library limitation**: Library doesn't support strict types
- **Legacy migration**: Migration in progress
- **Performance**: Measured bottleneck
- **Framework contract**: Required by yargs/zod/MSW

### Examples

```typescript
// ✅ GOOD: Justified suppression
// eslint-disable-next-line no-magic-numbers -- WHY: Performance optimization benchmark. TODO(PROJ-123): Move to config.
const TIMEOUT_MS = 5000

// ❌ BAD: Blanket suppression
// eslint-disable

// ❌ BAD: Missing WHY and TODO
// eslint-disable-next-line no-magic-numbers
const max = 10

// ✅ GOOD: Proper suppression
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- WHY: External API returns untyped data. TODO(PROJ-456): Add proper types.
const data: any = await externalAPI.getData()
```

### Refactor First Actions

| Warning        | Action                   |
| -------------- | ------------------------ |
| MagicNumber    | `const MAX = 5`          |
| UnusedVariable | Remove or use `_` prefix |
| Complexity     | Split method             |
| any type       | `unknown` + type guard   |
| Console        | Use proper logger        |

## Error Handling

### Proper Try-Catch

```typescript
// ✅ GOOD: Specific error handling
export const fetchData = async (id: string) => {
  try {
    const response = await api.getData(id)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      notification.error({ message: `Failed to fetch: ${error.message}` })
    } else {
      notification.error({ message: 'Unknown error occurred' })
    }
    throw error
  }
}

// ❌ BAD: Catch-all
export const fetchData = async (id: string) => {
  try {
    return await api.getData(id)
  } catch (error) {
    console.log(error) // No notification
  }
}
```

### Error Boundaries

```typescript
// ✅ GOOD: Error boundary with recovery
export const ComponentWrapper: FC = () => {
  return (
    <ErrorBoundary
      fallback={({ error, retry }) => (
        <ErrorView error={error} onRetry={retry} />
      )}
    >
      <Component />
    </ErrorBoundary>
  );
};
```

## Testing Requirements

### Minimum Test Coverage

- **Critical paths**: 90%+ coverage
- **Utility functions**: 100% coverage
- **Components**: 80%+ coverage
- **API integrations**: Mocked and tested

### Test Structure

```typescript
describe('Feature', () => {
  describe('Happy path', () => {
    it('should handle success case', () => {})
  })

  describe('Error cases', () => {
    it('should handle network error', () => {})
    it('should handle validation error', () => {})
  })

  describe('Edge cases', () => {
    it('should handle empty input', () => {})
    it('should handle null values', () => {})
  })
})
```

## Security Best Practices

### Input Validation

```typescript
// ✅ GOOD: Zod validation
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const handleSubmit = (data: unknown) => {
  const validated = schema.parse(data) // Throws if invalid
  // Process validated data
}
```

### XSS Prevention

```typescript
import DOMPurify from 'dompurify';

// ✅ GOOD: Sanitize user HTML
const UserContent: FC<{ html: string }> = ({ html }) => {
  const sanitized = useMemo(() => DOMPurify.sanitize(html), [html]);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
};
```

### Secrets Management

```typescript
// ❌ BAD: Hardcoded secrets
const API_KEY = 'sk-1234567890abcdef'

// ✅ GOOD: Environment variables
const API_KEY = import.meta.env.VITE_API_KEY
```

## References

- `.cursor/rules/code-quality.mdc` — Full code quality documentation
- `.cursor/rules/suppressions-policy.mdc` — ESLint suppression guidelines
- `.cursor/rules/core-rule.mdc` — Core development rules
