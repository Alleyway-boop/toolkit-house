# Request Pool Usage Examples

This guide provides comprehensive examples for using the `RequestPool` class from `ts-utils` for concurrent request management.

## 🚀 Basic Usage

### Simple Request Pool

```typescript
import { RequestPool } from 'ts-utils'

// Create a request pool with limit of 3 concurrent requests
const pool = new RequestPool(3)

// Add requests to the pool
const request1 = pool.add(() => fetch('/api/users'))
const request2 = pool.add(() => fetch('/api/posts'))
const request3 = pool.add(() => fetch('/api/comments'))

// Wait for all requests to complete
const [users, posts, comments] = await Promise.all([request1, request2, request3])

console.log('All requests completed:', { users, posts, comments })
```

### Error Handling

```typescript
import { RequestPool } from 'ts-utils'

const pool = new RequestPool(2)

try {
  const request1 = pool.add(() => fetch('/api/success'))
  const request2 = pool.add(() => fetch('/api/error')) // This will fail
  const request3 = pool.add(() => fetch('/api/another'))

  const [successResult, errorResult, anotherResult] = await Promise.allSettled([
    request1,
    request2,
    request3
  ])

  // Handle results
  if (successResult.status === 'fulfilled') {
    console.log('Success:', successResult.value)
  }

  if (errorResult.status === 'rejected') {
    console.error('Error:', errorResult.reason)
  }

  if (anotherResult.status === 'fulfilled') {
    console.log('Another:', anotherResult.value)
  }
} catch (error) {
  console.error('Pool error:', error)
}
```

## 🛠️ Advanced Usage

### Cached Request Pool

```typescript
import { LRUCache, RequestPool } from 'ts-utils'

class CachedRequestPool {
  private pool: RequestPool
  private cache: LRUCache<string, Promise<any>>
  private cacheTimeoutMs: number

  constructor(limit: number, cacheSize: number, cacheTimeoutMs: number = 60000) {
    this.pool = new RequestPool(limit)
    this.cache = new LRUCache(cacheSize)
    this.cacheTimeoutMs = cacheTimeoutMs
  }

  async request(key: string, requestFn: () => Promise<any>): Promise<any> {
    // Check cache first
    const cached = this.cache.get(key)
    if (cached) {
      return cached
    }

    // Create request promise and cache it
    const requestPromise = this.pool.add(requestFn)
    this.cache.set(key, requestPromise)

    try {
      const result = await requestPromise
      return result
    } catch (error) {
      // Remove from cache on failure
      this.cache.delete(key)
      throw error
    }
  }

  clearCache(): void {
    this.cache.clear()
  }

  getCacheStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.cache.maxSize
    }
  }
}

// Usage
const cachedPool = new CachedRequestPool(5, 100)

// First call - will make actual request
const users1 = await cachedPool.request('users', () => fetch('/api/users').then(res => res.json()))

// Second call - will use cached result
const users2 = await cachedPool.request('users', () => fetch('/api/users').then(res => res.json()))

console.log(users1 === users2) // true (same result from cache)
```

### Progress Tracking

```typescript
import { RequestPool } from 'ts-utils'

interface ProgressTracker {
  completed: number
  total: number
  startTime: number
}

function createProgressTracker(total: number): ProgressTracker {
  return {
    completed: 0,
    total,
    startTime: Date.now()
  }
}

function updateProgress(tracker: ProgressTracker): void {
  tracker.completed++
  const elapsed = Date.now() - tracker.startTime
  const remaining = (elapsed / tracker.completed) * (tracker.total - tracker.completed)

  console.log(
    `Progress: ${tracker.completed}/${tracker.total} ` +
    `(${Math.round((tracker.completed / tracker.total) * 100)}%) ` +
    `Elapsed: ${Math.round(elapsed / 1000)}s ` +
    `Remaining: ${Math.round(remaining / 1000)}s`
  )
}

async function batchWithProgress(urls: string[], concurrency: number = 5): Promise<any[]> {
  const pool = new RequestPool(concurrency)
  const results: any[] = []
  const progress = createProgressTracker(urls.length)

  const promises = urls.map(url =>
    pool.add(async () => {
      const response = await fetch(url)
      const data = await response.json()
      updateProgress(progress)
      return { url, data }
    })
  )

  const resolvedResults = await Promise.all(promises)
  return resolvedResults
}

// Usage
const urls = [
  '/api/users/1',
  '/api/users/2',
  '/api/users/3',
  '/api/posts/1',
  '/api/posts/2'
]

const results = await batchWithProgress(urls, 3)
console.log('All results:', results)
```

### Retry Mechanism

