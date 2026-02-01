---
title: "@toolkit-house/http-client"
description: A modern HTTP client library with concurrency control, interceptors, and advanced features
chineseTitle: "@toolkit-house/http-client"
chineseDescription: 现代HTTP客户端库，具有并发控制、拦截器和高级功能
---

# @toolkit-house/http-client

A modern HTTP client library with concurrency control, interceptors, and advanced features.

## Introduction

`@toolkit-house/http-client` is a powerful HTTP client built for modern web applications. It extends native Fetch API with advanced features like request pooling, interceptors, retry mechanisms, caching, and comprehensive error handling. It's designed to handle complex HTTP scenarios while maintaining excellent performance and type safety.

### What It Does
- Controls concurrent requests with RequestPool
- Intercepts and modifies requests/responses
- Automatically retries failed requests
- Caches responses with various strategies
- Handles timeouts and cancellations
- Provides detailed error information
- Supports logging and monitoring

### When to Use It
- API-driven applications with complex requirements
- Applications needing request concurrency control
- Projects requiring automatic retry logic
- Applications with caching needs
- Applications needing detailed error handling
- Projects requiring request/response interception

## Installation

```bash
pnpm add @toolkit-house/http-client
```

## Quick Start

```typescript
import { HttpClient, createRetryInterceptor } from '@toolkit-house/http-client'

// Create a client instance
const client = new HttpClient({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  retries: 3
})

// Simple GET request
const user = await client.get('/users/1')
console.log('User data:', user.data)

// POST request with data
const newUser = await client.post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
})

// Request with query parameters
const users = await client.get('/users', {
  params: {
    limit: 10,
    offset: 0,
    active: true
  }
})
```

## Key Features

### 1. Request Pool for Concurrency Control

```typescript
import { RequestPool } from '@toolkit-house/http-client'

// Create a request pool with max concurrency
const pool = new RequestPool({
  maxConcurrent: 5, // Maximum concurrent requests
  queueTimeout: 30000, // Timeout for queued requests
})

// Execute requests through the pool
const results = await Promise.all([
  pool.execute(() => client.get('/users/1')),
  pool.execute(() => client.get('/users/2')),
  pool.execute(() => client.get('/users/3')),
  pool.execute(() => client.get('/users/4')),
  pool.execute(() => client.get('/users/5')),
  pool.execute(() => client.get('/users/6')), // This will wait
])

console.log('Executed', results.length, 'requests')
```

### 2. Request and Response Interceptors

```typescript
import { HttpClient, createAuthInterceptor, createLoggingInterceptor } from '@toolkit-house/http-client'

// Create client with interceptors
const client = new HttpClient({
  baseURL: 'https://api.example.com'
})

// Add authentication interceptor
client.interceptors.request.use(createAuthInterceptor({
  type: 'bearer',
  token: () => localStorage.getItem('token')
}))

// Add logging interceptor
client.interceptors.request.use(createLoggingInterceptor({
  level: 'info',
  format: 'json'
}))

// Add response interceptor for error handling
client.interceptors.response.use(
  response => response,
  error => {
    if (error.status === 401) {
      // Redirect to login page
      window.location.href = '/login'
    }
    throw error
  }
)

// Custom interceptor example
client.interceptors.request.use((config) => {
  // Add timestamp to all requests
  config.headers['X-Timestamp'] = Date.now().toString()
  return config
})
```

### 3. Retry Logic

```typescript
import { HttpClient, createRetryInterceptor } from '@toolkit-house/http-client'

// Create retry interceptor with custom configuration
const retryInterceptor = createRetryInterceptor({
  retries: 3,
  delay: 1000, // 1 second delay
  retryCondition: (error) => {
    // Retry only on 5xx errors or network errors
    return error.status >= 500 || error.code === 'NETWORK_ERROR'
  },
  onRetry: (error, attempt) => {
    console.log(`Retrying request (attempt ${attempt})...`)
  }
})

const client = new HttpClient({
  baseURL: 'https://api.example.com'
})
client.interceptors.request.use(retryInterceptor)
```

