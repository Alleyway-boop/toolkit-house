---
title: "@toolkit-house/shared-config"
description: Shared configuration for TypeScript, ESLint, and Vite across the toolkit-house monorepo
chineseTitle: "@toolkit-house/shared-config"
chineseDescription: toolkit-house monorepo 中 TypeScript、ESLint 和 Vite 的共享配置
---

# @toolkit-house/shared-config

Shared configuration for TypeScript, ESLint, and Vite across the toolkit-house monorepo.

## Introduction

`@toolkit-house/shared-config` provides centralized, shared configurations for TypeScript, ESLint, and Vite across the entire monorepo. This ensures consistency in code style, type checking, and build configurations across all packages and applications, reducing setup time and maintaining coding standards.

### What It Does
- Shares TypeScript configuration across packages
- Provides unified ESLint rules and settings
- Offers shared Vite configurations for applications
- Ensures consistent code formatting with Prettier
- Includes React and Vue specific configurations
- Provides monorepo-aware settings

### When to Use It
- Setting up new packages in the monorepo
- Ensuring consistent configuration across projects
- Reducing configuration duplication
- Maintaining coding standards
- Setting up CI/CD pipeline
- Onboarding new developers

## Installation

```bash
pnpm add @toolkit-house/shared-config -D
```

## Quick Start

```typescript
// In your package.json
{
  "scripts": {
    "build": "vite build",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "@toolkit-house/shared-config": "workspace:*",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "vite": "^5.0.0"
  }
}

// In your tsconfig.json
{
  "extends": "@toolkit-house/shared-config/configs/tsconfig.base.json"
}

// In your .eslintrc.js
module.exports = {
  extends: [
    '@toolkit-house/shared-config/configs/eslint.base.js'
  ]
}

// In your vite.config.ts
import { defineConfig } from 'vite'
import shared from '@toolkit-house/shared-config/configs/vite.base.ts'

export default defineConfig({
  ...shared,
  // Your custom config here
})
```

## Key Features

### 1. TypeScript Configuration

```typescript
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
}
```

```typescript
// tsconfig.react.json
{
  "extends": "./configs/tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM", "DOM.Iterable", "React"]
  },
  "include": ["src", "vite-env.d.ts"]
}
```

```typescript
// tsconfig.vue.json
{
  "extends": "./configs/tsconfig.base.json",
  "compilerOptions": {
    "jsx": "preserve",
    "lib": ["ES2022", "DOM", "DOM.Iterable", "Vue"],
    "types": ["vite/client", "vue/jsx"]
  },
  "include": ["src", "vite-env.d.ts", "*.vue"]
}
```

### 2. ESLint Configuration

```javascript
// eslint.base.js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    '@toolkit-house/shared-config/configs/eslint.base.js'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-interface': 'off'
  },
  ignorePatterns: ['dist', 'node_modules', '*.d.ts']
}
```

```javascript
// eslint.react.js
module.exports = {
  extends: [
    './configs/eslint.base.js',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-refresh/recommended'
  ],
  plugins: ['react', 'react-hooks', 'react-refresh'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off'
  }
}
```

```javascript
// eslint.vue.js
module.exports = {
  extends: [
    './configs/eslint.base.js',
    'plugin:vue/vue3-recommended',
    'plugin:vuejs-accessibility/recommended'
  ],
  plugins: ['vue'],
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  rules: {
    'vue/no-unused-components': 'warn',
    'vue/no-unused-vars': 'warn',
    'vue/require-default-prop': 'off',
    'vue/require-explicit-emits': 'warn'
  }
}
```

### 3. Vite Configuration

```typescript
// vite.base.ts
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@toolkit-house': path.resolve(__dirname, '../../packages')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'PackageName',
      fileName: 'index'
    },
    rollupOptions: {
      external: ['react', 'vue', 'lodash'],
      output: {
        globals: {
          react: 'React',
          vue: 'Vue',
          lodash: '_'
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
```

```typescript
// vite.react.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  ...shared.config,
  // React-specific configuration
  esbuild: {
    loader: 'tsx',
    include: ['src/**/*'],
    exclude: ['node_modules/**']
  }
})
```

```typescript
// vue.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  ...shared.config,
  // Vue-specific configuration
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables" as *;`
      }
    }
  }
})
```

### 4. Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "quoteProps": "as-needed"
}
```

```json
// .prettierignore
node_modules
dist
build
coverage
*.min.js
*.min.css
```

### 5. Monorepo-aware Configuration

```javascript
// monorepo.config.js
const { execSync } = require('child_process')

function getPackages() {
  try {
    const output = execSync('pnpm -r list --parseable=true --depth=0')
    return output
      .toString()
      .split('\n')
      .filter(Boolean)
      .map(line => path.basename(line))
  } catch (e) {
    return []
  }
}

module.exports = {
  packages: getPackages(),
  rootDir: __dirname,
  workspaceDir: '../'
}
```

