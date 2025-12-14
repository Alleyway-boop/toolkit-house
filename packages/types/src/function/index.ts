/**
 * Function type utilities
 * 函数类型工具
 */

// MARKER: Parameter and Return Type Utilities
// 标记：参数和返回类型工具

/**
 * Extract parameters type from function
 * 从函数中提取参数类型
 */
export type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

/**
 * Extract return type from function
 * 从函数中提取返回类型
 */
export type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : never;

/**
 * Extract first parameter type
 * 提取第一个参数类型
 */
export type FirstParameter<T extends (...args: any) => any> = Parameters<T>[0];

/**
 * Extract last parameter type
 * 提取最后一个参数类型
 */
export type LastParameter<T extends (...args: any) => any> = Parameters<T> extends [...any, infer L] ? L : never;

/**
 * Extract parameters except first one
 * 提取除第一个参数外的所有参数
 */
export type RestParameters<T extends (...args: any) => any> = Parameters<T> extends [any, ...infer R] ? R : [];

/**
 * Extract parameters except last one
 * 提取除最后一个参数外的所有参数
 */
export type InitialParameters<T extends (...args: any) => any> = Parameters<T> extends [...infer I, any] ? I : [];

/**
 * Get parameter count
 * 获取参数个数
 */
export type ParameterCount<T extends (...args: any) => any> = Parameters<T>['length'];

// MARKER: Function Modification Utilities
// 标记：函数修改工具

/**
 * Add optional parameter to function
 * 向函数添加可选参数
 */
export type AddOptionalParameter<
  T extends (...args: any[]) => any,
  P extends any[]
> = (...args: [...Parameters<T>, ...P]) => ReturnType<T>;

/**
 * Add required parameter to function
 * 向函数添加必需参数
 */
export type AddRequiredParameter<
  T extends (...args: any[]) => any,
  P extends any[]
> = (...args: [...Parameters<T>, ...P]) => ReturnType<T>;

/**
 * Remove last parameter from function
 * 从函数中移除最后一个参数
 */
export type RemoveLastParameter<T extends (...args: any[]) => any> = Parameters<T> extends [...infer P, any]
  ? (...args: P) => ReturnType<T>
  : T;

/**
 * Remove first parameter from function
 * 从函数中移除第一个参数
 */
export type RemoveFirstParameter<T extends (...args: any[]) => any> = Parameters<T> extends [any, ...infer P]
  ? (...args: P) => ReturnType<T>
  : T;

/**
 * Change return type of function
 * 改变函数的返回类型
 */
export type ChangeReturnType<T extends (...args: any[]) => any, R> = (...args: Parameters<T>) => R;

/**
 * Make function parameters optional
 * 使函数参数变为可选
 */
export type OptionalParameters<T extends (...args: any[]) => any> = (
  ...args: Array<{ [K in keyof Parameters<T>]: Parameters<T>[K] | undefined }>
) => ReturnType<T>;

/**
 * Make all parameters required
 * 使所有参数变为必需
 */
export type AllRequiredParameters<T extends (...args: any[]) => any> = (
  ...args: Required<{ [K in keyof Parameters<T>]: Parameters<T>[K] }>
) => ReturnType<T>;

// MARKER: Async and Promise Utilities
// 标记：异步和 Promise 工具

/**
 * Convert sync function to async
 * 将同步函数转换为异步函数
 */
export type Asyncify<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => Promise<ReturnType<T>>;

/**
 * Convert async function to sync (unsafe)
 * 将异步函数转换为同步函数（不安全）
 */
export type Syncify<T extends (...args: any[]) => any> = T extends (
  ...args: infer P
) => Promise<infer R>
  ? (...args: P) => R
  : never;

/**
 * Check if function is async
 * 检查函数是否为异步函数
 */
export type IsAsync<T extends (...args: any[]) => any> = ReturnType<T> extends Promise<any> ? true : false;

