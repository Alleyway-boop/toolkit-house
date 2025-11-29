/**
 * Function type utilities
 */

// MARKER: Parameter and Return Type Utilities

/**
 * Extract parameters type from function
 */
export type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

/**
 * Extract return type from function
 */
export type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : never;

/**
 * Extract first parameter type
 */
export type FirstParameter<T extends (...args: any) => any> = Parameters<T>[0];

/**
 * Extract last parameter type
 */
export type LastParameter<T extends (...args: any) => any> = Parameters<T> extends [...any, infer L] ? L : never;

/**
 * Extract parameters except first one
 */
export type RestParameters<T extends (...args: any) => any> = Parameters<T> extends [any, ...infer R] ? R : [];

/**
 * Extract parameters except last one
 */
export type InitialParameters<T extends (...args: any) => any> = Parameters<T> extends [...infer I, any] ? I : [];

/**
 * Get parameter count
 */
export type ParameterCount<T extends (...args: any) => any> = Parameters<T>['length'];

// MARKER: Function Modification Utilities

/**
 * Add optional parameter to function
 */
export type AddOptionalParameter<
  T extends (...args: any[]) => any,
  P extends any[]
> = (...args: [...Parameters<T>, ...P]) => ReturnType<T>;

/**
 * Add required parameter to function
 */
export type AddRequiredParameter<
  T extends (...args: any[]) => any,
  P extends any[]
> = (...args: [...Parameters<T>, ...P]) => ReturnType<T>;

/**
 * Remove last parameter from function
 */
export type RemoveLastParameter<T extends (...args: any[]) => any> = Parameters<T> extends [...infer P, any]
  ? (...args: P) => ReturnType<T>
  : T;

/**
 * Remove first parameter from function
 */
export type RemoveFirstParameter<T extends (...args: any[]) => any> = Parameters<T> extends [any, ...infer P]
  ? (...args: P) => ReturnType<T>
  : T;

/**
 * Change return type of function
 */
export type ChangeReturnType<T extends (...args: any[]) => any, R> = (...args: Parameters<T>) => R;

/**
 * Make function parameters optional
 */
export type OptionalParameters<T extends (...args: any[]) => any> = (
  ...args: Array<{ [K in keyof Parameters<T>]: Parameters<T>[K] | undefined }>
) => ReturnType<T>;

/**
 * Make all parameters required
 */
export type AllRequiredParameters<T extends (...args: any[]) => any> = (
  ...args: Required<{ [K in keyof Parameters<T>]: Parameters<T>[K] }>
) => ReturnType<T>;

// MARKER: Async and Promise Utilities

/**
 * Convert sync function to async
 */
export type Asyncify<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => Promise<ReturnType<T>>;

/**
 * Convert async function to sync (unsafe)
 */
export type Syncify<T extends (...args: any[]) => any> = T extends (
  ...args: infer P
) => Promise<infer R>
  ? (...args: P) => R
  : never;

/**
 * Check if function is async
 */
export type IsAsync<T extends (...args: any[]) => any> = ReturnType<T> extends Promise<any> ? true : false;

/**
 * Extract resolve type from Promise-returning function
 */
export type AsyncReturnType<T extends (...args: any[]) => Promise<any>> = T extends (
  ...args: any[]
) => Promise<infer R>
  ? R
  : never;

/**
 * Create function with error handling return type
 */
export type WithError<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => Promise<[ReturnType<T>, null] | [null, Error]>;

// MARKER: Function Composition and Higher-Order Types

/**
 * Function type for function composition (f ∘ g)
 */
export type Compose<F extends (...args: any[]) => any, G extends (...args: any[]) => any> = (
  ...args: Parameters<G>
) => ReturnType<F>;

/**
 * Function type for function piping (g | f)
 */
export type Pipe<F extends (...args: any[]) => any, G extends (...args: any[]) => any> = (
  ...args: Parameters<F>
) => ReturnType<G>;

/**
 * Curried function type
 */
export type Curried<T extends (...args: any[]) => any> = T extends (...args: infer P) => infer R
  ? P extends []
    ? () => R
    : P extends [infer A, ...infer Rest]
    ? (arg: A) => Curried<(...args: Rest) => R>
    : T
  : T;

/**
 * Partially applied function type
 */
export type PartiallyApplied<T extends (...args: any[]) => any, N extends number> = (
  ...args: Take<Parameters<T>, N>
) => (...rest: Drop<Parameters<T>, N>) => ReturnType<T>;

/**
 * Function with context parameter (this)
 */
export type WithThis<T, F extends (...args: any[]) => any> = (this: T, ...args: Parameters<F>) => ReturnType<F>;

/**
 * Remove this parameter from function
 */
export type RemoveThis<T extends (this: any, ...args: any[]) => any> = (
  ...args: Parameters<T>
) => ReturnType<T>;

// MARKER: Utility Functions

/**
 * Take first N elements from tuple
 */
type Take<T extends readonly unknown[], N extends number, R extends readonly unknown[] = []> = R['length'] extends N
  ? R
  : T extends readonly [infer F, ...infer Rest]
  ? Take<Rest, N, readonly [...R, F]>
  : R;

/**
 * Drop first N elements from tuple
 */
type Drop<T extends readonly unknown[], N extends number> = T extends readonly [...Take<T, N>, ...infer Rest]
  ? Rest
  : T;

/**
 * Check if function has specific parameter count
 */
export type HasParameterCount<T extends (...args: any[]) => any, N extends number> = ParameterCount<T> extends N
  ? true
  : false;

/**
 * Check if function has specific parameter type
 */
export type HasParameterType<
  T extends (...args: any[]) => any,
  Index extends number,
  Type
> = Parameters<T>[Index] extends Type ? true : false;

/**
 * Check if function returns specific type
 */
export type ReturnsType<T extends (...args: any[]) => any, Type> = ReturnType<T> extends Type ? true : false;

/**
 * Function type for predicate (returns boolean)
 */
export type Predicate<T> = (value: T, index: number, array: T[]) => boolean;

/**
 * Function type for mapper (transforms values)
 */
export type Mapper<T, U> = (value: T, index: number, array: T[]) => U;

/**
 * Function type for reducer (accumulates values)
 */
export type Reducer<T, U> = (accumulator: U, currentValue: T, index: number, array: T[]) => U;

/**
 * Function type for comparator (returns negative, zero, or positive)
 */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * Function type for equality test
 */
export type EqualityFn<T> = (a: T, b: T) => boolean;