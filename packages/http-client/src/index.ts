// Main exports
export { HttpClient } from './core/HttpClient.js';

// Error handling
export {
  HttpError,
  NetworkError,
  TimeoutError,
  CancelError,
  ParseError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ServerError,
  RateLimitError,
  PayloadTooLargeError,
  UnsupportedMediaTypeError,
  ErrorFactory,
  ErrorType
} from './errors/HttpError.js';

// Interceptors
export {
  RequestInterceptorManager,
  ResponseInterceptorManager,
  createAuthInterceptor,
  createBearerAuthInterceptor,
  createBasicAuthInterceptor,
  createApiKeyAuthInterceptor,
  createRetryInterceptor,
  createNetworkRetryInterceptor,
  createRateLimitRetryInterceptor,
  createFastRetryInterceptor,
  createSlowRetryInterceptor,
  createCacheInterceptor,
  createMemoryCacheInterceptor,
  createLocalStorageCacheInterceptor,
  createLongTermCacheInterceptor,
  createShortTermCacheInterceptor,
  createLoggingInterceptor,
  createSimpleLoggingInterceptor,
  createDetailedLoggingInterceptor,
  createErrorLoggingInterceptor,
  createPerformanceLoggingInterceptor
} from './interceptors/index.js';

// Cache
export {
  MemoryCache,
  LRUCache,
  LocalStorageCache,
  SessionStorageCache,
  CacheFactory
} from './cache/index.js';

export type { ICache } from './cache/index.js';

// Types
export type {
  HttpClientOptions,
  HttpRequestConfig,
  HttpResponse,
  HttpError as IHttpError,
  HttpMethod,
  RequestInterceptor,
  ResponseInterceptor,
  InterceptorManager,
  BasicAuth,
  ProxyConfig,
  CacheOptions,
  TransitionalOptions,
  ProgressEvent,
  RequestTransformer,
  ResponseTransformer,
  CancelToken,
  Canceler,
  RequestMetadata
} from './types/index.js';

// Utilities
export {
  deepMerge,
  buildURL,
  paramsSerializer,
  mergeHeaders,
  normalizeHeaders,
  createHttpError,
  isStatusSuccess,
  generateRequestId,
  delay,
  getRetryDelay,
  shouldRetry,
  formatFileSize,
  isBrowser,
  isNode,
  getDefaultUserAgent
} from './utils/helpers.js';

// Version information
export const VERSION = '0.0.0' as const;

// Package information
export const PACKAGE_NAME = '@toolkit-house/http-client' as const;
export const PACKAGE_DESCRIPTION = 'A modern HTTP client library with concurrency control, interceptors, and advanced features' as const;

// Re-export ts-utils RequestPool for advanced usage
export { RequestPool } from '@toolkit-house/ts-utils';

/**
 * Default HTTP client instance
 * Create a pre-configured client with sensible defaults
 */
export const httpClient = new HttpClient();

/**
 * Create a new HTTP client instance with options
 */
export function createHttpClient(options?: HttpClientOptions): HttpClient {
  return new HttpClient(options);
}

/**
 * Quick method for creating a GET request
 */
export async function get<T = any>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
  return httpClient.get<T>(url, config);
}

/**
 * Quick method for creating a POST request
 */
export async function post<T = any>(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
  return httpClient.post<T>(url, data, config);
}

/**
 * Quick method for creating a PUT request
 */
export async function put<T = any>(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
  return httpClient.put<T>(url, data, config);
}

/**
 * Quick method for creating a PATCH request
 */
export async function patch<T = any>(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
  return httpClient.patch<T>(url, data, config);
}

/**
 * Quick method for creating a DELETE request
 */
export async function del<T = any>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
  return httpClient.delete<T>(url, config);
}

/**
 * Quick method for creating a HEAD request
 */
export async function head<T = any>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
  return httpClient.head<T>(url, config);
}

/**
 * Quick method for creating an OPTIONS request
 */
export async function options<T = any>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
  return httpClient.options<T>(url, config);
}