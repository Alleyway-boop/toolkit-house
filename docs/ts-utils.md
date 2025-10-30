# ts-utils API Documentation

A comprehensive TypeScript utility library providing network utilities, string similarity algorithms, and cache management for modern JavaScript applications.

## 📦 Installation

```bash
npm install ts-utils
# or
pnpm add ts-utils
# or
yarn add ts-utils
```

## 🔧 Package Overview

`ts-utils` is a collection of TypeScript utilities designed for:
- Concurrent request management
- String similarity calculation
- Cache implementations (LRU, FIFO)
- Type-safe utility functions

## 🚀 Quick Start

```typescript
import { RequestPool } from 'ts-utils'
import { stringSimilarity } from 'ts-utils'
import { LRUCache } from 'ts-utils'

// Request Pool usage
const pool = new RequestPool(3)
const result = await pool.add(() => fetch('/api/endpoint'))

// String similarity usage
const similarity = stringSimilarity('hello', 'hello world')

// Cache usage
const cache = new LRUCache<string, number>(10)
cache.set('key', 42)
```

## 📚 API Reference

### Network Utilities

#### RequestPool Class

A request pool that controls concurrent requests to prevent overwhelming the system.

```typescript
class RequestPool {
  constructor(limit: number = 3)
  add(requestFn: () => Promise<any>): Promise<any>
}
```

**Constructor Parameters:**
- `limit` (number, optional): Maximum number of concurrent requests. Default: 3

**Methods:**

##### `add(requestFn: () => Promise<any>): Promise<any>`

Adds a request to the pool and executes it when available.

**Parameters:**
- `requestFn` (): A function that returns a Promise

**Returns:**
- `Promise<any>`: The result of the request function

**Example:**
```typescript
import { RequestPool } from 'ts-utils'

const pool = new RequestPool(2)

// Concurrent request control
const request1 = pool.add(() => fetch('/api/users'))
const request2 = pool.add(() => fetch('/api/posts'))
const request3 = pool.add(() => fetch('/api/comments'))

// Requests will execute at most 2 at a time
const [users, posts, comments] = await Promise.all([request1, request2, request3])
```

### String Utilities

#### stringSimilarity Function

Calculates similarity between two strings using substring matching.

```typescript
function stringSimilarity(
  str1: string,
  str2: string,
  substringLength: number = 2,
  caseSensitive: boolean = false
): number
```

**Parameters:**
- `str1` (string): First string to compare
- `str2` (string): Second string to compare
- `substringLength` (number, optional): Length of substrings for comparison. Default: 2
- `caseSensitive` (boolean, optional): Whether to consider case. Default: false

**Returns:**
- `number`: Similarity score between 0 and 1, where 1 is most similar

**Example:**
```typescript
import { stringSimilarity } from 'ts-utils'

// Basic similarity
const score1 = stringSimilarity('hello', 'hello world') // ~0.5
const score2 = stringSimilarity('hello', 'hi') // ~0.25
const score3 = stringSimilarity('hello', 'HELLO') // ~0.5 (case insensitive)

// Advanced similarity with custom substring length
const score4 = stringSimilarity('programming', 'program', 3) // Higher score with longer substrings
```

### Cache Utilities

#### LRUCache Class

Least Recently Used cache implementation with automatic eviction.

```typescript
class LRUCache<K, V> {
  constructor(maxSize: number)
  get(key: K): V | undefined
  set(key: K, value: V): void
  has(key: K): boolean
  delete(key: K): boolean
  clear(): void
}
```

**Constructor Parameters:**
- `maxSize` (number): Maximum number of items to store

**Methods:**

##### `get(key: K): V | undefined`

Retrieves a value from the cache.

**Parameters:**
- `key` (K): The key to look up

**Returns:**
- `V | undefined`: The value if found, undefined otherwise

##### `set(key: K, value: V): void`

Sets a value in the cache.

**Parameters:**
- `key` (K): The key to set
- `value` (V): The value to store

##### `has(key: K): boolean`

Checks if a key exists in the cache.

**Parameters:**
- `key` (K): The key to check

**Returns:**
- `boolean`: True if the key exists, false otherwise

##### `delete(key: K): boolean`

Deletes a key from the cache.

**Parameters:**
- `key` (K): The key to delete

**Returns:**
- `boolean`: True if the key was deleted, false otherwise

##### `clear(): void`

Clears all items from the cache.

**Example:**
```typescript
import { LRUCache } from 'ts-utils'

const cache = new LRUCache<string, number>(3)

// Set values
cache.set('a', 1)
cache.set('b', 2)
cache.set('c', 3)

// Get values
console.log(cache.get('a')) // 1
console.log(cache.has('b')) // true

// Adding a new item evicts the least recently used
cache.set('d', 4)
console.log(cache.has('a')) // false (evicted)
console.log(cache.has('d')) // true

// Clear cache
cache.clear()
console.log(cache.size) // 0
```

