import type { Formatter, LogEntry } from '../types.js';
import { formatLevel } from '../utils.js';

/**
 * Simple plain text formatter
 */
export class SimpleFormatter implements Formatter {
  private includeTimestamp: boolean;
  private includeMetadata: boolean;

  constructor(options: {
    includeTimestamp?: boolean;
    includeMetadata?: boolean;
  } = {}) {
    this.includeTimestamp = options.includeTimestamp ?? true;
    this.includeMetadata = options.includeMetadata ?? true;
  }

  format(entry: LogEntry): string {
    const parts: string[] = [];

    // Timestamp
    if (this.includeTimestamp) {
      parts.push(`[${entry.timestamp.toISOString()}]`);
    }

    // Level
    parts.push(`[${formatLevel(entry.level)}]`);

    // Tags
    if (entry.tags && entry.tags.length > 0) {
      parts.push(`(${entry.tags.join(', ')})`);
    }

    // Message
    parts.push(entry.message);

    // Main formatted line
    const mainLine = parts.join(' ');

    // Metadata
    const metadataLines: string[] = [];
    if (this.includeMetadata) {
      // Context
      if (entry.context && Object.keys(entry.context).length > 0) {
        metadataLines.push(`Context: ${JSON.stringify(entry.context)}`);
      }

      // Metadata
      if (entry.metadata && Object.keys(entry.metadata).length > 0) {
        metadataLines.push(`Metadata: ${JSON.stringify(entry.metadata)}`);
      }
    }

    if (metadataLines.length === 0) {
      return mainLine;
    }

    return `${mainLine} | ${metadataLines.join(' | ')}`;
  }
}