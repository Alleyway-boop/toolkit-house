# Creating a Component

Learn how to create reusable UI components for the Toolkit House component libraries.

## Overview

Toolkit House provides component libraries for both React and Vue. This tutorial shows how to add a new component to either library.

## React Component Tutorial

Let's create a **Badge** component for the React component library.

### Step 1: Create Component File

Create `packages/react-components/src/Badge.tsx`:

```tsx
import React from 'react'

export interface BadgeProps {
  /** Badge content */
  children: React.ReactNode
  /** Badge variant */
  variant?: 'default' | 'success' | 'warning' | 'error'
  /** Badge size */
  size?: 'sm' | 'md' | 'lg'
  /** Additional CSS class */
  className?: string
}

const variantStyles: Record<Exclude<BadgeProps['variant'], undefined>, string> = {
  default: 'bg-gray-500 text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-black',
  error: 'bg-red-500 text-white',
}

const sizeStyles: Record<Exclude<BadgeProps['size'], undefined>, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'default', size = 'md', className = '' }, ref) => {
    const classes = [
      'inline-flex items-center justify-center rounded-full font-medium',
      variantStyles[variant],
      sizeStyles[size],
      className,
    ].filter(Boolean).join(' ')

    return (
      <span ref={ref} className={classes}>
        {children}
      </span>
    )
  },
)

Badge.displayName = 'Badge'
```

### Step 2: Export Component

Add to `packages/react-components/src/index.ts`:

```typescript
export * from './Badge'
export * from './Button'
export * from './Input'
// ... other exports
```

### Step 3: Create Tests

Create `packages/react-components/src/Badge.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('applies variant styles', () => {
    const { rerender } = render(<Badge variant="success">Success</Badge>)
    expect(screen.getByText('Success')).toHaveClass('bg-green-500')

    rerender(<Badge variant="error">Error</Badge>)
    expect(screen.getByText('Error')).toHaveClass('bg-red-500')
  })

  it('applies size styles', () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>)
    expect(screen.getByText('Small')).toHaveClass('text-xs')

    rerender(<Badge size="lg">Large</Badge>)
    expect(screen.getByText('Large')).toHaveClass('text-base')
  })
})
```

### Step 4: Build and Test

```bash
cd packages/react-components
pnpm run build
pnpm run test
```

## Vue Component Tutorial

Let's create a **Badge** component for the Vue component library.

### Step 1: Create Component

Create `packages/vue-components/src/Badge.vue`:

```vue
<script setup lang="ts">
interface Props {
  variant?: 'default' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
})
</script>

<template>
  <span
    class="badge"
    :class="[
      `badge--${variant}`,
      `badge--${size}`,
    ]"
  >
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-weight: 500;
}

.badge--default {
  background-color: #6b7280;
  color: white;
}

.badge--success {
  background-color: #22c55e;
  color: white;
}

.badge--warning {
  background-color: #eab308;
  color: black;
}

.badge--error {
  background-color: #ef4444;
  color: white;
}

.badge--sm {
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
}

.badge--md {
  padding: 0.25rem 0.625rem;
  font-size: 0.875rem;
}

.badge--lg {
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
}
</style>
```

### Step 2: Export Component

Add to `packages/vue-components/src/index.ts`:

```typescript
export { default as Badge } from './Badge.vue'
export { default as Button } from './Button.vue'
// ... other exports
```

### Step 3: Build and Test

```bash
cd packages/vue-components
pnpm run build
pnpm run test
```

## Usage Examples

### React Demo Usage

```tsx
// apps/react-demo/src/App.tsx
import { Badge } from '@toolkit-house/react-components'

function App() {
  return (
    <div>
      <Badge variant="success">Completed</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="error">Failed</Badge>
    </div>
  )
}
```

### Vue Demo Usage

```vue
<!-- apps/vue-demo/src/App.vue -->
<script setup lang="ts">
import { Badge } from '@toolkit-house/vue-components'
</script>

<template>
  <div>
    <Badge variant="success">Completed</Badge>
    <Badge variant="warning">Pending</Badge>
    <Badge variant="error">Failed</Badge>
  </div>
</template>
```

## Component Best Practices

### 1. TypeScript Support

Always provide proper TypeScript types:

```tsx
// ✅ Good - with types
export interface ButtonProps {
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export const Button = (props: ButtonProps) => { ... }

// ❌ Bad - without types
export const Button = (props: any) => { ... }
```

### 2. Default Props

Use reasonable defaults:

```tsx
// ✅ Good - with defaults
interface Props {
  size?: 'sm' | 'md' | 'lg'
}
const { size = 'md' } = props

// ❌ Bad - required when optional is better
interface Props {
  size: 'sm' | 'md' | 'lg'
}
```

### 3. forwardRef (React)

Use forwardRef for ref support:

```tsx
// ✅ Good - with forwardRef
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return <button ref={ref} {...props} />
  }
)

// ❌ Bad - no ref support
export const Button = (props: ButtonProps) => {
  return <button {...props} />
}
```

### 4. Composable Design

Make components composable:

```tsx
// ✅ Good - composable
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// ❌ Bad - props explosion
<Card
  headerTitle="Title"
  headerAction={<button>Action</button>}
  content="Content"
  footer={<div>Footer</div>}
/>
```

## Next Steps

- Learn about [Adding a Package](/guide/tutorials/package)
- Explore [Building an App](/guide/tutorials/app)
- Read [API Reference](/api/)
