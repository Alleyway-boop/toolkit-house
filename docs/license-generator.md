# License Generator Package Documentation

A comprehensive license generation and validation system built with TypeScript and AES-256-CBC encryption.

## 📦 Installation

```bash
npm install license-generator
# or
pnpm add license-generator
# or
yarn add license-generator
```

## 🛡️ Package Overview

The `license-generator-package` provides:
- License generation with configurable expiry dates
- AES-256-CBC encrypted license validation
- Batch license generation with multiple output formats
- Command-line interface for easy usage
- TypeScript API for programmatic access

## 🔐 Security Features

- **AES-256-CBC Encryption**: Industry-standard symmetric encryption
- **Secure Key Management**: Environment variable and configuration file support
- **Validation Mechanisms**: Comprehensive license validation with error reporting
- **Multiple Output Formats**: TXT, JSON, and CSV support

## 🚀 Quick Start

### Command Line Usage

```bash
# Generate a default license (365 days)
node licenseGenerator.js generate

# Generate a 30-day license
node licenseGenerator.js generate 30

# Generate and save to file
node licenseGenerator.js generate 365 --save

# Batch generate 10 licenses
node licenseGenerator.js batch 10

# Batch generate and save as JSON
node licenseGenerator.js batch 5 365 --save --format=json

# Validate a license
node licenseGenerator.js validate <license-key>

# Generate new encryption key
node licenseGenerator.js gen-key
```

### TypeScript API Usage

```typescript
import { LicenseGenerator, LicenseService } from 'license-generator'

// Create generator instance
const generator = new LicenseGenerator({
  encryptionKey: 'your-secret-key',
  defaultExpiryDays: 365,
  outputDir: './licenses'
})

// Generate license
const licenseKey = generator.generateLicense(30)

// Validate license
generator.validateLicense(licenseKey)

// Batch generation
const licenses = generator.generateBatchLicenses(10, 90)
generator.saveBatchLicensesToFile(licenses, 'batch-licenses', 'json')
```

## 📚 API Reference

### LicenseGenerator Class

Main class for license generation and management.

```typescript
class LicenseGenerator {
  constructor(config: LicenseGeneratorConfig)
  generateLicense(expiryDays?: number): string
  generateBatchLicenses(count: number, expiryDays?: number): string[]
  saveLicenseToFile(licenseKey: string, filename?: string): void
  saveBatchLicensesToFile(licenses: string[], filename?: string, format?: string): void
  validateLicense(licenseKey: string): void
  showConfig(): void
  updateConfig(newConfig: Partial<LicenseGeneratorConfig>): void
  generateKeyPair(): void
}
```

#### LicenseGeneratorConfig Interface

```typescript
interface LicenseGeneratorConfig {
  encryptionKey?: string              // Encryption key for AES-256-CBC
  defaultExpiryDays?: number        // Default expiry days (default: 365)
  outputDir?: string                 // Output directory (default: './licenses')
}
```

#### Constructor Parameters

- `config` (LicenseGeneratorConfig): Configuration options

**Default Configuration:**
```typescript
{
  encryptionKey: LicenseCrypto.generateEncryptionKey(),
  defaultExpiryDays: 365,
  outputDir: './licenses'
}
```

#### Methods

##### `generateLicense(expiryDays?: number): string`

Generates a single license key.

**Parameters:**
- `expiryDays` (number, optional): Number of days until expiration. Uses `defaultExpiryDays` if not provided.

**Returns:**
- `string`: Generated license key

**Example:**
```typescript
const generator = new LicenseGenerator()

// Generate default license (365 days)
const license = generator.generateLicense()

// Generate 30-day license
const shortLicense = generator.generateLicense(30)
```

##### `generateBatchLicenses(count: number, expiryDays?: number): string[]`

Generates multiple license keys.

**Parameters:**
- `count` (number): Number of licenses to generate
- `expiryDays` (number, optional): Expiry days for all licenses

**Returns:**
- `string[]`: Array of license keys

**Example:**
```typescript
const generator = new LicenseGenerator()
const licenses = generator.generateBatchLicenses(5, 90) // 5 licenses, 90 days each
```

##### `saveLicenseToFile(licenseKey: string, filename?: string): void`

Saves a license key to a file.

**Parameters:**
- `licenseKey` (string): License key to save
- `filename` (string, optional): Custom filename

**Example:**
```typescript
const generator = new LicenseGenerator()
const license = generator.generateLicense(30)
generator.saveLicenseToFile(license, 'my-license.txt')
```

##### `saveBatchLicensesToFile(licenses: string[], filename?: string, format?: string): void`

Saves multiple license keys to a file.

**Parameters:**
- `licenses` (string[]): Array of license keys
- `filename` (string, optional): Custom filename
- `format` ('txt' | 'json' | 'csv', optional): Output format

