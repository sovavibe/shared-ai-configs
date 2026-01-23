# React Best Practices Skill

> Reusable checklist for reviewing React code patterns and catching anti-patterns.
> Integrates with `/review` command for automated checking.
>
> **Enhanced with:** Vercel v0 prompting framework & Vercel Labs agent-skills

## When to Use This Skill

✅ Run `/review` - automatically checks against these patterns
✅ Manual review - use this checklist when reviewing React components
✅ Implementation - reference while writing React code
✅ Prompting AI - use v0 framework for component generation
❌ Don't memorize - refer to this guide as needed

---

## v0 Component Prompting Framework

> Based on Vercel's "How to Prompt v0" guide. Generates better components faster with explicit structure.

### Three Core Inputs (Golden Triangle)

**1. Product Surface** - What are we building?

```
Components: Button, Modal, Form, Card
Data: User profile, posts list, comments
Actions: Submit, Delete, Filter, Sort
```

**2. Context of Use** - Who, when, and why?

```
Used by: E-commerce customers browsing products
In: Mobile shopping app, during checkout decision
To: Choose product variant (size/color) and add to cart
```

**3. Constraints & Taste** - Visual and technical boundaries

```
Constraints:
- Mobile-first (max 320px width)
- Dark mode support
- Ant Design components only
- No animations (performance)
- Minimal, clean aesthetic
```

### Prompt Template (Copy & Use)

```
Build [PRODUCT_SURFACE].
Used by [WHO], in [CONTEXT/MOMENT], to [DECISION].
Constraints: [PLATFORM], [VISUAL_STYLE], [FRAMEWORK], [PERFORMANCE], [LAYOUT].
```

### Real-World Impact

| Metric                | Vague Prompt | Detailed Prompt | Improvement |
| --------------------- | ------------ | --------------- | ----------- |
| **Generation Time**   | 38s          | 19s             | -50%        |
| **Generated LOC**     | 232 lines    | 80 lines        | -65%        |
| **Iterations Needed** | 1-2 rounds   | 0 rounds        | Immediate   |
| **Mobile Optimized**  | 40%          | 100%            | +150%       |

---

## Vercel Performance Patterns (Priority Order)

> From Vercel Labs agent-skills. Ordered by impact and frequency.

### 🔴 CRITICAL: Eliminating Waterfalls

**Pattern:** Parallelize async operations, avoid sequential awaits

```typescript
// ❌ Bad - Waterfall (A finishes before B starts)
const data = await fetchUser(id);
const posts = await fetchUserPosts(data.id);
const comments = await fetchPostComments(posts[0].id);

// ✅ Good - Parallel
const [user, comments] = await Promise.all([
  fetchUser(id),
  fetchPostComments(postId), // Independent
]);

// ✅ Good - Move await to where it's used
const user = fetchUser(id); // Don't await yet
const posts = await fetchUserPosts(id);
const userDetails = await user; // Only await when needed
```

**Checklist:**

- [ ] Independent async operations use `Promise.all()`
- [ ] Sequential awaits justified (one depends on previous)
- [ ] Promise initialization moved to where it's actually used
- [ ] No awaits in loops

---

### 🔴 CRITICAL: Bundle Size Optimization

**Pattern:** Direct imports > barrel files; lazy load heavy components with React.lazy()

```typescript
// ❌ Bad - Loads entire package
import * as utils from '@utils/index'; // Everything imported
const { format } = utils;

// ✅ Good - Direct import
import { format } from '@utils/dates';

// ✅ Good - Lazy load heavy components (Vite + React)
const Editor = React.lazy(() => import('@components/Editor'));

// ✅ Good - Use with Suspense
export const EditorPage = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Editor />
  </Suspense>
);

// ✅ Good - Conditional third-party loading
if (userPreferences.enableAnalytics) {
  await import('@analytics/tracker');
}
```

**Checklist:**

- [ ] No barrel file imports for single utilities
- [ ] Heavy components use `React.lazy()` with `Suspense` boundary
- [ ] Third-party code conditionally loaded
- [ ] Bundle size checked: `npm run build && npm run analyze`

---

### 🟡 HIGH: Data Fetching Optimization

**Pattern:** Deduplicate requests with TanStack Query; parallelize data fetching

```typescript
// ✅ Good - TanStack Query handles deduplication
import { useQuery } from '@tanstack/react-query';

const getCachedUser = async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
};

// ✅ Good - Query deduplicates automatic ally
export const UserProfile = ({ userId }: { userId: string }) => {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getCachedUser(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return <div>{user?.name}</div>;
};

// ✅ Good - Parallel queries
const useUserWithPosts = (userId: string) => {
  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getCachedUser(userId),
  });

  const postsQuery = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => getUserPosts(userId),
  });

  return { user: userQuery.data, posts: postsQuery.data };
};

// ❌ Bad - Fetching too much data
const initialData = {
  user: fullUserObject, // All 50 fields
  posts: allPosts, // 1000 posts
  metadata: { ... }, // Redundant data
};
```

