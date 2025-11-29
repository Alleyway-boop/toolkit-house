import type { LogMessage, LogMetadata } from './types.js';

/**
 * Resolve lazy value to actual value
 */
export function resolveLazy<T>(value: T | (() => T)): T {
  return typeof value === 'function' ? (value as () => T)() : value;
}

/**
 * Check if value is a lazy function
 */
export function isLazy<T>(value: T | (() => T)): value is () => T {
  return typeof value === 'function';
}

/**
 * Resolve log message
 */
export function resolveMessage(message: LogMessage): string {
  return resolveLazy(message);
}

/**
 * Resolve metadata
 */
export function resolveMetadata(metadata?: LogMetadata): Record<string, any> | undefined {
  return metadata ? resolveLazy(metadata) : undefined;
}

/**
 * Get current timestamp in ISO format
 */
export function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Get current Date object
 */
export function getDate(): Date {
  return new Date();
}

/**
 * Format log level as string
 */
export function formatLevel(level: number): string {
  switch (level) {
    case 0: return 'DEBUG';
    case 1: return 'INFO';
    case 2: return 'WARN';
    case 3: return 'ERROR';
    case 4: return 'FATAL';
    default: return 'UNKNOWN';
  }
}

/**
 * Check if running in browser environment
 */
export function isBrowser(): boolean {
  return typeof globalThis !== 'undefined' && 'window' in globalThis;
}

/**
 * Check if running in Node.js environment
 */
export function isNode(): boolean {
  return typeof process !== 'undefined' && process.versions?.node != null;
}