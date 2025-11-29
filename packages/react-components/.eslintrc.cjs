module.exports = {
  extends: [
    '@toolkit-house/eslint-config/base',
    '@toolkit-house/eslint-config/react'
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: true
  },
  ignorePatterns: [
    'dist',
    'node_modules',
    'coverage',
    '*.config.js',
    '*.config.cjs',
    'storybook-static'
  ]
}