**Checklist:**

- [ ] Data fetching uses TanStack Query for deduplication
- [ ] Query keys are stable and descriptive
- [ ] staleTime configured appropriately
- [ ] Only necessary fields fetched from API
- [ ] Pagination used for large datasets

---

### 🟡 MEDIUM-HIGH: Client-Side Data Fetching

**Pattern:** Use SWR for deduplication; centralize event listeners

```typescript
// ✅ Good - SWR deduplicates
import useSWR from 'swr';

export const UserProfile = () => {
  const { data: user } = useSWR(`/api/user/${id}`, fetcher);
  // Multiple components can use same hook - SWR deduplicates
};

// ❌ Bad - Duplicate fetch calls
const UserProfile = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch(`/api/user/${id}`).then(setUser);
  }, [id]);
};

export const UserPosts = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch(`/api/user/${id}`).then(setUser); // Duplicate!
  }, [id]);
};
```

**Checklist:**

- [ ] Data fetching uses SWR or React Query
- [ ] Event listeners centralized (not multiple per event)
- [ ] No fetch duplication across components
- [ ] Correct cache invalidation strategy

---

### 🟠 MEDIUM: Re-render Optimization

**Pattern:** Extract expensive computations; use functional setState; lazy init state

```typescript
// ✅ Good - Memoized expensive component
const ExpensiveChart = React.memo(({ data }) => {
  return <ComplexChart data={data} />;
});

// ✅ Good - Lazy initialize expensive state
const [heavyState, setHeavyState] = useState(() => {
  return expensiveComputation(); // Only runs once
});

// ✅ Good - Functional setState
setCount(prev => prev + 1); // Doesn't depend on current state closure

// ❌ Bad - Subscribing to state in callbacks
const [form, setForm] = useState({...});
const handleSubmit = useCallback(() => {
  // form reference is stale!
  submitForm(form);
}, []); // Missing form dependency
```

**Checklist:**

- [ ] Expensive computations use useMemo
- [ ] Memoized components use stable props
- [ ] State lazy-initialized
- [ ] useCallback dependencies correct
- [ ] No state subscriptions in callbacks

---

### 🟠 MEDIUM: Rendering Performance

**Pattern:** Use CSS `content-visibility`; hoist static JSX; conditional rendering

```typescript
// ✅ Good - content-visibility for long lists
<div style={{ contentVisibility: 'auto' }}>
  {items.map(item => <ListItem key={item.id} item={item} />)}
</div>

// ✅ Good - Hoist static JSX
const HEADER = <div>Static Header</div>; // Outside component

export const Page = () => {
  return (
    <div>
      {HEADER} {/* Reused, not recreated */}
      {isDynamic && <DynamicContent />}
    </div>
  );
};

// ❌ Bad - Logical AND for conditionals
{isLoading && <Spinner />} // ✅ Better: Use ternary or if

// ❌ Bad - Rendering all list items
{items.map(item => <Item key={item.id} item={item} />)}
// ✅ Better: Virtual scroll for 1000+ items
```

**Checklist:**

- [ ] Long lists use `content-visibility: auto`
- [ ] Static JSX hoisted outside component
- [ ] Conditionals use ternary (not logical AND)
- [ ] Large lists use virtualization (react-window)
- [ ] Animations avoid direct SVG manipulation

---

### 🟢 LOW-MEDIUM: JavaScript Performance

**Pattern:** Batch DOM changes; use Set/Map for O(1) lookups; cache frequently accessed values

```typescript
// ✅ Good - Batch CSS changes
element.style.cssText = 'color: red; background: blue;';

// ✅ Good - Use Map for O(1) lookups
const userMap = new Map(users.map((u) => [u.id, u]));
const user = userMap.get(userId); // O(1)

// ❌ Bad - Individual CSS modifications
element.style.color = 'red';
element.style.background = 'blue'; // Multiple reflows

// ❌ Bad - Array.find for each lookup
const user = users.find((u) => u.id === userId); // O(n)
```

**Checklist:**

- [ ] Batch DOM/CSS modifications
- [ ] Use Map/Set for lookups (not array.find)
- [ ] Cache property access in loops
- [ ] Sort only when necessary (not for min/max)

---

### 🟢 LOW: Advanced Patterns

**Pattern:** Store event handlers in refs for stable references

```typescript
// ✅ Good - Stable callback reference via useRef
const handlerRef = useRef(null);

useEffect(
  () => {
    handlerRef.current = () => {
      // Latest handler logic
    };
  },
  [
    /* dependencies */
  ]
);

const stableHandler = useCallback((e) => {
  handlerRef.current?.(e);
}, []);

// Use stableHandler for event listeners (won't update)
```

