# @toolkit-house/api-gateway

GraphQL API Gateway for the Toolkit House monorepo, providing a centralized entry point with authentication, authorization, rate limiting, and real-time subscriptions.

## Features

- 🚀 **GraphQL Server** - Built with GraphQL Yoga for high performance
- 🔐 **JWT Authentication** - Secure authentication with token refresh
- 🛡️ **Authorization** - Fine-grained permissions with GraphQL Shield
- 📊 **Rate Limiting** - Redis-based rate limiting to prevent abuse
- 🔄 **Real-time Subscriptions** - WebSocket support for live updates
- 📦 **DataLoader** - N+1 query prevention for efficient data fetching
- 🔌 **REST Integration** - Seamless integration with Go backend services

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/toolkit-house/toolkit-house.git
cd toolkit-house

# Install dependencies
pnpm install

# Start the development server
cd apps/api-gateway
pnpm run dev
```

### Running the Server

```bash
# Development mode with hot reload
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm run start
```

The server will be available at:
- **GraphQL Endpoint**: `http://localhost:4000/graphql`
- **GraphiQL Playground**: `http://localhost:4000/graphql`

## Configuration

### Environment Variables

```bash
# Server configuration
PORT=4000
NODE_ENV=development

# Redis configuration (for rate limiting)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT configuration
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173,http://localhost:5174
```

### Rate Limiting Configuration

The gateway uses Redis for rate limiting with the following default configuration:
- Maximum requests: 100 per minute
- Window size: 60 seconds
- Per-user tracking when authenticated

## API Documentation

### GraphQL Schema

The gateway exposes the following types and operations:

#### Core Types

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  createdAt: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  authorId: String!
  createdAt: String!
}

input CreateUserInput {
  name: String!
  email: String!
}

input CreatePostInput {
  title: String!
  content: String!
  authorId: ID!
}
```

#### Authentication Types

```graphql
type AuthPayload {
  accessToken: String!
  refreshToken: String!
  user: User!
}

type RateLimitInfo {
  used: Int!
  remaining: Int!
  reset: String!
}
```

#### Extended Operations

```graphql
# Queries
extend type Query {
  me: User           # Get current user profile
  rateLimit: RateLimitInfo!  # Get current rate limit status
}

# Mutations
extend type Mutation {
  login(email: String!, password: String!): AuthPayload!
  refreshToken(token: String!): AuthPayload!
}

# Subscriptions
type Subscription {
  postCreated: Post!
  postUpdated: Post!
  postDeleted: ID!
}
```

### GraphQL Operations

#### User Authentication

```graphql
# Login
mutation {
  login(email: "user@example.com", password: "password") {
    accessToken
    refreshToken
    user {
      id
      name
      email
    }
  }
}

# Refresh token
mutation {
  refreshToken(token: "refresh-token") {
    accessToken
    refreshToken
    user {
      id
      name
      email
    }
  }
}

# Get current user
query {
  me {
    id
    name
    email
    posts {
      id
      title
      content
      createdAt
    }
  }
}
```

#### Rate Limiting

```graphql
# Check rate limit status
query {
  rateLimit {
    used
    remaining
    reset
  }
}
```

#### Subscriptions

```graphql
# Subscribe to post events
subscription {
  postCreated {
    id
    title
    content
    authorId
    createdAt
  }
}
```

## Architecture

### Components

1. **GraphQL Yoga Server** - Main GraphQL server implementation
2. **GraphQL Shield** - Authorization middleware with fine-grained permissions
3. **JWT Authentication** - Token-based authentication system
4. **Redis Rate Limiter** - Distributed rate limiting
5. **DataLoader** - Batch loading for N+1 query prevention
6. **PubSub** - In-memory pub/sub for real-time subscriptions

### Authentication Flow

1. User sends login credentials
2. Server validates credentials against mock database
3. JWT tokens are generated (access + refresh)
4. User includes access token in subsequent requests
5. Refresh token is used to obtain new access tokens

### Authorization Rules

```javascript
const permissions = {
  Query: {
    health: allow,           // Public
    getUser: isAuthenticated, // Authenticated users
    getUsers: isAdmin,       // Admin only
    getPosts: allow,         // Public
    me: isAuthenticated,     // Authenticated users
    rateLimit: isAuthenticated, // Authenticated users
  },
  Mutation: {
    login: allow,           // Public
    refreshToken: allow,    // Public
    createUser: isAdmin,    // Admin only
    createPost: isAuthenticated, // Authenticated users
  },
  Subscription: {
    postCreated: isAuthenticated, // Authenticated users
    postUpdated: isAuthenticated, // Authenticated users
    postDeleted: isAuthenticated, // Authenticated users
  },
}
```

## Development

### Project Structure

```
api-gateway/
├── src/
│   ├── graphql/
│   │   ├── schema.ts      # GraphQL schema definitions
│   │   └── resolvers.ts   # Query/mutation resolvers
│   ├── auth/
│   │   ├── shield-rules.ts # Authorization rules
│   │   └── jwt.ts        # JWT utilities
│   ├── context.ts        # Request context creation
│   ├── rate-limit/
│   │   └── redis-rate-limit.ts # Rate limiting implementation
│   └── utils/
│       └── shield-helpers.ts # Shield helper functions
└── package.json
```

### Adding New Features

1. **Extend the Schema**: Update `src/graphql/schema.ts`
2. **Add Resolvers**: Update `src/graphql/resolvers.ts` or add new resolvers
3. **Update Authorization**: Modify permissions in `src/auth/shield-rules.ts`
4. **Add Rate Limiting**: Configure in `src/rate-limit/redis-rate-limit.ts`

### Testing

```bash
# Type checking
pnpm run typecheck

# Manual testing via GraphiQL
# Visit http://localhost:4000/graphql
```

## Integration with Services

### Go Backend Integration

The gateway is designed to integrate with the Go backend services:

```typescript
// Context includes data sources for service integration
interface Context {
  user: {
    userId: string;
    email: string;
    role: string;
  } | null;
  ip: string;
  dataSources: {
    users: UserService;
    posts: PostService;
    // Add more services as needed
  };
}
```

### REST to GraphQL

The gateway can serve as a GraphQL layer over REST APIs:

1. Use `@apollo/client` in frontend applications
2. Configure REST data sources in the context
3. Transform REST responses to GraphQL types

## Security Considerations

- JWT tokens are signed with a secret key
- Refresh tokens have longer expiration times
- Rate limiting prevents abuse and DDoS attacks
- CORS is configured for specific origins
- GraphQL Shield provides field-level authorization

## Performance Optimizations

- DataLoader batching for database queries
- Redis caching for frequently accessed data
- Subscription management for real-time updates
- Efficient query resolution with field-level caching

## Troubleshooting

### Common Issues

1. **Redis Connection Failed**
   - Ensure Redis is running on `localhost:6379`
   - Check Redis configuration in environment variables

2. **JWT Token Expired**
   - Use the refresh token endpoint to get new tokens
   - Update token expiration times in environment variables

3. **CORS Errors**
   - Check that the origin is in the allowed origins list
   - Verify that credentials are properly set

### Debug Mode

Set `NODE_ENV=development` for:
- Detailed error messages
- GraphiQL playground
- CORS enabled for all origins
- Verbose logging

## License

MIT - see [LICENSE](../../LICENSE) file for details.

## Related Packages

- [`@toolkit-house/ts-utils`](../packages/ts-utils) - TypeScript utility functions
- [`@toolkit-house/http-client`](../packages/http-client) - HTTP client with interceptors
- [`server-go`](../apps/server-go) - Go backend service integration