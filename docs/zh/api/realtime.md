---
---

<!-- <div v-pre> -->
# @toolkit-house/realtime API 参考

Toolkit House 实时通信工具 - 使用 WebSocket。

## 安装

```bash
pnpm add @toolkit-house/realtime
```

## 核心 API

### EventBus

用于本地事件处理的内存事件总线。

#### 构造函数

```typescript
new EventBus()
```

---

#### `on(event: string, handler: EventHandler): () => void`

订阅事件。

**参数：**
- `event` - 要监听的事件名称
- `handler` - 事件处理函数

**返回值：** 取消订阅函数

**示例：**

```typescript
import { defaultEventBus } from '@toolkit-house/realtime'

const unsubscribe = defaultEventBus.on('user:joined', (data) => {
  console.log('用户加入：', data)
})

// 之后...
unsubscribe()
```

---

#### `emit(event: string, data?: unknown): void`

向所有订阅者发出事件。

**参数：**
- `event` - 要发出的事件名称
- `data` - 可选的传递给处理函数的数据

**示例：**

```typescript
defaultEventBus.emit('user:joined', { userId: 123, username: 'alice' })
```

---

#### `off(event: string, handler?: EventHandler): void`

取消订阅事件。

**参数：**
- `event` - 事件名称
- `handler` - 可选的特定处理函数（如未指定则删除所有处理函数）

**示例：**

```typescript
// 删除事件的所有处理函数
defaultEventBus.off('user:joined')

// 删除特定处理函数
defaultEventBus.off('user:joined', specificHandler)
```

---

#### `once(event: string, handler: EventHandler): void`

订阅仅触发一次的事件。

**参数：**
- `event` - 事件名称
- `handler` - 事件处理函数

**示例：**

```typescript
defaultEventBus.once('init', () => {
  console.log('已初始化！')
})
```

---

#### `clear(): void`

删除所有事件监听器。

**示例：**

```typescript
defaultEventBus.clear()
```

---

### RealtimeServer

具有客户端管理的 WebSocket 服务器。

#### 构造函数

```typescript
new RealtimeServer(config?: WebSocketServerConfig)
```

**配置选项：**

```typescript
interface WebSocketServerConfig {
  path?: string                 // WebSocket 路径（默认：'/ws'）
  heartbeatInterval?: number     // 心跳间隔，单位毫秒（默认：30000）
  eventBus?: EventBus            // 可选的 EventBus 用于集成
}
```

---

#### `attach(server: http.Server): void`

附加到 HTTP 服务器。

**参数：**
- `server` - HTTP 服务器实例

**示例：**

```typescript
import { createServer } from 'http'
import { RealtimeServer } from '@toolkit-house/realtime'

const httpServer = createServer()
const wsServer = new RealtimeServer()

wsServer.attach(httpServer)
httpServer.listen(3000)
```

---

#### `broadcast(message: WSMessage): void`

向所有连接的客户端发送消息。

**参数：**
- `message` - 要广播的消息对象

**示例：**

```typescript
wsServer.broadcast({
  type: 'notification',
  data: { message: '大家好！' }
})
```

---

#### `send(clientId: string, message: WSMessage): void`

向特定客户端发送消息。

**参数：**
- `clientId` - 要发送到的客户端 ID
- `message` - 消息对象

**示例：**

```typescript
wsServer.send('client-123', {
  type: 'private-message',
  data: { text: '你好！' }
})
```

---

#### `getClient(clientId: string): ClientInfo | undefined`

获取已连接客户端的信息。

**参数：**
- `clientId` - 客户端 ID

**返回值：** 客户端信息对象或 undefined

```typescript
interface ClientInfo {
  id: string
  address: string
  connectedAt: Date
}
```

---

#### `getClients(): ClientInfo[]`

获取所有已连接的客户端。

**返回值：** 客户端信息对象数组

**示例：**

```typescript
const clients = wsServer.getClients()
console.log('已连接的客户端：', clients.length)
```

---

#### `close(clientId?: string): void`

关闭连接。

**参数：**
- `clientId` - 可选的客户端 ID（如未指定则关闭所有连接）

