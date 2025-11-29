import type { Formatter, LogEntry } from '../types.js';
import { formatLevel } from '../utils.js';

/**
 * JSON formatter for structured logging
 */
export class JsonFormatter implements Formatter {
  private pretty: boolean;

  constructor(options: { pretty?: boolean } = {}) {
    this.pretty = options.pretty ?? false;
  }

  format(entry: LogEntry): string {
    const formattedEntry = {
      level: formatLevel(entry.level),
      message: entry.message,
      timestamp: entry.timestamp.toISOString(),
      ...(entry.metadata && Object.keys(entry.metadata).length > 0 && { metadata: entry.metadata }),
      ...(entry.context && Object.keys(entry.context).length > 0 && { context: entry.context }),
      ...(entry.tags && entry.tags.length > 0 && { tags: entry.tags }),
    };

    return this.pretty
      ? JSON.stringify(formattedEntry, null, 2)
      : JSON.stringify(formattedEntry);
  }
}