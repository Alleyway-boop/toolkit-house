import {
  LogLevel,
  type LogEntry,
  type Transport,
  type LoggerOptions,
  type LogMessage,
  type LogMetadata,
  type Filter,
  type Formatter
} from '../types.js';
import { resolveMessage, resolveMetadata, getDate } from '../utils.js';

/**
 * Main Logger class
 */
export class Logger {
  private level: LogLevel;
  private transports: Transport[];
  private context: Record<string, any>;
  private tags: string[];
  private metadata: Record<string, any>;

  constructor(options: LoggerOptions = {}) {
    this.level = options.level ?? LogLevel.INFO;
    this.transports = options.transports ?? [];
    this.context = options.context ?? {};
    this.tags = options.tags ?? [];
    this.metadata = options.metadata ?? {};
  }

  /**
   * Set minimum log level
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Get current log level
   */
  getLevel(): LogLevel {
    return this.level;
  }

  /**
   * Add transport
   */
  addTransport(transport: Transport): void {
    this.transports.push(transport);
  }

  /**
   * Remove transport by name
   */
  removeTransport(name: string): void {
    this.transports = this.transports.filter(t => t.name !== name);
  }

  /**
   * Get all transports
   */
  getTransports(): Transport[] {
    return [...this.transports];
  }

  /**
   * Set context that will be included in all log entries
   */
  setContext(context: Record<string, any>): void {
    this.context = { ...context };
  }

  /**
   * Update context by merging with existing context
   */
  updateContext(context: Record<string, any>): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Set tags that will be included in all log entries
   */
  setTags(tags: string[]): void {
    this.tags = [...tags];
  }

  /**
   * Add tags to existing tags
   */
  addTags(...tags: string[]): void {
    this.tags.push(...tags);
  }

  /**
   * Clear all tags
   */
  clearTags(): void {
    this.tags = [];
  }

  /**
   * Set metadata that will be included in all log entries
   */
  setMetadata(metadata: Record<string, any>): void {
    this.metadata = { ...metadata };
  }

  /**
   * Update metadata by merging with existing metadata
   */
  updateMetadata(metadata: Record<string, any>): void {
    this.metadata = { ...this.metadata, ...metadata };
  }

  /**
   * Create child logger with inherited context
   */
  child(options: LoggerOptions = {}): Logger {
    return new Logger({
      level: options.level ?? this.level,
      transports: options.transports ?? this.transports,
      context: { ...this.context, ...options.context },
      tags: [...this.tags, ...(options.tags ?? [])],
      metadata: { ...this.metadata, ...options.metadata },
    });
  }

  /**
   * Check if a log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  /**
   * Create log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: LogMessage,
    metadata?: LogMetadata,
    tags?: string[]
  ): LogEntry {
    return {
      level,
      message: resolveMessage(message),
      timestamp: getDate(),
      metadata: metadata ? { ...this.metadata, ...resolveMetadata(metadata) } : this.metadata,
      context: { ...this.context },
      tags: tags ? [...this.tags, ...tags] : this.tags,
    };
  }

  /**
   * Log entry to all transports
   */
  private async logToTransports(entry: LogEntry): Promise<void> {
    const promises = this.transports
      .filter(transport => entry.level >= transport.level)
      .filter(transport => !transport.filter || transport.filter.shouldLog(entry))
      .map(transport => {
        try {
          return Promise.resolve(transport.log(entry));
        } catch (error) {
          console.error(`Transport ${transport.name} failed:`, error);
          return Promise.resolve();
        }
      });

    await Promise.allSettled(promises);
  }

  /**
   * Generic log method
   */
  private async log(
    level: LogLevel,
    message: LogMessage,
    metadata?: LogMetadata,
    tags?: string[]
  ): Promise<void> {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry = this.createLogEntry(level, message, metadata, tags);
    await this.logToTransports(entry);
  }

  /**
   * Debug level log
   */
  debug(message: LogMessage, metadata?: LogMetadata, tags?: string[]): Promise<void> {
    return this.log(LogLevel.DEBUG, message, metadata, tags);
  }

  /**
   * Info level log
   */
  info(message: LogMessage, metadata?: LogMetadata, tags?: string[]): Promise<void> {
    return this.log(LogLevel.INFO, message, metadata, tags);
  }

  /**
   * Warn level log
   */
  warn(message: LogMessage, metadata?: LogMetadata, tags?: string[]): Promise<void> {
    return this.log(LogLevel.WARN, message, metadata, tags);
  }

  /**
   * Error level log
   */
  error(message: LogMessage, metadata?: LogMetadata, tags?: string[]): Promise<void> {
    return this.log(LogLevel.ERROR, message, metadata, tags);
  }

  /**
   * Fatal level log
   */
  fatal(message: LogMessage, metadata?: LogMetadata, tags?: string[]): Promise<void> {
    return this.log(LogLevel.FATAL, message, metadata, tags);
  }
}