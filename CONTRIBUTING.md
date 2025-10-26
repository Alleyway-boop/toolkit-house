# Contributing to Toolkit House

Thank you for your interest in contributing to Toolkit House! This document provides guidelines and instructions for contributors.

## 📝 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Standards](#documentation-standards)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)

## 🤝 Code of Conduct

We are committed to providing a friendly, safe, and welcoming environment for all contributors. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (for TypeScript/JavaScript packages)
- pnpm package manager
- Go 1.21+ (for the Go server)
- Git
- VS Code (recommended)

### Setup

1. Fork the repository
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/toolkit-house.git
   cd toolkit-house
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```

### Development Environment Setup

1. Install VS Code extensions:
   ```bash
   code --install-extension ms-vscode.vscode-typescript-next
   code --install-extension esbenp.prettier-vscode
   code --install-extension ms-vscode.vscode-json
   code --install-extension ms-vscode.vscode-yaml
   ```

2. Configure your Git identity:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

## 🔄 Development Workflow

### 1. Branch Strategy

We use the following branch naming convention:
- `feature/*` for new features
- `bugfix/*` for bug fixes
- `docs/*` for documentation changes
- `hotfix/*` for emergency fixes
- `main` for production-ready code

### 2. Development Process

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the [Coding Standards](#coding-standards)

3. Test your changes:
   ```bash
   # Run tests for specific package
   cd packages/ts-utils
   pnpm run test

   # Run all tests
   pnpm run test

   # Type checking
   pnpm run typecheck

   # Linting
   pnpm run lint
   ```

4. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a Pull Request

## 💻 Coding Standards

### TypeScript/JavaScript Standards

#### Code Style
- Use TypeScript strict mode
- Follow ESLint rules configured in the project
- Use proper TypeScript types
- Prefer const over let when possible
- Use meaningful variable and function names

#### Error Handling
- Fail fast with descriptive error messages
- Handle errors at appropriate levels
- Never silently swallow exceptions
- Include context for debugging

#### Architecture Principles
- **Composition over inheritance**
- **Explicit over implicit** - Clear data flow and dependencies
- **Single responsibility** per function/class
- **Avoid premature abstractions**

### Go Standards

- Use Go idioms and conventions
- Follow Go naming conventions
- Proper error handling
- Use interfaces for flexibility
- Write tests for all public functions

### Formatting

We use Prettier for code formatting. Run the formatter before committing:
```bash
pnpm run format
```

## 🧪 Testing Guidelines

### Writing Tests

#### Test Structure
- Use descriptive test names
- One assertion per test when possible
- Arrange-Act-Assert pattern
- Test behavior, not implementation

#### Test Examples

```typescript
// Good test example
describe('RequestPool', () => {
  it('should limit concurrent requests to specified number', async () => {
    const pool = new RequestPool(2)
    const mockRequest = vi.fn(() => Promise.resolve('result'))

    // Arrange
    const promises = [
      pool.add(() => mockRequest()),
      pool.add(() => mockRequest()),
      pool.add(() => mockRequest())
    ]

    // Act
    const results = await Promise.all(promises)

    // Assert
    expect(results).toHaveLength(3)
    expect(mockRequest).toHaveBeenCalledTimes(3)
  })
})
```

#### Test Coverage
- Aim for 80%+ test coverage
- Test both success and error cases
- Mock external dependencies
- Use the existing test utilities and helpers

## 📚 Documentation Standards

### Documentation Requirements

1. **API Documentation**: Document all public interfaces
2. **Code Comments**: Explain complex logic
3. **README Files**: Each package should have a README
4. **Change Logs**: Document breaking changes

### JSDoc Standards

```typescript
/**
 * Creates a new request pool with the specified concurrency limit.
 *
 * @param {number} limit - Maximum number of concurrent requests
 * @example
 * const pool = new RequestPool(3);
 * const result = await pool.add(() => fetch('/api/endpoint'));
 * @returns {RequestPool} A new RequestPool instance
 */
export class RequestPool {
  constructor(limit: number = 3) {
    // implementation
  }
}
```

### README Template

Each package should include:

```markdown
# Package Name

Brief description of the package.

## Features

- Feature 1
- Feature 2

## Installation

```bash
npm install package-name
```

## Usage

```typescript
import { Something } from 'package-name'

// Example usage
```

## API Reference

### Classes

#### ClassName

Description of the class.

**Methods**

- `method(param: Type): ReturnType` - Description

## Development

```bash
pnpm install
pnpm run test
pnpm run build
```

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.
```

## 🔗 Pull Request Process

### Before Submitting

1. **Self-review your changes**
2. **Update documentation** if needed
3. **Run the test suite** and ensure all tests pass
4. **Check code coverage** hasn't decreased
5. **Follow coding standards**
6. **Update any relevant README files**

### Pull Request Template

```markdown
## Summary
Brief description of the changes.

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tests added/updated
- [ ] Test coverage maintained/improved
- [ ] Manual testing completed

## Breaking Changes
- [ ] Yes
- [ ] No (explain if any)

## Related Issues
Closes #[issue number]

## Screenshots (if applicable)
```

### Code Review Checklist

- [ ] Code follows project standards
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance impact considered
- [ ] Dependencies are reviewed

## 🚀 Release Process

### Version Management

We use semantic versioning (SemVer):
- `PATCH`: Backward-compatible bug fixes
- `MINOR`: Backward-compatible new features
- `MAJOR**: Incompatible breaking changes

### Release Steps

1. Update version numbers in `package.json` files
2. Update `CHANGELOG.md`
3. Create release branch
4. Test thoroughly
5. Create pull request to main
6. Merge to main
7. Create GitHub release

## 📈 Quality Gates

Before merging any PR, ensure:

- [ ] All tests pass
- [ ] Code follows project standards
- [ ] Documentation is updated
- [ ] No linting errors
- [ ] Type checking passes
- [ ] Test coverage is maintained
- [ ] Commit message is clear and follows convention

## 🛠️ Development Tools

### Recommended VS Code Extensions

- TypeScript Extension Pack
- ESLint
- Prettier
- GitLens
- Go extension

### Development Scripts

```bash
# Development commands
pnpm run dev          # Run development server
pnpm run test         # Run tests
pnpm run build        # Build packages
pnpm run lint         # Run linter
pnpm run typecheck    # Type checking

# Package-specific commands
cd packages/ts-utils && pnpm run test
cd apps/react-demo && pnpm run dev
```

## 🤝 Getting Help

- Create an issue for bugs or feature requests
- Join our community discussions
- Check existing issues before creating new ones
- Follow our Code of Conduct

Thank you for contributing to Toolkit House! 🎉