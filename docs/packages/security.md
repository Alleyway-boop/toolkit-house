---
title: "@toolkit-house/security"
description: Security utilities for Toolkit House - key management, encryption, and more
chineseTitle: "@toolkit-house/security"
chineseDescription: Toolkit House安全工具 - 密钥管理、加密等功能
---

# @toolkit-house/security

Security utilities for Toolkit House - key management, encryption, and more.

## Introduction

`@toolkit-house/security` is a comprehensive security utility library designed to provide essential security functions for modern applications. It includes secure key management, encryption/decryption utilities, password hashing, and other security-related helpers to help developers build secure applications.

### What It Does
- Manages cryptographic keys securely
- Provides encryption and decryption capabilities
- Handles password hashing and verification
- Generates secure random strings and tokens
- Validates and sanitizes input data
- Provides security-related utility functions

### When to Use It
- Applications needing secure data storage
- User authentication and password management
- Secure API token generation
- Data encryption at rest
- Input validation and sanitization
- Secure session management

## Installation

```bash
pnpm add @toolkit-house/security
```

## Quick Start

```typescript
import { SecurityUtils } from '@toolkit-house/security'

// Generate a secure random token
const token = SecurityUtils.generateSecureToken(32)
console.log('Secure token:', token)

// Hash a password
const password = 'my-secret-password'
const hashedPassword = await SecurityUtils.hashPassword(password)
console.log('Hashed password:', hashedPassword)

// Verify password
const isValid = await SecurityUtils.verifyPassword(password, hashedPassword)
console.log('Password valid:', isValid)

// Encrypt and decrypt data
const sensitiveData = { creditCard: '4111111111111111' }
const encrypted = SecurityUtils.encrypt(JSON.stringify(sensitiveData), 'secret-key')
const decrypted = SecurityUtils.decrypt(encrypted, 'secret-key')
console.log('Decrypted data:', JSON.parse(decrypted))
```

## Key Features

### 1. Key Management

```typescript
import { KeyManager } from '@toolkit-house/security'

// Create key manager
const keyManager = new KeyManager()

// Generate new key
const encryptionKey = await keyManager.generateKey('aes-256-gcm')
console.log('Key:', encryptionKey.key)
console.log('IV:', encryptionKey.iv)

// Store and retrieve keys
await keyManager.storeKey('my-app-key', encryptionKey)
const storedKey = await keyManager.retrieveKey('my-app-key')
console.log('Retrieved key:', storedKey)

// Delete key
await keyManager.deleteKey('my-app-key')
```

### 2. Encryption and Decryption

```typescript
import { SecurityUtils } from '@toolkit-house/security'

// AES-256-GCM encryption
const plaintext = 'Sensitive data that needs protection'
const key = SecurityUtils.generateSecureKey(32)

const encrypted = SecurityUtils.encrypt(plaintext, key)
console.log('Encrypted:', encrypted)

const decrypted = SecurityUtils.decrypt(encrypted, key)
console.log('Decrypted:', decrypted)

// Encrypt with password
const password = 'user-password'
const salt = SecurityUtils.generateSecureSalt()
const encryptedWithPassword = SecurityUtils.encryptWithPassword(
  plaintext,
  password,
  salt
)
```

### 3. Password Hashing

```typescript
import { SecurityUtils } from '@toolkit-house/security'

// Hash password with salt
async function hashUserPassword(password: string) {
  const salt = SecurityUtils.generateSecureSalt()
  const hashedPassword = await SecurityUtils.hashPassword(password, salt)
  return { hashedPassword, salt }
}

// Verify password
async function verifyUserPassword(
  password: string,
  hashedPassword: string,
  salt: string
) {
  const isValid = await SecurityUtils.verifyPassword(password, hashedPassword, salt)
  return isValid
}

// Usage
const password = 'user123'

const { hashedPassword, salt } = await hashUserPassword(password)
console.log('Hashed:', hashedPassword)

const isValid = await verifyUserPassword(password, hashedPassword, salt)
console.log('Valid:', isValid) // true
```

### 4. Token Generation

```typescript
import { SecurityUtils } from '@toolkit-house/security'

// Generate random tokens
const apiToken = SecurityUtils.generateSecureToken(64)
console.log('API Token:', apiToken)

// Generate JWT payload
const jwtPayload = {
  userId: '123',
  email: 'user@example.com',
  role: 'user',
  exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour
}

const jwtToken = SecurityUtils.signJWT(jwtPayload, 'secret-key')
console.log('JWT Token:', jwtToken)

// Verify JWT
const decoded = SecurityUtils.verifyJWT(jwtToken, 'secret-key')
console.log('Decoded JWT:', decoded)
```

