# @toolkit-house/types API Reference

Shared TypeScript type definitions for Toolkit House monorepo.

## Installation

```bash
pnpm add @toolkit-house/types
```

## Overview

This package provides common type definitions used across the Toolkit House monorepo, ensuring type consistency and reducing duplication.

---

## Core Types

### Result

Type for operations that can succeed or fail.

```typescript
interface Result<T, E = Error> {
  success: boolean
  data?: T
  error?: E
}
```

**Example:**

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

Type for values that can be null.

```typescript
type Nullable<T> = T | null
```

---

### Optional

Type for values that can be undefined.

```typescript
type Optional<T> = T | undefined
```

---

### Maybe

Type for values that can be null or undefined.

```typescript
type Maybe<T> = T | null | undefined
```

---

## Utility Types

### DeepPartial

Makes all properties optional recursively.

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? DeepPartial<T[P]>
    : T[P]
}
```

**Example:**

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
    city: 'New York'
  }
}
```

---

### DeepRequired

Makes all properties required recursively.

```typescript
type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object
    ? DeepRequired<T[P]>
    : T[P]
}
```

---

### ReadonlyDeep

Makes all properties readonly recursively.

```typescript
type ReadonlyDeep<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? ReadonlyDeep<T[P]>
    : T[P]
}
```

---

## HTTP Types

### HttpRequestOptions

Options for HTTP requests.

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

HTTP response structure.

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

API error structure.

```typescript
interface ApiError {
  message: string
  code?: string
  statusCode?: number
  details?: unknown
}
```

---

## Configuration Types

### Config

Base configuration interface.

```typescript
interface Config {
  env: 'development' | 'production' | 'test'
  debug?: boolean
  [key: string]: unknown
}
```

---

### DatabaseConfig

Database configuration.

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

Server configuration.

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

## Event Types

### EventHandler

Event handler function type.

```typescript
type EventHandler<T = unknown> = (data: T) => void
```

---

### EventMap

Map of event names to their data types.

```typescript
type EventMap = Record<string, unknown>
```

---

### TypedEventBus

Typed event bus interface.

```typescript
interface TypedEventBus<T extends EventMap> {
  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void
  off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void
  emit<K extends keyof T>(event: K, data: T[K]): void
}
```

---

## Validation Types

### ValidationRule

Single validation rule.

```typescript
interface ValidationRule<T = unknown> {
  validate: (value: T) => boolean
  message?: string
}
```

---

### ValidationSchema

Collection of validation rules.

```typescript
type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule<T[K]> | ValidationRule<T[K]>[]
}
```

---

### ValidationResult

Result of validation.

```typescript
interface ValidationResult {
  valid: boolean
  errors?: Record<string, string[]>
}
```

---

## Common Object Types

### Dict

Dictionary type with string keys.

```typescript
type Dict<T = unknown> = Record<string, T>
```

---

### KeyValue

Key-value pair.

```typescript
type KeyValue<K = string, V = unknown> = {
  key: K
  value: V
}
```

---

### TypedRecord

Record with known keys.

```typescript
type TypedRecord<K extends string, T> = Record<K, T>
```

---

## Function Types

### AsyncFn

Async function type.

```typescript
type AsyncFn<T = unknown> = (...args: unknown[]) => Promise<T>
```

---

### Fn

Simple function type.

```typescript
type Fn<T = unknown> = (...args: unknown[]) => T
```

---

### Predicate

Predicate function type.

```typescript
type Predicate<T = unknown> = (value: T) => boolean
```

---

### Mapper

Mapper function type.

```typescript
type Mapper<T = unknown, R = unknown> = (value: T) => R
```

---

## Module Exports

```typescript
// Core types
import type {
  Result,
  Nullable,
  Optional,
  Maybe
} from '@toolkit-house/types'

// Utility types
import type {
  DeepPartial,
  DeepRequired,
  ReadonlyDeep
} from '@toolkit-house/types'

// HTTP types
import type {
  HttpRequestOptions,
  HttpResponse,
  ApiError
} from '@toolkit-house/types'

// Configuration types
import type {
  Config,
  DatabaseConfig,
  ServerConfig
} from '@toolkit-house/types'

// Event types
import type {
  EventHandler,
  EventMap,
  TypedEventBus
} from '@toolkit-house/types'

// Validation types
import type {
  ValidationRule,
  ValidationSchema,
  ValidationResult
} from '@toolkit-house/types'

// Common types
import type {
  Dict,
  KeyValue,
  TypedRecord
} from '@toolkit-house/types'

// Function types
import type {
  AsyncFn,
  Fn,
  Predicate,
  Mapper
} from '@toolkit-house/types'
```

---

## Usage Examples

### Result Type

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
  console.log('User:', result.data)
} else {
  console.error('Error:', result.error)
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

### Event Handler

```typescript
import type { EventHandler, EventMap, TypedEventBus } from '@toolkit-house/types'

interface AppEvents extends EventMap {
  'user:login': { userId: string }
  'user:logout': { userId: string }
}

function createEventBus<T extends EventMap>(): TypedEventBus<T> {
  // Implementation...
}

const bus = createEventBus<AppEvents>()
bus.on('user:login', (data) => {
  console.log('User logged in:', data.userId)
})
```

---

## See Also

- [Package Guide](/packages/types) - Usage guide
- [GitHub Repository](https://github.com/your-org/toolkit-house) - Source code
