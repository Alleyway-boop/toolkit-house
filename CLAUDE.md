# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a monorepo using both pnpm workspaces (for JavaScript/TypeScript) and Go workspaces, containing:

### Packages (11 total)

**Core Utilities:**
- **`ts-utils/`**: Comprehensive TypeScript utility library with network, string, array, object, date, validation, transform, sorting, searching, graph algorithms, dynamic programming, data structures, functional programming, audio processing, monitoring, tracing, and cache utilities
- **`validation/`**: Type-safe validation library with fluent API
- **`http-client/`**: Modern HTTP client with concurrency control and interceptors
- **`logger/`**: Lightweight, performant logging library with structured logging support
- **`types/`**: Shared TypeScript type definitions
- **`constants/`**: Shared constants
- **`security/`**: Security utilities for key management and encryption
- **`realtime/`**: Real-time communication utilities (WebSocket)

**Configuration:**
- **`shared-config/`**: Shared TypeScript, ESLint, and Vite configurations

**UI Components:**
- **`vue-components/`**: Vue 3 component library (Button, Input, Modal, Skeleton) - submodule
- **`react-components/`**: React component library

### Applications (6 total)

**Demo Applications:**
- **`react-demo/`**: React 19 demo application using Vite
- **`vue-demo/`**: Vue 3 demo application using Vite
- **`svelte-demo/`**: Svelte demo application
- **`solidjs-demo/`**: SolidJS demo application

**Services:**
- **`api-gateway/`**: GraphQL API Gateway using graphql-yoga
- **`server-go/`**: Go backend server (basic implementation, needs enhancement)

## Development Commands

### Root Level
```bash
# Build all packages/apps
pnpm run build

# Install dependencies
pnpm install

# Run all tests
pnpm run test

# Type check all packages
pnpm run typecheck

# Lint all packages
pnpm run lint
```

### Package Level Commands

#### ts-utils (`packages/ts-utils/`)
```bash
pnpm run dev              # Run with unbuild stub
pnpm run build            # Build with unbuild
pnpm run test             # Run tests with vitest
pnpm run test:bench       # Run benchmark tests
pnpm run test:coverage    # Run tests with coverage
pnpm run typecheck        # Type check with TypeScript
pnpm run lint             # Run ESLint
```

**Key Exports:**
- `@toolkit-house/ts-utils` - Main utilities
- `@toolkit-house/ts-utils/net` - Network utilities (RequestPool)
- `@toolkit-house/ts-utils/string` - String utilities (similarity, matching)
- `@toolkit-house/ts-utils/array` - Array operations
- `@toolkit-house/ts-utils/object` - Object operations
- `@toolkit-house/ts-utils/date` - Date utilities
- `@toolkit-house/ts-utils/validation` - Validation helpers
- `@toolkit-house/ts-utils/transform` - Data transformation
- `@toolkit-house/ts-utils/sorting` - Sorting algorithms
- `@toolkit-house/ts-utils/searching` - Search algorithms
- `@toolkit-house/ts-utils/graph` - Graph algorithms
- `@toolkit-house/ts-utils/dynamic-programming` - DP algorithms
- `@toolkit-house/ts-utils/data-structures` - Trie, Tree, Heap, Graph, Stack, Queue, LinkedList
- `@toolkit-house/ts-utils/functional` - Functional programming utilities
- `@toolkit-house/ts-utils/audio` - Audio processing utilities
- `@toolkit-house/ts-utils/monitoring` - Monitoring utilities
- `@toolkit-house/ts-utils/tracing` - Distributed tracing
- `@toolkit-house/ts-utils/cache` - Cache implementations (LRU, FIFO)

#### validation (`packages/validation/`)
```bash
pnpm run dev              # Run with unbuild stub
pnpm run build            # Build with unbuild
pnpm run test             # Run tests with vitest
pnpm run typecheck        # Type check with TypeScript
pnpm run lint             # Run ESLint
```

**Key Exports:**
- `@toolkit-house/validation` - Main validation API
- `@toolkit-house/validation/types` - Type definitions
- `@toolkit-house/validation/schema` - Schema validation
- `@toolkit-house/validation/validators` - Built-in validators
- `@toolkit-house/validation/utils` - Validation utilities

#### http-client (`packages/http-client/`)
```bash
pnpm run dev              # Run with unbuild stub
pnpm run build            # Build with unbuild
pnpm run test             # Run tests with vitest
pnpm run typecheck        # Type check with TypeScript
pnpm run lint             # Run ESLint
```

**Key Exports:**
- `@toolkit-house/http-client` - Main HTTP client with RequestPool
- `@toolkit-house/http-client/types` - Type definitions

#### logger (`packages/logger/`)
```bash
pnpm run dev              # Run with unbuild stub
pnpm run build            # Build with unbuild
pnpm run test             # Run tests with vitest
pnpm run typecheck        # Type check with TypeScript
```

**Key Exports:**
- `@toolkit-house/logger` - Main logger
- `@toolkit-house/logger/core` - Core logging functionality
- `@toolkit-house/logger/transports` - Transport implementations
- `@toolkit-house/logger/formatters` - Log formatters
- `@toolkit-house/logger/filters` - Log filters

#### security (`packages/security/`)
```bash
pnpm run dev              # Run with unbuild stub
pnpm run build            # Build with unbuild
pnpm run test             # Run tests with vitest
pnpm run typecheck        # Type check with TypeScript
```

#### realtime (`packages/realtime/`)
```bash
pnpm run dev              # Run with unbuild stub
pnpm run build            # Build with unbuild
pnpm run test             # Run tests with vitest
pnpm run typecheck        # Type check with TypeScript
```