### 5. Input Validation and Sanitization

```typescript
import { SecurityUtils } from '@toolkit-house/security'

// Sanitize user input
function sanitizeUserInput(input: string) {
  return SecurityUtils.sanitizeHTML(input) // Prevent XSS
}

// Validate email format
function isValidEmail(email: string) {
  return SecurityUtils.isValidEmail(email)
}

// Validate password strength
function checkPasswordStrength(password: string) {
  return SecurityUtils.checkPasswordStrength(password)
}

// Usage
const userInput = '<script>alert("xss")</script>'
const sanitized = sanitizeUserInput(userInput)
console.log('Sanitized:', sanitized)

const email = 'user@example.com'
console.log('Valid email:', isValidEmail(email))

const password = 'StrongP@ssw0rd!'
const strength = checkPasswordStrength(password)
console.log('Password strength:', strength) // { score: 5, feedback: 'Strong' }
```

### 6. Security Utilities

```typescript
import { SecurityUtils } from '@toolkit-house/security'

// Generate secure random values
const randomBytes = SecurityUtils.generateSecureBytes(16)
console.log('Random bytes:', randomBytes)

const randomString = SecurityUtils.generateSecureString(32)
console.log('Random string:', randomString)

// Check if data has been tampered with
function verifyDataIntegrity(data: string, signature: string) {
  return SecurityUtils.verifySignature(data, signature)
}

// Generate signature
const data = 'Important message'
const signature = SecurityUtils.signData(data, 'secret-key')
const isValid = verifyDataIntegrity(data, signature)
console.log('Signature valid:', isValid)
```

## Common Use Cases

### 1. User Authentication System

```typescript
import { SecurityUtils } from '@toolkit-house/security'

class AuthenticationService {
  async registerUser(userData: { email: string; password: string }) {
    // Check password strength
    const strength = SecurityUtils.checkPasswordStrength(userData.password)
    if (strength.score < 3) {
      throw new Error('Password is too weak')
    }

    // Hash password
    const salt = SecurityUtils.generateSecureSalt()
    const hashedPassword = await SecurityUtils.hashPassword(userData.password, salt)

    // Store user with hashed password and salt
    const user = await this.createUser({
      email: userData.email,
      passwordHash: hashedPassword,
      salt: salt
    })

    return user
  }

  async authenticateUser(email: string, password: string) {
    // Get user by email
    const user = await this.getUserByEmail(email)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    // Verify password
    const isValid = await SecurityUtils.verifyPassword(
      password,
      user.passwordHash,
      user.salt
    )

    if (!isValid) {
      throw new Error('Invalid credentials')
    }

    // Generate session token
    const sessionToken = SecurityUtils.generateSecureToken(32)
    await this.createSession(user.id, sessionToken)

    return {
      user,
      sessionToken
    }
  }

  logoutUser(sessionToken: string) {
    return this.invalidateSession(sessionToken)
  }
}
```

### 2. Secure Data Storage

```typescript
import { SecurityUtils, KeyManager } from '@toolkit-house/security'

class SecureDataStorage {
  private keyManager: KeyManager
  private encryptionKey: string

  constructor() {
    this.keyManager = new KeyManager()
    this.encryptionKey = this.getOrCreateEncryptionKey()
  }

  private async getOrCreateEncryptionKey() {
    try {
      const key = await this.keyManager.retrieveKey('data-encryption')
      if (key) return key
    } catch {
      // Key doesn't exist, create new one
      const newKey = await this.keyManager.generateKey('aes-256-gcm')
      await this.keyManager.storeKey('data-encryption', newKey)
      return newKey
    }
  }

  async storeSensitiveData(id: string, data: any) {
    // Encrypt data
    const plaintext = JSON.stringify(data)
    const encrypted = SecurityUtils.encrypt(plaintext, this.encryptionKey)

    // Store encrypted data
    await this.storeEncrypted(id, encrypted)
  }

  async retrieveSensitiveData(id: string) {
    // Get encrypted data
    const encrypted = await this.getEncrypted(id)
    if (!encrypted) return null

    // Decrypt data
    const plaintext = SecurityUtils.decrypt(encrypted, this.encryptionKey)
    return JSON.parse(plaintext)
  }
}

// Usage
const storage = new SecureDataStorage()

await storage.storeSensitiveData('user-123', {
  ssn: '123-45-6789',
  creditCard: '4111111111111111'
})

const data = await storage.retrieveSensitiveData('user-123')
console.log('Retrieved data:', data)
```

