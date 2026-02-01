# Development Setup

Set up your development environment for contributing to Toolkit House.

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher
- **Git**: Latest stable version
- **Go**: 1.21+ (for server-go)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/toolkit-house.git
cd toolkit-house
```

### 2. Install pnpm

```bash
npm install -g pnpm
# or
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### 3. Install Dependencies

```bash
pnpm install
```

This installs dependencies for all packages and applications.

### 4. Verify Installation

```bash
# Type check all packages
pnpm run typecheck

# Run tests
pnpm run test

# Build all packages
pnpm run build
```

## Development Workflow

### Running Applications

#### React Demo

```bash
cd apps/react-demo
pnpm run dev
# http://localhost:5173
```

#### Vue Demo

```bash
cd apps/vue-demo
pnpm run dev
# http://localhost:5174
```

#### API Gateway

```bash
cd apps/api-gateway
pnpm run dev
# http://localhost:4000/graphql
```

#### Go Server

```bash
cd apps/server-go
go run main.go
# http://localhost:8080
```

### Building Packages

Build all packages:

```bash
pnpm run build
```

Build specific package:

```bash
cd packages/ts-utils
pnpm run build
```

### Running Tests

Run all tests:

```bash
pnpm run test
```

Run specific package tests:

```bash
cd packages/validation
pnpm run test
```

Run with coverage:

```bash
pnpm run test:coverage
```

### Type Checking

Type check all packages:

```bash
pnpm run typecheck
```

Type check specific app:

```bash
cd apps/react-demo
pnpm run typecheck
```

## IDE Setup

### VS Code

Install recommended extensions:

```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension golang.go
```

### Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "eslint.workingDirectories": [
    { "directory": "packages", "changeProcessCWD": true },
    { "directory": "apps", "changeProcessCWD": true }
  ],
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## Git Workflow

### Branches

- `main` - Production branch
- `feature/*` - Feature branches
- `fix/*` - Bug fix branches

### Commit Messages

Follow conventional commits:

```
feat: add new feature
fix: fix bug
docs: update documentation
refactor: refactor code
test: add tests
chore: update dependencies
```

### Pull Requests

1. Create a feature branch
2. Make your changes
3. Run tests and type checking
4. Create a pull request to `main`

## Troubleshooting

### pnpm Issues

```bash
# Clear cache
pnpm store prune

# Reinstall
rm -rf node_modules
pnpm install
```

### Type Errors

```bash
# Clean build
rm -rf dist
pnpm run build

# Type check
pnpm run typecheck
```

### Go Modules

```bash
# Update dependencies
cd apps/server-go
go get -u ./...
go mod tidy
```

## Next Steps

- Read [Testing Guide](/development/testing)
- Learn about [Building](/development/building)
- Check [Contributing Guidelines](/development/contributing)
