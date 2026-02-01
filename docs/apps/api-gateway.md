# API Gateway

GraphQL API Gateway built with graphql-yoga.

## Overview

The API Gateway provides:
- GraphQL schema and resolvers
- JWT authentication with graphql-shield authorization
- Redis-based rate limiting
- DataLoader for N+1 query prevention
- WebSocket subscriptions with PubSub
- Integration with server-go REST endpoints

## Features

### Authentication

JWT-based authentication with graphql-shield authorization:

```typescript
const isAuthenticated = createRule({ cache: 'contextual' })(
  async (_parent, _args, ctx: Context, _info) => {
    if (!ctx.user) return new Error('Authentication required')
    return true
  }
)
```

### Rate Limiting

Redis-based sliding window rate limiting:

```typescript
export function createRateLimitRule(config: RateLimitConfig): ShieldRule {
  return createRule({ cache: 'contextual' })(async (_parent, _args, ctx: Context) => {
    const identifier = ctx.user?.userId || ctx.ip || 'anonymous'
    const result = await checkRateLimit(identifier, config)
    if (!result.allowed) {
      throw new Error(`Rate limit exceeded`)
    }
    return true
  })
}
```

### Subscriptions

Real-time updates with WebSocket subscriptions:

```typescript
export const pubSub = createPubSub()

// Publish event
pubSub.publish('postCreated', { postCreated: post })

// Subscribe
const { data } = useSubscription(POST_CREATED_SUBSCRIPTION)
```

### Shield Permissions

Type-safe permission rules:

```typescript
const permissions = createShield({
  Query: {
    health: allow,
    getUser: isAuthenticated,
    getUsers: isAdmin,
  },
  Mutation: {
    login: allow,
    createPost: isAuthenticated,
  },
})
```

## Schema

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  createdAt: String!
}

type Post {
  id: ID!
  title: String!
  content: String!
  authorId: String!
  createdAt: String!
}

type AuthPayload {
  accessToken: String!
  refreshToken: String!
  user: User!
}

type Query {
  health: String!
  me: User
  getUsers: [User!]!
  getUser(id: ID!): User!
  getPosts(userId: ID!): [Post!]!
  rateLimit: RateLimitInfo!
}

type Mutation {
  login(email: String!, password: String!): AuthPayload!
  refreshToken(token: String!): AuthPayload!
  createUser(input: CreateUserInput!): User!
  createPost(input: CreatePostInput!): Post!
}

type Subscription {
  postCreated: Post!
  postUpdated: Post!
  postDeleted: ID!
}
```

## Installation

```bash
cd apps/api-gateway
pnpm install
```

## Development

```bash
pnpm run dev
```

Runs at `http://localhost:4000/graphql`

## Build

```bash
pnpm run build
pnpm run start
```

## Environment Variables

```bash
# .env
PORT=4000
NODE_ENV=development
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
```

## Architecture

**Source Code:** `/root/toolkit-house/apps/api-gateway/src/`

**Structure:**
```
src/
├── graphql/
│   ├── schema.ts        # GraphQL type definitions
│   └── resolvers.ts     # GraphQL resolvers
├── auth/
│   ├── jwt.ts           # JWT utilities
│   └── shield-rules.ts  # Permission rules
├── rate-limit/
│   └── redis-rate-limit.ts  # Rate limiting
├── datasources/
│   └── mock.ts          # Mock data sources
├── types/
│   └── shield-types.ts  # Type definitions
├── utils/
│   └── shield-helpers.ts    # Helper functions
├── context.ts           # GraphQL context
└── index.ts             # Entry point
```

## Technologies

- graphql-yoga
- graphql-shield
- graphql-tools
- Apollo Client
- Redis (ioredis)
- TypeScript

## License

MIT
