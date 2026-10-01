import type { HttpRequestConfig, HttpError } from '../types';

/**
 * 深度合并对象
 */
export function deepMerge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return { ...target };
  const result = { ...target };
  const source = sources.shift();

  if (isPlainObject(result) && isPlainObject(source)) {
    for (const key in source) {
      if (isPlainObject(source[key])) {
        (result as any)[key] = deepMerge(
          { ...((result as any)[key] || {}) } as Record<string, any>,
          source[key] as Record<string, any>
        );
      } else {
        (result as any)[key] = source[key];
      }
    }
  }

  return deepMerge(result, ...sources);
}

/**
 * 检查是否为对象
 */
export function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item);
}

function isPlainObject(item: any): item is Record<string, any> {
  if (!item || typeof item !== 'object') return false;
  const proto = Object.getPrototypeOf(item);
  return proto === Object.prototype || proto === null;
}

/**
 * URL 参数序列化
 */
export function paramsSerializer(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== null && value !== undefined && value !== '') {
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
  // 处理相对 URL 和绝对 URL
  let fullURL: string;
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    fullURL = url;
  } else if (url) {
    fullURL = baseURL ? baseURL.replace(/\/+$/, '') + '/' + url.replace(/^\/+/, '') : url;
  } else {
    fullURL = baseURL;
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
  const searchParams = new URLSearchParams();

  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value === null || value === undefined || value === '') {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(item => searchParams.append(key, String(item)));
    } else {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

/**
 * 合并 headers
 */
export function mergeHeaders(defaultHeaders: Record<string, string>, customHeaders?: Record<string, string>): Record<string, string> {
  const merged: Record<string, string> = {};

  const applyHeaders = (headers: Record<string, string>) => {
    Object.keys(headers).forEach(key => {
      const value = headers[key];
      if (value !== null && value !== undefined) {
        merged[key.toLowerCase()] = String(value);
      }
    });
  };

  applyHeaders(defaultHeaders);
  if (customHeaders) {
    applyHeaders(customHeaders);
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

  // 获取状态码（优先使用 error.status，其次是 error.response?.status）
  const status = error.status || error.response?.status;

  // 不重试 4xx 错误（除了 408, 429）
  if (status) {
    if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
      return false;
    }
  }

  // 网络错误或超时错误可以重试
  if (!error.response) {
    return true;
  }

  // 5xx 错误可以重试
  if (status !== undefined && status >= 500) {
    return true;
  }

  // 特定的可重试状态码
  const retryableStatuses = [408, 429, 500, 502, 503, 504];
  return status !== undefined && retryableStatuses.includes(status);
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
export const isNode = typeof process !== 'undefined' && Boolean(process.versions?.node);

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
