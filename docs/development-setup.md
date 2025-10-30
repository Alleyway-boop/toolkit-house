# Development Setup Guide

This guide provides comprehensive instructions for setting up the development environment for Toolkit House.

## 🚀 Prerequisites

### System Requirements

- **Node.js**: 18.0 or higher
- **pnpm**: 8.0 or higher (package manager)
- **Git**: For version control
- **Go**: 1.21 or higher (for the Go server)
- **VS Code**: Recommended IDE (with extensions)

### Platform Support

- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu 18.04+)

## 🛠️ Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/toolkit-house.git
cd toolkit-house
```

### 2. Install Dependencies

```bash
# Install all dependencies using pnpm
pnpm install
```

### 3. Verify Installation

```bash
# Check if all packages are properly installed
pnpm run build
pnpm run test
```

## 📁 Development Environment Setup

### VS Code Extensions

Install the recommended VS Code extensions by running:

```bash
# Install VS Code extensions
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-json
code --install-extension ms-vscode.vscode-yaml
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-go
```

### Editor Configuration

Create a `.vscode/settings.json` file:

```json
{
  "typescript.preferences.preferTypeOnlyAutoImports": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.js": "javascript",
    "*.ts": "typescript",
    "*.vue": "vue"
  }
}
```

## 🏗️ Package Development Setup

### TypeScript Packages

#### ts-utils Package

```bash
cd packages/ts-utils

# Development commands
pnpm run dev     # Run with unbuild stub
pnpm run build   # Build with unbuild
pnpm run test    # Run tests
pnpm run typecheck # Type checking
pnpm run lint    # Run ESLint
```

#### license-generator Package

```bash
cd packages/license-generator-package

# Development commands
pnpm run build                    # Build TypeScript
pnpm run generate                # Generate single license
pnpm run generate:365            # Generate 365-day license
pnpm run batch                   # Batch generate licenses
pnpm run validate                # Validate a license
pnpm run config                 # Show current config
pnpm run set-key                 # Set encryption key
pnpm run gen-key                 # Generate new encryption key
```

#### shared-config Package

```bash
cd packages/shared-config

# Development commands
pnpm run dev     # Run with unbuild stub
pnpm run build   # Build with unbuild
pnpm run test    # Run tests
```

#### vue-components Package

```bash
cd packages/vue-components

# Development commands
pnpm run dev     # Run development server
pnpm run build   # Build components
pnpm run test    # Run tests
```

### Applications

#### React Demo Application

```bash
cd apps/react-demo

# Development commands
pnpm run dev      # Start Vite dev server
pnpm run build    # Build for production
pnpm run lint     # Run ESLint
pnpm run preview  # Preview production build
```

#### Go Server

```bash
cd apps/server-go

# Go commands
go run main.go    # Run the Go server
go build          # Build the Go server
go test           # Run tests
```

## 🧪 Testing Setup

### Test Configuration

All packages use Vitest for testing:

```bash
# Run all tests
pnpm run test

# Run tests with coverage
pnpm run test --coverage

# Run tests for specific package
cd packages/ts-utils && pnpm run test

# Run tests in watch mode
pnpm run test --watch
```

### Test Structure

```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
└── e2e/            # End-to-end tests
```

### Testing Guidelines

1. **Write tests before implementation** (TDD approach)
2. **Maintain high test coverage** (target: 80%+)
3. **Use meaningful test names**
4. **Test both success and error cases**

## 🔧 Build System Setup

### Build Tools

- **unbuild**: For TypeScript library builds
- **tsc**: For TypeScript compilation
- **vite**: For React app builds
- **go build**: For Go applications

### Build Commands

```bash
# Build all packages
pnpm run build

# Build specific package
cd packages/ts-utils && pnpm run build

# Clean build artifacts
pnpm run clean
```

### Build Verification

```bash
# Verify TypeScript types
pnpm run typecheck

# Run linting
pnpm run lint

# Run type checking and linting together
pnpm run check
```

## 🚀 Development Workflow

### 1. Creating a New Feature

```bash
# Create a new branch
git checkout -b feature/your-feature-name

# Make your changes
cd packages/ts-utils
# Edit source files

# Test your changes
pnpm run test

