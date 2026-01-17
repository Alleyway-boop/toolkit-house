/**
 * Key Management System with encryption, decryption, and key rotation
 */

import type { KeyObject } from 'crypto'
import { createSecretKey, randomBytes, createCipheriv, createDecipheriv } from 'crypto'

/**
 * Encrypted data result
 */
export interface EncryptedData {
  /** Encrypted data in hex format */
  encrypted: string
  /** Initialization vector in hex format */
  iv: string
  /** Authentication tag in hex format */
  authTag: string
}

/**
 * Key information
 */
export interface KeyInfo {
  /** Key name/identifier */
  name: string
  /** When the key was created */
  createdAt: number
  /** Key algorithm */
  algorithm: string
  /** Key length in bits */
  length: number
}

/**
 * KeyManager configuration
 */
export interface KeyManagerConfig {
  /** Default rotation interval in milliseconds (default: 30 days) */
  rotationInterval?: number
}

/**
 * KeyManager manages cryptographic keys with rotation support
 * @example
 * ```ts
 * const manager = new KeyManager({ rotationInterval: 30 * 24 * 60 * 60 * 1000 });
 * const keyId = manager.generateKey('api-key');
 * const encrypted = manager.encrypt('sensitive data', 'api-key');
 * const decrypted = manager.decrypt(encrypted.encrypted, 'api-key', encrypted.iv, encrypted.authTag);
 * ```
 */
export class KeyManager {
  private keys: Map<string, KeyObject>
  private keyMetadata: Map<string, KeyInfo>
  private archivedKeys: Map<string, KeyObject[]>
  private rotationInterval: number

  constructor(config: KeyManagerConfig = {}) {
    this.keys = new Map()
    this.keyMetadata = new Map()
    this.archivedKeys = new Map()
    this.rotationInterval = config.rotationInterval || 30 * 24 * 60 * 60 * 1000 // 30 days
  }

  /**
   * Generate a new AES-256-GCM key
   */
  generateKey(name: string): string {
    const key = createSecretKey(randomBytes(32))
    const keyId = this.generateKeyId(name)

    this.keys.set(keyId, key)
    this.keyMetadata.set(keyId, {
      name,
      createdAt: Date.now(),
      algorithm: 'aes-256-gcm',
      length: 256,
    })

    return keyId
  }

  /**
   * Generate a unique key ID
   */
  private generateKeyId(name: string): string {
    return `${name}_${Date.now()}_${randomBytes(8).toString('hex')}`
  }

  /**
   * Rotate a key, archiving the old one
   */
  rotateKey(name: string): string {
    // Find existing keys for this name
    const existingKeys: string[] = []
    for (const [keyId, metadata] of this.keyMetadata) {
      if (metadata.name === name) {
        existingKeys.push(keyId)
      }
    }

    // Archive existing keys
    for (const keyId of existingKeys) {
      const key = this.keys.get(keyId)
      if (key) {
        if (!this.archivedKeys.has(name)) {
          this.archivedKeys.set(name, [])
        }
        this.archivedKeys.get(name)!.push(key)
        this.keys.delete(keyId)
        this.keyMetadata.delete(keyId)
      }
    }

    // Generate new key
    return this.generateKey(name)
  }

  /**
   * Check if a key needs rotation
   */
  needsRotation(keyId: string): boolean {
    const metadata = this.keyMetadata.get(keyId)
    if (!metadata)
      return false

    const age = Date.now() - metadata.createdAt
    return age >= this.rotationInterval
  }

  /**
   * Encrypt data using AES-256-GCM
   */
  encrypt(data: string, keyId: string): EncryptedData {
    const key = this.keys.get(keyId)
    if (!key) {
      throw new Error(`Key not found: ${keyId}`)
    }

    const iv = randomBytes(16)
    const cipher = createCipheriv('aes-256-gcm', key, iv)

    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    const authTag = cipher.getAuthTag()

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
    }
  }

  /**
   * Decrypt data using AES-256-GCM
   */
  decrypt(
    encrypted: string,
    keyId: string,
    iv: string,
    authTag: string,
  ): string {
    const key = this.keys.get(keyId)
    if (!key) {
      throw new Error(`Key not found: ${keyId}`)
    }

    const decipher = createDecipheriv(
      'aes-256-gcm',
      key,
      Buffer.from(iv, 'hex'),
    )

    decipher.setAuthTag(Buffer.from(authTag, 'hex'))

    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  }

  /**
   * Try decrypting with archived keys
   */
  tryDecryptWithArchived(
    encrypted: string,
    keyName: string,
    iv: string,
    authTag: string,
  ): string | null {
    const archived = this.archivedKeys.get(keyName)
    if (!archived)
      return null

    for (const key of archived) {
      try {
        const decipher = createDecipheriv(
          'aes-256-gcm',
          key,
          Buffer.from(iv, 'hex'),
        )

        decipher.setAuthTag(Buffer.from(authTag, 'hex'))

        let decrypted = decipher.update(encrypted, 'hex', 'utf8')
        decrypted += decipher.final('utf8')

        return decrypted
      }
      catch {
        // Try next archived key
        continue
      }
    }

    return null
  }

  /**
   * Get key information
   */
  getKeyInfo(keyId: string): KeyInfo | null {
    return this.keyMetadata.get(keyId) || null
  }

  /**
   * List all key IDs for a given key name
   */
  listKeys(name: string): string[] {
    const result: string[] = []
    for (const [keyId, metadata] of this.keyMetadata) {
      if (metadata.name === name) {
        result.push(keyId)
      }
    }
    return result.sort((a, b) => {
      const infoA = this.keyMetadata.get(a)!
      const infoB = this.keyMetadata.get(b)!
      return infoB.createdAt - infoA.createdAt // Newest first
    })
  }

  /**
   * Delete a key
   */
  deleteKey(keyId: string): boolean {
    const key = this.keys.get(keyId)
    if (!key)
      return false

    // Destroy the key material
    if (key.export) {
      key.export()
    }

    this.keys.delete(keyId)
    this.keyMetadata.delete(keyId)
    return true
  }

  /**
   * Get the number of active keys
   */
  get size(): number {
    return this.keys.size
  }

  /**
   * Clear all keys (use with caution)
   */
  clear(): void {
    for (const [keyId] of this.keys) {
      this.deleteKey(keyId)
    }
    this.archivedKeys.clear()
  }

  /**
   * Export key metadata (for backup/audit)
   */
  exportMetadata(): Record<string, KeyInfo> {
    const result: Record<string, KeyInfo> = {}
    for (const [keyId, metadata] of this.keyMetadata) {
      result[keyId] = { ...metadata }
    }
    return result
  }
}

/**
 * Default key manager instance
 */
export const defaultKeyManager = new KeyManager()
