# Applications

Demo applications showcasing Toolkit House packages.

## Demo Apps

| Application | Description | Framework | URL |
|-------------|-------------|----------|-----|
| [React Demo](/apps/react-demo) | Full-stack GraphQL demo with Apollo | React 19 | `/react-demo` |
| [Vue Demo](/apps/vue-demo) | Vue 3 demo with Composition API | Vue 3 | `/vue-demo` |
| Svelte Demo | Svelte demo application | Svelte | `/svelte-demo` |
| SolidJS Demo | SolidJS demo application | SolidJS | `/solidjs-demo` |

## Services

| Application | Description | Technology |
|-------------|-------------|------------|
| [API Gateway](/apps/api-gateway) | GraphQL API Gateway with auth & rate limiting | graphql-yoga |
| [Go Server](/apps/server-go) | Go backend REST API | Go 1.21+ |

## Running Demos

### Prerequisites

```bash
# Install dependencies
pnpm install
```

### React Demo

```bash
cd apps/react-demo
pnpm run dev
# http://localhost:5173
```

### Vue Demo

```bash
cd apps/vue-demo
pnpm run dev
# http://localhost:5174
```

### API Gateway

```bash
cd apps/api-gateway
pnpm run dev
# http://localhost:4000/graphql
```

## Features Overview

### React Demo

- Apollo Client for GraphQL
- JWT Authentication
- Real-time subscriptions
- RequestPool for concurrency control

### Vue Demo

- Apollo Client for GraphQL
- Composition API
- Reactive state management

### API Gateway

- GraphQL Schema & Resolvers
- Shield Authorization
- Redis Rate Limiting
- WebSocket Subscriptions
