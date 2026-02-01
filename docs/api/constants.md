# @toolkit-house/constants API Reference

Shared constants for Toolkit House monorepo.

## Installation

```bash
pnpm add @toolkit-house/constants
```

## Overview

This package provides common constants used across the Toolkit House monorepo, ensuring consistency and making it easy to update values globally.

---

## HTTP Constants

### HTTP Status Codes

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

**Example:**

```typescript
import { HttpStatus } from '@toolkit-house/constants'

return { status: HttpStatus.OK, data: result }
```

---

### HTTP Methods

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

### HTTP Headers

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

## Time Constants

### Time Intervals (milliseconds)

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

**Example:**

```typescript
import { Time } from '@toolkit-house/constants'

// Set timeout to 5 seconds
setTimeout(callback, 5 * Time.SECOND)

// Cache for 1 hour
cache.set(key, value, Time.HOUR)
```

---

### Date Formats

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

## Environment Constants

### Environment Names

```typescript
enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}
```

---

### Node Environment

```typescript
const NodeEnv = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const
```

---

## Validation Constants

### Regular Expressions

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

**Example:**

```typescript
import { Regex } from '@toolkit-house/constants'

function validateEmail(email: string): boolean {
  return Regex.EMAIL.test(email)
}
```

---

### Validation Constraints

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

## Storage Constants

### Storage Keys

```typescript
const StorageKey = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const
```

**Example:**

```typescript
import { StorageKey } from '@toolkit-house/constants'

localStorage.setItem(StorageKey.ACCESS_TOKEN, token)
```

---

### Cache Durations

```typescript
const CacheDuration = {
  SHORT: 5 * 60 * 1000,      // 5 minutes
  MEDIUM: 30 * 60 * 1000,    // 30 minutes
  LONG: 60 * 60 * 1000,      // 1 hour
  VERY_LONG: 24 * 60 * 60 * 1000, // 1 day
} as const
```

---

## Application Constants

### Application Limits

```typescript
const AppLimits = {
  MAX_RETRY_ATTEMPTS: 3,
  REQUEST_TIMEOUT: 30000,     // 30 seconds
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MAX_CONCURRENT_REQUESTS: 5,
} as const
```

---

### Pagination Defaults

```typescript
const Pagination = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const
```

---

## Error Constants

### Error Messages

```typescript
const ErrorMessage = {
  NETWORK_ERROR: 'Network error occurred',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  SERVER_ERROR: 'Internal server error',
} as const
```

---

### Error Codes

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

## API Constants

### API Endpoints

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

### API Versions

```typescript
const ApiVersion = {
  V1: 'v1',
  V2: 'v2',
} as const
```

---

## Module Exports

```typescript
// HTTP
import { HttpStatus, HttpMethod } from '@toolkit-house/constants'
import { HttpHeaders } from '@toolkit-house/constants'

// Time
import { Time, DateFormat } from '@toolkit-house/constants'

// Environment
import { Environment, NodeEnv } from '@toolkit-house/constants'

// Validation
import { Regex, Validation } from '@toolkit-house/constants'

// Storage
import { StorageKey, CacheDuration } from '@toolkit-house/constants'

// Application
import { AppLimits, Pagination } from '@toolkit-house/constants'

// Error
import { ErrorMessage, ErrorCode } from '@toolkit-house/constants'

// API
import { ApiEndpoint, ApiVersion } from '@toolkit-house/constants'
```

---

## Usage Examples

### HTTP Status Handling

```typescript
import { HttpStatus } from '@toolkit-house/constants'

function handleResponse(status: number) {
  switch (status) {
    case HttpStatus.OK:
      return 'Success'
    case HttpStatus.NOT_FOUND:
      return 'Not found'
    case HttpStatus.INTERNAL_SERVER_ERROR:
      return 'Server error'
    default:
      return 'Unknown status'
  }
}
```

### Time-based Operations

```typescript
import { Time } from '@toolkit-house/constants'

// Debounce function
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

// Cache with TTL
function setWithTTL(key: string, value: unknown, ttl: number = Time.HOUR) {
  cache.set(key, value, ttl)
}
```

### Validation

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

### Storage

```typescript
import { StorageKey, CacheDuration } from '@toolkit-house/constants'

// Save auth token
function saveToken(token: string) {
  localStorage.setItem(StorageKey.ACCESS_TOKEN, token)
}

// Cache with duration
function cacheData(key: string, data: unknown) {
  const item = {
    data,
    expires: Date.now() + CacheDuration.MEDIUM,
  }
  localStorage.setItem(key, JSON.stringify(item))
}
```

---

## TypeScript Support

All constants are properly typed for TypeScript:

```typescript
import { HttpMethod } from '@toolkit-house/constants'

const method: HttpMethod = HttpMethod.GET // Type-safe

// String literal type from const object
import { HttpHeaders } from '@toolkit-house/constants'
const header: keyof typeof HttpHeaders = 'CONTENT_TYPE'
```

---

## See Also

- [Package Guide](/packages/constants) - Usage guide
- [GitHub Repository](https://github.com/your-org/toolkit-house) - Source code
