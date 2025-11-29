import type { Transport, LogEntry, Formatter } from '../types.js';
import { SimpleFormatter } from '../formatters/simple.js';

/**
 * Memory transport options
 */
export interface MemoryTransportOptions {
  level?: number;
  formatter?: Formatter;
  maxEntries?: number;
  bufferSize?: number;
}

/**
 * Memory transport for storing logs in memory
 */
export class MemoryTransport implements Transport {
  name: string = 'memory';
  level: number;
  formatter: Formatter;
  private maxEntries: number;
  private bufferSize: number;
  private entries: LogEntry[] = [];
  private formattedEntries: string[] = [];

  constructor(options: MemoryTransportOptions = {}) {
    this.level = options.level ?? 0; // DEBUG by default
    this.formatter = options.formatter ?? new SimpleFormatter();
    this.maxEntries = options.maxEntries ?? 1000;
    this.bufferSize = options.bufferSize ?? 100;
  }

  log(entry: LogEntry): void {
    // Store raw entry
    this.entries.push(entry);

    // Store formatted entry
    const formatted = this.formatter.format(entry);
    this.formattedEntries.push(formatted);

    // Trim entries if exceeded max entries
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
      this.formattedEntries = this.formattedEntries.slice(-this.maxEntries);
    }
  }

  /**
   * Get all log entries
   */
  getEntries(): LogEntry[] {
    return [...this.entries];
  }

  /**
   * Get all formatted log entries
   */
  getFormattedEntries(): string[] {
    return [...this.formattedEntries];
  }

  /**
   * Get entries by level
   */
  getEntriesByLevel(level: number): LogEntry[] {
    return this.entries.filter(entry => entry.level === level);
  }

  /**
   * Get entries by tag
   */
  getEntriesByTag(tag: string): LogEntry[] {
    return this.entries.filter(entry => entry.tags?.includes(tag));
  }

  /**
   * Get entries in time range
   */
  getEntriesByTimeRange(start: Date, end: Date): LogEntry[] {
    return this.entries.filter(entry =>
      entry.timestamp >= start && entry.timestamp <= end
    );
  }

  /**
   * Get recent entries
   */
  getRecentEntries(count: number): LogEntry[] {
    return this.entries.slice(-count);
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.entries = [];
    this.formattedEntries = [];
  }

  /**
   * Get entry count
   */
  getCount(): number {
    return this.entries.length;
  }

  /**
   * Get formatted entries as a single string
   */
  getFormattedString(): string {
    return this.formattedEntries.join('\n');
  }
}