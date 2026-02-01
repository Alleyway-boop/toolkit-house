---
layout: home

hero:
  name: Toolkit House
  text: Modern Frontend Toolkit
  tagline: A comprehensive monorepo with React, Vue, Svelte, and SolidJS templates
  image:
    src: /logo.svg
    alt: Toolkit House
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/your-org/toolkit-house

  features:
    - icon: ⚡️
      title: Lightning Fast
      details: Built with Vite for instant hot module replacement and optimized production builds.
    - icon: 🔷
      title: TypeScript First
      details: Full TypeScript support with strict mode enabled and comprehensive type definitions.
    - icon: 📦
      title: Monorepo Ready
      details: Powered by pnpm workspaces for efficient dependency management and shared packages.
    - icon: 🧩
      title: Component Libraries
      details: Pre-built React and Vue component libraries with TypeScript and UnoCSS.
    - icon: 🛠️
      title: Utility Packages
      details: Comprehensive utility libraries for validation, HTTP clients, logging, and more.
    - icon: 🔧
      title: Shared Config
      details: Centralized TypeScript, ESLint, and Vite configurations for consistency.

features:
  - icon: 🚀
    title: React 19
    details: Latest React with hooks, concurrent features, and modern patterns.
    link: /apps/react-demo
    linkText: Learn More
  - icon: 💚
    title: Vue 3
    details: Composition API, script setup, and full TypeScript support.
    link: /apps/vue-demo
    linkText: Learn More
  - icon: 🧡
    title: Svelte 5
    details: Runes syntax and modern reactive patterns.
    link: /apps/svelte-demo
    linkText: Learn More
  - icon: 💎
    title: SolidJS
    details: Fine-grained reactivity and modern JSX patterns.
    link: /apps/solidjs-demo
    linkText: Learn More
  - icon: 🔌
    title: API Gateway
    details: GraphQL API with authentication, rate limiting, and subscriptions.
    link: /apps/api-gateway
    linkText: Learn More
  - icon: 🐹
    title: Go Server
    details: High-performance Go backend for microservices architecture.
    link: /apps/server-go
    linkText: Learn More
---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/toolkit-house.git
cd toolkit-house

# Install dependencies
pnpm install

# Start development
pnpm run dev
```

## Key Packages

### Core Utilities

| Package | Description |
|---------|-------------|
| **[@toolkit-house/ts-utils](/packages/ts-utils)** | Comprehensive TypeScript utility library |
| **[@toolkit-house/validation](/packages/validation)** | Type-safe validation with fluent API |
| **[@toolkit-house/http-client](/packages/http-client)** | Modern HTTP client with concurrency control |
| **[@toolkit-house/logger](/packages/logger)** | Lightweight, structured logging |
| **[@toolkit-house/security](/packages/security)** | Security utilities for key management |
| **[@toolkit-house/realtime](/packages/realtime)** | Real-time communication (WebSocket) |

### Component Libraries

| Package | Description |
|---------|-------------|
| **[@toolkit-house/react-components](/packages/react-components)** | React 19 component library |
| **[@toolkit-house/vue-components](/packages/vue-components)** | Vue 3 component library |

### Shared Configuration

| Package | Description |
|---------|-------------|
| **[@toolkit-house/shared-config](/packages/shared-config)** | Shared TypeScript, ESLint, and Vite configs |

## Demo Applications

| Application | Framework | Description |
|-------------|----------|-------------|
| **[react-demo](/apps/react-demo)** | React 19 | Modern React with Vite and TypeScript |
| **[vue-demo](/apps/vue-demo)** | Vue 3 | Vue 3 with Composition API and UnoCSS |
| **[svelte-demo](/apps/svelte-demo)** | Svelte 5 | Svelte with run syntax and Vite |
| **[solidjs-demo](/apps/solidjs-demo)** | SolidJS | Fine-grained reactivity with JSX |
| **[api-gateway](/apps/api-gateway)** | GraphQL-Yoga | GraphQL API with auth and rate limiting |
| **[server-go](/apps/server-go)** | Go 1.21+ | High-performance backend server |

## Why Toolkit House?

- **🎯 Modern Stack**: Built with the latest frameworks and tools
- **🔧 Developer Experience**: Optimized for developer productivity
- **📦 Monorepo**: Efficient code sharing and dependency management
- **🧪 Well Tested**: Comprehensive test coverage with Vitest
- **📚 Well Documented**: Extensive documentation and examples
- **🚀 Production Ready**: Battle-tested patterns and configurations

## Get Started

Choose your framework and start building:

[React](/apps/react-demo) · [Vue](/apps/vue-demo) · [Svelte](/apps/svelte-demo) · [SolidJS](/apps/solidjs-demo)