**Example:**
```typescript
const generator = new LicenseGenerator()
const licenses = generator.generateBatchLicenses(10, 180)

// Save as JSON
generator.saveBatchLicensesToFile(licenses, 'licenses', 'json')

// Save as CSV
generator.saveBatchLicensesToFile(licenses, 'licenses.csv', 'csv')
```

##### `validateLicense(licenseKey: string): void`

Validates a license key and displays information.

**Parameters:**
- `licenseKey` (string): License key to validate

**Example:**
```typescript
const generator = new LicenseGenerator()
generator.validateLicense('your-license-key-here')
```

##### `showConfig(): void`

Displays current configuration.

**Example:**
```typescript
const generator = new LicenseGenerator()
generator.showConfig()
```

##### `updateConfig(newConfig: Partial<LicenseGeneratorConfig>): void`

Updates configuration.

**Parameters:**
- `newConfig` (Partial<LicenseGeneratorConfig>): New configuration options

**Example:**
```typescript
const generator = new LicenseGenerator()
generator.updateConfig({
  defaultExpiryDays: 180,
  outputDir: './my-licenses'
})
```

##### `generateKeyPair(): void`

Generates a new encryption key pair. **Warning:** This invalidates all existing licenses encrypted with the old key.

**Example:**
```typescript
const generator = new LicenseGenerator()
generator.generateKeyPair()
```

### LicenseService Class

Singleton service for license validation in applications.

```typescript
class LicenseService {
  static getInstance(): LicenseService
  validateLicenseKey(licenseKey: string): LicenseStatus
}
```

#### LicenseStatus Interface

```typescript
interface LicenseStatus {
  isValid: boolean
  error?: string
}
```

#### Methods

##### `static getInstance(): LicenseService`

Gets the singleton instance of LicenseService.

**Returns:**
- `LicenseService`: Service instance

##### `validateLicenseKey(licenseKey: string): LicenseStatus`

Validates a license key.

**Parameters:**
- `licenseKey` (string): License key to validate

**Returns:**
- `LicenseStatus`: Validation result

**Example:**
```typescript
import { LicenseService } from 'license-generator'

const service = LicenseService.getInstance()
const result = service.validateLicenseKey('your-license-key')

if (result.isValid) {
  console.log('License is valid')
} else {
  console.log('License is invalid:', result.error)
}
```

### LicenseCrypto Module

Cryptographic utilities for license operations.

```typescript
class LicenseCrypto {
  static generateEncryptionKey(): string
  static encrypt(data: any, key: string): string
  static decrypt(encryptedData: string, key: string): any
  static validateLicense(licenseKey: string, key: string): LicenseValidation
}
```

#### LicenseValidation Interface

```typescript
interface LicenseValidation {
  isValid: boolean
  data?: LicenseData
  error?: string
}

interface LicenseData {
  licenseId: string
  issuedDate: string
  expiryDate: string
  days: number
}
```

#### Static Methods

##### `generateEncryptionKey(): string`

Generates a new encryption key.

**Returns:**
- `string`: Generated encryption key

**Example:**
```typescript
import { LicenseCrypto } from 'license-generator'

const key = LicenseCrypto.generateEncryptionKey()
console.log('New encryption key:', key)
```

##### `encrypt(data: any, key: string): string`

Encrypts data.

**Parameters:**
- `data` (any): Data to encrypt
- `key` (string): Encryption key

**Returns:**
- `string`: Encrypted string

##### `decrypt(encryptedData: string, key: string): any`

Decrypts encrypted data.

**Parameters:**
- `encryptedData` (string): Encrypted data
- `key` (string): Encryption key

**Returns:**
- `any`: Decrypted data

##### `validateLicense(licenseKey: string, key: string): LicenseValidation`

Validates a license key.

**Parameters:**
- `licenseKey` (string): License key to validate
- `key` (string): Encryption key

**Returns:**
- `LicenseValidation`: Validation result

## 🛠️ Configuration

### Configuration File

The generator uses a `license-config.json` file for persistent configuration:

```json
{
  "encryptionKey": "your-encryption-key",
  "defaultExpiryDays": 365,
  "outputDir": "./licenses"
}
```

### Environment Variables

Set encryption key via environment variable:

```bash
export LICENSE_ENCRYPTION_KEY="your-encryption-key"
```

### Configuration Priority

1. Environment variables (`LICENSE_ENCRYPTION_KEY`)
2. Configuration file (`license-config.json`)
3. Constructor options
4. Default values

## 📄 License Formats

### TXT Format

