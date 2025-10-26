# Shared Configuration Package Documentation

A centralized configuration management system for TypeScript, ESLint, and Vite configurations across the monorepo.

## 📦 Installation

```bash
npm install shared-config
# or
pnpm add shared-config
# or
yarn add shared-config
```

## ⚙️ Package Overview

The `shared-config` package provides:
- Shared TypeScript configurations
- Consistent ESLint rules
- Standardized Vite configurations
- Configuration utilities for building custom configs
- Type-safe configuration management

## 🚀 Quick Start

### Using TypeScript Configuration

```typescript
import { tsconfigBase, createTSConfig } from 'shared-config'

// Use base configuration
const tsconfig = {
  extends: tsconfigBase,
  compilerOptions: {
    target: 'ES2020',
    module: 'ESNext'
  }
}

// Or create custom config
const customConfig = createTSConfig(tsconfigBase, {
  compilerOptions: {
    target: 'ES2020',
    module: 'ESNext'
  }
})
```

### Using ESLint Configuration

```typescript
import { eslintBase, eslintTypeScript, eslintReact, createESLintConfig } from 'shared-config'

// Use base TypeScript config
const tsConfig = createESLintConfig(eslintBase, eslintTypeScript)

// Use React-specific config
const reactConfig = createESLintConfig(eslintBase, eslintTypeScript, eslintReact)
```

### Using Vite Configuration

```typescript
import { viteBase, viteLibrary, viteReact, createViteConfig } from 'shared-config'

// Use library configuration
const libraryConfig = createViteConfig(viteBase, libraryConfigPlugins)

// Use React configuration
const reactConfig = createViteConfig(viteBase, reactConfigPlugins)
```

## 📚 API Reference

### TypeScript Configurations

#### Base TypeScript Configuration

```typescript
export const tsconfigBase: object
```

Base TypeScript configuration with common settings:
- Strict mode enabled
- CommonJS module resolution
- Source maps enabled
- Declaration files generation

#### React TypeScript Configuration

```typescript
export const tsconfigReact: object
```

React-specific TypeScript configuration:
- JSX support
- React DOM types
- Module resolution for React projects

#### Library TypeScript Configuration

```typescript
export const tsconfigLibrary: object
```

Library-specific TypeScript configuration:
- ES modules output
- Declaration files
- No emit for types
- Compat mode for wider browser support

#### createTSConfig Function

```typescript
function createTSConfig(base: object, overrides?: object): object
```

Creates a custom TypeScript configuration by merging base config with overrides.

**Parameters:**
- `base` (object): Base configuration object
- `overrides` (object, optional): Configuration overrides

**Returns:**
- `object`: Merged TypeScript configuration

**Example:**
```typescript
import { tsconfigBase, createTSConfig } from 'shared-config'

const customTsConfig = createTSConfig(tsconfigBase, {
  compilerOptions: {
    target: 'ES2020',
    module: 'ESNext',
    outDir: 'dist',
    lib: ['ES2020', 'DOM', 'DOM.Iterable']
  },
  include: ['src/**/*'],
  exclude: ['node_modules', 'dist']
})
```

### ESLint Configurations

#### Base ESLint Configuration

```typescript
export const eslintBase: Array<object>
```

Base ESLint configuration with common rules:
- Code quality rules
- Import rules
- Best practices

#### TypeScript ESLint Configuration

```typescript
export const eslintTypeScript: Array<object>
```

TypeScript-specific ESLint rules:
- Type checking
- Generic rules
- Variable declarations

#### React ESLint Configuration

```typescript
export const eslintReact: Array<object>
```

React-specific ESLint rules:
- JSX rules
- Component rules
- Hook rules

#### createESLintConfig Function

```typescript
function createESLintConfig(base: Array<object>, ...extensions: Array<object>): Array<object>
```

Creates a custom ESLint configuration by combining base and extension configs.

**Parameters:**
- `base` (Array<object>): Base configuration array
- `extensions` (Array<object>, optional): Additional configuration arrays

**Returns:**
- `Array<object>`: Combined ESLint configuration

**Example:**
```typescript
import { eslintBase, eslintTypeScript, eslintReact, createESLintConfig } from 'shared-config'

const customESLintConfig = createESLintConfig(
  eslintBase,
  eslintTypeScript,
  eslintReact,
  {
    rules: {
      'react/prop-types': 'error',
      'no-console': 'warn'
    }
  }
)
```

### Vite Configurations

#### Base Vite Configuration

```typescript
export const viteBase: object
```

Base Vite configuration with common settings:
- Build optimization
- Server configuration
- Plugins setup

#### Library Vite Configuration

```typescript
export const viteLibrary: object
```

Library-specific Vite configuration:
- Library build mode
- External dependencies
- Entry points

#### React Vite Configuration

```typescript
export const viteReact: object
```

React-specific Vite configuration:
- React plugins
- Development server
- Build optimization

#### createViteConfig Function

```typescript
function createViteConfig(base: object, ...plugins: Array<object>): object
```

Creates a custom Vite configuration by merging base config and adding plugins.

**Parameters:**
- `base` (object): Base configuration object
- `plugins` (Array<object>, optional): Plugin configurations to add

**Returns:**
- `object`: Custom Vite configuration

**Example:**
```typescript
import { viteBase, createViteConfig } from 'shared-config'
import vue from '@vitejs/plugin-vue'

const customViteConfig = createViteConfig(viteBase, {
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'MyLibrary'
    }
  }
})
```

## 🛠️ Configuration Examples

### Library Package Configuration

