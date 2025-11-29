import type { HttpRequestConfig, HttpResponse, RequestInterceptor, ResponseInterceptor } from '../types';

/**
 * 拦截器管理器 - 请求拦截器
 */
export class RequestInterceptorManager {
  private interceptors: RequestInterceptor[] = [];

  /**
   * 添加拦截器
   */
  use(
    onFulfilled?: (config: HttpRequestConfig) => HttpRequestConfig | Promise<HttpRequestConfig>,
    onRejected?: (error: any) => any
  ): number {
    this.interceptors.push({ onFulfilled, onRejected });
    return this.interceptors.length - 1;
  }

  /**
   * 移除拦截器
   */
  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors.splice(id, 1);
    }
  }

  /**
   * 清除所有拦截器
   */
  clear(): void {
    this.interceptors = [];
  }

  /**
   * 遍历所有拦截器
   */
  forEach(fn: (interceptor: RequestInterceptor) => void): void {
    this.interceptors.forEach(fn);
  }

  /**
   * 获取所有拦截器
   */
  getAll(): RequestInterceptor[] {
    return [...this.interceptors];
  }
}

/**
 * 拦截器管理器 - 响应拦截器
 */
export class ResponseInterceptorManager {
  private interceptors: ResponseInterceptor[] = [];

  /**
   * 添加拦截器
   */
  use(
    onFulfilled?: (response: HttpResponse) => HttpResponse | Promise<HttpResponse>,
    onRejected?: (error: any) => any
  ): number {
    this.interceptors.push({ onFulfilled, onRejected });
    return this.interceptors.length - 1;
  }

  /**
   * 移除拦截器
   */
  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors.splice(id, 1);
    }
  }

  /**
   * 清除所有拦截器
   */
  clear(): void {
    this.interceptors = [];
  }

  /**
   * 遍历所有拦截器
   */
  forEach(fn: (interceptor: ResponseInterceptor) => void): void {
    this.interceptors.forEach(fn);
  }

  /**
   * 获取所有拦截器
   */
  getAll(): ResponseInterceptor[] {
    return [...this.interceptors];
  }
}

/**
 * 通用拦截器管理器接口
 */
export interface InterceptorManager<T> {
  use(onFulfilled?: (value: T) => T | Promise<T>, onRejected?: (error: any) => any): number;
  eject(id: number): void;
  clear(): void;
}

// 导出常用拦截器
import createAuthInterceptorDefault from './auth';
import createRetryInterceptorDefault from './retry';
import createCacheInterceptorDefault from './cache';
import createLoggingInterceptorDefault from './logging';

export { default as authInterceptor } from './auth';
export { createBearerAuthInterceptor, createBasicAuthInterceptor, createApiKeyAuthInterceptor } from './auth';
export { createAuthInterceptorDefault as createAuthInterceptor };

export { default as retryInterceptor } from './retry';
export { createNetworkRetryInterceptor, createRateLimitRetryInterceptor, createFastRetryInterceptor, createSlowRetryInterceptor } from './retry';
export { createRetryInterceptorDefault as createRetryInterceptor };

export { default as cacheInterceptor } from './cache';
export { createMemoryCacheInterceptor, createLocalStorageCacheInterceptor, createLongTermCacheInterceptor, createShortTermCacheInterceptor } from './cache';
export { createCacheInterceptorDefault as createCacheInterceptor };

export { default as loggingInterceptor } from './logging';
export { createSimpleLoggingInterceptor, createDetailedLoggingInterceptor, createErrorLoggingInterceptor, createPerformanceLoggingInterceptor } from './logging';
export { createLoggingInterceptorDefault as createLoggingInterceptor };