```
批量许可证文件
生成时间: 2024-01-15 10:30:00
许可证总数: 3
==================================================

许可证 1:
密钥: abc123...
ID: LICENSE-001-2024
颁发日期: 2024-01-15
过期日期: 2024-12-15
------------------------------

许可证 2:
密钥: def456...
ID: LICENSE-002-2024
颁发日期: 2024-01-15
过期日期: 2024-12-15
------------------------------

许可证 3:
密钥: ghi789...
ID: LICENSE-003-2024
颁发日期: 2024-01-15
过期日期: 2024-12-15
------------------------------
```

### JSON Format

```json
{
  "generatedAt": "2024-01-15T10:30:00.000Z",
  "totalCount": 3,
  "licenses": [
    {
      "index": 1,
      "licenseKey": "abc123...",
      "licenseId": "LICENSE-001-2024",
      "issuedDate": "2024-01-15",
      "expiryDate": "2024-12-15"
    },
    {
      "index": 2,
      "licenseKey": "def456...",
      "licenseId": "LICENSE-002-2024",
      "issuedDate": "2024-01-15",
      "expiryDate": "2024-12-15"
    }
  ]
}
```

### CSV Format

```csv
Index,License Key,License ID,Issued Date,Expiry Date
1,"abc123...","LICENSE-001-2024","2024-01-15","2024-12-15"
2,"def456...","LICENSE-002-2024","2024-01-15","2024-12-15"
3,"ghi789...","LICENSE-003-2024","2024-01-15","2024-12-15"
```

## 🔒 Security Best Practices

### Key Management

1. **Secure Storage**: Store encryption keys in secure environment variables or encrypted configuration
2. **Key Rotation**: Regularly rotate encryption keys
3. **Access Control**: Restrict access to keys based on principle of least privilege
4. **Backup Strategy**: Secure backup of encryption keys

### License Security

1. **Strong Keys**: Use long, randomly generated keys
2. **Expiry Management**: Set appropriate expiry dates for licenses
3. **Validation**: Always validate licenses before allowing access
4. **Audit Trail**: Keep logs of license validation attempts

### Production Deployment

```typescript
import { LicenseGenerator, LicenseService } from 'license-generator'

// Production configuration
const generator = new LicenseGenerator({
  encryptionKey: process.env.LICENSE_ENCRYPTION_KEY,
  defaultExpiryDays: 365,
  outputDir: '/secure/licenses'
})

// Service validation
const service = LicenseService.getInstance()
const result = service.validateLicenseKey(userLicenseKey)

if (!result.isValid) {
  throw new Error('Invalid license')
}
```

## 🧪 Examples

### Basic License Generation

```typescript
import { LicenseGenerator } from 'license-generator'

const generator = new LicenseGenerator({
  encryptionKey: 'my-secure-key-123',
  defaultExpiryDays: 90
})

// Generate and save
const license = generator.generateLicense(30)
generator.saveLicenseToFile(license, 'user-license.txt')
```

### Batch License Generation

```typescript
import { LicenseGenerator } from 'license-generator'

const generator = new LicenseGenerator()

// Generate batch for multiple users
const batchLicenses = generator.generateBatchLicenses(50, 365)

// Save in different formats
generator.saveBatchLicensesToFile(batchLicenses, 'licenses', 'json')
generator.saveBatchLicensesToFile(batchLicenses, 'licenses.csv', 'csv')
```

### License Validation Service

```typescript
import { LicenseService } from 'license-generator'

class AppLicenseManager {
  private licenseService: LicenseService

  constructor() {
    this.licenseService = LicenseService.getInstance()
  }

  checkAccess(licenseKey: string): boolean {
    const result = this.licenseService.validateLicenseKey(licenseKey)
    return result.isValid
  }

  getLicenseInfo(licenseKey: string): LicenseInfo | null {
    const result = this.licenseService.validateLicenseKey(licenseKey)

    if (result.isValid && result.data) {
      return {
        id: result.data.licenseId,
        issuedDate: new Date(result.data.issuedDate),
        expiryDate: new Date(result.data.expiryDate),
        daysRemaining: this.calculateDaysRemaining(result.data.expiryDate)
      }
    }

    return null
  }

  private calculateDaysRemaining(expiryDate: string): number {
    const expiry = new Date(expiryDate)
    const now = new Date()
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }
}

// Usage
const licenseManager = new AppLicenseManager()
const isValid = licenseManager.checkAccess(userLicenseKey)
```

## 🚀 Migration Guide

### From Version 0.x to 1.x

**Breaking Changes:**
- None - APIs are backward compatible

**Enhancements:**
- Improved error handling
- Better validation messages
- Enhanced security features

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details.

## 🔗 Related Resources

- [License Management Best Practices](../examples/license-management.md)
- [Security Configuration Guide](../examples/security-configuration.md)
- [Migration from Other License Systems](../examples/migration-guide.md)