# Monorepo 结构

Toolkit House 采用 monorepo 架构组织代码。

## 目录结构

```
toolkit-house/
├── apps/                    # 应用
│   ├── react-demo/         # React 19 演示
│   ├── vue-demo/           # Vue 3 演示
│   ├── svelte-demo/        # Svelte 演示
│   ├── solidjs-demo/       # SolidJS 演示
│   ├── api-gateway/        # GraphQL API 网关
│   └── server-go/          # Go 后端服务
│
├── packages/               # 共享包
│   ├── ts-utils/           # TypeScript 工具
│   ├── validation/         # 验证库
│   ├── http-client/        # HTTP 客户端
│   ├── logger/             # 日志库
│   ├── security/           # 安全工具
│   ├── realtime/           # 实时通信
│   ├── types/              # 共享类型
│   ├── constants/          # 共享常量
│   ├── vue-components/     # Vue 组件（子模块）
│   ├── react-components/   # React 组件
│   └── shared-config/      # 共享配置
│
├── docs/                   # VitePress 文档
├── pnpm-workspace.yaml     # pnpm 工作区配置
├── go.work                 # Go 工作区配置
└── package.json            # 根 package.json
```

## Workspace 配置

### pnpm Workspace

`pnpm-workspace.yaml`:
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'docs'
```

### Go Workspace

`go.work`:
```go
go 1.21

use (
    ./apps/server-go
)
```

## 依赖关系

```
@toolkit-house/validation
├── @toolkit-house/ts-utils
├── @toolkit-house/types
└── @toolkit-house/constants

apps/react-demo
└── @toolkit-house/ts-utils
```

## 构建顺序

依赖包自动按以下顺序构建：

1. 基础包（types、constants）
2. 工具包（ts-utils、logger）
3. 功能包（validation、http-client）
4. UI 包（react-components、vue-components）
5. 应用（react-demo、vue-demo、api-gateway）
