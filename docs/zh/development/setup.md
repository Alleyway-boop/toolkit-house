# 开发环境设置

设置 Toolkit House 开发环境。

## 前置要求

- Node.js v18+
- pnpm v8+
- Git
- Go 1.21+（可选）

## 安装

### 1. 克隆仓库

```bash
git clone https://github.com/your-org/toolkit-house.git
cd toolkit-house
```

### 2. 安装 pnpm

```bash
npm install -g pnpm
```

### 3. 安装依赖

```bash
pnpm install
```

## 验证

```bash
pnpm run typecheck
pnpm run test
pnpm run build
```

## 运行应用

### React Demo

```bash
cd apps/react-demo
pnpm run dev
```

### Vue Demo

```bash
cd apps/vue-demo
pnpm run dev
```

### API Gateway

```bash
cd apps/api-gateway
pnpm run dev
```

## IDE 设置

### VS Code

安装扩展：
- ESLint
- Prettier
- TypeScript Vue Plugin
- Go
