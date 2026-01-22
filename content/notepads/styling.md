# Styling Skill

Domain-specific knowledge for styling in this project.

## Styled Components

### Basic Pattern

```typescript
import styled from 'styled-components';

export const Component = () => {
  return <Wrapper>Hello World</Wrapper>;
};

const Wrapper = styled.div`
  padding: 1rem;
  background: #ffffff;
`;
```

### Component with Styled Props

```typescript
interface Props {
  variant: 'primary' | 'secondary';
  size: 'small' | 'medium' | 'large';
}

export const Button: FC<Props> = ({ variant = 'primary', size = 'medium', children }) => {
  return <StyledButton variant={variant} size={size}>{children}</StyledButton>;
};

const StyledButton = styled.button<{ variant: 'primary' | 'secondary'; size: 'small' | 'medium' | 'large' }>`
  ${({ variant, size }) => `
    padding: ${size === 'small' ? '0.5rem 1rem' : size === 'medium' ? '1rem 2rem' : '1.5rem 3rem'};
    background: ${variant === 'primary' ? '#1890ff' : '#ffffff'};
    color: ${variant === 'primary' ? '#ffffff' : '#1890ff'};
    border: ${variant === 'primary' ? 'none' : '1px solid #1890ff'};
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      opacity: 0.8;
    }

    &:active {
      transform: scale(0.98);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `}
`;
```

### Common Styled Components

```typescript
// Container
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`

// Flexbox utilities
export const Flex = styled.div<{
  direction?: 'row' | 'column'
  align?: 'start' | 'center' | 'end'
  justify?: 'start' | 'center' | 'end' | 'space-between'
}>`
  display: flex;
  flex-direction: ${({ direction }) => direction || 'row'};
  align-items: ${({ align }) => align || 'stretch'};
  justify-content: ${({ justify }) => justify || 'flex-start'};
`

// Grid
export const Grid = styled.div<{ columns?: number; gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns || 12}, 1fr);
  gap: ${({ gap }) => gap || '1rem'};
`
```

## Tailwind CSS Utilities

### Layout

```typescript
export const Layout: FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 bg-white shadow-sm">
        {/* Header content */}
      </header>
      <main className="flex-1 p-6">
        {/* Main content */}
      </main>
      <footer className="px-6 py-4 bg-gray-100">
        {/* Footer content */}
      </footer>
    </div>
  );
};
```

### Responsive Design

```typescript
export const ResponsiveComponent: FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="p-6 bg-white rounded-lg shadow-sm">
        {/* Content */}
      </div>
    </div>
  );
};
```

### Spacing and Typography

```typescript
export const Card: FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Card Title
      </h2>
      <p className="text-gray-600 mb-4">
        Card content goes here.
      </p>
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
        Action
      </button>
    </div>
  );
};
```

## Responsive Design

### Breakpoints

```typescript
// Mobile-first approach
const breakpoints = {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
}

export const Responsive = styled.div`
  padding: 1rem;

  @media (min-width: ${breakpoints.md}) {
    padding: 2rem;
  }

  @media (min-width: ${breakpoints.lg}) {
    padding: 3rem;
  }
`
```

### Responsive Component Example

```typescript
export const ResponsiveGrid: FC = () => {
  return (
    <Wrapper>
      {items.map(item => (
        <Item key={item.id}>{item.name}</Item>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;
```

## Accessibility

### ARIA Attributes

```typescript
export const AccessibleButton: FC<Props> = ({ children, onClick, disabled, ariaLabel }) => {
  return (
    <StyledButton
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      role="button"
      aria-disabled={disabled}
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  &:focus-visible {
    outline: 2px solid #1890ff;
    outline-offset: 2px;
  }
`;
```

### Semantic HTML with Styling

```typescript
export const AccessibleCard: FC = () => {
  return (
    <article className="p-6 bg-white rounded-lg shadow-sm">
      <header>
        <h2 className="text-xl font-semibold text-gray-900">
          Card Title
        </h2>
      </header>
      <p className="text-gray-600 mt-4">
        Card content
      </p>
    </article>
  );
};
```

### Focus Management

```typescript
export const FocusableComponents: FC = () => {
  return (
    <div className="space-y-4">
      <button className="focus:ring-2 focus:ring-blue-500 focus:outline-none">
        Button
      </button>
      <input
        type="text"
        className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="Input"
      />
    </div>
  );
};
```

## Color Palette

### Primary Colors

```typescript
const colors = {
  primary: {
    50: '#e6f7ff',
    100: '#bae7ff',
    200: '#91d5ff',
    300: '#69c0ff',
    400: '#40a9ff',
    500: '#1890ff', // Primary
    600: '#096dd9',
    700: '#0050b3',
    800: '#003a8c',
    900: '#002766',
  },
  success: {
    50: '#f6ffed',
    100: '#d9f7be',
    200: '#b7eb8f',
    300: '#95de64',
    400: '#73d13d',
    500: '#52c41a', // Success
    600: '#389e0d',
    700: '#237804',
    800: '#135200',
    900: '#092b00',
  },
  error: {
    50: '#fff2f0',
    100: '#ffccc7',
    200: '#ffa39e',
    300: '#ff7875',
    400: '#ff4d4f',
    500: '#f5222d', // Error
    600: '#cf1322',
    700: '#a8071a',
    800: '#820014',
    900: '#5c0011',
  },
}
```

### Using Colors

```typescript
export const ThemedComponent: FC = () => {
  return (
    <StyledComponent>
      <Header background={colors.primary[500]}>Primary</Header>
      <Content>
        <SuccessBadge background={colors.success[500]}>Success</SuccessBadge>
        <ErrorBadge background={colors.error[500]}>Error</ErrorBadge>
      </Content>
    </StyledComponent>
  );
};
```

## Spacing Scale

```typescript
const spacing = {
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
}

// Usage
export const SpacedComponent = styled.div`
  padding: ${spacing[4]};
  margin: ${spacing[6]} 0;
  gap: ${spacing[3]};
`
```

## Dark Mode Support

```typescript
export const DarkModeAware: FC = () => {
  return (
    <Wrapper>
      <Title>Content</Title>
      <Body>This content adapts to dark mode</Body>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 1rem;
  background: ${props => props.theme.mode === 'dark' ? '#1f1f1f' : '#ffffff'};
  color: ${props => props.theme.mode === 'dark' ? '#ffffff' : '#000000'};
`;

const Title = styled.h2`
  color: ${props => props.theme.mode === 'dark' ? '#ffffff' : '#000000'};
`;

const Body = styled.p`
  color: ${props => props.theme.mode === 'dark' ? '#d9d9d9' : '#595959'};
`;
```

## Best Practices

### DO

- Use styled-components for reusable components
- Use Tailwind for layout and utility classes
- Follow mobile-first responsive design
- Implement proper focus states for accessibility
- Use semantic HTML elements
- Maintain consistent spacing with a scale

### DON'T

- Use inline `style={}` props
- Use !important (use specificity instead)
- Hardcode colors without a palette
- Mix styled-components and inline styles
- Skip focus states for interactive elements
- Use arbitrary values in Tailwind

## References

- `.cursor/rules/styling.mdc` — Full styling documentation
- Styled Components: https://styled-components.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
