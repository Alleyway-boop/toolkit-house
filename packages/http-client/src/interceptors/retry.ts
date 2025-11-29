import type { HttpRequestConfig, HttpResponse } from '../types';
import { shouldRetry, getRetryDelay, delay } from '../utils/helpers';

/**
 * 重试拦截器选项
 */
export interface RetryInterceptorOptions {
  /**
   * 最大重试次数
   */
  maxRetries?: number;

  /**
   * 基础重试延迟（毫秒）
   */
  retryDelay?: number;

  /**
   * 重试延迟策略
   */
  retryDelayStrategy?: 'exponential' | 'linear' | 'fixed';

  /**
   * 是否在 4xx 错误时重试
   */
  retryOn4xx?: boolean;

  /**
   * 需要重试的特定状态码
   */
  retryStatusCodes?: number[];

  /**
   * 不需要重试的状态码
   */
  noRetryStatusCodes?: number[];

  /**
   * 自定义重试条件函数
   */
  shouldRetry?: (error: any, attempt: number) => boolean;

  /**
   * 重试前的回调
   */
  onRetry?: (error: any, attempt: number, config: HttpRequestConfig) => void;

  /**
   * 最大重试延迟（毫秒）
   */
  maxRetryDelay?: number;

  /**
   * 添加随机抖动以避免雷群效应
   */
  jitter?: boolean;

  /**
   * 只重试幂等请求（GET, HEAD, OPTIONS, PUT, DELETE）
   */
  retryIdempotentOnly?: boolean;
}

/**
 * 默认重试选项
 */
const DEFAULT_RETRY_OPTIONS: Required<RetryInterceptorOptions> = {
  maxRetries: 3,
  retryDelay: 1000,
  retryDelayStrategy: 'exponential',
  retryOn4xx: false,
  retryStatusCodes: [408, 429, 500, 502, 503, 504],
  noRetryStatusCodes: [],
  shouldRetry: () => false, // 由下面的逻辑决定
  onRetry: () => {},
  maxRetryDelay: 30000,
  jitter: true,
  retryIdempotentOnly: true
};

/**
 * 幂等请求方法
 */
const IDEMPOTENT_METHODS = new Set(['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE']);

/**
 * 计算重试延迟
 */
function calculateRetryDelay(
  attempt: number,
  baseDelay: number,
  strategy: 'exponential' | 'linear' | 'fixed',
  maxDelay: number,
  jitter: boolean
): number {
  let delay: number;

  switch (strategy) {
    case 'exponential':
      delay = baseDelay * Math.pow(2, attempt);
      break;
    case 'linear':
      delay = baseDelay * (attempt + 1);
      break;
    case 'fixed':
      delay = baseDelay;
      break;
    default:
      delay = baseDelay;
  }

  // 添加随机抖动
  if (jitter) {
    delay = delay * (0.5 + Math.random() * 0.5);
  }

  return Math.min(delay, maxDelay);
}

/**
 * 创建重试拦截器
 */
export default function createRetryInterceptor(options: RetryInterceptorOptions = {}) {
  const config = { ...DEFAULT_RETRY_OPTIONS, ...options };

  return {
    /**
     * 响应拦截器 - 处理失败请求的重试逻辑
     */
    onRejected: async (error: any): Promise<HttpResponse> => {
      const originalConfig = error.config;
      if (!originalConfig) {
        throw error;
      }

      // 防止无限重试循环
      if (originalConfig._isRetry) {
        throw error;
      }

      // 获取当前重试次数
      const currentRetry = originalConfig._retryCount || 0;

      // 检查是否应该重试
      if (!shouldRetryRequest(error, currentRetry, config, originalConfig)) {
        throw error;
      }

      // 增加重试计数
      originalConfig._retryCount = currentRetry + 1;
      originalConfig._isRetry = true;

      // 调用重试回调
      config.onRetry(error, currentRetry, originalConfig);

      // 计算延迟
      const retryDelay = calculateRetryDelay(
        currentRetry,
        config.retryDelay,
        config.retryDelayStrategy,
        config.maxRetryDelay,
        config.jitter
      );

      // 等待延迟
      await delay(retryDelay);

      // 这里需要重新发起请求，但由于拦截器的限制，我们修改配置并重新抛出错误
      // 实际的重试逻辑需要在 HttpClient 中实现
      throw error;
    }
  };
}

/**
 * 判断是否应该重试请求
 */
function shouldRetryRequest(
  error: any,
  currentRetry: number,
  config: Required<RetryInterceptorOptions>,
  requestConfig: HttpRequestConfig
): boolean {
  // 检查重试次数限制
  if (currentRetry >= config.maxRetries) {
    return false;
  }

  // 检查是否为幂等请求
  const method = requestConfig.method?.toUpperCase();
  if (config.retryIdempotentOnly && method && !IDEMPOTENT_METHODS.has(method)) {
    return false;
  }

  // 使用自定义重试条件
  if (config.shouldRetry && config.shouldRetry(error, currentRetry)) {
    return true;
  }

  // 检查是否有响应
  if (error.response) {
    const status = error.response.status;

    // 检查特定重试状态码
    if (config.retryStatusCodes.includes(status)) {
      return true;
    }

    // 检查不应重试的状态码
    if (config.noRetryStatusCodes.includes(status)) {
      return false;
    }

    // 4xx 错误处理
    if (status >= 400 && status < 500) {
      return config.retryOn4xx;
    }

    // 5xx 错误通常可以重试
    if (status >= 500) {
      return true;
    }
  }

  // 网络错误、超时错误、取消错误等
  if (error.code === 'ECONNRESET' ||
      error.code === 'ENOTFOUND' ||
      error.code === 'ECONNREFUSED' ||
      error.message?.includes('timeout') ||
      error.message?.includes('Network Error')) {
    return true;
  }

  return false;
}

/**
 * 预定义的常用重试拦截器
 */

/**
 * 网络错误重试拦截器 - 只重试网络错误和 5xx 错误
 */
export function createNetworkRetryInterceptor(options: Partial<RetryInterceptorOptions> = {}) {
  return createRetryInterceptor({
    maxRetries: 3,
    retryDelay: 1000,
    retryOn4xx: false,
    ...options
  });
}

/**
 * 429 状态码重试拦截器 - 专门处理限流
 */
export function createRateLimitRetryInterceptor(options: Partial<RetryInterceptorOptions> = {}) {
  return createRetryInterceptor({
    maxRetries: 5,
    retryDelay: 2000,
    retryStatusCodes: [429],
    retryDelayStrategy: 'exponential',
    ...options
  });
}

/**
 * 短延迟重试拦截器 - 用于快速重试
 */
export function createFastRetryInterceptor(options: Partial<RetryInterceptorOptions> = {}) {
  return createRetryInterceptor({
    maxRetries: 2,
    retryDelay: 100,
    retryDelayStrategy: 'fixed',
    jitter: false,
    ...options
  });
}

/**
 * 慢延迟重试拦截器 - 用于长时间等待的请求
 */
export function createSlowRetryInterceptor(options: Partial<RetryInterceptorOptions> = {}) {
  return createRetryInterceptor({
    maxRetries: 2,
    retryDelay: 5000,
    retryDelayStrategy: 'exponential',
    ...options
  });
}