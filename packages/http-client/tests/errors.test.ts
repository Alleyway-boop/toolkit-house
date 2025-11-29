import { describe, it, expect } from 'vitest';
import {
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
  ErrorFactory,
  ErrorType
} from '../src/errors/HttpError';
import type { HttpRequestConfig, HttpResponse } from '../src/types';

describe('Error Classes', () => {
  const mockConfig: HttpRequestConfig = {
    url: '/api/test',
    method: 'GET'
  };

  const mockResponse: HttpResponse = {
    data: null,
    status: 500,
    statusText: 'Internal Server Error',
    headers: {},
    config: mockConfig
  };

  describe('HttpError', () => {
    it('should create basic HttpError', () => {
      const error = new HttpError('Test error', mockConfig);

      expect(error.name).toBe('HttpError');
      expect(error.message).toBe('Test error');
      expect(error.config).toBe(mockConfig);
      expect(error.isAxiosError).toBe(true);
      expect(error.type).toBe(ErrorType.UNKNOWN);
    });

    it('should create HttpError with all properties', () => {
      const error = new HttpError('Test error', mockConfig, 'ERR_CODE', 'request', mockResponse);

      expect(error.code).toBe('ERR_CODE');
      expect(error.request).toBe('request');
      expect(error.response).toBe(mockResponse);
      expect(error.status).toBe(500);
      expect(error.statusText).toBe('Internal Server Error');
    });

    it('should determine if client error', () => {
      const clientError = new HttpError('Bad Request', mockConfig, undefined, undefined, {
        ...mockResponse,
        status: 400
      });
      const serverError = new HttpError('Server Error', mockConfig, undefined, undefined, {
        ...mockResponse,
        status: 500
      });

      expect(clientError.isClientError()).toBe(true);
      expect(clientError.isServerError()).toBe(false);
      expect(serverError.isClientError()).toBe(false);
      expect(serverError.isServerError()).toBe(true);
    });

    it('should determine if retryable', () => {
      const networkError = new HttpError('Network Error', mockConfig, 'ENOTFOUND');
      const timeoutError = new HttpError('Timeout', mockConfig, 'ECONNABORTED');
      const serverError = new HttpError('Server Error', mockConfig, undefined, undefined, {
        ...mockResponse,
        status: 500
      });
      const clientError = new HttpError('Bad Request', mockConfig, undefined, undefined, {
        ...mockResponse,
        status: 400
      });

      expect(networkError.isRetryable()).toBe(true);
      expect(timeoutError.isRetryable()).toBe(true);
      expect(serverError.isRetryable()).toBe(true);
      expect(clientError.isRetryable()).toBe(false);
    });

    it('should provide user-friendly messages', () => {
      const timeoutError = new HttpError('Timeout', mockConfig, 'ECONNABORTED');
      const networkError = new HttpError('Network Error', mockConfig, 'ENOTFOUND');
      const authError = new HttpError('Unauthorized', mockConfig, undefined, undefined, {
        ...mockResponse,
        status: 401
      });

      expect(timeoutError.getUserFriendlyMessage()).toBe('请求超时，请检查网络连接后重试');
      expect(networkError.getUserFriendlyMessage()).toBe('网络连接失败，请检查网络设置');
      expect(authError.getUserFriendlyMessage()).toBe('身份验证失败，请重新登录');
    });

    it('should serialize to JSON and deserialize', () => {
      const originalError = new HttpError(
        'Test error',
        mockConfig,
        'ERR_CODE',
        'request',
        mockResponse,
        ErrorType.NETWORK
      );

      const json = originalError.toJSON();
      const deserializedError = HttpError.fromJSON(json);

      expect(deserializedError.name).toBe(originalError.name);
      expect(deserializedError.message).toBe(originalError.message);
      expect(deserializedError.type).toBe(originalError.type);
      expect(deserializedError.status).toBe(originalError.status);
      expect(deserializedError.code).toBe(originalError.code);
    });
  });

  describe('NetworkError', () => {
    it('should create NetworkError', () => {
      const error = new NetworkError('Network failure', mockConfig, 'ENOTFOUND');

      expect(error.name).toBe('NetworkError');
      expect(error.type).toBe(ErrorType.NETWORK);
      expect(error.isNetworkError).toBe(true);
      expect(error.isRetryable()).toBe(true);
    });
  });

  describe('TimeoutError', () => {
    it('should create TimeoutError', () => {
      const error = new TimeoutError('Request timeout', mockConfig);

      expect(error.name).toBe('TimeoutError');
      expect(error.type).toBe(ErrorType.TIMEOUT);
      expect(error.isTimeout).toBe(true);
      expect(error.code).toBe('ECONNABORTED');
      expect(error.isRetryable()).toBe(true);
    });
  });

  describe('CancelError', () => {
    it('should create CancelError', () => {
      const error = new CancelError('Request canceled', mockConfig);

      expect(error.name).toBe('CancelError');
      expect(error.type).toBe(ErrorType.CANCEL);
      expect(error.isCanceled).toBe(true);
      expect(error.isRetryable()).toBe(false);
    });

    it('should use default message', () => {
      const error = new CancelError();

      expect(error.message).toBe('Request canceled');
    });
  });

  describe('ParseError', () => {
    it('should create ParseError', () => {
      const error = new ParseError('Invalid JSON', mockConfig, mockResponse);

      expect(error.name).toBe('ParseError');
      expect(error.type).toBe(ErrorType.PARSE);
      expect(error.response).toBe(mockResponse);
    });
  });

  describe('ValidationError', () => {
    it('should create ValidationError', () => {
      const error = new ValidationError('Invalid input', mockConfig);

      expect(error.name).toBe('ValidationError');
      expect(error.type).toBe(ErrorType.VALIDATION);
      expect(error.isRetryable()).toBe(false);
    });
  });

  describe('AuthenticationError', () => {
    it('should create AuthenticationError', () => {
      const error = new AuthenticationError('Unauthorized', mockConfig, {
        ...mockResponse,
        status: 401
      });

      expect(error.name).toBe('AuthenticationError');
      expect(error.type).toBe(ErrorType.AUTHENTICATION);
      expect(error.status).toBe(401);
      expect(error.getUserFriendlyMessage()).toBe('身份验证失败，请重新登录');
    });
  });

  describe('AuthorizationError', () => {
    it('should create AuthorizationError', () => {
      const error = new AuthorizationError('Forbidden', mockConfig, {
        ...mockResponse,
        status: 403
      });

      expect(error.name).toBe('AuthorizationError');
      expect(error.type).toBe(ErrorType.AUTHORIZATION);
      expect(error.status).toBe(403);
      expect(error.getUserFriendlyMessage()).toBe('没有权限访问此资源');
    });
  });

  describe('NotFoundError', () => {
    it('should create NotFoundError', () => {
      const error = new NotFoundError('Not found', mockConfig, {
        ...mockResponse,
        status: 404
      });

      expect(error.name).toBe('NotFoundError');
      expect(error.type).toBe(ErrorType.NOT_FOUND);
      expect(error.status).toBe(404);
      expect(error.getUserFriendlyMessage()).toBe('请求的资源不存在');
    });
  });

  describe('ServerError', () => {
    it('should create ServerError', () => {
      const error = new ServerError('Server error', mockConfig, {
        ...mockResponse,
        status: 500
      });

      expect(error.name).toBe('ServerError');
      expect(error.type).toBe(ErrorType.SERVER_ERROR);
      expect(error.status).toBe(500);
      expect(error.getUserFriendlyMessage()).toBe('服务器暂时无法响应，请稍后重试');
    });
  });

  describe('RateLimitError', () => {
    it('should create RateLimitError', () => {
      const error = new RateLimitError('Too many requests', mockConfig, {
        ...mockResponse,
        status: 429
      });

      expect(error.name).toBe('RateLimitError');
      expect(error.type).toBe(ErrorType.RATE_LIMIT);
      expect(error.status).toBe(429);
      expect(error.isRetryable()).toBe(true);
      expect(error.getUserFriendlyMessage()).toBe('请求过于频繁，请稍后重试');
    });
  });
});

