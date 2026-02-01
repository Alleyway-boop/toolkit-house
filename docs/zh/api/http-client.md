---
---

<!-- <div v-pre> -->
# @toolkit-house/http-client API 参考

Toolkit House 现代化 HTTP 客户端，支持并发控制和拦截器。

## 安装

```bash
pnpm add @toolkit-house/http-client
```

## 核心 API

### HttpClient

支持拦截器、重试和超时的现代化 HTTP 客户端。

#### 构造函数

```typescript
new HttpClient(config?: HttpClientConfig)
```

**配置选项：**

```typescript
interface HttpClientConfig {
  baseURL?: string              // 基础 URL
  timeout?: number              // 超时时间（毫秒）
  headers?: Record<string, string>  // 默认请求头
  interceptors?: {
    request?: RequestInterceptor[]
    response?: ResponseInterceptor[]
  }
  retry?: {
    times?: number              // 重试次数（默认：3）
    delay?: number              // 重试延迟（毫秒）
    retryable?: (error: Error) => boolean  // 是否可重试
  }
}
```

---

#### `get<T>(url: string, config?: RequestConfig): Promise<T>`

发送 GET 请求。

**参数：**
- `url` - 请求 URL
- `config` - 可选的请求配置

**返回值：** Promise<T>

**示例：**

```typescript
import { HttpClient } from '@toolkit-house/http-client'

const client = new HttpClient({ baseURL: 'https://api.example.com' })

const users = await client.get<User[]>('/users')
const user = await client.get<User>('/users/1', {
  headers: { 'X-Custom': 'value' }
})
```

---

#### `post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>`

发送 POST 请求。

**参数：**
- `url` - 请求 URL
- `data` - 请求体数据
- `config` - 可选的请求配置

**返回值：** Promise<T>

**示例：**

```typescript
const newUser = await client.post<User>('/users', {
  name: 'Alice',
  email: 'alice@example.com'
})
```

---

#### `put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>`

发送 PUT 请求。

**参数：**
- `url` - 请求 URL
- `data` - 请求体数据
- `config` - 可选的请求配置

**返回值：** Promise<T>

---

#### `patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>`

发送 PATCH 请求。

**参数：**
- `url` - 请求 URL
- `data` - 请求体数据
- `config` - 可选的请求配置

**返回值：** Promise<T>

---

#### `delete<T>(url: string, config?: RequestConfig): Promise<T>`

发送 DELETE 请求。

**参数：**
- `url` - 请求 URL
- `config` - 可选的请求配置

**返回值：** Promise<T>

**示例：**

```typescript
await client.delete('/users/1')
```

---

#### `setRequestInterceptor(interceptor: RequestInterceptor): void`

添加请求拦截器。

**参数：**
- `interceptor` - 请求拦截器函数

**示例：**

```typescript
client.setRequestInterceptor((config) => {
  // 添加认证头
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    }
  }
  return config
})
```

---

#### `setResponseInterceptor(interceptor: ResponseInterceptor): void`

添加响应拦截器。

**参数：**
- `interceptor` - 响应拦截器函数

**示例：**

```typescript
client.setResponseInterceptor((response) => {
  // 统一错误处理
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response
})
```

---

### RequestPool

并发请求池，用于控制同时进行的请求数量。

#### 构造函数

```typescript
new RequestPool(maxConcurrent: number)
```

**参数：**
- `maxConcurrent` - 最大并发请求数

**示例：**

```typescript
import { RequestPool } from '@toolkit-house/http-client'

const pool = new RequestPool(3) // 最多 3 个并发请求
```

---

#### `add<T>(fn: () => Promise<T>): Promise<T>`

添加请求到池中。

**参数：**
- `fn` - 返回 Promise 的请求函数

**返回值：** Promise<T>

**示例：**

```typescript
const urls = ['/api/1', '/api/2', '/api/3', '/api/4', '/api/5']

const results = await Promise.all(
  urls.map(url => pool.add(() => fetch(url)))
)
// 最多同时执行 3 个请求
```

---

#### `clear(): void`

清空请求队列。

**示例：**

```typescript
pool.clear()
```

---

## 类型定义

### HttpClientConfig

```typescript
interface HttpClientConfig {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
  interceptors?: {
    request?: RequestInterceptor[]
    response?: ResponseInterceptor[]
  }
  retry?: {
    times?: number
    delay?: number
    retryable?: (error: Error) => boolean
  }
}
```

### RequestConfig

```typescript
interface RequestConfig {
  headers?: Record<string, string>
  params?: Record<string, string>
  timeout?: number
  signal?: AbortSignal
}
```

### RequestInterceptor

```typescript
type RequestInterceptor = (config: RequestConfig) => RequestConfig
```

### ResponseInterceptor

```typescript
type ResponseInterceptor = <T>(response: T) => T
```

---

## 使用示例

### 基本使用

```typescript
import { HttpClient } from '@toolkit-house/http-client'

const client = new HttpClient({
  baseURL: 'https://api.example.com',
  timeout: 5000,
})

// GET 请求
const users = await client.get('/users')

// POST 请求
const newUser = await client.post('/users', {
  name: 'Alice',
  email: 'alice@example.com'
})

// PUT 请求
await client.put('/users/1', { name: 'Alice Updated' })

// DELETE 请求
await client.delete('/users/1')
```

### 认证拦截器

```typescript
const client = new HttpClient({ baseURL: 'https://api.example.com' })

// 添加认证头
client.setRequestInterceptor((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    }
  }
  return config
})

// 401 时自动刷新令牌
client.setResponseInterceptor(async (response) => {
  if (response.status === 401) {
    const newToken = await refreshToken()
    localStorage.setItem('token', newToken)
    // 重试原请求
    return client.fetch(response.config)
  }
  return response
})
```

### 错误处理和重试

```typescript
const client = new HttpClient({
  baseURL: 'https://api.example.com',
  retry: {
    times: 3,
    delay: 1000,
    retryable: (error) => {
      // 只重试网络错误和 5xx 错误
      return error.isNetworkError || error.statusCode >= 500
    }
  }
})

try {
  const data = await client.get('/data')
} catch (error) {
  console.error('请求失败：', error)
}
```

### 并发控制

```typescript
import { RequestPool } from '@toolkit-house/http-client'

const pool = new RequestPool(3) // 最多 3 个并发

const urls = Array.from({ length: 10 }, (_, i) => `/api/items/${i}`)

const results = await Promise.all(
  urls.map(url =>
    pool.add(() => fetch(url).then(r => r.json()))
  )
)
```

---

## 模块导出

```typescript
// HTTP 客户端
import {
  HttpClient,
  defaultHttpClient
} from '@toolkit-house/http-client'

// 请求池
import {
  RequestPool
} from '@toolkit-house/http-client'

// 类型
import type {
  HttpClientConfig,
  RequestConfig,
  RequestInterceptor,
  ResponseInterceptor
} from '@toolkit-house/http-client'
```

---

## 相关文档

- [包指南](/packages/http-client) - 使用指南和示例
- [GitHub 仓库](https://github.com/your-org/toolkit-house) - 源代码
<!-- </div> -->
