/**
 * Basic usage examples for @toolkit-house/http-client
 */

import { HttpClient, HttpError } from '../src/index';

// Example 1: Simple GET request
async function simpleGetRequest() {
  const client = new HttpClient();

  try {
    const response = await client.get('https://jsonplaceholder.typicode.com/users/1');
    console.log('User data:', response.data);
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Request duration:', response.duration, 'ms');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 2: POST request with data
async function postRequest() {
  const client = new HttpClient();

  const newUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '1-555-555-5555'
  };

  try {
    const response = await client.post('https://jsonplaceholder.typicode.com/users', newUser);
    console.log('Created user:', response.data);
    console.log('Status:', response.status); // Should be 201
  } catch (error) {
    console.error('Error creating user:', error.message);
  }
}

// Example 3: Configuration and headers
async function configuredClient() {
  const client = new HttpClient({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'MyApp/1.0.0'
    }
  });

  try {
    // URL will be combined with baseURL
    const response = await client.get('/users');
    console.log('All users:', response.data.slice(0, 3)); // Show first 3 users
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 4: Query parameters
async function queryParameters() {
  const client = new HttpClient();

  try {
    // The params will be serialized to query string
    const response = await client.get('https://jsonplaceholder.typicode.com/posts', {
      params: {
        userId: 1,
        _limit: 5
      }
    });

    console.log('Posts for user 1:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 5: Error handling
async function errorHandling() {
  const client = new HttpClient();

  try {
    // This will return 404
    await client.get('https://jsonplaceholder.typicode.com/users/9999');
  } catch (error) {
    if (error instanceof HttpError) {
      console.log('HTTP Error Details:');
      console.log('- Status:', error.status);
      console.log('- Status Text:', error.statusText);
      console.log('- Message:', error.message);
      console.log('- Is Axios Error:', error.isAxiosError);
      console.log('- Is Client Error:', error.isClientError());
      console.log('- Is Server Error:', error.isServerError());
      console.log('- Is Retryable:', error.isRetryable());
      console.log('- User Friendly Message:', error.getUserFriendlyMessage());
    }
  }
}

// Example 6: PUT and DELETE requests
async function updateAndDelete() {
  const client = new HttpClient({
    baseURL: 'https://jsonplaceholder.typicode.com'
  });

  try {
    // Update user (PUT)
    const updatedUser = await client.put('/users/1', {
      id: 1,
      name: 'Updated Name',
      email: 'updated@example.com'
    });

    console.log('Updated user:', updatedUser.data);

    // Delete user (DELETE)
    const deleteResponse = await client.delete('/users/1');
    console.log('Delete status:', deleteResponse.status); // Should be 200 or 204
  } catch (error) {
    console.error('Error updating/deleting user:', error.message);
  }
}

// Example 7: Request with custom configuration
async function customRequest() {
  const client = new HttpClient();

  try {
    const response = await client.get('https://jsonplaceholder.typicode.com/photos/1', {
      headers: {
        'Accept': 'application/json'
      },
      timeout: 5000,
      responseType: 'json' // Could also be 'text', 'blob', 'arrayBuffer'
    });

    console.log('Photo:', {
      id: response.data.id,
      title: response.data.title,
      url: response.data.url
    });
  } catch (error) {
    console.error('Error fetching photo:', error.message);
  }
}

// Example 8: Multiple requests
async function multipleRequests() {
  const client = new HttpClient();

  try {
    // Run multiple requests in parallel
    const [users, posts, comments] = await Promise.all([
      client.get('https://jsonplaceholder.typicode.com/users'),
      client.get('https://jsonplaceholder.typicode.com/posts'),
      client.get('https://jsonplaceholder.typicode.com/comments')
    ]);

    console.log('Users count:', users.data.length);
    console.log('Posts count:', posts.data.length);
    console.log('Comments count:', comments.data.length);
  } catch (error) {
    console.error('Error in parallel requests:', error.message);
  }
}

// Example 9: Request timeout
async function timeoutExample() {
  const client = new HttpClient({
    timeout: 100 // 100ms timeout - will likely timeout
  });

  try {
    await client.get('https://jsonplaceholder.typicode.com/posts');
  } catch (error) {
    if (error.message.includes('timeout')) {
      console.log('Request timed out as expected');
    } else {
      console.log('Other error:', error.message);
    }
  }
}

// Example 10: HEAD and OPTIONS requests
async function headAndOptions() {
  const client = new HttpClient({
    baseURL: 'https://jsonplaceholder.typicode.com'
  });

  try {
    // HEAD request - get headers without body
    const headResponse = await client.head('/users/1');
    console.log('HEAD response headers:', headResponse.headers);

    // OPTIONS request - get allowed methods
    const optionsResponse = await client.options('/users/1');
    console.log('OPTIONS response status:', optionsResponse.status);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run all examples
async function runExamples() {
  console.log('🚀 Running Basic Usage Examples\n');

  console.log('1. Simple GET Request:');
  await simpleGetRequest();
  console.log('');

  console.log('2. POST Request with Data:');
  await postRequest();
  console.log('');

  console.log('3. Configured Client:');
  await configuredClient();
  console.log('');

  console.log('4. Query Parameters:');
  await queryParameters();
  console.log('');

  console.log('5. Error Handling:');
  await errorHandling();
  console.log('');

  console.log('6. Update and Delete:');
  await updateAndDelete();
  console.log('');

  console.log('7. Custom Request Configuration:');
  await customRequest();
  console.log('');

  console.log('8. Multiple Requests:');
  await multipleRequests();
  console.log('');

  console.log('9. Request Timeout:');
  await timeoutExample();
  console.log('');

  console.log('10. HEAD and OPTIONS Requests:');
  await headAndOptions();
  console.log('');

  console.log('✅ All examples completed!');
}

// Run the examples if this file is executed directly
if (require.main === module) {
  runExamples().catch(console.error);
}

export {
  simpleGetRequest,
  postRequest,
  configuredClient,
  queryParameters,
  errorHandling,
  updateAndDelete,
  customRequest,
  multipleRequests,
  timeoutExample,
  headAndOptions
};