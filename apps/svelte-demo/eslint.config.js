import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs['flat/typescript'],
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelte.parser,
      parserOptions: {
        parser: tsparser,
      },
    },
    plugins: {
      svelte,
    },
  },
  {
    ignores: ['build/', '.svelte-kit/', 'dist/'],
  },
];
