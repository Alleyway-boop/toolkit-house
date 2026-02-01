# @toolkit-house/ts-utils API Reference

Comprehensive TypeScript utility library for Toolkit House.

## Installation

```bash
pnpm add @toolkit-house/ts-utils
```

## Modules

### Network Utilities

#### RequestPool

Control concurrent requests with a pool.

```typescript
import { RequestPool } from '@toolkit-house/ts-utils/net'

const pool = new RequestPool(3) // Max 3 concurrent requests

// Add requests to the pool
const result = await pool.add(() => fetch(url))
const results = await Promise.all(
  urls.map(url => pool.add(() => fetch(url)))
)
```

**Constructor:**
- `new RequestPool(maxConcurrent: number)` - Create a pool with max concurrent requests

**Methods:**
- `add<T>(fn: () => Promise<T>): Promise<T>` - Add a request to the pool
- `clear(): void` - Clear the queue

---

### String Utilities

#### Similarity

```typescript
import { levenshtein, jaroWinkler } from '@toolkit-house/ts-utils/string'

const distance = levenshtein('kitten', 'sitting') // 3
const similarity = jaroWinkler('hello', 'hallo') // 0.89
```

**Functions:**
- `levenshtein(a: string, b: string): number` - Calculate edit distance
- `jaroWinkler(a: string, b: string): number` - Calculate Jaro-Winkler similarity
- `hamming(a: string, b: string): number` - Calculate Hamming distance
- `soundex(str: string): string` - Calculate Soundex phonetic code

#### Matching

```typescript
import { fuzzyMatch, wildCardMatch } from '@toolkit-house/ts-utils/string'

fuzzyMatch('hello world', 'hld') // true
wildCardMatch('file.txt', '*.txt') // true
```

**Functions:**
- `fuzzyMatch(text: string, pattern: string): boolean` - Fuzzy string matching
- `wildCardMatch(text: string, pattern: string): boolean` - Wildcard matching
- `contains(text: string, substring: string): boolean` - Case-insensitive contains

---

### Array Utilities

```typescript
import {
  chunk,
  flatten,
  unique,
  difference,
  intersection
} from '@toolkit-house/ts-utils/array'

chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
flatten([[1, 2], [3, 4]]) // [1, 2, 3, 4]
unique([1, 1, 2, 2, 3]) // [1, 2, 3]
difference([1, 2, 3], [2, 3, 4]) // [1]
intersection([1, 2, 3], [2, 3, 4]) // [2, 3]
```

**Functions:**
- `chunk<T>(arr: T[], size: number): T[][]` - Split array into chunks
- `flatten<T>(arr: T[][]): T[]` - Flatten nested arrays
- `unique<T>(arr: T[]): T[]` - Remove duplicates
- `difference<T>(a: T[], b: T[]): T[]` - Array difference
- `intersection<T>(a: T[], b: T[]): T[]` - Array intersection
- `groupBy<T>(arr: T[], fn: (item: T) => string): Record<string, T[]>` - Group by key
- `partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]]` - Partition array

---

### Object Utilities

```typescript
import {
  pick,
  omit,
  merge,
  deepClone,
  get,
  set
} from '@toolkit-house/ts-utils/object'

pick({ a: 1, b: 2, c: 3 }, ['a', 'b']) // { a: 1, b: 2 }
omit({ a: 1, b: 2, c: 3 }, ['b']) // { a: 1, c: 3 }
merge({ a: 1 }, { b: 2 }) // { a: 1, b: 2 }
deepClone({ a: { b: 1 } }) // { a: { b: 1 } }
get({ a: { b: { c: 1 } } }, 'a.b.c') // 1
set({}, 'a.b.c', 1) // { a: { b: { c: 1 } } }
```

**Functions:**
- `pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>` - Pick keys
- `omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>` - Omit keys
- `merge<T>(...objs: Partial<T>[]): T` - Deep merge objects
- `deepClone<T>(obj: T): T` - Deep clone object
- `get<T>(obj: any, path: string): T` - Get nested value
- `set(obj: any, path: string, value: any): void` - Set nested value
- `has(obj: any, path: string): boolean` - Check if path exists

---

### Date Utilities

```typescript
import {
  format,
  parse,
  addDays,
  diffDays,
  isValid
} from '@toolkit-house/ts-utils/date'

format(new Date(), 'YYYY-MM-DD') // '2024-01-15'
parse('2024-01-15', 'YYYY-MM-DD') // Date
addDays(new Date(), 7) // Date + 7 days
diffDays(date1, date2) // Number of days difference
isValid(new Date()) // true
```

