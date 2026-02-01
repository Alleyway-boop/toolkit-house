# Contributing

Contributing to Toolkit House.

## Getting Started

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## Code Style

### TypeScript

- Use **ES2022** features
- Follow **strict** TypeScript rules
- Use **TypeScript** for all new code
- Add **JSDoc** comments for public APIs

```typescript
/**
 * Format a string as title case
 * @param str - The input string
 * @returns The title-cased string
 */
export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
```

### Naming Conventions

- **Files**: `kebab-case.ts`
- **Variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`
- **Components**: `PascalCase`

### Imports

Group imports:

```typescript
// 1. External imports
import { useState } from 'react'
import { vi } from 'vitest'

// 2. Internal imports
import { Button } from '@toolkit-house/react-components'
import { capitalize } from '@toolkit-house/ts-utils'

// 3. Relative imports
import { styles } from './styles.css'
```

## Commit Messages

Follow conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Maintenance

**Example:**
```
feat(http-client): add retry logic

Implement exponential backoff retry logic for failed requests.

- Add retry count configuration
- Implement exponential backoff
- Add retry delay configuration

Closes #123
```

## Pull Requests

### PR Title

Use the same format as commit messages:

```
feat(http-client): add retry logic
```

### PR Description

Include:
- **Summary**: What changes were made
- **Motivation**: Why the changes were made
- **Testing**: How the changes were tested
- **Breaking changes**: Any breaking changes

### PR Checklist

- [ ] Tests pass
- [ ] Type checking passes
- [ ] Documentation updated
- [ ] No breaking changes (or documented)

## Testing

Write tests for new features:

```typescript
import { describe, it, expect } from 'vitest'

describe('myFunction', () => {
  it('does something', () => {
    expect(myFunction('input')).toBe('expected')
  })
})
```

## Documentation

Update documentation for:

- New features
- API changes
- Breaking changes
- Deprecations

## Questions?

Open an issue for discussion before starting large changes.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
