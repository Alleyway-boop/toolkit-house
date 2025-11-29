import type { HttpRequestConfig, HttpResponse } from '../types';

/**
 * 缓存拦截器选项
 */
export interface CacheInterceptorOptions {
  /**
   * 缓存类型
   */
  type?: 'memory' | 'localStorage' | 'sessionStorage';

  /**
   * 默认缓存时间（毫秒）
   */
  defaultTTL?: number;

  /**
   * 最大缓存条目数
   */
  maxSize?: number;

  /**
   * 缓存键生成函数
   */
  keyGenerator?: (config: HttpRequestConfig) => string;

  /**
   * 是否只缓存 GET 请求
   */
  cacheGetOnly?: boolean;

  /**
   * 需要缓存的 URL 模式
   */
  urlPatterns?: RegExp[];

  /**
   * 不需要缓存的 URL 模式
   */
  excludeUrlPatterns?: RegExp[];

  /**
   * 缓存命中回调
   */
  onCacheHit?: (key: string, response: HttpResponse) => void;

  /**
   * 缓存未命中回调
   */
  onCacheMiss?: (key: string) => void;

  /**
   * 缓存设置回调
   */
  onCacheSet?: (key: string, response: HttpResponse) => void;

  /**
   * 缓存过期回调
   */
  onCacheExpire?: (key: string) => void;

  /**
   * 清理过期缓存的间隔（毫秒）
   */
  cleanupInterval?: number;

  /**
   * 自定义缓存存储
   */
  storage?: {
    get(key: string): any;
    set(key: string, value: any, ttl?: number): void;
    remove(key: string): void;
    clear(): void;
    keys(): string[];
  };
}

/**
 * 缓存条目
 */
interface CacheEntry {
  data: HttpResponse;
  timestamp: number;
  ttl?: number;
  key: string;
}

/**
 * 内存缓存存储
 */
class MemoryCacheStorage {
  private cache = new Map<string, CacheEntry>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: string): CacheEntry | undefined {
    const entry = this.cache.get(key);
    if (!entry) {
      return undefined;
    }

    // 检查是否过期
    if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return entry;
  }

  set(key: string, value: HttpResponse, ttl?: number): void {
    // 检查缓存大小限制
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      // 删除最旧的条目
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    const entry: CacheEntry = {
      data: value,
      timestamp: Date.now(),
      ttl,
      key
    };

    this.cache.set(key, entry);
  }

  remove(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

/**
 * LocalStorage 缓存存储
 */
class LocalStorageCacheStorage {
  private prefix: string;
  private maxSize: number;

  constructor(prefix: string = 'http_cache_', maxSize: number = 50) {
    this.prefix = prefix;
    this.maxSize = maxSize;
  }

  get(key: string): CacheEntry | undefined {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) {
        return undefined;
      }

      const entry = JSON.parse(item) as CacheEntry;

      // 检查是否过期
      if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
        localStorage.removeItem(this.prefix + key);
        return undefined;
      }

      return entry;
    } catch {
      return undefined;
    }
  }

  set(key: string, value: HttpResponse, ttl?: number): void {
    try {
      // 检查缓存大小限制
      if (this.keys().length >= this.maxSize) {
        // 删除最旧的条目
        const keys = this.keys();
        if (keys.length > 0) {
          localStorage.removeItem(this.prefix + keys[0]);
        }
      }

      const entry: CacheEntry = {
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

  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    const keys = this.keys();
    keys.forEach(key => localStorage.removeItem(this.prefix + key));
  }

  keys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keys.push(key.substring(this.prefix.length));
      }
    }
    return keys;
  }
}

/**
 * 创建缓存拦截器
 */