describe('ErrorFactory', () => {
  const mockConfig: HttpRequestConfig = {
    url: '/api/test',
    method: 'GET'
  };

  const mockResponse: HttpResponse = {
    data: null,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: mockConfig
  };

  describe('createFromStatus', () => {
    it('should create ValidationError for 400', () => {
      const error = ErrorFactory.createFromStatus(400, 'Bad Request', mockConfig);

      expect(error).toBeInstanceOf(ValidationError);
      expect(error.status).toBeUndefined(); // No response passed
    });

    it('should create AuthenticationError for 401', () => {
      const error = ErrorFactory.createFromStatus(
        401,
        'Unauthorized',
        mockConfig,
        { ...mockResponse, status: 401 }
      );

      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.status).toBe(401);
    });

    it('should create AuthorizationError for 403', () => {
      const error = ErrorFactory.createFromStatus(
        403,
        'Forbidden',
        mockConfig,
        { ...mockResponse, status: 403 }
      );

      expect(error).toBeInstanceOf(AuthorizationError);
      expect(error.status).toBe(403);
    });

    it('should create NotFoundError for 404', () => {
      const error = ErrorFactory.createFromStatus(
        404,
        'Not Found',
        mockConfig,
        { ...mockResponse, status: 404 }
      );

      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.status).toBe(404);
    });

    it('should create ServerError for 500', () => {
      const error = ErrorFactory.createFromStatus(
        500,
        'Internal Server Error',
        mockConfig,
        { ...mockResponse, status: 500 }
      );

      expect(error).toBeInstanceOf(ServerError);
      expect(error.status).toBe(500);
    });

    it('should create generic HttpError for unknown status', () => {
      const error = ErrorFactory.createFromStatus(
        418,
        "I'm a teapot",
        mockConfig,
        { ...mockResponse, status: 418 }
      );

      expect(error).toBeInstanceOf(HttpError);
      expect(error.status).toBe(418);
      expect(error.type).toBe(ErrorType.UNKNOWN);
    });
  });

  describe('createFromCode', () => {
    it('should create TimeoutError for ECONNABORTED', () => {
      const error = ErrorFactory.createFromCode('ECONNABORTED', 'Timeout', mockConfig);

      expect(error).toBeInstanceOf(TimeoutError);
      expect(error.isTimeout).toBe(true);
    });

    it('should create NetworkError for ENOTFOUND', () => {
      const error = ErrorFactory.createFromCode('ENOTFOUND', 'Host not found', mockConfig);

      expect(error).toBeInstanceOf(NetworkError);
      expect(error.code).toBe('ENOTFOUND');
      expect(error.isNetworkError).toBe(true);
    });

    it('should create NetworkError for ECONNREFUSED', () => {
      const error = ErrorFactory.createFromCode('ECONNREFUSED', 'Connection refused', mockConfig);

      expect(error).toBeInstanceOf(NetworkError);
      expect(error.code).toBe('ECONNREFUSED');
      expect(error.isNetworkError).toBe(true);
    });

    it('should create generic NetworkError for unknown code', () => {
      const error = ErrorFactory.createFromCode('UNKNOWN_ERROR', 'Unknown error', mockConfig);

      expect(error).toBeInstanceOf(NetworkError);
      expect(error.code).toBe('UNKNOWN_ERROR');
    });
  });

  describe('Convenience Methods', () => {
    it('should create NetworkError', () => {
      const error = ErrorFactory.createNetworkError('Network failure', mockConfig, 'ENOTFOUND');

      expect(error).toBeInstanceOf(NetworkError);
      expect(error.message).toBe('Network failure');
      expect(error.code).toBe('ENOTFOUND');
    });

    it('should create TimeoutError', () => {
      const error = ErrorFactory.createTimeoutError('Request timeout', mockConfig);

      expect(error).toBeInstanceOf(TimeoutError);
      expect(error.message).toBe('Request timeout');
    });

    it('should create CancelError', () => {
      const error = ErrorFactory.createCancelError('Request canceled', mockConfig);

      expect(error).toBeInstanceOf(CancelError);
      expect(error.message).toBe('Request canceled');
      expect(error.isCanceled).toBe(true);
    });

    it('should create ParseError', () => {
      const error = ErrorFactory.createParseError('Invalid JSON', mockConfig, mockResponse);

      expect(error).toBeInstanceOf(ParseError);
      expect(error.message).toBe('Invalid JSON');
      expect(error.response).toBe(mockResponse);
    });
  });
});