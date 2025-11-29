/**
 * Conditional type utilities for type guards, filtering, and conditional logic
 */

// MARKER: Basic Conditional Types

/**
 * If-Then-Else conditional type
 */
export type If<C extends boolean, T, F> = C extends true ? T : F;

/**
 * Not operator for boolean types
 */
export type Not<T extends boolean> = T extends true ? false : true;

/**
 * And operator for boolean types
 */
export type And<A extends boolean, B extends boolean> = A extends true
  ? B extends true
    ? true
    : false
  : false;

/**
 * Or operator for boolean types
 */
export type Or<A extends boolean, B extends boolean> = A extends true
  ? true
  : B extends true
  ? true
  : false;

/**
 * Xor operator for boolean types
 */
export type Xor<A extends boolean, B extends boolean> = And<Or<A, B>, Not<And<A, B>>>;

/**
 * Nand operator for boolean types
 */
export type Nand<A extends boolean, B extends boolean> = Not<And<A, B>>;

// MARKER: Type Guard Utilities

/**
 * Check if type extends another type
 */
export type Extends<T, U> = T extends U ? true : false;

/**
 * Check if type is exactly equal to another type
 */
export type Equals<T, U> = [T] extends [U] ? [U] extends [T] ? true : false : false;

/**
 * Check if type is never
 */
export type IsNever<T> = [T] extends [never] ? true : false;

/**
 * Check if type is unknown
 */
export type IsUnknown<T> = [unknown] extends [T] ? [T] extends [unknown] ? true : false : false;

/**
 * Check if type is any
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;

/**
 * Check if type is assignable to another type
 */
export type IsAssignable<T, U> = T extends U ? true : false;

/**
 * Check if type contains specific property
 */
export type HasProperty<T, K extends PropertyKey> = K extends keyof T ? true : false;

/**
 * Check if type has specific method
 */
export type HasMethod<T, K extends PropertyKey> = K extends keyof T
  ? T[K] extends Function
    ? true
    : false
  : false;

// MARKER: Type Filtering and Selection

/**
 * Filter union by condition
 */
export type FilterUnion<T, C> = T extends C ? T : never;

/**
 * Exclude types from union
 */
export type ExcludeUnion<T, C> = T extends C ? never : T;

/**
 * Filter union to only primitive types
 */
export type FilterPrimitives<T> = FilterUnion<T, string | number | boolean | bigint | symbol>;

/**
 * Filter union to only object types
 */
export type FilterObjects<T> = ExcludeUnion<T, string | number | boolean | bigint | symbol | undefined | null>;

/**
 * Filter union to only function types
 */
export type FilterFunctions<T> = FilterUnion<T, Function>;

/**
 * Filter union to only array types
 */
export type FilterArrays<T> = FilterUnion<T, readonly unknown[]>;

/**
 * Filter union to only promise types
 */
export type FilterPromises<T> = FilterUnion<T, Promise<any>>;

/**
 * Get largest type in union (by type precedence)
 */
export type Largest<T> = T extends any ? (any extends T ? T : never) : never;

/**
 * Get smallest type in union (by type precedence)
 */
export type Smallest<T> = T;

// MARKER: Conditional Object Types

/**
 * Make properties optional based on condition
 */
export type OptionalIf<T, C extends boolean> = C extends true ? Partial<T> : T;

/**
 * Make properties readonly based on condition
 */
export type ReadonlyIf<T, C extends boolean> = C extends true ? Readonly<T> : T;

/**
 * Add property conditionally
 */
export type AddPropertyIf<T, K extends PropertyKey, V, C extends boolean> = C extends true
  ? T & { [P in K]: V }
  : T;

/**
 * Remove property conditionally
 */
export type RemovePropertyIf<T, K extends keyof T, C extends boolean> = C extends true ? Omit<T, K> : T;

/**
 * Merge objects conditionally
 */
export type MergeIf<T, U, C extends boolean> = C extends true ? MergeObjects<T, U> : T;

/**
 * Pick properties conditionally based on value type
 */
export type PickIf<T, V, C extends boolean> = C extends true ? PickByValue<T, V> : T;

/**
 * Omit properties conditionally based on value type
 */
export type OmitIf<T, V, C extends boolean> = C extends true ? OmitByValue<T, V> : T;

// MARKER: Conditional Array Types

/**
 * Filter array elements by type
 */
export type FilterArray<T, U> = T extends readonly (infer E)[] ? E extends U ? E[] : [] : [];

/**
 * Map array elements to new type
 */
