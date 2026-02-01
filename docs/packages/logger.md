---
title: "@toolkit-house/logger"
description: A lightweight, performant logging library with structured logging support
chineseTitle: "@toolkit-house/logger"
chineseDescription: 轻量级高性能日志库，支持结构化日志记录
---

# @toolkit-house/logger

A lightweight, performant logging library with structured logging support.

## Introduction

`@toolkit-house/logger` is a flexible and efficient logging solution designed for modern applications. It provides structured logging capabilities with multiple transport options, customizable formatters, and filtering mechanisms. The library is built for performance while maintaining rich functionality for complex logging scenarios.

### What It Does
- Logs with structured data and metadata
- Transports logs to multiple destinations (console, file, remote)
- Formats logs with customizable formatters
- Filters logs by level, category, and custom criteria
- Provides performance monitoring capabilities
- Supports log aggregation and correlation

### When to Use It
- Applications requiring structured logging
- Microservices with distributed logging
- Applications needing log aggregation
- Performance-critical applications
- Applications requiring custom log formats
- Systems with log filtering requirements

## Installation

```bash
pnpm add @toolkit-house/logger
```

## Quick Start

```typescript
import { Logger, ConsoleTransport, LogLevel } from '@toolkit-house/logger'

// Create a simple logger
const logger = new Logger({
  name: 'my-app',
  level: LogLevel.INFO
})

// Basic logging
logger.info('Application started')
logger.warn('This is a warning')
logger.error('Something went wrong')

// Structured logging
logger.info('User login', {
  userId: '123',
  email: 'user@example.com',
  userAgent: 'Mozilla/5.0'
})
```

## Key Features

### 1. Multiple Transport Options

```typescript
import {
  Logger,
  ConsoleTransport,
  FileTransport,
  HttpTransport
} from '@toolkit-house/logger'

// Console transport (default)
const consoleTransport = new ConsoleTransport({
  colorize: true,
  format: 'json'
})

// File transport
const fileTransport = new FileTransport({
  filename: 'app.log',
  maxSize: '10MB',
  maxFiles: 5
})

// HTTP transport for remote logging
const httpTransport = new HttpTransport({
  url: 'https://log.example.com/api/logs',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer token'
  }
})

// Create logger with multiple transports
const logger = new Logger({
  name: 'my-app',
  transports: [consoleTransport, fileTransport, httpTransport]
})
```

### 2. Log Levels and Filtering

```typescript
import { LogLevel } from '@toolkit-house/logger'

// Define log levels
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

// Logger with specific level
const logger = new Logger({
  name: 'my-app',
  level: LogLevel.INFO, // Only show INFO and above
})

// Category-based logging
const authLogger = logger.createChild('auth')
const databaseLogger = logger.createChild('database')

// Category-specific levels
authLogger.setLevel(LogLevel.DEBUG)
databaseLogger.setLevel(LogLevel.INFO)
```

### 3. Structured Logging with Metadata

```typescript
import { Logger } from '@toolkit-house/logger'

const logger = new Logger({
  name: 'api-server',
  metadata: {
    service: 'user-service',
    environment: 'production',
    version: '1.0.0'
  }
})

// Log with structured data
logger.info('Request processed', {
  requestId: 'req-123',
  method: 'POST',
  path: '/api/users',
  statusCode: 200,
  responseTime: 150,
  userId: 'user-456'
})

// Error with stack trace
logger.error('Database connection failed', {
  error: 'ConnectionTimeout',
  message: 'Could not connect to database',
  stack: new Error().stack,
  retryCount: 3
})
```

### 4. Custom Formatters

