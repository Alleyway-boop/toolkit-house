/**
 * GraphQL Shield Type Definitions
 *
 * Provides type-safe wrappers around graphql-shield to eliminate
 * the need for @ts-ignore comments and any types.
 *
 * @see https://github.com/maticzav/graphql-shield
 */

import type { Context } from '../context'

// Define types locally based on graphql-shield's internal structure
// This avoids issues with graphql-shield's type exports

/**
 * Shield rule result type
 */
export type ShieldRuleResult = boolean | string | Error

/**
 * Shield rule function signature (original from graphql-shield)
 */
export type IRuleFunction = (
  parent: any,
  args: any,
  ctx: any,
  info: import('graphql').GraphQLResolveInfo
) => ShieldRuleResult | Promise<ShieldRuleResult>

/**
 * Cache strategy for shield rules
 */
export type ShieldCache = 'strict' | 'contextual' | 'no_cache'

/**
 * Shield rule - opaque type from graphql-shield
 */
export type ShieldRule = any

/**
 * Rule field map for type-level permissions
 */
export type IRuleFieldMap = Record<string, ShieldRule>

/**
 * Rule type map for GraphQL operations
 */
export type IRuleTypeMap = Record<string, ShieldRule | IRuleFieldMap>

/**
 * Rules type for shield
 */
export type IRules = ShieldRule | IRuleTypeMap

/**
 * Typed rule function signature
 *
 * This matches the signature expected by graphql-shield's rule function,
 * but with our typed Context parameter instead of `any`.
 */
export type TypedRuleFunction = (
  parent: unknown,
  args: Record<string, unknown>,
  ctx: Context,
  info: import('graphql').GraphQLResolveInfo
) => ShieldRuleResult | Promise<ShieldRuleResult>

/**
 * Options for creating shield rules
 */
export interface RuleOptions {
  /** Cache strategy for the rule result */
  cache?: ShieldCache
  /** GraphQL fragment for field-level caching */
  fragment?: string
}

/**
 * Type-safe rule creator function signature
 *
 * This matches the return type of graphql-shield's `rule()` function,
 * but ensures the rule function receives our typed Context.
 */
export interface TypedRuleCreator {
  (options?: RuleOptions): (fn: TypedRuleFunction) => ShieldRule
}

/**
 * Options for the shield middleware
 */
export interface ShieldOptions {
  /** Allow external errors to pass through */
  allowExternalErrors?: boolean
  /** Enable debug mode for rule tracing */
  debug?: boolean
  /** Default rule when no rule is specified */
  fallbackRule?: ShieldRule
}

/**
 * Type-safe shield function signature
 *
 * This matches the signature of graphql-shield's `shield()` function,
 * ensuring proper typing for our rule tree.
 */
export interface TypedShield {
  <T = IRules>(
    rules: T,
    options?: ShieldOptions
  ): import('graphql-middleware').IMiddlewareGenerator<unknown, Context, unknown>
}

/**
 * Logical operator types for combining rules
 */
export interface LogicalOperators {
  /** All rules must pass */
  and: (...rules: ShieldRule[]) => ShieldRule
  /** At least one rule must pass */
  or: (...rules: ShieldRule[]) => ShieldRule
  /** Rule must not pass */
  not: (rule: ShieldRule) => ShieldRule
}
