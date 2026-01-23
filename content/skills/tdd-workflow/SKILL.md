# TDD Workflow Skill

> Test-Driven Development patterns and practices for front-end.
> Reference while implementing features with /plan command.

## TDD Philosophy

**Three Laws of TDD:**

1. You must write a failing test before you write any production code
2. You must not write more of a failing test than is sufficient to fail
3. You must not write more production code than is sufficient to pass

**Benefits:**

- Clear specification of behavior upfront
- Fewer bugs in production
- Easier refactoring (tests catch regressions)
- Better code design (testable code is better code)
- Faster development overall

---

## TDD Workflow: Red-Green-Refactor

### Phase 1: 🔴 Red - Write Failing Test

**Goal:** Define behavior before implementation

```bash
npm run test -- Component.test.ts --watch
```

**Example Test:**

```typescript
// components/Theme/useTheme.test.ts
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

describe('useTheme hook', () => {
  it('should return light theme by default', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');
  });

  it('should toggle theme when toggleTheme is called', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
  });

  it('should persist theme to localStorage', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
```

**Watch output:**

```
FAIL  components/Theme/useTheme.test.ts
● Test suite failed to compile

  Cannot find name 'useTheme'.
```

---

### Phase 2: 🟢 Green - Write Minimal Implementation

**Goal:** Write just enough code to pass the test

```typescript
// components/Theme/useTheme.ts
import { useState } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return { theme, toggleTheme };
};
```

**Watch output:**

```
PASS  components/Theme/useTheme.test.ts (2.3s)
  useTheme hook
    ✓ should return light theme by default (15ms)
    ✓ should toggle theme when toggleTheme is called (8ms)
    ✓ should persist theme to localStorage (5ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        2.3s
```

---

### Phase 3: 🔵 Refactor - Improve Code Quality

**Goal:** Clean up, optimize, extract patterns - tests still pass

```typescript
// Refactored version with better separation of concerns
export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Initialize from localStorage
    const stored = localStorage.getItem('theme');
    return (stored as 'light' | 'dark') ?? 'light';
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return { theme, toggleTheme };
};
```

**Tests still pass:**

```
PASS  components/Theme/useTheme.test.ts
  useTheme hook
    ✓ should return light theme by default
    ✓ should toggle theme when toggleTheme is called
    ✓ should persist theme to localStorage
```

---

## Testing Components

### Unit Test Template

```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
  it('should render with label', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('should call onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    await userEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Integration Test Template

```typescript
// UserForm.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserForm } from './UserForm';

describe('UserForm Integration', () => {
  it('should submit form data', async () => {
    const onSubmit = vi.fn();
    render(<UserForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'John Doe' })
    );
  });
});
```

---

## Testing Patterns

### ✅ Pattern: Querying by Accessible Roles

**Why:** Queries by role are most accessible (they match user experience)

**Checklist:**

- [ ] Use `getByRole` for interactive elements
- [ ] Use `getByLabelText` for form inputs
- [ ] Use `getByText` for text content
- [ ] Avoid `getByTestId` unless necessary

**Example:**

```typescript
// ✅ Good - queries match user experience
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText('Email');
screen.getByText('Error message');

// ❌ Avoid - test implementation details
screen.getByTestId('submit-btn');
screen.getByClassName('form-input');
```

---

### ✅ Pattern: User Events

**Why:** `userEvent` simulates real user interactions better than `fireEvent`

**Checklist:**

- [ ] Use `userEvent` instead of `fireEvent`
- [ ] Use `await` with user interactions
- [ ] Type in form fields with `userEvent.type()`
- [ ] Click buttons with `userEvent.click()`

**Example:**

```typescript
// ✅ Good - simulates user interaction
await userEvent.type(screen.getByLabelText('Name'), 'John');
await userEvent.click(screen.getByRole('button'));

// ❌ Avoid - doesn't simulate real interaction
fireEvent.change(input, { target: { value: 'John' } });
fireEvent.click(button);
```

---

### ✅ Pattern: Async Utilities

**Why:** Components may update asynchronously

**Checklist:**

- [ ] Use `waitFor` for async state updates
- [ ] Use `act` when directly calling functions
- [ ] Use `findByRole` for elements that appear later

**Example:**

```typescript
// ✅ Good - waits for async updates
it('should show loading then result', async () => {
  render(<UserProfile userId="123" />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  expect(screen.getByText('John Doe')).toBeInTheDocument();
});

// Using findBy (shorthand for waitFor + getBy)
it('should display user after loading', async () => {
  render(<UserProfile userId="123" />);
  expect(await screen.findByText('John Doe')).toBeInTheDocument();
});
```

---

## Mocking Patterns

### ✅ Pattern: Mock API Calls with MSW

**Setup (already configured in project):**

```typescript
// __mocks__/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      name: 'John Doe',
    });
  }),
];
```

**Usage in tests:**

```typescript
import { render, screen } from '@testing-library/react';
import { UserProfile } from './UserProfile';

