/**
 * JWT Authentication Service
 */

export interface JwtPayload {
  userId: string
  email: string
  role: 'admin' | 'user' | 'guest'
  iat?: number
  exp?: number
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = 60 * 60 * 24 * 7 // 7 days
const JWT_REFRESH_EXPIRES_IN = 60 * 60 * 24 * 30 // 30 days

/**
 * Sign a JWT token
 */
export function signToken(payload: JwtPayload): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  }

  const now = Math.floor(Date.now() / 1000)
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + JWT_EXPIRES_IN,
  }

  // Encode header and payload
  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload))

  // Create signature
  const data = `${encodedHeader}.${encodedPayload}`
  const signature = hmacSha256(data, JWT_SECRET)
  const encodedSignature = base64UrlEncode(signature)

  return `${data}.${encodedSignature}`
}

/**
 * Verify a JWT token
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts

    // Verify signature
    const data = `${encodedHeader}.${encodedPayload}`
    const expectedSignature = hmacSha256(data, JWT_SECRET)
    const actualSignature = base64UrlDecode(encodedSignature)

    if (expectedSignature !== actualSignature) {
      return null
    }

    // Decode payload
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JwtPayload

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

/**
 * Generate a token pair (access + refresh)
 */
export function generateTokenPair(payload: JwtPayload): TokenPair {
  const accessToken = signToken(payload)
  const refreshToken = signToken({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + JWT_REFRESH_EXPIRES_IN,
  })

  return {
    accessToken,
    refreshToken,
    expiresIn: JWT_EXPIRES_IN,
  }
}

/**
 * Verify a refresh token (same as verifyToken but with longer expiration)
 */
export function verifyRefreshToken(token: string): JwtPayload | null {
  return verifyToken(token)
}

/**
 * Extract token from Authorization header
 */
export function extractToken(authHeader: string | null | undefined): string | null {
  if (!authHeader) {
    return null
  }

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }

  return parts[1]
}

/**
 * Base64 URL encode (replace + with -, / with _, remove = padding)
 */
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

/**
 * Base64 URL decode
 */
function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) {
    str += '='
  }
  return Buffer.from(str, 'base64').toString()
}

/**
 * HMAC SHA256
 */
function hmacSha256(data: string, secret: string): string {
  // This is a simplified implementation
  // In production, use the crypto module or a library
  const crypto = require('crypto')
  return crypto.createHmac('sha256', secret).update(data).digest('base64')
}
