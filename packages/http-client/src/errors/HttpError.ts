import type { HttpRequestConfig, HttpResponse } from '../types';

/**
 * HTTP 错误类
 * 扩展 Error 类，提供更详细的 HTTP 请求错误信息
 */
export class HttpError extends Error {
  /**
   * 错误配置
   */
  public config: HttpRequestConfig;

  /**
   * 错误代码
   */
  public code?: string;

  /**
   * 请求对象
   */
  public request?: any;

  /**
   * 响应对象
   */
  public response?: HttpResponse;

  /**
   * 是否为 Axios 兼容错误
   */
  public isAxiosError: boolean = true;

  /**
   * HTTP 状态码
   */
  public status?: number;

  /**
   * HTTP 状态文本
   */
  public statusText?: string;

  /**
   * 错误类型
   */
  public type: ErrorType;

  /**
   * 重试次数
   */
  public retryCount?: number;

  /**
   * 是否为超时错误
   */
  public isTimeout?: boolean;

  /**
   * 是否为网络错误
   */
  public isNetworkError?: boolean;

  /**
   * 是否为取消错误
   */
  public isCanceled?: boolean;

  /**
   * 原始错误
   */
  public originalError?: Error;

  constructor(
    message: string,
    config: HttpRequestConfig,
    code?: string,
    request?: any,
    response?: HttpResponse,
    type: ErrorType = ErrorType.UNKNOWN
  ) {
    super(message);
    this.name = 'HttpError';
    this.config = config;
    this.code = code;
    this.request = request;
    this.response = response;
    this.type = type;

    // 设置响应状态信息
    if (response) {
      this.status = response.status;
      this.statusText = response.statusText;
    }

    // 根据错误类型设置标志
    this.setErrorFlags(code, type);

    // 确保堆栈跟踪正确
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * 设置错误标志
   */
  private setErrorFlags(code?: string, type?: ErrorType): void {
    // 超时错误
    if (code === 'ECONNABORTED' || type === ErrorType.TIMEOUT) {
      this.isTimeout = true;
    }

    // 网络错误
    if (
      code === 'ENOTFOUND' ||
      code === 'ECONNREFUSED' ||
      code === 'ECONNRESET' ||
      type === ErrorType.NETWORK
    ) {
      this.isNetworkError = true;
    }

    // 取消错误
    if (type === ErrorType.CANCEL) {
      this.isCanceled = true;
    }
  }

  /**
   * 获取错误描述
   */
  public getDescription(): string {
    let description = this.message;

    if (this.status) {
      description += ` (Status: ${this.status}`;
      if (this.statusText) {
        description += ` ${this.statusText}`;
      }
      description += ')';
    }

    if (this.code) {
      description += ` [Code: ${this.code}]`;
    }

    if (this.type !== ErrorType.UNKNOWN) {
      description += ` [Type: ${this.type}]`;
    }

    return description;
  }

  /**
   * 判断是否为客户端错误 (4xx)
   */
  public isClientError(): boolean {
    return this.status !== undefined && this.status >= 400 && this.status < 500;
  }

  /**
   * 判断是否为服务器错误 (5xx)
   */
  public isServerError(): boolean {
    return this.status !== undefined && this.status >= 500 && this.status < 600;
  }

  /**
   * 判断是否为可重试错误
   */
  public isRetryable(): boolean {
    // 网络错误和超时错误通常可以重试
    if (this.isNetworkError || this.isTimeout) {
      return true;
    }

    // 服务器错误通常可以重试
    if (this.isServerError()) {
      return true;
    }

    // 某些客户端错误可以重试
    const retryableStatuses = [408, 429];
    return this.status !== undefined && retryableStatuses.includes(this.status);
  }

  /**
   * 获取用户友好的错误消息
   */
  public getUserFriendlyMessage(): string {
    if (this.isTimeout) {
      return '请求超时，请检查网络连接后重试';
    }

    if (this.isNetworkError) {
      return '网络连接失败，请检查网络设置';
    }

    if (this.isCanceled) {
      return '请求已取消';
    }

    if (this.status === 401) {
      return '身份验证失败，请重新登录';
    }

    if (this.status === 403) {
      return '没有权限访问此资源';
    }

    if (this.status === 404) {
      return '请求的资源不存在';
    }

    if (this.status === 429) {
      return '请求过于频繁，请稍后重试';
    }

    if (this.isServerError()) {
      return '服务器暂时无法响应，请稍后重试';
    }

    return this.message || '请求失败，请重试';
  }

  /**
   * 转换为 JSON 对象
   */
  public toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      status: this.status,
      statusText: this.statusText,
      code: this.code,
      config: this.config,
      request: this.request,
      response: this.response,
      retryCount: this.retryCount,
      isTimeout: this.isTimeout,
      isNetworkError: this.isNetworkError,
      isCanceled: this.isCanceled,
      stack: this.stack
    };
  }

  /**
   * 从 JSON 对象创建 HttpError
   */
  static fromJSON(json: Record<string, any>): HttpError {
    const error = new HttpError(
      json.message || 'Unknown error',
      json.config || {},
      json.code,
      json.request,
      json.response,
      json.type || ErrorType.UNKNOWN
    );

    error.status = json.status;
    error.statusText = json.statusText;
    error.retryCount = json.retryCount;
    error.isTimeout = json.isTimeout;
    error.isNetworkError = json.isNetworkError;
    error.isCanceled = json.isCanceled;
    error.stack = json.stack;

    return error;
  }
}

