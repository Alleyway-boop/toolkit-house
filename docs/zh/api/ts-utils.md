---
---

<!-- <div v-pre> -->
# @toolkit-house/ts-utils API 参考

Toolkit House 的综合 TypeScript 工具库。

## 安装

```bash
pnpm add @toolkit-house/ts-utils
```

## 模块

### 网络工具

#### RequestPool

使用请求池控制并发请求。

```typescript
import { RequestPool } from '@toolkit-house/ts-utils/net'

const pool = new RequestPool(3) // 最多 3 个并发请求

// 将请求添加到池中
const result = await pool.add(() => fetch(url))
const results = await Promise.all(
  urls.map(url => pool.add(() => fetch(url)))
)
```

**构造函数：**
- `new RequestPool(maxConcurrent: number)` - 创建具有最大并发请求数的池

**方法：**
- `add<T>(fn: () => Promise<T>): Promise<T>` - 将请求添加到池中
- `clear(): void` - 清空队列

---

### 字符串工具

#### 相似度

```typescript
import { levenshtein, jaroWinkler } from '@toolkit-house/ts-utils/string'

const distance = levenshtein('kitten', 'sitting') // 3
const similarity = jaroWinkler('hello', 'hallo') // 0.89
```

**函数：**
- `levenshtein(a: string, b: string): number` - 计算编辑距离
- `jaroWinkler(a: string, b: string): number` - 计算 Jaro-Winkler 相似度
- `hamming(a: string, b: string): number` - 计算汉明距离
- `soundex(str: string): string` - 计算 Soundex 语音代码

#### 匹配

```typescript
import { fuzzyMatch, wildCardMatch } from '@toolkit-house/ts-utils/string'

fuzzyMatch('hello world', 'hld') // true
wildCardMatch('file.txt', '*.txt') // true
```

**函数：**
- `fuzzyMatch(text: string, pattern: string): boolean` - 模糊字符串匹配
- `wildCardMatch(text: string, pattern: string): boolean` - 通配符匹配
- `contains(text: string, substring: string): boolean` - 不区分大小写包含

---

### 数组工具

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

**函数：**
- `chunk<T>(arr: T[], size: number): T[][]` - 将数组分割成块
- `flatten<T>(arr: T[][]): T[]` - 展平嵌套数组
- `unique<T>(arr: T[]): T[]` - 去除重复项
- `difference<T>(a: T[], b: T[]): T[]` - 数组差集
- `intersection<T>(a: T[], b: T[]): T[]` - 数组交集
- `groupBy<T>(arr: T[], fn: (item: T) => string): Record<string, T[]>` - 按键分组
- `partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]]` - 分割数组

---

### 对象工具

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

**函数：**
- `pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>` - 选择键
- `omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>` - 省略键
- `merge<T>(...objs: Partial<T>[]): T` - 深度合并对象
- `deepClone<T>(obj: T): T` - 深度克隆对象
- `get<T>(obj: any, path: string): T` - 获取嵌套值
- `set(obj: any, path: string, value: any): void` - 设置嵌套值
- `has(obj: any, path: string): boolean` - 检查路径是否存在

---

### 日期工具

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
addDays(new Date(), 7) // Date + 7 天
diffDays(date1, date2) // 天数差值
isValid(new Date()) // true
```

**函数：**
- `format(date: Date, format: string): string` - 格式化日期
- `parse(str: string, format: string): Date` - 解析日期字符串
- `addDays(date: Date, days: number): Date` - 添加天数
- `addMonths(date: Date, months: number): Date` - 添加月份
- `diffDays(a: Date, b: Date): number` - 天数差值
- `isValid(date: Date): boolean` - 检查日期是否有效
- `now(): Date` - 当前日期（时区感知）
- `toISOString(date: Date): string` - ISO 8601 字符串

---

### 缓存工具

#### LRUCache

最近最少使用缓存实现。

```typescript
import { LRUCache } from '@toolkit-house/ts-utils/cache'

const cache = new LRUCache<string, number>(100) // 最多 100 条

cache.set('key', 42)
cache.get('key') // 42
cache.has('key') // true
cache.delete('key')
cache.clear()
```

**构造函数：**
- `new LRUCache<K, V>(maxSize: number)` - 创建 LRU 缓存

**方法：**
- `set(key: K, value: V): void` - 设置值
- `get(key: K): V | undefined` - 获取值
- `has(key: K): boolean` - 检查键是否存在
- `delete(key: K): boolean` - 删除键
- `clear(): void` - 清空所有条目
- `size: number` - 当前大小

---

### 排序算法

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

**函数：**
- `quickSort<T>(arr: T[], compare?: (a: T, b: T) => number): T[]` - 快速排序
- `mergeSort<T>(arr: T[], compare?: (a: T, b: T) => number): T[]` - 归并排序
- `heapSort<T>(arr: T[], compare?: (a: T, b: T) => number): T[]` - 堆排序
- `bubbleSort<T>(arr: T[], compare?: (a: T, b: T) => number): T[]` - 冒泡排序

---

### 搜索算法

```typescript
import {
  binarySearch,
  interpolationSearch
} from '@toolkit-house/ts-utils/searching'

binarySearch([1, 2, 3, 4, 5], 3) // 2
interpolationSearch([1, 2, 3, 4, 5], 3) // 2
```

**函数：**
- `binarySearch<T>(arr: T[], target: T): number` - 二分搜索
- `interpolationSearch<T>(arr: T[], target: T): number` - 插值搜索

---

### 图算法

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

**函数：**
- `bfs(graph: Graph, start: string): string[]` - 广度优先搜索
- `dfs(graph: Graph, start: string): string[]` - 深度优先搜索
- `dijkstra(graph: WeightedGraph, start: string): Record<string, number>` - Dijkstra 算法
- `topologicalSort(graph: Graph): string[]` - 拓扑排序

---

### 数据结构

#### Trie

用于字符串操作的前缀树。

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

### 函数式编程

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

**函数：**
- `curry(fn: Function): Function` - 柯里化函数
- `compose(...fns: Function[]): Function` - 组合函数（从右到左）
- `pipe(...fns: Function[]): Function` - 管道函数（从左到右）
- `partial(fn: Function, ...args: any[]): Function` - 部分应用

---

## 许可证

MIT
<!-- </div> -->
