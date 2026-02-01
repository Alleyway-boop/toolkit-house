# Getting Started

Welcome to Toolkit House! This guide will help you get started with our modern frontend toolkit monorepo.

## What is Toolkit House?

Toolkit House is a comprehensive monorepo containing:

- **Multiple Framework Templates**: React, Vue, Svelte, and SolidJS starter applications
- **Shared Utilities**: TypeScript utility libraries for common operations
- **Component Libraries**: Pre-built UI components for React and Vue
- **API Gateway**: GraphQL server with authentication and rate limiting
- **Go Backend**: High-performance Go server for microservices

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0.0 or higher
- **pnpm** 8.0.0 or higher (package manager)
- **Go** 1.21+ (for the Go server)
- **Git** (for version control)

### Check Your Versions

```bash
node --version   # Should be v18+
pnpm --version   # Should be 8+
go version       # Should be 1.21+
git --version    # Any recent version
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/toolkit-house.git
cd toolkit-house
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all dependencies for the monorepo using pnpm workspaces.

### 3. Build All Packages

```bash
pnpm run build
```

## Project Structure

```
toolkit-house/
├── packages/                    # Shared packages
│   ├── ts-utils/               # TypeScript utilities
│   ├── validation/             # Validation library
│   ├── http-client/            # HTTP client with pooling
│   ├── logger/                 # Logging library
│   ├── security/               # Security utilities
│   ├── realtime/               # WebSocket utilities
│   ├── react-components/       # React UI components
│   ├── vue-components/         # Vue UI components (submodule)
│   └── shared-config/          # Shared configurations
├── apps/                       # Applications
│   ├── react-demo/            # React demo app
│   ├── vue-demo/              # Vue demo app
│   ├── svelte-demo/           # Svelte demo app
│   ├── solidjs-demo/          # SolidJS demo app
│   ├── api-gateway/           # GraphQL API
│   └── server-go/             # Go backend
└── docs/                       # VitePress documentation
```

## Available Scripts

### Root Level Scripts

```bash
# Build all packages and apps
pnpm run build

# Start all apps in development mode
pnpm run dev

# Run linting across all packages
pnpm run lint

# Run tests across all packages
pnpm run test

# Type check all TypeScript code
pnpm run typecheck
```

### Package Level Scripts

```bash
# Build a specific package
cd packages/ts-utils && pnpm run build

# Run tests for a package
cd packages/validation && pnpm run test

# Start a demo app
cd apps/react-demo && pnpm run dev
```

## Quick Start Examples

### React Demo

```bash
cd apps/react-demo
pnpm run dev
# Open http://localhost:5173
```

### Vue Demo

```bash
cd apps/vue-demo
pnpm run dev
# Open http://localhost:5174
```

### API Gateway

```bash
cd apps/api-gateway
pnpm run dev
# Open http://localhost:4000/graphql
```

### Go Server

```bash
cd apps/server-go
go run main.go
# Server starts on http://localhost:8080
```

## Development Workflow

### 1. Make Changes

Edit files in any package or app.

### 2. Watch for Changes

Most apps support hot module replacement (HMR):

```bash
cd apps/react-demo  # or vue-demo, svelte-demo, etc.
pnpm run dev
```

### 3. Run Tests

```bash
# Run tests for a specific package
cd packages/ts-utils
pnpm run test

# Run tests with coverage
pnpm run test:coverage
```

### 4. Type Check

```bash
# Type check a specific package
cd packages/validation
pnpm run typecheck
```

### 5. Build

```bash
# Build a specific package
cd packages/http-client
pnpm run build
```

## Next Steps

- [Quick Start Guide](/guide/quick-start) - Learn the basics quickly
- [Installation Guide](/guide/installation) - Detailed setup instructions
- [Package Documentation](/packages/) - Explore available packages
- [App Documentation](/apps/) - Learn about demo applications
