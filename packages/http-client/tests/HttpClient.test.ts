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
        signal: undefined,
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
        signal: undefined,
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
        signal: undefined,
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
        signal: undefined,
        body: null
      });
      expect(response.status).toBe(204);
    });
  });

  describe('Request Configuration', () => {
    it('should merge default config with request config', async () => {
      const customClient = new HttpClient({
        baseURL: 'https://api.example.com',
        headers: { 'Authorization': 'Bearer token' },
        timeout: 10000
      });

      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ data: 'test' })
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await customClient.get('/users', {
        headers: { 'X-Custom': 'value' }
      });

      expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/users', {
        method: 'GET',
        headers: { 'authorization': 'Bearer token', 'x-custom': 'value' },
        signal: undefined,
        body: null
      });
    });

    it('should handle query parameters', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ data: 'test' })
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await httpClient.get('/api/users', {
        params: { page: 1, limit: 10, search: 'test' }
      });

      expect(global.fetch).toHaveBeenCalledWith('/api/users?page=1&limit=10&search=test', {
        method: 'GET',
        headers: {},
        signal: undefined,
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
        json: vi.fn().mockResolvedValue({ error: 'User not found' })
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      try {
        await httpClient.get('/api/users/999');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpError);
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
        expect(error.isAxiosError).toBe(true);
      }
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network Error'));

      try {
        await httpClient.get('/api/test');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(NetworkError);
        expect(error.isNetworkError).toBe(true);
        expect(error.isAxiosError).toBe(true);
      }
    });

    it('should handle timeout errors', async () => {
      const controller = new AbortController();
      const abortError = new Error('Request timeout');
      abortError.name = 'AbortError';

      (global.fetch as any).mockImplementationOnce(() => {
        setTimeout(() => controller.abort(), 100);
        return fetch('/api/test', { signal: controller.signal });
      });

      // Mock the actual fetch to throw AbortError
      (global.fetch as any).mockRejectedValueOnce(abortError);

      try {
        await httpClient.get('/api/test', { timeout: 50 });
        expect.fail('Should have thrown a timeout error');
      } catch (error) {
        expect(error).toBeInstanceOf(TimeoutError);
        expect(error.isTimeout).toBe(true);
        expect(error.code).toBe('ECONNABORTED');
      }
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
        json: vi.fn().mockResolvedValue({ data: 'test' })
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await httpClient.get('/api/test');

      expect(global.fetch).toHaveBeenCalledWith('/api/test', {
        method: 'GET',
        headers: { 'x-request-id': '123' },
        signal: undefined,
        body: null
      });
    });

    it('should apply response interceptors', async () => {
      httpClient.addResponseInterceptor((response) => {
        response.data = { ...response.data, intercepted: true };
        return response;
      });

      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ data: 'test' })
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const response = await httpClient.get('/api/test');

      expect(response.data).toEqual({ data: 'test', intercepted: true });
    });

    it('should handle interceptor errors', async () => {
      httpClient.addRequestInterceptor(() => {
        throw new Error('Request interceptor error');
      });

      try {
        await httpClient.get('/api/test');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe('Request interceptor error');
      }
    });
  });

  describe('Caching', () => {
    it('should cache GET requests', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ data: 'test', timestamp: Date.now() })
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      // First request
      const response1 = await httpClient.get('/api/test', { cache: true });
      expect(response1.data).toEqual({ data: 'test', timestamp: Date.now() });
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Second request should use cache
      const response2 = await httpClient.get('/api/test', { cache: true });
      expect(response2.data).toEqual({ data: 'test', timestamp: Date.now() });
      expect(global.fetch).toHaveBeenCalledTimes(1); // Should not increase
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

      // Start two identical requests simultaneously
      const [response1, response2] = await Promise.all([
        httpClient.get('/api/test'),
        httpClient.get('/api/test')
      ]);

      expect(response1.data).toEqual({ data: 'test' });
      expect(response2.data).toEqual({ data: 'test' });
      expect(global.fetch).toHaveBeenCalledTimes(1); // Should only call fetch once
    });
  });

  describe('Retry Logic', () => {
    it('should retry failed requests', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ data: 'success' })
      };

      // First call fails, second succeeds
      (global.fetch as any)
        .mockRejectedValueOnce(new Error('Network Error'))
        .mockResolvedValueOnce(mockResponse);

      const response = await httpClient.get('/api/test');

      expect(response.data).toEqual({ data: 'success' });
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should not retry non-retryable errors', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ error: 'Invalid input' })
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      try {
        await httpClient.get('/api/test');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.status).toBe(400);
        expect(global.fetch).toHaveBeenCalledTimes(1); // Should not retry
      }
    });
  });

  describe('Concurrent Request Handling', () => {
    it('should handle concurrent requests with pool size limit', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ data: 'test' })
      };

      (global.fetch as any).mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve(mockResponse), 50))
      );

      const client = new HttpClient({ poolSize: 2 });

      // Make 5 concurrent requests
      const requests = Array(5).fill(null).map(() => client.get('/api/test'));
      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.data).toEqual({ data: 'test' });
      });

      expect(global.fetch).toHaveBeenCalledTimes(5);
    });
  });

  describe('FormData and File Upload', () => {
    it('should handle FormData requests', async () => {
      const formData = new FormData();
      formData.append('name', 'test');
      formData.append('file', new Blob(['test'], { type: 'text/plain' }), 'test.txt');

      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ success: true })
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await httpClient.post('/api/upload', formData);

      expect(global.fetch).toHaveBeenCalledWith('/api/upload', {
        method: 'POST',
        headers: {},
        signal: undefined,
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
        text: vi.fn().mockResolvedValue('Hello, World!')
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const response = await httpClient.get('/api/text', { responseType: 'text' });

      expect(response.data).toBe('Hello, World!');
    });

    it('should handle blob responses', async () => {
      const blob = new Blob(['test'], { type: 'text/plain' });
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'text/plain' }),
        blob: vi.fn().mockResolvedValue(blob)
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const response = await httpClient.get('/api/file', { responseType: 'blob' });

      expect(response.data).toBe(blob);
    });
  });
});