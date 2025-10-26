# Toolkit House

A comprehensive monorepo containing shared utilities, license generation tools, and demo applications built with TypeScript, React, and Go.

## 📁 Project Structure

```
toolkit-house/
├── packages/                    # Shared packages and utilities
│   ├── ts-utils/              # TypeScript utility library
│   ├── license-generator-package/ # License generation and validation
│   ├── vue-components/         # Vue component library
│   └── shared-config/         # Shared configuration
├── apps/                      # Applications and services
│   ├── react-demo/           # React demo application
│   └── server-go/           # Go backend server
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

# Start development server for demo app
cd apps/react-demo
pnpm run dev
```

## 📋 Packages Overview

### 🔧 ts-utils
TypeScript utility library with network utilities and string similarity functions.

**Features:**
- `RequestPool`: Concurrent request control
- `stringSimilarity`: String similarity calculation
- Cache utilities (LRU, FIFO)

**Usage:**
```typescript
import { RequestPool } from 'ts-utils'

const pool = new RequestPool(3)
const result = await pool.add(() => fetch('/api/endpoint'))
```

### 🛡️ license-generator-package
License generation and validation tool using AES-256-CBC encryption.

**Features:**
- Generate single or batch licenses
- License validation
- Multiple output formats (TXT, JSON, CSV)
- CLI interface

**Usage:**
```bash
# Generate a license
pnpm run generate

# Batch generate licenses
pnpm run batch 10

# Validate a license
pnpm run validate <license-key>
```

### 🎨 vue-components
Vue component library built with UnoCSS.

**Components:**
- Button
- Input

### ⚙️ shared-config
Shared TypeScript, ESLint, and Vite configurations.

### 🌐 react-demo
React 19 demo application using Vite and TypeScript.

## 📚 Documentation

### API Documentation
- [ts-utils API](docs/ts-utils.md)
- [License Generator API](docs/license-generator.md)
- [Vue Components API](docs/vue-components.md)

### Development Guides
- [Contributing Guide](CONTRIBUTING.md)
- [Architecture Documentation](ARCHITECTURE.md)
- [Development Setup](docs/development-setup.md)

## 🔧 Build Systems

### TypeScript Packages
- Build with `unbuild` (modern library builds)
- TypeScript type checking
- Vitest for testing
- ESLint for code quality

### Go Applications
- Standard Go build system
- Go workspace support

## 🧪 Testing

### TypeScript Testing
- Vitest for unit and integration tests
- Coverage reporting
- Package exports testing

### Go Testing
- Standard Go testing framework

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on contributing to this project.

## 🔗 Related Projects

- [Vue Components](packages/vue-components/)
- [Go Server](apps/server-go/)