**Functions:**
- `format(date: Date, format: string): string` - Format date
- `parse(str: string, format: string): Date` - Parse date string
- `addDays(date: Date, days: number): Date` - Add days
- `addMonths(date: Date, months: number): Date` - Add months
- `diffDays(a: Date, b: Date): number` - Difference in days
- `isValid(date: Date): boolean` - Check if valid date
- `now(): Date` - Current date (timezone aware)
- `toISOString(date: Date): string` - ISO 8601 string

---

### Cache Utilities

#### LRUCache

Least Recently Used cache implementation.

```typescript
import { LRUCache } from '@toolkit-house/ts-utils/cache'

const cache = new LRUCache<string, number>(100) // Max 100 entries

cache.set('key', 42)
cache.get('key') // 42
cache.has('key') // true
cache.delete('key')
cache.clear()
```

**Constructor:**
- `new LRUCache<K, V>(maxSize: number)` - Create LRU cache

**Methods:**
- `set(key: K, value: V): void` - Set value
- `get(key: K): V | undefined` - Get value
- `has(key: K): boolean` - Check if key exists
- `delete(key: K): boolean` - Delete key
- `clear(): void` - Clear all entries
- `size: number` - Current size

---

### Sorting Algorithms

```typescript
import {
  quickSort,
  mergeSort,
  heapSort,
  bubbleSort
} from '@toolkit-house/ts-utils/sorting'

quickSort([3, 1, 2]) // [1, 2, 3]
mergeSort([3, 1, 2]) // [1, 2, 3]
heapSort([3, 1, 2]) // [1, 2, 3]
bubbleSort([3, 1, 2]) // [1, 2, 3]
```

**Functions:**
- `quickSort<T>(arr: T[], compare?: (a: T, b: T) => number): T[]` - Quick sort
- `mergeSort<T>(arr: T[], compare?: (a: T, b: T) => number): T[]` - Merge sort
- `heapSort<T>(arr: T[], compare?: (a: T, b: T) => number): T[]` - Heap sort
- `bubbleSort<T>(arr: T[], compare?: (a: T, b: T) => number): T[]` - Bubble sort

---

### Searching Algorithms

```typescript
import {
  binarySearch,
  interpolationSearch
} from '@toolkit-house/ts-utils/searching'

binarySearch([1, 2, 3, 4, 5], 3) // 2
interpolationSearch([1, 2, 3, 4, 5], 3) // 2
```

**Functions:**
- `binarySearch<T>(arr: T[], target: T): number` - Binary search
- `interpolationSearch<T>(arr: T[], target: T): number` - Interpolation search

---

### Graph Algorithms

```typescript
import {
  bfs,
  dfs,
  dijkstra,
  topologicalSort
} from '@toolkit-house/ts-utils/graph'

const graph = {
  A: ['B', 'C'],
  B: ['D'],
  C: ['D'],
  D: []
}

bfs(graph, 'A') // ['A', 'B', 'C', 'D']
dfs(graph, 'A') // ['A', 'B', 'D', 'C']
```

**Functions:**
- `bfs(graph: Graph, start: string): string[]` - Breadth-first search
- `dfs(graph: Graph, start: string): string[]` - Depth-first search
- `dijkstra(graph: WeightedGraph, start: string): Record<string, number>` - Dijkstra's algorithm
- `topologicalSort(graph: Graph): string[]` - Topological sort

---

### Data Structures

#### Trie

Prefix tree for string operations.

```typescript
import { Trie } from '@toolkit-house/ts-utils/data-structures'

const trie = new Trie()
trie.insert('hello')
trie.insert('world')

trie.search('hello') // true
trie.startsWith('he') // true
```

#### Stack

```typescript
import { Stack } from '@toolkit-house/ts-utils/data-structures'

const stack = new Stack<number>()
stack.push(1)
stack.push(2)
stack.pop() // 2
stack.peek() // 1
stack.isEmpty() // false
```

#### Queue

```typescript
import { Queue } from '@toolkit-house/ts-utils/data-structures'

const queue = new Queue<number>()
queue.enqueue(1)
queue.enqueue(2)
queue.dequeue() // 1
queue.peek() // 2
queue.isEmpty() // false
```

---

### Functional Programming

```typescript
import {
  curry,
  compose,
  pipe,
  partial
} from '@toolkit-house/ts-utils/functional'

const add = (a: number, b: number) => a + b
const add5 = curry(add)(5)
add5(3) // 8

const composed = compose(
  (x: number) => x * 2,
  (x: number) => x + 1
)
composed(3) // 8

const piped = pipe(
  (x: number) => x + 1,
  (x: number) => x * 2
)
piped(3) // 8
```

**Functions:**
- `curry(fn: Function): Function` - Curry function
- `compose(...fns: Function[]): Function` - Compose functions (right to left)
- `pipe(...fns: Function[]): Function` - Pipe functions (left to right)
- `partial(fn: Function, ...args: any[]): Function` - Partial application

---

## License

MIT
