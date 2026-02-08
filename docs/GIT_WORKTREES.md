# Git Worktrees 使用指南

## 什么是 Git Worktrees？

Git Worktrees 允许您在同一仓库中同时检出多个分支到不同的目录，而不需要克隆多个副本。这对于并行开发多个任务非常有用。

## 当前设置

- **主工作目录**: `/root/toolkit-house` (当前在 `master` 分支)
- **代码审查改进工作树**: `.worktrees/code-review-improvements` (在 `code-review-improvements` 分支)

## 工作树列表

```bash
git worktree list
```

当前工作树：
```
/root/toolkit-house                                      5ebc82e [master]
/root/toolkit-house/.worktrees/code-review-improvements  9090dc3 [code-review-improvements]
```

## 从 code-review-improvements 分支创建新工作树

### 方法 1: 创建新的功能分支工作树

```bash
# 从 code-review-improvements 分支创建新分支和新工作树
git worktree add .worktrees/feature-xyz -b feature-xyz code-review-improvements

# 进入新工作树
cd .worktrees/feature-xyz

# 安装依赖
pnpm install --force

# 开始工作
```

### 方法 2: 直接检出现有分支

```bash
# 如果分支已存在，直接创建工作树
git worktree add .worktrees/existing-branch existing-branch

# 进入新工作树
cd .worktrees/existing-branch

# 安装依赖
pnpm install --force
```

## 在工作树中工作

1. **进入工作树目录**:
   ```bash
   cd .worktrees/your-worktree-name
   ```

2. **安装依赖**（第一次进入工作树时）:
   ```bash
   pnpm install --force
   ```

3. **正常开发和测试**:
   ```bash
   # 运行测试
   pnpm run test

   # 运行特定包的测试
   cd packages/some-package && pnpm run test

   # 构建项目
   pnpm run build
   ```

4. **提交更改**:
   ```bash
   git add .
   git commit -m "Your commit message"
   ```

## 删除工作树

完成工作后，可以删除工作树：

```bash
# 1. 删除工作树
git worktree remove .worktrees/your-worktree-name

# 2. 如果你想删除关联的分支
git branch -d your-branch-name
```

## 工作树最佳实践

### 1. 命名规范
- 使用描述性名称：`.worktrees/feature-user-auth`
- 使用前缀分类：`feature-`, `bugfix-`, `experiment-`

### 2. 依赖管理
- 每个工作树需要独立安装依赖
- 使用 `pnpm install --force` 确保正确安装
- 工作树不共享 node_modules（路径问题）

### 3. 子模块处理
如果工作树包含子模块（如 ts-utils、vue-components），可能需要手动初始化：
```bash
# 如果子模块为空，从主仓库复制内容
cp -r /root/toolkit-house/packages/ts-utils/. .worktrees/your-worktree/packages/ts-utils/
```

### 4. 并行工作
您可以在多个工作树中同时工作：
```bash
# 终端 1: 在工作树 A 中工作
cd .worktrees/feature-auth
pnpm run dev

# 终端 2: 在工作树 B 中工作
cd .worktrees/feature-api
pnpm run test
```

## 常见问题

### Q: 工作树中的子模块是空的怎么办？
A: 从主仓库复制子模块内容：
```bash
cp -r /root/toolkit-house/packages/submodule-name/. .worktrees/your-worktree/packages/submodule-name/
```

### Q: pnpm 找不到模块？
A: 在工作树根目录运行：
```bash
pnpm install --force
```

### Q: 如何查看所有工作树？
A:
```bash
git worktree list
```

### Q: 如何清理过时的工作树？
A:
```bash
# 查看所有工作树
git worktree list

# 删除不需要的工作树
git worktree remove .worktrees/old-worktree
```

## code-review-improvements 分支包含的改进

该分支包含以下代码审查改进：

1. **类型安全增强** (http-client)
   - 添加 `RequestConfigExtensions` 接口
   - 移除 `any` 类型使用

2. **代码风格修复** (ts-utils)
   - 修复缺失的分号

3. **编码标准文档** (CODING_STANDARDS.md)
   - 全面的编码规范指南

4. **测试覆盖增强**
   - security 包: 44 个测试
   - realtime 包: 45 个测试
   - types 包: 45 个错误处理测试

5. **统一错误处理** (types package)
   - `ErrorCode` 枚举
   - `Result<T, E>` 类型
   - 错误类层次结构
   - 错误工厂函数

## 快速开始

从 code-review-improvements 开始新任务：

```bash
# 1. 创建新工作树
git worktree add .worktrees/my-feature -b my-feature code-review-improvements

# 2. 进入工作树
cd .worktrees/my-feature

# 3. 安装依赖
pnpm install --force

# 4. 开始工作！
```

## 相关资源

- [Git Worktrees 官方文档](https://git-scm.com/docs/git-worktree)
- [项目编码标准](../CODING_STANDARDS.md)
- [项目贡献指南](../CONTRIBUTING.md)
