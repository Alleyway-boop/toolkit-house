/**
 * HTTP request methods
 */
export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS';

/**
 * HTTP request configuration
 */
export interface HttpRequestConfig {
  url?: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
  baseURL?: string;
  retryCount?: number;
  retryDelay?: number;
  cache?: boolean | CacheOptions;
  signal?: AbortSignal;
  onUploadProgress?: (progress: ProgressEvent) => void;
  onDownloadProgress?: (progress: ProgressEvent) => void;
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'stream';
  validateStatus?: (status: number) => boolean;
  paramsSerializer?: (params: Record<string, any>) => string;
  transformRequest?: RequestTransformer[];
  transformResponse?: ResponseTransformer[];
  auth?: BasicAuth;
  withCredentials?: boolean;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  maxContentLength?: number;
  maxBodyLength?: number;
  maxRedirects?: number;
  beforeRedirect?: (options: any, responseDetails: any) => void;
  socketPath?: string | null;
  httpAgent?: any;
  httpsAgent?: any;
  proxy?: false | ProxyConfig;
  cancelToken?: CancelToken;
  decompress?: boolean;
  insecureHTTPParser?: boolean;
  transitional?: TransitionalOptions;
  env?: {
    FormData?: any;
    Blob?: any;
  };
  maxRate?: number | [number, number];
}

/**
 * HTTP response interface
 */
export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: HttpRequestConfig;
  request?: any;
  duration?: number;
  fromCache?: boolean;
}

/**
 * Basic authentication configuration
 */
export interface BasicAuth {
  username: string;
  password: string;
}

/**
 * Proxy configuration
 */
export interface ProxyConfig {
  protocol: string;
  host: string;
  port: number;
  auth?: {
    username: string;
    password: string;
  };
}

/**
 * Cache options
 */
export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  key?: string; // Custom cache key
  maxSize?: number; // Maximum cache size
  storage?: 'memory' | 'localStorage' | 'sessionStorage';
}

/**
 * Transitional options for backward compatibility
 */
export interface TransitionalOptions {
  silentJSONParsing?: boolean;
  forcedJSONParsing?: boolean;
  clarifyTimeoutError?: boolean;
}

/**
 * Progress event type
 */
export interface ProgressEvent {
  loaded: number;
  total?: number;
  lengthComputable: boolean;
  progress: number; // 0-1
}

/**
 * HTTP error interface
 */
export interface HttpError extends Error {
  config: HttpRequestConfig;
  code?: string;
  request?: any;
  response?: HttpResponse;
  isAxiosError?: boolean;
  status?: number;
  statusText?: string;
}

/**
 * Request transformer function
 */
export type RequestTransformer = (
  data: any,
  headers: Record<string, string>
) => any;

/**
 * Response transformer function
 */
export type ResponseTransformer = (
  data: any
) => any;

/**
 * Interceptor functions
 */
export interface RequestInterceptor {
  onFulfilled?: (config: HttpRequestConfig) => HttpRequestConfig | Promise<HttpRequestConfig>;
  onRejected?: (error: any) => any;
}

export interface ResponseInterceptor {
  onFulfilled?: (response: HttpResponse) => HttpResponse | Promise<HttpResponse>;
  onRejected?: (error: any) => any;
}

/**
 * Interceptor manager
 */
export interface InterceptorManager<T> {
  use(
    onFulfilled?: (value: T) => T | Promise<T>,
    onRejected?: (error: any) => any
  ): number;
  eject(id: number): void;
  clear(): void;
}

/**
 * Cancel token interface
 */
export interface CancelToken {
  promise: Promise<unknown>;
  reason?: any;
  throwIfRequested(): void;
}

/**
 * Canceler interface
 */
export interface Canceler {
  (message?: string): void;
}

/**
 * HttpClient options
 */
export interface HttpClientOptions {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  retryCount?: number;
  retryDelay?: number;
  poolSize?: number;
  cache?: boolean | CacheOptions;
  interceptors?: {
    request?: RequestInterceptor[];
    response?: ResponseInterceptor[];
  };
  validateStatus?: (status: number) => boolean;
  transformRequest?: RequestTransformer[];
  transformResponse?: ResponseTransformer[];
  paramsSerializer?: (params: Record<string, any>) => string;
  withCredentials?: boolean;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  maxContentLength?: number;
  maxBodyLength?: number;
  maxRedirects?: number;
  httpAgent?: any;
  httpsAgent?: any;
  proxy?: false | ProxyConfig;
  decompress?: boolean;
  insecureHTTPParser?: boolean;
  transitional?: TransitionalOptions;
  env?: {
    FormData?: any;
    Blob?: any;
  };
  maxRate?: number | [number, number];
  beforeRedirect?: (options: any, responseDetails: any) => void;
  socketPath?: string | null;
  transport?: any;
  adapter?: any;
  auth?: BasicAuth;
  onUploadProgress?: (progress: ProgressEvent) => void;
  onDownloadProgress?: (progress: ProgressEvent) => void;
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'stream';
  signal?: AbortSignal;
  lookup?: (hostname: string, options: any, cb: (err: Error | null, address: string, family: number) => void) => void;
  family?: 4 | 6 | undefined;
}

/**
 * Cache entry interface
 */
export interface CacheEntry<T = any> {
  data: HttpResponse<T>;
  timestamp: number;
  ttl?: number;
  key: string;
}

/**
 * Request deduplication options
 */
export interface DeduplicationOptions {
  enabled?: boolean;
  key?: string;
  ttl?: number;
}

/**
 * Request metadata for internal tracking
 */
export interface RequestMetadata {
  id: string;
  startTime: number;
  endTime?: number;
  retryCount: number;
  fromCache: boolean;
  deduplicated?: boolean;
}