# Build and verify
pnpm run build
pnpm run lint
```

### 2. Running Development Servers

```bash
# Start React demo
cd apps/react-demo
pnpm run dev

# Start Go server
cd apps/server-go
go run main.go

# Start multiple servers (separate terminals)
```

### 3. Cross-Package Development

When working with multiple packages, you may need to rebuild dependencies:

```bash
# Rebuild workspace dependencies after changes
pnpm run build

# Run specific test across packages
cd packages/ts-utils && pnpm run test
cd packages/license-generator-package && pnpm run test
```

## 🔒 Security Setup

### Environment Variables

Create a `.env` file in the root directory:

```env
# Environment variables
NODE_ENV=development
GO_ENV=development

# License generator encryption key (for development)
LICENSE_ENCRYPTION_KEY=your-development-key-here

# Go server configuration
GO_SERVER_PORT=8080
```

### Security Configuration

```bash
# Generate secure encryption key for license generator
cd packages/license-generator-package
pnpm run gen-key

# Set encryption key in environment
export LICENSE_ENCRYPTION_KEY="generated-key-here"
```

## 📊 Performance Optimization

### Build Performance

```bash
# Use parallel builds
pnpm run build --parallel

# Incremental builds (when available)
pnpm run build --watch
```

### Development Performance

```bash
# Use hot module replacement
cd apps/react-demo
pnpm run dev --host

# Enable file watching
pnpm run dev --watch
```

## 🔍 Debugging Setup

### VS Code Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "React App",
      "type": "node-terminal",
      "request": "launch",
      "command": "pnpm",
      "args": ["dev"],
      "cwd": "${workspaceFolder}/apps/react-demo",
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
    {
      "name": "Go Server",
      "type": "go",
      "request": "launch",
      "program": "${workspaceFolder}/apps/server-go/main.go",
      "cwd": "${workspaceFolder}/apps/server-go",
      "args": []
    }
  ]
}
```

### Debug Logging

```typescript
// Enable debug logging in development
if (process.env.NODE_ENV === 'development') {
  console.debug('Debug:', data)
}
```

## 📦 Publishing Setup

### Package Registry Configuration

Create `.npmrc` or `~/.npmrc`:

```ini
registry=https://registry.npmjs.org/
@your-org:registry=https://your-registry-url/

# Authentication
//your-registry-url/:_authToken=your-token
```

### Publishing Workflow

```bash
# Update version and publish a package
cd packages/ts-utils
pnpm run release

# Build before publishing
pnpm run build

# Version management
bumpp patch/minor/major
pnpm publish
```

## 🔄 CI/CD Setup

### GitHub Actions Configuration

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm run test
      - run: pnpm run build
      - run: pnpm run lint
```

### Environment-Specific Builds

```bash
# Development build
NODE_ENV=development pnpm run build

# Production build
NODE_ENV=production pnpm run build
```

## 🐛 Troubleshooting

### Common Issues

#### Dependency Issues

```bash
# Clean install
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

#### Build Errors

```bash
# Clear build cache
pnpm run clean
rm -rf dist
pnpm run build
```

#### Test Failures

```bash
# Run tests with verbose output
pnpm run test --verbose

# Run tests with coverage
pnpm run test --coverage
```

#### TypeScript Issues

```bash
# Check TypeScript configuration
pnpm run typecheck

# Generate TypeScript declaration files
pnpm run build
```

### Performance Issues

```bash
# Monitor build performance
time pnpm run build

# Check memory usage
node --max-old-space-size=8192 node_modules/.bin/pnpm run build
```

## 📚 Additional Resources

### Documentation

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [Vite Documentation](https://vitejs.dev/)
- [Go Documentation](https://golang.org/doc/)
- [pnpm Documentation](https://pnpm.io/)

### Tools

- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Vitest](https://vitest.dev/)
- [Unbuild](https://unbuild.js.org/)

## 🤝 Community

- GitHub Issues: Report bugs and request features
- Discussions: Ask questions and share ideas
- Contributing: Follow our contribution guidelines

## 📄 License

This setup guide is part of the Toolkit House project and is licensed under the MIT License.

---

For the most up-to-date information, always refer to the latest documentation and code.