import type { HttpRequestConfig, HttpResponse } from '../types';

/**
 * 日志拦截器选项
 */
export interface LoggingInterceptorOptions {
  /**
   * 日志级别
   */
  level?: 'debug' | 'info' | 'warn' | 'error';

  /**
   * 自定义日志函数
   */
  logger?: (level: string, message: string, data?: any) => void;

  /**
   * 是否记录请求头
   */
  logHeaders?: boolean;

  /**
   * 是否记录响应头
   */
  logResponseHeaders?: boolean;

  /**
   * 是否记录请求体
   */
  logBody?: boolean;

  /**
   * 是否记录响应体
   */
  logResponseBody?: boolean;

  /**
   * 请求体最大日志长度
   */
  maxBodyLength?: number;

  /**
   * 是否格式化 JSON
   */
  formatJson?: boolean;

  /**
   * 是否记录时间戳
   */
  logTimestamp?: boolean;

  /**
   * 是否记录请求耗时
   */
  logDuration?: boolean;

  /**
   * 是否记录请求 ID
   */
  logRequestId?: boolean;

  /**
   * 需要记录的 URL 模式
   */
  urlPatterns?: RegExp[];

  /**
   * 不需要记录的 URL 模式
   */
  excludeUrlPatterns?: RegExp[];

  /**
   * 是否记录错误详情
   */
  logErrorDetails?: boolean;

  /**
   * 请求开始回调
   */
  onRequestStart?: (config: HttpRequestConfig) => void;

  /**
   * 请求成功回调
   */
  onRequestSuccess?: (response: HttpResponse, duration: number) => void;

  /**
   * 请求失败回调
   */
  onRequestError?: (error: any, duration: number) => void;
}

/**
 * 默认日志拦截器选项
 */
const DEFAULT_LOGGING_OPTIONS: Required<LoggingInterceptorOptions> = {
  level: 'info',
  logger: console.log,
  logHeaders: false,
  logResponseHeaders: false,
  logBody: false,
  logResponseBody: false,
  maxBodyLength: 1000,
  formatJson: true,
  logTimestamp: true,
  logDuration: true,
  logRequestId: true,
  urlPatterns: [],
  excludeUrlPatterns: [],
  logErrorDetails: true,
  onRequestStart: () => {},
  onRequestSuccess: () => {},
  onRequestError: () => {}
};

/**
 * 创建日志拦截器
 */
