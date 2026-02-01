# Monorepo Structure

Toolkit House is organized as a monorepo using **pnpm workspaces** for JavaScript/TypeScript packages and **Go workspaces** for Go packages.

## Directory Structure

```
toolkit-house/
├── apps/                    # Applications
│   ├── react-demo/         # React 19 demo
│   ├── vue-demo/           # Vue 3 demo
│   ├── svelte-demo/        # Svelte demo
│   ├── solidjs-demo/       # SolidJS demo
│   ├── api-gateway/        # GraphQL API Gateway
│   └── server-go/          # Go backend server
│
├── packages/               # Shared packages
│   ├── ts-utils/           # TypeScript utilities
│   ├── validation/         # Validation library
│   ├── http-client/        # HTTP client
│   ├── logger/             # Logging library
│   ├── security/           # Security utilities
│   ├── realtime/           # Real-time communication
│   ├── types/              # Shared types
│   ├── constants/          # Shared constants
│   ├── vue-components/     # Vue 3 components
│   ├── react-components/   # React components
│   └── shared-config/      # Shared configurations
│
├── docs/                   # VitePress documentation
├── pnpm-workspace.yaml     # pnpm workspace config
├── go.work                 # Go workspace config
└── package.json            # Root package.json
```

## Workspace Configuration

### pnpm Workspace

`pnpm-workspace.yaml`:
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'docs'
```

This configuration defines which directories contain workspace packages.

### Go Workspace

`go.work`:
```go
go 1.21

use (
    ./apps/server-go
)
```

## Package Dependencies

### Workspace Dependencies

Packages can reference each other using the `workspace:*` protocol:

```json
{
  "dependencies": {
    "@toolkit-house/ts-utils": "workspace:*",
    "@toolkit-house/types": "workspace:*"
  }
}
```

This ensures packages always use their local workspace versions during development.

### Dependency Graph

```
@toolkit-house/validation
├── @toolkit-house/ts-utils
├── @toolkit-house/types
└── @toolkit-house/constants

@toolkit-house/http-client
├── @toolkit-house/ts-utils
└── @toolkit-house/logger (optional)

@toolkit-house/realtime
└── ws (external)

apps/react-demo
└── @toolkit-house/ts-utils

apps/vue-demo
├── @toolkit-house/ts-utils
└── @toolkit-house/vue-components
```

## Build Order

The monorepo automatically determines build order based on dependencies:

1. **Foundation packages** (types, constants)
2. **Utility packages** (ts-utils, logger)
3. **Feature packages** (validation, http-client, security)
4. **UI packages** (react-components, vue-components)
5. **Applications** (react-demo, vue-demo, api-gateway)

## Commands

### Root Level Commands

Run commands across all packages:

```bash
# Install all dependencies
pnpm install

# Build all packages
pnpm run build

# Run all tests
pnpm run test

# Type check all packages
pnpm run typecheck

# Lint all packages
pnpm run lint
```

### Package-Specific Commands

Run commands in specific packages:

```bash
# Using pnpm --filter
pnpm --filter @toolkit-house/ts-utils run test

# Or navigate to the package
cd packages/ts-utils
pnpm run test
```

## Best Practices

### 1. Use Workspace Dependencies

Always use `workspace:*` for internal dependencies:

```json
{
  "dependencies": {
    "@toolkit-house/ts-utils": "workspace:*"  // ✅ Correct
  }
}
```

### 2. Keep Packages Independent

Avoid circular dependencies between packages. If two packages need each other, consider:
- Creating a third shared package
- Moving shared code to a lower-level package

### 3. Follow Naming Conventions

- Packages: `@toolkit-house/<name>`
- Apps: No scope (e.g., `react-demo`, `api-gateway`)
- Private packages: Add `"private": true` to package.json

### 4. Use Shared Configurations

Leverage the `shared-config` package for consistent:
- TypeScript configurations
- ESLint configurations
- Vite configurations
- Build settings

## Version Management

### Independent Versioning

Each package has its own version in `package.json`:

```json
{
  "name": "@toolkit-house/ts-utils",
  "version": "1.2.3"
}
```

### Publishing

When publishing packages, update versions:

```bash
# Bump version in specific package
pnpm --filter @toolkit-house/ts-utils version patch

# Publish to registry
pnpm --filter @toolkit-house/ts-utils publish
```

## Next Steps

- Learn about the [Package System](/guide/packages)
- Understand the [Build System](/guide/build)
- Set up [Development](/development/setup)
