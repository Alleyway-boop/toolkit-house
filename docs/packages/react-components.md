# @toolkit-house/react-components

React component library for Toolkit House applications.

## Features

- React 19 support
- TypeScript types
- Accessible components
- Tailwind CSS styling
- composable design

## Components

### Button

```tsx
import { Button } from '@toolkit-house/react-components'

<Button variant="primary" size="md">
  Click me
</Button>
```

**Props:**
- `variant?: 'primary' | 'secondary' | 'outline' | 'ghost'`
- `size?: 'sm' | 'md' | 'lg'`
- `disabled?: boolean`
- `className?: string`
- `children: React.ReactNode`

### Input

```tsx
import { Input } from '@toolkit-house/react-components'

<Input
  type="text"
  placeholder="Enter your name"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

**Props:**
- `type?: string`
- `placeholder?: string`
- `value?: string`
- `disabled?: boolean`
- `error?: string`
- `className?: string`

### Modal

```tsx
import { Modal } from '@toolkit-house/react-components'

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <ModalHeader>Title</ModalHeader>
  <ModalBody>Content</ModalBody>
  <ModalFooter>
    <Button onClick={() => setIsOpen(false)}>Close</Button>
  </ModalFooter>
</Modal>
```

### Skeleton

```tsx
import { Skeleton } from '@toolkit-house/react-components'

<Skeleton variant="text" width={200} height={20} />
<Skeleton variant="rectangular" width={400} height={200} />
<Skeleton variant="circular" width={40} height={40} />
```

### Card

```tsx
import { Card } from '@toolkit-house/react-components'

<Card title="Title" className="my-card">
  <p>Content goes here</p>
</Card>
```

### ProgressBar

```tsx
import { ProgressBar } from '@toolkit-house/react-components'

<ProgressBar value={50} max={100} />
```

## Installation

```bash
pnpm add @toolkit-house/react-components
```

## Development

```bash
# Run with Storybook
pnpm run dev

# Build
pnpm run build

# Test
pnpm run test
```

## License

MIT