## Common Use Cases

### 1. Setting Up a New Package

```bash
# 1. Create new package directory
mkdir packages/my-new-package
cd packages/my-new-package

# 2. Initialize package.json
pnpm init

# 3. Install dependencies
pnpm add @toolkit-house/shared-config -D
pnpm add typescript eslint vite

# 4. Create configuration files
echo '{
  "extends": "@toolkit-house/shared-config/configs/tsconfig.base.json"
}' > tsconfig.json

echo '{
  "extends": "@toolkit-house/shared-config/configs/eslint.base.js"
}' > .eslintrc.js

echo 'import { defineConfig } from "vite"
import shared from "@toolkit-house/shared-config/configs/vite.base.ts"

export default defineConfig(shared.config)' > vite.config.ts

# 5. Add build scripts
echo '"build": "vite build",
"typecheck": "tsc --noEmit",
"lint": "eslint . --ext .ts,.tsx,.js,.jsx",
"lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix"' >> package.json
```

### 2. Setting Up a React Application

```typescript
// react-app/tsconfig.json
{
  "extends": "@toolkit-house/shared-config/configs/tsconfig.react.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@toolkit-house/*": ["../../packages/*"]
    }
  }
}

// react-app/.eslintrc.js
module.exports = {
  extends: [
    '@toolkit-house/shared-config/configs/eslint.react.js'
  ],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  }
}

// react-app/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import shared from '@toolkit-house/shared-config/configs/vite.base.ts'

export default defineConfig({
  plugins: [react()],
  ...shared.config,
  resolve: {
    ...shared.config.resolve,
    alias: {
      ...shared.config.resolve.alias,
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

### 3. Setting Up a Vue Application

```typescript
// vue-app/tsconfig.json
{
  "extends": "@toolkit-house/shared-config/configs/tsconfig.vue.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@toolkit-house/*": ["../../packages/*"]
    }
  }
}

// vue-app/.eslintrc.js
module.exports = {
  extends: [
    '@toolkit-house/shared-config/configs/eslint.vue.js'
  ],
  rules: {
    'vue/component-tags-order': ['error', {
      order: ['script', 'template', 'style']
    }],
    'vue/multi-word-component-names': 'off'
  }
}

// vue-app/vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import shared from '@toolkit-house/shared-config/configs/vite.base.ts'

export default defineConfig({
  plugins: [vue()],
  ...shared.config,
  resolve: {
    ...shared.config.resolve,
    alias: {
      ...shared.config.resolve.alias,
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

### 4. CI/CD Pipeline Configuration

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        package: [ts-utils, validation, http-client, logger]

    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'pnpm'

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Type check
      run: pnpm run typecheck
      working-directory: packages/${{ matrix.package }}

    - name: Lint
      run: pnpm run lint
      working-directory: packages/${{ matrix.package }}

    - name: Build
      run: pnpm run build
      working-directory: packages/${{ matrix.package }}

    - name: Test
      run: pnpm run test
      working-directory: packages/${{ matrix.package }}

  lint-check:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'pnpm'

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Lint all packages
      run: pnpm run lint
```

## API Reference

### Configuration Files

#### TypeScript Configurations
- `configs/tsconfig.base.json` - Base TypeScript configuration
- `configs/tsconfig.react.json` - React-specific TypeScript configuration
- `configs/tsconfig.vue.json` - Vue-specific TypeScript configuration

#### ESLint Configurations
- `configs/eslint.base.js` - Base ESLint configuration
- `configs/eslint.react.js` - React ESLint configuration
- `configs/eslint.vue.js` - Vue ESLint configuration

#### Vite Configurations
- `configs/vite.base.ts` - Base Vite configuration
- `configs/vite.react.ts` - React Vite configuration
- `configs/vite.vue.ts` - Vue Vite configuration

### Available Scripts

```json
{
  "scripts": {
    "build": "vite build",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "prepare": "husky install",
    "pre-commit": "lint-staged"
  }
}
```

### Lint Staged Configuration

```json
// .lintstagedrc.json
{
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{js,jsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.md": [
    "prettier --write"
  ]
}
```

## Development

```bash
# Navigate to package directory
cd packages/shared-config

# Build the package
pnpm run build

# Type check
pnpm run typecheck

# Lint
pnpm run lint
```

### Contributing

When adding new configurations:

1. Add new configuration files to the appropriate category
2. Update the README with usage instructions
3. Test the configuration with example projects
4. Ensure backward compatibility
5. Update the version if necessary

## License

MIT