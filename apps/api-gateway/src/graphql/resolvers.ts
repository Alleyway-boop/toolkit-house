/**
 * GraphQL Resolvers for API Gateway
 */

interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

interface Post {
  id: string
  title: string
  content: string
  authorId: string
  createdAt: string
}

interface CreateUserInput {
  name: string
  email: string
}

interface CreatePostInput {
  title: string
  content: string
  authorId: string
}

// Mock data store
const users: Map<string, User> = new Map()
const posts: Map<string, Post> = new Map()

// Initialize with some mock data
users.set('1', {
  id: '1',
  name: 'Alice',
  email: 'alice@example.com',
  createdAt: new Date().toISOString(),
})

posts.set('1', {
  id: '1',
  title: 'First Post',
  content: 'This is my first post',
  authorId: '1',
  createdAt: new Date().toISOString(),
})

export const baseResolvers = {
  Query: {
    health: () => 'OK',
    getUser: (_: unknown, { id }: { id: string }) => {
      return users.get(id) || null
    },
    getUsers: () => {
      return Array.from(users.values())
    },
    getPosts: (_: unknown, { userId }: { userId: string }) => {
      return Array.from(posts.values()).filter(post => post.authorId === userId)
    },
  },

  Mutation: {
    createUser: (_: unknown, { input }: { input: CreateUserInput }) => {
      const id = String(users.size + 1)
      const user: User = {
        id,
        name: input.name,
        email: input.email,
        createdAt: new Date().toISOString(),
      }
      users.set(id, user)
      return user
    },
    createPost: (_: unknown, { input }: { input: CreatePostInput }) => {
      const id = String(posts.size + 1)
      const post: Post = {
        id,
        title: input.title,
        content: input.content,
        authorId: input.authorId,
        createdAt: new Date().toISOString(),
      }
      posts.set(id, post)
      return post
    },
  },

  User: {
    posts: (user: User) => {
      return Array.from(posts.values()).filter(post => post.authorId === user.id)
    },
  },
}
