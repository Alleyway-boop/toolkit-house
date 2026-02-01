/**
 * Rate Limiting for GraphQL API Gateway
 *
 * Uses Redis for distributed rate limiting with a sliding window algorithm.
 * Refactored to use type-safe helper functions, eliminating all
 * @ts-ignore comments and any types.
 *
 * @module redis-rate-limit
 */

import { createRule } from '../utils/shield-helpers'
import type { ShieldRule } from '../types/shield-types'
import type { Context } from '../context'
import Redis from 'ioredis'

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  /** Maximum number of requests allowed */
  maxRequests: number
  /** Time window in seconds */
  window: number
  /** Key prefix for Redis storage */
  keyPrefix?: string
}

/**
 * Rate limit check result
 */
export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean
  /** Number of requests remaining in the window */
  remaining: number
  /** When the rate limit window resets */
  resetAt: Date
}

// Redis client (will be initialized lazily)
let redisClient: Redis | null = null

/**
 * Initialize Redis connection
 *
 * Creates a Redis client with retry logic and error handling.
 * Subsequent calls return the existing client (singleton pattern).
 *
 * @param url - Redis connection URL (defaults to REDIS_URL env var or localhost)
 * @returns Redis client instance
 */
export function initRedis(url?: string): Redis {
  if (redisClient) {
    return redisClient
  }

  const redisUrl = url || process.env.REDIS_URL || 'redis://localhost:6379'
  redisClient = new Redis(redisUrl, {
    retryStrategy(times) {
      if (times > 3) {
        return null // Stop retrying after 3 attempts
      }
      return Math.min(times * 100, 2000) // Exponential backoff
    },
    maxRetriesPerRequest: 3,
  })

  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err)
  })

  redisClient.on('connect', () => {
    console.log('Redis Client Connected')
  })

  return redisClient
}

/**
 * Rate limit check using sliding window algorithm
 *
 * Uses Redis sorted sets to implement a sliding window rate limiter.
 * Each request is added as a member with the current timestamp as score.
 * Old entries outside the window are removed before counting.
 *
 * @param identifier - Unique identifier (user ID, IP, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit check result
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const redis = initRedis()
  const key = `${config.keyPrefix || 'ratelimit'}:${identifier}`
  const now = Date.now()
  const windowStart = now - config.window * 1000

  try {
    // Use Redis pipeline for atomic operations
    const pipeline = redis.pipeline()

    // Remove old entries outside the window
    pipeline.zremrangebyscore(key, 0, windowStart)

    // Count current requests in window
    pipeline.zcard(key)

    // Add current request (ioredis zadd syntax: score, member)
    const member = `${now}-${Math.random()}`
    pipeline.zadd(key, now, member)

    // Set expiration
    pipeline.expire(key, config.window + 1)

    const results = await pipeline.exec()

    if (!results || results[1][1] === null) {
      // Redis error, return allowed as fallback (fail open)
      return {
        allowed: true,
        remaining: config.maxRequests,
        resetAt: new Date(now + config.window * 1000),
      }
    }

    const currentCount = results[1][1] as number
    const remaining = Math.max(0, config.maxRequests - currentCount)
    const allowed = currentCount < config.maxRequests

    return {
      allowed,
      remaining,
      resetAt: new Date(now + config.window * 1000),
    }
  } catch (error) {
    console.error('Rate limit check error:', error)
    // On Redis error, allow the request (fail open)
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetAt: new Date(now + config.window * 1000),
    }
  }
}

/**
 * Create a Shield rule for rate limiting
 *
 * Wraps the rate limit check in a graphql-shield rule format.
 * Throws an error if the rate limit is exceeded.
 *
 * @param config - Rate limit configuration
 * @returns Shield rule for use in permission trees
 */
export function createRateLimitRule(config: RateLimitConfig): ShieldRule {
  return createRule({ cache: 'contextual' })(async (_parent: unknown, _args: unknown, ctx: Context, _info: unknown) => {
    // Get identifier from context (user ID or IP)
    const identifier = ctx.user?.userId || ctx.ip || 'anonymous'

    const result = await checkRateLimit(identifier, config)

    if (!result.allowed) {
      throw new Error(
        `Rate limit exceeded. Try again in ${Math.ceil((result.resetAt.getTime() - Date.now()) / 1000)} seconds.`
      )
    }

    // Set rate limit headers in response
    if (ctx.response) {
      ctx.response.setHeader('X-RateLimit-Remaining', String(result.remaining))
      ctx.response.setHeader('X-RateLimit-Reset', result.resetAt.toISOString())
    }

    return true
  })
}

/**
 * Predefined rate limit rules for common use cases
 *
 * These rules can be directly used in shield permission trees.
 */
export const rateLimitRules: Record<string, ShieldRule> = {
  /** Strict rate limit for mutations (10 requests/minute) */
  strict: createRateLimitRule({
    maxRequests: 10,
    window: 60,
    keyPrefix: 'strict',
  }),

  /** Regular rate limit for queries (100 requests/minute) */
  regular: createRateLimitRule({
    maxRequests: 100,
    window: 60,
    keyPrefix: 'regular',
  }),

  /** Lenient rate limit for public endpoints (1000 requests/hour) */
  lenient: createRateLimitRule({
    maxRequests: 1000,
    window: 3600,
    keyPrefix: 'lenient',
  }),

  /** Admin rate limit with higher allowance (1000 requests/minute) */
  admin: createRateLimitRule({
    maxRequests: 1000,
    window: 60,
    keyPrefix: 'admin',
  }),
}

/**
 * Get rate limit status for a user
 *
 * Returns detailed rate limit information including usage stats.
 *
 * @param identifier - Unique identifier (user ID, IP, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit status with usage statistics
 */
export async function getRateLimitStatus(
  identifier: string,
  config: RateLimitConfig
): Promise<{ used: number; remaining: number; reset: Date }> {
  const result = await checkRateLimit(identifier, config)

  return {
    used: config.maxRequests - result.remaining,
    remaining: result.remaining,
    reset: result.resetAt,
  }
}

/**
 * Reset rate limit for a user (admin only)
 *
 * Clears the rate limit data for a specific identifier.
 * Useful for customer support or manual intervention.
 *
 * @param identifier - Unique identifier to reset
 * @param keyPrefix - Key prefix for Redis storage (defaults to 'ratelimit')
 */
export async function resetRateLimit(identifier: string, keyPrefix = 'ratelimit'): Promise<void> {
  const redis = initRedis()
  const key = `${keyPrefix}:${identifier}`
  await redis.del(key)
}
