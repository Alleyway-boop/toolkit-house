/**
 * Type-safe Helper Functions for GraphQL Shield
 *
 * These wrappers provide type safety while working with graphql-shield,
 * eliminating the need for @ts-ignore comments and any types.
 *
 * @module shield-helpers
 */

import { rule, shield, and, or, not } from 'graphql-shield'
import type {
  TypedRuleFunction,
  TypedRuleCreator,
  TypedShield,
  ShieldRule,
  LogicalOperators,
} from '../types/shield-types'

/**
 * Type-safe rule creator
 *
 * Creates a shield rule with proper type inference for the Context parameter.
 *
 * @example
 * ```ts
 * export const isAuthenticated = createRule({ cache: 'contextual' })(
 *   async (_parent, _args, ctx, _info) => {
 *     if (!ctx.user) return new Error('Authentication required')
 *     return true
 *   }
 * )
 * ```
 *
 * @param options - Rule options for caching and fragments
 * @returns A function that accepts a rule function and returns a ShieldRule
 */
export const createRule: TypedRuleCreator = (options) => {
  return (fn: TypedRuleFunction) => rule(options)(fn as any)
}

/**
 * Type-safe shield middleware creator
 *
 * Creates a graphql-middleware generator with proper type safety.
 *
 * @example
 * ```ts
 * export const permissions = createShield({
 *   Query: {
 *     health: allow,
 *     getUser: isAuthenticated,
 *   },
 * }, {
 *   allowExternalErrors: true,
 *   fallbackRule: allow,
 * })
 * ```
 *
 * @param rules - Rule tree mapping GraphQL operations to rules
 * @param options - Shield middleware options
 * @returns A graphql-middleware generator
 */
export const createShield: TypedShield = (rules, options = {}) => {
  return shield(rules as any, options as any) as any
}

/**
 * Logical operators for combining shield rules
 *
 * Provides type-safe versions of shield's logical operators.
 *
 * @example
 * ```ts
 * import { createRule, logicalOperators } from './utils/shield-helpers'
 *
 * const isAdmin = createRule()(async (_parent, _args, ctx) => {
 *   return ctx.user?.role === 'admin'
 * })
 *
 * const isAuthenticated = createRule()(async (_parent, _args, ctx) => {
 *   return !!ctx.user
 * })
 *
 * // User must be authenticated AND (be admin OR be accessing own data)
 * const canAccess = logicalOperators.and(
 *   isAuthenticated,
 *   logicalOperators.or(isAdmin, isOwner)
 * )
 * ```
 */
export const logicalOperators: LogicalOperators = {
  and: (...rules: ShieldRule[]) => and(...rules),
  or: (...rules: ShieldRule[]) => or(...rules),
  not: (rule: ShieldRule) => not(rule),
}

/**
 * Allow rule helper - always permits access
 *
 * @example
 * ```ts
 * export const permissions = createShield({
 *   Query: {
 *     health: allow,  // Public access
 *     getUser: isAuthenticated,  // Authenticated only
 *   },
 * }, { fallbackRule: allow })
 * ```
 */
export const allow: ShieldRule = (() => true) as any

/**
 * Deny rule helper - always denies access
 *
 * @example
 * ```ts
 * export const permissions = createShield({
 *   Query: {
 *     adminEndpoint: deny,  // Always deny
 *   },
 * }, { fallbackRule: deny })
 * ```
 */
export const deny: ShieldRule = (() => false) as any
