# @toolkit-house/realtime API Reference

Real-time communication utilities for Toolkit House using WebSocket.

## Installation

```bash
pnpm add @toolkit-house/realtime
```

## Core API

### EventBus

In-memory event bus for local event handling.

#### Constructor

```typescript
new EventBus()
```

---

#### `on(event: string, handler: EventHandler): () => void`

Subscribe to an event.

**Parameters:**
- `event` - Event name to listen for
- `handler` - Event handler function

**Returns:** Unsubscribe function

**Example:**

```typescript
import { defaultEventBus } from '@toolkit-house/realtime'

const unsubscribe = defaultEventBus.on('user:joined', (data) => {
  console.log('User joined:', data)
})

// Later...
unsubscribe()
```

---

#### `emit(event: string, data?: unknown): void`

Emit an event to all subscribers.

**Parameters:**
- `event` - Event name to emit
- `data` - Optional data to pass to handlers

**Example:**

```typescript
defaultEventBus.emit('user:joined', { userId: 123, username: 'alice' })
```

---

#### `off(event: string, handler?: EventHandler): void`

Unsubscribe from an event.

**Parameters:**
- `event` - Event name
- `handler` - Optional specific handler to remove (removes all if not specified)

**Example:**

```typescript
// Remove all handlers for an event
defaultEventBus.off('user:joined')

// Remove specific handler
defaultEventBus.off('user:joined', specificHandler)
```

---

#### `once(event: string, handler: EventHandler): void`

Subscribe to an event that fires only once.

**Parameters:**
- `event` - Event name
- `handler` - Event handler function

**Example:**

```typescript
defaultEventBus.once('init', () => {
  console.log('Initialized!')
})
```

---

#### `clear(): void`

Remove all event listeners.

**Example:**

```typescript
defaultEventBus.clear()
```

---

### RealtimeServer

WebSocket server with client management.

#### Constructor

```typescript
new RealtimeServer(config?: WebSocketServerConfig)
```

**Configuration Options:**

```typescript
interface WebSocketServerConfig {
  path?: string                 // WebSocket path (default: '/ws')
  heartbeatInterval?: number     // Heartbeat interval in ms (default: 30000)
  eventBus?: EventBus            // Optional EventBus for integration
}
```

---

#### `attach(server: http.Server): void`

Attach to an HTTP server.

**Parameters:**
- `server` - HTTP server instance

**Example:**

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

Send a message to all connected clients.

**Parameters:**
- `message` - Message object to broadcast

**Example:**

```typescript
wsServer.broadcast({
  type: 'notification',
  data: { message: 'Hello everyone!' }
})
```

---

#### `send(clientId: string, message: WSMessage): void`

Send a message to a specific client.

**Parameters:**
- `clientId` - Client ID to send to
- `message` - Message object

**Example:**

```typescript
wsServer.send('client-123', {
  type: 'private-message',
  data: { text: 'Hello!' }
})
```

---

#### `getClient(clientId: string): ClientInfo | undefined`

Get information about a connected client.

**Parameters:**
- `clientId` - Client ID

**Returns:** Client info object or undefined

```typescript
interface ClientInfo {
  id: string
  address: string
  connectedAt: Date
}
```

---

#### `getClients(): ClientInfo[]`

Get all connected clients.

**Returns:** Array of client info objects

**Example:**

```typescript
const clients = wsServer.getClients()
console.log('Connected clients:', clients.length)
```

---

#### `close(clientId?: string): void`

Close connection(s).

**Parameters:**
- `clientId` - Optional client ID (closes all if not specified)

**Example:**

```typescript
// Close specific client
wsServer.close('client-123')

// Close all clients
wsServer.close()
```

---

## Events

### `connection`

Emitted when a new client connects.

```typescript
wsServer.on('connection', (client: ClientInfo) => {
  console.log('Client connected:', client.id)
  // client.id, client.address, client.connectedAt
})
```

---

### `disconnection`

Emitted when a client disconnects.

```typescript
wsServer.on('disconnection', (clientId: string) => {
  console.log('Client disconnected:', clientId)
})
```

---

### `message`

Emitted when a message is received from a client.

```typescript
wsServer.on('message', (clientId: string, message: WSMessage) => {
  console.log('Message from', clientId, ':', message)
})
```

---

## Singleton Instances

### `defaultEventBus`

Pre-configured singleton instance of EventBus.

```typescript
import { defaultEventBus } from '@toolkit-house/realtime'

defaultEventBus.emit('event', { data: 'value' })
```

---

## Helper Functions

### `createWebSocketServer(httpServer: http.Server, config?: WebSocketServerConfig): RealtimeServer`

Create and attach a WebSocket server in one step.

**Parameters:**
- `httpServer` - HTTP server instance
- `config` - Optional configuration

**Returns:** RealtimeServer instance

**Example:**

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

## Type Definitions

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

## Usage Examples

### Basic Event Bus

```typescript
import { defaultEventBus } from '@toolkit-house/realtime'

// Subscribe to events
defaultEventBus.on('user:joined', (data) => {
  console.log('User joined:', data)
})

// Emit events
defaultEventBus.emit('user:joined', { userId: 123, username: 'alice' })
```

### WebSocket Server

```typescript
import { createWebSocketServer } from '@toolkit-house/realtime'
import { httpServer } from './your-http-server'

const wsServer = createWebSocketServer(httpServer, {
  path: '/ws',
  heartbeatInterval: 30000,
})

wsServer.on('connection', (client) => {
  client.send({ type: 'welcome', data: { message: 'Connected!' } })

  client.on('message', (message) => {
    wsServer.broadcast(message)
  })
})
```

### Event Bus + WebSocket Integration

```typescript
import { EventBus, RealtimeServer } from '@toolkit-house/realtime'

const eventBus = new EventBus()
const wsServer = new RealtimeServer({ eventBus })

// Bridge events to WebSocket clients
eventBus.on('notification', (data) => {
  wsServer.broadcast({
    type: 'notification',
    data,
  })
})

// WebSocket messages can trigger events
wsServer.on('connection', (client) => {
  client.on('message', (message) => {
    eventBus.emit(message.type, message.data)
  })
})
```

---

## Dependencies

- `ws` (^8.16.0) - WebSocket library

---

## Module Exports

```typescript
// Event bus
import {
  EventBus,
  defaultEventBus,
  type EventHandler
} from '@toolkit-house/realtime'

// WebSocket server
import {
  RealtimeServer,
  createWebSocketServer,
  type WebSocketServerConfig,
  type WSMessage,
  type ClientInfo
} from '@toolkit-house/realtime'
```

---

## See Also

- [Package Guide](/packages/realtime) - Usage guide and examples
- [GitHub Repository](https://github.com/your-org/toolkit-house) - Source code
