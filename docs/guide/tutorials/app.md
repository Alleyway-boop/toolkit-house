# Building an App

Learn how to create a new demo application in the Toolkit House monorepo.

## Overview

This tutorial shows how to create a new Svelte demo application using the Toolkit House packages.

## Step 1: Create App Directory

```bash
mkdir -p apps/svelte-new-demo/src
cd apps/svelte-new-demo
```

## Step 2: Initialize package.json

Create `apps/svelte-new-demo/package.json`:

```json
{
  "name": "svelte-new-demo",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "svelte-check && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "typecheck": "svelte-check --tsconfig ./tsconfig.json"
  },
  "dependencies": {
    "@toolkit-house/ts-utils": "workspace:*",
    "@toolkit-house/http-client": "workspace:*"
  },
  "devDependencies": {
    "@sveltejs/vite-plugin-svelte": "^3.0.0",
    "@toolkit-house/shared-config": "workspace:*",
    "svelte": "^4.2.0",
    "svelte-check": "^3.6.0",
    "tslib": "^2.6.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.0",
    "vitest": "^1.1.0"
  }
}
```

## Step 3: Create TypeScript Config

Create `apps/svelte-new-demo/tsconfig.json`:

```json
{
  "extends": "@toolkit-house/shared-config/tsconfig.app.json",
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "module": "ESNext",
    "resolveJsonModule": true,
    "strict": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "types": ["vite/client"]
  },
  "include": ["src/**/*.d.ts", "src/**/*.ts", "src/**/*.svelte"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `apps/svelte-new-demo/tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

## Step 4: Create Vite Config

Create `apps/svelte-new-demo/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

export default defineConfig({
  plugins: [svelte()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 5175,
    strictPort: false,
  },

  build: {
    target: 'ES2022',
    outDir: './dist',
    emptyOutDir: true,
    sourcemap: true,
  },
})
```

## Step 5: Create Svelte Config

Create `apps/svelte-new-demo/svelte.config.js`:

```javascript
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  preprocess: vitePreprocess(),
}
```

## Step 6: Create Entry Point

### HTML Entry

Create `apps/svelte-new-demo/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Svelte Demo - Toolkit House</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

### Main Entry

Create `apps/svelte-new-demo/src/main.ts`:

```typescript
import './app.css'
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app')!,
})

export default app
```

### Styles

Create `apps/svelte-new-demo/src/app.css`:

```css
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color: #213547;
  background-color: #ffffff;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  min-height: 100vh;
}

#app {
  width: 100%;
  min-height: 100vh;
}
```

## Step 7: Create App Component

Create `apps/svelte-new-demo/src/App.svelte`:

```svelte
<script lang="ts">
  import { onMount } from 'svelte'
  import { RequestPool } from '@toolkit-house/ts-utils/net'
  import type { Post } from './types'

  let posts: Post[] = []
  let loading = false
  let error: string | null = null

  async function fetchPosts() {
    loading = true
    error = null

    try {
      const pool = new RequestPool(3)
      const urls = Array.from({ length: 10 }, (_, i) =>
        `https://jsonplaceholder.typicode.com/posts/${i + 1}`
      )

      const responses = await Promise.all(
        urls.map(url =>
          pool.add(() =>
            fetch(url)
              .then(res => res.json())
              .then(data => data as Post)
          )
        )
      )

      posts = responses
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      loading = false
    }
  }

  onMount(() => {
    fetchPosts()
  })
</script>

<div class="container">
  <header>
    <h1>🏠 Svelte Demo</h1>
    <p>Demo app using Toolkit House packages</p>
  </header>

  <main>
    <div class="card">
      <h2>RequestPool Demo</h2>
      <p>
        Demonstrates the RequestPool utility from @toolkit-house/ts-utils
        for controlling concurrent requests.
      </p>

      <button on:click={fetchPosts} disabled={loading}>
        {loading ? 'Fetching...' : 'Fetch 10 Posts (Max 3 Concurrent)'}
      </button>

      {#if error}
        <div class="error">
          Error: {error}
        </div>
      {/if}

      {#if posts.length > 0}
        <div class="posts">
          {#each posts as post}
            <div class="post-item">
              <h3>{post.title}</h3>
              <p>{post.body}</p>
              <small>Post ID: {post.id}</small>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </main>

  <footer>
    <p>
      Built with <a href="https://vitejs.dev" target="_blank">Vite</a> +
      <a href="https://svelte.dev" target="_blank">Svelte</a>
    </p>
  </footer>
</div>

<style>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  text-align: center;
  margin-bottom: 3rem;
}

header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

header p {
  color: #666;
}

.card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.card h2 {
  margin-bottom: 0.5rem;
}

.card p {
  color: #666;
  margin-bottom: 1rem;
}

button {
  background: #646cff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

button:hover:not(:disabled) {
  background: #535bf2;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
}

.posts {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
}

.post-item {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  border-left: 3px solid #646cff;
}

.post-item h3 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.post-item p {
  margin-bottom: 0.5rem;
}

.post-item small {
  color: #999;
}

footer {
  margin-top: auto;
  text-align: center;
  padding-top: 2rem;
  color: #666;
}

footer a {
  color: #646cff;
  text-decoration: none;
}

footer a:hover {
  text-decoration: underline;
}
</style>
```

## Step 8: Create Types

Create `apps/svelte-new-demo/src/types.ts`:

```typescript
export interface Post {
  id: number
  title: string
  body: string
  userId: number
}
```

## Step 9: Add to Root Scripts

Update root `package.json` to include the new app in typecheck:

```json
{
  "scripts": {
    "typecheck": "pnpm -r --filter './apps/**' run typecheck"
  }
}
```

## Step 10: Install and Run

```bash
# From root
pnpm install

# Run the app
cd apps/svelte-new-demo
pnpm run dev
```

Visit `http://localhost:5175` to see the app.

## Build and Deploy

```bash
# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## App Checklist

- [ ] package.json with dependencies
- [ ] tsconfig.json extending shared config
- [ ] vite.config.ts with aliases
- [ ] svelte.config.js
- [ ] index.html entry point
- [ ] src/main.ts app initialization
- [ ] src/App.svelte main component
- [ ] Type definitions
- [ ] Dev server runs successfully
- [ ] Build succeeds
- [ ] Type checking passes

## Next Steps

- Learn about [Creating a Component](/guide/tutorials/component)
- Explore [Adding a Package](/guide/tutorials/package)
- Read [Development Guide](/development/setup)