For a TypeScript library package:

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "scripts": {
    "build": "unbuild",
    "dev": "unbuild --stub",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@types/node": "24.0.8",
    "typescript": "5.8.3",
    "unbuild": "3.5.0"
  }
}
```

`tsconfig.json`:
```json
{
  "extends": "shared-config/tsconfig.library.json",
  "compilerOptions": {
    "outDir": "dist",
    "lib": ["ES2020", "DOM"],
    "types": ["node"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

`eslint.config.js`:
```javascript
import { eslintBase, eslintTypeScript } from 'shared-config'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  ...eslintBase,
  ...eslintTypeScript,
  {
    rules: {
      'no-console': 'warn',
      'prefer-const': 'error'
    }
  }
)
```

`build.config.ts`:
```typescript
import { defineConfig } from 'unbuild'
import { tsconfigLibrary } from 'shared-config'

export default defineConfig({
  entries: ['src/index.ts'],
  outDir: 'dist',
  declaration: true,
  rollup: {
    external: ['react', 'vue']
  },
  tsconfig: tsconfigLibrary
})
```

### React Application Configuration

For a React application:

```json
{
  "name": "react-app",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint ."
  },
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "@vitejs/plugin-react": "^4.5.2"
  }
}
```

`tsconfig.json`:
```json
{
  "extends": "shared-config/tsconfig.react.json",
  "compilerOptions": {
    "outDir": "dist",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "types": ["node", "vite/client"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

`eslint.config.js`:
```javascript
import { eslintBase, eslintTypeScript, eslintReact } from 'shared-config'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  ...eslintBase,
  ...eslintTypeScript,
  ...eslintReact,
  {
    rules: {
      'react/prop-types': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    }
  }
)
```

`vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import { viteBase, viteReact } from 'shared-config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  ...viteBase,
  ...viteReact,
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

### Vue Component Library Configuration

For a Vue component library:

```json
{
  "name": "vue-components",
  "scripts": {
    "build": "unbuild",
    "dev": "unbuild --stub",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "5.8.3",
    "unbuild": "3.5.0",
    "vue": "^3.0.0"
  }
}
```

`tsconfig.json`:
```json
{
  "extends": "shared-config/tsconfig.library.json",
  "compilerOptions": {
    "outDir": "dist",
    "lib": ["ES2020", "DOM"],
    "types": ["node"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

`eslint.config.js`:
```javascript
import { eslintBase, eslintTypeScript } from 'shared-config'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  ...eslintBase,
  ...eslintTypeScript,
  {
    globals: {
      defineComponent: 'readonly',
      ref: 'readonly',
      computed: 'readonly'
    }
  }
)
```

## 🔄 Configuration Inheritance

### TypeScript Inheritance

```json
{
  "extends": "shared-config/tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true
  }
}
```

### ESLint Inheritance

```javascript
import eslintBase from 'shared-config/eslint.base.js'

export default [
  eslintBase,
  {
    rules: {
      'no-console': 'error'
    }
  }
]
```

### Vite Inheritance

```typescript
import { viteBase } from 'shared-config'

export default {
  ...viteBase,
  plugins: [myPlugin()],
  build: {
    outDir: 'build'
  }
}
```

## 🎯 Best Practices

### Configuration Management

1. **Version Control**: Keep configurations in version control
2. **Documentation**: Document configuration changes
3. **Testing**: Test configuration changes in CI/CD
4. **Consistency**: Maintain consistent configurations across projects

### Performance Optimization

1. **Cache Configuration**: Use configuration caching in build tools
2. **Minimal Overrides**: Keep configuration overrides minimal
3. **Parallel Processing**: Use parallel build tools when possible

### Maintenance

1. **Regular Updates**: Keep dependencies updated
2. **Breaking Changes**: Monitor breaking changes in dependencies
3. **Community Updates**: Follow community best practices

## 🔧 Troubleshooting

### Common Issues

#### TypeScript Configuration Issues

**Problem**: "Cannot find module 'shared-config'"

**Solution**: Ensure the package is installed:
```bash
pnpm install shared-config
```

**Problem**: Configuration not extending properly

**Solution**: Check file paths and ensure JSON format is correct:
```json
{
  "extends": "./node_modules/shared-config/tsconfig.base.json"
}
```

#### ESLint Configuration Issues

**Problem**: ESLint cannot resolve shared-config

**Solution**: Use dynamic import in modern ESLint config:
```javascript
const { eslintBase } = await import('shared-config')

export default [
  eslintBase,
  // your config
]
```

#### Vite Configuration Issues

**Problem**: Vite cannot resolve shared-config imports

**Solution**: Use absolute paths or ensure package resolution is correct:
```typescript
import { viteBase } from 'shared-config'
```

### Debug Configuration

Enable verbose logging for debugging:

```bash
# TypeScript
tsc --showConfig

# ESLint
eslint --print-config .eslintrc.js

# Vite
vite --debug
```

## 🚀 Migration Guide

### From Custom Configurations to Shared Config

**Before:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "outDir": "dist"
  }
}
```

**After:**
```json
{
  "extends": "shared-config/tsconfig.library.json",
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

### From Legacy Configurations

**Legacy TypeScript:**
```json
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "CommonJS",
    "strict": true,
    "declaration": true,
    "outDir": "dist"
  }
}
```

**Migrated:**
```json
{
  "extends": "shared-config/tsconfig.library.json",
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext"
  }
}
```

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details.

## 🔗 Related Resources

- [TypeScript Configuration Guide](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- [ESLint Configuration Guide](https://eslint.org/docs/latest/use/configure/)
- [Vite Configuration Guide](https://vitejs.dev/config/)
- [Monorepo Configuration Patterns](https://monorepo.tools/)