### 3. API Security Middleware

```typescript
import { SecurityUtils } from '@toolkit-house/security'

function createSecurityMiddleware() {
  return async (req: Request, res: Response, next: Function) => {
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

    // Rate limiting
    const clientId = req.ip || req.headers['x-forwarded-for']
    if (!SecurityUtils.rateLimitCheck(clientId)) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: 60
      })
    }

    // Validate CSRF token for state-changing methods
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
      const csrfToken = req.headers['x-csrf-token']
      if (!csrfToken || !SecurityUtils.verifyCSRFToken(csrfToken)) {
        return res.status(403).json({
          error: 'Invalid CSRF token'
        })
      }
    }

    // Sanitize input data
    if (req.body) {
      req.body = SecurityUtils.sanitizeJSON(req.body)
    }

    next()
  }
}

// API key authentication
function apiKeyAuth(req: Request, res: Response, next: Function) {
  const apiKey = req.headers['x-api-key']
  if (!apiKey || !SecurityUtils.validateAPIKey(apiKey)) {
    return res.status(401).json({
      error: 'Invalid API key'
    })
  }

  // Add user info to request
  const userInfo = SecurityUtils.getUserInfoFromAPIKey(apiKey)
  req.user = userInfo

  next()
}
```

### 4. Session Management

```typescript
import { SecurityUtils } from '@toolkit-house/security'

class SessionManager {
  private sessions = new Map<string, SessionData>()

  createSession(userId: string) {
    // Create secure session ID
    const sessionId = SecurityUtils.generateSecureToken(32)

    // Create session data
    const session: SessionData = {
      id: sessionId,
      userId,
      createdAt: new Date(),
      lastAccessed: new Date(),
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent()
    }

    // Store session
    this.sessions.set(sessionId, session)

    // Create secure cookie
    this.setSecureCookie('sessionId', sessionId)

    return session
  }

  getSession(sessionId: string) {
    const session = this.sessions.get(sessionId)

    if (!session) {
      throw new Error('Session not found')
    }

    // Check if session is expired
    if (new Date() > session.expiresAt) {
      this.sessions.delete(sessionId)
      throw new Error('Session expired')
    }

    // Update last accessed time
    session.lastAccessed = new Date()
    this.sessions.set(sessionId, session)

    return session
  }

  deleteSession(sessionId: string) {
    this.sessions.delete(sessionId)
    this.clearCookie('sessionId')
  }

  rotateSession(sessionId: string) {
    const session = this.getSession(sessionId)

    // Create new session ID
    const newSessionId = SecurityUtils.generateSecureToken(32)

    // Update session
    session.id = newSessionId
    session.lastAccessed = new Date()

    // Store new session
    this.sessions.set(newSessionId, session)

    // Delete old session
    this.sessions.delete(sessionId)

    // Update cookie
    this.setSecureCookie('sessionId', newSessionId)

    return newSessionId
  }
}
```

## API Reference

### Classes

- `SecurityUtils` - Main security utility class
- `KeyManager` - Key management utilities
- `PasswordHasher` - Password hashing utilities

### Key Methods

#### SecurityUtils
- `generateSecureToken(length)` - Generate secure random token
- `generateSecureKey(length)` - Generate encryption key
- `generateSecureSalt()` - Generate password salt
- `hashPassword(password, salt)` - Hash password
- `verifyPassword(password, hash, salt)` - Verify password
- `encrypt(data, key)` - Encrypt data
- `decrypt(encrypted, key)` - Decrypt data
- `signJWT(payload, secret)` - Sign JWT token
- `verifyJWT(token, secret)` - Verify JWT token
- `sanitizeHTML(input)` - Sanitize HTML input
- `isValidEmail(email)` - Validate email format
- `checkPasswordStrength(password)` - Check password strength

### Security Best Practices

1. **Always hash passwords** using strong algorithms like bcrypt
2. **Use HTTPS** for all communications
3. **Implement rate limiting** to prevent brute force attacks
4. **Sanitize all user input** to prevent XSS attacks
5. **Use secure session management** with proper expiration
6. **Store sensitive data encrypted** at rest
7. **Validate all inputs** on both client and server
8. **Implement proper error handling** that doesn't leak sensitive information

## Development

```bash
# Navigate to package directory
cd packages/security

# Build the package
pnpm run build

# Run tests
pnpm run test

# Run type checking
pnpm run typecheck
```

## License

MIT