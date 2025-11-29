# @toolkit-house/http-client

A modern HTTP client library with concurrency control, interceptors, and advanced features. Built on top of `@toolkit-house/ts-utils` RequestPool for high-performance concurrent request management.

## Features

- 🚀 **Concurrent Request Control** - Built-in request pool with configurable concurrency limits
- 🔧 **Interceptors** - Request and response interceptors for authentication, logging, retry logic, and more
- 🔄 **Smart Retry** - Exponential backoff with configurable retry strategies
- 💾 **Caching** - Multiple caching strategies (memory, localStorage, sessionStorage)
- 📊 **Error Handling** - Comprehensive error types with automatic error categorization
- ⏱️ **Timeout Control** - Per-request and global timeout configuration
- 🎯 **Request Deduplication** - Automatic deduplication of identical in-flight requests
- 📝 **TypeScript Support** - Full TypeScript support with comprehensive type definitions
- 🌐 **Cross-platform** - Works in both Node.js and browser environments
- 📦 **Lightweight** - Minimal dependencies with optional feature support

## Installation

```bash
npm install @toolkit-house/http-client
```

## Quick Start

```typescript
import { HttpClient } from '@toolkit-house/http-client';

// Create a client with default configuration
const client = new HttpClient();

// Make a simple GET request
const response = await client.get('/api/users');
console.log(response.data);

// Make a POST request
const newUser = await client.post('/api/users', {
  name: 'John Doe',
  email: 'john@example.com'
});
```

## Advanced Usage

### Configuration

```typescript
import { HttpClient } from '@toolkit-house/http-client';

const client = new HttpClient({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  retryCount: 3,
  poolSize: 10,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'MyApp/1.0.0'
  },
  // Optional: Use @toolkit-house/constants for HTTP status codes
  // validateStatus: (status) => status >= 200 && status < 300
});
```

### Authentication Interceptors

```typescript
import { createBearerAuthInterceptor, createBasicAuthInterceptor } from '@toolkit-house/http-client';

// Bearer Token Authentication
client.addRequestInterceptor(
  createBearerAuthInterceptor(() => localStorage.getItem('token')!)
);

// Basic Authentication
client.addRequestInterceptor(
  createBasicAuthInterceptor('username', 'password')
);

// API Key Authentication
client.addRequestInterceptor(
  createApiKeyAuthInterceptor('your-api-key', 'X-API-Key')
);
```

### Retry Interceptor

```typescript
import { createRetryInterceptor } from '@toolkit-house/http-client';

client.addResponseInterceptor(
  createRetryInterceptor({
    maxRetries: 3,
    retryDelay: 1000,
    retryDelayStrategy: 'exponential',
    retryOn4xx: false,
    retryStatusCodes: [408, 429, 500, 502, 503, 504],
    onRetry: (error, attempt) => {
      console.log(`Retrying request (attempt ${attempt + 1})`);
    }
  })
);
```

### Caching

```typescript
import { createCacheInterceptor } from '@toolkit-house/http-client';

// Memory caching
client.addRequestInterceptor(createCacheInterceptor({
  type: 'memory',
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  maxSize: 100
}).onFulfilled);

client.addResponseInterceptor(createCacheInterceptor({
  type: 'memory'
}).onFulfilled);

// Request with caching
const response = await client.get('/api/users', { cache: true });
```

### Logging

```typescript
import { createLoggingInterceptor } from '@toolkit-house/http-client';

client.addRequestInterceptor(
  createLoggingInterceptor({
    level: 'info',
    logHeaders: false,
    logBody: true,
    logDuration: true
  }).onFulfilled
);

client.addResponseInterceptor(
  createLoggingInterceptor({
    logResponseBody: false
  }).onFulfilled
);

client.addResponseInterceptor(
  createLoggingInterceptor({
    logErrorDetails: true
  }).onRejected
);
```

### Error Handling

