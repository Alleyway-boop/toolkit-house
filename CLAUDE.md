# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a monorepo using both pnpm workspaces (for JavaScript/TypeScript) and Go workspaces, containing:

- **packages/**: Shared libraries and utilities
  - `ts-utils/`: TypeScript utility library with network and string utilities
  - `license-generator-package/`: License generation and validation tool
  - `vue-components/`: Vue component library (submodule)
- **apps/**: Applications and services  
  - `react-demo/`: React demo application using Vite
  - `server-go/`: Go backend server (submodule)

## Development Commands

### Root Level
```bash
# Build all packages/apps
pnpm run build

# Install dependencies
pnpm install
```

### Package Level

#### ts-utils (`packages/ts-utils/`)
```bash
# Development
pnpm run dev          # Run with unbuild stub
pnpm run build        # Build with unbuild
pnpm run test         # Run tests with vitest
pnpm run typecheck    # Type check with TypeScript
pnpm run lint         # Run ESLint
```

#### license-generator-package (`packages/license-generator-package/`)
```bash
# Build and CLI usage
pnpm run build                    # Build TypeScript
pnpm run generate                 # Generate single license
pnpm run generate:365             # Generate 365-day license
pnpm run batch                    # Batch generate licenses
pnpm run validate                 # Validate a license
pnpm run config                   # Show current config
pnpm run set-day                  # Set default expiry days
pnpm run set-key                  # Set encryption key
pnpm run gen-key                  # Generate new encryption key
```

#### react-demo (`apps/react-demo/`)
```bash
# Development
pnpm run dev        # Start Vite dev server
pnpm run build      # Build for production
pnpm run lint       # Run ESLint
pnpm run preview    # Preview production build
```

### Go Development

#### server-go (`apps/server-go/`)
```bash
# Go workspace commands
go run main.go      # Run the Go server
go build            # Build the Go server
```

## Architecture Overview

### Monorepo Structure
- Uses **pnpm workspaces** for JavaScript/TypeScript packages
- Uses **Go workspaces** (`go.work`) for Go packages
- All packages are interconnected through workspace dependencies

### Key Components

#### ts-utils Package
- **Network utilities**: RequestPool class for controlling concurrent requests
- **String utilities**: String similarity functions
- **Build system**: Uses `unbuild` for modern TypeScript library builds
- **Testing**: Vitest with package exports testing

#### license-generator-package
- **License cryptography**: AES-256-CBC encryption for license validation
- **CLI interface**: Full command-line tool with batch processing
- **Export formats**: Supports TXT, JSON, and CSV output
- **Configuration**: Persistent configuration via JSON file

#### react-demo
- **Framework**: React 19 with Vite
- **TypeScript**: Full TypeScript support
- **Dependencies**: Uses `ts-utils` from workspace
- **Build**: Modern Vite build system

#### server-go
- **Framework**: Standard Go HTTP server
- **Module**: Uses `github.com/seci/server-go` module path
- **Integration**: Part of Go workspace for local development

### Build Systems
- **TypeScript**: Uses `unbuild` for library builds, `tsc` for apps
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
3. **Run tests**: `pnpm run test` in specific packages
4. **Type checking**: `pnpm run typecheck` for TypeScript packages
5. **Linting**: `pnpm run lint` for code quality

## Important Notes

- All packages follow modern TypeScript patterns with proper exports
- License generator uses encryption keys - handle with care in production
- Go server is configured as a workspace module for local development
- React demo serves as a reference for consuming workspace packages