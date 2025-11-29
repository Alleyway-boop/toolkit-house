import type { Filter, LogEntry } from '../types.js';

/**
 * Include tag filter - only logs with specified tags
 */
export class IncludeTagFilter implements Filter {
  private requiredTags: Set<string>;

  constructor(tags: string[]) {
    this.requiredTags = new Set(tags);
  }

  shouldLog(entry: LogEntry): boolean {
    if (!entry.tags || entry.tags.length === 0) {
      return this.requiredTags.size === 0;
    }

    // Entry must have at least one of the required tags
    return entry.tags.some(tag => this.requiredTags.has(tag));
  }

  /**
   * Add required tag
   */
  addTag(tag: string): void {
    this.requiredTags.add(tag);
  }

  /**
   * Remove required tag
   */
  removeTag(tag: string): void {
    this.requiredTags.delete(tag);
  }

  /**
   * Get required tags
   */
  getRequiredTags(): string[] {
    return Array.from(this.requiredTags);
  }

  /**
   * Clear all required tags
   */
  clear(): void {
    this.requiredTags.clear();
  }
}

/**
 * Exclude tag filter - excludes logs with specified tags
 */
export class ExcludeTagFilter implements Filter {
  private excludedTags: Set<string>;

  constructor(tags: string[]) {
    this.excludedTags = new Set(tags);
  }

  shouldLog(entry: LogEntry): boolean {
    if (!entry.tags || entry.tags.length === 0) {
      return true;
    }

    // Entry must not have any of the excluded tags
    return !entry.tags.some(tag => this.excludedTags.has(tag));
  }

  /**
   * Add excluded tag
   */
  addTag(tag: string): void {
    this.excludedTags.add(tag);
  }

  /**
   * Remove excluded tag
   */
  removeTag(tag: string): void {
    this.excludedTags.delete(tag);
  }

  /**
   * Get excluded tags
   */
  getExcludedTags(): string[] {
    return Array.from(this.excludedTags);
  }

  /**
   * Clear all excluded tags
   */
  clear(): void {
    this.excludedTags.clear();
  }
}

/**
 * All tags filter - requires all specified tags to be present
 */
export class AllTagsFilter implements Filter {
  private requiredTags: Set<string>;

  constructor(tags: string[]) {
    this.requiredTags = new Set(tags);
  }

  shouldLog(entry: LogEntry): boolean {
    if (!entry.tags || entry.tags.length === 0) {
      return this.requiredTags.size === 0;
    }

    // Entry must have all required tags
    const entryTags = new Set(entry.tags);
    return Array.from(this.requiredTags).every(tag => entryTags.has(tag));
  }

  /**
   * Add required tag
   */
  addTag(tag: string): void {
    this.requiredTags.add(tag);
  }

  /**
   * Remove required tag
   */
  removeTag(tag: string): void {
    this.requiredTags.delete(tag);
  }

  /**
   * Get required tags
   */
  getRequiredTags(): string[] {
    return Array.from(this.requiredTags);
  }

  /**
   * Clear all required tags
   */
  clear(): void {
    this.requiredTags.clear();
  }
}