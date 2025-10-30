# @toolkit-house/shared-config

Shared configuration for TypeScript, ESLint, and Vite across the toolkit-house monorepo.

## Installation

```bash
pnpm add @toolkit-house/shared-config -D
```

## Usage

### TypeScript Configuration

#### Option 1: Extend from preset configurations

For a TypeScript library:
```json
// tsconfig.json
{
  "extends": "@toolkit-house/shared-config/configs/tsconfig.library.json",
  "compilerOptions": {
    "baseUrl": ".",
    "rootDir": "./src",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"]
}
```

For a React application:
```json
// tsconfig.json
{
  "extends": "@toolkit-house/shared-config/configs/tsconfig.react.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*", "vite.config.ts"]
}
```

For unified configuration (all-in-one):
```json
// tsconfig.json
{
  "extends": "@toolkit-house/shared-config/configs/tsconfig.unified.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"]
}
```

#### Option 2: Programmatic usage

```typescript
import { createTSConfig, tsconfigBase } from '@toolkit-house/shared-config'

const customConfig = createTSConfig(tsconfigBase, {
  compilerOptions: {
    outDir: './dist',
    rootDir: './src'
  },
  include: ['src/**/*']
})
```

### ESLint Configuration

#### Option 1: Use flat config (ESLint 9+)

Create an `eslint.config.js` file:

```javascript
// eslint.config.js
import eslintConfig from '@toolkit-house/shared-config/configs/eslint.unified.js'

export default eslintConfig
```

Or for specific configurations:

```javascript
// eslint.config.js
import { eslintBase, eslintTypeScript } from '@toolkit-house/shared-config/configs/eslint.base.js'
import { eslintTypeScript } from '@toolkit-house/shared-config/configs/eslint.typescript.js'

export default [
  ...eslintBase,
  ...eslintTypeScript
]
```

For React projects:
```javascript
// eslint.config.js
import eslintReact from '@toolkit-house/shared-config/configs/eslint.react.js'

export default eslintReact
```

#### Option 2: Programmatic usage

```javascript
import { createESLintConfig, eslintBase } from '@toolkit-house/shared-config'

const customConfig = createESLintConfig(eslintBase, {
  rules: {
    'no-console': 'off'
  }
})
```

### Vite Configuration

```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import viteBase from '@toolkit-house/shared-config/configs/vite.base.js'

export default defineConfig(viteBase)
```

For libraries:
```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import viteLibrary from '@toolkit-house/shared-config/configs/vite.library.js'

export default defineConfig(viteLibrary)
```

For React applications:
```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import viteReact from '@toolkit-house/shared-config/configs/vite.react.js'

export default defineConfig(viteReact)
```

### Presets

Use predefined configurations for common use cases:

```typescript
import { presets } from '@toolkit-house/shared-config'

// Library preset
const libraryConfig = presets.library

// React preset
const reactConfig = presets.react

// Unified preset (all-in-one)
const unifiedConfig = presets.unified
```

### Available Configurations

#### TypeScript
- `tsconfig.base.json` - Base TypeScript configuration
- `tsconfig.library.json` - Configuration for TypeScript libraries
- `tsconfig.react.json` - Configuration for React applications
- `tsconfig.unified.json` - All-in-one unified configuration

#### ESLint
- `eslint.base.js` - Base JavaScript/TypeScript rules
- `eslint.typescript.js` - TypeScript-specific rules
- `eslint.react.js` - React-specific rules
- `eslint.unified.js` - All-in-one unified configuration

#### Vite
- `vite.base.js` - Base Vite configuration
- `vite.library.js` - Library build configuration
- `vite.react.js` - React application configuration

## Features

- **Modern TypeScript**: ES2022 target with strict type checking
- **Comprehensive ESLint**: Covers JavaScript, TypeScript, and React
- **Optimized Vite**: Pre-configured for different project types
- **Monorepo Ready**: Designed for workspace dependencies
- **Flexible**: Can be used as-is or customized
- **Type-Safe**: Full TypeScript support with type definitions

## Configuration Details

### TypeScript Features
- Strict mode enabled
- ES2022 target with modern module resolution
- Path mapping support
- Declaration and source map generation
- Optimized for library development

### ESLint Features
- Modern flat config format (ESLint 9+)
- TypeScript support with type-aware rules
- React hooks and refresh support
- Consistent code style and formatting
- Import sorting and organization

### Vite Features
- Optimized builds for different targets
- TypeScript support out of the box
- Hot module replacement for development
- Library mode with proper exports
- React development support

## Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm run build

# Run type checking
pnpm run typecheck

# Run linting
pnpm run lint
```

## License

MIT