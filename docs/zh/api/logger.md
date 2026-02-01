---
---

<!-- <div v-pre> -->
# @toolkit-house/logger API 参考

Toolkit House 轻量级、高性能的日志库，支持结构化日志。

## 安装

```bash
pnpm add @toolkit-house/logger
```

## 核心 API

### Logger

主日志类，支持多种日志级别和结构化日志。

#### 构造函数

```typescript
new Logger(config?: LoggerConfig)
```

**配置选项：**

```typescript
interface LoggerConfig {
  name?: string                 // 日志器名称
  level?: LogLevel              // 日志级别
  format?: 'json' | 'text'      // 日志格式
  transports?: Transport[]       // 日志传输
  filters?: LogFilter[]         // 日志过滤器
}
```

---

#### `debug(message: string, meta?: Record<string, unknown>): void`

记录调试级别日志。

**参数：**
- `message` - 日志消息
- `meta` - 可选的元数据

**示例：**

```typescript
import { Logger } from '@toolkit-house/logger'

const logger = new Logger({ name: 'my-app' })

logger.debug('调试信息', { userId: 123 })
// 输出: {"level":"debug","message":"调试信息","userId":123,"timestamp":"2024-01-15T10:30:00.000Z"}
```

---

#### `info(message: string, meta?: Record<string, unknown>): void`

记录信息级别日志。

**示例：**

```typescript
logger.info('用户登录', { userId: 123, ip: '192.168.1.1' })
```

---

#### `warn(message: string, meta?: Record<string, unknown>): void`

记录警告级别日志。

**示例：**

```typescript
logger.warn('API 响应缓慢', { endpoint: '/users', duration: 5000 })
```

---

#### `error(message: string, error?: Error, meta?: Record<string, unknown>): void`

记录错误级别日志。

**参数：**
- `message` - 错误消息
- `error` - 可选的错误对象
- `meta` - 可选的元数据

**示例：**

```typescript
try {
  await someOperation()
} catch (err) {
  logger.error('操作失败', err as Error, { operation: 'save-data' })
}
```

---

#### `createChild(options: ChildLoggerOptions): Logger`

创建子日志器，继承父日志器的配置。

**参数：**
- `options` - 子日志器选项

**返回值：** 新的 Logger 实例

**示例：**

```typescript
const parentLogger = new Logger({ name: 'app' })
const childLogger = parentLogger.createChild({
  name: 'app:database',
  meta: { component: 'database' }
})

childLogger.info('连接数据库')
// 输出: {"level":"info","message":"连接数据库","component":"database"...}
```

---

### 日志级别

```typescript
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4,
}
```

---

## 传输

### ConsoleTransport

将日志输出到控制台。

```typescript
import { ConsoleTransport } from '@toolkit-house/logger'

const consoleTransport = new ConsoleTransport({
  format: 'json',  // 或 'text'
  colorize: true,
})

const logger = new Logger({
  transports: [consoleTransport]
})
```

---

### FileTransport

将日志写入文件。

```typescript
import { FileTransport } from '@toolkit-house/logger'

const fileTransport = new FileTransport({
  filename: 'app.log',
  maxSize: '10M',
  maxFiles: 5,
})

const logger = new Logger({
  transports: [fileTransport]
})
```

---

### RemoteTransport

将日志发送到远程服务器。

```typescript
import { RemoteTransport } from '@toolkit-house/logger'

const remoteTransport = new RemoteTransport({
  url: 'https://logs.example.com/api/logs',
  headers: {
    'X-API-Key': 'your-api-key'
  },
  batchSize: 10,
  flushInterval: 5000,
})
```

---

## 过滤器

### LevelFilter

根据日志级别过滤。

```typescript
import { LevelFilter } from '@toolkit-house/logger'

const levelFilter = new LevelFilter(LogLevel.INFO)

const logger = new Logger({
  filters: [levelFilter]
  // 只记录 INFO 及以上级别的日志
})
```

---

### MetadataFilter

根据元数据过滤。

