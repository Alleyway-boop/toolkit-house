# @toolkit-house/logger

A lightweight, performant logging library for TypeScript and JavaScript with structured logging support.

## Features

- **Multiple Log Levels**: DEBUG, INFO, WARN, ERROR, FATAL
- **Structured Logging**: Support for metadata, context, and tags
- **Multiple Transports**: Console, file, memory, and extensible transports
- **Flexible Formatters**: JSON, colored console, and simple text formatters
- **Advanced Filtering**: Level, tag, message, time range, and custom filters
- **TypeScript Friendly**: Full TypeScript support with type definitions
- **Performance Optimized**: Lazy evaluation for expensive computations
- **Browser Compatible**: Works in both Node.js and browser environments
- **Tree Shakable**: Import only what you need
- **Zero Dependencies**: Minimal external dependencies

## Installation

```bash
npm install @toolkit-house/logger
# or
pnpm add @toolkit-house/logger
# or
yarn add @toolkit-house/logger
```

## Quick Start

### Basic Usage

```typescript
import { Logger, LogLevel, ConsoleTransport } from '@toolkit-house/logger';

// Create a logger with console transport
const logger = new Logger({
  level: LogLevel.INFO,
  transports: [
    new ConsoleTransport({
      useColors: true,
      includeMetadata: true,
    }),
  ],
});

// Log messages
await logger.info('Application started');
await logger.error('Something went wrong', { error: new Error('Test error') });
await logger.debug('Debug information', null, ['debug', 'verbose']);
```

### Advanced Usage

```typescript
import {
  Logger,
  LogLevel,
  ConsoleTransport,
  MemoryTransport,
  JsonFormatter,
  LevelFilter,
  IncludeTagFilter,
} from '@toolkit-house/logger';

// Create logger with multiple transports
const logger = new Logger({
  level: LogLevel.DEBUG,
  context: { service: 'auth-service', version: '1.0.0' },
  transports: [
    // Console transport with custom formatter
    new ConsoleTransport({
      level: LogLevel.INFO,
      formatter: new ConsoleFormatter({
        useColors: true,
        includeTimestamp: true,
      }),
    }),

    // Memory transport for testing/debugging
    new MemoryTransport({
      level: LogLevel.DEBUG,
      maxEntries: 1000,
      formatter: new JsonFormatter(),
    }),
  ],
});

// Add filters to transports
const consoleTransport = logger.getTransports()[0];
consoleTransport.filter = new LevelFilter(LogLevel.WARN);

// Set global context and metadata
logger.setContext({ requestId: 'abc123', userId: 'user456' });
logger.setTags(['auth', 'security']);

// Log with additional metadata
await logger.info('User logged in', {
  ip: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
});
```

## API Reference

### Logger Class

#### Constructor Options

```typescript
interface LoggerOptions {
  level?: LogLevel;              // Minimum log level (default: INFO)
  transports?: Transport[];      // Array of transports (default: [])
  context?: Record<string, any>; // Global context
  tags?: string[];              // Global tags
  metadata?: Record<string, any>; // Global metadata
}
```

#### Methods

```typescript
// Log methods
logger.debug(message: LogMessage, metadata?: LogMetadata, tags?: string[]): Promise<void>
logger.info(message: LogMessage, metadata?: LogMetadata, tags?: string[]): Promise<void>
logger.warn(message: LogMessage, metadata?: LogMetadata, tags?: string[]): Promise<void>
logger.error(message: LogMessage, metadata?: LogMetadata, tags?: string[]): Promise<void>
logger.fatal(message: LogMessage, metadata?: LogMetadata, tags?: string[]): Promise<void>

// Configuration
logger.setLevel(level: LogLevel): void
logger.addTransport(transport: Transport): void
logger.removeTransport(name: string): void

// Context and metadata
logger.setContext(context: Record<string, any>): void
logger.updateContext(context: Record<string, any>): void
logger.setTags(tags: string[]): void
logger.addTags(...tags: string[]): void
logger.clearTags(): void
logger.setMetadata(metadata: Record<string, any>): void
logger.updateMetadata(metadata: Record<string, any>): void

// Child loggers
logger.child(options?: LoggerOptions): Logger
```

