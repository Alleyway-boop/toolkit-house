---
title: "@toolkit-house/realtime"
description: Real-time communication utilities for Toolkit House
chineseTitle: "@toolkit-house/realtime"
chineseDescription: Toolkit House实时通信工具
---

# @toolkit-house/realtime

Real-time communication utilities for Toolkit House.

## Introduction

`@toolkit-house/realtime` is a comprehensive real-time communication library built on top of WebSocket technology. It provides utilities for establishing real-time connections, managing WebSocket connections, handling events, and building real-time features like chat applications, live notifications, and data synchronization.

### What It Does
- Manages WebSocket connections
- Handles connection lifecycle events
- Provides event subscription and broadcasting
- Implements real-time messaging
- Supports connection status monitoring
- Handles connection recovery and reconnection

### When to Use It
- Chat applications
- Real-time notifications
- Live data updates
- Collaborative editing tools
- Real-time dashboards
- Multiplayer game features
- Live support systems

## Installation

```bash
pnpm add @toolkit-house/realtime
```

## Quick Start

```typescript
import { RealtimeClient, Event } from '@toolkit-house/realtime'

// Create a realtime client
const client = new RealtimeClient({
  url: 'ws://localhost:3000/ws',
  reconnectAttempts: 5,
  reconnectInterval: 3000
})

// Connect to the server
await client.connect()

// Subscribe to events
client.on('message', (event: Event) => {
  console.log('Received message:', event.payload)
})

// Send a message
client.send('chat', {
  text: 'Hello, world!',
  timestamp: Date.now()
})

// Disconnect
await client.disconnect()
```

## Key Features

### 1. Connection Management

```typescript
import { RealtimeClient } from '@toolkit-house/realtime'

// Create client with configuration
const client = new RealtimeClient({
  url: 'ws://localhost:3000/ws',
  protocols: ['chat'],
  reconnectAttempts: 5,
  reconnectInterval: 3000,
  connectionTimeout: 10000,
  pingInterval: 30000,
  pongTimeout: 5000
})

// Connection lifecycle handlers
client.on('connecting', () => {
  console.log('Connecting to server...')
})

client.on('connected', () => {
  console.log('Connected to server')
})

client.on('disconnected', () => {
  console.log('Disconnected from server')
})

client.on('reconnecting', (attempt: number) => {
  console.log(`Reconnecting... attempt ${attempt}`)
})

client.on('reconnected', () => {
  console.log('Reconnected to server')
})

client.on('error', (error: Error) => {
  console.error('Connection error:', error)
})
```

### 2. Event Handling

```typescript
import { RealtimeClient, Event } from '@toolkit-house/realtime'

const client = new RealtimeClient({ url: 'ws://localhost:3000/ws' })

// Subscribe to specific event types
client.on('chat.message', (event: Event) => {
  console.log('New message:', event.payload)
})

client.on('user.typing', (event: Event) => {
  console.log('User is typing:', event.payload.userId)
})

client.on('system.notification', (event: Event) => {
  console.log('System notification:', event.payload.message)
})

// Subscribe to all events
client.on('*', (event: Event) => {
  console.log('Received event:', event.type, event.payload)
})

// Unsubscribe from events
client.off('chat.message')
client.off('*', () => {
  console.log('Unsubscribed from all events')
})
```

### 3. Messaging

```typescript
import { RealtimeClient } from '@toolkit-house/realtime'

const client = new RealtimeClient({ url: 'ws://localhost:3000/ws' })

// Send simple message
client.send('chat.message', {
  text: 'Hello, world!',
  timestamp: Date.now()
})

// Send message to specific user
client.send('chat.private', {
  recipientId: 'user-123',
  text: 'Private message',
  timestamp: Date.now()
})

// Send broadcast message
client.send('chat.broadcast', {
  text: 'Broadcast message',
  timestamp: Date.now()
})

// Send with options
client.send('chat.message', {
  text: 'Message with options',
  timestamp: Date.now(),
  priority: 'high',
  metadata: {
    roomId: 'room-123'
  }
}, {
  compress: true,
  binary: false
})
```