/**
 * Extract resolve type from Promise-returning function
 * 从返回 Promise 的函数中提取 resolve 类型
 */
export type AsyncReturnType<T extends (...args: any[]) => Promise<any>> = T extends (
  ...args: any[]
) => Promise<infer R>
  ? R
  : never;

/**
 * Create function with error handling return type
 * 创建具有错误处理返回类型的函数
 */
export type WithError<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => Promise<[ReturnType<T>, null] | [null, Error]>;

// MARKER: Function Composition and Higher-Order Types
// 标记：函数组合和高阶类型

/**
 * Function type for function composition (f ∘ g)
 * 函数组合的函数类型（f ∘ g）
 */
export type Compose<F extends (...args: any[]) => any, G extends (...args: any[]) => any> = (
  ...args: Parameters<G>
) => ReturnType<F>;

/**
 * Function type for function piping (g | f)
 * 函数管道的函数类型（g | f）
 */
export type Pipe<F extends (...args: any[]) => any, G extends (...args: any[]) => any> = (
  ...args: Parameters<F>
) => ReturnType<G>;

/**
 * Curried function type
 * 柯里化函数类型
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
 * 部分应用的函数类型
 */
export type PartiallyApplied<T extends (...args: any[]) => any, N extends number> = (
  ...args: Take<Parameters<T>, N>
) => (...rest: Drop<Parameters<T>, N>) => ReturnType<T>;

/**
 * Function with context parameter (this)
 * 带有上下文参数（this）的函数
 */
export type WithThis<T, F extends (...args: any[]) => any> = (this: T, ...args: Parameters<F>) => ReturnType<F>;

/**
 * Remove this parameter from function
 * 从函数中移除 this 参数
 */
export type RemoveThis<T extends (this: any, ...args: any[]) => any> = (
  ...args: Parameters<T>
) => ReturnType<T>;

// MARKER: Utility Functions
// 标记：工具函数

/**
 * Take first N elements from tuple
 * 从元组中获取前 N 个元素
 */
type Take<T extends readonly unknown[], N extends number, R extends readonly unknown[] = []> = R['length'] extends N
  ? R
  : T extends readonly [infer F, ...infer Rest]
  ? Take<Rest, N, readonly [...R, F]>
  : R;

/**
 * Drop first N elements from tuple
 * 从元组中丢弃前 N 个元素
 */
type Drop<T extends readonly unknown[], N extends number> = T extends readonly [...Take<T, N>, ...infer Rest]
  ? Rest
  : T;

/**
 * Check if function has specific parameter count
 * 检查函数是否有特定数量的参数
 */
export type HasParameterCount<T extends (...args: any[]) => any, N extends number> = ParameterCount<T> extends N
  ? true
  : false;

/**
 * Check if function has specific parameter type
 * 检查函数是否有特定类型的参数
 */
export type HasParameterType<
  T extends (...args: any[]) => any,
  Index extends number,
  Type
> = Parameters<T>[Index] extends Type ? true : false;

/**
 * Check if function returns specific type
 * 检查函数是否返回特定类型
 */
export type ReturnsType<T extends (...args: any[]) => any, Type> = ReturnType<T> extends Type ? true : false;

/**
 * Function type for predicate (returns boolean)
 * 谓词函数类型（返回布尔值）
 */
export type Predicate<T> = (value: T, index: number, array: T[]) => boolean;

/**
 * Function type for mapper (transforms values)
 * 映射函数类型（转换值）
 */
export type Mapper<T, U> = (value: T, index: number, array: T[]) => U;

/**
 * Function type for reducer (accumulates values)
 * 归约函数类型（累积值）
 */
export type Reducer<T, U> = (accumulator: U, currentValue: T, index: number, array: T[]) => U;

/**
 * Function type for comparator (returns negative, zero, or positive)
 * 比较器函数类型（返回负数、零或正数）
 */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * Function type for equality test
 * 相等性测试函数类型
 */
export type EqualityFn<T> = (a: T, b: T) => boolean;