```typescript
import { RequestPool } from 'ts-utils'

interface RetryOptions {
  maxRetries: number
  delayMs: number
  shouldRetry?: (error: any) => boolean
}

async function withRetry<T>(
  requestFn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let lastError: any

  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      return await requestFn()
    } catch (error) {
      lastError = error

      // Check if we should retry
      if (options.shouldRetry && !options.shouldRetry(error)) {
        throw error
      }

      // Don't retry on the last attempt
      if (attempt === options.maxRetries) {
        throw error
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, options.delayMs * (attempt + 1)))
    }
  }

  throw lastError
}

// Create request pool with retry
const pool = new RequestPool(3)

async function fetchWithRetry(url: string, options: RetryOptions = { maxRetries: 3, delayMs: 1000 }): Promise<Response> {
  return await pool.add(() =>
    withRetry(() => fetch(url), options)
  )
}

// Usage
try {
  const response = await fetchWithRetry('/api/unstable-endpoint', {
    maxRetries: 5,
    delayMs: 2000,
    shouldRetry: (error) => {
      // Retry only on 5xx errors
      return error.status >= 500 && error.status < 600
    }
  })

  console.log('Success:', await response.json())
} catch (error) {
  console.error('Failed after retries:', error)
}
```

### Rate-Limited Request Pool

```typescript
import { RequestPool } from 'ts-utils'

interface RateLimiter {
  requests: Array<{ timestamp: number; resolve: (value: any) => void }>
  maxRequests: number
  timeWindowMs: number
}

function createRateLimiter(maxRequests: number, timeWindowMs: number): RateLimiter {
  return {
    requests: [],
    maxRequests,
    timeWindowMs
  }
}

function checkRateLimit(limiter: RateLimiter): boolean {
  const now = Date.now()

  // Remove old requests
  limiter.requests = limiter.requests.filter(
    req => now - req.timestamp < limiter.timeWindowMs
  )

  return limiter.requests.length < limiter.maxRequests
}

async function rateLimitedRequest(limiter: RateLimiter, requestFn: () => Promise<any>): Promise<any> {
  return new Promise((resolve, reject) => {
    if (checkRateLimit(limiter)) {
      // Execute immediately
      limiter.requests.push({ timestamp: Date.now(), resolve })
      requestFn()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          limiter.requests = limiter.requests.filter(req => req !== resolve)
        })
    } else {
      // Wait until next time window
      const waitTime = limiter.timeWindowMs - (Date.now() - limiter.requests[0]?.timestamp || 0)

      setTimeout(() => {
        rateLimitedRequest(limiter, requestFn).then(resolve, reject)
      }, waitTime)
    }
  })
}

// Usage
const rateLimiter = createRateLimiter(10, 60000) // 10 requests per minute
const pool = new RequestPool(3)

async function fetchRateLimited(url: string): Promise<Response> {
  return await rateLimitedRequest(rateLimiter, () =>
    pool.add(() => fetch(url))
  )
}

// Usage
const urls = Array.from({ length: 20 }, (_, i) => `/api/data/${i}`)

for (const url of urls) {
  try {
    const response = await fetchRateLimited(url)
    console.log('Fetched:', url, await response.json())
  } catch (error) {
    console.error('Failed to fetch:', url, error)
  }
}
```

## 🧪 Real-World Examples

### API Data Fetching with Caching and Retry

```typescript
import { LRUCache, RequestPool } from 'ts-utils'

interface ApiResult {
  id: string
  data: any
  timestamp: number
}

class ApiService {
  private cache: LRUCache<string, ApiResult>
  private pool: RequestPool
  private staleAfterMs: number

  constructor(cacheSize: number = 100, poolLimit: number = 5, staleAfterMs: number = 300000) {
    this.cache = new LRUCache(cacheSize)
    this.pool = new RequestPool(poolLimit)
    this.staleAfterMs = staleAfterMs
  }

  async fetchWithCache(url: string, options: RequestInit = {}): Promise<any> {
    // Check cache first
    const cached = this.cache.get(url)
    if (cached && Date.now() - cached.timestamp < this.staleAfterMs) {
      console.log('Cache hit for:', url)
      return cached.data
    }

    // Fetch from API
    const result = await this.pool.add(async () => {
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      return response.json()
    })

    // Cache the result
    const apiResult: ApiResult = {
      id: url,
      data: result,
      timestamp: Date.now()
    }
    this.cache.set(url, apiResult)

    return result
  }

  async fetchWithRetry(url: string, options: RequestInit = {}, maxRetries: number = 3): Promise<any> {
    let lastError: any

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.fetchWithCache(url, options)
      } catch (error) {
        lastError = error

        if (attempt === maxRetries) {
          throw error
        }

        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw lastError
  }

  clearCache(): void {
    this.cache.clear()
  }

  getCacheStats(): { size: number; maxSize: number; hitRate: number } {
    // This would need to be implemented with hit/miss tracking
    return {
      size: this.cache.size,
      maxSize: this.cache.maxSize,
      hitRate: 0 // Placeholder
    }
  }
}

// Usage
const apiService = new ApiService(200, 5, 300000)

// Fetch user data with caching and retry
try {
  const user = await apiService.fetchWithRetry('/api/users/123')
  console.log('User data:', user)

  // This will use cache
  const userAgain = await apiService.fetchWithRetry('/api/users/123')
  console.log('User data (cached):', userAgain)
} catch (error) {
  console.error('Failed to fetch user:', error)
}
```