export default function createCacheInterceptor(options: CacheInterceptorOptions = {}) {
  const {
    type = 'memory',
    defaultTTL = 5 * 60 * 1000, // 5分钟
    maxSize = 100,
    keyGenerator,
    cacheGetOnly = true,
    urlPatterns,
    excludeUrlPatterns,
    onCacheHit,
    onCacheMiss,
    onCacheSet,
    onCacheExpire,
    cleanupInterval = 60 * 1000, // 1分钟
    storage: customStorage
  } = options;

  // 创建缓存存储
  const storage = customStorage || (() => {
    switch (type) {
      case 'localStorage':
        return new LocalStorageCacheStorage('http_cache_', maxSize);
      case 'sessionStorage':
        // SessionStorage 与 LocalStorage 类似，使用相同的实现
        return new LocalStorageCacheStorage('http_cache_session_', maxSize);
      case 'memory':
      default:
        return new MemoryCacheStorage(maxSize);
    }
  })();

  // 定期清理过期缓存
  let cleanupTimer: NodeJS.Timeout | null = null;
  if (cleanupInterval > 0) {
    cleanupTimer = setInterval(() => {
      cleanupExpiredCache();
    }, cleanupInterval);
  }

  /**
   * 生成缓存键
   */
  const generateCacheKey = (config: HttpRequestConfig): string => {
    if (keyGenerator) {
      return keyGenerator(config);
    }

    const method = (config.method || 'GET').toUpperCase();
    const url = config.url || '';
    const params = config.params ? JSON.stringify(config.params) : '';
    const data = config.data && method !== 'GET' ? JSON.stringify(config.data) : '';

    return `${method}:${url}:${params}:${data}`;
  };

  /**
   * 检查是否应该缓存请求
   */
  const shouldCache = (config: HttpRequestConfig): boolean => {
    const method = (config.method || 'GET').toUpperCase();

    // 检查是否只缓存 GET 请求
    if (cacheGetOnly && method !== 'GET') {
      return false;
    }

    const url = config.url || '';

    // 检查排除的 URL 模式
    if (excludeUrlPatterns?.some(pattern => pattern.test(url))) {
      return false;
    }

    // 检查包含的 URL 模式
    if (urlPatterns && urlPatterns.length > 0) {
      return urlPatterns.some(pattern => pattern.test(url));
    }

    return true;
  };

  /**
   * 检查是否应该从缓存中读取
   */
  const shouldReadFromCache = (config: HttpRequestConfig): boolean => {
    // 检查是否禁用缓存
    if (config.cache === false) {
      return false;
    }

    // 检查是否设置了 cache-control: no-cache
    const cacheControl = config.headers?.['cache-control'];
    if (cacheControl?.includes('no-cache')) {
      return false;
    }

    return shouldCache(config);
  };

  /**
   * 检查是否应该写入缓存
   */
  const shouldWriteToCache = (response: HttpResponse): boolean => {
    // 只缓存成功的响应
    if (response.status < 200 || response.status >= 300) {
      return false;
    }

    return shouldCache(response.config);
  };

  /**
   * 获取缓存 TTL
   */
  const getCacheTTL = (config: HttpRequestConfig): number | undefined => {
    if (config.cache === false) {
      return undefined;
    }

    if (typeof config.cache === 'object' && config.cache.ttl) {
      return config.cache.ttl;
    }

    return defaultTTL;
  };

  /**
   * 清理过期缓存
   */
  const cleanupExpiredCache = (): void => {
    const keys = storage.keys();
    const now = Date.now();

    keys.forEach(key => {
      const entry = storage.get(key);
      if (entry && entry.ttl && now - entry.timestamp > entry.ttl) {
        storage.remove(key);
        onCacheExpire?.(key);
      }
    });
  };

  const interceptor = {
    /**
     * 请求拦截器 - 检查缓存
     */
    onFulfilled: (config: HttpRequestConfig): HttpRequestConfig => {
      if (!shouldReadFromCache(config)) {
        return config;
      }

      const cacheKey = generateCacheKey(config);
      const cachedEntry = storage.get(cacheKey);

      if (cachedEntry) {
        onCacheHit?.(cacheKey, cachedEntry.data);

        // 标记为从缓存中读取
        (config as any)._cached = true;
        (config as any)._cachedResponse = cachedEntry.data;

        // 如果是缓存命中的请求，可以在这里直接返回
        // 但由于拦截器的限制，我们只能通过设置标记来处理
      } else {
        onCacheMiss?.(cacheKey);
      }

      return config;
    },

    /**
     * 响应拦截器 - 存储到缓存
     */
    onResponseFulfilled: (response: HttpResponse): HttpResponse => {
      if (!shouldWriteToCache(response)) {
        return response;
      }

      const cacheKey = generateCacheKey(response.config);
      const ttl = getCacheTTL(response.config);

      storage.set(cacheKey, response, ttl);
      onCacheSet?.(cacheKey, response);

      return response;
    },

    /**
     * 清理资源
     */
    destroy: (): void => {
      if (cleanupTimer) {
        clearInterval(cleanupTimer);
        cleanupTimer = null;
      }
    }
  };

  // 为了与拦截器接口兼容，将响应处理函数也设置为 onFulfilled
  return {
    onFulfilled: interceptor.onFulfilled,
    // 使用一个函数同时处理请求和响应
    onResponseFulfilled: interceptor.onResponseFulfilled,
    destroy: interceptor.destroy
  } as any;
}

/**
 * 预定义的常用缓存拦截器
 */

/**
 * 内存缓存拦截器
 */
export function createMemoryCacheInterceptor(options: Partial<CacheInterceptorOptions> = {}) {
  return createCacheInterceptor({
    type: 'memory',
    ...options
  });
}

/**
 * LocalStorage 缓存拦截器
 */
export function createLocalStorageCacheInterceptor(options: Partial<CacheInterceptorOptions> = {}) {
  return createCacheInterceptor({
    type: 'localStorage',
    ...options
  });
}

/**
 * 长期缓存拦截器 - 1小时
 */
export function createLongTermCacheInterceptor(options: Partial<CacheInterceptorOptions> = {}) {
  return createCacheInterceptor({
    defaultTTL: 60 * 60 * 1000, // 1小时
    maxSize: 50,
    ...options
  });
}

/**
 * 短期缓存拦截器 - 1分钟
 */
export function createShortTermCacheInterceptor(options: Partial<CacheInterceptorOptions> = {}) {
  return createCacheInterceptor({
    defaultTTL: 60 * 1000, // 1分钟
    maxSize: 200,
    ...options
  });
}