**示例：**

```typescript
// 关闭特定客户端
wsServer.close('client-123')

// 关闭所有客户端
wsServer.close()
```

---

## 事件

### `connection`

新客户端连接时发出。

```typescript
wsServer.on('connection', (client: ClientInfo) => {
  console.log('客户端已连接：', client.id)
  // client.id, client.address, client.connectedAt
})
```

---

### `disconnection`

客户端断开连接时发出。

```typescript
wsServer.on('disconnection', (clientId: string) => {
  console.log('客户端已断开：', clientId)
})
```

---

### `message`

从客户端收到消息时发出。

```typescript
wsServer.on('message', (clientId: string, message: WSMessage) => {
  console.log('来自', clientId, '的消息：', message)
})
```

---

## 单例实例

### `defaultEventBus`

预配置的 EventBus 单例实例。

```typescript
import { defaultEventBus } from '@toolkit-house/realtime'

defaultEventBus.emit('event', { data: 'value' })
```

---

## 辅助函数

### `createWebSocketServer(httpServer: http.Server, config?: WebSocketServerConfig): RealtimeServer`

一步创建并附加 WebSocket 服务器。

**参数：**
- `httpServer` - HTTP 服务器实例
- `config` - 可选配置

**返回值：** RealtimeServer 实例

**示例：**

```typescript
import { createServer } from 'http'
import { createWebSocketServer } from '@toolkit-house/realtime'

const httpServer = createServer()
const wsServer = createWebSocketServer(httpServer, {
  path: '/ws',
  heartbeatInterval: 30000,
})

httpServer.listen(3000)
```

---

## 类型定义

### EventHandler

```typescript
type EventHandler = (data?: unknown) => void
```

### WSMessage

```typescript
interface WSMessage {
  type: string
  data?: unknown
  id?: string
}
```

### ClientInfo

```typescript
interface ClientInfo {
  id: string
  address: string
  connectedAt: Date
}
```

### WebSocketServerConfig

```typescript
interface WebSocketServerConfig {
  path?: string
  heartbeatInterval?: number
  eventBus?: EventBus
}
```

---

## 使用示例

### 基本事件总线

```typescript
import { defaultEventBus } from '@toolkit-house/realtime'

// 订阅事件
defaultEventBus.on('user:joined', (data) => {
  console.log('用户加入：', data)
})

// 发出事件
defaultEventBus.emit('user:joined', { userId: 123, username: 'alice' })
```

### WebSocket 服务器

```typescript
import { createWebSocketServer } from '@toolkit-house/realtime'
import { httpServer } from './your-http-server'

const wsServer = createWebSocketServer(httpServer, {
  path: '/ws',
  heartbeatInterval: 30000,
})

wsServer.on('connection', (client) => {
  client.send({ type: 'welcome', data: { message: '已连接！' } })

  client.on('message', (message) => {
    wsServer.broadcast(message)
  })
})
```

### 事件总线 + WebSocket 集成

```typescript
import { EventBus, RealtimeServer } from '@toolkit-house/realtime'

const eventBus = new EventBus()
const wsServer = new RealtimeServer({ eventBus })

// 将事件桥接到 WebSocket 客户端
eventBus.on('notification', (data) => {
  wsServer.broadcast({
    type: 'notification',
    data,
  })
})

// WebSocket 消息可以触发事件
wsServer.on('connection', (client) => {
  client.on('message', (message) => {
    eventBus.emit(message.type, message.data)
  })
})
```

---

## 依赖

- `ws` (^8.16.0) - WebSocket 库

---

## 模块导出

```typescript
// 事件总线
import {
  EventBus,
  defaultEventBus,
  type EventHandler
} from '@toolkit-house/realtime'

// WebSocket 服务器
import {
  RealtimeServer,
  createWebSocketServer,
  type WebSocketServerConfig,
  type WSMessage,
  type ClientInfo
} from '@toolkit-house/realtime'
```

---

## 相关文档

- [包指南](/packages/realtime) - 使用指南和示例
- [GitHub 仓库](https://github.com/your-org/toolkit-house) - 源代码
<!-- </div> -->