export default function createLoggingInterceptor(options: LoggingInterceptorOptions = {}) {
  const config = { ...DEFAULT_LOGGING_OPTIONS, ...options };

  /**
   * 记录日志
   */
  const log = (level: string, message: string, data?: any): void => {
    config.logger(level, message, data);
  };

  /**
   * 格式化时间戳
   */
  const formatTimestamp = (): string => {
    return new Date().toISOString();
  };

  /**
   * 格式化请求体
   */
  const formatBody = (body: any): string => {
    if (!body) {
      return '';
    }

    let bodyString: string;
    if (typeof body === 'string') {
      bodyString = body;
    } else if (body instanceof FormData) {
      return '[FormData]';
    } else if (body instanceof URLSearchParams) {
      return '[URLSearchParams]';
    } else if (body instanceof Blob) {
      return `[Blob: ${body.type}, ${body.size} bytes]`;
    } else if (body instanceof ArrayBuffer) {
      return `[ArrayBuffer: ${body.byteLength} bytes]`;
    } else {
      bodyString = JSON.stringify(body, null, config.formatJson ? 2 : 0);
    }

    // 限制日志长度
    if (bodyString.length > config.maxBodyLength) {
      bodyString = bodyString.substring(0, config.maxBodyLength) + '...';
    }

    return bodyString;
  };

  /**
   * 生成请求 ID
   */
  const generateRequestId = (): string => {
    return Math.random().toString(36).substr(2, 9);
  };

  /**
   * 检查是否应该记录请求
   */
  const shouldLog = (reqConfig: HttpRequestConfig): boolean => {
    const url = reqConfig.url || '';

    // 检查排除的 URL 模式
    if (config.excludeUrlPatterns?.some(pattern => pattern.test(url))) {
      return false;
    }

    // 检查包含的 URL 模式
    if (config.urlPatterns && config.urlPatterns.length > 0) {
      return config.urlPatterns.some(pattern => pattern.test(url));
    }

    return true;
  };

  /**
   * 检查日志级别
   */
  const shouldLogAtLevel = (targetLevel: string): boolean => {
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(config.level);
    const targetLevelIndex = levels.indexOf(targetLevel);
    return targetLevelIndex >= currentLevelIndex;
  };

  const interceptor = {
    /**
     * 请求拦截器 - 记录请求开始
     */
    onFulfilled: (requestConfig: HttpRequestConfig): HttpRequestConfig => {
      if (!shouldLog(requestConfig)) {
        return requestConfig;
      }

      const requestId = generateRequestId();
      (requestConfig as any)._requestId = requestId;
      (requestConfig as any)._startTime = Date.now();

      let message = `🚀 HTTP ${requestConfig.method?.toUpperCase() || 'GET'} ${requestConfig.url}`;
      if (config.logRequestId) {
        message += ` [${requestId}]`;
      }

      const logData: any = {};

      if (config.logTimestamp) {
        logData.timestamp = formatTimestamp();
      }

      if (requestConfig.params) {
        logData.params = requestConfig.params;
      }

      if (config.logHeaders && requestConfig.headers) {
        logData.headers = requestConfig.headers;
      }

      if (config.logBody && requestConfig.data) {
        logData.body = formatBody(requestConfig.data);
      }

      if (shouldLogAtLevel('info')) {
        log('info', message, Object.keys(logData).length > 0 ? logData : undefined);
      }

      config.onRequestStart(requestConfig);

      return requestConfig;
    },

    /**
     * 响应拦截器 - 记录请求完成
     */
    onResponseFulfilled: (response: HttpResponse): HttpResponse => {
      if (!shouldLog(response.config)) {
        return response;
      }

      const startTime = (response.config as any)._startTime;
      const requestId = (response.config as any)._requestId;
      const duration = startTime ? Date.now() - startTime : 0;

      let message = `✅ HTTP ${response.config.method?.toUpperCase() || 'GET'} ${response.config.url} ${response.status}`;
      if (config.logRequestId && requestId) {
        message += ` [${requestId}]`;
      }
      if (config.logDuration && duration > 0) {
        message += ` (${duration}ms)`;
      }

      const logData: any = {};

      if (config.logTimestamp) {
        logData.timestamp = formatTimestamp();
      }

      logData.status = response.status;
      logData.statusText = response.statusText;

      if (config.logResponseHeaders && response.headers) {
        logData.headers = response.headers;
      }

      if (config.logResponseBody && response.data) {
        logData.data = formatBody(response.data);
      }

      if (response.fromCache) {
        logData.fromCache = true;
      }

      if (shouldLogAtLevel('info')) {
        log('info', message, Object.keys(logData).length > 0 ? logData : undefined);
      }

      config.onRequestSuccess(response, duration);

      return response;
    },

    /**
     * 错误拦截器 - 记录请求错误
     */
    onRejected: (error: any): Promise<never> => {
      if (!error.config || !shouldLog(error.config)) {
        return Promise.reject(error);
      }

      const startTime = (error.config as any)._startTime;
      const requestId = (error.config as any)._requestId;
      const duration = startTime ? Date.now() - startTime : 0;

      let message = `❌ HTTP ${error.config.method?.toUpperCase() || 'GET'} ${error.config.url}`;
      if (error.response) {
        message += ` ${error.response.status}`;
      }
      if (config.logRequestId && requestId) {
        message += ` [${requestId}]`;
      }
      if (config.logDuration && duration > 0) {
        message += ` (${duration}ms)`;
      }

      const logData: any = {};

      if (config.logTimestamp) {
        logData.timestamp = formatTimestamp();
      }

      if (error.response) {
        logData.response = {
          status: error.response.status,
          statusText: error.response.statusText
        };

        if (config.logResponseHeaders && error.response.headers) {
          logData.response.headers = error.response.headers;
        }

        if (config.logErrorDetails && error.response.data) {
          logData.response.data = formatBody(error.response.data);
        }
      }

      if (config.logErrorDetails) {
        logData.error = {
          message: error.message,
          code: error.code,
          stack: error.stack
        };
      }

      if (shouldLogAtLevel('error')) {
        log('error', message, Object.keys(logData).length > 0 ? logData : undefined);
      }

      config.onRequestError(error, duration);

      return Promise.reject(error);
    }
  };

  // 为了与拦截器接口兼容，将响应处理函数也设置为 onFulfilled
  return {
    onFulfilled: interceptor.onFulfilled,
    onResponseFulfilled: interceptor.onResponseFulfilled,
    onRejected: interceptor.onRejected
  } as any;
}

/**
 * 预定义的常用日志拦截器
 */

/**
 * 简单日志拦截器 - 只记录基本信息
 */
export function createSimpleLoggingInterceptor(options: Partial<LoggingInterceptorOptions> = {}) {
  return createLoggingInterceptor({
    level: 'info',
    logHeaders: false,
    logBody: false,
    logResponseHeaders: false,
    logResponseBody: false,
    ...options
  });
}

/**
 * 详细日志拦截器 - 记录所有信息
 */
export function createDetailedLoggingInterceptor(options: Partial<LoggingInterceptorOptions> = {}) {
  return createLoggingInterceptor({
    level: 'debug',
    logHeaders: true,
    logBody: true,
    logResponseHeaders: true,
    logResponseBody: true,
    formatJson: true,
    ...options
  });
}

/**
 * 错误日志拦截器 - 只记录错误
 */
export function createErrorLoggingInterceptor(options: Partial<LoggingInterceptorOptions> = {}) {
  return {
    onFulfilled: (response: HttpResponse) => response, // 不记录成功请求
    onRejected: (error: any) => {
      const config = { ...DEFAULT_LOGGING_OPTIONS, level: 'error', ...options };

      if (config.logTimestamp) {
        console.error(`[ERROR] ${new Date().toISOString()} HTTP ${error.config?.method?.toUpperCase() || 'GET'} ${error.config?.url}`, error);
      } else {
        console.error(`[ERROR] HTTP ${error.config?.method?.toUpperCase() || 'GET'} ${error.config?.url}`, error);
      }

      return Promise.reject(error);
    }
  };
}

/**
 * 性能监控拦截器 - 记录请求性能
 */
export function createPerformanceLoggingInterceptor(options: Partial<LoggingInterceptorOptions> = {}) {
  return createLoggingInterceptor({
    level: 'warn',
    logDuration: true,
    logRequestId: true,
    logTimestamp: true,
    logHeaders: false,
    logBody: false,
    logResponseHeaders: false,
    logResponseBody: false,
    ...options
  });
}