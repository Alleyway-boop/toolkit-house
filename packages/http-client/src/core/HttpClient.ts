import { RequestPool } from '@toolkit-house/ts-utils';
import type {
  HttpClientOptions,
  HttpRequestConfig,
  HttpResponse,
  HttpError,
  HttpMethod,
  RequestInterceptor,
  ResponseInterceptor,
  InterceptorManager,
  RequestMetadata,
  ProgressEvent
} from '../types';
import {
  buildURL,
  mergeHeaders,
  deepMerge,
  generateRequestId,
  shouldRetry,
  getRetryDelay,
  createHttpError,
  isStatusSuccess,
  paramsSerializer as defaultParamsSerializer,
  delay,
  isBrowser
} from '../utils/helpers';

/**
 * HTTP Client 核心类
 * 基于 ts-utils RequestPool 的并发控制
 */
export class HttpClient {
  private defaults: HttpClientOptions;
  private pool: RequestPool;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private cache = new Map<string, any>();
  private pendingRequests = new Map<string, Promise<any>>();

  constructor(options: HttpClientOptions = {}) {
    this.defaults = {
      timeout: 10000,
      retryCount: 3,
      retryDelay: 1000,
      poolSize: 10,
      responseType: 'json',
      validateStatus: (status) => status >= 200 && status < 300,
      transformRequest: [(data, headers) => {
        // 默认转换器：如果 data 是对象且没有设置 Content-Type，则设置为 application/json
        if (headers && typeof data === 'object' && data !== null && !headers['content-type']) {
          headers['content-type'] = 'application/json';
        }
        return data;
      }],
      transformResponse: [(data) => data],
      paramsSerializer: defaultParamsSerializer,
      ...options
    };

    // 初始化请求池，控制并发数
    this.pool = new RequestPool(this.defaults.poolSize || 10);
  }

  /**
   * 发起 HTTP 请求的核心方法
   */
  async request<T = any>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
    const startTime = Date.now();
    const requestId = generateRequestId();
    const finalConfig = this.mergeConfig(config);

