# 构建

构建 Toolkit House 包和应用。

## 命令

### 构建所有

```bash
pnpm run build
```

### 构建包

```bash
cd packages/ts-utils
pnpm run build
```

### 构建应用

```bash
cd apps/react-demo
pnpm run build
```

## 输出

### 库输出

```
dist/
├── index.js
└── index.d.ts
```

### 应用输出

```
dist/
├── index.html
└── assets/
    ├── index-[hash].js
    └── index-[hash].css
```
