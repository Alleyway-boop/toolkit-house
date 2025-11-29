import { describe, it, expect } from 'vitest';
import {
  HTTP_STATUS,
  HTTP_METHODS,
  HTTP_HEADERS,
  MIME_TYPES,
  ERROR_CODES,
  ERROR_LEVELS,
  ERROR_TYPES,
  ERROR_MESSAGES,
} from '../src/common';

describe('HTTP Constants', () => {
  describe('HTTP_STATUS', () => {
    it('should have correct success status codes', () => {
      expect(HTTP_STATUS.OK).toBe(200);
      expect(HTTP_STATUS.CREATED).toBe(201);
      expect(HTTP_STATUS.ACCEPTED).toBe(202);
      expect(HTTP_STATUS.NO_CONTENT).toBe(204);
    });

    it('should have correct client error status codes', () => {
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
      expect(HTTP_STATUS.FORBIDDEN).toBe(403);
      expect(HTTP_STATUS.NOT_FOUND).toBe(404);
    });

    it('should have correct server error status codes', () => {
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
      expect(HTTP_STATUS.SERVICE_UNAVAILABLE).toBe(503);
      expect(HTTP_STATUS.GATEWAY_TIMEOUT).toBe(504);
    });
  });

  describe('HTTP_METHODS', () => {
    it('should have correct HTTP methods', () => {
      expect(HTTP_METHODS.GET).toBe('GET');
      expect(HTTP_METHODS.POST).toBe('POST');
      expect(HTTP_METHODS.PUT).toBe('PUT');
      expect(HTTP_METHODS.PATCH).toBe('PATCH');
      expect(HTTP_METHODS.DELETE).toBe('DELETE');
    });
  });

  describe('HTTP_HEADERS', () => {
    it('should have correct header names', () => {
      expect(HTTP_HEADERS.CONTENT_TYPE).toBe('Content-Type');
      expect(HTTP_HEADERS.AUTHORIZATION).toBe('Authorization');
      expect(HTTP_HEADERS.ACCEPT).toBe('Accept');
    });
  });

  describe('MIME_TYPES', () => {
    it('should have correct MIME types', () => {
      expect(MIME_TYPES.JSON).toBe('application/json');
      expect(MIME_TYPES.HTML).toBe('text/html');
      expect(MIME_TYPES.CSS).toBe('text/css');
      expect(MIME_TYPES.JAVASCRIPT).toBe('text/javascript');
    });
  });
});

describe('Error Constants', () => {
  describe('ERROR_CODES', () => {
    it('should have correct error codes', () => {
      expect(ERROR_CODES.SUCCESS).toBe(0);
      expect(ERROR_CODES.UNKNOWN_ERROR).toBe(-1);
      expect(ERROR_CODES.INVALID_PARAMETER).toBe(1001);
      expect(ERROR_CODES.UNAUTHORIZED).toBe(2001);
    });
  });

  describe('ERROR_LEVELS', () => {
    it('should have correct error levels', () => {
      expect(ERROR_LEVELS.DEBUG).toBe('debug');
      expect(ERROR_LEVELS.INFO).toBe('info');
      expect(ERROR_LEVELS.WARNING).toBe('warning');
      expect(ERROR_LEVELS.ERROR).toBe('error');
      expect(ERROR_LEVELS.CRITICAL).toBe('critical');
    });
  });

  describe('ERROR_TYPES', () => {
    it('should have correct error types', () => {
      expect(ERROR_TYPES.VALIDATION).toBe('validation');
      expect(ERROR_TYPES.AUTHENTICATION).toBe('authentication');
      expect(ERROR_TYPES.NOT_FOUND).toBe('not_found');
      expect(ERROR_TYPES.CONFLICT).toBe('conflict');
    });
  });

  describe('ERROR_MESSAGES', () => {
    it('should have corresponding error messages', () => {
      expect(ERROR_MESSAGES[ERROR_CODES.SUCCESS]).toBe('操作成功');
      expect(ERROR_MESSAGES[ERROR_CODES.INVALID_PARAMETER]).toBe('参数无效');
      expect(ERROR_MESSAGES[ERROR_CODES.UNAUTHORIZED]).toBe('未授权访问');
      expect(ERROR_MESSAGES[ERROR_CODES.RESOURCE_NOT_FOUND]).toBe('资源不存在');
    });
  });
});