    try {
      // 构建完整 URL
      const fullURL = buildURL(
        finalConfig.baseURL || '',
        finalConfig.url,
        finalConfig.params,
        finalConfig.paramsSerializer
      );

      // 检查缓存
      if (finalConfig.cache) {
        const cacheKey = this.getCacheKey(finalConfig);
        const cached = this.cache.get(cacheKey);
        if (cached && !this.isCacheExpired(cached)) {
          return {
            ...cached.data,
            fromCache: true,
            duration: Date.now() - startTime
          };
        }
      }

      // 检查是否已有相同的请求在进行中（请求去重）
      const deduplicationKey = this.getDeduplicationKey(finalConfig);
      if (this.pendingRequests.has(deduplicationKey)) {
        return this.pendingRequests.get(deduplicationKey);
      }

      // 使用请求池来控制并发
      const requestPromise = this.pool.add(() =>
        this.executeRequest<T>(finalConfig, fullURL, requestId, startTime)
      );

      this.pendingRequests.set(deduplicationKey, requestPromise);

      try {
        const response = await requestPromise;
        return response;
      } finally {
        this.pendingRequests.delete(deduplicationKey);
      }
    } catch (error) {
      throw this.enhanceError(error as HttpError, finalConfig);
    }
  }

  /**
   * 执行实际的网络请求
   */
  private async executeRequest<T>(
    config: HttpRequestConfig,
    url: string,
    requestId: string,
    startTime: number
  ): Promise<HttpResponse<T>> {
    let lastError: HttpError | null = null;
    let attempt = 0;
    const maxRetries = config.retryCount || this.defaults.retryCount || 0;

    while (attempt <= maxRetries) {
      try {
        // 应用请求拦截器
        const processedConfig = await this.applyRequestInterceptors(config);

        // 构建请求选项
        const fetchOptions: RequestInit = {
          method: processedConfig.method || 'GET',
          headers: this.normalizeHeaders(processedConfig.headers || {}),
          signal: processedConfig.signal,
          body: this.prepareRequestBody(processedConfig)
        };

        // 设置超时
        const timeout = processedConfig.timeout || this.defaults.timeout;
        let timeoutId: NodeJS.Timeout | null = null;
        if (timeout && !processedConfig.signal) {
          const controller = new AbortController();
          fetchOptions.signal = controller.signal;
          timeoutId = setTimeout(() => controller.abort(), timeout);
        }

        try {
          // 发起请求
          const response = await fetch(url, fetchOptions);

          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          // 读取响应
          const responseData = await this.parseResponse<T>(response, processedConfig);

          // 构建响应对象
          const httpResponse: HttpResponse<T> = {
            data: responseData,
            status: response.status,
            statusText: response.statusText,
            headers: this.parseHeaders(response.headers),
            config: processedConfig,
            request: requestId,
            duration: Date.now() - startTime,
            fromCache: false
          };

          // 检查状态码
          const validateStatus = processedConfig.validateStatus || this.defaults.validateStatus;
          if (!isStatusSuccess(response.status, validateStatus)) {
            throw createHttpError(
              `Request failed with status code ${response.status}`,
              processedConfig,
              undefined,
              requestId,
              httpResponse
            );
          }

          // 缓存响应
          if (processedConfig.cache) {
            const cacheKey = this.getCacheKey(processedConfig);
            this.cache.set(cacheKey, {
              data: httpResponse,
              timestamp: Date.now(),
              ttl: typeof processedConfig.cache === 'object' ? processedConfig.cache.ttl : undefined,
              key: cacheKey
            });
          }

          // 应用响应拦截器
          return await this.applyResponseInterceptors(httpResponse);

        } catch (fetchError) {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          const httpError = this.createHttpErrorFromFetch(fetchError, processedConfig, requestId);

          // 检查是否应该重试
          if (attempt < maxRetries && shouldRetry(httpError, attempt, maxRetries)) {
            const retryDelay = getRetryDelay(attempt, processedConfig.retryDelay || this.defaults.retryDelay);
            await delay(retryDelay);
            attempt++;
            lastError = httpError;
            continue;
          }

          throw httpError;
        }

      } catch (error) {
        if (attempt < maxRetries && shouldRetry(error as HttpError, attempt, maxRetries)) {
          const retryDelay = getRetryDelay(attempt, config.retryDelay || this.defaults.retryDelay);
          await delay(retryDelay);
          attempt++;
          lastError = error as HttpError;
          continue;
        }
        throw error;
      }
    }

    throw lastError;
  }

  /**
   * 合并配置
   */
  private mergeConfig(config: HttpRequestConfig): HttpRequestConfig {
    return deepMerge({}, this.defaults, config);
  }

  /**
   * 应用请求拦截器
   */
  private async applyRequestInterceptors(config: HttpRequestConfig): Promise<HttpRequestConfig> {
    let processedConfig = { ...config };

    for (const interceptor of this.requestInterceptors) {
      if (interceptor.onFulfilled) {
        processedConfig = await interceptor.onFulfilled(processedConfig);
      }
    }

    return processedConfig;
  }

  /**
   * 应用响应拦截器
   */
  private async applyResponseInterceptors<T>(response: HttpResponse<T>): Promise<HttpResponse<T>> {
    let processedResponse = { ...response };

    for (const interceptor of this.responseInterceptors) {
      if (interceptor.onFulfilled) {
        processedResponse = await interceptor.onFulfilled(processedResponse);
      }
    }

    return processedResponse;
  }

  /**
   * 准备请求体
   */
  private prepareRequestBody(config: HttpRequestConfig): BodyInit | null {
    if (!config.data) {
      return null;
    }

    const contentType = (config.headers || {})['content-type'];

    // 处理 FormData
    if (config.data instanceof FormData) {
      return config.data;
    }

    // 处理 URLSearchParams
    if (config.data instanceof URLSearchParams) {
      return config.data;
    }

    // 处理 Blob
    if (config.data instanceof Blob) {
      return config.data;
    }

    // 处理 ArrayBuffer
    if (config.data instanceof ArrayBuffer) {
      return config.data;
    }

    // 处理 ReadableStream (仅浏览器)
    if (isBrowser && config.data instanceof ReadableStream) {
      return config.data;
    }

    // 应用请求转换器
    const transformedData = this.applyRequestTransformers(config.data, config.headers || {});

    // 根据内容类型序列化数据
    if (contentType?.includes('application/json')) {
      return JSON.stringify(transformedData);
    }

    if (contentType?.includes('application/x-www-form-urlencoded')) {
      return new URLSearchParams(transformedData).toString();
    }

    return transformedData;
  }

  /**
   * 解析响应
   */
  private async parseResponse<T>(response: Response, config: HttpRequestConfig): Promise<T> {
    const responseType = config.responseType || this.defaults.responseType || 'json';

    let data: any;

    switch (responseType) {
      case 'json':
        try {
          data = await response.json();
        } catch {
          data = await response.text();
        }
        break;
      case 'text':
        data = await response.text();
        break;
      case 'blob':
        data = await response.blob();
        break;
      case 'arrayBuffer':
        data = await response.arrayBuffer();
        break;
      default:
        data = await response.json();
    }

    // 应用响应转换器
    return this.applyResponseTransformers(data);
  }

  /**
   * 应用请求转换器
   */
  private applyRequestTransformers(data: any, headers: Record<string, string>): any {
    const transformers = this.defaults.transformRequest || [];
    let transformedData = data;

    for (const transformer of transformers) {
      transformedData = transformer(transformedData, headers);
    }

    return transformedData;
  }

  /**
   * 应用响应转换器
   */
  private applyResponseTransformers(data: any): any {
    const transformers = this.defaults.transformResponse || [];
    let transformedData = data;

    for (const transformer of transformers) {
      transformedData = transformer(transformedData);
    }

    return transformedData;
  }

  /**
   * 规范化 headers
   */
  private normalizeHeaders(headers: Record<string, string>): HeadersInit {
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
   * 解析响应头
   */
  private parseHeaders(headers: Headers): Record<string, string> {
    const parsed: Record<string, string> = {};

    headers.forEach((value, key) => {
      parsed[key] = value;
    });

    return parsed;
  }

  /**
   * 创建 Fetch 错误的 HTTP 错误
   */
  private createHttpErrorFromFetch(error: any, config: HttpRequestConfig, requestId: string): HttpError {
    let message = 'Network Error';
    let code: string | undefined;

    if (error.name === 'AbortError') {
      message = 'Request timeout' || config.timeout ? 'Request timeout' : 'Request aborted';
      code = 'ECONNABORTED';
    } else if (error.code === 'ECONNRESET') {
      message = 'Network connection reset';
      code = error.code;
    } else if (error.code === 'ENOTFOUND') {
      message = 'Network host not found';
      code = error.code;
    } else if (error.message) {
      message = error.message;
    }

    return createHttpError(message, config, code, requestId);
  }

  /**
   * 增强错误信息
   */
  private enhanceError(error: HttpError, config: HttpRequestConfig): HttpError {
    error.config = config;
    return error;
  }

  /**
   * 获取缓存键
   */
  private getCacheKey(config: HttpRequestConfig): string {
    if (typeof config.cache === 'object' && config.cache.key) {
      return config.cache.key;
    }

    return `${config.method || 'GET'}:${config.url}:${JSON.stringify(config.params)}`;
  }

  /**
   * 获取请求去重键
   */
  private getDeduplicationKey(config: HttpRequestConfig): string {
    return `${config.method || 'GET'}:${config.url}:${JSON.stringify(config.params)}`;
  }

  /**
   * 检查缓存是否过期
   */
  private isCacheExpired(cacheEntry: any): boolean {
    if (!cacheEntry.ttl) {
      return false;
    }

    return Date.now() - cacheEntry.timestamp > cacheEntry.ttl;
  }

  /**
   * 添加请求拦截器
   */
  addRequestInterceptor(
    onFulfilled?: (config: HttpRequestConfig) => HttpRequestConfig | Promise<HttpRequestConfig>,
    onRejected?: (error: any) => any
  ): number {
    const interceptor: RequestInterceptor = { onFulfilled, onRejected };
    this.requestInterceptors.push(interceptor);
    return this.requestInterceptors.length - 1;
  }

  /**
   * 移除请求拦截器
   */
  removeRequestInterceptor(id: number): void {
    if (id >= 0 && id < this.requestInterceptors.length) {
      this.requestInterceptors.splice(id, 1);
    }
  }

  /**
   * 添加响应拦截器
   */
  addResponseInterceptor(
    onFulfilled?: (response: HttpResponse) => HttpResponse | Promise<HttpResponse>,
    onRejected?: (error: any) => any
  ): number {
    const interceptor: ResponseInterceptor = { onFulfilled, onRejected };
    this.responseInterceptors.push(interceptor);
    return this.responseInterceptors.length - 1;
  }

  /**
   * 移除响应拦截器
   */
  removeResponseInterceptor(id: number): void {
    if (id >= 0 && id < this.responseInterceptors.length) {
      this.responseInterceptors.splice(id, 1);
    }
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear();
  }

  // HTTP 方法快捷方法
  async get<T = any>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T = any>(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T = any>(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async patch<T = any>(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  async delete<T = any>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  async head<T = any>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, method: 'HEAD', url });
  }

  async options<T = any>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, method: 'OPTIONS', url });
  }
}