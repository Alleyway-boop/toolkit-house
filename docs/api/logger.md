# @toolkit-house/logger API Reference

Lightweight, performant logging library with structured logging.

## Installation

```bash
pnpm add @toolkit-house/logger
```

## Basic Usage

```typescript
import { Logger } from '@toolkit-house/logger'

const logger = new Logger({
  level: 'info',
  format: 'json',
})

logger.info('Server started', { port: 3000 })
logger.error('Database connection failed', { error: err.message })
logger.warn('High memory usage', { usage: '90%' })
logger.debug('Request received', { path: '/api/users' })
```

## Constructor Options

```typescript
interface LoggerOptions {
  level?: LogLevel
  format?: LogFormat
  outputs?: LogOutput[]
  context?: Record<string, any>
}

type LogLevel = 'debug' | 'info' | 'warn' | 'error'
type LogFormat = 'json' | 'text'
```

**Example:**
```typescript
const logger = new Logger({
  level: 'info',
  format: 'json',
  outputs: [
    new ConsoleTransport(),
    new FileTransport('./logs/app.log'),
  ],
  context: {
    app: 'my-app',
    version: '1.0.0',
  },
})
```

## Log Levels

- `debug` - Detailed debugging information
- `info` - General informational messages
- `warn` - Warning messages
- `error` - Error messages

## Methods

### info

```typescript
logger.info(message: string, meta?: Record<string, any>)
```

**Example:**
```typescript
logger.info('User logged in', { userId: '123', ip: '192.168.1.1' })
```

### error

```typescript
logger.error(message: string, meta?: Record<string, any>)
```

**Example:**
```typescript
logger.error('Database query failed', {
  query: 'SELECT * FROM users',
  error: err.message,
  stack: err.stack,
})
```

### warn

```typescript
logger.warn(message: string, meta?: Record<string, any>)
```

**Example:**
```typescript
logger.warn('Rate limit approaching', { requests: 95, limit: 100 })
```

### debug

```typescript
logger.debug(message: string, meta?: Record<string, any>)
```

**Example:**
```typescript
logger.debug('Processing request', { method: 'GET', url: '/api/users' })
```

## Child Loggers

Create child loggers with additional context:

```typescript
const logger = new Logger({ context: { app: 'my-app' } })
const userLogger = logger.child({ component: 'user-service' })

userLogger.info('User created', { userId: '123' })
// Logs: { app: 'my-app', component: 'user-service', userId: '123' }
```

## Transports

### Console Transport

```typescript
import { ConsoleTransport } from '@toolkit-house/logger'

const transport = new ConsoleTransport({
  format: 'json',
  colorize: true,
})

const logger = new Logger({
  outputs: [transport],
})
```

### File Transport

```typescript
import { FileTransport } from '@toolkit-house/logger'

const transport = new FileTransport('./logs/app.log', {
  format: 'json',
  rotate: true,
  maxSize: '10M',
  maxFiles: 5,
})

const logger = new Logger({
  outputs: [transport],
})
```

## Formatters

### JSON Formatter

```typescript
import { JsonFormatter } from '@toolkit-house/logger/formatters'

const formatter = new JsonFormatter({
  pretty: false,
})
```

### Text Formatter

```typescript
import { TextFormatter } from '@toolkit-house/logger/formatters'

const formatter = new TextFormatter({
  template: '[{timestamp}] {level} {message} {meta}',
  timestampFormat: 'YYYY-MM-DD HH:mm:ss',
})
```

## Filters

Filter log entries:

```typescript
import { LevelFilter, ContextFilter } from '@toolkit-house/logger/filters'

const logger = new Logger({
  outputs: [
    new ConsoleTransport({
      filters: [
        new LevelFilter('info'),
        new ContextFilter('env', 'production'),
      ],
    }),
  ],
})
```

## License

MIT