#### FifoCache Class

First-In-First-Out cache implementation with automatic eviction.

```typescript
class FifoCache<K, V> {
  constructor(maxSize: number)
  get(key: K): V | undefined
  set(key: K, value: V): void
  has(key: K): boolean
  delete(key: K): boolean
  clear(): void
}
```

**Methods:**
Same as LRUCache, but eviction follows FIFO policy.

**Example:**
```typescript
import { FifoCache } from 'ts-utils'

const cache = new FifoCache<string, number>(3)

// Set values (first-in)
cache.set('a', 1)
cache.set('b', 2)
cache.set('c', 3)

// Get values
console.log(cache.get('a')) // 1

// Adding a new item evicts the first item added
cache.set('d', 4)
console.log(cache.has('a')) // false (evicted)
console.log(cache.has('d')) // true
```

## 🛠️ Advanced Usage

### Concurrent Request Patterns

```typescript
import { RequestPool } from 'ts-utils'

// Multiple API requests with controlled concurrency
const pool = new RequestPool(5)
const apiEndpoints = [
  '/api/users',
  '/api/posts',
  '/api/comments',
  '/api/settings',
  '/api/analytics'
]

// Execute all requests concurrently, but limit to 5 at a time
const requests = apiEndpoints.map(endpoint =>
  pool.add(() => fetch(endpoint).then(res => res.json()))
)

const results = await Promise.all(requests)
```

### String Similarity Applications

```typescript
import { stringSimilarity } from 'ts-utils'

// Fuzzy search implementation
function fuzzySearch(query: string, options: string[]): string[] {
  const scored = options.map(option => ({
    option,
    score: stringSimilarity(query, option)
  }))

  return scored
    .filter(item => item.score > 0.3) // Minimum similarity threshold
    .sort((a, b) => b.score - a.score) // Sort by similarity
    .map(item => item.option)
}

// Usage
const options = ['react', 'vue', 'angular', 'svelte', 'nextjs']
const results = fuzzySearch('reac', options)
console.log(results) // ['react', 'nextjs'] (sorted by similarity)
```

### Cache Integration

```typescript
import { LRUCache } from 'ts-utils'
import { RequestPool } from 'ts-utils'

// Combine cache with request pooling for performance
class CachedRequestPool {
  private pool: RequestPool
  private cache: LRUCache<string, Promise<any>>

  constructor(limit: number, cacheSize: number) {
    this.pool = new RequestPool(limit)
    this.cache = new LRUCache(cacheSize)
  }

  async request(key: string, requestFn: () => Promise<any>): Promise<any> {
    // Check cache first
    if (this.cache.has(key)) {
      return this.cache.get(key)
    }

    // Create request and cache the promise
    const requestPromise = this.pool.add(requestFn)
    this.cache.set(key, requestPromise)

    try {
      const result = await requestPromise
      return result
    } catch (error) {
      this.cache.delete(key)
      throw error
    }
  }
}

// Usage
const cachedPool = new CachedRequestPool(3, 10)
const result = await cachedPool.request('users-123', () =>
  fetch('/api/users/123').then(res => res.json())
)
```

## 🧪 Performance Considerations

### RequestPool Best Practices

1. **Choose appropriate limits**: Too low = slow performance, too high = resource exhaustion
2. **Use for network operations**: Best for API calls, database queries, etc.
3. **Avoid for CPU-bound tasks**: Use Web Workers instead

### Cache Best Practices

1. **Choose appropriate cache size**: Balance memory usage with hit rate
2. **Use appropriate cache type**: LRU for recent access patterns, FIFO for strict ordering
3. **Implement cache invalidation**: Clear cache when data becomes stale
4. **Monitor cache performance**: Track hit/miss ratios

### String Similarity Considerations

1. **Choose appropriate substring length**: Longer substrings = more precise, shorter substrings = more forgiving
2. **Consider case sensitivity**: Use case-insensitive comparison for user input
3. **Preprocess input strings**: Normalize Unicode, remove special characters if needed

## 🚀 Migration Guide

### From Version 0.x to 1.x

**Breaking Changes:**
- No breaking changes in version 1.x
- All APIs are backward compatible

### Migration Steps

1. Update package version:
   ```bash
   npm update ts-utils
   ```

2. Review updated TypeScript types if using strict mode

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details.

## 🔗 Related Resources

- [RequestPool Examples](../examples/request-pool.md)
- [Cache Management Guide](../examples/cache-management.md)
- [String Similarity Algorithms](../examples/string-similarity.md)