# Toolkit House

一个前端工程化工具库 monorepo：共享 TypeScript 包、许可证工具，以及 React / Vue / Svelte / SolidJS 演示应用与 Go 服务。

## 项目结构

```text
toolkit-house/
├── packages/
│   ├── constants/              # 常量与设计令牌
│   ├── http-client/            # HTTP 客户端（并发控制、拦截器）
│   ├── license-generator-package/  # 许可证生成与校验（AES-256-GCM，子模块）
│   ├── logger/                 # 结构化日志
│   ├── react-components/       # React 组件库
│   ├── shared-config/          # 共享 TS/ESLint/Vite 配置
│   ├── ts-utils/               # TypeScript 工具库（子模块）
│   ├── types/                  # 零依赖类型工具
│   ├── validation/             # 类型安全校验库
│   └── vue-components/         # Vue 3 组件库（子模块）
├── apps/
│   ├── react-demo/             # React 19 演示（子模块）
│   ├── vue-demo/               # Vue 3 演示
│   ├── svelte-demo/            # SvelteKit 演示
│   ├── solidjs-demo/           # SolidJS 演示
│   └── server-go/              # Go 后端服务（子模块）
└── docs/                       # 项目文档
```

## 快速开始

环境要求：Node.js >= 18.20、pnpm >= 8、Go 1.21+（仅 Go 服务需要）。

```bash
# 克隆（包含子模块）
git clone --recursive <repository-url>
cd toolkit-house

# 已克隆过的仓库补齐子模块
git submodule update --init --recursive

# 安装依赖
pnpm install

# 构建全部包
pnpm run build

# 运行全部测试
pnpm run test

# 类型检查
pnpm run typecheck
```

## 常用命令

```bash
pnpm run build      # 构建所有包
pnpm run dev        # 各包并行启动开发模式
pnpm run test       # 运行所有测试
pnpm run lint       # 代码检查
pnpm run typecheck  # 类型检查
pnpm run format     # Prettier 格式化
pnpm run clean      # 清理构建产物与 node_modules（跨平台）
```

## 核心包简介

### ts-utils

TypeScript 工具库：网络请求池、字符串相似度、缓存（LRU/FIFO）、排序、搜索、图算法、数据结构、函数式工具。

```typescript
import { RequestPool } from '@toolkit-house/ts-utils/net'

const pool = new RequestPool(3)
const result = await pool.add(() => fetch('/api/endpoint'))
```

### license-generator

许可证生成与校验，基于 AES-256-GCM 认证加密，密钥只通过 `LICENSE_ENCRYPTION_KEY` 环境变量或显式传参注入，绝不写入配置文件。

```bash
pnpm --filter @toolkit-house/license-generator gen-key
$env:LICENSE_ENCRYPTION_KEY = "<生成的密钥>"
pnpm --filter @toolkit-house/license-generator generate 365
```

详见 [license-generator README](packages/license-generator-package/README.md)。

### http-client / validation / logger / types / constants

分别提供并发控制 HTTP 客户端、流式类型安全校验、结构化日志、类型工具与常量令牌，均使用 unbuild 构建双格式产物并带有完整 `exports` 映射。

### react-components / vue-components

组件库包分别面向 React 与 Vue 3，配套 Storybook / UnoCSS，可供各框架 demo 直接消费。

## 构建体系

- TypeScript 包：unbuild / tsc 构建，Vitest 测试，ESLint 9 检查，严格模式 TS。
- 应用：Vite 7 构建（React、Vue、Svelte、SolidJS）。
- Go 服务：标准 Go workspace。

## 测试

```bash
pnpm -r run test          # 全部包测试
pnpm -r run test:ci       # CI 模式（已支持的包）
pnpm -r run typecheck     # 全部包类型检查
```

license-generator 包额外覆盖安全场景：密钥强度、篡改检测（IV / 认证标签 / 密文 / 版本字节）、跨密钥拒绝、配置文件密钥禁令。

## 文档

- [架构文档](ARCHITECTURE.md)
- [贡献指南](CONTRIBUTING.md)
- [开发环境](docs/development-setup.md)
- [ts-utils API](docs/ts-utils.md)
- [License Generator](packages/license-generator-package/README.md)

## 许可证

MIT License，见 [LICENSE](LICENSE)。
