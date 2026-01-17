/**
 * GraphQL API Gateway Main Entry Point
 */

import { createServer } from 'http'
import { createSchema, createYoga } from 'graphql-yoga'
import { typeDefs } from './graphql/schema'
import { resolvers } from './graphql/resolvers'

const port = process.env.PORT || 4000

// Create GraphQL schema
const schema = createSchema({
  typeDefs,
  resolvers,
})

// Create Yoga instance (GraphQL server with built-in features)
const yoga = createYoga({
  schema,
  // GraphiQL interface for development
  graphiql: process.env.NODE_ENV !== 'production',
  // CORS
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  },
})

// Create HTTP server
const server = createServer(yoga)

server.listen(port, () => {
  console.log(`GraphQL API Gateway running at http://localhost:${port}/graphql`)
})
