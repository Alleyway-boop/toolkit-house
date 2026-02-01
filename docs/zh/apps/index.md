# 应用

展示 Toolkit House 包的演示应用。

## 演示应用

| 应用 | 描述 | 框架 | URL |
|------|------|------|-----|
| [React Demo](/zh/apps/react-demo) | 全栈 GraphQL 演示，使用 Apollo | React 19 | `/react-demo` |
| [Vue Demo](/zh/apps/vue-demo) | Vue 3 演示，使用 Composition API | Vue 3 | `/vue-demo` |
| Svelte Demo | Svelte 演示应用 | Svelte | `/svelte-demo` |
| SolidJS Demo | SolidJS 演示应用 | SolidJS | `/solidjs-demo` |

## 服务

| 应用 | 描述 | 技术 |
|------|------|------|
| [API Gateway](/zh/apps/api-gateway) | GraphQL API 网关，含认证和限流 | graphql-yoga |
| [Go Server](/zh/apps/server-go) | Go 后端 REST API | Go 1.21+ |

## 运行演示

### 前置条件

```bash
# 安装依赖
pnpm install
```

### React Demo

```bash
cd apps/react-demo
pnpm run dev
# http://localhost:5173
```

### Vue Demo

```bash
cd apps/vue-demo
pnpm run dev
# http://localhost:5174
```

### API Gateway

```bash
cd apps/api-gateway
pnpm run dev
# http://localhost:4000/graphql
```

## 功能概述

### React Demo

- Apollo Client for GraphQL
- JWT 认证
- 实时订阅
- RequestPool 并发控制

### Vue Demo

- Apollo Client for GraphQL
- Composition API
- 响应式状态管理

### API Gateway

- GraphQL Schema & Resolvers
- Shield 授权
- Redis 限流
- WebSocket 订阅
