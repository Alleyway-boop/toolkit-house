import type { Filter, LogEntry } from '../types.js';

/**
 * Level filter for minimum log level
 */
export class LevelFilter implements Filter {
  private minLevel: number;

  constructor(minLevel: number) {
    this.minLevel = minLevel;
  }

  shouldLog(entry: LogEntry): boolean {
    return entry.level >= this.minLevel;
  }

  /**
   * Update minimum level
   */
  setMinLevel(minLevel: number): void {
    this.minLevel = minLevel;
  }

  /**
   * Get current minimum level
   */
  getMinLevel(): number {
    return this.minLevel;
  }
}

/**
 * Level range filter for specific level range
 */
export class LevelRangeFilter implements Filter {
  private minLevel: number;
  private maxLevel: number;

  constructor(minLevel: number, maxLevel: number) {
    this.minLevel = minLevel;
    this.maxLevel = maxLevel;
  }

  shouldLog(entry: LogEntry): boolean {
    return entry.level >= this.minLevel && entry.level <= this.maxLevel;
  }

  /**
   * Update level range
   */
  setLevelRange(minLevel: number, maxLevel: number): void {
    this.minLevel = minLevel;
    this.maxLevel = maxLevel;
  }

  /**
   * Get current level range
   */
  getLevelRange(): { min: number; max: number } {
    return { min: this.minLevel, max: this.maxLevel };
  }
}

/**
 * Exact level filter for specific levels only
 */
export class ExactLevelFilter implements Filter {
  private allowedLevels: Set<number>;

  constructor(levels: number[]) {
    this.allowedLevels = new Set(levels);
  }

  shouldLog(entry: LogEntry): boolean {
    return this.allowedLevels.has(entry.level);
  }

  /**
   * Add allowed level
   */
  addLevel(level: number): void {
    this.allowedLevels.add(level);
  }

  /**
   * Remove allowed level
   */
  removeLevel(level: number): void {
    this.allowedLevels.delete(level);
  }

  /**
   * Get allowed levels
   */
  getAllowedLevels(): number[] {
    return Array.from(this.allowedLevels);
  }

  /**
   * Clear all allowed levels
   */
  clear(): void {
    this.allowedLevels.clear();
  }
}