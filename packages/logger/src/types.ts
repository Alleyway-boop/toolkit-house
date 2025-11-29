/**
 * Log levels in order of severity
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

/**
 * Log entry containing all information about a log event
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  context?: Record<string, any>;
  tags?: string[];
}

/**
 * Transport interface for different output destinations
 */
export interface Transport {
  name: string;
  level: LogLevel;
  formatter?: Formatter;
  filter?: Filter;
  log(entry: LogEntry): Promise<void> | void;
}

/**
 * Formatter interface for different output formats
 */
export interface Formatter {
  format(entry: LogEntry): string;
}

/**
 * Filter interface for log filtering
 */
export interface Filter {
  shouldLog(entry: LogEntry): boolean;
}

/**
 * Logger configuration options
 */
export interface LoggerOptions {
  level?: LogLevel;
  transports?: Transport[];
  context?: Record<string, any>;
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * Lazy function for expensive computations
 */
export type LazyFunction<T> = () => T;

/**
 * Log message that can be string or lazy function
 */
export type LogMessage = string | LazyFunction<string>;

/**
 * Metadata that can be object or lazy function
 */
export type LogMetadata = Record<string, any> | LazyFunction<Record<string, any>>;