describe('UserProfile with MSW', () => {
  it('should load and display user', async () => {
    render(<UserProfile userId="123" />);

    // MSW intercepts the API call
    expect(await screen.findByText('John Doe')).toBeInTheDocument();
  });
});
```

---

### ✅ Pattern: Mock Context

```typescript
it('should use theme from context', () => {
  const mockTheme = { theme: 'dark', toggleTheme: vi.fn() };

  render(
    <ThemeContext.Provider value={mockTheme}>
      <ThemedButton />
    </ThemeContext.Provider>
  );

  expect(screen.getByRole('button')).toHaveStyle({ background: 'dark' });
});
```

---

### ✅ Pattern: Mock Custom Hooks

```typescript
import { useQuery } from '@tanstack/react-query';

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({
    data: { name: 'John' },
    isLoading: false,
    error: null,
  })),
}));

it('should display data from hook', () => {
  render(<Component />);
  expect(screen.getByText('John')).toBeInTheDocument();
});
```

---

## Coverage Goals

| Category          | Target | Priority |
| ----------------- | ------ | -------- |
| **Components**    | 80%+   | High     |
| **Custom Hooks**  | 85%+   | High     |
| **Utils/Helpers** | 90%+   | High     |
| **Overall**       | 80%+   | High     |

**Check coverage:**

```bash
npm run test -- --coverage
```

**Example output:**

```
------|----------|----------|----------|----------|---------|
File  | % Stmts  | % Branch | % Funcs  | % Lines  | Uncovered Line #s
------|----------|----------|----------|----------|---------|
All   | 82.5     | 78.3     | 84.2     | 82.5     |
------|----------|----------|----------|----------|---------|
```

---

## Common Test Scenarios

### Scenario 1: Form Submission

```typescript
it('should submit form with validation', async () => {
  const { container } = render(<LoginForm />);

  // Should show error for empty fields
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  expect(screen.getByText('Email is required')).toBeInTheDocument();

  // Should submit when valid
  await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
  await userEvent.type(screen.getByLabelText('Password'), 'password123');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));

  expect(screen.getByText('Login successful')).toBeInTheDocument();
});
```

### Scenario 2: Async Data Loading

```typescript
it('should load data and handle errors', async () => {
  render(<DataList />);

  // Loading state
  expect(screen.getByText('Loading...')).toBeInTheDocument();

  // Data loaded
  expect(await screen.findByText('Item 1')).toBeInTheDocument();
  expect(screen.getByText('Item 2')).toBeInTheDocument();

  // Check data integrity
  expect(screen.getAllByRole('listitem')).toHaveLength(2);
});
```

### Scenario 3: User Interactions

```typescript
it('should handle filter interactions', async () => {
  render(<Table data={mockData} />);

  // Click filter button
  await userEvent.click(screen.getByRole('button', { name: /filter/i }));

  // Modal appears
  expect(screen.getByRole('dialog')).toBeInTheDocument();

  // Select filter option
  await userEvent.click(screen.getByLabelText('Priority'));
  await userEvent.click(screen.getByRole('option', { name: 'High' }));

  // Verify results updated
  await waitFor(() => {
    expect(screen.getAllByRole('row')).toHaveLength(3); // 1 header + 2 data rows
  });
});
```

---

## TDD Workflow Checklist

When implementing a feature with TDD:

- [ ] Write failing test (🔴 Red)
- [ ] Write minimal passing code (🟢 Green)
- [ ] Refactor if needed (🔵 Refactor)
- [ ] All tests pass
- [ ] Coverage > 80%
- [ ] No `skip` or `only` in tests
- [ ] No console.error in output
- [ ] Code review passes
- [ ] Feature works in browser

---

## Resources

- **@testing-library/react:** <https://testing-library.com/react>
- **Vitest:** <https://vitest.dev/>
- **MSW (API Mocking):** <https://mswjs.io/>
- **Testing Best Practices:** <https://testing-library.com/docs/>
- **TDD Handbook:** <https://www.freecodecamp.org/news/test-driven-development/>