#### vue-components (`packages/vue-components/`)
```bash
pnpm run dev              # Start development with Storybook
pnpm run build            # Build component library
pnpm run test             # Run tests with vitest
```

**Available Components:**
- Button
- Input
- Modal
- Skeleton

### Application Level Commands

#### react-demo (`apps/react-demo/`)
```bash
pnpm run dev        # Start Vite dev server
pnpm run build      # Build for production
pnpm run lint       # Run ESLint
pnpm run preview    # Preview production build
```

#### vue-demo (`apps/vue-demo/`)
```bash
pnpm run dev        # Start Vite dev server
pnpm run build      # Build for production
```

#### api-gateway (`apps/api-gateway/`)
```bash
pnpm run dev        # Start GraphQL server with tsx watch
pnpm run build      # Build with TypeScript
pnpm run start      # Run compiled server
pnpm run typecheck  # Type check with TypeScript
```

**GraphQL Endpoint:** `http://localhost:4000/graphql`

### Go Development

#### server-go (`apps/server-go/`)
```bash
# Go workspace commands
go run main.go      # Run the Go server
go build            # Build the Go server
go test ./...       # Run tests
```

**Current Status:** Basic implementation (~128 lines), needs enhancement with:
- Gin framework for routing
- Middleware (CORS, Request ID, Logging, Recovery)
- Health check endpoints
- WebSocket support
- Database integration
- Proper project structure

## Architecture Overview

### Monorepo Structure
- Uses **pnpm workspaces** for JavaScript/TypeScript packages
- Uses **Go workspaces** (`go.work`) for Go packages
- All packages are interconnected through workspace dependencies

### Key Components

#### ts-utils Package
A comprehensive TypeScript utility library with:

**Algorithm & Data Structure Modules:**
- **Data Structures**: Trie, Tree, Heap, Graph, Stack, Queue, Linked List
- **Graph Algorithms**: BFS, DFS, Dijkstra, topological sort
- **Dynamic Programming**: Common DP patterns (Fibonacci, LCS, Knapsack)
- **Searching**: Binary search, interpolation search
- **Sorting**: Quick sort, merge sort, heap sort, etc.
- **Functional Programming**: Curry, compose, pipe, etc.

**Utility Modules:**
- **Network**: RequestPool class for controlling concurrent requests
- **String**: String similarity (Levenshtein, Jaro-Winkler), pattern matching
- **Array & Object**: Comprehensive manipulation utilities
- **Date**: Date formatting, parsing, manipulation
- **Validation**: Common validation helpers
- **Transform**: Data transformation utilities
- **Audio**: Audio processing utilities
- **Monitoring & Tracing**: Performance monitoring and distributed tracing
- **Cache**: LRU, FIFO cache implementations

#### validation Package
Type-safe validation library with fluent API leveraging ts-utils:
- Schema-based validation
- Built-in validators (required, email, minLength, etc.)
- Custom validator support
- TypeScript type inference

#### http-client Package
Modern HTTP client with:
- RequestPool for concurrency control
- Interceptor support (request/response)
- Retry logic
- Timeout handling
- Optional logging integration

#### api-gateway
GraphQL API Gateway built with graphql-yoga:
- GraphQL schema and resolvers
- Currently in basic implementation
- Planned: JWT auth, Shield authorization, rate limiting, subscriptions

#### server-go
Go backend server:
- Module path: `github.com/seci/server-go`
- Go 1.21+ required
- Basic HTTP server implementation
- Needs: Gin framework, middleware, WebSocket, database integration

### Build Systems
- **TypeScript Libraries**: Uses `unbuild` for modern library builds
- **TypeScript Apps**: Uses Vite for development and production builds
- **Go**: Standard Go build system
- **Testing**: Vitest for TypeScript, standard Go testing
- **Linting**: ESLint for TypeScript

### Dependencies
- **Workspace dependencies**: Apps can use local packages via `workspace:*`
- **External dependencies**: Managed via pnpm lock file
- **Go modules**: Standard Go module system

## Development Workflow

1. **Install dependencies**: `pnpm install` at root
2. **Build packages**: Use `pnpm run build` at root or individual package builds
3. **Run tests**: `pnpm run test` in specific packages or `pnpm run test` at root
4. **Type checking**: `pnpm run typecheck` for TypeScript packages
5. **Linting**: `pnpm run lint` for code quality

## Package Dependencies

```
@toolkit-house/validation
├── @toolkit-house/ts-utils (workspace:*)
├── @toolkit-house/types (workspace:*)
└── @toolkit-house/constants (workspace:*, peer)

@toolkit-house/http-client
├── @toolkit-house/ts-utils (workspace:*)
├── @toolkit-house/logger (workspace:*, optional)
└── @toolkit-house/constants (workspace:*, optional)

@toolkit-house/realtime
└── ws (^8.16.0)

@toolkit-house/security
└── crypto (^1.0.1)

apps/react-demo
└── @toolkit-house/ts-utils (workspace:*)

apps/vue-demo
├── @toolkit-house/ts-utils (workspace:*)
└── @toolkit-house/vue-components (workspace:*)
```

## Important Notes

- All TypeScript packages follow modern patterns with proper exports
- ts-utils is much more comprehensive than initially documented - includes advanced algorithms, data structures, and utilities
- vue-components is a git submodule
- server-go needs significant enhancement (currently ~128 lines)
- api-gateway is GraphQL-based, not REST
- Multiple demo apps exist: React, Vue, Svelte, SolidJS
- All packages use `unbuild` for library builds except apps which use Vite
