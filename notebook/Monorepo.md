# Monorepo 的实践与原理

## 什么是 Monorepo

Monorepo（单体代码库）是一种将多个项目或模块的代码集中存放在同一个代码仓库中的管理方式。与之相对的是 Polyrepo（多仓库），即每个项目或模块单独维护一个仓库。

## Monorepo 的原理

Monorepo 的核心思想是通过统一的代码仓库，实现跨项目的依赖管理、版本控制和协作。所有项目共享同一套构建、测试和发布流程，便于代码复用和一致性维护。

## Monorepo 的优点

- **统一依赖管理**：可以集中管理依赖库，避免版本冲突。
- **原子化提交**：跨项目的更改可以在一次提交中完成，保证一致性。
- **代码复用**：模块之间可以直接引用，无需发布到外部仓库。
- **统一的开发体验**：构建、测试、CI/CD 流程一致，降低维护成本。
- **便于大规模重构**：全局搜索和替换、批量升级依赖更方便。

## Monorepo 的缺点

- **仓库体积大**：随着项目增多，仓库变得庞大，影响 clone 和 CI 性能。
- **权限管理复杂**：难以对不同项目设置细粒度权限。
- **构建效率问题**：全量构建和测试成本高，需要借助工具优化。

## 常见的 Monorepo 工具

- **Lerna**：适用于 JavaScript/TypeScript 项目的包管理和发布。
- **Nx**：支持多语言，提供智能构建和依赖分析。
- **Bazel**：Google 开源的高性能构建系统，支持多语言和大规模项目。
- **Rush**：微软出品，专注于大型前端仓库的依赖管理。

## Monorepo 的最佳实践

1. **合理划分项目结构**：按功能或领域拆分子包，避免耦合。
2. **自动化构建与测试**：利用工具只构建和测试受影响的部分。
3. **规范化依赖管理**：统一依赖版本，避免“幽灵依赖”。
4. **持续集成与发布**：配置高效的 CI/CD 流程，自动化发布。
5. **文档与沟通**：为 Monorepo 结构和流程提供清晰文档，便于团队协作。

## 总结

Monorepo 适合中大型团队和多模块协作的场景，能够提升协作效率和代码一致性。但也需要配合合适的工具和流程，解决规模带来的性能和管理挑战。

## Monorepo 实践指南

### 1. 初始化 Monorepo 仓库

以 JavaScript/TypeScript 项目为例，可以使用 [Nx](https://nx.dev/) 或 [Lerna](https://lerna.js.org/) 初始化：

```bash
npx create-nx-workspace@latest my-monorepo
# 或
npx lerna init
```

### 2. 组织项目结构

建议采用如下目录结构：

```
/packages
    /module-a
    /module-b
/tools
    /scripts
```

每个子模块独立维护 `package.json`，主仓库可有统一的依赖管理配置。

### 3. 配置依赖管理

使用 [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) 或 [Yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) 实现依赖统一管理：

```json
// package.json
{
  "workspaces": ["packages/*"]
}
```

### 4. 设置自动化构建与测试

结合 CI 工具（如 GitHub Actions、GitLab CI）和 Monorepo 工具的 affected 命令，只构建和测试受影响的模块：

```bash
nx affected:test
nx affected:build
```

### 5. 规范化提交与发布

可结合 [Conventional Commits](https://www.conventionalcommits.org/) 和 [semantic-release](https://semantic-release.gitbook.io/) 实现自动化版本管理和发布。

### 6. 持续优化

- 定期清理无用依赖和模块
- 优化 CI/CD 流程，提升构建效率
- 加强文档和团队协作

通过以上步骤，可以高效地落地和维护一个可扩展的 Monorepo 项目。