### 4. Caching Strategies

```typescript
import { HttpClient, createMemoryCacheInterceptor } from '@toolkit-house/http-client'

// Memory cache with TTL
const cacheInterceptor = createMemoryCacheInterceptor({
  ttl: 60000, // 1 minute cache
  keyGenerator: (config) => {
    // Custom cache key based on URL and params
    return `${config.url}?${JSON.stringify(config.params)}`
  }
})

// LocalStorage cache for persistent storage
const localStorageCache = createLocalStorageCacheInterceptor({
  prefix: 'api_cache_',
  ttl: 3600000 // 1 hour
})

const client = new HttpClient({
  baseURL: 'https://api.example.com'
})
client.interceptors.request.use(cacheInterceptor)
client.interceptors.request.use(localStorageCache)
```

### 5. Comprehensive Error Handling

```typescript
import { HttpError, NetworkError, TimeoutError } from '@toolkit-house/http-client'

try {
  const response = await client.get('/users/1')
  console.log('Success:', response.data)
} catch (error) {
  if (error instanceof NetworkError) {
    console.error('Network error:', error.message)
  } else if (error instanceof TimeoutError) {
    console.error('Request timed out')
  } else if (error instanceof HttpError) {
    console.error(`HTTP ${error.status}:`, error.message)
    console.error('Response data:', error.response?.data)
  } else {
    console.error('Unknown error:', error)
  }
}

// Error details
if (error instanceof HttpError) {
  console.log('Error details:', {
    status: error.status,
    statusText: error.statusText,
    url: error.url,
    method: error.method,
    headers: error.headers,
    requestBody: error.requestBody,
    response: error.response,
    stack: error.stack
  })
}
```

### 6. Upload and Download Progress

```typescript
import { HttpClient } from '@toolkit-house/http-client'

// File upload with progress
const uploadFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const client = new HttpClient()

  const response = await client.post('/upload', formData, {
    onUploadProgress: (progress) => {
      const percent = Math.round((progress.loaded / progress.total) * 100)
      console.log(`Upload progress: ${percent}%`)
    }
  })

  return response.data
}

// File download with progress
const downloadFile = async (url: string) => {
  const client = new HttpClient()

  const response = await client.get(url, {
    responseType: 'blob',
    onDownloadProgress: (progress) => {
      const percent = Math.round((progress.loaded / progress.total) * 100)
      console.log(`Download progress: ${percent}%`)
    }
  })

  // Create download link
  const blobUrl = URL.createObjectURL(response.data)
  const link = document.createElement('a')
  link.href = blobUrl
  link.download = 'file.ext'
  link.click()
}
```

## Common Use Cases

### 1. API Client with Authentication

```typescript
import {
  HttpClient,
  createBearerAuthInterceptor,
  createRetryInterceptor,
  createRateLimitInterceptor
} from '@toolkit-house/http-client'

// Create API client with advanced features
const apiClient = new HttpClient({
  baseURL: process.env.API_BASE_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add authentication
apiClient.interceptors.request.use(
  createBearerAuthInterceptor({
    token: () => localStorage.getItem('access_token'),
    refreshToken: async () => {
      const response = await apiClient.post('/auth/refresh', {
        refresh_token: localStorage.getItem('refresh_token')
      })
      localStorage.setItem('access_token', response.data.access_token)
      return response.data.access_token
    }
  })
)

// Add rate limiting
apiClient.interceptors.request.use(
  createRateLimitInterceptor({
    limit: 100, // 100 requests per minute
    window: 60000,
    onRateLimit: (config, remainingTime) => {
      console.log(`Rate limited. Retry in ${remainingTime}ms`)
    }
  })
)

// Add retry logic
apiClient.interceptors.request.use(
  createRetryInterceptor({
    retries: 3,
    delay: 1000,
    retryCondition: (error) => {
      return error.status >= 500 || error.code === 'NETWORK_ERROR'
    }
  })
)

// Usage in components
export const userService = {
  async getUsers() {
    return apiClient.get('/users')
  },

  async createUser(user: { name: string; email: string }) {
    return apiClient.post('/users', user)
  },

  async updateUser(id: string, updates: Partial<{ name: string; email: string }>) {
    return apiClient.put(`/users/${id}`, updates)
  },

  async deleteUser(id: string) {
    return apiClient.delete(`/users/${id}`)
  }
}
```

