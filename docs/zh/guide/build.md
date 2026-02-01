# 构建系统

Toolkit House 使用现代构建工具。

## 构建工具

### TypeScript 库

使用 **unbuild** 构建。

### 应用

使用 **Vite** 构建和开发。

## 命令

### 根级别

```bash
pnpm run build    # 构建所有包
pnpm run test      # 运行所有测试
pnpm run typecheck # 类型检查
```

### 包级别

```bash
cd packages/ts-utils
pnpm run build    # 构建包
pnpm run test     # 运行测试
pnpm run typecheck # 类型检查
```

## 优化

### Bundle 大小分析

```bash
pnpm run build -- --report
```

### 缓存

构建时会自动缓存以加速后续构建。
