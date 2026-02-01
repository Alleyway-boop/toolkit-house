# Build System

Toolkit House uses modern build tools optimized for development experience and production performance.

## Build Tools

### TypeScript Libraries

Most packages use **unbuild** for building TypeScript libraries.

**Why unbuild?**
- ⚡️ Fast build times with esbuild
- 📦 Zero-config setup
- 🔧 TypeScript-first
- 📄 Automatic type declaration generation
- 🎯 Modern ESM output

**Configuration:**
```typescript
// build.config.ts
import { defineConfig } from 'unbuild'

export default defineConfig({
  entries: ['src/index'],
  outDir: 'dist',
  format: 'esm',
  dts: true,
  clean: true,
  declaration: true,
})
```

### Applications

Demo applications use **Vite** for development and production builds.

**Why Vite?**
- ⚡️ Lightning-fast HMR
- 📦 Optimized production builds with Rollup
- 🔧 TypeScript support out of the box
- 🎯 Modern ESM-native development

### Go Applications

The server-go application uses standard Go tooling.

```bash
go run main.go    # Run
go build          # Build
go test ./...     # Test
```

## Build Commands

### Root Level

Build all packages and applications:

```bash
pnpm run build
```

This runs builds in dependency order using pnpm's workspace support.

### Package Level

Build a specific package:

```bash
# Using pnpm --filter
pnpm --filter @toolkit-house/ts-utils run build

# Or navigate to the package
cd packages/ts-utils
pnpm run build
```

### Application Level

```bash
cd apps/react-demo
pnpm run build    # Creates ./dist
```

## Build Outputs

### Library Output

```
packages/ts-utils/dist/
├── index.js          # ESM output
├── index.d.ts        # TypeScript declarations
└── net.js            # Sub-export (if defined)
```

### Application Output

```
apps/react-demo/dist/
├── index.html
└── assets/
    ├── index-[hash].js
    └── index-[hash].css
```

## Development Mode

### Watch Mode

For packages with unbuild:

```bash
pnpm run dev
```

This runs unbuild in stub mode for fast development.

### Vite Dev Server

For applications:

```bash
pnpm run dev
```

Starts Vite's dev server with HMR at `http://localhost:5173`.

## TypeScript Configuration

### Shared Config

The `shared-config` package provides base TypeScript configurations:

```json
// packages/shared-config/tsconfig.app.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    // ...
  }
}
```

### Package-Specific Config

Extend the shared config:

```json
// packages/ts-utils/tsconfig.json
{
  "extends": "@toolkit-house/shared-config/tsconfig.app.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

## Performance Optimization

### Bundle Size

Monitor bundle sizes with:

```bash
# Vite shows bundle sizes during build
pnpm run build

# Use rollup-plugin-visualizer for detailed analysis
pnpm run build -- --report
```

### Build Caching

unbuild and Vite both cache builds:

```
node_modules/.vite/
node_modules/.cache/
```

Clear cache if needed:

```bash
rm -rf node_modules/.vite node_modules/.cache
pnpm run build
```

### Parallel Builds

pnpm automatically runs independent package builds in parallel:

```bash
# Builds packages in parallel where possible
pnpm -r run build
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm run typecheck
      - run: pnpm run build
      - run: pnpm run test
```

## Troubleshooting

### Build Failures

1. **Clear cache and reinstall:**
```bash
rm -rf node_modules dist
pnpm install
pnpm run build
```

2. **Check TypeScript errors:**
```bash
pnpm run typecheck
```

3. **Verify dependencies:**
```bash
pnpm list --depth=0
```

### Type Declaration Errors

If type declarations are missing:

```bash
# Rebuild with clean
rm -rf dist
pnpm run build

# Verify declarations exist
ls dist/*.d.ts
```

## Best Practices

1. **Always typecheck before building**
2. **Use shared configs when possible**
3. **Keep builds fast with proper caching**
4. **Monitor bundle sizes**
5. **Test production builds locally**

## Next Steps

- Set up your [Development Environment](/development/setup)
- Learn about [Testing](/development/testing)
- Read [Contributing Guidelines](/development/contributing)
