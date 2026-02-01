# Package System

The Toolkit House monorepo contains multiple packages organized by purpose and dependency level.

## Core Packages

### @toolkit-house/ts-utils

Comprehensive TypeScript utility library.

**Features:**
- Network utilities (RequestPool for concurrency control)
- String utilities (similarity, matching, formatting)
- Array and object operations
- Date formatting and manipulation
- Validation helpers
- Data transformation utilities
- Sorting and searching algorithms
- Graph algorithms
- Dynamic programming patterns
- Data structures (Trie, Tree, Heap, Graph, Stack, Queue)
- Functional programming utilities
- Audio processing utilities
- Monitoring and tracing tools
- Cache implementations (LRU, FIFO)

**Usage:**
```typescript
import { RequestPool } from '@toolkit-house/ts-utils/net'
import { levenshtein } from '@toolkit-house/ts-utils/string'
import { LRUCache } from '@toolkit-house/ts-utils/cache'

// RequestPool example
const pool = new RequestPool(3) // Max 3 concurrent requests
const results = await Promise.all(
  urls.map(url => pool.add(() => fetch(url)))
)

// String similarity example
const distance = levenshtein('kitten', 'sitting') // 3

// LRU Cache example
const cache = new LRUCache<string, number>(100)
cache.set('key', 42)
console.log(cache.get('key')) // 42
```

**Exports:**
- `@toolkit-house/ts-utils` - Main utilities
- `@toolkit-house/ts-utils/net` - Network utilities
- `@toolkit-house/ts-utils/string` - String utilities
- `@toolkit-house/ts-utils/array` - Array operations
- `@toolkit-house/ts-utils/object` - Object operations
- `@toolkit-house/ts-utils/date` - Date utilities
- `@toolkit-house/ts-utils/validation` - Validation helpers
- `@toolkit-house/ts-utils/transform` - Data transformation
- `@toolkit-house/ts-utils/sorting` - Sorting algorithms
- `@toolkit-house/ts-utils/searching` - Search algorithms
- `@toolkit-house/ts-utils/graph` - Graph algorithms
- `@toolkit-house/ts-utils/dynamic-programming` - DP patterns
- `@toolkit-house/ts-utils/data-structures` - Data structures
- `@toolkit-house/ts-utils/functional` - Functional programming
- `@toolkit-house/ts-utils/audio` - Audio processing
- `@toolkit-house/ts-utils/monitoring` - Monitoring
- `@toolkit-house/ts-utils/tracing` - Tracing
- `@toolkit-house/ts-utils/cache` - Cache implementations

---

### @toolkit-house/validation

Type-safe validation library with fluent API.

**Features:**
- Schema-based validation
- Built-in validators (required, email, minLength, etc.)
- Custom validator support
- TypeScript type inference
- Fluent API design

**Usage:**
```typescript
import { schema, string, number } from '@toolkit-house/validation'

// Define a schema
const userSchema = schema({
  name: string().required().minLength(2),
  email: string().required().email(),
  age: number().optional().min(18),
})

// Validate data
const result = userSchema.validate({
  name: 'John',
  email: 'john@example.com',
})

if (result.valid) {
  console.log('Validation passed!')
} else {
  console.error('Errors:', result.errors)
}
```

**Dependencies:**
- `@toolkit-house/ts-utils` (workspace:*)
- `@toolkit-house/types` (workspace:*)
- `@toolkit-house/constants` (workspace:*, peer)

---

### @toolkit-house/http-client

Modern HTTP client with concurrency control.

**Features:**
- RequestPool for concurrency control
- Interceptor support (request/response)
- Retry logic with exponential backoff
- Timeout handling
- Optional logging integration

**Usage:**
```typescript
import { HttpClient } from '@toolkit-house/http-client'

const client = new HttpClient({
  baseURL: 'https://api.example.com',
  maxConcurrent: 5,
  timeout: 10000,
})

// Simple GET request
const data = await client.get('/users')

// POST request with interceptors
client.addRequestInterceptor((config) => {
  config.headers['Authorization'] = `Bearer ${token}`
  return config
})

const result = await client.post('/users', {
  name: 'John Doe',
  email: 'john@example.com',
})
```

**Dependencies:**
- `@toolkit-house/ts-utils` (workspace:*)
- `@toolkit-house/logger` (workspace:*, optional)
- `@toolkit-house/constants` (workspace:*, optional)

---

### @toolkit-house/logger

Lightweight, performant logging library.

**Features:**
- Structured logging
- Multiple log levels
- Pluggable transports
- Custom formatters
- Log filters

**Usage:**
```typescript
import { Logger } from '@toolkit-house/logger'

const logger = new Logger({
  level: 'info',
  format: 'json',
})

logger.info('Server started', { port: 3000 })
logger.error('Database connection failed', { error: err.message })
```

---

### @toolkit-house/security

Security utilities for key management and encryption.

**Features:**
- Key generation
- Encryption/decryption
- Hash functions
- Token management

---

### @toolkit-house/realtime

Real-time communication utilities.

**Features:**
- WebSocket client wrapper
- Reconnection logic
- Event-based API
- Type-safe messages

---

## UI Component Packages

### @toolkit-house/react-components

React component library (React 19).

**Components:**
- Button
- Input
- Modal
- Skeleton
- Card
- ProgressBar

### @toolkit-house/vue-components

Vue 3 component library (submodule).

**Components:**
- Button
- Input
- Modal
- Skeleton

**Note:** This is a git submodule. Initialize with:
```bash
git submodule update --init --recursive
```

---

## Support Packages

### @toolkit-house/types

Shared TypeScript type definitions.

### @toolkit-house/constants

Shared constants for the monorepo.

### @toolkit-house/shared-config

Shared configurations for TypeScript, ESLint, and Vite.

---

## Package Development

### Creating a New Package

1. Create the package directory:
```bash
mkdir packages/my-package
cd packages/my-package
```

2. Initialize package.json:
```json
{
  "name": "@toolkit-house/my-package",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "dev": "unbuild",
    "build": "unbuild",
    "test": "vitest",
    "typecheck": "tsc --noEmit"
  }
}
```

3. Add to workspace:
```bash
pnpm install
```

4. Create source files:
```typescript
// src/index.ts
export function hello(name: string): string {
  return `Hello, ${name}!`
}
```

5. Build and test:
```bash
pnpm run build
pnpm run test
pnpm run typecheck
```

## Next Steps

- Learn about the [Build System](/guide/build)
- Explore [API Reference](/api/)
- Set up [Development](/development/setup)