### Transports

#### ConsoleTransport

```typescript
new ConsoleTransport({
  level?: LogLevel,
  formatter?: Formatter,
  useColors?: boolean,
  includeTimestamp?: boolean,
  includeMetadata?: boolean,
})
```

#### FileTransport (Node.js only)

```typescript
import { FileTransport } from '@toolkit-house/logger/transports';

new FileTransport({
  filePath: string,
  level?: LogLevel,
  formatter?: Formatter,
  maxFileSize?: number,    // Default: 10MB
  maxFiles?: number,       // Default: 5
  rotate?: boolean,        // Default: true
})
```

#### MemoryTransport

```typescript
import { MemoryTransport, MemoryTransportOptions } from '@toolkit-house/logger/transports';

new MemoryTransport({
  level?: LogLevel,
  formatter?: Formatter,
  maxEntries?: number,     // Default: 1000
  bufferSize?: number,     // Default: 100
})

// Methods
memoryTransport.getEntries(): LogEntry[]
memoryTransport.getFormattedEntries(): string[]
memoryTransport.getEntriesByLevel(level: LogLevel): LogEntry[]
memoryTransport.getEntriesByTag(tag: string): LogEntry[]
memoryTransport.getRecentEntries(count: number): LogEntry[]
memoryTransport.clear(): void
```

### Formatters

#### JsonFormatter

```typescript
new JsonFormatter({
  pretty?: boolean,  // Default: false
})
```

#### ConsoleFormatter

```typescript
new ConsoleFormatter({
  useColors?: boolean,        // Default: !browser
  includeTimestamp?: boolean, // Default: true
  includeMetadata?: boolean,  // Default: true
})
```

#### SimpleFormatter

```typescript
new SimpleFormatter({
  includeTimestamp?: boolean, // Default: true
  includeMetadata?: boolean,  // Default: true
})
```

### Filters

#### Level Filters

```typescript
import { LevelFilter, LevelRangeFilter, ExactLevelFilter } from '@toolkit-house/logger/filters';

// Minimum level filter
new LevelFilter(LogLevel.WARN)

// Level range filter
new LevelRangeFilter(LogLevel.INFO, LogLevel.ERROR)

// Exact level filter
new ExactLevelFilter([LogLevel.INFO, LogLevel.ERROR])
```

#### Tag Filters

```typescript
import { IncludeTagFilter, ExcludeTagFilter, AllTagsFilter } from '@toolkit-house/logger/filters';

// Include entries with these tags
new IncludeTagFilter(['auth', 'security'])

// Exclude entries with these tags
new ExcludeTagFilter(['debug', 'verbose'])

// Require all specified tags
new AllTagsFilter(['auth', 'security'])
```

#### Custom Filters

```typescript
import { CustomFilter, MessageFilter, TimeRangeFilter, CompositeFilter } from '@toolkit-house/logger/filters';

// Custom predicate filter
new CustomFilter((entry) => entry.message.includes('error'))

// Message pattern filter
new MessageFilter({
  includes: [/user \d+/, 'auth'],
  excludes: ['debug', 'trace'],
})

// Time range filter
new TimeRangeFilter({
  startTime: new Date('2023-01-01'),
  endTime: new Date('2023-12-31'),
})

// Composite filter
new CompositeFilter({
  filters: [new LevelFilter(LogLevel.WARN), new IncludeTagFilter(['auth'])],
  operator: 'AND', // or 'OR'
})
```

## Sub-path Imports

For better tree-shaking, you can import specific modules:

```typescript
// Core functionality
import { Logger, LogLevel } from '@toolkit-house/logger/core';

// Transports only
import { ConsoleTransport, FileTransport } from '@toolkit-house/logger/transports';

// Formatters only
import { JsonFormatter, ConsoleFormatter } from '@toolkit-house/logger/formatters';

// Filters only
import { LevelFilter, IncludeTagFilter } from '@toolkit-house/logger/filters';
```

## Lazy Evaluation

