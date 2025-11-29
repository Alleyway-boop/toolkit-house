import type { Filter, LogEntry } from '../types.js';

/**
 * Custom filter with user-defined predicate function
 */
export class CustomFilter implements Filter {
  private predicate: (entry: LogEntry) => boolean;

  constructor(predicate: (entry: LogEntry) => boolean) {
    this.predicate = predicate;
  }

  shouldLog(entry: LogEntry): boolean {
    try {
      return this.predicate(entry);
    } catch {
      // Silently fail to avoid noise in tests
      return true; // Fail open - log if filter fails
    }
  }

  /**
   * Update predicate function
   */
  setPredicate(predicate: (entry: LogEntry) => boolean): void {
    this.predicate = predicate;
  }
}

/**
 * Message filter - filters based on message content
 */
export class MessageFilter implements Filter {
  private patterns: Array<{
    pattern: RegExp | string;
    include: boolean; // true for include, false for exclude
  }>;

  constructor(options: {
    includes?: (RegExp | string)[];
    excludes?: (RegExp | string)[];
  } = {}) {
    this.patterns = [];

    if (options.includes) {
      options.includes.forEach(pattern => {
        this.patterns.push({ pattern, include: true });
      });
    }

    if (options.excludes) {
      options.excludes.forEach(pattern => {
        this.patterns.push({ pattern, include: false });
      });
    }
  }

  shouldLog(entry: LogEntry): boolean {
    const message = entry.message;

    for (const { pattern, include } of this.patterns) {
      const matches = typeof pattern === 'string'
        ? message.includes(pattern)
        : pattern.test(message);

      if (matches) {
        return include;
      }
    }

    // If no patterns match, default to including
    return true;
  }

  /**
   * Add include pattern
   */
  addIncludePattern(pattern: RegExp | string): void {
    this.patterns.push({ pattern, include: true });
  }

  /**
   * Add exclude pattern
   */
  addExcludePattern(pattern: RegExp | string): void {
    this.patterns.push({ pattern, include: false });
  }

  /**
   * Clear all patterns
   */
  clear(): void {
    this.patterns = [];
  }
}

/**
 * Time range filter - filters based on timestamp
 */
export class TimeRangeFilter implements Filter {
  private startTime: Date | undefined;
  private endTime: Date | undefined;

  constructor(options: {
    startTime?: Date;
    endTime?: Date;
  } = {}) {
    this.startTime = options.startTime;
    this.endTime = options.endTime;
  }

  shouldLog(entry: LogEntry): boolean {
    if (this.startTime && entry.timestamp < this.startTime) {
      return false;
    }

    if (this.endTime && entry.timestamp > this.endTime) {
      return false;
    }

    return true;
  }

  /**
   * Set start time
   */
  setStartTime(startTime?: Date): void {
    this.startTime = startTime;
  }

  /**
   * Set end time
   */
  setEndTime(endTime?: Date): void {
    this.endTime = endTime;
  }

  /**
   * Set time range
   */
  setTimeRange(startTime?: Date, endTime?: Date): void {
    this.startTime = startTime;
    this.endTime = endTime;
  }

  /**
   * Get current time range
   */
  getTimeRange(): { startTime: Date | undefined; endTime: Date | undefined } {
    return { startTime: this.startTime, endTime: this.endTime };
  }
}

/**
 * Composite filter - combines multiple filters with AND/OR logic
 */
export class CompositeFilter implements Filter {
  private filters: Filter[];
  private operator: 'AND' | 'OR';

  constructor(options: {
    filters?: Filter[];
    operator?: 'AND' | 'OR';
  } = {}) {
    this.filters = options.filters ?? [];
    this.operator = options.operator ?? 'AND';
  }

  shouldLog(entry: LogEntry): boolean {
    if (this.filters.length === 0) {
      return true;
    }

    if (this.operator === 'AND') {
      return this.filters.every(filter => filter.shouldLog(entry));
    } else {
      return this.filters.some(filter => filter.shouldLog(entry));
    }
  }

  /**
   * Add filter
   */
  addFilter(filter: Filter): void {
    this.filters.push(filter);
  }

  /**
   * Remove filter
   */
  removeFilter(filter: Filter): void {
    const index = this.filters.indexOf(filter);
    if (index !== -1) {
      this.filters.splice(index, 1);
    }
  }

  /**
   * Clear all filters
   */
  clear(): void {
    this.filters = [];
  }

  /**
   * Set operator
   */
  setOperator(operator: 'AND' | 'OR'): void {
    this.operator = operator;
  }

  /**
   * Get operator
   */
  getOperator(): 'AND' | 'OR' {
    return this.operator;
  }
}