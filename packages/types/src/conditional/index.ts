/**
 * Conditional type utilities for type guards, filtering, and conditional logic
 * 条件类型工具，用于类型守卫、过滤和条件逻辑
 */

// MARKER: Basic Conditional Types
// 标记：基础条件类型

/**
 * If-Then-Else conditional type
 * 如果-那么-否则条件类型
 */
export type If<C extends boolean, T, F> = C extends true ? T : F;

/**
 * Not operator for boolean types
 * 布尔类型的非运算符
 */
export type Not<T extends boolean> = T extends true ? false : true;

/**
 * And operator for boolean types
 * 布尔类型的与运算符
 */
export type And<A extends boolean, B extends boolean> = A extends true
  ? B extends true
    ? true
    : false
  : false;

/**
 * Or operator for boolean types
 * 布尔类型的或运算符
 */
export type Or<A extends boolean, B extends boolean> = A extends true
  ? true
  : B extends true
  ? true
  : false;

/**
 * Xor operator for boolean types
 * 布尔类型的异或运算符
 */
export type Xor<A extends boolean, B extends boolean> = And<Or<A, B>, Not<And<A, B>>>;

/**
 * Nand operator for boolean types
 * 布尔类型的与非运算符
 */
export type Nand<A extends boolean, B extends boolean> = Not<And<A, B>>;

// MARKER: Type Guard Utilities
// 标记：类型守卫工具

/**
 * Check if type extends another type
 * 检查类型是否继承另一个类型
 */
export type Extends<T, U> = T extends U ? true : false;

/**
 * Check if type is exactly equal to another type
 * 检查类型是否与另一个类型完全相等
 */
export type Equals<T, U> = [T] extends [U] ? [U] extends [T] ? true : false : false;

/**
 * Check if type is never
 * 检查类型是否为 never
 */
export type IsNever<T> = [T] extends [never] ? true : false;

/**
 * Check if type is unknown
 * 检查类型是否为 unknown
 */
export type IsUnknown<T> = [unknown] extends [T] ? [T] extends [unknown] ? true : false : false;

/**
 * Check if type is any
 * 检查类型是否为 any
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;

/**
 * Check if type is assignable to another type
 * 检查类型是否可分配给另一个类型
 */
export type IsAssignable<T, U> = T extends U ? true : false;

/**
 * Check if type contains specific property
 * 检查类型是否包含特定属性
 */
export type HasProperty<T, K extends PropertyKey> = K extends keyof T ? true : false;

/**
 * Check if type has specific method
 * 检查类型是否具有特定方法
 */
export type HasMethod<T, K extends PropertyKey> = K extends keyof T
  ? T[K] extends Function
    ? true
    : false
  : false;

// MARKER: Type Filtering and Selection
// 标记：类型过滤和选择

/**
 * Filter union by condition
 * 根据条件过滤联合类型
 */
export type FilterUnion<T, C> = T extends C ? T : never;

/**
 * Exclude types from union
 * 从联合类型中排除类型
 */
export type ExcludeUnion<T, C> = T extends C ? never : T;

/**
 * Filter union to only primitive types
 * 过滤联合类型为仅原始类型
 */
export type FilterPrimitives<T> = FilterUnion<T, string | number | boolean | bigint | symbol>;

/**
 * Filter union to only object types
 * 过滤联合类型为仅对象类型
 */
export type FilterObjects<T> = ExcludeUnion<T, string | number | boolean | bigint | symbol | undefined | null>;

/**
 * Filter union to only function types
 * 过滤联合类型为仅函数类型
 */
export type FilterFunctions<T> = FilterUnion<T, Function>;

/**
 * Filter union to only array types
 * 过滤联合类型为仅数组类型
 */
export type FilterArrays<T> = FilterUnion<T, readonly unknown[]>;

/**
 * Filter union to only promise types
 * 过滤联合类型为仅 Promise 类型
 */
export type FilterPromises<T> = FilterUnion<T, Promise<any>>;

/**
 * Get largest type in union (by type precedence)
 * 获取联合类型中的最大类型（按类型优先级）
 */
export type Largest<T> = T extends any ? (any extends T ? T : never) : never;

/**
 * Get smallest type in union (by type precedence)
 * 获取联合类型中的最小类型（按类型优先级）
 */
export type Smallest<T> = T;

// MARKER: Conditional Object Types
// 标记：条件对象类型

/**
 * Make properties optional based on condition
 * 根据条件使属性变为可选
 */
export type OptionalIf<T, C extends boolean> = C extends true ? Partial<T> : T;

/**
 * Make properties readonly based on condition
 * 根据条件使属性变为只读
 */
export type ReadonlyIf<T, C extends boolean> = C extends true ? Readonly<T> : T;

/**
 * Add property conditionally
 * 条件性地添加属性
 */
export type AddPropertyIf<T, K extends PropertyKey, V, C extends boolean> = C extends true
  ? T & { [P in K]: V }
  : T;

/**
 * Remove property conditionally
 * 条件性地移除属性
 */
export type RemovePropertyIf<T, K extends keyof T, C extends boolean> = C extends true ? Omit<T, K> : T;

/**
 * Merge objects conditionally
 * 条件性地合并对象
 */
export type MergeIf<T, U, C extends boolean> = C extends true ? MergeObjects<T, U> : T;

/**
 * Pick properties conditionally based on value type
 * 根据值类型条件性地选择属性
 */
export type PickIf<T, V, C extends boolean> = C extends true ? PickByValue<T, V> : T;

/**
 * Omit properties conditionally based on value type
 * 根据值类型条件性地排除属性
 */