For better performance with expensive computations:

```typescript
// Lazy message evaluation
await logger.debug(() => `Expensive debug data: ${computeExpensiveData()}`);

// Lazy metadata evaluation
await logger.info('User action', () => ({
  sessionData: getExpensiveSessionData(),
  userProfile: getExpensiveUserProfile(),
}));
```

## Context and Child Loggers

```typescript
// Parent logger with global context
const mainLogger = new Logger({
  context: { service: 'api', version: '1.0.0' },
  tags: ['production'],
});

// Child logger inherits and extends context
const requestLogger = mainLogger.child({
  context: { requestId: 'req-123', userId: 'user-456' },
  tags: ['authentication'],
});

// Both loggers will have combined context
await requestLogger.info('User authenticated');
// Output includes: { service: 'api', version: '1.0.0', requestId: 'req-123', userId: 'user-456' }
// And tags: ['production', 'authentication']
```

## Browser Usage

The library works seamlessly in browsers:

```typescript
import { Logger, LogLevel, ConsoleTransport } from '@toolkit-house/logger';

const logger = new Logger({
  level: LogLevel.INFO,
  transports: [
    new ConsoleTransport({
      useColors: false, // Colors disabled in browser
      includeTimestamp: true,
    }),
  ],
});

// Browser console methods are used appropriately
await logger.info('Application started');  // console.info()
await logger.error('An error occurred');  // console.error()
```

## Performance Considerations

- **Lazy Evaluation**: Use lazy functions for expensive computations
- **Level Filtering**: Set appropriate minimum levels to avoid unnecessary processing
- **Transport Levels**: Configure different levels per transport
- **Memory Management**: Use `maxEntries` with MemoryTransport to prevent memory leaks
- **Bundle Size**: Use sub-path imports for better tree-shaking

## Examples

### Web Application Logger

```typescript
import { Logger, LogLevel, ConsoleTransport, JsonFormatter } from '@toolkit-house/logger';

export const appLogger = new Logger({
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  context: {
    app: 'web-dashboard',
    version: process.env.APP_VERSION || '1.0.0',
  },
  transports: [
    new ConsoleTransport({
      formatter: process.env.NODE_ENV === 'production'
        ? new JsonFormatter()
        : new ConsoleFormatter({ useColors: true }),
    }),
  ],
});

// Error logging
appLogger.error('API request failed', {
  url: '/api/users',
  method: 'GET',
  status: 500,
  error: error.stack,
});
```

### API Service Logger

```typescript
import {
  Logger,
  LogLevel,
  ConsoleTransport,
  FileTransport,
  JsonFormatter,
  LevelFilter,
  IncludeTagFilter,
} from '@toolkit-house/logger';
import { FileTransport } from '@toolkit-house/logger/transports';

export const serviceLogger = new Logger({
  level: LogLevel.DEBUG,
  context: {
    service: 'user-service',
    version: '2.1.0',
    environment: process.env.NODE_ENV,
  },
  transports: [
    // Debug logs to console
    new ConsoleTransport({
      level: LogLevel.DEBUG,
      formatter: new ConsoleFormatter({ useColors: true }),
    }),

    // Error logs to file
    new FileTransport({
      filePath: './logs/errors.log',
      level: LogLevel.ERROR,
      formatter: new JsonFormatter({ pretty: false }),
    }),

    // All logs to structured file
    new FileTransport({
      filePath: './logs/app.log',
      level: LogLevel.DEBUG,
      formatter: new JsonFormatter({ pretty: false }),
    }),
  ],
});

// Request logging
export const logRequest = (req, res, next) => {
  const childLogger = serviceLogger.child({
    context: {
      requestId: req.id,
      method: req.method,
      url: req.url,
    },
    tags: ['http', 'request'],
  });

  childLogger.info('Incoming request', {
    headers: req.headers,
    query: req.query,
    userAgent: req.get('User-Agent'),
  });

  req.logger = childLogger;
  next();
};
```

## License

MIT

## Contributing

Contributions are welcome! Please see the [contributing guidelines](../../CONTRIBUTING.md) for more information.