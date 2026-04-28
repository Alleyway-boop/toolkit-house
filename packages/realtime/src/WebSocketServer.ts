/**
 * Real-time WebSocket Server
 */

import { WebSocketServer as WS, WebSocket } from 'ws'
import { EventEmitter } from 'events'
import { EventBus, type EventHandler } from './EventBus'

/**
 * WebSocket message format
 */
export interface WSMessage {
  type: string
  payload?: unknown
  error?: string
}

/**
 * Client connection info
 */
export interface ClientInfo {
  id: string
  ip: string
  connectedAt: number
}

/**
 * WebSocket server configuration
 */
export interface WebSocketServerConfig {
  /** Port to listen on */
  port: number
  /** Path for WebSocket connections */
  path?: string
  /** Enable heartbeat/ping */
  enableHeartbeat?: boolean
  /** Heartbeat interval in milliseconds */
  heartbeatInterval?: number
}

/**
 * RealtimeServer handles WebSocket connections and broadcasts
 * @example
 * ```ts
 * const server = new RealtimeServer({ port: 8080 });
 * server.broadcast('user-updated', { id: 123, name: 'Bob' });
 * ```
 */
export class RealtimeServer extends EventEmitter {
  private wss: WS
  private eventBus: EventBus
  private clients: Map<WebSocket, ClientInfo>
  private config: Required<WebSocketServerConfig>
  private heartbeatInterval?: ReturnType<typeof setInterval>

  constructor(config: WebSocketServerConfig) {
    super()

    this.config = {
      port: config.port,
      path: config.path || '/',
      enableHeartbeat: config.enableHeartbeat ?? true,
      heartbeatInterval: config.heartbeatInterval || 30000,
    }

    this.wss = new WS({
      port: this.config.port,
      path: this.config.path,
    })
    this.eventBus = new EventBus()
    this.clients = new Map()

    this.setupWebSocket()
    this.startHeartbeat()

    console.log(`WebSocket server running on port ${this.config.port}`)
  }

  /**
   * Setup WebSocket server event handlers
   */
  private setupWebSocket(): void {
    this.wss.on('connection', (ws: WebSocket, req) => {
      const clientInfo: ClientInfo = {
        id: this.generateClientId(),
        ip: req.socket.remoteAddress || 'unknown',
        connectedAt: Date.now(),
      }

      this.clients.set(ws, clientInfo)
      console.log(`Client connected: ${clientInfo.id} from ${clientInfo.ip}`)

      // Send welcome message
      this.sendToClient(ws, {
        type: 'connected',
        payload: { clientId: clientInfo.id },
      })

      // Handle incoming messages
      ws.on('message', (data: Buffer) => {
        this.handleMessage(ws, data)
      })

      // Handle disconnection
      ws.on('close', () => {
        this.clients.delete(ws)
        console.log(`Client disconnected: ${clientInfo.id}`)
        this.emit('client-disconnected', clientInfo)
      })

      // Handle errors
      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientInfo.id}:`, error)
      })

      this.emit('client-connected', clientInfo)
    })
  }

  /**
   * Handle incoming message from client
   */
  private handleMessage(ws: WebSocket, data: Buffer): void {
    try {
      const message: WSMessage = JSON.parse(data.toString())

      // Emit event on event bus
      this.eventBus.publish(`client:${message.type}`, message.payload)

      // Also emit on this server
      this.emit('message', {
        client: this.clients.get(ws),
        message,
      })
    }
    catch (error) {
      console.error('Invalid message format:', error)
      this.sendToClient(ws, {
        type: 'error',
        error: 'Invalid message format',
      })
    }
  }

  /**
   * Broadcast a message to all connected clients
   */
  broadcast(eventType: string, payload: unknown): void {
    const message: WSMessage = {
      type: eventType,
      payload,
    }

    const data = JSON.stringify(message)

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })

    // Also publish to event bus
    this.eventBus.publish(eventType, payload)
  }

  /**
   * Send a message to a specific client
   */
  sendToClient(ws: WebSocket, message: WSMessage): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message))
    }
  }

  /**
   * Get event bus for subscribing to events
   */
  getEventBus(): EventBus {
    return this.eventBus
  }

  /**
   * Subscribe to client events
   */
  onClientEvent(eventType: string, handler: EventHandler): () => void {
    return this.eventBus.subscribe(`client:${eventType}`, handler)
  }

  /**
   * Start heartbeat/ping to keep connections alive
   */
  private startHeartbeat(): void {
    if (!this.config.enableHeartbeat)
      return

    this.heartbeatInterval = setInterval(() => {
      this.wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.ping()
        }
      })
    }, this.config.heartbeatInterval)
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }
  }

  /**
   * Generate a unique client ID
   */
  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }

  /**
   * Get connected clients count
   */
  get clientCount(): number {
    return this.clients.size
  }

  /**
   * Get all connected clients
   */
  getClients(): ClientInfo[] {
    return Array.from(this.clients.values())
  }

  /**
   * Close the WebSocket server
   */
  close(): Promise<void> {
    return new Promise((resolve) => {
      this.stopHeartbeat()

      // Close all client connections
      this.wss.clients.forEach((client) => {
        client.close()
      })

      // Close server
      this.wss.close(() => {
        console.log('WebSocket server closed')
        resolve()
      })
    })
  }
}

/**
 * Create a WebSocket server with default configuration
 */
export const createWebSocketServer = (
  config: WebSocketServerConfig,
): RealtimeServer => {
  return new RealtimeServer(config)
}
