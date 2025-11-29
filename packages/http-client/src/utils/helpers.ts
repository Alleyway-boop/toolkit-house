import type { HttpRequestConfig, HttpError } from '../types';

/**
 * 深度合并对象
 */
export function deepMerge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

/**
 * 检查是否为对象
 */
export function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * URL 参数序列化
 */
export function paramsSerializer(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
}

/**
 * 构建完整 URL
 */
export function buildURL(baseURL: string, url?: string, params?: Record<string, any>, paramsSerializer?: (params: Record<string, any>) => string): string {
  if (!url) return baseURL;

  // 处理相对 URL 和绝对 URL
  let fullURL: string;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    fullURL = url;
  } else {
    fullURL = baseURL ? baseURL.replace(/\/+$/, '') + '/' + url.replace(/^\/+/, '') : url;
  }

  // 添加查询参数
  if (params) {
    const serializedParams = paramsSerializer ? paramsSerializer(params) : defaultParamsSerializer(params);
    if (serializedParams) {
      const hashmarkIndex = fullURL.indexOf('#');
      if (hashmarkIndex !== -1) {
        fullURL = fullURL.slice(0, hashmarkIndex);
      }
      fullURL += (fullURL.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }
  }

  return fullURL;
}

/**
 * 默认参数序列化器
 */
export function defaultParamsSerializer(params: Record<string, any>): string {
  const parts: string[] = [];

  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value === null || typeof value === 'undefined') {
      return;
    }

    if (Array.isArray(value)) {
      key += '[]';
    }

    if (Array.isArray(value)) {
      value.forEach(item => {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
      });
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  });

  return parts.join('&');
}

/**
 * 合并 headers
 */
export function mergeHeaders(defaultHeaders: Record<string, string>, customHeaders?: Record<string, string>): Record<string, string> {
  const merged = { ...defaultHeaders };

  if (customHeaders) {
    Object.keys(customHeaders).forEach(key => {
      const value = customHeaders[key];
      if (value !== null && value !== undefined) {
        merged[key.toLowerCase()] = String(value);
      }
    });
  }

  return merged;
}

/**
 * 规范化 header 名称为小写
 */
export function normalizeHeaders(headers: Record<string, string>): Record<string, string> {
  const normalized: Record<string, string> = {};

  Object.keys(headers).forEach(key => {
    const value = headers[key];
    if (value !== null && value !== undefined) {
      normalized[key.toLowerCase()] = String(value);
    }
  });

  return normalized;
}

/**
 * 创建 HTTP 错误
 */
export function createHttpError(
  message: string,
  config: HttpRequestConfig,
  code?: string,
  request?: any,
  response?: any
): HttpError {
  const error = new Error(message) as HttpError;
  error.config = config;
  error.code = code;
  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  if (response) {
    error.status = response.status;
    error.statusText = response.statusText;
  }

  return error;
}

/**
 * 检查状态码是否表示成功
 */
export function isStatusSuccess(status: number, validateStatus?: (status: number) => boolean): boolean {
  if (validateStatus) {
    return validateStatus(status);
  }
  return status >= 200 && status < 300;
}

/**
 * 生成唯一请求 ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 延迟函数
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 重试延迟策略
 */
export function getRetryDelay(attempt: number, baseDelay: number = 1000): number {
  // 指数退避策略：delay = baseDelay * 2^attempt + jitter
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * baseDelay; // 添加随机抖动避免雷群效应
  return Math.min(exponentialDelay + jitter, 30000); // 最大延迟30秒
}

/**
 * 检查是否应该重试
 */
export function shouldRetry(error: HttpError, attempt: number, maxRetries: number): boolean {
  if (attempt >= maxRetries) {
    return false;
  }

  // 不重试 4xx 错误（除了 408, 429）
  if (error.response && error.status) {
    if (error.status >= 400 && error.status < 500 && error.status !== 408 && error.status !== 429) {
      return false;
    }
  }

  // 网络错误或超时错误可以重试
  if (!error.response) {
    return true;
  }

  // 5xx 错误可以重试
  if (error.status >= 500) {
    return true;
  }

  // 特定的可重试状态码
  const retryableStatuses = [408, 429, 500, 502, 503, 504];
  return retryableStatuses.includes(error.status);
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 检查是否为浏览器环境
 */
export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * 检查是否为 Node.js 环境
 */
export const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

/**
 * 获取默认 User-Agent
 */
export function getDefaultUserAgent(): string {
  if (isBrowser) {
    return navigator.userAgent;
  }

  if (isNode) {
    const processVersion = process.version;
    const platformInfo = process.platform;
    return `Node.js/${processVersion} (${platformInfo})`;
  }

  return 'HttpClient/1.0.0';
}