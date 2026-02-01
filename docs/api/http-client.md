# @toolkit-house/http-client API Reference

Modern HTTP client with concurrency control and interceptors.

## Installation

```bash
pnpm add @toolkit-house/http-client
```

## Basic Usage

```typescript
import { HttpClient } from '@toolkit-house/http-client'

const client = new HttpClient({
  baseURL: 'https://api.example.com',
  timeout: 10000,
})

// Simple GET request
const users = await client.get('/users')

// POST request
const newUser = await client.post('/users', {
  name: 'John Doe',
  email: 'john@example.com',
})

// PUT request
const updated = await client.put('/users/1', {
  name: 'Jane Doe',
})

// DELETE request
await client.delete('/users/1')
```

## Constructor Options

```typescript
interface HttpClientOptions {
  baseURL?: string
  timeout?: number
  maxConcurrent?: number
  retries?: number
  retryDelay?: number
  headers?: Record<string, string>
}
```

**Example:**
```typescript
const client = new HttpClient({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  maxConcurrent: 5,
  retries: 3,
  retryDelay: 1000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})
```

## Methods

### GET

```typescript
const data = await client.get('/users', {
  params: { page: 1, limit: 10 },
  headers: { 'X-Custom': 'value' },
})
```

### POST

```typescript
const data = await client.post('/users', {
  name: 'John Doe',
  email: 'john@example.com',
})
```

### PUT

```typescript
const data = await client.put('/users/1', {
  name: 'Jane Doe',
})
```

### PATCH

```typescript
const data = await client.patch('/users/1', {
  name: 'Jane Smith',
})
```

### DELETE

```typescript
await client.delete('/users/1')
```

## Interceptors

### Request Interceptor

```typescript
client.addRequestInterceptor((config) => {
  // Add auth token
  config.headers['Authorization'] = `Bearer ${token}`

  // Add timestamp
  config.headers['X-Timestamp'] = Date.now().toString()

  return config
})
```

### Response Interceptor

```typescript
client.addResponseInterceptor((response) => {
  // Log response
  console.log('Response:', response.status, response.data)

  // Transform data
  if (response.data) {
    response.data = camelCaseKeys(response.data)
  }

  return response
})
```

### Error Interceptor

```typescript
client.addErrorInterceptor((error) => {
  // Log errors
  console.error('Request failed:', error.message)

  // Retry on 503
  if (error.status === 503) {
    return client.request(error.config)
  }

  throw error
})
```

## Error Handling

```typescript
try {
  const data = await client.get('/users/1')
} catch (error) {
  if (error instanceof HttpClientError) {
    console.error('HTTP Error:', error.status, error.message)
    console.error('Response:', error.response?.data)
  } else if (error instanceof NetworkError) {
    console.error('Network Error:', error.message)
  } else {
    console.error('Unknown Error:', error)
  }
}
```

## Request Config

```typescript
interface RequestConfig {
  url?: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  params?: Record<string, string | number>
  data?: any
  headers?: Record<string, string>
  timeout?: number
  retries?: number
}
```

## Response

```typescript
interface HttpResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}
```

## Advanced Usage

### Custom Instance

```typescript
const apiClient = new HttpClient({
  baseURL: 'https://api.example.com',
})

const wsClient = new HttpClient({
  baseURL: 'https://ws.example.com',
})
```

### Request Cancellation

```typescript
const controller = new AbortController()

client.get('/users', {
  signal: controller.signal,
})

// Cancel request
controller.abort()
```

### Progress Tracking

```typescript
client.post('/upload', formData, {
  onUploadProgress: (progress) => {
    console.log(`Upload: ${progress.percent}%`)
  },
  onDownloadProgress: (progress) => {
    console.log(`Download: ${progress.percent}%`)
  },
})
```

## License

MIT
