# @toolkit-house/react-components

React 组件库。

## 组件

### Button

```tsx
import { Button } from '@toolkit-house/react-components'

<Button variant="primary" size="md">
  点击我
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean

### Input

```tsx
<Input
  type="text"
  placeholder="请输入..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### Modal

```tsx
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <ModalHeader>标题</ModalHeader>
  <ModalBody>内容</ModalBody>
  <ModalFooter>
    <Button onClick={() => setIsOpen(false)}>关闭</Button>
  </ModalFooter>
</Modal>
```

## 安装

```bash
pnpm add @toolkit-house/react-components
```