```typescript
import { Logger, Formatter } from '@toolkit-house/logger'

// JSON formatter
const jsonFormatter = new Formatter({
  format: (log) => {
    return JSON.stringify({
      timestamp: log.timestamp,
      level: log.level,
      name: log.name,
      message: log.message,
      metadata: log.metadata
    })
  }
})

// Pretty formatter for development
const prettyFormatter = new Formatter({
  format: (log) => {
    const level = log.level.padEnd(5)
    const name = `[${log.name}]`
    const message = log.message
    const metadata = Object.entries(log.metadata || {}).length > 0
      ? JSON.stringify(log.metadata, null, 2)
      : ''

    return `[${log.timestamp}] ${level} ${name}: ${message}\n${metadata}`
  }
})

// Custom metadata formatter
const metadataFormatter = new Formatter({
  format: (log) => {
    const { requestId, userId, ...rest } = log.metadata || {}
    const prefix = requestId ? `[${requestId}]` : userId ? `[${userId}]` : ''
    return `${prefix} ${log.message} ${JSON.stringify(rest)}`
  }
})
```

### 5. Log Filtering

```typescript
import { Logger, Filter } from '@toolkit-house/logger'

// Level filter
const levelFilter = new Filter({
  filter: (log) => log.level >= LogLevel.INFO
})

// Category filter
const categoryFilter = new Filter({
  filter: (log) => log.name.startsWith('database')
})

// Custom metadata filter
const sensitiveDataFilter = new Filter({
  filter: (log) => {
    // Don't log passwords
    if (log.metadata?.password) {
      return false
    }
    return true
  }
})

// Create logger with filters
const logger = new Logger({
  name: 'my-app',
  filters: [levelFilter, sensitiveDataFilter]
})
```

### 6. Performance Monitoring

```typescript
import { Logger } from '@toolkit-house/logger'

const logger = new Logger({
  name: 'performance',
  metadata: {
    service: 'api-gateway',
    region: 'us-east-1'
  }
})

// Log performance metrics
function logApiRequest(method: string, path: string, duration: number) {
  logger.info('API request', {
    method,
    path,
    duration,
    status: duration > 1000 ? 'slow' : 'normal'
  })
}

// Log database queries
function logQuery(query: string, duration: number) {
  logger.debug('Database query', {
    query,
    duration,
    type: duration > 500 ? 'slow' : 'normal'
  })
}

// Log memory usage
function logMemoryUsage() {
  const memoryUsage = process.memoryUsage()
  logger.info('Memory usage', {
    rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
    heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
    heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
    external: Math.round(memoryUsage.external / 1024 / 1024) + 'MB'
  })
}
```

## Common Use Cases

### 1. Application Logging

```typescript
import { Logger, ConsoleTransport, LogLevel } from '@toolkit-house/logger'

// Create application logger
const appLogger = new Logger({
  name: 'my-app',
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  transports: [
    new ConsoleTransport({
      colorize: process.env.NODE_ENV !== 'production'
    })
  ]
})

// Log application lifecycle
appLogger.info('Application starting', {
  nodeVersion: process.version,
  platform: process.platform,
  environment: process.env.NODE_ENV
})

appLogger.info('Application started', {
  port: process.env.PORT || 3000,
  mode: 'production'
})

// Log HTTP requests
function logRequest(req: Request, res: Response, next: Function) {
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start
    appLogger.info('HTTP request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      userAgent: req.get('user-agent'),
      ip: req.ip
    })
  })

  next()
}
```

### 2. Error Tracking and Logging

```typescript
import { Logger, FileTransport } from '@toolkit-house/logger'

// Create error logger
const errorLogger = new Logger({
  name: 'errors',
  transports: [
    new FileTransport({
      filename: 'errors.log',
      maxSize: '5MB',
      maxFiles: 10
    })
  ]
})

// Global error handler
function handleGlobalError(error: Error, req: Request) {
  errorLogger.error('Unhandled error', {
    error: error.name,
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userAgent: req.get('user-agent'),
    timestamp: new Date().toISOString()
  })
}

// Service error handling
class UserService {
  private logger = errorLogger.createChild('user-service')

  async createUser(userData: { email: string; name: string }) {
    try {
      const user = await this.createUserInDatabase(userData)
      this.logger.info('User created', {
        userId: user.id,
        email: user.email
      })
      return user
    } catch (error) {
      this.logger.error('Failed to create user', {
        email: userData.email,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
      throw error
    }
  }
}
```

