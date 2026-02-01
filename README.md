# Toolkit House

A comprehensive monorepo containing shared utilities, component libraries, and demo applications built with TypeScript, React, Vue, Svelte, SolidJS, and Go.

## 📁 Project Structure

```
toolkit-house/
├── packages/                    # Shared packages and utilities (11 total)
│   ├── ts-utils/              # Comprehensive TypeScript utility library
│   ├── validation/            # Type-safe validation with fluent API
│   ├── http-client/           # HTTP client with concurrency control
│   ├── logger/                # Structured logging library
│   ├── security/              # Security utilities
│   ├── realtime/              # Real-time communication (WebSocket)
│   ├── types/                 # Shared TypeScript types
│   ├── constants/             # Shared constants
│   ├── shared-config/         # Shared build configurations
│   ├── vue-components/        # Vue 3 component library (submodule)
│   └── react-components/      # React component library
├── apps/                      # Applications and services (6 total)
│   ├── react-demo/           # React 19 demo application
│   ├── vue-demo/             # Vue 3 demo application
│   ├── svelte-demo/          # Svelte demo application
│   ├── solidjs-demo/         # SolidJS demo application
│   ├── api-gateway/          # GraphQL API Gateway
│   └── server-go/            # Go backend server
└── docs/                     # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (for TypeScript/JavaScript packages)
- pnpm package manager
- Go 1.21+ (for the Go server)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd toolkit-house

# Install dependencies
pnpm install
```

### Development Commands

```bash
# Build all packages
pnpm run build

# Run all tests
pnpm run test

# Type check all packages
pnpm run typecheck

# Lint all packages
pnpm run lint
```

## 📋 Packages Overview

### 🔧 Core Utilities

#### @toolkit-house/ts-utils
Comprehensive TypeScript utility library with algorithms and data structures.

**Features:**
- **Data Structures**: Trie, Tree, Heap, Graph, Stack, Queue, Linked List
- **Algorithms**: Graph algorithms (BFS, DFS, Dijkstra), Dynamic Programming, Sorting, Searching
- **Functional Programming**: Curry, compose, pipe, and more
- **Utilities**: Network (RequestPool), String similarity, Date manipulation, Cache (LRU, FIFO)
- **Advanced**: Audio processing, Monitoring, Distributed tracing

**Usage:**
```typescript
import { RequestPool } from '@toolkit-house/ts-utils/net'
import { levenshteinDistance } from '@toolkit-house/ts-utils/string'
import { LRUCache } from '@toolkit-house/ts-utils/cache'

const pool = new RequestPool(3)
const result = await pool.add(() => fetch('/api/endpoint'))
```

#### @toolkit-house/validation
Type-safe validation library with fluent API.

**Features:**
- Schema-based validation
- Built-in validators (required, email, minLength, etc.)
- Custom validator support
- TypeScript type inference

**Usage:**
```typescript
import { Schema } from '@toolkit-house/validation'

const userSchema = new Schema({
  name: v => v.string().minLength(2),
  email: v => v.string().email(),
  age: v => v.number().min(18)
})
```

#### @toolkit-house/http-client
Modern HTTP client with advanced features.

**Features:**
- RequestPool for concurrency control
- Request/response interceptors
- Retry logic
- Timeout handling

**Usage:**
```typescript
import { HttpClient } from '@toolkit-house/http-client'

const client = new HttpClient({ maxConcurrent: 5 })
const response = await client.get('/api/users')
```

#### @toolkit-house/logger
Lightweight, performant logging library with structured logging support.

**Features:**
- Multiple transport options (console, file)
- Customizable formatters
- Log filtering by level
- High-performance logging

#### @toolkit-house/security
Security utilities for key management and encryption.

#### @toolkit-house/realtime
Real-time communication utilities using WebSocket.

**Usage:**
```typescript
import { WebSocketClient } from '@toolkit-house/realtime'

const ws = new WebSocketClient('ws://localhost:8080')
ws.on('message', (data) => console.log(data))
```

### 🎨 UI Components

#### @toolkit-house/vue-components
Vue 3 component library built with UnoCSS.

**Components:**
- Button
- Input
- Modal
- Skeleton

**Usage:**
```vue
<script setup>
import { Button } from '@toolkit-house/vue-components'
</script>

<template>
  <Button variant="primary" @click="handleClick">
    Click me
  </Button>
</template>
```

#### @toolkit-house/react-components
React component library.

### ⚙️ Configuration

#### @toolkit-house/shared-config
Shared TypeScript, ESLint, and Vite configurations.

#### @toolkit-house/types
Shared TypeScript type definitions.

#### @toolkit-house/constants
Shared constants.

## 🌐 Applications

### Demo Applications

#### react-demo
React 19 demo application using Vite and TypeScript.

```bash
cd apps/react-demo
pnpm run dev
```

#### vue-demo
Vue 3 demo application using Vite.

```bash
cd apps/vue-demo
pnpm run dev
```

#### svelte-demo
Svelte demo application.

#### solidjs-demo
SolidJS demo application.

### Services

#### api-gateway
GraphQL API Gateway built with graphql-yoga.

**Features:**
- GraphQL schema and resolvers
- GraphQL Playground
- Planned: JWT auth, Shield authorization, rate limiting, subscriptions

**Usage:**
```bash
cd apps/api-gateway
pnpm run dev
# GraphQL endpoint: http://localhost:4000/graphql
```

#### server-go
Go backend server.

**Status:** Basic implementation (~128 lines), needs enhancement.

**Planned Features:**
- Gin framework for routing
- Middleware (CORS, Request ID, Logging, Recovery)
- Health check endpoints
- WebSocket support
- Database integration

**Usage:**
```bash
cd apps/server-go
go run main.go
```

## 📚 Documentation

### Development Guides
- [Architecture Documentation](ARCHITECTURE.md)
- [Contributing Guide](CONTRIBUTING.md)

### Package Documentation
- [ts-utils API](packages/ts-utils/README.md)
- [validation API](packages/validation/README.md)
- [http-client API](packages/http-client/README.md)
- [logger API](packages/logger/README.md)
- [security API](packages/security/README.md)
- [realtime API](packages/realtime/README.md)

## 🔧 Build Systems

### TypeScript Packages
- Build with `unbuild` (modern library builds)
- TypeScript type checking
- Vitest for testing
- ESLint for code quality

### TypeScript Apps
- Vite for development and production builds
- Hot module replacement
- Optimized production builds

### Go Applications
- Standard Go build system
- Go workspace support

## 🧪 Testing

### TypeScript Testing
```bash
# Run all tests
pnpm run test

# Run tests with coverage
pnpm run test:coverage

# Run tests for specific package
cd packages/ts-utils
pnpm run test
```

### Go Testing
```bash
cd apps/server-go
go test ./...
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on contributing to this project.

## 🔗 Related Projects

- [Vue Components](packages/vue-components/)
- [React Components](packages/react-components/)
- [Go Server](apps/server-go/)
- [API Gateway](apps/api-gateway/)
