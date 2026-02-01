# 包系统

Toolkit House 包含多个按用途组织的包。

## 核心包

### @toolkit-house/ts-utils

综合性 TypeScript 工具库。

**功能模块：**
- 网络工具（RequestPool 并发控制）
- 字符串工具（相似度、匹配、格式化）
- 数组和对象操作
- 日期处理
- 验证辅助
- 数据转换
- 排序和搜索算法
- 图算法
- 动态规划
- 数据结构
- 函数式编程
- 缓存实现

### @toolkit-house/validation

类型安全的验证库。

**特性：**
- Schema 验证
- 内置验证器
- 自定义验证支持
- TypeScript 类型推断

### @toolkit-house/http-client

现代 HTTP 客户端。

**特性：**
- RequestPool 并发控制
- 请求/响应拦截器
- 重试逻辑
- 超时处理

### @toolkit-house/logger

轻量级日志库。

**特性：**
- 结构化日志
- 多日志级别
- 可插拔传输
- 自定义格式化器

## UI 组件包

### @toolkit-house/react-components

React 19 组件库。

**组件：**
- Button、Input、Modal、Skeleton、Card、ProgressBar

### @toolkit-house/vue-components

Vue 3 组件库（Git 子模块）。

**组件：**
- Button、Input、Modal、Skeleton

## 支持包

### @toolkit-house/types

共享 TypeScript 类型定义。

### @toolkit-house/constants

共享常量。

### @toolkit-house/shared-config

共享配置（TypeScript、ESLint、Vite）。