**Checklist:**

- [ ] Event handler references stable
- [ ] useRef used for DOM access
- [ ] No function reference recreation on every render

---

## Performance Patterns

### ✅ Rule: Memoize expensive components with React.memo

**Why:** Prevent unnecessary re-renders when props haven't changed

**Checklist:**

- [ ] List items wrapped with React.memo
- [ ] Higher-order components wrapped with memo
- [ ] Callback props to memoized components use useCallback

**Example (Good):**

```tsx
const ListItem = React.memo(({ id, name, onClick }) => (
  <div onClick={() => onClick(id)}>{name} - (expensive render)</div>
));

export const ListContainer = () => {
  const handleClick = useCallback((id) => {
    console.log('Clicked:', id);
  }, []);

  return (
    <div>
      {items.map((item) => (
        <ListItem
          key={item.id}
          id={item.id}
          name={item.name}
          onClick={handleClick} // Stable callback
        />
      ))}
    </div>
  );
};
```

**Example (Bad):**

```tsx
// ❌ No memo - re-renders on every parent render
const ListItem = ({ id, name, onClick }) => <div onClick={() => onClick(id)}>{name}</div>;

// ❌ Callback recreated on every render - defeats memo
export const ListContainer = () => {
  return (
    <div>
      {items.map((item) => (
        <ListItem
          key={item.id}
          onClick={(id) => console.log(id)} // New function every render
        />
      ))}
    </div>
  );
};
```

---

### ✅ Rule: Correct useEffect Dependencies

**Why:** Prevents infinite loops, stale data, and memory leaks

**Checklist:**

- [ ] All external variables in dependency array
- [ ] No missing dependencies
- [ ] No unnecessary dependencies
- [ ] Cleanup function for subscriptions/timers
- [ ] Empty dependency array only for mount-only effects

**Example (Good):**

```tsx
export const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetchUser(userId).then((data) => {
      if (isMounted) {
        setUser(data);
      }
    });

    return () => {
      isMounted = false; // Cleanup
    };
  }, [userId]); // Re-run only when userId changes
};
```

**Example (Bad):**

```tsx
// ❌ Missing userId dependency - stale data
useEffect(() => {
  fetchUser(userId); // Will use initial userId forever
}, []);

// ❌ No cleanup - memory leak
useEffect(() => {
  const subscription = api.subscribe(userId, setUser);
  // Missing: subscription.unsubscribe()
}, [userId]);

// ❌ Unnecessary dependency - causes infinite loops
useEffect(() => {
  setUser(data);
}, [data, setUser]); // setUser is from useState, doesn't need dependency
```

---

### ✅ Rule: useMemo for Expensive Calculations

**Why:** Cache expensive computations and prevent unnecessary recalculations

**Checklist:**

- [ ] Used only for genuinely expensive operations (>1ms)
- [ ] Dependency array includes all external variables
- [ ] Not used prematurely (premature optimization)

**Example (Good):**

```tsx
export const DataAnalyzer = ({ data }) => {
  // Expensive: O(n) calculation
  const statistics = useMemo(() => {
    return {
      sum: data.reduce((a, b) => a + b, 0),
      mean: data.reduce((a, b) => a + b, 0) / data.length,
      max: Math.max(...data),
      min: Math.min(...data),
    };
  }, [data]);

  return <div>Sum: {statistics.sum}</div>;
};
```

---

## Common Anti-patterns to Catch

### ❌ Anti-pattern: Missing keys in lists

**Problem:** React can't track which item moved, causing:

- Incorrect form state in list items
- Animation bugs
- Performance issues

**Checklist:**

- [ ] All lists have `key` prop
- [ ] Keys are stable identifiers (id, not index)
- [ ] No string literals as keys

**Example (Bad):**

```tsx
// ❌ No key - React confused when list changes
{
  items.map((item) => <Item data={item} />);
}

// ❌ Index as key - problematic if list reorders
{
  items.map((item, index) => <Item key={index} data={item} />);
}

// ✅ Good
{
  items.map((item) => <Item key={item.id} data={item} />);
}
```

---

### ❌ Anti-pattern: Props Drilling (Prop Hell)

**Problem:** Passing props through many levels of components

**Solution:** Use Context API when drilling > 3 levels

**Checklist:**

- [ ] Prop drilling depth < 3 levels
- [ ] If > 3 levels, consider Context API or custom hook
- [ ] Ant Design components are exception (intended API)

**Example (Bad):**

```tsx
// ❌ Drilling 4 levels deep
<Page user={user}>
  <Container user={user}>
    <Card user={user}>
      <Profile user={user} />
    </Card>
  </Container>
</Page>
```

**Example (Good):**

