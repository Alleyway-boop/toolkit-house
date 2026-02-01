/**
 * GraphQL Shield Authorization Rules
 *
 * Provides permission-based access control using graphql-shield.
 * Refactored to use type-safe helper functions, eliminating all
 * @ts-ignore comments and any types.
 *
 * @module shield-rules
 */

import { createRule, createShield, logicalOperators, allow as allowHelper } from '../utils/shield-helpers'
import type { Context } from '../context'

/**
 * Authentication rule - requires valid JWT
 *
 * Checks if a valid user is present in the context (set by JWT middleware).
 * Returns an error if authentication is missing.
 */
export const isAuthenticated = createRule({ cache: 'contextual' })(
  async (_parent, _args, ctx: Context, _info) => {
    if (!ctx.user) {
      return new Error('Authentication required')
    }
    return true
  }
)

/**
 * Admin only rule
 *
 * Requires authentication AND admin role.
 */
export const isAdmin = createRule({ cache: 'contextual' })(
  async (_parent, _args, ctx: Context, _info) => {
    if (!ctx.user) {
      return new Error('Authentication required')
    }
    if (ctx.user.role !== 'admin') {
      return new Error('Admin access required')
    }
    return true
  }
)

/**
 * User or admin rule
 *
 * Requires authentication AND either user or admin role.
 */
export const isUserOrAdmin = createRule({ cache: 'contextual' })(
  async (_parent, _args, ctx: Context, _info) => {
    if (!ctx.user) {
      return new Error('Authentication required')
    }
    if (ctx.user.role !== 'user' && ctx.user.role !== 'admin') {
      return new Error('User access required')
    }
    return true
  }
)

/**
 * Resource ownership rule
 *
 * Checks if the authenticated user owns the resource being accessed.
 * Admins bypass ownership checks.
 */
export const isOwner = createRule({ cache: 'contextual' })(
  async (_parent, args: { userId?: string }, ctx: Context, _info) => {
    if (!ctx.user) {
      return new Error('Authentication required')
    }
    // Admins can access everything
    if (ctx.user.role === 'admin') {
      return true
    }
    // Check if user owns the resource
    if (args.userId && ctx.user.userId !== args.userId) {
      return new Error('You do not have permission to access this resource')
    }
    return true
  }
)

/**
 * Permission mapping for GraphQL fields
 *
 * Defines which rules apply to which GraphQL operations.
 * Uses logical operators to combine rules where needed.
 */
export const permissions = createShield({
  // Query permissions
  Query: {
    // Health check: authenticated users only
    health: logicalOperators.and(isAuthenticated, logicalOperators.or(isAdmin, isUserOrAdmin)),
    // Get specific user: must be authenticated and be the owner
    getUser: logicalOperators.and(isAuthenticated, isOwner),
    // List users: admin only
    getUsers: isAdmin,
    // List posts: any authenticated user
    getPosts: isAuthenticated,
    posts: logicalOperators.and(isAuthenticated, isUserOrAdmin),
    users: isAdmin,
  },

  // Mutation permissions
  Mutation: {
    // Create user: admin only
    createUser: isAdmin,
    // Create post: any authenticated user
    createPost: isAuthenticated,
    // Update user: must be authenticated and be the owner
    updateUser: logicalOperators.and(isAuthenticated, isOwner),
    // Delete user: admin only
    deleteUser: isAdmin,
    // Update post: must be authenticated and be the owner
    updatePost: logicalOperators.and(isAuthenticated, isOwner),
    // Delete post: must be authenticated and be the owner
    deletePost: logicalOperators.and(isAuthenticated, isOwner),
  },

  // Type-level permissions (field-level access control)
  User: {
    // Email field: admin only
    email: isAdmin,
    // Posts field: any authenticated user
    posts: isAuthenticated,
  },
  Post: {
    // Author field: any authenticated user
    author: isAuthenticated,
  },
}, {
  allowExternalErrors: true,
  fallbackRule: allowHelper,
})

// Re-export allow for use in other modules
export const allow = allowHelper

/**
 * Error masking configuration for production
 *
 * Maps internal error types to user-friendly messages.
 */
export const errorMasking = {
  AuthenticationError: 'Authentication required. Please log in.',
  ForbiddenError: 'You do not have permission to perform this action.',
}

/**
 * Custom error classes for authorization failures
 */
export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = 'Access forbidden') {
    super(message)
    this.name = 'ForbiddenError'
  }
}
