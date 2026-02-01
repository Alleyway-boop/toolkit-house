# @toolkit-house/realtime

Real-time communication utilities for Toolkit House using WebSocket.

## Features

- **Event Bus** - In-memory event broadcasting and subscription
- **WebSocket Server** - Easy WebSocket server creation
- **Client Management** - Automatic client connection tracking
- **Broadcasting** - Send messages to all connected clients
- **Typed Events** - Full TypeScript support for event types

## Installation

```bash
pnpm add @toolkit-house/realtime
```

## Quick Start

### Event Bus

```typescript
import { EventBus, defaultEventBus } from '@toolkit-house/realtime'

// Subscribe to events
defaultEventBus.on('user:joined', (data) => {
  console.log('User joined:', data)
})

// Emit events
defaultEventBus.emit('user:joined', { userId: 123, username: 'alice' })

// Unsubscribe
const unsubscribe = defaultEventBus.on('message', (data) => {
  console.log('Message:', data)
})

// Later...
unsubscribe()
```

### WebSocket Server

```typescript
import { RealtimeServer, createWebSocketServer } from '@toolkit-house/realtime'
import { httpServer } from './your-http-server'

// Create a WebSocket server
const wsServer = createWebSocketServer(httpServer, {
  path: '/ws',
  heartbeatInterval: 30000,
})

// Handle connections
wsServer.on('connection', (client) => {
  console.log('Client connected:', client.id)

  // Send message to client
  client.send({ type: 'welcome', data: { message: 'Connected!' } })

  // Handle client messages
  client.on('message', (message) => {
    console.log('Received:', message)

    // Broadcast to all clients
    wsServer.broadcast(message)
  })

  // Handle disconnection
  client.on('close', () => {
    console.log('Client disconnected:', client.id)
  })
})
```

### Integration with Event Bus

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

## API Reference

### EventBus

In-memory event bus for local event handling.

#### Constructor

```typescript
new EventBus()
```

#### Methods

##### `on(event: string, handler: EventHandler): () => void`

Subscribe to an event.

**Returns:** Unsubscribe function

##### `emit(event: string, data?: unknown): void`

Emit an event to all subscribers.

##### `off(event: string, handler?: EventHandler): void`

Unsubscribe from an event (all handlers if no handler specified).

##### `once(event: string, handler: EventHandler): void`

Subscribe to an event that fires only once.

##### `clear(): void`

Remove all event listeners.

### RealtimeServer

WebSocket server with client management.

#### Constructor

```typescript
new RealtimeServer(config?: WebSocketServerConfig)
```

**Options:**
- `path` - WebSocket path (default: '/ws')
- `heartbeatInterval` - Heartbeat interval in ms (default: 30000)
- `eventBus` - Optional EventBus for integration

#### Methods

##### `attach(server: http.Server): void`

Attach to an HTTP server.

##### `broadcast(message: WSMessage): void`

Send a message to all connected clients.

##### `send(clientId: string, message: WSMessage): void`

Send a message to a specific client.

##### `getClient(clientId: string): ClientInfo | undefined`

Get information about a connected client.

##### `getClients(): ClientInfo[]`

Get all connected clients.

##### `close(clientId?: string): void`

Close connection(s). If no clientId provided, closes all connections.

#### Events

##### `connection`

Emitted when a new client connects.

```typescript
wsServer.on('connection', (client: ClientInfo) => {
  // client.id, client.address, client.connectedAt
})
```

##### `disconnection`

Emitted when a client disconnects.

```typescript
wsServer.on('disconnection', (clientId: string) => {
  // Handle disconnection
})
```

##### `message`

Emitted when a message is received from a client.

```typescript
wsServer.on('message', (clientId: string, message: WSMessage) => {
  // Handle message
})
```

### Types

```typescript
// Event handler type
type EventHandler = (data?: unknown) => void

// WebSocket message structure
interface WSMessage {
  type: string
  data?: unknown
  id?: string
}

// Client information
interface ClientInfo {
  id: string
  address: string
  connectedAt: Date
}

// WebSocket server configuration
interface WebSocketServerConfig {
  path?: string
  heartbeatInterval?: number
  eventBus?: EventBus
}
```

## Module Exports

```typescript
// Event bus
import {
  EventBus,
  defaultEventBus,
  type Event,
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

## Dependencies

- `ws` (^8.16.0) - WebSocket library

## Development

```bash
pnpm run dev              # Run with unbuild stub
pnpm run build            # Build with unbuild
pnpm run test             # Run tests with vitest
pnpm run typecheck        # Type check with TypeScript
```

## License

MIT
