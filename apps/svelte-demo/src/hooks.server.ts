import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Add any server-side hooks here
  console.log(
    `[${new Date().toISOString()}] ${event.request.method} ${event.url.pathname}`
  );

  const response = await resolve(event);

  // Add custom headers
  response.headers.set('X-Powered-By', 'SvelteKit');

  return response;
};