### 2. File Upload Service

```typescript
import { HttpClient } from '@toolkit-house/http-client'

class UploadService {
  private client: HttpClient

  constructor() {
    this.client = new HttpClient({
      baseURL: 'https://api.example.com',
      timeout: 30000
    })
  }

  async uploadFile(
    file: File,
    onProgress: (progress: number) => void,
    options?: {
      folder?: string
      tags?: string[]
      metadata?: Record<string, any>
    }
  ) {
    const formData = new FormData()
    formData.append('file', file)

    if (options?.folder) {
      formData.append('folder', options.folder)
    }

    if (options?.tags) {
      formData.append('tags', JSON.stringify(options.tags))
    }

    if (options?.metadata) {
      formData.append('metadata', JSON.stringify(options.metadata))
    }

    const response = await this.client.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        )
        onProgress(progress)
      }
    })

    return response.data
  }

  async getUploadStatus(uploadId: string) {
    return this.client.get(`/uploads/${uploadId}/status`)
  }

  async cancelUpload(uploadId: string) {
    return this.client.delete(`/uploads/${uploadId}`)
  }
}

// Usage
const uploadService = new UploadService()

const handleFileUpload = async (file: File) => {
  try {
    const result = await uploadService.uploadFile(
      file,
      (progress) => {
        console.log(`Upload progress: ${progress}%`)
      },
      {
        folder: 'user-uploads',
        tags: ['profile', 'avatar'],
        metadata: {
          userId: '123',
          description: 'Profile picture'
        }
      }
    )

    console.log('Upload completed:', result)
  } catch (error) {
    console.error('Upload failed:', error)
  }
}
```

### 3. GraphQL Client

```typescript
import { HttpClient } from '@toolkit-house/http-client'

class GraphQLClient {
  private client: HttpClient

  constructor(baseUrl: string) {
    this.client = new HttpClient({
      baseURL: baseUrl
    })
  }

  async query<T>(query: string, variables?: Record<string, any>) {
    return this.client.post('/graphql', {
      query,
      variables
    })
  }

  async mutation<T>(mutation: string, variables?: Record<string, any>) {
    return this.client.post('/graphql', {
      query: mutation,
      variables
    })
  }
}

// Usage
const client = new GraphQLClient('https://api.example.com')

const getUser = async (id: string) => {
  const response = await client.query(`
    query GetUser($id: ID!) {
      user(id: $id) {
        id
        name
        email
        avatar
        createdAt
      }
    }
  `, { id })

  return response.data.user
}

const createUser = async (input: { name: string; email: string }) => {
  const response = await client.mutation(`
    mutation CreateUser($input: CreateUserInput!) {
      createUser(input: $input) {
        id
        name
        email
      }
    }
  `, { input })

  return response.data.createUser
}
```

## API Reference

### Classes

- `HttpClient` - Main HTTP client class
- `RequestPool` - Manages concurrent requests
- `HttpError` - Base HTTP error class
- `NetworkError` - Network-related errors
- `TimeoutError` - Request timeout errors

### Interceptors

- `createAuthInterceptor` - Authentication interceptors
- `createRetryInterceptor` - Retry logic
- `createRateLimitInterceptor` - Rate limiting
- `createCacheInterceptor` - Caching
- `createLoggingInterceptor` - Request/response logging

### Cache Implementations

- `MemoryCache` - In-memory caching
- `LocalStorageCache` - LocalStorage-based caching
- `SessionStorageCache` - SessionStorage-based caching

## Development

```bash
# Navigate to package directory
cd packages/http-client

# Build the package
pnpm run build

# Run tests
pnpm run test

# Run type checking
pnpm run typecheck

# Run linting
pnpm run lint
```

## License

MIT