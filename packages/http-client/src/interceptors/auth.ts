import type { HttpRequestConfig, HttpResponse } from '../types';

/**
 * 认证拦截器选项
 */
export interface AuthInterceptorOptions {
  /**
   * 认证类型
   */
  type: 'bearer' | 'basic' | 'apikey' | 'custom';

  /**
   * Token 获取函数
   */
  tokenProvider?: () => string | Promise<string>;

  /**
   * Token 刷新函数
   */
  tokenRefreshProvider?: () => string | Promise<string>;

  /**
   * Basic 认证用户名
   */
  username?: string;

  /**
   * Basic 认证密码
   */
  password?: string;

  /**
   * API Key
   */
  apiKey?: string;

  /**
   * API Key 的 header 名称
   */
  apiKeyHeader?: string;

  /**
   * 自定义认证函数
   */
  customAuth?: (config: HttpRequestConfig) => HttpRequestConfig | Promise<HttpRequestConfig>;

  /**
   * 是否在每个请求中添加认证
   */
  addAuthToAllRequests?: boolean;

  /**
   * 需要添加认证的 URL 模式
   */
  urlPatterns?: RegExp[];

  /**
   * 是否自动刷新 token
   */
  autoRefresh?: boolean;

  /**
   * Token 刷新前的触发器
   */
  onTokenRefresh?: () => void;
}

/**
 * 创建认证拦截器
 */
export default function createAuthInterceptor(options: AuthInterceptorOptions) {
  const {
    type,
    tokenProvider,
    tokenRefreshProvider,
    username,
    password,
    apiKey,
    apiKeyHeader = 'X-API-Key',
    customAuth,
    addAuthToAllRequests = true,
    urlPatterns,
    autoRefresh = false,
    onTokenRefresh
  } = options;

  // 检查 URL 是否需要添加认证
  const shouldAddAuth = (url?: string): boolean => {
    if (!url) return false;

    // 如果设置了要所有请求都添加认证
    if (addAuthToAllRequests) {
      // 如果设置了 URL 模式，检查是否匹配
      if (urlPatterns) {
        return urlPatterns.some(pattern => pattern.test(url));
      }
      return true;
    }

    // 如果设置了 URL 模式，检查是否匹配
    if (urlPatterns) {
      return urlPatterns.some(pattern => pattern.test(url));
    }

    return false;
  };

  // 添加 Bearer Token 认证
  const addBearerAuth = async (config: HttpRequestConfig): Promise<HttpRequestConfig> => {
    if (!tokenProvider) {
      throw new Error('Token provider is required for Bearer authentication');
    }

    const token = await tokenProvider();
    if (!token) {
      throw new Error('No token provided');
    }

    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;

    return config;
  };

  // 添加 Basic 认证
  const addBasicAuth = (config: HttpRequestConfig): HttpRequestConfig => {
    if (!username || !password) {
      throw new Error('Username and password are required for Basic authentication');
    }

    const credentials = btoa(`${username}:${password}`);
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Basic ${credentials}`;

    return config;
  };

  // 添加 API Key 认证
  const addApiKeyAuth = (config: HttpRequestConfig): HttpRequestConfig => {
    if (!apiKey) {
      throw new Error('API key is required for API key authentication');
    }

    config.headers = config.headers || {};
    config.headers[apiKeyHeader] = apiKey;

    return config;
  };

  // 处理 401 错误，自动刷新 token
  const handleUnauthorized = async (error: any): Promise<never> => {
    if (autoRefresh && tokenRefreshProvider && error.status === 401) {
      try {
        onTokenRefresh?.();
        const newToken = await tokenRefreshProvider();

        // 重新发起原始请求
        if (error.config && !error.config._isRetry) {
          error.config._isRetry = true;
          // 这里需要重新调用 HttpClient 的 request 方法
          // 但由于拦截器的限制，我们需要重新抛出错误让上层处理
          throw error;
        }
      } catch (refreshError) {
        throw refreshError;
      }
    }

    throw error;
  };

  return {
    /**
     * 请求拦截器 - 添加认证信息
     */
    onFulfilled: async (config: HttpRequestConfig): Promise<HttpRequestConfig> => {
      // 检查是否需要添加认证
      if (!shouldAddAuth(config.url)) {
        return config;
      }

      // 如果已经有认证信息，跳过
      if (config.headers?.authorization) {
        return config;
      }

      try {
        switch (type) {
          case 'bearer':
            return await addBearerAuth(config);
          case 'basic':
            return addBasicAuth(config);
          case 'apikey':
            return addApiKeyAuth(config);
          case 'custom':
            if (!customAuth) {
              throw new Error('Custom auth function is required for custom authentication');
            }
            return await customAuth(config);
          default:
            throw new Error(`Unsupported authentication type: ${type}`);
        }
      } catch (error) {
        throw new Error(`Authentication failed: ${(error as Error).message}`);
      }
    },

    /**
     * 响应拦截器 - 处理认证失败
     */
    onRejected: async (error: any): Promise<never> => {
      return handleUnauthorized(error);
    }
  };
}

/**
 * 预定义的常用认证拦截器
 */

/**
 * Bearer Token 认证拦截器
 */
export function createBearerAuthInterceptor(
  tokenProvider: () => string | Promise<string>,
  options: Partial<AuthInterceptorOptions> = {}
) {
  return createAuthInterceptor({
    type: 'bearer',
    tokenProvider,
    ...options
  });
}

/**
 * Basic 认证拦截器
 */
export function createBasicAuthInterceptor(
  username: string,
  password: string,
  options: Partial<AuthInterceptorOptions> = {}
) {
  return createAuthInterceptor({
    type: 'basic',
    username,
    password,
    ...options
  });
}

/**
 * API Key 认证拦截器
 */
export function createApiKeyAuthInterceptor(
  apiKey: string,
  headerName: string = 'X-API-Key',
  options: Partial<AuthInterceptorOptions> = {}
) {
  return createAuthInterceptor({
    type: 'apikey',
    apiKey,
    apiKeyHeader: headerName,
    ...options
  });
}