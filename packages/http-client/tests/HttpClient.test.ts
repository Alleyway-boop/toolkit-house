import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { HttpClient, HttpError, NetworkError, TimeoutError } from '../src/index';

// Mock fetch
global.fetch = vi.fn();

describe('HttpClient', () => {
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient({
      timeout: 5000,
      retryCount: 2,
      poolSize: 3
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic HTTP Methods', () => {
    it('should make GET request', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ data: 'test' })
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const response = await httpClient.get('/api/test');

      expect(global.fetch).toHaveBeenCalledWith('/api/test', {
        method: 'GET',
        headers: {},
        signal: expect.any(AbortSignal),
        body: null
      });
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ data: 'test' });
    });

    it('should make POST request with data', async () => {
      const mockResponse = {
        ok: true,
        status: 201,
        statusText: 'Created',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ id: 1 })
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const postData = { name: 'test' };
      const response = await httpClient.post('/api/users', postData);

      expect(global.fetch).toHaveBeenCalledWith('/api/users', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: expect.any(AbortSignal),
        body: JSON.stringify(postData)
      });
      expect(response.status).toBe(201);
      expect(response.data).toEqual({ id: 1 });
    });

    it('should handle PUT request', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ id: 1, name: 'updated' })
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const updateData = { name: 'updated' };
      const response = await httpClient.put('/api/users/1', updateData);

      expect(global.fetch).toHaveBeenCalledWith('/api/users/1', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        signal: expect.any(AbortSignal),
        body: JSON.stringify(updateData)
      });
      expect(response.data).toEqual({ id: 1, name: 'updated' });
    });

    it('should handle DELETE request', async () => {
      const mockResponse = {
        ok: true,
        status: 204,
        statusText: 'No Content',
        headers: new Headers(),
        json: vi.fn().mockResolvedValue(null)
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const response = await httpClient.delete('/api/users/1');

      expect(global.fetch).toHaveBeenCalledWith('/api/users/1', {
        method: 'DELETE',
        headers: {},
        signal: expect.any(AbortSignal),
        body: null
      });
      expect(response.status).toBe(204);
    });

    it('should not create AbortController when no timeout', async () => {
      const clientWithoutTimeout = new HttpClient({ timeout: 0 });
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ data: 'test' })
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await clientWithoutTimeout.get('/api/test');

      expect(global.fetch).toHaveBeenCalledWith('/api/test', {
        method: 'GET',
        headers: {},
        signal: undefined,
        body: null
      });
    });
  });

  describe('Request Configuration', () => {
    it('should merge default config with request config', async () => {
      const customClient = new HttpClient({
        baseURL: 'https://api.example.com',
        headers: { 'Authorization': 'Bearer token' },
        timeout: 3000
      });

      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ success: true })
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await customClient.get('/users', {
        headers: { 'X-Custom': 'value' }
      });

      expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/users', {
        method: 'GET',
        headers: {
          'authorization': 'Bearer token',
          'x-custom': 'value'
        },
        signal: expect.any(AbortSignal),
        body: null
      });
    });

    it('should handle query parameters', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue([])
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await httpClient.get('/users', {
        params: { page: 1, limit: 10, search: 'test' }
      });

      expect(global.fetch).toHaveBeenCalledWith('/users?page=1&limit=10&search=test', {
        method: 'GET',
        headers: {},
        signal: expect.any(AbortSignal),
        body: null
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle HTTP error responses', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ error: 'Not found' })
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await expect(httpClient.get('/api/nonexistent')).rejects.toThrow(HttpError);
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network Error'));

      await expect(httpClient.get('/api/test')).rejects.toThrow(NetworkError);
    });

    it('should handle timeout errors', async () => {
      const clientWithShortTimeout = new HttpClient({ timeout: 100 });

      (global.fetch as any).mockImplementationOnce(() =>
        new Promise((resolve) => setTimeout(resolve, 200))
      );

      await expect(clientWithShortTimeout.get('/api/slow')).rejects.toThrow(TimeoutError);
    });
  });

  describe('Interceptors', () => {
    it('should apply request interceptors', async () => {
      httpClient.addRequestInterceptor((config) => {
        config.headers = { ...config.headers, 'X-Request-ID': '123' };
        return config;
      });

      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({})
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await httpClient.get('/api/test');

      expect(global.fetch).toHaveBeenCalledWith('/api/test', {
        method: 'GET',
        headers: { 'x-request-id': '123' },
        signal: expect.any(AbortSignal),
        body: null
      });
    });

    it('should apply response interceptors', async () => {
      httpClient.addResponseInterceptor((response) => {
        response.data = { ...response.data, processed: true };
        return response;
      });

      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ original: true })
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const response = await httpClient.get('/api/test');

      expect(response.data).toEqual({ original: true, processed: true });
    });

    it('should handle interceptor errors', async () => {
      httpClient.addRequestInterceptor(() => {
        throw new Error('Interceptor error');
      });

      await expect(httpClient.get('/api/test')).rejects.toThrow('Interceptor error');
    });
  });

  describe('Caching', () => {
    it('should cache GET requests', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ data: 'cached' })
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      const response1 = await httpClient.get('/api/test', { cache: true });
      const response2 = await httpClient.get('/api/test', { cache: true });

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(response1.data).toEqual({ data: 'cached' });
      expect(response2.data).toEqual({ data: 'cached' });
      expect(response2.fromCache).toBe(true);
    });

    it('should not cache POST requests by default', async () => {
      const mockResponse = {
        ok: true,
        status: 201,
        statusText: 'Created',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ id: 1 })
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await httpClient.post('/api/users', { name: 'test' }, { cache: true });

      // Verify fetch was called (POST requests shouldn't be cached by default)
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Request Deduplication', () => {
    it('should deduplicate identical pending requests', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ data: 'test' })
      };

      (global.fetch as any).mockImplementationOnce(() =>
        new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
      );

      const [response1, response2] = await Promise.all([
        httpClient.get('/api/deduplicate'),
        httpClient.get('/api/deduplicate')
      ]);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(response1).toBe(response2);
      expect(response1.data).toEqual({ data: 'test' });
    });
  });

  describe('Retry Logic', () => {
    it('should retry failed requests', async () => {
      (global.fetch as any)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: 'OK',
          headers: new Headers({ 'content-type': 'application/json' }),
          json: vi.fn().mockResolvedValue({ data: 'success' })
        });

      const response = await httpClient.get('/api/retry');

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(response.data).toEqual({ data: 'success' });
    });

    it('should not retry non-retryable errors', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ error: 'Bad request' })
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await expect(httpClient.get('/api/bad-request')).rejects.toThrow();
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Concurrent Request Handling', () => {
    it('should handle concurrent requests with pool size limit', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ success: true })
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      const promises = Array(10).fill(null).map(() => httpClient.get('/api/test'));
      await Promise.all(promises);

      expect(global.fetch).toHaveBeenCalledTimes(10);
    });
  });

  describe('FormData and File Upload', () => {
    it('should handle FormData requests', async () => {
      const formData = new FormData();
      formData.append('file', new Blob(['test'], { type: 'text/plain' }));

      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        json: vi.fn().mockResolvedValue({ success: true })
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await httpClient.post('/api/upload', formData);

      expect(global.fetch).toHaveBeenCalledWith('/api/upload', {
        method: 'POST',
        headers: {},
        signal: expect.any(AbortSignal),
        body: formData
      });
    });
  });

  describe('Response Types', () => {
    it('should handle text responses', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'text/plain' }),
        text: vi.fn().mockResolvedValue('Plain text response')
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      const response = await httpClient.get('/api/text', { responseType: 'text' });

      expect(response.data).toBe('Plain text response');
    });

    it('should handle blob responses', async () => {
      const blob = new Blob(['test'], { type: 'text/plain' });
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/octet-stream' }),
        blob: vi.fn().mockResolvedValue(blob)
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      const response = await httpClient.get('/api/file', { responseType: 'blob' });

      expect(response.data).toBe(blob);
    });
  });
});