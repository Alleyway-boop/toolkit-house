# Adding a Package

Learn how to create a new package for the Toolkit House monorepo.

## Overview

This tutorial walks through creating a new utility package called `@toolkit-house/format` for string formatting utilities.

## Step 1: Create Package Directory

```bash
mkdir -p packages/format/src
cd packages/format
```

## Step 2: Initialize package.json

Create `packages/format/package.json`:

```json
{
  "name": "@toolkit-house/format",
  "version": "0.0.1",
  "type": "module",
  "description": "String formatting utilities for Toolkit House",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./number": {
      "import": "./dist/number.js",
      "types": "./dist/number.d.ts"
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "dev": "unbuild",
    "build": "unbuild",
    "test": "vitest",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@toolkit-house/ts-utils": "workspace:*",
    "@toolkit-house/types": "workspace:*",
    "@toolkit-house/constants": "workspace:*"
  },
  "devDependencies": {
    "@toolkit-house/shared-config": "workspace:*",
    "typescript": "^5.3.3",
    "unbuild": "^2.0.0",
    "vitest": "^1.1.0"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

## Step 3: Create TypeScript Config

Create `packages/format/tsconfig.json`:

```json
{
  "extends": "@toolkit-house/shared-config/tsconfig.app.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

## Step 4: Create Build Config

Create `packages/format/build.config.ts`:

```typescript
import { defineConfig } from 'unbuild'

export default defineConfig({
  entries: ['src/index', 'src/number'],
  outDir: 'dist',
  format: 'esm',
  dts: true,
  clean: true,
  declaration: true,
  externals: [
    '@toolkit-house/ts-utils',
    '@toolkit-house/types',
    '@toolkit-house/constants',
  ],
})
```

## Step 5: Create Source Files

### Main Entry Point

Create `packages/format/src/index.ts`:

```typescript
/**
 * Format a string as title case
 */
export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Truncate a string to a maximum length
 */
export function truncate(str: string, maxLength: number, suffix = '...'): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - suffix.length) + suffix
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convert a string to kebab-case
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * Convert a string to camelCase
 */
export function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/^[A-Z]/, c => c.toLowerCase())
}
```

### Number Formatting

Create `packages/format/src/number.ts`:

```typescript
/**
 * Format a number with thousand separators
 */
export function formatNumber(
  value: number,
  options?: {
    decimals?: number
    thousandsSeparator?: string
    decimalSeparator?: string
  }
): string {
  const {
    decimals = 2,
    thousandsSeparator = ',',
    decimalSeparator = '.',
  } = options || {}

  const parts = value.toFixed(decimals).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator)

  return parts.join(decimalSeparator)
}

/**
 * Format a number as currency
 */
export function formatCurrency(
  value: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value)
}

/**
 * Format a number as percentage
 */
export function formatPercentage(
  value: number,
  decimals = 2
): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Format a number as bytes with units
 */
export function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(size < 10 ? 2 : 1)} ${units[unitIndex]}`
}
```

## Step 6: Create Tests

Create `packages/format/src/index.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { titleCase, truncate, capitalize, kebabCase, camelCase } from './index'

describe('format', () => {
  describe('titleCase', () => {
    it('converts string to title case', () => {
      expect(titleCase('hello world')).toBe('Hello World')
      expect(titleCase('HELLO WORLD')).toBe('Hello World')
    })
  })

  describe('truncate', () => {
    it('truncates long strings', () => {
      expect(truncate('Hello World', 8)).toBe('Hello...')
      expect(truncate('Hello', 10)).toBe('Hello')
    })
  })

  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
      expect(capitalize('')).toBe('')
    })
  })

  describe('kebabCase', () => {
    it('converts to kebab-case', () => {
      expect(kebabCase('helloWorld')).toBe('hello-world')
      expect(kebabCase('Hello World')).toBe('hello-world')
    })
  })

  describe('camelCase', () => {
    it('converts to camelCase', () => {
      expect(camelCase('hello-world')).toBe('helloWorld')
      expect(camelCase('Hello World')).toBe('helloWorld')
    })
  })
})
```

Create `packages/format/src/number.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { formatNumber, formatCurrency, formatPercentage, formatBytes } from './number'

describe('format/number', () => {
  describe('formatNumber', () => {
    it('formats numbers with separators', () => {
      expect(formatNumber(1234567.89)).toBe('1,234,567.89')
      expect(formatNumber(1234.5, { decimals: 1 })).toBe('1,234.5')
    })
  })

  describe('formatCurrency', () => {
    it('formats as currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(1234.56, 'EUR', 'de-DE')).toBe('1.234,56 €')
    })
  })

  describe('formatPercentage', () => {
    it('formats as percentage', () => {
      expect(formatPercentage(0.1234)).toBe('12.34%')
      expect(formatPercentage(0.5, 0)).toBe('50%')
    })
  })

  describe('formatBytes', () => {
    it('formats bytes with units', () => {
      expect(formatBytes(500)).toBe('500 B')
      expect(formatBytes(1536)).toBe('1.5 KB')
      expect(formatBytes(1048576)).toBe('1.0 MB')
      expect(formatBytes(1073741824)).toBe('1.0 GB')
    })
  })
})
```

## Step 7: Install and Build

```bash
# From root
pnpm install

# Build the new package
cd packages/format
pnpm run build

# Run tests
pnpm run test

# Type check
pnpm run typecheck
```

## Step 8: Use in Application

```tsx
// apps/react-demo/src/App.tsx
import { titleCase, formatCurrency } from '@toolkit-house/format'
import { formatNumber } from '@toolkit-house/format/number'

function App() {
  const name = titleCase('john doe')
  const price = formatCurrency(1234.56)
  const count = formatNumber(9876543)

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Price: {price}</p>
      <p>Count: {count}</p>
    </div>
  )
}
```

## Package Checklist

- [ ] package.json with correct name and dependencies
- [ ] tsconfig.json extending shared config
- [ ] build.config.ts for unbuild
- [ ] Source files in src/
- [ ] Tests with vitest
- [ ] Exports defined in package.json
- [ ] README.md with documentation
- [ ] Build succeeds
- [ ] Tests pass
- [ ] Type checking passes

## Next Steps

- Learn about [Creating a Component](/guide/tutorials/component)
- Explore [Building an App](/guide/tutorials/app)
- Read [API Reference](/api/)
