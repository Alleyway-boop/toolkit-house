---
---

<!-- <div v-pre> -->
# @toolkit-house/constants API 参考

Toolkit House monorepo 的共享常量。

## 安装

```bash
pnpm add @toolkit-house/constants
```

## 概述

此包提供 Toolkit House monorepo 中使用的通用常量，确保一致性并便于全局更新。

---

## HTTP 常量

### HTTP 状态码

```typescript
enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}
```

**示例：**

```typescript
import { HttpStatus } from '@toolkit-house/constants'

return { status: HttpStatus.OK, data: result }
```

---

### HTTP 方法

```typescript
enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}
```

---

### HTTP 头

```typescript
const HttpHeaders = {
  ACCEPT: 'Accept',
  AUTHORIZATION: 'Authorization',
  CONTENT_TYPE: 'Content-Type',
  USER_AGENT: 'User-Agent',
  CACHE_CONTROL: 'Cache-Control',
} as const
```

---

## 时间常量

### 时间间隔（毫秒）

```typescript
const Time = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
} as const
```

**示例：**

```typescript
import { Time } from '@toolkit-house/constants'

// 设置超时为 5 秒
setTimeout(callback, 5 * Time.SECOND)

// 缓存 1 小时
cache.set(key, value, Time.HOUR)
```

---

### 日期格式

```typescript
const DateFormat = {
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  MONTH_YEAR: 'YYYY-MM',
  DISPLAY_DATE: 'MMM DD, YYYY',
  DISPLAY_DATETIME: 'MMM DD, YYYY HH:mm',
} as const
```

---

## 环境常量

### 环境名称

```typescript
enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}
```

---

### Node 环境

```typescript
const NodeEnv = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const
```

---

## 验证常量

### 正则表达式

```typescript
const Regex = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  PHONE: /^\+?[\d\s-()]+$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  IPV4: /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const
```

**示例：**

```typescript
import { Regex } from '@toolkit-house/constants'

function validateEmail(email: string): boolean {
  return Regex.EMAIL.test(email)
}
```

---

### 验证约束

```typescript
const Validation = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 32,
  MAX_UPLOAD_SIZE: 10 * 1024 * 1024, // 10MB
} as const
```

---

## 存储常量

### 存储键

```typescript
const StorageKey = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const
```

**示例：**

```typescript
import { StorageKey } from '@toolkit-house/constants'

localStorage.setItem(StorageKey.ACCESS_TOKEN, token)
```

---

### 缓存持续时间

```typescript
const CacheDuration = {
  SHORT: 5 * 60 * 1000,      // 5 分钟
  MEDIUM: 30 * 60 * 1000,    // 30 分钟
  LONG: 60 * 60 * 1000,      // 1 小时
  VERY_LONG: 24 * 60 * 60 * 1000, // 1 天
} as const
```

---

## 应用常量

### 应用限制

```typescript
const AppLimits = {
  MAX_RETRY_ATTEMPTS: 3,
  REQUEST_TIMEOUT: 30000,     // 30 秒
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MAX_CONCURRENT_REQUESTS: 5,
} as const
```

---

### 分页默认值

```typescript
const Pagination = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const
```

---

## 错误常量

### 错误消息

```typescript
const ErrorMessage = {
  NETWORK_ERROR: '网络错误',
  UNAUTHORIZED: '未授权访问',
  FORBIDDEN: '访问被禁止',
  NOT_FOUND: '资源未找到',
  VALIDATION_ERROR: '验证失败',
  SERVER_ERROR: '服务器内部错误',
} as const
```

---

### 错误代码

```typescript
enum ErrorCode {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  CONFLICT_ERROR = 'CONFLICT_ERROR',
}
```

---

## API 常量

### API 端点

```typescript
const ApiEndpoint = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
  },
  USER: {
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
  },
} as const
```

---

### API 版本

```typescript
const ApiVersion = {
  V1: 'v1',
  V2: 'v2',
} as const
```

---

## 模块导出

```typescript
// HTTP
import { HttpStatus, HttpMethod } from '@toolkit-house/constants'
import { HttpHeaders } from '@toolkit-house/constants'

// 时间
import { Time, DateFormat } from '@toolkit-house/constants'

// 环境
import { Environment, NodeEnv } from '@toolkit-house/constants'

// 验证
import { Regex, Validation } from '@toolkit-house/constants'

// 存储
import { StorageKey, CacheDuration } from '@toolkit-house/constants'

// 应用
import { AppLimits, Pagination } from '@toolkit-house/constants'

// 错误
import { ErrorMessage, ErrorCode } from '@toolkit-house/constants'

// API
import { ApiEndpoint, ApiVersion } from '@toolkit-house/constants'
```

---

## 使用示例

### HTTP 状态处理

```typescript
import { HttpStatus } from '@toolkit-house/constants'

function handleResponse(status: number) {
  switch (status) {
    case HttpStatus.OK:
      return '成功'
    case HttpStatus.NOT_FOUND:
      return '未找到'
    case HttpStatus.INTERNAL_SERVER_ERROR:
      return '服务器错误'
    default:
      return '未知状态'
  }
}
```

### 基于时间的操作

```typescript
import { Time } from '@toolkit-house/constants'

// 防抖函数
function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number = Time.SECOND
): T {
  let timeout: NodeJS.Timeout | undefined
  return ((...args: unknown[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }) as T
}

// 带有 TTL 的缓存
function setWithTTL(key: string, value: unknown, ttl: number = Time.HOUR) {
  cache.set(key, value, ttl)
}
```

### 验证

```typescript
import { Regex, Validation } from '@toolkit-house/constants'

function validateUser(user: { email: string; password: string }): boolean {
  if (!Regex.EMAIL.test(user.email)) {
    return false
  }

  if (user.password.length < Validation.MIN_PASSWORD_LENGTH) {
    return false
  }

  return true
}
```

### 存储

```typescript
import { StorageKey, CacheDuration } from '@toolkit-house/constants'

// 保存认证令牌
function saveToken(token: string) {
  localStorage.setItem(StorageKey.ACCESS_TOKEN, token)
}

// 带持续时间的缓存
function cacheData(key: string, data: unknown) {
  const item = {
    data,
    expires: Date.now() + CacheDuration.MEDIUM,
  }
  localStorage.setItem(key, JSON.stringify(item))
}
```

---

## TypeScript 支持

所有常量都为 TypeScript 提供了适当的类型：

```typescript
import { HttpMethod } from '@toolkit-house/constants'

const method: HttpMethod = HttpMethod.GET // 类型安全

// const 对象的字符串字面量类型
import { HttpHeaders } from '@toolkit-house/constants'
const header: keyof typeof HttpHeaders = 'CONTENT_TYPE'
```

---

## 相关文档

- [包指南](/packages/constants) - 使用指南
- [GitHub 仓库](https://github.com/your-org/toolkit-house) - 源代码
<!-- </div> -->
