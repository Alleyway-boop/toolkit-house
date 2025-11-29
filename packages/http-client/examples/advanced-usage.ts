/**
 * Advanced usage examples for @toolkit-house/http-client
 */

import {
  HttpClient,
  createBearerAuthInterceptor,
  createBasicAuthInterceptor,
  createRetryInterceptor,
  createCacheInterceptor,
  createLoggingInterceptor,
  HttpError,
  AuthenticationError,
  NetworkError
} from '../src/index';

// Example 1: Authentication with Bearer Token
async function bearerTokenAuth() {
  console.log('🔐 Bearer Token Authentication Example');

  const client = new HttpClient({
    baseURL: 'https://api.example.com',
    timeout: 10000
  });

  // Add Bearer token interceptor
  client.addRequestInterceptor(
    createBearerAuthInterceptor(
      () => localStorage.getItem('jwtToken') || 'fake-token-for-demo',
      {
        urlPatterns: [/^\/api\//], // Only add auth to API requests
        autoRefresh: true,
        tokenRefreshProvider: async () => {
          console.log('🔄 Refreshing token...');
          // Simulate token refresh
          return 'new-refreshed-token';
        },
        onTokenRefresh: () => {
          console.log('📡 Token refresh triggered');
        }
      }
    ).onFulfilled
  );

  // Add auth error handling
  client.addResponseInterceptor(
    createBearerAuthInterceptor(() => 'token').onRejected
  );

  try {
    const response = await client.get('/protected-resource');
    console.log('✅ Authenticated request successful');
  } catch (error) {
    console.log('❌ Authentication error:', error.message);
  }
}

// Example 2: Basic Authentication
async function basicAuthExample() {
  console.log('🔐 Basic Authentication Example');

  const client = new HttpClient({
    baseURL: 'https://api.example.com'
  });

  client.addRequestInterceptor(
    createBasicAuthInterceptor('username', 'password')
  );

  try {
    const response = await client.get('/basic-auth-protected');
    console.log('✅ Basic auth request successful');
  } catch (error) {
    console.log('❌ Basic auth error:', error.message);
  }
}

// Example 3: Advanced Retry Configuration
async function advancedRetry() {
  console.log('🔄 Advanced Retry Configuration Example');

  const client = new HttpClient({
    baseURL: 'https://api.example.com',
    timeout: 5000
  });

  // Add comprehensive retry interceptor
  client.addResponseInterceptor(
    createRetryInterceptor({
      maxRetries: 3,
      retryDelay: 1000,
      retryDelayStrategy: 'exponential',
      retryOn4xx: false, // Don't retry most 4xx errors
      retryStatusCodes: [408, 429, 500, 502, 503, 504],
      noRetryStatusCodes: [401, 403], // Never retry auth errors
      jitter: true, // Add random delay to avoid thundering herd
      maxRetryDelay: 30000, // Max 30 seconds between retries
      onRetry: (error, attempt, config) => {
        console.log(`🔄 Retry attempt ${attempt + 1} for ${config.method} ${config.url}`);
        console.log(`   Error: ${error.message}`);
      }
    }).onRejected
  );

  try {
    // This will simulate retries
    const response = await client.get('/unstable-endpoint');
    console.log('✅ Request succeeded after retries');
  } catch (error) {
    console.log('❌ Request failed after all retries');
    console.log(`   Final error: ${error.message}`);
    console.log(`   Retry count: ${error.config?._retryCount || 0}`);
  }
}

// Example 4: Memory Caching with TTL
async function memoryCaching() {
  console.log('💾 Memory Caching Example');

  const client = new HttpClient({
    baseURL: 'https://jsonplaceholder.typicode.com'
  });

  // Set up memory cache
  const cacheInterceptor = createCacheInterceptor({
    type: 'memory',
    defaultTTL: 30 * 1000, // 30 seconds
    maxSize: 100,
    cacheGetOnly: true, // Only cache GET requests
    urlPatterns: [/^\/users\//], // Only cache user requests
    onCacheHit: (key, response) => {
      console.log(`💾 Cache hit for key: ${key}`);
    },
    onCacheMiss: (key) => {
      console.log(`🔍 Cache miss for key: ${key}`);
    },
    onCacheSet: (key, response) => {
      console.log(`💾 Cached response for key: ${key}`);
    }
  });

  client.addRequestInterceptor(cacheInterceptor.onFulfilled);
  client.addResponseInterceptor(cacheInterceptor.onFulfilled);

  try {
    // First request - should miss cache
    console.log('First request:');
    const response1 = await client.get('/users/1', { cache: true });

    // Second request - should hit cache
    console.log('Second request:');
    const response2 = await client.get('/users/1', { cache: true });

    console.log('✅ Caching example completed');
  } catch (error) {
    console.log('❌ Caching error:', error.message);
  }
}

// Example 5: Advanced Logging
async function advancedLogging() {
  console.log('📊 Advanced Logging Example');

  const client = new HttpClient({
    baseURL: 'https://jsonplaceholder.typicode.com'
  });

  // Add detailed logging
  client.addRequestInterceptor(
    createLoggingInterceptor({
      level: 'debug',
      logHeaders: true,
      logBody: true,
      logTimestamp: true,
      logDuration: true,
      logRequestId: true,
      urlPatterns: [/^\/users\//], // Only log user requests
      excludeUrlPatterns: [/\/health/], // Exclude health checks
      onRequestStart: (config) => {
        console.log(`🚀 Starting request: ${config.method?.toUpperCase()} ${config.url}`);
      }
    }).onFulfilled
  );

  client.addResponseInterceptor(
    createLoggingInterceptor({
      logResponseHeaders: true,
      logResponseBody: false, // Don't log response bodies for security
      onCacheHit: (key, response) => {
        console.log(`💾 Response served from cache: ${key}`);
      },
      onRequestSuccess: (response, duration) => {
        console.log(`✅ Request completed in ${duration}ms`);
      }
    }).onFulfilled
  );

  client.addResponseInterceptor(
    createLoggingInterceptor({
      level: 'error',
      logErrorDetails: true,
      onRequestError: (error, duration) => {
        console.log(`❌ Request failed after ${duration}ms: ${error.message}`);
      }
    }).onRejected
  );

  try {
    await client.get('/users/1');
    await client.get('/nonexistent-endpoint'); // This will fail
  } catch (error) {
    console.log('Expected error for demonstration');
  }
}

// Example 6: File Upload with Progress
async function fileUpload() {
  console.log('📁 File Upload Example');

  const client = new HttpClient({
    baseURL: 'https://api.example.com',
    timeout: 30000
  });

  // Create mock file data
  const fileContent = 'This is the content of the file being uploaded.';
  const blob = new Blob([fileContent], { type: 'text/plain' });
  const file = new File([blob], 'example.txt', { type: 'text/plain' });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('description', 'Example file upload');
  formData.append('category', 'documents');

  try {
    const response = await client.post('/upload', formData, {
      headers: {
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      onUploadProgress: (progress) => {
        const percentComplete = Math.round(progress.progress * 100);
        console.log(`📤 Upload progress: ${percentComplete}%`);
        if (progress.total) {
          console.log(`   ${progress.loaded} / ${progress.total} bytes`);
        }
      },
      timeout: 60000 // Longer timeout for file uploads
    });

    console.log('✅ File uploaded successfully');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Upload failed:', error.message);
  }
}

// Example 7: Concurrent Request Management
async function concurrentRequests() {
  console.log('🔄 Concurrent Request Management Example');

  // Client with limited concurrent requests
  const client = new HttpClient({
    baseURL: 'https://jsonplaceholder.typicode.com',
    poolSize: 3 // Only allow 3 concurrent requests
  });

  console.log('Starting 10 concurrent requests with pool size of 3...');

  const startTime = Date.now();

  try {
    // Create 10 concurrent requests
    const requests = Array(10).fill(null).map((_, index) =>
      client.get(`/users/${index + 1}`)
        .then(response => ({
          id: index + 1,
          data: response.data,
          fromCache: response.fromCache,
          duration: response.duration
        }))
    );

    const results = await Promise.all(requests);
    const totalTime = Date.now() - startTime;

    console.log(`✅ All requests completed in ${totalTime}ms`);
    console.log('Results:');
    results.forEach(result => {
      console.log(`  User ${result.id}: ${result.data.name} (${result.duration}ms)`);
    });

  } catch (error) {
    console.log('❌ Concurrent requests error:', error.message);
  }
}

// Example 8: Request Deduplication
async function requestDeduplication() {
  console.log('🔄 Request Deduplication Example');

  const client = new HttpClient({
    baseURL: 'https://jsonplaceholder.typicode.com'
  });

  try {
    // Make the same request multiple times simultaneously
    console.log('Making 5 identical requests simultaneously...');

    const requests = Array(5).fill(null).map(() =>
      client.get('/users/1', {
        // The same URL and params should trigger deduplication
        params: { include: 'profile' }
      })
    );

    const startTime = Date.now();
    const results = await Promise.all(requests);
    const totalTime = Date.now() - startTime;

    console.log(`✅ All requests completed in ${totalTime}ms`);
    console.log('Deduplication should have reduced the number of actual HTTP requests');

    // All results should be identical
    const firstResult = results[0].data;
    const allIdentical = results.every(result =>
      JSON.stringify(result.data) === JSON.stringify(firstResult)
    );

    console.log(`All responses identical: ${allIdentical}`);

  } catch (error) {
    console.log('❌ Deduplication error:', error.message);
  }
}

// Example 9: Custom Error Handling
async function customErrorHandling() {
  console.log('⚠️ Custom Error Handling Example');

  const client = new HttpClient({
    baseURL: 'https://jsonplaceholder.typicode.com'
  });

  // Add custom response interceptor for error handling
  client.addResponseInterceptor((response) => {
    // Transform API error responses to a standard format
    if (response.status >= 400) {
      response.data = {
        error: true,
        message: response.data?.message || 'Request failed',
        code: response.data?.code || 'UNKNOWN_ERROR',
        details: response.data
      };
    }
    return response;
  });

  try {
    await client.get('/users/99999'); // This will likely return 404
  } catch (error) {
    if (error instanceof HttpError) {
      console.log('Error Type Analysis:');
      console.log(`- Is Authentication Error: ${error instanceof AuthenticationError}`);
      console.log(`- Is Network Error: ${error instanceof NetworkError}`);
      console.log(`- Is Retryable: ${error.isRetryable()}`);
      console.log(`- Is Client Error: ${error.isClientError()}`);
      console.log(`- Is Server Error: ${error.isServerError()}`);

      // Handle different error types differently
      if (error instanceof AuthenticationError) {
        console.log('🔐 Authentication required - redirecting to login');
      } else if (error.isRetryable()) {
        console.log('🔄 Request can be retried - implement retry logic');
      } else {
        console.log('❌ Non-retryable error - show user error message');
      }
    }
  }
}

// Example 10: Response Transformation
async function responseTransformation() {
  console.log('🔄 Response Transformation Example');

  const client = new HttpClient({
    baseURL: 'https://jsonplaceholder.typicode.com',
    transformResponse: [
      // Add timestamp to all responses
      (data) => ({
        ...data,
        _responseTimestamp: new Date().toISOString(),
        _source: 'api-v1'
      }),
      // Transform arrays to add metadata
      (data) => {
        if (Array.isArray(data)) {
          return {
            items: data,
            count: data.length,
            _isPaginated: false
          };
        }
        return data;
      }
    ]
  });

  try {
    // Get single user
    const userResponse = await client.get('/users/1');
    console.log('Single user response:', {
      name: userResponse.data.name,
      _responseTimestamp: userResponse.data._responseTimestamp,
      _source: userResponse.data._source
    });

    // Get multiple users
    const usersResponse = await client.get('/users?_limit=3');
    console.log('Multiple users response:', {
      count: usersResponse.data.count,
      firstUserName: usersResponse.data.items[0]?.name,
      _isPaginated: usersResponse.data._isPaginated
    });

  } catch (error) {
    console.log('❌ Transformation error:', error.message);
  }
}

// Run all advanced examples
async function runAdvancedExamples() {
  console.log('🚀 Running Advanced Usage Examples\n');

  await bearerTokenAuth();
  console.log('');

  await basicAuthExample();
  console.log('');

  await advancedRetry();
  console.log('');

  await memoryCaching();
  console.log('');

  await advancedLogging();
  console.log('');

  await fileUpload();
  console.log('');

  await concurrentRequests();
  console.log('');

  await requestDeduplication();
  console.log('');

  await customErrorHandling();
  console.log('');

  await responseTransformation();
  console.log('');

  console.log('✅ All advanced examples completed!');
}

// Run the examples if this file is executed directly
if (require.main === module) {
  runAdvancedExamples().catch(console.error);
}

export {
  bearerTokenAuth,
  basicAuthExample,
  advancedRetry,
  memoryCaching,
  advancedLogging,
  fileUpload,
  concurrentRequests,
  requestDeduplication,
  customErrorHandling,
  responseTransformation
};