### Bulk Data Processing

```typescript
import { RequestPool } from 'ts-utils'

interface ProcessingTask {
  id: string
  data: any
  process: (data: any) => Promise<any>
}

class BulkProcessor {
  private pool: RequestPool
  private results: Map<string, any> = new Map()
  private errors: Map<string, any> = new Map()

  constructor(concurrency: number = 3) {
    this.pool = new RequestPool(concurrency)
  }

  async processTasks(tasks: ProcessingTask[]): Promise<{ results: Map<string, any>; errors: Map<string, any> }> {
    const promises = tasks.map(task =>
      this.pool.add(async () => {
        try {
          const result = await task.process(task.data)
          this.results.set(task.id, result)
          return { id: task.id, success: true, result }
        } catch (error) {
          this.errors.set(task.id, error)
          return { id: task.id, success: false, error }
        }
      })
    )

    await Promise.all(promises)
    return { results: this.results, errors: this.errors }
  }

  getProgress(): { total: number; completed: number; success: number; failed: number } {
    return {
      total: this.results.size + this.errors.size,
      completed: this.results.size + this.errors.size,
      success: this.results.size,
      failed: this.errors.size
    }
  }
}

// Usage
const processor = new BulkProcessor(4)

const tasks: ProcessingTask[] = [
  {
    id: 'task1',
    data: { url: '/api/data/1' },
    process: async (data) => {
      const response = await fetch(data.url)
      return response.json()
    }
  },
  {
    id: 'task2',
    data: { url: '/api/data/2' },
    process: async (data) => {
      const response = await fetch(data.url)
      return response.json()
    }
  },
  // ... more tasks
]

async function runBulkProcessing() {
  console.log('Starting bulk processing...')

  const result = await processor.processTasks(tasks)

  console.log('Processing complete:')
  console.log('Successful:', result.results.size)
  console.log('Failed:', result.errors.size)

  if (result.errors.size > 0) {
    console.log('Errors:', Array.from(result.errors.entries()))
  }
}

runBulkProcessing()
```

## 🚨 Best Practices

### 1. Choose Appropriate Limits

```typescript
// Too low - slow performance
const pool = new RequestPool(1) // Sequential processing

// Just right - balances performance and resource usage
const pool = new RequestPool(5) // Good for most APIs

// Too high - resource exhaustion
const pool = new RequestPool(100) // May overwhelm server
```

### 2. Handle Errors Properly

```typescript
// Good error handling
try {
  const result = await pool.add(() => fetch('/api'))
  console.log('Success:', result)
} catch (error) {
  console.error('Failed:', error)
  // Implement retry or fallback
}
```

### 3. Use Caching Wisely

```typescript
// Cache frequently accessed data
const cache = new LRUCache<string, Promise<any>>(100)

async function getCachedData(key: string, fetchFn: () => Promise<any>): Promise<any> {
  if (cache.has(key)) {
    return cache.get(key)
  }

  const promise = fetchFn()
  cache.set(key, promise)
  return promise
}
```

### 4. Monitor Performance

```typescript
// Track request timing
const pool = new RequestPool(3)

const timedRequest = pool.add(async () => {
  const start = Date.now()
  const result = await fetch('/api/slow-endpoint')
  const duration = Date.now() - start
  console.log(`Request took ${duration}ms`)
  return result
})
```

## 📊 Performance Considerations

### Memory Usage
- Monitor cache size and evict old entries
- Use appropriate pool limits
- Clean up resources after completion

### Network Performance
- Respect rate limits
- Implement proper error handling
- Use compression when possible

### CPU Usage
- Avoid CPU-bound tasks in the pool
- Use Web Workers for heavy computation
- Monitor system resources

## 🔧 Troubleshooting

### Common Issues

**"Too Many Requests" Errors**
- Reduce pool concurrency limit
- Implement rate limiting
- Add retry logic with backoff

**Memory Issues**
- Reduce cache size
- Clear cache regularly
- Monitor memory usage

**Timeout Errors**
- Implement timeout logic
- Add retry mechanism
- Monitor server response times

### Debugging

```typescript
// Debug pool usage
const debugPool = new RequestPool(2)

debugPool.add(async () => {
  console.log('Starting request 1')
  const result = await fetch('/api/1')
  console.log('Completed request 1')
  return result
})

debugPool.add(async () => {
  console.log('Starting request 2')
  const result = await fetch('/api/2')
  console.log('Completed request 2')
  return result
})
```

This comprehensive guide covers various use cases for the RequestPool class, from basic usage to advanced patterns like caching, retry logic, rate limiting, and bulk processing. Each example includes practical code that you can adapt for your specific needs.