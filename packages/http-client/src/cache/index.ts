import type { HttpResponse, CacheOptions, CacheEntry } from '../types';

/**
 * 缓存接口
 */
export interface ICache<T = any> {
  get(key: string): Promise<HttpResponse<T> | null>;
  set(key: string, value: HttpResponse<T>, ttl?: number): Promise<void>;
  delete(key: string): Promise<boolean>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
  size(): Promise<number>;
  keys(): Promise<string[]>;
}

/**
 * 内存缓存实现
 */
export class MemoryCache<T = any> implements ICache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;
  private cleanupInterval?: NodeJS.Timeout;

  constructor(maxSize: number = 100, cleanupIntervalMs: number = 60000) {
    this.maxSize = maxSize;
    this.startCleanup(cleanupIntervalMs);
  }

  async get(key: string): Promise<HttpResponse<T> | null> {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    // 检查是否过期
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  async set(key: string, value: HttpResponse<T>, ttl?: number): Promise<void> {
    // 检查缓存大小限制
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      // 删除最旧的条目
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      ttl,
      key
    };

    this.cache.set(key, entry);
  }

  async delete(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  async size(): Promise<number> {
    return this.cache.size;
  }

  async keys(): Promise<string[]> {
    return Array.from(this.cache.keys());
  }

  private isExpired(entry: CacheEntry<T>): boolean {
    if (!entry.ttl) {
      return false;
    }

    return Date.now() - entry.timestamp > entry.ttl;
  }

  private startCleanup(intervalMs: number): void {
    if (intervalMs > 0) {
      this.cleanupInterval = setInterval(() => {
        this.cleanup();
      }, intervalMs);
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.ttl && now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
  }
}

/**
 * LRU (Least Recently Used) 缓存实现
 */
export class LRUCache<T = any> implements ICache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;
  private cleanupInterval?: NodeJS.Timeout;

  constructor(maxSize: number = 100, cleanupIntervalMs: number = 60000) {
    this.maxSize = maxSize;
    this.startCleanup(cleanupIntervalMs);
  }

  async get(key: string): Promise<HttpResponse<T> | null> {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    // 检查是否过期
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }

    // 移到最后（最近使用）
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.data;
  }

  async set(key: string, value: HttpResponse<T>, ttl?: number): Promise<void> {
    // 如果已存在，删除旧的
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // 如果超过最大大小，删除最旧的
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      ttl,
      key
    };

    this.cache.set(key, entry);
  }

  async delete(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  async size(): Promise<number> {
    return this.cache.size;
  }

  async keys(): Promise<string[]> {
    return Array.from(this.cache.keys());
  }

  private isExpired(entry: CacheEntry<T>): boolean {
    if (!entry.ttl) {
      return false;
    }

    return Date.now() - entry.timestamp > entry.ttl;
  }

  private startCleanup(intervalMs: number): void {
    if (intervalMs > 0) {
      this.cleanupInterval = setInterval(() => {
        this.cleanup();
      }, intervalMs);
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.ttl && now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
  }
}

/**
 * LocalStorage 缓存实现
 */
export class LocalStorageCache<T = any> implements ICache<T> {
  private prefix: string;
  private maxSize: number;
  private cleanupInterval?: NodeJS.Timeout;

  constructor(prefix: string = 'http_cache_', maxSize: number = 50, cleanupIntervalMs: number = 300000) {
    this.prefix = prefix;
    this.maxSize = maxSize;
    this.startCleanup(cleanupIntervalMs);
  }

  async get(key: string): Promise<HttpResponse<T> | null> {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) {
        return null;
      }

      const entry = JSON.parse(item) as CacheEntry<T>;

      // 检查是否过期
      if (this.isExpired(entry)) {
        localStorage.removeItem(this.prefix + key);
        return null;
      }

      return entry.data;
    } catch {
      return null;
    }
  }

  async set(key: string, value: HttpResponse<T>, ttl?: number): Promise<void> {
    try {
      // 检查缓存大小限制
      if (await this.size() >= this.maxSize && !await this.has(key)) {
        // 删除最旧的条目
        const keys = await this.keys();
        if (keys.length > 0) {
          localStorage.removeItem(this.prefix + keys[0]);
        }
      }

      const entry: CacheEntry<T> = {
        data: value,
        timestamp: Date.now(),
        ttl,
        key
      };

      localStorage.setItem(this.prefix + key, JSON.stringify(entry));
    } catch {
      // LocalStorage 可能已满，忽略错误
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch {
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await this.keys();
      keys.forEach(key => localStorage.removeItem(this.prefix + key));
    } catch {
      // 忽略错误
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) {
        return false;
      }

      const entry = JSON.parse(item) as CacheEntry<T>;

      if (this.isExpired(entry)) {
        localStorage.removeItem(this.prefix + key);
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  async size(): Promise<number> {
    try {
      return (await this.keys()).length;
    } catch {
      return 0;
    }
  }

  async keys(): Promise<string[]> {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keys.push(key.substring(this.prefix.length));
        }
      }
      return keys;
    } catch {
      return [];
    }
  }

  private isExpired(entry: CacheEntry<T>): boolean {
    if (!entry.ttl) {
      return false;
    }

    return Date.now() - entry.timestamp > entry.ttl;
  }

  private startCleanup(intervalMs: number): void {
    if (typeof window !== 'undefined' && intervalMs > 0) {
      this.cleanupInterval = setInterval(() => {
        this.cleanup();
      }, intervalMs);
    }
  }

  private async cleanup(): Promise<void> {
    try {
      const keys = await this.keys();
      const now = Date.now();

      for (const key of keys) {
        const entry = await this.get(key);
        if (entry === null) {
          continue; // 已过期，已被 get 方法删除
        }
      }
    } catch {
      // 忽略错误
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

/**
 * SessionStorage 缓存实现
 */
export class SessionStorageCache<T = any> implements ICache<T> {
  private prefix: string;
  private maxSize: number;
  private cleanupInterval?: NodeJS.Timeout;

  constructor(prefix: string = 'http_cache_session_', maxSize: number = 50, cleanupIntervalMs: number = 300000) {
    this.prefix = prefix;
    this.maxSize = maxSize;
    this.startCleanup(cleanupIntervalMs);
  }

  async get(key: string): Promise<HttpResponse<T> | null> {
    try {
      const item = sessionStorage.getItem(this.prefix + key);
      if (!item) {
        return null;
      }

      const entry = JSON.parse(item) as CacheEntry<T>;

      // 检查是否过期
      if (this.isExpired(entry)) {
        sessionStorage.removeItem(this.prefix + key);
        return null;
      }

      return entry.data;
    } catch {
      return null;
    }
  }

  async set(key: string, value: HttpResponse<T>, ttl?: number): Promise<void> {
    try {
      // 检查缓存大小限制
      if (await this.size() >= this.maxSize && !await this.has(key)) {
        // 删除最旧的条目
        const keys = await this.keys();
        if (keys.length > 0) {
          sessionStorage.removeItem(this.prefix + keys[0]);
        }
      }

      const entry: CacheEntry<T> = {
        data: value,
        timestamp: Date.now(),
        ttl,
        key
      };

      sessionStorage.setItem(this.prefix + key, JSON.stringify(entry));
    } catch {
      // SessionStorage 可能已满，忽略错误
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      sessionStorage.removeItem(this.prefix + key);
      return true;
    } catch {
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await this.keys();
      keys.forEach(key => sessionStorage.removeItem(this.prefix + key));
    } catch {
      // 忽略错误
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const item = sessionStorage.getItem(this.prefix + key);
      if (!item) {
        return false;
      }

      const entry = JSON.parse(item) as CacheEntry<T>;

      if (this.isExpired(entry)) {
        sessionStorage.removeItem(this.prefix + key);
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  async size(): Promise<number> {
    try {
      return (await this.keys()).length;
    } catch {
      return 0;
    }
  }

  async keys(): Promise<string[]> {
    try {
      const keys: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keys.push(key.substring(this.prefix.length));
        }
      }
      return keys;
    } catch {
      return [];
    }
  }

  private isExpired(entry: CacheEntry<T>): boolean {
    if (!entry.ttl) {
      return false;
    }

    return Date.now() - entry.timestamp > entry.ttl;
  }

  private startCleanup(intervalMs: number): void {
    if (typeof window !== 'undefined' && intervalMs > 0) {
      this.cleanupInterval = setInterval(() => {
        this.cleanup();
      }, intervalMs);
    }
  }

  private async cleanup(): Promise<void> {
    try {
      const keys = await this.keys();
      const now = Date.now();

      for (const key of keys) {
        const entry = await this.get(key);
        if (entry === null) {
          continue; // 已过期，已被 get 方法删除
        }
      }
    } catch {
      // 忽略错误
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

/**
 * 缓存工厂类
 */
export class CacheFactory {
  /**
   * 创建内存缓存
   */
  static createMemoryCache<T = any>(maxSize?: number, cleanupIntervalMs?: number): MemoryCache<T> {
    return new MemoryCache<T>(maxSize, cleanupIntervalMs);
  }

  /**
   * 创建 LRU 缓存
   */
  static createLRUCache<T = any>(maxSize?: number, cleanupIntervalMs?: number): LRUCache<T> {
    return new LRUCache<T>(maxSize, cleanupIntervalMs);
  }

  /**
   * 创建 LocalStorage 缓存
   */
  static createLocalStorageCache<T = any>(
    prefix?: string,
    maxSize?: number,
    cleanupIntervalMs?: number
  ): LocalStorageCache<T> {
    return new LocalStorageCache<T>(prefix, maxSize, cleanupIntervalMs);
  }

  /**
   * 创建 SessionStorage 缓存
   */
  static createSessionStorageCache<T = any>(
    prefix?: string,
    maxSize?: number,
    cleanupIntervalMs?: number
  ): SessionStorageCache<T> {
    return new SessionStorageCache<T>(prefix, maxSize, cleanupIntervalMs);
  }

  /**
   * 根据类型创建缓存
   */
  static createCache<T = any>(
    type: 'memory' | 'lru' | 'localStorage' | 'sessionStorage',
    options?: {
      maxSize?: number;
      prefix?: string;
      cleanupIntervalMs?: number;
    }
  ): ICache<T> {
    const { maxSize = 100, prefix = 'http_cache_', cleanupIntervalMs = 60000 } = options || {};

    switch (type) {
      case 'memory':
        return new MemoryCache<T>(maxSize, cleanupIntervalMs);
      case 'lru':
        return new LRUCache<T>(maxSize, cleanupIntervalMs);
      case 'localStorage':
        return new LocalStorageCache<T>(prefix, maxSize, cleanupIntervalMs);
      case 'sessionStorage':
        return new SessionStorageCache<T>(prefix, maxSize, cleanupIntervalMs);
      default:
        return new MemoryCache<T>(maxSize, cleanupIntervalMs);
    }
  }
}