### 4. Rooms and Channels

```typescript
import { RealtimeClient } from '@toolkit-house/realtime'

const client = new RealtimeClient({ url: 'ws://localhost:3000/ws' })

// Join a room
async function joinRoom(roomId: string) {
  await client.join(roomId)
  console.log(`Joined room: ${roomId}`)
}

// Leave a room
async function leaveRoom(roomId: string) {
  await client.leave(roomId)
  console.log(`Left room: ${roomId}`)
}

// Room-specific events
client.on('room.joined', (roomId: string) => {
  console.log(`Joined room: ${roomId}`)
})

client.on('room.left', (roomId: string) => {
  console.log(`Left room: ${roomId}`)
})

// Send message to room
async function sendToRoom(roomId: string, message: any) {
  await client.sendToRoom(roomId, 'chat.message', message)
}

// Room event handling
client.onRoom(roomId, 'chat.message', (event: any) => {
  console.log(`Message in room ${roomId}:`, event.payload)
})

// Leave all rooms
async function leaveAllRooms() {
  await client.leaveAll()
}
```

### 5. Connection State Management

```typescript
import { RealtimeClient, ConnectionState } from '@toolkit-house/realtime'

const client = new RealtimeClient({ url: 'ws://localhost:3000/ws' })

// Check connection state
function getConnectionStatus() {
  return client.state
}

// Connection state handlers
client.on('stateChanged', (oldState: ConnectionState, newState: ConnectionState) => {
  console.log(`Connection state changed: ${oldState} -> ${newState}`)
})

// Auto-reconnect configuration
client.configureReconnect({
  attempts: 10,
  interval: 5000,
  backoff: true,
  maxInterval: 30000
})

// Manual reconnection
async function manualReconnect() {
  await client.reconnect()
}

// Connection health check
function isHealthy() {
  return client.isHealthy()
}
```

### 6. Advanced Features

```typescript
import { RealtimeClient } from '@toolkit-house/realtime'

const client = new RealtimeClient({ url: 'ws://localhost:3000/ws' })

// Message queuing and retries
client.configureMessageQueue({
  maxQueueSize: 1000,
  retryAttempts: 3,
  retryInterval: 1000
})

// Compression
client.configureCompression({
  threshold: 1024, // Compress messages larger than 1KB
  algorithm: 'gzip'
})

// Binary data support
async function sendBinaryData(data: ArrayBuffer) {
  await client.send('binary.data', data, { binary: true })
}

// Message acknowledgment
client.send('important.message', { data: 'Important' }, {
  ack: true
}).then((ackEvent: any) => {
  console.log('Message acknowledged:', ackEvent)
})

// Connection authentication
async function authenticate(token: string) {
  await client.authenticate(token)
}
```

## Common Use Cases

### 1. Chat Application

