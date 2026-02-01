# @toolkit-house/vue-components

Vue 3 component library for Toolkit House applications.

**Note:** This package is a git submodule. Initialize with:
```bash
git submodule update --init --recursive
```

## Components

### Button

```vue
<template>
  <Button variant="primary" size="md">
    Click me
  </Button>
</template>

<script setup lang="ts">
import { Button } from '@toolkit-house/vue-components'
</script>
```

### Input

```vue
<template>
  <Input
    type="text"
    placeholder="Enter your name"
    v-model="name"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@toolkit-house/vue-components'

const name = ref('')
</script>
```

### Modal

```vue
<template>
  <Modal v-model:isOpen="isOpen">
    <ModalHeader>Title</ModalHeader>
    <ModalBody>Content</ModalBody>
    <ModalFooter>
      <Button @click="isOpen = false">Close</Button>
    </ModalFooter>
  </Modal>
</template>
```

### Skeleton

```vue
<template>
  <Skeleton variant="text" :width="200" :height="20" />
  <Skeleton variant="rectangular" :width="400" :height="200" />
  <Skeleton variant="circular" :width="40" :height="40" />
</template>
```

## Installation

```bash
pnpm add @toolkit-house/vue-components
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