export type MapArray<T, U> = T extends readonly unknown[] ? U[] : [];

/**
 * Conditional array length checks
 */
export type IsEmptyArray<T extends readonly unknown[]> = T['length'] extends 0 ? true : false;

/**
 * Check if array has exactly N elements
 */
export type HasLength<T extends readonly unknown[], N extends number> = T['length'] extends N ? true : false;

/**
 * Check if array has at least N elements
 */
export type HasMinLength<T extends readonly unknown[], N extends number> = T['length'] extends N
  ? true
  : T['length'] extends infer L
  ? L extends number
    ? L extends N
      ? true
      : N extends 0
      ? true
      : false
    : false
  : false;

/**
 * Check if array has at most N elements
 */
export type HasMaxLength<T extends readonly unknown[], N extends number> = T['length'] extends N
  ? true
  : T['length'] extends infer L
  ? L extends number
    ? L extends N
      ? true
      : L extends 0
      ? true
      : false
    : false
  : false;

// MARKER: Conditional Function Types

/**
 * Add parameter conditionally
 */
export type AddParameterIf<T extends (...args: any[]) => any, P extends any[], C extends boolean> = C extends true
  ? (...args: [...Parameters<T>, ...P]) => ReturnType<T>
  : T;

/**
 * Remove parameter conditionally
 */
export type RemoveParameterIf<T extends (...args: any[]) => any, C extends boolean> = C extends true
  ? RemoveLastParameter<T>
  : T;

/**
 * Make async conditionally
 */
export type AsyncIf<T extends (...args: any[]) => any, C extends boolean> = C extends true ? Asyncify<T> : T;

/**
 * Change return type conditionally
 */
export type ChangeReturnIf<T extends (...args: any[]) => any, R, C extends boolean> = C extends true
  ? ChangeReturnType<T, R>
  : T;

// MARKER: Type Level Predicates

/**
 * Type-level predicate for checking if type is nullable
 */
export type IsNullable<T> = null extends T ? (undefined extends T ? true : false) : undefined extends T ? true : false;

/**
 * Type-level predicate for checking if type is void
 */
export type IsVoid<T> = T extends void ? true : false;

/**
 * Type-level predicate for checking if type is optional
 */
export type IsOptional<T, K extends keyof T> = {} extends Pick<T, K> ? true : false;

/**
 * Type-level predicate for checking if type is readonly
 */
export type IsReadonly<T, K extends keyof T> = Extract<{ [P in K]: T[P] }, { [P in K]: T[P] }> extends {
  -readonly [P in K]: T[P];
}
  ? false
  : true;

/**
 * Type-level predicate for checking if union contains type
 */
export type UnionContains<T, U> = T extends U ? true : U extends T ? true : false;

/**
 * Type-level predicate for checking if two unions overlap
 */
export type UnionsOverlap<T, U> = [T] extends [never]
  ? false
  : T extends U
  ? true
  : false;

// MARKER: Advanced Conditional Types

/**
 * Conditional type with fallback
 */
export type WithFallback<T, F> = T extends never ? F : T;

/**
 * Default value for type
 */
export type WithDefault<T, D> = T extends never ? D : T;

/**
 * Try-catch conditional type
 */
export type Try<T, Fallback = never> = T extends never ? Fallback : T;

/**
 * Safe conditional type (prevents infinite recursion)
 */
export type Safe<T> = [T] extends [never] ? never : T;

/**
 * Conditional type that preserves union distribution
 */
export type Distributive<T, U> = T extends any ? (T extends U ? T : never) : never;

// MARKER: Helper Types

/**
 * Merge two objects
 */
type MergeObjects<T, U> = Omit<T, keyof U> & U;

/**
 * Pick by value type
 */
type PickByValue<T, V> = Pick<T, { [K in keyof T]: T[K] extends V ? K : never }[keyof T]>;

/**
 * Omit by value type
 */
type OmitByValue<T, V> = Pick<T, { [K in keyof T]: T[K] extends V ? never : K }[keyof T]>;

/**
 * Remove last parameter from function
 */
type RemoveLastParameter<T extends (...args: any[]) => any> = Parameters<T> extends [...any, infer L]
  ? T extends (...args: [...infer P, L]) => infer R
    ? (...args: P) => R
    : T
  : T;

/**
 * Convert function to async
 */
type Asyncify<T extends (...args: any[]) => any> = (...args: Parameters<T>) => Promise<ReturnType<T>>;

/**
 * Change return type of function
 */
type ChangeReturnType<T extends (...args: any[]) => any, R> = (...args: Parameters<T>) => R;


