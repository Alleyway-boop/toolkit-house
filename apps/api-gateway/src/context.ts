/**
 * GraphQL Context - passed to all resolvers
 */

import type { JwtPayload } from './auth/jwt'
import { Redis } from 'ioredis'

// Import data source classes for typing
import { PostDataSource } from './datasources/post-datasource'
import { UserDataSource } from './datasources/user-datasource'

export interface Context {
  // User info from JWT
  user?: JwtPayload

  // Request info
  ip?: string
  userAgent?: string

  // Response object for setting headers
  response?: {
    setHeader: (name: string, value: string) => void
  }

  // Data sources
  dataSources?: {
    posts: PostDataSource
    users: UserDataSource
  }

  // Redis client
  redis?: Redis

  // WebSocket pubsub for subscriptions
  pubsub?: {
    publish: (channel: string, message: unknown) => void
    subscribe: (channel: string, callback: (message: unknown) => void) => () => void
  }
}

/**
 * Create context from request
 */
export async function createContext(
  request: Request,
  redis?: Redis
): Promise<Context> {
  // Extract IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'

  // Extract user agent
  const userAgent = request.headers.get('user-agent') || 'unknown'

  // Extract and verify JWT
  let user: JwtPayload | undefined
  const authHeader = request.headers.get('authorization')

  if (authHeader) {
    const { verifyToken } = await import('./auth/jwt')
    const token = authHeader.replace('Bearer ', '')
    user = verifyToken(token) || undefined
  }

  // Create response object for headers
  // Note: For Yoga, headers are handled differently
  // This is included for compatibility
  const response = {
    setHeader: (_name: string, _value: string) => {
      // Headers are managed by Yoga
    },
  }

  // Create data sources
  const { PostDataSource, UserDataSource } = await import('./datasources')
  const dataSources = {
    posts: new PostDataSource(),
    users: new UserDataSource(),
  }

  return {
    user,
    ip,
    userAgent,
    response,
    dataSources,
    redis,
  }
}
