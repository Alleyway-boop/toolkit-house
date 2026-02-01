# @toolkit-house/security

Security utilities for Toolkit House - key management, encryption, and cryptographic operations.

## Features

- **Key Management** - Secure key generation, storage, and rotation
- **Encryption/Decryption** - AES-256-CBC encryption for sensitive data
- **Key Derivation** - PBKDF2 for deriving keys from passwords
- **Hashing** - Secure hashing algorithms (SHA-256, SHA-512)
- **Random Generation** - Cryptographically secure random values

## Installation

```bash
pnpm add @toolkit-house/security
```

## Quick Start

### Key Management

```typescript
import { KeyManager, defaultKeyManager } from '@toolkit-house/security'

// Use the default singleton key manager
const keyId = defaultKeyManager.generateKey('AES-256-CBC')
console.log('Generated key:', keyId)

// Get key info
const keyInfo = defaultKeyManager.getKeyInfo(keyId)
console.log('Key info:', keyInfo)

// Encrypt data
const encrypted = defaultKeyManager.encrypt('Hello, World!', keyId)
console.log('Encrypted:', encrypted)

// Decrypt data
const decrypted = defaultKeyManager.decrypt(encrypted, keyId)
console.log('Decrypted:', decrypted) // 'Hello, World!'
```

### Custom Key Manager

```typescript
import { KeyManager } from '@toolkit-house/security'

const keyManager = new KeyManager({
  keySize: 32, // 256 bits
  algorithm: 'aes-256-cbc',
  keyDerivation: {
    iterations: 100000,
    saltLength: 16,
  },
})

// Generate a new key
const keyId = keyManager.generateKey()

// Encrypt sensitive data
const encrypted = keyManager.encrypt(
  JSON.stringify({ userId: 123, email: 'user@example.com' }),
  keyId
)

// Decrypt when needed
const decrypted = keyManager.decrypt(encrypted, keyId)
const data = JSON.parse(decrypted)
```

### Key Rotation

```typescript
// Rotate an existing key
const newKeyId = defaultKeyManager.rotateKey(keyId)

// Re-encrypt data with new key
const reEncrypted = defaultKeyManager.reEncrypt(encrypted, keyId, newKeyId)

// Remove old key
defaultKeyManager.removeKey(keyId)
```

## API Reference

### KeyManager

Main class for key management operations.

#### Constructor

```typescript
new KeyManager(config?: KeyManagerConfig)
```

**Options:**
- `keySize` - Key size in bytes (default: 32)
- `algorithm` - Encryption algorithm (default: 'aes-256-cbc')
- `keyDerivation` - Key derivation options

#### Methods

##### `generateKey(algorithm?: string): string`

Generate a new encryption key.

**Returns:** Key ID for referencing the key

##### `encrypt(data: string, keyId: string): EncryptedData`

Encrypt data using the specified key.

**Returns:** Encrypted data object with IV and auth tag

##### `decrypt(encrypted: EncryptedData, keyId: string): string`

Decrypt encrypted data using the specified key.

**Returns:** Decrypted string

##### `rotateKey(keyId: string): string`

Rotate an encryption key, generating a new key.

**Returns:** New key ID

##### `reEncrypt(encrypted: EncryptedData, oldKeyId: string, newKeyId: string): EncryptedData`

Re-encrypt data with a new key.

**Returns:** New encrypted data object

##### `removeKey(keyId: string): void`

Remove a key from storage.

##### `getKeyInfo(keyId: string): KeyInfo | undefined`

Get information about a stored key.

**Returns:** Key information object

### EncryptedData

Structure of encrypted data.

```typescript
interface EncryptedData {
  data: string        // Base64 encoded encrypted data
  iv: string          // Base64 encoded initialization vector
  authTag?: string    // Base64 encoded authentication tag (for GCM)
  algorithm: string   // Algorithm used for encryption
}
```

### KeyInfo

Information about a stored key.

```typescript
interface KeyInfo {
  id: string
  algorithm: string
  createdAt: Date
  size: number
}
```

### KeyManagerConfig

Configuration for KeyManager.

```typescript
interface KeyManagerConfig {
  keySize?: number
  algorithm?: string
  keyDerivation?: {
    iterations?: number
    saltLength?: number
    digest?: string
  }
}
```

## Security Considerations

- **Key Storage**: Keys are stored in-memory only. Persist keys securely using your own storage solution.
- **Key Rotation**: Regular key rotation is recommended for production systems.
- **Algorithm**: AES-256-CBC is used by default. For authenticated encryption, consider using GCM mode.
- **Key Derivation**: PBKDF2 is used with configurable iterations for password-based key derivation.

## Module Exports

```typescript
// Key management
import {
  KeyManager,
  defaultKeyManager
} from '@toolkit-house/security'

// Types
import type {
  EncryptedData,
  KeyInfo,
  KeyManagerConfig
} from '@toolkit-house/security'
```

## Development

```bash
pnpm run dev              # Run with unbuild stub
pnpm run build            # Build with unbuild
pnpm run test             # Run tests with vitest
pnpm run typecheck        # Type check with TypeScript
```

## License

MIT
