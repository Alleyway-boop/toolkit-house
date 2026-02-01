# @toolkit-house/security API Reference

Security utilities for Toolkit House - key management, encryption, and cryptographic operations.

## Installation

```bash
pnpm add @toolkit-house/security
```

## Core API

### KeyManager

Main class for key management operations.

#### Constructor

```typescript
new KeyManager(config?: KeyManagerConfig)
```

**Configuration Options:**

```typescript
interface KeyManagerConfig {
  keySize?: number              // Key size in bytes (default: 32)
  algorithm?: string            // Encryption algorithm (default: 'aes-256-cbc')
  keyDerivation?: {
    iterations?: number         // PBKDF2 iterations (default: 100000)
    saltLength?: number         // Salt length in bytes (default: 16)
    digest?: string             // Digest algorithm (default: 'sha256')
  }
}
```

---

#### `generateKey(algorithm?: string): string`

Generate a new encryption key.

**Parameters:**
- `algorithm` - Optional algorithm override

**Returns:** Key ID for referencing the key

**Example:**

```typescript
import { defaultKeyManager } from '@toolkit-house/security'

const keyId = defaultKeyManager.generateKey('AES-256-CBC')
console.log('Generated key:', keyId)
```

---

#### `encrypt(data: string, keyId: string): EncryptedData`

Encrypt data using the specified key.

**Parameters:**
- `data` - String data to encrypt
- `keyId` - Key ID to use for encryption

**Returns:** Encrypted data object

```typescript
interface EncryptedData {
  data: string        // Base64 encoded encrypted data
  iv: string          // Base64 encoded initialization vector
  authTag?: string    // Base64 encoded authentication tag (for GCM)
  algorithm: string   // Algorithm used for encryption
}
```

**Example:**

```typescript
const encrypted = defaultKeyManager.encrypt('Hello, World!', keyId)
console.log('Encrypted:', encrypted)
```

---

#### `decrypt(encrypted: EncryptedData, keyId: string): string`

Decrypt encrypted data using the specified key.

**Parameters:**
- `encrypted` - Encrypted data object
- `keyId` - Key ID to use for decryption

**Returns:** Decrypted string

**Example:**

```typescript
const decrypted = defaultKeyManager.decrypt(encrypted, keyId)
console.log('Decrypted:', decrypted) // 'Hello, World!'
```

---

#### `rotateKey(keyId: string): string`

Rotate an encryption key, generating a new key.

**Parameters:**
- `keyId` - Key ID to rotate

**Returns:** New key ID

**Example:**

```typescript
const newKeyId = defaultKeyManager.rotateKey(keyId)
```

---

#### `reEncrypt(encrypted: EncryptedData, oldKeyId: string, newKeyId: string): EncryptedData`

Re-encrypt data with a new key.

**Parameters:**
- `encrypted` - Encrypted data object
- `oldKeyId` - Current key ID
- `newKeyId` - New key ID

**Returns:** New encrypted data object

**Example:**

```typescript
const reEncrypted = defaultKeyManager.reEncrypt(encrypted, keyId, newKeyId)
```

---

#### `removeKey(keyId: string): void`

Remove a key from storage.

**Parameters:**
- `keyId` - Key ID to remove

**Example:**

```typescript
defaultKeyManager.removeKey(keyId)
```

---

#### `getKeyInfo(keyId: string): KeyInfo | undefined`

Get information about a stored key.

**Parameters:**
- `keyId` - Key ID to query

**Returns:** Key information object or undefined

```typescript
interface KeyInfo {
  id: string
  algorithm: string
  createdAt: Date
  size: number
}
```

**Example:**

```typescript
const keyInfo = defaultKeyManager.getKeyInfo(keyId)
console.log('Key info:', keyInfo)
```

---

## Singleton Instance

### `defaultKeyManager`

Pre-configured singleton instance of KeyManager.

```typescript
import { defaultKeyManager } from '@toolkit-house/security'

// Use directly without instantiation
const keyId = defaultKeyManager.generateKey()
```

---

## Type Definitions

### EncryptedData

```typescript
interface EncryptedData {
  data: string        // Base64 encoded encrypted data
  iv: string          // Base64 encoded initialization vector
  authTag?: string    // Base64 encoded authentication tag (for GCM)
  algorithm: string   // Algorithm used for encryption
}
```

### KeyInfo

```typescript
interface KeyInfo {
  id: string
  algorithm: string
  createdAt: Date
  size: number
}
```

### KeyManagerConfig

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

---

## Usage Examples

### Basic Encryption/Decryption

```typescript
import { defaultKeyManager } from '@toolkit-house/security'

// Generate key
const keyId = defaultKeyManager.generateKey()

// Encrypt sensitive data
const encrypted = defaultKeyManager.encrypt(
  JSON.stringify({ userId: 123, email: 'user@example.com' }),
  keyId
)

// Decrypt when needed
const decrypted = defaultKeyManager.decrypt(encrypted, keyId)
const data = JSON.parse(decrypted)
```

### Key Rotation Workflow

```typescript
// 1. Generate new key
const newKeyId = defaultKeyManager.rotateKey(oldKeyId)

// 2. Re-encrypt existing data
const reEncrypted = defaultKeyManager.reEncrypt(
  encryptedData,
  oldKeyId,
  newKeyId
)

// 3. Remove old key
defaultKeyManager.removeKey(oldKeyId)
```

### Custom Configuration

```typescript
import { KeyManager } from '@toolkit-house/security'

const keyManager = new KeyManager({
  keySize: 32,
  algorithm: 'aes-256-cbc',
  keyDerivation: {
    iterations: 100000,
    saltLength: 16,
  },
})
```

---

## Security Considerations

- **Key Storage**: Keys are stored in-memory only. Persist keys securely using your own storage solution.
- **Key Rotation**: Regular key rotation is recommended for production systems.
- **Algorithm**: AES-256-CBC is used by default. For authenticated encryption, consider using GCM mode.
- **Key Derivation**: PBKDF2 is used with configurable iterations for password-based key derivation.

---

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

---

## See Also

- [Package Guide](/packages/security) - Usage guide and examples
- [GitHub Repository](https://github.com/your-org/toolkit-house) - Source code
