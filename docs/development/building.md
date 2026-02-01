# Building

Build Toolkit House packages and applications for production.

## Build Commands

### Build All

```bash
pnpm run build
```

Builds all packages in dependency order.

### Build Specific Package

```bash
cd packages/ts-utils
pnpm run build
```

### Build Application

```bash
cd apps/react-demo
pnpm run build
```

## Build Tools

### TypeScript Libraries

Most packages use **unbuild**:

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

Output:
```
dist/
├── index.js      # ESM output
├── index.d.ts    # TypeScript declarations
```

### Applications

Applications use **Vite**:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'ES2022',
    outDir: './dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: 'terser',
  },
})
```

Output:
```
dist/
├── index.html
└── assets/
    ├── index-[hash].js
    └── index-[hash].css
```

### Go Applications

```bash
go build -o bin/server
```

## Build Optimization

### Bundle Size Analysis

```bash
# For Vite apps
pnpm run build -- --report
```

### Tree Shaking

Ensure proper exports in package.json:

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  }
}
```

### Code Splitting

Vite automatically splits code:

```typescript
// Lazy load routes
const Component = lazy(() => import('./Component'))
```

## Production Checklist

Before deploying:

- [ ] All tests pass
- [ ] Type checking passes
- [ ] Build succeeds without warnings
- [ ] Bundle size is acceptable
- [ ] Environment variables are set
- [ ] API endpoints are correct

## CI/CD

Example GitHub Actions workflow:

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

## Next Steps

- Read [Contributing Guidelines](/development/contributing)
- Learn about [Development Setup](/development/setup)
