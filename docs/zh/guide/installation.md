# 安装

安装 Toolkit House 及其依赖。

## 前置要求

在安装之前，请确保您的系统已安装以下软件：

- **Node.js**: v18.0.0 或更高版本
- **pnpm**: v8.0.0 或更高版本
- **Git**: 用于克隆仓库

### 检查版本

```bash
node --version   # 应为 v18.0.0+
pnpm --version   # 应为 v8.0.0+
git --version    # 应为 2.0+
```

## 安装方法

### 克隆仓库

```bash
git clone https://github.com/your-org/toolkit-house.git
cd toolkit-house
```

### 安装依赖

```bash
pnpm install
```

这将安装 monorepo 中所有包和应用的依赖。

## 验证安装

安装完成后，运行以下命令验证：

```bash
# 类型检查
pnpm run typecheck

# 运行测试
pnpm run test

# 构建所有包
pnpm run build
```

## 下一步

- 阅读 [快速开始](/zh/guide/quick-start)
- 了解 [Monorepo 结构](/zh/guide/monorepo)
- 设置 [开发环境](/zh/development/setup)
