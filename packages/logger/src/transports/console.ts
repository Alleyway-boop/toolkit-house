import type { Transport, LogEntry, Formatter, LogLevel } from '../types.js';
import { LogLevel as LogLevelEnum } from '../types.js';
import { ConsoleFormatter } from '../formatters/console.js';
import { isBrowser } from '../utils.js';

/**
 * Console transport for browser and Node.js
 */
export class ConsoleTransport implements Transport {
  name: string = 'console';
  level: LogLevel;
  formatter: Formatter;

  constructor(options: {
    level?: LogLevel;
    formatter?: Formatter;
    useColors?: boolean;
    includeTimestamp?: boolean;
    includeMetadata?: boolean;
  } = {}) {
    this.level = options.level ?? LogLevelEnum.DEBUG;
    this.formatter = options.formatter ?? new ConsoleFormatter({
      useColors: options.useColors ?? undefined,
      includeTimestamp: options.includeTimestamp ?? undefined,
      includeMetadata: options.includeMetadata ?? undefined,
    });
  }

  log(entry: LogEntry): void {
    const formatted = this.formatter.format(entry);

    if (isBrowser()) {
      // Browser console
      this.logToBrowserConsole(entry.level, formatted);
    } else {
      // Node.js console
      this.logToNodeConsole(entry.level, formatted);
    }
  }

  private logToBrowserConsole(level: number, formatted: string): void {
    switch (level) {
      case 0: // DEBUG
        console.debug(formatted);
        break;
      case 1: // INFO
        console.info(formatted);
        break;
      case 2: // WARN
        console.warn(formatted);
        break;
      case 3: // ERROR
        console.error(formatted);
        break;
      case 4: // FATAL
        console.error(formatted);
        break;
      default:
        console.log(formatted);
    }
  }

  private logToNodeConsole(level: number, formatted: string): void {
    switch (level) {
      case 0: // DEBUG
        console.debug(formatted);
        break;
      case 1: // INFO
        console.info(formatted);
        break;
      case 2: // WARN
        console.warn(formatted);
        break;
      case 3: // ERROR
        console.error(formatted);
        break;
      case 4: // FATAL
        console.error(formatted);
        break;
      default:
        console.log(formatted);
    }
  }
}