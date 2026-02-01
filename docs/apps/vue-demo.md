# Vue Demo

Vue 3 demo application demonstrating Toolkit House packages and components.

## Overview

The Vue demo showcases:
- Apollo Client for GraphQL API Gateway communication
- @toolkit-house/vue-components UI components
- @toolkit-house/ts-utils utilities
- Composition API
- Reactive state management

## Installation

```bash
cd apps/vue-demo
pnpm install
```

## Development

```bash
pnpm run dev
```

Runs at `http://localhost:5174`

## Build

```bash
pnpm run build
pnpm run preview
```

## Environment Variables

```bash
# .env
VITE_GRAPHQL_URL=http://localhost:4000/graphql
VITE_GRAPHQL_WS_URL=ws://localhost:4000/graphql
```

## Technologies

- Vue 3
- Vite
- Apollo Client
- Tailwind CSS
- @toolkit-house/vue-components
- @toolkit-house/ts-utils

## Source Code

Located at: `/root/toolkit-house/apps/vue-demo/src/`

**Key Files:**
- `App.vue` - Main application component

## License

MIT
