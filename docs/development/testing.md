# Testing

Learn how to write and run tests for Toolkit House packages.

## Test Framework

We use **Vitest** for testing TypeScript/JavaScript packages and applications.

## Running Tests

### Run All Tests

```bash
pnpm run test
```

### Run Package Tests

```bash
cd packages/ts-utils
pnpm run test
```

### Run with Coverage

```bash
pnpm run test:coverage
```

### Watch Mode

```bash
pnpm run test -- --watch
```

## Writing Tests

### Unit Tests

```typescript
// src/utils.test.ts
import { describe, it, expect } from 'vitest'
import { capitalize } from './utils'

describe('capitalize', () => {
  it('capitalizes first letter', () => {
    expect(capitalize('hello')).toBe('Hello')
  })

  it('handles empty string', () => {
    expect(capitalize('')).toBe('')
  })

  it('handles single character', () => {
    expect(capitalize('a')).toBe('A')
  })
})
```

### Integration Tests

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { HttpClient } from '@toolkit-house/http-client'

describe('HttpClient', () => {
  let client: HttpClient

  beforeEach(() => {
    client = new HttpClient({ baseURL: 'https://api.example.com' })
  })

  it('fetches data', async () => {
    const data = await client.get('/users')
    expect(data).toBeDefined()
  })
})
```

### Component Tests (React)

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    screen.getByText('Click me').click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Component Tests (Vue)

```vue
<!-- Button.test.vue -->
<script setup lang="ts">
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Button', () => {
  it('renders slot content', () => {
    const wrapper = mount(Button, {
      slots: { default: 'Click me' }
    })
    expect(wrapper.text()).toBe('Click me')
  })

  it('emits click event', () => {
    const wrapper = mount(Button)
    wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
</script>
```

## Testing Utilities

### Mocking

```typescript
import { vi, describe, it, expect } from 'vitest'

// Mock a function
const mockFn = vi.fn()
mockFn('arg1', 'arg2')
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')

// Mock a module
vi.mock('./dependency', () => ({
  helper: vi.fn(() => 'mocked'),
}))

// Mock time
vi.useFakeTimers()
vi.advanceTimersByTime(1000)
vi.useRealTimers()
```

### Snapshots

```typescript
it('matches snapshot', () => {
  const tree = render(<MyComponent />)
  expect(tree).toMatchSnapshot()
})
```

### Async Testing

```typescript
it('handles async operations', async () => {
  const result = await asyncFunction()
  expect(result).toBe('expected')
})

it('handles promises', () => {
  return expect(promise).resolves.toBe('value')
})
```

## Test Coverage

### Generate Coverage Report

```bash
pnpm run test:coverage
```

Coverage reports are generated in `coverage/` directory.

### Coverage Thresholds

Configure in `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    coverage: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
})
```

## Best Practices

1. **Arrange-Act-Assert**: Structure tests clearly
2. **Descriptive names**: Make test names self-documenting
3. **One assertion per test**: Keep tests focused
4. **Mock external dependencies**: Don't depend on external services
5. **Test edge cases**: Test boundaries and error conditions

## Next Steps

- Learn about [Building](/development/building)
- Read [Contributing Guidelines](/development/contributing)
