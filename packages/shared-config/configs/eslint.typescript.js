import baseConfig from './eslint.base.js'
import tseslint from 'typescript-eslint'

export default [
  ...baseConfig,
  {
    ignores: [
      '**/*.d.ts',
      'dist/**',
      'build/**',
      'coverage/**'
    ]
  },
  
  {
    files: ['**/*.{ts,tsx}'],
    ...tseslint.configs.recommended,
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: process.cwd(),
        ecmaVersion: 2022,
        sourceType: 'module'
      }
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-interface': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      
      // Import sorting
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single']
        }
      ],
      '@typescript-eslint/consistent-type-imports': 'error'
    }
  }
]