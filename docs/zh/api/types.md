---
---

<!-- <div v-pre> -->
# @toolkit-house/types API 参考

Toolkit House monorepo 的共享 TypeScript 类型定义。

## 安装

```bash
pnpm add @toolkit-house/types
```

## 概述

此包提供 Toolkit House monorepo 中使用的通用类型定义，确保类型一致性并减少重复。

---

## 核心类型

### Result

用于可能成功或失败的操作的类型。

```typescript
interface Result<T, E = Error> {
  success: boolean
  data?: T
  error?: E
}
```

**示例：**

```typescript
import type { Result } from '@toolkit-house/types'

function fetchData(): Result<Data> {
  try {
    const data = fetchSomething()
    return { success: true, data }
  } catch (error) {
    return { success: false, error }
  }
}
```

---

### Nullable

可以为 null 的值的类型。

```typescript
type Nullable<T> = T | null
```

---

### Optional

可以为 undefined 的值的类型。

```typescript
type Optional<T> = T | undefined
```

---

### Maybe

可以为 null 或 undefined 的值的类型。

```typescript
type Maybe<T> = T | null | undefined
```

---

## 工具类型

### DeepPartial

递归地使所有属性变为可选。

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? DeepPartial<T[P]>
    : T[P]
}
```

**示例：**

```typescript
import type { DeepPartial } from '@toolkit-house/types'

interface User {
  name: string
  address: {
    street: string
    city: string
  }
}

const partialUser: DeepPartial<User> = {
  address: {
    city: '北京'
  }
}
```

---

### DeepRequired

递归地使所有属性变为必需。

```typescript
type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object
    ? DeepRequired<T[P]>
    : T[P]
}
```

---

### ReadonlyDeep

递归地使所有属性变为只读。

```typescript
type ReadonlyDeep<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? ReadonlyDeep<T[P]>
    : T[P]
}
```

---

## HTTP 类型

### HttpRequestOptions

HTTP 请求的选项。

```typescript
interface HttpRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: unknown
  timeout?: number
  signal?: AbortSignal
}
```

---

### HttpResponse

HTTP 响应结构。

```typescript
interface HttpResponse<T = unknown> {
  status: number
  statusText: string
  headers: Record<string, string>
  data: T
}
```

---

### ApiError

API 错误结构。

```typescript
interface ApiError {
  message: string
  code?: string
  statusCode?: number
  details?: unknown
}
```

---

## 配置类型

### Config

基础配置接口。

```typescript
interface Config {
  env: 'development' | 'production' | 'test'
  debug?: boolean
  [key: string]: unknown
}
```

---

### DatabaseConfig

数据库配置。

```typescript
interface DatabaseConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
  ssl?: boolean
}
```

---

### ServerConfig

服务器配置。

```typescript
interface ServerConfig {
  port: number
  host: string
  cors?: {
    origin: string | string[]
    credentials?: boolean
  }
}
```

---

## 事件类型

### EventHandler

事件处理函数类型。

```typescript
type EventHandler<T = unknown> = (data: T) => void
```

---

### EventMap

事件名称到其数据类型的映射。

```typescript
type EventMap = Record<string, unknown>
```

---

### TypedEventBus

类型化事件总线接口。

```typescript
interface TypedEventBus<T extends EventMap> {
  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void
  off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void
  emit<K extends keyof T>(event: K, data: T[K]): void
}
```

---

## 验证类型

### ValidationRule

单个验证规则。

```typescript
interface ValidationRule<T = unknown> {
  validate: (value: T) => boolean
  message?: string
}
```

---

### ValidationSchema

验证规则集合。

```typescript
type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule<T[K]> | ValidationRule<T[K]>[]
}
```

---

### ValidationResult

验证的结果。

```typescript
interface ValidationResult {
  valid: boolean
  errors?: Record<string, string[]>
}
```

---

## 通用对象类型

### Dict

具有字符串键的字典类型。

```typescript
type Dict<T = unknown> = Record<string, T>
```

---

### KeyValue

键值对。

```typescript
type KeyValue<K = string, V = unknown> = {
  key: K
  value: V
}
```

---

### TypedRecord

具有已知键的记录。

```typescript
type TypedRecord<K extends string, T> = Record<K, T>
```

---

## 函数类型

### AsyncFn

异步函数类型。

```typescript
type AsyncFn<T = unknown> = (...args: unknown[]) => Promise<T>
```

---

### Fn

简单函数类型。

```typescript
type Fn<T = unknown> = (...args: unknown[]) => T
```

---

### Predicate

谓词函数类型。

```typescript
type Predicate<T = unknown> = (value: T) => boolean
```

---

### Mapper

映射器函数类型。

```typescript
type Mapper<T = unknown, R = unknown> = (value: T) => R
```

---

## 模块导出

```typescript
// 核心类型
import type {
  Result,
  Nullable,
  Optional,
  Maybe
} from '@toolkit-house/types'

// 工具类型
import type {
  DeepPartial,
  DeepRequired,
  ReadonlyDeep
} from '@toolkit-house/types'

// HTTP 类型
import type {
  HttpRequestOptions,
  HttpResponse,
  ApiError
} from '@toolkit-house/types'

// 配置类型
import type {
  Config,
  DatabaseConfig,
  ServerConfig
} from '@toolkit-house/types'

// 事件类型
import type {
  EventHandler,
  EventMap,
  TypedEventBus
} from '@toolkit-house/types'

// 验证类型
import type {
  ValidationRule,
  ValidationSchema,
  ValidationResult
} from '@toolkit-house/types'

// 通用类型
import type {
  Dict,
  KeyValue,
  TypedRecord
} from '@toolkit-house/types'

// 函数类型
import type {
  AsyncFn,
  Fn,
  Predicate,
  Mapper
} from '@toolkit-house/types'
```

---

## 使用示例

### Result 类型

```typescript
import type { Result } from '@toolkit-house/types'

async function getUser(id: string): Promise<Result<User>> {
  try {
    const user = await db.findUser(id)
    return { success: true, data: user }
  } catch (error) {
    return { success: false, error: error as Error }
  }
}

const result = await getUser('123')
if (result.success) {
  console.log('用户：', result.data)
} else {
  console.error('错误：', result.error)
}
```

### DeepPartial

```typescript
import type { DeepPartial } from '@toolkit-house/types'

interface Config {
  database: {
    host: string
    port: number
  }
  server: {
    port: number
  }
}

function updateConfig(config: Config, updates: DeepPartial<Config>): Config {
  return { ...config, ...updates }
}

const newConfig = updateConfig(currentConfig, {
  database: { port: 5432 }
})
```

### 事件处理

```typescript
import type { EventHandler, EventMap, TypedEventBus } from '@toolkit-house/types'

interface AppEvents extends EventMap {
  'user:login': { userId: string }
  'user:logout': { userId: string }
}

function createEventBus<T extends EventMap>(): TypedEventBus<T> {
  // 实现...
}

const bus = createEventBus<AppEvents>()
bus.on('user:login', (data) => {
  console.log('用户登录：', data.userId)
})
```

---

## 相关文档

- [包指南](/packages/types) - 使用指南
- [GitHub 仓库](https://github.com/your-org/toolkit-house) - 源代码
<!-- </div> -->
