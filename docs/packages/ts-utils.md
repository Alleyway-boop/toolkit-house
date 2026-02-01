# @toolkit-house/ts-utils

Comprehensive TypeScript utility library for the Toolkit House monorepo.

## Features

- **Network Utilities**: RequestPool for controlling concurrent requests
- **String Utilities**: Similarity algorithms, pattern matching, formatting
- **Array Operations**: Chunking, flattening, unique, intersection, difference
- **Object Utilities**: Pick, omit, merge, deep clone, nested access
- **Date Utilities**: Formatting, parsing, manipulation
- **Validation**: Common validation helpers
- **Sorting**: Quick sort, merge sort, heap sort, bubble sort
- **Searching**: Binary search, interpolation search
- **Graph Algorithms**: BFS, DFS, Dijkstra, topological sort
- **Dynamic Programming**: Common DP patterns
- **Data Structures**: Trie, Tree, Heap, Stack, Queue, Linked List
- **Functional Programming**: Curry, compose, pipe, partial application
- **Cache**: LRU, FIFO cache implementations
- **Audio Processing**: Audio utilities and helpers
- **Monitoring**: Performance monitoring utilities
- **Tracing**: Distributed tracing support

## Installation

```bash
pnpm add @toolkit-house/ts-utils
```

## Quick Start

### RequestPool

Control concurrent HTTP requests:

```typescript
import { RequestPool } from '@toolkit-house/ts-utils/net'

const pool = new RequestPool(3) // Max 3 concurrent requests

const urls = [
  'https://api.example.com/1',
  'https://api.example.com/2',
  'https://api.example.com/3',
]

const results = await Promise.all(
  urls.map(url => pool.add(() => fetch(url)))
)
```

### String Similarity

Calculate string similarity:

```typescript
import { levenshtein, jaroWinkler } from '@toolkit-house/ts-utils/string'

const distance = levenshtein('kitten', 'sitting') // 3
const similarity = jaroWinkler('hello', 'hallo') // 0.89
```

### Array Operations

```typescript
import { chunk, unique, intersection } from '@toolkit-house/ts-utils/array'

chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
unique([1, 1, 2, 2, 3]) // [1, 2, 3]
intersection([1, 2, 3], [2, 3, 4]) // [2, 3]
```

### LRU Cache

```typescript
import { LRUCache } from '@toolkit-house/ts-utils/cache'

const cache = new LRUCache<string, number>(100)

cache.set('key', 42)
cache.get('key') // 42
cache.has('key') // true
cache.delete('key')
```

## Module Exports

### Main Export

```typescript
import {
  // Network
  RequestPool,

  // String
  levenshtein,
  jaroWinkler,
  fuzzyMatch,

  // Array
  chunk,
  flatten,
  unique,

  // Object
  pick,
  omit,
  merge,
  deepClone,

  // Date
  format,
  parse,
  addDays,

  // Cache
  LRUCache,
  FIFOCache,

  // Sorting
  quickSort,
  mergeSort,

  // Searching
  binarySearch,

  // Graph
  bfs,
  dfs,

  // Data Structures
  Trie,
  Stack,
  Queue,
  LinkedList,

  // Functional
  curry,
  compose,
  pipe,
} from '@toolkit-house/ts-utils'
```

### Sub-exports

```typescript
// Network utilities
import { RequestPool } from '@toolkit-house/ts-utils/net'

// String utilities
import { levenshtein } from '@toolkit-house/ts-utils/string'

// Array utilities
import { chunk } from '@toolkit-house/ts-utils/array'

// Object utilities
import { pick } from '@toolkit-house/ts-utils/object'

// Date utilities
import { format } from '@toolkit-house/ts-utils/date'

// Validation helpers
import { isEmail, isURL } from '@toolkit-house/ts-utils/validation'

// Data transformation
import { camelCase, kebabCase, snakeCase } from '@toolkit-house/ts-utils/transform'

// Sorting algorithms
import { quickSort } from '@toolkit-house/ts-utils/sorting'

// Search algorithms
import { binarySearch } from '@toolkit-house/ts-utils/searching'

// Graph algorithms
import { bfs, dfs } from '@toolkit-house/ts-utils/graph'

// Dynamic programming
import { fibonacci, lcs } from '@toolkit-house/ts-utils/dynamic-programming'

// Data structures
import { Trie, Stack, Queue } from '@toolkit-house/ts-utils/data-structures'

// Functional programming
import { curry, compose } from '@toolkit-house/ts-utils/functional'

// Cache implementations
import { LRUCache } from '@toolkit-house/ts-utils/cache'
```

## Development

```bash
# Run with unbuild stub
pnpm run dev

# Build
pnpm run build

# Run tests
pnpm run test

# Run benchmarks
pnpm run test:bench

# Type check
pnpm run typecheck

# Lint
pnpm run lint
```

## Documentation

Full API documentation: [/api/ts-utils](/api/ts-utils)

## License

MIT