### 3. Distributed System Logging

```typescript
import { Logger, HttpTransport } from '@toolkit-house/logger'

// Create distributed logger with correlation
const distributedLogger = new Logger({
  name: 'distributed-system',
  metadata: {
    service: 'order-service',
    instanceId: process.env.INSTANCE_ID || 'unknown',
    traceId: generateTraceId()
  },
  transports: [
    new HttpTransport({
      url: 'https://central-logging.example.com/api/logs',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer token',
        'Content-Type': 'application/json'
      }
    })
  ]
})

// Service-to-service communication
class OrderService {
  private logger = distributedLogger.createChild('order-service')

  async createOrder(orderData: any) {
    this.logger.info('Creating order', {
      orderId: orderData.id,
      customerId: orderData.customerId,
      items: orderData.items.length
    })

    try {
      // Call payment service
      const paymentResult = await this.callPaymentService(orderData)

      this.logger.info('Payment processed', {
        orderId: orderData.id,
        paymentId: paymentResult.id,
        amount: paymentResult.amount
      })

      // Call inventory service
      const inventoryResult = await this.updateInventory(orderData)

      this.logger.info('Inventory updated', {
        orderId: orderData.id,
        itemsUpdated: inventoryResult.items.length
      })

      return this.completeOrder(orderData)
    } catch (error) {
      this.logger.error('Order creation failed', {
        orderId: orderData.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  }

  private async callPaymentService(orderData: any) {
    const childLogger = this.logger.createChild('payment-service')
    childLogger.info('Processing payment', {
      orderId: orderData.id,
      amount: orderData.total
    })

    // Implementation...
  }
}
```

### 4. Performance Monitoring

```typescript
import { Logger } from '@toolkit-house/logger'

const perfLogger = new Logger({
  name: 'performance',
  level: 'INFO'
})

// Performance monitoring middleware
function performanceMonitoring(req: Request, res: Response, next: Function) {
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start
    const responseSize = parseInt(res.get('content-length') || '0')

    perfLogger.info('Request performance', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      responseSize,
      performance: duration > 1000 ? 'slow' : 'fast'
    })
  })

  next()
}

// Database query monitoring
function logQueryPerformance(query: string, params: any, duration: number) {
  perfLogger.debug('Database query', {
    query,
    params,
    duration,
    performance: duration > 500 ? 'slow' : 'normal'
  })
}

// Cache monitoring
function cacheOperation(operation: 'hit' | 'miss', key: string, duration?: number) {
  perfLogger.debug('Cache operation', {
    operation,
    key,
    duration
  })
}
```

## API Reference

### Classes

- `Logger` - Main logging class
- `ConsoleTransport` - Console transport implementation
- `FileTransport` - File transport implementation
- `HttpTransport` - HTTP transport implementation
- `Formatter` - Log formatter base class
- `Filter` - Log filter base class

### Core Modules

- `@toolkit-house/logger/core` - Core logging functionality
- `@toolkit-house/logger/transports` - Transport implementations
- `@toolkit-house/logger/formatters` - Log formatters
- `@toolkit-house/logger/filters` - Log filters

### Log Levels

- `LogLevel.DEBUG` - Debug information
- `LogLevel.INFO` - General information
- `LogLevel.WARN` - Warning messages
- `LogLevel.ERROR` - Error messages
- `LogLevel.FATAL` - Fatal errors

## Development

```bash
# Navigate to package directory
cd packages/logger

# Build the package
pnpm run build

# Run tests
pnpm run test

# Run type checking
pnpm run typecheck

# Note: Linting is skipped for logger package
```

## License

MIT