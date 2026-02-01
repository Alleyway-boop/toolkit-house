# API Gateway

GraphQL API 网关，使用 graphql-yoga 构建。

## 功能

- JWT 认证
- Shield 授权
- Redis 限流
- WebSocket 订阅
- DataLoader N+1 查询优化

## Schema

```graphql
type Query {
  health: String!
  me: User
  getUsers: [User!]!
  getUser(id: ID!): User!
  getPosts(userId: ID!): [Post!]!
}

type Mutation {
  login(email: String!, password: String!): AuthPayload!
  createPost(input: CreatePostInput!): Post!
}

type Subscription {
  postCreated: Post!
}
```

## 开发

```bash
cd apps/api-gateway
pnpm run dev
# http://localhost:4000/graphql
```