```typescript
import { HttpError, NetworkError, AuthenticationError } from '@toolkit-house/http-client';

try {
  const response = await client.get('/api/protected-resource');
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Handle authentication errors
    console.log('Please log in again');
  } else if (error instanceof NetworkError) {
    // Handle network errors
    console.log('Network connection failed');
  } else if (error instanceof HttpError) {
    // Handle general HTTP errors
    console.log(`HTTP Error: ${error.status} - ${error.message}`);

    // Check if error is retryable
    if (error.isRetryable()) {
      console.log('This error can be retried');
    }
  }
}
```

### File Upload

```typescript
// Upload with FormData
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('description', 'My file');

const uploadResponse = await client.post('/api/upload', formData, {
  onUploadProgress: (progress) => {
    console.log(`Upload progress: ${progress.progress}%`);
  }
});
```

### Request Configuration

```typescript
const response = await client.get('/api/users', {
  params: {
    page: 1,
    limit: 10,
    search: 'john'
  },
  headers: {
    'Accept': 'application/json'
  },
  timeout: 5000,
  retryCount: 2,
  cache: {
    ttl: 60000, // 1 minute
    key: 'users-page-1'
  },
  onDownloadProgress: (progress) => {
    console.log(`Download progress: ${progress.progress}%`);
  }
});
```

### Concurrent Request Control

The HTTP client uses `@toolkit-house/ts-utils` RequestPool to control concurrent requests:

```typescript
import { HttpClient } from '@toolkit-house/http-client';

// Limit concurrent requests to 5
const client = new HttpClient({
  poolSize: 5
});

// Make 20 requests - only 5 will run concurrently
const requests = Array(20).fill(null).map((_, i) =>
  client.get(`/api/items/${i}`)
);

const responses = await Promise.all(requests);
```

### Custom Interceptors

```typescript
// Request interceptor to add timestamp
client.addRequestInterceptor((config) => {
  config.headers = config.headers || {};
  config.headers['X-Request-Time'] = new Date().toISOString();
  return config;
});

// Response interceptor to transform data
client.addResponseInterceptor((response) => {
  if (response.data && Array.isArray(response.data)) {
    response.data = response.data.map(item => ({
      ...item,
      id: parseInt(item.id)
    }));
  }
  return response;
});
```

## API Reference

### HttpClient

#### Constructor

```typescript
new HttpClient(options?: HttpClientOptions)
```

#### Methods

- `get<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>`
- `post<T>(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse<T>>`
- `put<T>(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse<T>>`
- `patch<T>(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse<T>>`
- `delete<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>`
- `head<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>`
- `options<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>`
- `request<T>(config: HttpRequestConfig): Promise<HttpResponse<T>>`
- `addRequestInterceptor(onFulfilled?, onRejected?): number`
- `addResponseInterceptor(onFulfilled?, onRejected?): number`
- `removeRequestInterceptor(id: number): void`
- `removeResponseInterceptor(id: number): void`
- `clearCache(): void`

### Interceptors

#### Authentication Interceptors

- `createBearerAuthInterceptor(tokenProvider, options?)`
- `createBasicAuthInterceptor(username, password, options?)`
- `createApiKeyAuthInterceptor(apiKey, headerName?, options?)`

#### Retry Interceptors

- `createRetryInterceptor(options?)`
- `createNetworkRetryInterceptor(options?)`
- `createRateLimitRetryInterceptor(options?)`
- `createFastRetryInterceptor(options?)`
- `createSlowRetryInterceptor(options?)`

#### Cache Interceptors

- `createCacheInterceptor(options?)`
- `createMemoryCacheInterceptor(options?)`
- `createLocalStorageCacheInterceptor(options?)`
- `createLongTermCacheInterceptor(options?)`
- `createShortTermCacheInterceptor(options?)`

#### Logging Interceptors

- `createLoggingInterceptor(options?)`
- `createSimpleLoggingInterceptor(options?)`
- `createDetailedLoggingInterceptor(options?)`
- `createErrorLoggingInterceptor(options?)`
- `createPerformanceLoggingInterceptor(options?)`

### Error Types

- `HttpError` - Base HTTP error class
- `NetworkError` - Network-related errors
- `TimeoutError` - Request timeout errors
- `CancelError` - Request cancellation errors
- `ParseError` - Response parsing errors
- `ValidationError` - Request validation errors
- `AuthenticationError` - Authentication errors (401)
- `AuthorizationError` - Authorization errors (403)
- `NotFoundError` - Not found errors (404)
- `ServerError` - Server errors (5xx)
- `RateLimitError` - Rate limiting errors (429)

