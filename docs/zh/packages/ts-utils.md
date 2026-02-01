# @toolkit-house/ts-utils

综合性 TypeScript 工具库。

## 功能

- **网络工具**: RequestPool 并发控制
- **字符串工具**: 相似度、匹配、格式化
- **数组操作**: 分块、扁平化、去重
- **对象工具**: 选择、省略、合并
- **日期工具**: 格式化、解析、操作
- **缓存**: LRU、FIFO 缓存
- **排序**: 快速排序、归并排序
- **搜索**: 二分查找
- **图算法**: BFS、DFS、Dijkstra
- **数据结构**: Trie、Tree、Stack、Queue

## 安装

```bash
pnpm add @toolkit-house/ts-utils
```

## 使用示例

### RequestPool

```ts
import { RequestPool } from '@toolkit-house/ts-utils/net'

const pool = new RequestPool(3)
const results = await Promise.all(
  urls.map(url => pool.add(() => fetch(url)))
)
)
```

### 字符串相似度

```ts
import { levenshtein } from '@toolkit-house/ts-utils/string'

const distance = levenshtein('kitten', 'sitting') // 3
```

### LRU 缓存

```ts
import { LRUCache } from '@toolkit-house/ts-utils/cache'

const cache = new LRUCache<string, number>(100)
cache.set('key', 42)
cache.get('key') // 42
```