/**
 * 错误类型枚举
 */
export enum ErrorType {
  UNKNOWN = 'UNKNOWN',
  NETWORK = 'NETWORK',
  TIMEOUT = 'TIMEOUT',
  CANCEL = 'CANCEL',
  PARSE = 'PARSE',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  PAYLOAD_TOO_LARGE = 'PAYLOAD_TOO_LARGE',
  UNSUPPORTED_MEDIA_TYPE = 'UNSUPPORTED_MEDIA_TYPE'
}

/**
 * 网络错误
 */
export class NetworkError extends HttpError {
  constructor(message: string, config: HttpRequestConfig, code?: string) {
    super(message, config, code, undefined, undefined, ErrorType.NETWORK);
    this.name = 'NetworkError';
    this.isNetworkError = true;
  }
}

/**
 * 超时错误
 */
export class TimeoutError extends HttpError {
  constructor(message: string, config: HttpRequestConfig) {
    super(message, config, 'ECONNABORTED', undefined, undefined, ErrorType.TIMEOUT);
    this.name = 'TimeoutError';
    this.isTimeout = true;
  }
}

/**
 * 取消错误
 */
export class CancelError extends HttpError {
  constructor(message: string = 'Request canceled', config?: HttpRequestConfig) {
    super(message, config || {}, undefined, undefined, undefined, ErrorType.CANCEL);
    this.name = 'CancelError';
    this.isCanceled = true;
  }
}

/**
 * 解析错误
 */
export class ParseError extends HttpError {
  constructor(message: string, config: HttpRequestConfig, response?: HttpResponse) {
    super(message, config, undefined, undefined, response, ErrorType.PARSE);
    this.name = 'ParseError';
  }
}

/**
 * 验证错误
 */
export class ValidationError extends HttpError {
  constructor(message: string, config: HttpRequestConfig) {
    super(message, config, undefined, undefined, undefined, ErrorType.VALIDATION);
    this.name = 'ValidationError';
  }
}

/**
 * 认证错误
 */
export class AuthenticationError extends HttpError {
  constructor(message: string, config: HttpRequestConfig, response?: HttpResponse) {
    super(message, config, undefined, undefined, response, ErrorType.AUTHENTICATION);
    this.name = 'AuthenticationError';
  }
}

/**
 * 授权错误
 */
