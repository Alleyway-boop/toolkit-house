import type { Formatter, LogEntry } from '../types.js';
import { formatLevel, isBrowser } from '../utils.js';

/**
 * Console formatter with colors for terminal output
 */
export class ConsoleFormatter implements Formatter {
  private useColors: boolean;
  private includeTimestamp: boolean;
  private includeMetadata: boolean;

  constructor(options: {
    useColors?: boolean;
    includeTimestamp?: boolean;
    includeMetadata?: boolean;
  } = {}) {
    this.useColors = options.useColors ?? !isBrowser();
    this.includeTimestamp = options.includeTimestamp ?? true;
    this.includeMetadata = options.includeMetadata ?? true;
  }

  format(entry: LogEntry): string {
    const parts: string[] = [];

    // Timestamp
    if (this.includeTimestamp) {
      parts.push(`[${entry.timestamp.toISOString()}]`);
    }

    // Level with colors
    const level = formatLevel(entry.level);
    const coloredLevel = this.colorizeLevel(level, entry.level);
    parts.push(`[${coloredLevel}]`);

    // Tags
    if (entry.tags && entry.tags.length > 0) {
      const tags = entry.tags.map(tag => this.colorizeTag(tag)).join(' ');
      parts.push(`(${tags})`);
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
        metadataLines.push(`Context: ${JSON.stringify(entry.context, null, 2)}`);
      }

      // Metadata
      if (entry.metadata && Object.keys(entry.metadata).length > 0) {
        metadataLines.push(`Metadata: ${JSON.stringify(entry.metadata, null, 2)}`);
      }
    }

    if (metadataLines.length === 0) {
      return mainLine;
    }

    return `${mainLine}\n${metadataLines.join('\n')}`;
  }

  private colorizeLevel(level: string, logLevel: number): string {
    if (!this.useColors) {
      return level;
    }

    const colors = {
      [0]: '\x1b[36m', // cyan for DEBUG
      [1]: '\x1b[32m', // green for INFO
      [2]: '\x1b[33m', // yellow for WARN
      [3]: '\x1b[31m', // red for ERROR
      [4]: '\x1b[35m', // magenta for FATAL
    };

    const reset = '\x1b[0m';
    const color = colors[logLevel as keyof typeof colors] || '\x1b[37m'; // white default
    return `${color}${level}${reset}`;
  }

  private colorizeTag(tag: string): string {
    if (!this.useColors) {
      return tag;
    }

    const color = '\x1b[90m'; // dark gray
    const reset = '\x1b[0m';
    return `${color}#${tag}${reset}`;
  }
}