## Configuration Options

### HttpClientOptions

```typescript
interface HttpClientOptions {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  retryCount?: number;
  retryDelay?: number;
  poolSize?: number;
  validateStatus?: (status: number) => boolean;
  transformRequest?: RequestTransformer[];
  transformResponse?: ResponseTransformer[];
  paramsSerializer?: (params: Record<string, any>) => string;
  withCredentials?: boolean;
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer';
  // ... and more options
}
```

### HttpRequestConfig

```typescript
interface HttpRequestConfig {
  url?: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
  cache?: boolean | CacheOptions;
  signal?: AbortSignal;
  onUploadProgress?: (progress: ProgressEvent) => void;
  onDownloadProgress?: (progress: ProgressEvent) => void;
  // ... and more options
}
```

## Examples

### Basic Example

```typescript
import { HttpClient } from '@toolkit-house/http-client';

const client = new HttpClient({
  baseURL: 'https://jsonplaceholder.typicode.com'
});

async function getUsers() {
  try {
    const response = await client.get('/users');
    console.log('Users:', response.data);
  } catch (error) {
    console.error('Error fetching users:', error.message);
  }
}

getUsers();
```

### Advanced Example with All Features

```typescript
import {
  HttpClient,
  createBearerAuthInterceptor,
  createRetryInterceptor,
  createCacheInterceptor,
  createLoggingInterceptor
} from '@toolkit-house/http-client';

// Create client with comprehensive configuration
const client = new HttpClient({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  poolSize: 5,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add authentication
client.addRequestInterceptor(
  createBearerAuthInterceptor(() => localStorage.getItem('jwtToken')!)
);

// Add retry logic
client.addResponseInterceptor(
  createRetryInterceptor({
    maxRetries: 3,
    retryDelay: 1000,
    retryDelayStrategy: 'exponential',
    onRetry: (error, attempt) => {
      console.log(`Retry attempt ${attempt + 1} for ${error.config.url}`);
    }
  }).onRejected
);

// Add caching
const cacheInterceptor = createCacheInterceptor({
  type: 'memory',
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  urlPatterns: [/^\/api\/public\//] // Only cache public endpoints
});

client.addRequestInterceptor(cacheInterceptor.onFulfilled);
client.addResponseInterceptor(cacheInterceptor.onFulfilled);

// Add logging
const loggingInterceptor = createLoggingInterceptor({
  level: 'info',
  logDuration: true,
  logHeaders: false,
  logBody: false
});

client.addRequestInterceptor(loggingInterceptor.onFulfilled);
client.addResponseInterceptor(loggingInterceptor.onFulfilled);
client.addResponseInterceptor(loggingInterceptor.onRejected);

// Example usage
async function fetchUserData(userId: string) {
  try {
    const response = await client.get(`/api/users/${userId}`, {
      cache: true, // Enable caching for this request
      params: {
        include: 'profile,settings'
      }
    });

    return response.data;
  } catch (error) {
    if (error.isRetryable()) {
      console.log('This request can be retried');
    }
    throw error;
  }
}
```

## TypeScript Support

This library is built with TypeScript and provides comprehensive type definitions:

```typescript
import { HttpClient, HttpResponse, HttpError } from '@toolkit-house/http-client';

interface User {
  id: number;
  name: string;
  email: string;
}

const client = new HttpClient();

// Typed response
async function getUser(id: number): Promise<User> {
  const response = await client.get<User>(`/api/users/${id}`);
  return response.data;
}

// Error handling with type guards
async function handleRequest() {
  try {
    const user = await getUser(1);
    console.log(user.name); // TypeScript knows user.name is a string
  } catch (error) {
    if (error instanceof HttpError) {
      // TypeScript knows error has HttpError properties
      console.log(`Status: ${error.status}`);
      console.log(`Message: ${error.getUserFriendlyMessage()}`);
    }
  }
}
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Node.js Support

- Node.js 14+

## License

MIT

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.