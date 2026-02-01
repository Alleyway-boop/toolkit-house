# 快速入门

欢迎使用 Toolkit House！本指南将帮助您快速上手。

## 什么是 Toolkit House？

Toolkit House 是一个现代化的前端工具包 monorepo，包含：

- **React 19** 组件库和演示应用
- **Vue 3** 组件库和演示应用
- **TypeScript 工具包**：网络请求、字符串处理、数组操作等
- **验证库**：类型安全的表单验证
- **HTTP 客户端**：支持并发控制和拦截器
- **日志库**：结构化日志记录

## 5 分钟快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/your-org/toolkit-house.git
cd toolkit-house
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 运行演示应用

```bash
# React Demo
cd apps/react-demo
pnpm run dev
# 访问 http://localhost:5173
```

### 4. 探索工具包

```typescript
// 使用 RequestPool 控制并发请求
import { RequestPool } from '@toolkit-house/ts-utils/net'

const pool = new RequestPool(3)
const results = await Promise.all(
  urls.map(url => pool.add(() => fetch(url)))
)

// 使用验证库
import { schema, string } from '@toolkit-house/validation'

const userSchema = schema({
  name: string().required().minLength(2),
  email: string().required().email(),
})

// 使用 React 组件
import { Button, Card } from '@toolkit-house/react-components'

<Button variant="primary">点击我</Button>
```

## 下一步

- 阅读 [入门指南](/zh/guide/getting-started)
- 了解 [Monorepo 结构](/zh/guide/monorepo)
- 查看 [包系统](/zh/guide/packages)
