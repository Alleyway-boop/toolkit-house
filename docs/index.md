# Toolkit House Documentation

Welcome to the comprehensive documentation for the Toolkit House monorepo. This documentation provides everything you need to understand, use, and contribute to our project.

## 📚 Documentation Structure

### 🏗️ Project Overview

- **[README](../README.md)** - Project overview and quick start guide
- **[Architecture Documentation](ARCHITECTURE.md)** - Technical architecture and design principles
- **[Contributing Guide](../CONTRIBUTING.md)** - Guidelines for contributing to the project

### 📦 Package Documentation

#### TypeScript Utilities
- **[ts-utils API](ts-utils.md)** - Request pooling, string similarity, and cache management
- **[Shared Config API](shared-config.md)** - TypeScript, ESLint, and Vite configurations

#### License Management
- **[License Generator API](license-generator.md)** - License generation and validation system
- **[License Management Best Practices](../examples/license-management.md)** - Production deployment guide

#### Component Libraries
- **[Vue Components API](vue-components.md)** - Vue UI components with TypeScript and UnoCSS

### 🛠️ Development Guides

- **[Development Setup](development-setup.md)** - Complete development environment setup
- **[Request Pool Usage](../examples/request-pool-usage.md)** - Advanced RequestPool examples
- **[Security Configuration](../examples/security-configuration.md)** - Security best practices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm package manager
- Go 1.21+ (for the Go server)
- Git for version control

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd toolkit-house

# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Run tests
pnpm run test
```

### Development Commands

```bash
# Development commands
cd packages/ts-utils && pnpm run dev
cd packages/license-generator-package && pnpm run generate
cd apps/react-demo && pnpm run dev
cd apps/server-go && go run main.go
```

## 🏛️ Architecture Overview

### Monorepo Structure

```
toolkit-house/
├── packages/                    # Shared packages and utilities
│   ├── ts-utils/              # TypeScript utility library
│   ├── license-generator/     # License generation and validation
│   ├── vue-components/         # Vue component library
│   └── shared-config/         # Shared configuration
├── apps/                      # Applications and services
│   ├── react-demo/           # React demo application
│   └── server-go/           # Go backend server
└── docs/                     # Project documentation
```

### Technology Stack

| Area | Technologies | Purpose |
|------|-------------|---------|
| **Frontend** | React 19, TypeScript, Vite | Modern web applications |
| **Backend** | Go 1.21+ | Server-side services |
| **Build System** | unbuild, tsc, vite | Modern build tools |
| **Testing** | Vitest, Go testing | Comprehensive testing |
| **Package Management** | pnpm workspaces | Efficient monorepo management |

## 📖 Package APIs

### ts-utils

Core TypeScript utilities:

```typescript
import { RequestPool } from 'ts-utils'
import { stringSimilarity } from 'ts-utils'
import { LRUCache } from 'ts-utils'

// Concurrent request management
const pool = new RequestPool(3)
const result = await pool.add(() => fetch('/api/endpoint'))

// String similarity calculation
const similarity = stringSimilarity('hello', 'hello world')

// Cache management
const cache = new LRUCache<string, number>(10)
cache.set('key', 42)
```

### License Generator

License generation with AES-256-CBC encryption:

```typescript
import { LicenseGenerator, LicenseService } from 'license-generator'

const generator = new LicenseGenerator({
  encryptionKey: process.env.LICENSE_ENCRYPTION_KEY,
  defaultExpiryDays: 365
})

const licenseKey = generator.generateLicense(30)
const service = LicenseService.getInstance()
const result = service.validateLicenseKey(licenseKey)
```

### Vue Components

Modern Vue UI components:

```vue
<template>
  <div>
    <Button @click="handleClick">Click Me</Button>
    <Input v-model="email" placeholder="Email" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Button, Input } from 'vue-components'

const email = ref('')
const handleClick = () => console.log('Button clicked!')
</script>
```

### Shared Config

Centralized configuration management:

```typescript
import { tsconfigBase, createTSConfig } from 'shared-config'

const tsconfig = createTSConfig(tsconfigBase, {
  compilerOptions: {
    target: 'ES2020',
    module: 'ESNext'
  }
})
```

## 🛡️ Security Features

### License Generator Security

- **AES-256-CBC Encryption**: Industry-standard symmetric encryption
- **Secure Key Management**: Environment variable and configuration file support
- **Validation Mechanisms**: Comprehensive license validation
- **Multiple Output Formats**: TXT, JSON, and CSV support

### Best Practices

1. **Never hardcode keys** - Use environment variables
2. **Regular key rotation** - Implement periodic key rotation
3. **Secure storage** - Store keys in secure locations
4. **Comprehensive validation** - Validate all license keys

## 🧪 Testing

### Test Coverage

All packages maintain high test coverage:

```bash
# Run all tests
pnpm run test

# Run tests with coverage
pnpm run test --coverage

# Run tests for specific package
cd packages/ts-utils && pnpm run test
```

### Testing Frameworks

- **Vitest**: Modern testing framework for TypeScript
- **Go Testing**: Standard Go testing framework
- **React Testing Library**: For React component testing

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**: Configure production environment variables
2. **Security Configuration**: Set up secure key management
3. **Monitoring**: Implement monitoring and alerting
4. **Maintenance**: Set up regular maintenance tasks

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN mkdir -p /app/licenses
EXPOSE 3000
CMD ["node", "server.js"]
```

## 📊 Monitoring and Observability

### License Monitoring

- Real-time license validation tracking
- Expiring license alerts
- Usage analytics and reporting
- Automated maintenance tasks

### Performance Metrics

- License generation throughput
- Validation success rates
- System resource usage
- Error tracking and reporting

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes with tests**
4. **Submit a pull request**
5. **Review and merge**

### Code Quality

- TypeScript strict mode
- ESLint for code quality
- Comprehensive test coverage
- Code review process

## 🔗 Related Resources

### External Links

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Vue Documentation](https://vuejs.org/)
- [Go Documentation](https://golang.org/doc/)
- [Vite Documentation](https://vitejs.dev/)

### Tools and Utilities

- **pnpm**: Fast, disk space efficient package manager
- **unbuild**: Modern TypeScript library build tool
- **Vitest**: Fast testing framework
- **ESLint**: JavaScript linting utility

## 📈 Roadmap

### Current Development

- [ ] Enhanced testing coverage
- [ ] Security improvements
- [ ] Documentation updates

### Future Plans

- [ ] Microservices architecture
- [ ] Containerization with Docker
- [ ] Advanced monitoring and analytics
- [ ] Cloud-native deployment

## 🆘 Support

### Getting Help

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check comprehensive documentation
- **Community**: Join community discussions

### Troubleshooting

Common issues and solutions:
- Dependency conflicts: Use `pnpm install`
- Build errors: Run `pnpm run clean && pnpm run build`
- Test failures: Check test configuration and environment

---

**Note**: This documentation is continuously updated. For the most current information, always refer to the latest documentation and codebase.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.