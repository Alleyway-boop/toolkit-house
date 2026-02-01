# 测试

学习如何为 Toolkit House 包编写测试。

## 测试框架

使用 **Vitest** 进行测试。

## 运行测试

```bash
# 所有测试
pnpm run test

# 包测试
cd packages/ts-utils
pnpm run test

# 覆盖率
pnpm run test:coverage
```

## 编写测试

### 单元测试

```ts
import { describe, it, expect } from 'vitest'

describe('capitalize', () => {
  it('首字母大写', () => {
    expect(capitalize('hello')).toBe('Hello')
  })
})
```

### 组件测试 (React)

```tsx
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

it('渲染文本', () => {
  render(<Button>点击</Button>)
  expect(screen.getByText('点击')).toBeInTheDocument()
})
```