```tsx
// ✅ Use Context instead
const UserContext = createContext();

export const App = () => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Page />
    </UserContext.Provider>
  );
};

export const Profile = () => {
  const { user } = useContext(UserContext);
  return <div>{user.name}</div>;
};
```

---

### ❌ Anti-pattern: State in Wrong Place

**Problem:** State lifted or placed inappropriately

**Checklist:**

- [ ] Local component state not lifted to global unnecessarily
- [ ] Shared state between siblings lives in parent
- [ ] Global state only for truly global data (auth, theme, etc.)

**Example (Bad):**

```tsx
// ❌ Global store for local component state
const store = create((set) => ({
  buttonColor: 'blue', // Should be local state
  setButtonColor: (color) => set({ buttonColor: color }),
}));

export const Button = () => {
  const { buttonColor, setButtonColor } = store();
  return <button style={{ background: buttonColor }} />;
};
```

**Example (Good):**

```tsx
export const Button = () => {
  const [color, setColor] = useState('blue');
  return <button style={{ background: color }} />;
};
```

---

## TypeScript Patterns

### ✅ Rule: Type Props Correctly

**Checklist:**

- [ ] All component props explicitly typed
- [ ] No `any` types in props
- [ ] Children properly typed
- [ ] Optional props marked with `?`

**Example (Good):**

```tsx
interface CardProps {
  title: string;
  description?: string; // Optional
  children: React.ReactNode;
  onClick: (id: string) => void;
}

export const Card: React.FC<CardProps> = ({ title, description, children, onClick }) => {
  return <div>{title}</div>;
};
```

---

### ✅ Rule: Event Handler Types

**Checklist:**

- [ ] Form event handlers: `React.FormEvent<HTMLFormElement>`
- [ ] Click handlers: `React.MouseEvent<HTMLButtonElement>`
- [ ] Input change: `React.ChangeEvent<HTMLInputElement>`

**Example (Good):**

```tsx
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // Handle form submission
};

const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  // Handle click
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.currentTarget.value;
  // Handle input change
};
```

---

## Ant Design Integration Patterns

### ✅ Rule: Proper Ant Design Component Usage

**Checklist:**

- [ ] Form uses Ant Design Form component
- [ ] Table renders with Ant Table for performance
- [ ] Modal uses Ant Modal (not custom modals)
- [ ] Icons imported from @ant-design/icons
- [ ] Theme colors use Ant Design tokens

**Example (Good):**

```tsx
import { Form, Input, Button, Table } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export const UserForm = () => {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout="vertical">
      <Form.Item name="username" label="Username" rules={[{ required: true }]}>
        <Input prefix={<UserOutlined />} />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
};
```

---

## TanStack Query Patterns

### ✅ Rule: Proper useQuery Usage

**Checklist:**

- [ ] Query keys are stable and descriptive
- [ ] Query functions are pure
- [ ] Stale time configured appropriately
- [ ] Error handling present
- [ ] Loading states rendered

**Example (Good):**

```tsx
export const UserProfile = ({ userId }: { userId: string }) => {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user', userId], // Stable key
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{user.name}</div>;
};
```

---

## Review Checklist (Quick Reference)

When reviewing React components, check:

### Performance

- [ ] List items have stable keys (not indices)
- [ ] Memoization used appropriately
- [ ] useCallback used for callback dependencies
- [ ] useMemo used for expensive calculations
- [ ] useEffect dependencies correct

### Code Quality

- [ ] Props drilling < 3 levels
- [ ] State in correct location
- [ ] No prop mutability
- [ ] No state mutations

### TypeScript

- [ ] All props typed
- [ ] No `any` types
- [ ] Event handlers typed
- [ ] Children typed properly

### Testing

- [ ] Components testable
- [ ] No hardcoded values
- [ ] Business logic extractable

### Ant Design

- [ ] Using Ant Form for forms
- [ ] Using Ant Table for tables
- [ ] Icons from @ant-design/icons
- [ ] Proper theming approach

---

## Common Issues by Severity

### 🔴 Critical (Must Fix)

- Missing keys in lists
- Memory leaks (no cleanup)
- Infinite loops (useEffect dependencies)
- Props mutations

### 🟡 High (Should Fix)

- Props drilling > 3 levels
- State in wrong place
- No error handling
- Missing TypeScript types

### 🟠 Medium (Nice to Fix)

- Missing useMemo for expensive ops
- Unnecessary re-renders
- No loading states
- Incomplete acceptance criteria

### 🟢 Low (Consider)

- Code style inconsistencies
- Comments clarity
- Naming conventions

---

## Resources

- **React Docs:** <https://react.dev/>
- **Ant Design:** <https://ant.design/components/overview/>
- **TanStack Query:** <https://tanstack.com/query/latest>
- **TypeScript Handbook:** <https://www.typescriptlang.org/docs/>