export type OmitIf<T, V, C extends boolean> = C extends true ? OmitByValue<T, V> : T;

// MARKER: Conditional Array Types
// 标记：条件数组类型

/**
 * Filter array elements by type
 * 根据类型过滤数组元素
 */
export type FilterArray<T, U> = T extends readonly (infer E)[] ? E extends U ? E[] : [] : [];

/**
 * Map array elements to new type
 * 将数组元素映射为新类型
 */
export type MapArray<T, U> = T extends readonly unknown[] ? U[] : [];

/**
 * Conditional array length checks
 * 条件性数组长度检查
 */
export type IsEmptyArray<T extends readonly unknown[]> = T['length'] extends 0 ? true : false;

/**
 * Check if array has exactly N elements
 * 检查数组是否恰好有 N 个元素
 */
export type HasLength<T extends readonly unknown[], N extends number> = T['length'] extends N ? true : false;

/**
 * Check if array has at least N elements
 * 检查数组是否至少有 N 个元素
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
 * 检查数组是否最多有 N 个元素
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
// 标记：条件函数类型

/**
 * Add parameter conditionally
 * 条件性地添加参数
 */
export type AddParameterIf<T extends (...args: any[]) => any, P extends any[], C extends boolean> = C extends true
  ? (...args: [...Parameters<T>, ...P]) => ReturnType<T>
  : T;

/**
 * Remove parameter conditionally
 * 条件性地移除参数
 */
export type RemoveParameterIf<T extends (...args: any[]) => any, C extends boolean> = C extends true
  ? RemoveLastParameter<T>
  : T;

/**
 * Make async conditionally
 * 条件性地使函数变为异步
 */
export type AsyncIf<T extends (...args: any[]) => any, C extends boolean> = C extends true ? Asyncify<T> : T;

/**
 * Change return type conditionally
 * 条件性地改变返回类型
 */
export type ChangeReturnIf<T extends (...args: any[]) => any, R, C extends boolean> = C extends true
  ? ChangeReturnType<T, R>
  : T;

// MARKER: Type Level Predicates
// 标记：类型级别谓词

/**
 * Type-level predicate for checking if type is nullable
 * 用于检查类型是否可空的类型级别谓词
 */
export type IsNullable<T> = null extends T ? (undefined extends T ? true : false) : undefined extends T ? true : false;

/**
 * Type-level predicate for checking if type is void
 * 用于检查类型是否为 void 的类型级别谓词
 */
export type IsVoid<T> = T extends void ? true : false;

/**
 * Type-level predicate for checking if type is optional
 * 用于检查类型是否可选的类型级别谓词
 */
export type IsOptional<T, K extends keyof T> = {} extends Pick<T, K> ? true : false;

/**
 * Type-level predicate for checking if type is readonly
 * 用于检查类型是否只读的类型级别谓词
 */
export type IsReadonly<T, K extends keyof T> = Extract<{ [P in K]: T[P] }, { [P in K]: T[P] }> extends {
  -readonly [P in K]: T[P];
}
  ? false
  : true;

/**
 * Type-level predicate for checking if union contains type
 * 用于检查联合类型是否包含特定类型的类型级别谓词
 */
export type UnionContains<T, U> = T extends U ? true : U extends T ? true : false;

/**
 * Type-level predicate for checking if two unions overlap
 * 用于检查两个联合类型是否重叠的类型级别谓词
 */
export type UnionsOverlap<T, U> = [T] extends [never]
  ? false
  : T extends U
  ? true
  : false;

// MARKER: Advanced Conditional Types
// 标记：高级条件类型

/**
 * Conditional type with fallback
 * 带回退值的条件类型
 */
export type WithFallback<T, F> = T extends never ? F : T;

/**
 * Default value for type
 * 类型的默认值
 */
export type WithDefault<T, D> = T extends never ? D : T;

/**
 * Try-catch conditional type
 * 尝试-捕获条件类型
 */
export type Try<T, Fallback = never> = T extends never ? Fallback : T;

/**
 * Safe conditional type (prevents infinite recursion)
 * 安全的条件类型（防止无限递归）
 */
export type Safe<T> = [T] extends [never] ? never : T;

/**
 * Conditional type that preserves union distribution
 * 保持联合类型分布的条件类型
 */
export type Distributive<T, U> = T extends any ? (T extends U ? T : never) : never;

// MARKER: Helper Types
// 标记：辅助类型

/**
 * Merge two objects
 * 合并两个对象
 */
type MergeObjects<T, U> = Omit<T, keyof U> & U;

/**
 * Pick by value type
 * 按值类型选择
 */
type PickByValue<T, V> = Pick<T, { [K in keyof T]: T[K] extends V ? K : never }[keyof T]>;

/**
 * Omit by value type
 * 按值类型排除
 */
type OmitByValue<T, V> = Pick<T, { [K in keyof T]: T[K] extends V ? never : K }[keyof T]>;

/**
 * Remove last parameter from function
 * 移除函数的最后一个参数
 */
type RemoveLastParameter<T extends (...args: any[]) => any> = Parameters<T> extends [...any, infer L]
  ? T extends (...args: [...infer P, L]) => infer R
    ? (...args: P) => R
    : T
  : T;

/**
 * Convert function to async
 * 将函数转换为异步
 */
type Asyncify<T extends (...args: any[]) => any> = (...args: Parameters<T>) => Promise<ReturnType<T>>;

/**
 * Change return type of function
 * 改变函数的返回类型
 */
type ChangeReturnType<T extends (...args: any[]) => any, R> = (...args: Parameters<T>) => R;