```typescript
import { RealtimeClient } from '@toolkit-house/realtime'

class ChatApplication {
  private client: RealtimeClient
  private currentRoom: string | null = null

  constructor(userId: string) {
    this.client = new RealtimeClient({
      url: `ws://localhost:3000/ws?userId=${userId}`,
      reconnectAttempts: 5
    })

    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    // Connection events
    this.client.on('connected', () => {
      console.log('Connected to chat server')
    })

    this.client.on('disconnected', () => {
      console.log('Disconnected from chat server')
    })

    // Chat events
    this.client.on('chat.message', (event: any) => {
      this.displayMessage(event.payload)
    })

    this.client.on('chat.typing', (event: any) => {
      this.showTypingIndicator(event.payload.userId)
    })

    this.client.on('chat.joined', (event: any) => {
      this.userJoined(event.payload.userId)
    })

    this.client.on('chat.left', (event: any) => {
      this.userLeft(event.payload.userId)
    })
  }

  async joinRoom(roomId: string) {
    this.currentRoom = roomId
    await this.client.join(roomId)
    await this.client.sendToRoom(roomId, 'chat.joined', {
      userId: this.currentUserId,
      timestamp: Date.now()
    })
  }

  async leaveRoom() {
    if (this.currentRoom) {
      await this.client.sendToRoom(this.currentRoom, 'chat.left', {
        userId: this.currentUserId,
        timestamp: Date.now()
      })
      await this.client.leave(this.currentRoom)
      this.currentRoom = null
    }
  }

  async sendMessage(text: string) {
    if (this.currentRoom) {
      await this.client.sendToRoom(this.currentRoom, 'chat.message', {
        userId: this.currentUserId,
        text,
        timestamp: Date.now()
      })
    }
  }

  sendTypingIndicator(isTyping: boolean) {
    if (this.currentRoom) {
      this.client.sendToRoom(this.currentRoom, 'chat.typing', {
        userId: this.currentUserId,
        isTyping,
        timestamp: Date.now()
      })
    }
  }

  private displayMessage(message: any) {
    // Implementation to display message in UI
    console.log(`[${message.timestamp}] ${message.userId}: ${message.text}`)
  }

  private showTypingIndicator(userId: string) {
    // Implementation to show typing indicator
    console.log(`${userId} is typing...`)
  }

  private userJoined(userId: string) {
    console.log(`${userId} joined the room`)
  }

  private userLeft(userId: string) {
    console.log(`${userId} left the room`)
  }
}

// Usage
const chatApp = new ChatApplication('user-123')
await chatApp.joinRoom('general')
chatApp.sendMessage('Hello everyone!')
```

### 2. Real-time Notifications

```typescript
import { RealtimeClient } from '@toolkit-house/realtime'

class NotificationService {
  private client: RealtimeClient

  constructor(userId: string) {
    this.client = new RealtimeClient({
      url: `ws://localhost:3000/ws/notifications?userId=${userId}`,
      reconnectAttempts: 3
    })

    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    this.client.on('notification.message', (event: any) => {
      this.showNotification(event.payload)
    })

    this.client.on('notification.marked_as_read', (event: any) => {
      this.updateNotificationStatus(event.payload.notificationId)
    })

    this.client.on('notification.acknowledged', (event: any) => {
      console.log('Notification acknowledged:', event.payload)
    })
  }

  async connect() {
    await this.client.connect()

    // Subscribe to notifications
    await this.client.send('notification.subscribe', {
      userId: this.currentUserId
    })
  }

  private showNotification(notification: any) {
    // Implementation to show notification in UI
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.body,
        icon: notification.icon
      })
    }

    // Also show in-app notification
    this.displayInAppNotification(notification)
  }

  private displayInAppNotification(notification: any) {
    // Implementation to show in-app notification
    console.log('New notification:', notification)
  }

  async markAsRead(notificationId: string) {
    await this.client.send('notification.mark_as_read', {
      notificationId,
      userId: this.currentUserId
    })
  }
}

// Usage
const notificationService = new NotificationService('user-123')
await notificationService.connect()
```

### 3. Collaborative Editing

```typescript
import { RealtimeClient } from '@toolkit-house/realtime'

class CollaborativeEditor {
  private client: RealtimeClient
  private documentId: string
  private content: string = ''
  private cursorPosition: number = 0

  constructor(documentId: string, userId: string) {
    this.documentId = documentId
    this.client = new RealtimeClient({
      url: `ws://localhost:3000/ws/editor?documentId=${documentId}&userId=${userId}`,
      reconnectAttempts: 5
    })

    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    this.client.on('document.content', (event: any) => {
      this.updateContent(event.payload)
    })

    this.client.on('document.cursor', (event: any) => {
      this.updateCursor(event.payload)
    })

    this.client.on('document.operation', (event: any) => {
      this.applyOperation(event.payload)
    })

    this.client.on('user.joined', (event: any) => {
      this.userJoined(event.payload.userId)
    })

    this.client.on('user.left', (event: any) => {
      this.userLeft(event.payload.userId)
    })
  }