```typescript
import { MetadataFilter } from '@toolkit-house/logger'

const filter = new MetadataFilter({
  // 只包含包含这些字段的日志
  include: ['userId', 'requestId'],
  // 排除包含敏感信息的日志
  exclude: ['password', 'token'],
})
```

---

## 格式化器

### JsonFormatter

JSON 格式化器（默认）。

```typescript
import { JsonFormatter } from '@toolkit-house/logger'

const formatter = new JsonFormatter({
  pretty: false,
  timestamp: true,
})
```

---

### TextFormatter

纯文本格式化器。

```typescript
import { TextFormatter } from '@toolkit-house/logger'

const formatter = new TextFormatter({
  template: '{timestamp} [{level}] {message} {meta}',
  timestamp: 'YYYY-MM-DD HH:mm:ss',
})
```

---

## 单例实例

### `defaultLogger`

预配置的默认日志器实例。

```typescript
import { defaultLogger } from '@toolkit-house/logger'

defaultLogger.info('使用默认日志器')
```

---

## 辅助函数

### `createLogger(config?: LoggerConfig): Logger`

创建日志器的工厂函数。

```typescript
import { createLogger } from '@toolkit-house/logger'

const logger = createLogger({
  name: 'my-app',
  level: LogLevel.INFO,
})
```

---

## 使用示例

### 基本使用

```typescript
import { Logger, LogLevel } from '@toolkit-house/logger'

const logger = new Logger({
  name: 'my-app',
  level: LogLevel.DEBUG,
})

logger.debug('调试信息')
logger.info('应用启动')
logger.warn('内存使用率高')
logger.error('数据库连接失败', new Error('Connection timeout'))
```

### 结构化日志

```typescript
logger.info('用户操作', {
  userId: 123,
  action: 'login',
  ip: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
})

// 输出: {"level":"info","message":"用户操作","userId":123,"action":"login",...}
```

### 子日志器

```typescript
const appLogger = new Logger({ name: 'app' })
const dbLogger = appLogger.createChild({
  name: 'app:database',
  meta: { module: 'database' }
})

const apiLogger = appLogger.createChild({
  name: 'app:api',
  meta: { module: 'api' }
})

dbLogger.info('查询用户', { query: 'SELECT * FROM users' })
apiLogger.info('处理请求', { endpoint: '/users' })
```

### 多传输

```typescript
import { ConsoleTransport, FileTransport } from '@toolkit-house/logger'

const logger = new Logger({
  name: 'app',
  transports: [
    new ConsoleTransport({ format: 'text' }),
    new FileTransport({ filename: 'app.log' }),
    new RemoteTransport({ url: 'https://logs.example.com' }),
  ]
})
```

### 错误追踪

```typescript
try {
  await riskyOperation()
} catch (error) {
  logger.error('操作失败', error as Error, {
    operation: 'riskyOperation',
    context: { userId: 123 }
  })
}
```

---

## 类型定义

### LoggerConfig

```typescript
interface LoggerConfig {
  name?: string
  level?: LogLevel
  format?: 'json' | 'text'
  transports?: Transport[]
  filters?: LogFilter[]
}
```

### LogEntry

```typescript
interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  name?: string
  meta?: Record<string, unknown>
  error?: {
    message: string
    stack?: string
    code?: string
  }
}
```

---

## 模块导出

```typescript
// 日志器
import {
  Logger,
  createLogger,
  defaultLogger
} from '@toolkit-house/logger'

// 日志级别
import { LogLevel } from '@toolkit-house/logger'

// 传输
import {
  ConsoleTransport,
  FileTransport,
  RemoteTransport
} from '@toolkit-house/logger'

// 过滤器
import {
  LevelFilter,
  MetadataFilter
} from '@toolkit-house/logger'

// 格式化器
import {
  JsonFormatter,
  TextFormatter
} from '@toolkit-house/logger'

// 类型
import type {
  LoggerConfig,
  LogEntry,
  Transport,
  LogFilter
} from '@toolkit-house/logger'
```

---

## 相关文档

- [包指南](/packages/logger) - 使用指南和示例
- [GitHub 仓库](https://github.com/your-org/toolkit-house) - 源代码
<!-- </div> -->
