/**
 * GraphQL Schema for API Gateway
 */

export const typeDefs = `#graphql
  type Query {
    health: String
    getUser(id: ID!): User
    getUsers: [User!]!
    getPosts(userId: ID!): [Post!]!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    createPost(input: CreatePostInput!): Post!
  }

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
`