  async connect() {
    await this.client.connect()
    await this.client.join(`doc-${this.documentId}`)
  }

  async updateContent(newContent: string) {
    const operation = {
      type: 'update',
      oldContent: this.content,
      newContent,
      timestamp: Date.now()
    }

    this.content = newContent
    await this.client.sendToRoom(`doc-${this.documentId}`, 'document.operation', operation)
  }

  async updateCursorPosition(position: number) {
    this.cursorPosition = position
    await this.client.sendToRoom(`doc-${this.documentId}`, 'document.cursor', {
      userId: this.currentUserId,
      position,
      timestamp: Date.now()
    })
  }

  private applyOperation(operation: any) {
    if (operation.type === 'update') {
      this.content = operation.newContent
      this.renderContent()
    }
  }

  private userJoined(userId: string) {
    console.log(`User ${userId} joined the document`)
  }

  private userLeft(userId: string) {
    console.log(`User ${userId} left the document`)
  }

  private renderContent() {
    // Implementation to render content in editor
    console.log('Content updated:', this.content)
  }
}
```

### 4. Live Dashboard

```typescript
import { RealtimeClient } from '@toolkit-house/realtime'

class LiveDashboard {
  private client: RealtimeClient
  private metrics: Map<string, any> = new Map()

  constructor(dashboardId: string) {
    this.client = new RealtimeClient({
      url: `ws://localhost:3000/ws/dashboard?dashboardId=${dashboardId}`,
      reconnectAttempts: 5
    })

    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    this.client.on('metric.update', (event: any) => {
      this.updateMetric(event.payload)
    })

    this.client.on('metric.alert', (event: any) => {
      this.showAlert(event.payload)
    })

    this.client.on('system.status', (event: any) => {
      this.updateSystemStatus(event.payload)
    })
  }

  async connect() {
    await this.client.connect()

    // Subscribe to metrics
    await this.client.send('dashboard.subscribe', {
      dashboardId: this.dashboardId,
      metrics: ['cpu', 'memory', 'network', 'disk']
    })
  }

  private updateMetric(metric: any) {
    this.metrics.set(metric.name, metric)
    this.renderMetric(metric)
  }

  private renderMetric(metric: any) {
    // Implementation to update metric display
    console.log(`Metric ${metric.name}:`, metric.value, metric.unit)
  }

  private showAlert(alert: any) {
    // Implementation to show alert
    console.warn('Alert:', alert.message, alert.severity)
  }

  private updateSystemStatus(status: any) {
    // Implementation to update system status
    console.log('System status:', status)
  }
}
```

## API Reference

### Classes

- `RealtimeClient` - Main WebSocket client class
- `Event` - Event data structure
- `ConnectionState` - Connection state enum

### Key Methods

#### RealtimeClient
- `connect()` - Connect to WebSocket server
- `disconnect()` - Disconnect from server
- `reconnect()` - Reconnect to server
- `send(type, payload, options?)` - Send message
- `sendToRoom(roomId, type, payload, options?)` - Send message to room
- `join(roomId)` - Join a room
- `leave(roomId)` - Leave a room
- `leaveAll()` - Leave all rooms
- `authenticate(token)` - Authenticate connection
- `isHealthy()` - Check connection health

### Events

- `connecting` - Connection started
- `connected` - Connected to server
- `disconnected` - Disconnected from server
- `reconnecting` - Reconnecting attempt
- `reconnected` - Reconnected successfully
- `error` - Connection error
- `stateChanged` - Connection state changed

## Development

```bash
# Navigate to package directory
cd packages/realtime

# Build the package
pnpm run build

# Run tests
pnpm run test

# Run type checking
pnpm run typecheck
```

## License

MIT