export class AuthorizationError extends HttpError {
  constructor(message: string, config: HttpRequestConfig, response?: HttpResponse) {
    super(message, config, undefined, undefined, response, ErrorType.AUTHORIZATION);
    this.name = 'AuthorizationError';
  }
}

/**
 * 404 错误
 */
export class NotFoundError extends HttpError {
  constructor(message: string, config: HttpRequestConfig, response?: HttpResponse) {
    super(message, config, undefined, undefined, response, ErrorType.NOT_FOUND);
    this.name = 'NotFoundError';
  }
}

/**
 * 服务器错误
 */
export class ServerError extends HttpError {
  constructor(message: string, config: HttpRequestConfig, response?: HttpResponse) {
    super(message, config, undefined, undefined, response, ErrorType.SERVER_ERROR);
    this.name = 'ServerError';
  }
}

/**
 * 限流错误
 */
export class RateLimitError extends HttpError {
  constructor(message: string, config: HttpRequestConfig, response?: HttpResponse) {
    super(message, config, undefined, undefined, response, ErrorType.RATE_LIMIT);
    this.name = 'RateLimitError';
  }
}

/**
 * 请求体过大错误
 */
export class PayloadTooLargeError extends HttpError {
  constructor(message: string, config: HttpRequestConfig, response?: HttpResponse) {
    super(message, config, undefined, undefined, response, ErrorType.PAYLOAD_TOO_LARGE);
    this.name = 'PayloadTooLargeError';
  }
}

/**
 * 不支持的媒体类型错误
 */
export class UnsupportedMediaTypeError extends HttpError {
  constructor(message: string, config: HttpRequestConfig, response?: HttpResponse) {
    super(message, config, undefined, undefined, response, ErrorType.UNSUPPORTED_MEDIA_TYPE);
    this.name = 'UnsupportedMediaTypeError';
  }
}

/**
 * 错误工厂类
 */
export class ErrorFactory {
  /**
   * 根据 HTTP 状态码创建相应的错误
   */
  static createFromStatus(
    status: number,
    message: string,
    config: HttpRequestConfig,
    response?: HttpResponse
  ): HttpError {
    switch (status) {
      case 400:
        return new ValidationError(message, config);
      case 401:
        return new AuthenticationError(message, config, response);
      case 403:
        return new AuthorizationError(message, config, response);
      case 404:
        return new NotFoundError(message, config, response);
      case 413:
        return new PayloadTooLargeError(message, config, response);
      case 415:
        return new UnsupportedMediaTypeError(message, config, response);
      case 429:
        return new RateLimitError(message, config, response);
      default:
        if (status >= 500) {
          return new ServerError(message, config, response);
        }
        return new HttpError(message, config, undefined, undefined, response, ErrorType.UNKNOWN);
    }
  }

  /**
   * 根据错误代码创建相应的错误
   */
  static createFromCode(
    code: string,
    message: string,
    config: HttpRequestConfig
  ): HttpError {
    switch (code) {
      case 'ECONNABORTED':
        return new TimeoutError(message, config);
      case 'ENOTFOUND':
      case 'ECONNREFUSED':
      case 'ECONNRESET':
        return new NetworkError(message, config, code);
      default:
        return new NetworkError(message, config, code);
    }
  }

  /**
   * 创建网络错误
   */
  static createNetworkError(message: string, config: HttpRequestConfig, code?: string): NetworkError {
    return new NetworkError(message, config, code);
  }

  /**
   * 创建超时错误
   */
  static createTimeoutError(message: string, config: HttpRequestConfig): TimeoutError {
    return new TimeoutError(message, config);
  }

  /**
   * 创建取消错误
   */
  static createCancelError(message?: string, config?: HttpRequestConfig): CancelError {
    return new CancelError(message, config);
  }

  /**
   * 创建解析错误
   */
  static createParseError(message: string, config: HttpRequestConfig, response?: HttpResponse): ParseError {
    return new ParseError(message, config, response);
  }
}