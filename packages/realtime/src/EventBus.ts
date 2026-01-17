/**
 * Real-time Event Bus for distributed event handling
 */

import { EventEmitter } from 'events'

/**
 * Event payload
 */
export interface Event {
  /** Event type/name */
  type: string
  /** Event payload data */
  payload: unknown
  /** Event timestamp */
  timestamp: number
  /** Unique event ID */
  id: string
}

/**
 * Event handler function
 */
export type EventHandler = (event: Event) => void | Promise<void>

/**
 * EventBus provides publish/subscribe pattern for events
 * @example
 * ```ts
 * const bus = new EventBus();
 * const unsubscribe = bus.subscribe('user-created', (event) => {
 *   console.log('User created:', event.payload);
 * });
 * bus.publish('user-created', { id: 123, name: 'Alice' });
 * unsubscribe();
 * ```
 */
export class EventBus extends EventEmitter {
  private eventHistory: Map<string, Event[]>
  private maxHistorySize: number

  constructor(maxHistorySize: number = 1000) {
    super()
    this.eventHistory = new Map()
    this.maxHistorySize = maxHistorySize
    this.setMaxListeners(100) // Increase max listeners for many subscribers
  }

  /**
   * Publish an event to all subscribers
   */
  publish(eventType: string, payload: unknown): void {
    const event: Event = {
      type: eventType,
      payload,
      timestamp: Date.now(),
      id: this.generateEventId(),
    }

    // Store event history
    this.addToHistory(eventType, event)

    // Emit event
    this.emit(eventType, event)

    // Also emit wildcard event
    this.emit('*', event)
  }

  /**
   * Subscribe to events
   * Returns unsubscribe function
   */
  subscribe(eventType: string, handler: EventHandler): () => void {
    this.on(eventType, handler)

    // Return unsubscribe function
    return () => {
      this.off(eventType, handler)
    }
  }

  /**
   * Subscribe to all events (wildcard)
   */
  subscribeAll(handler: EventHandler): () => void {
    this.on('*', handler)

    return () => {
      this.off('*', handler)
    }
  }

  /**
   * Get event history for a type
   */
  getHistory(eventType: string, limit: number = 100): Event[] {
    const history = this.eventHistory.get(eventType)
    if (!history)
      return []

    return history.slice(-limit)
  }

  /**
   * Get all event types with history
   */
  getEventTypes(): string[] {
    return Array.from(this.eventHistory.keys())
  }

  /**
   * Clear event history
   */
  clearHistory(eventType?: string): void {
    if (eventType) {
      this.eventHistory.delete(eventType)
    }
    else {
      this.eventHistory.clear()
    }
  }

  /**
   * Add event to history
   */
  private addToHistory(eventType: string, event: Event): void {
    if (!this.eventHistory.has(eventType)) {
      this.eventHistory.set(eventType, [])
    }

    const history = this.eventHistory.get(eventType)!
    history.push(event)

    // Keep only last maxHistorySize events
    if (history.length > this.maxHistorySize) {
      history.shift()
    }
  }

  /**
   * Generate a unique event ID
   */
  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
  }

  /**
   * Get statistics about events
   */
  getStats(): {
    totalEvents: number
    eventsByType: Record<string, number>
    listenerCounts: Record<string, number>
  } {
    const eventsByType: Record<string, number> = {}
    let totalEvents = 0

    for (const [type, events] of this.eventHistory) {
      eventsByType[type] = events.length
      totalEvents += events.length
    }

    const listenerCounts: Record<string, number> = {}
    for (const eventType of this.eventNames()) {
      listenerCounts[eventType as string] = this.listenerCount(eventType as string)
    }

    return {
      totalEvents,
      eventsByType,
      listenerCounts,
    }
  }
}

/**
 * Default event bus instance
 */
export const defaultEventBus = new EventBus()
