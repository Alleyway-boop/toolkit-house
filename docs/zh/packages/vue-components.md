# @toolkit-house/vue-components

Vue 3 组件库。

**注意**: 这是一个 Git 子模块。

## 组件

### Button

```vue
<template>
  <Button variant="primary" size="md">
    点击我
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
    placeholder="请输入..."
    v-model="value"
  />
</template>
```

### Modal

```vue
<template>
  <Modal v-model:isOpen="isOpen">
    <ModalHeader>标题</ModalHeader>
    <ModalBody>内容</ModalBody>
    <ModalFooter>
      <Button @click="isOpen = false">关闭</Button>
    </ModalFooter>
  </Modal>
</template>
```

## 初始化子模块

```bash
git submodule update --init --recursive
```

## 安装

```bash
pnpm add @toolkit-house/vue-components
```
