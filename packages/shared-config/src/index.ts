// TypeScript Configurations - these are available as static files
export const tsconfigBase = './configs/tsconfig.base.json'
export const tsconfigReact = './configs/tsconfig.react.json'
export const tsconfigLibrary = './configs/tsconfig.library.json'
export const tsconfigUnified = './configs/tsconfig.unified.json'

// ESLint Configurations - these are available as static files
export const eslintBase = './configs/eslint.base.js'
export const eslintTypeScript = './configs/eslint.typescript.js'
export const eslintReact = './configs/eslint.react.js'
export const eslintUnified = './configs/eslint.unified.js'

// Vite Configurations - these are available as static files
export const viteBase = './configs/vite.base.js'
export const viteLibrary = './configs/vite.library.js'
export const viteReact = './configs/vite.react.js'

// TypeScript interfaces for configuration objects
interface TSConfigBase {
  extends?: string
  compilerOptions?: Record<string, unknown>
  include?: string[]
  exclude?: string[]
  [key: string]: unknown
}

interface ESLintConfigBase {
  ignores?: string[]
  files?: string[]
  [key: string]: unknown
}

interface ViteConfigBase {
  plugins?: unknown[]
  [key: string]: unknown
}

// Configuration utilities
export const createTSConfig = (
  base: TSConfigBase,
  overrides: Partial<TSConfigBase> = {}
): TSConfigBase => ({
  ...base,
  ...overrides,
  compilerOptions: {
    ...(base.compilerOptions || {}),
    ...(overrides.compilerOptions || {})
  }
})

export const createESLintConfig = (
  base: ESLintConfigBase[],
  ...extensions: ESLintConfigBase[]
): ESLintConfigBase[] => [...base, ...extensions]

export const createViteConfig = (
  base: ViteConfigBase,
  ...plugins: unknown[]
): ViteConfigBase => {
  const config = { ...base }
  if (plugins.length > 0) {
    config.plugins = [...(base.plugins || []), ...plugins]
  }
  return config
}

// Preset configurations for common use cases
export const presets = {
  // TypeScript library preset
  library: {
    tsconfig: tsconfigLibrary,
    eslint: [eslintBase, eslintTypeScript],
    vite: viteLibrary
  },

  // React application preset
  react: {
    tsconfig: tsconfigReact,
    eslint: [eslintBase, eslintTypeScript, eslintReact],
    vite: viteReact
  },

  // Unified preset (all-in-one)
  unified: {
    tsconfig: tsconfigUnified,
    eslint: eslintUnified,
    vite: viteBase
  }
}

// Utility to get configuration paths relative to a package
export const getConfigPath = (config: string) => {
  // Note: This works when the package is published and installed
  // For development use, the paths should be relative to the consuming package
  try {
    const sharedConfigPath = import.meta.resolve('@toolkit-house/shared-config')
    const configDir = sharedConfigPath.replace('/dist/index.js', '/configs')
    return `${configDir}/${config}`
  } catch {
    // Fallback for development environments
    return `./node_modules/@toolkit-house/shared-config/configs/${config}`
  }
}

// Export configuration types for TypeScript users
export interface ConfigPaths {
  tsconfigBase: string
  tsconfigReact: string
  tsconfigLibrary: string
  tsconfigUnified: string
  eslintBase: string
  eslintTypeScript: string
  eslintReact: string
  eslintUnified: string
  viteBase: string
  viteLibrary: string
  viteReact: string
}