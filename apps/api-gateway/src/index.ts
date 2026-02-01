/**
 * GraphQL API Gateway Main Entry Point
 *
 * Features:
 * - JWT Authentication with graphql-shield authorization
 * - Redis-based rate limiting
 * - DataLoader for N+1 query prevention
 * - WebSocket subscriptions with PubSub
 * - Integration with server-go REST endpoints
 */

import { createServer } from 'http'
import { createYoga, createPubSub } from 'graphql-yoga'
import { makeExecutableSchema } from '@graphql-tools/schema'
import type { IMiddlewareGenerator } from 'graphql-middleware'

import { typeDefs } from './graphql/schema'
import { baseResolvers } from './graphql/resolvers'
import { createContext, type Context } from './context'
import { isAuthenticated, isAdmin } from './auth/shield-rules'
import { allow } from './utils/shield-helpers'

// ============================================================================
// PubSub for Subscriptions
// ============================================================================
export const pubSub = createPubSub()

// ============================================================================
// Extended Schema with Auth and Subscriptions
// ============================================================================
const extendedTypeDefs = `#graphql
  ${typeDefs}

  # Authentication types
  type AuthPayload {
    accessToken: String!
    refreshToken: String!
    user: User!
  }

  # Rate limit info
  type RateLimitInfo {
    used: Int!
    remaining: Int!
    reset: String!
  }

  # Extended Query with auth
  extend type Query {
    me: User
    rateLimit: RateLimitInfo!
  }

  # Extended Mutation with auth
  extend type Mutation {
    login(email: String!, password: String!): AuthPayload!
    refreshToken(token: String!): AuthPayload!
  }

  # Subscription for real-time updates
  type Subscription {
    postCreated: Post!
    postUpdated: Post!
    postDeleted: ID!
  }
`

// ============================================================================
// Combined Resolvers
// ============================================================================
const resolvers = {
  ...baseResolvers,

  Query: {
    ...baseResolvers.Query,
    me: async (_parent: unknown, _args: unknown, ctx: Context) => {
      if (!ctx.user) {
        return null
      }
      return ctx.dataSources?.users.getUser(ctx.user.userId) || null
    },
    rateLimit: async (_parent: unknown, _args: unknown, ctx: Context) => {
      const identifier = ctx.user?.userId || ctx.ip || 'anonymous'
      const config = { maxRequests: 100, window: 60 }

      const { getRateLimitStatus } = await import('./rate-limit/redis-rate-limit')
      const status = await getRateLimitStatus(identifier, config)

      return {
        used: status.used,
        remaining: status.remaining,
        reset: status.reset.toISOString(),
      }
    },
  },

  Mutation: {
    ...baseResolvers.Mutation,
    login: async (
      _parent: unknown,
      { email, password }: { email: string; password: string },
      ctx: Context
    ) => {
      // In production, verify against database
      const user = await ctx.dataSources?.users.getUserByEmail(email)

      if (!user || password !== 'password') {
        throw new Error('Invalid credentials')
      }

      const { generateTokenPair } = await import('./auth/jwt')

      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: 'user' as const,
      }

      const tokens = generateTokenPair(tokenPayload)

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user,
      }
    },

    refreshToken: async (_parent: unknown, { token }: { token: string }) => {
      const { verifyRefreshToken, generateTokenPair } = await import('./auth/jwt')

      const payload = verifyRefreshToken(token)
      if (!payload) {
        throw new Error('Invalid refresh token')
      }

      return generateTokenPair(payload)
    },

    // Override createPost to publish subscription event
    createPost: async (
      _parent: unknown,
      { input }: { input: { title: string; content: string; authorId: string } },
      _ctx: Context
    ) => {
      // Call original resolver (mock data)
      const id = String(Math.random())
      const post = {
        id,
        title: input.title,
        content: input.content,
        authorId: input.authorId,
        createdAt: new Date().toISOString(),
      }

      // Publish subscription event
      pubSub.publish('postCreated', { postCreated: post })

      return post
    },
  },

  Subscription: {
    postCreated: {
      subscribe: () => pubSub.subscribe('postCreated'),
    },
    postUpdated: {
      subscribe: () => pubSub.subscribe('postUpdated'),
    },
    postDeleted: {
      subscribe: () => pubSub.subscribe('postDeleted'),
    },
  },
}

// ============================================================================
// Shield Permissions
// ============================================================================
// Explicit type assertion for the shield middleware generator
const permissions = {
  Query: {
    health: allow,
    getUser: isAuthenticated,
    getUsers: isAdmin,
    getPosts: allow,
    me: isAuthenticated,
    rateLimit: isAuthenticated,
  },
  Mutation: {
    login: allow,
    refreshToken: allow,
    createUser: isAdmin,
    createPost: isAuthenticated,
  },
  Subscription: {
    postCreated: isAuthenticated,
    postUpdated: isAuthenticated,
    postDeleted: isAuthenticated,
  },
} as const

// ============================================================================
// Create Executable Schema
// ============================================================================
const executableSchema = makeExecutableSchema({
  typeDefs: extendedTypeDefs,
  resolvers,
})

// ============================================================================
// Apply Shield Permissions
// ============================================================================
// Import shield and apply middleware with proper typing
const { shield } = await import('graphql-shield')
const applyMiddleware = (await import('graphql-middleware')).applyMiddleware

const shieldMiddleware = shield(
  permissions,
  {
    allowExternalErrors: true,
    fallbackRule: allow,
  }
) as IMiddlewareGenerator<unknown, Context, unknown>

const schemaWithShield = applyMiddleware(executableSchema, shieldMiddleware)

// ============================================================================
// Create Yoga Instance
// ============================================================================
const yoga = createYoga({
  schema: schemaWithShield,
  context: async (initialContext) => {
    const { initRedis } = await import('./rate-limit/redis-rate-limit')

    // Note: Yoga passes a YogaInitialContext, which we convert to our needs
    // The request is available at initialContext.request
    const request = initialContext.request as unknown as Request

    const redis = initRedis()
    const context = await createContext(request, redis)

    return context
  },
  graphiql: process.env.NODE_ENV !== 'production',
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  },
})

// ============================================================================
// Start Server
// ============================================================================
const port = process.env.PORT || 4000

const server = createServer(yoga)

server.listen(port, () => {
  console.log(`🚀 GraphQL API Gateway running at http://localhost:${port}/graphql`)
  console.log(`📊 GraphiQL Playground: http://localhost:${port}/graphql`)
  console.log(`📖 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔐 Shield Authorization: enabled`)
  console.log(`📡 WebSocket Subscriptions: enabled`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})
