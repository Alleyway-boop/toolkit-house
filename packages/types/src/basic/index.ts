/**
 * Enhanced basic type utilities
 * 增强的基础类型工具
 */

// MARKER: Enhanced Optional, Required, Partial
// 标记：增强的可选、必选、部分类型

/**
 * Make all properties optional recursively
 * 递归地将所有属性设为可选
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Make all properties required recursively
 * 递归地将所有属性设为必选
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/**
 * Make all properties optional, but include required keys
 * 将所有属性设为可选，但包含指定的必选键
 */
export type PartialWithRequired<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;

/**
 * Make specific properties optional while keeping others
 * 将指定属性设为可选，同时保持其他属性不变
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific properties required while keeping others
 * 将指定属性设为必选，同时保持其他属性不变
 */
export type RequiredExcept<T, K extends keyof T> = Required<Omit<T, K>> & Partial<Pick<T, K>>;

/**
 * Exclude undefined from properties
 * 从属性中排除 undefined 类型
 */
export type NonNullableProperties<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

/**
 * Make properties nullable
 * 使属性可空
 */
export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

/**
 * Make properties nullable or optional
 * 使属性可空或可选
 */
export type NullableOrOptional<T> = {
  [P in keyof T]?: T[P] | null;
};

// MARKER: Array and Object Utilities
// 标记：数组和对象工具

/**
 * Make all properties in an object readonly
 * 递归地将对象中的所有属性设为只读
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Make all properties in an object writable
 * 递归地将对象中的所有属性设为可写
 */
export type DeepWritable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? DeepWritable<T[P]> : T[P];
};

/**
 * Extract array element type
 * 提取数组元素类型
 */
export type ArrayElement<T extends readonly unknown[]> = T extends readonly (infer U)[] ? U : never;

/**
 * Extract array element type recursively (for nested arrays)
 * 递归地提取数组元素类型（用于嵌套数组）
 */
export type ArrayElementDeep<T> = T extends readonly (infer U)[]
  ? U extends readonly unknown[]
    ? ArrayElementDeep<U>
    : U
  : never;

/**
 * Convert object keys to camelCase
 * 将对象的键转换为驼峰命名格式
 */
export type CamelCaseKeys<T> = T extends readonly unknown[]
  ? CamelCaseArray<T>
  : T extends object
  ? {
      [K in keyof T as CamelCase<string & K>]: CamelCaseKeys<T[K]>;
    }
  : T;

type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${P1}${Uppercase<P2>}${CamelCase<P3>}`
  : S;

type CamelCaseArray<T extends readonly unknown[]> = {
  [K in keyof T]: CamelCaseKeys<T[K]>;
};

/**
 * Convert object keys to snake_case
 * 将对象的键转换为下划线命名格式
 */
export type SnakeCaseKeys<T> = T extends readonly unknown[]
  ? SnakeCaseArray<T>
  : T extends object
  ? {
      [K in keyof T as SnakeCase<string & K>]: SnakeCaseKeys<T[K]>;
    }
  : T;

type SnakeCase<S extends string> = S extends `${infer P1}${infer P2}`
  ? P1 extends Uppercase<P1>
    ? `_${Lowercase<P1>}${SnakeCase<P2>}`
    : `${P1}${SnakeCase<P2>}`
  : S;

type SnakeCaseArray<T extends readonly unknown[]> = {
  [K in keyof T]: SnakeCaseKeys<T[K]>;
};

/**
 * Extract keys with specific value type
 * 提取具有特定值类型的键
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/**
 * Filter properties by value type
 * 按值类型过滤属性
 */
export type FilterProperties<T, U> = Pick<T, KeysOfType<T, U>>;

/**
 * Omit properties by value type
 * 按值类型排除属性
 */
export type OmitProperties<T, U> = Pick<T, KeysOfType<T, Exclude<T[keyof T], U>>>;

// MARKER: Union and Intersection Utilities
// 标记：联合类型和交叉类型工具

/**
 * Convert union to intersection
 * 将联合类型转换为交叉类型
 */
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;

/**
 * Get last element of union
 * 获取联合类型的最后一个元素
 */
export type UnionLast<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R
  ? R
  : never;

/**
 * Get array of union members
 * 将联合类型转换为数组
 */
export type UnionToArray<T> = T extends never ? never : UnionToTuple<T, []>;

type UnionToTuple<T, R extends readonly unknown[]> = T extends never
  ? R
  : UnionToTuple<Exclude<T, UnionLast<T>>, [UnionLast<T>, ...R]>;

/**
 * Merge two objects (union of their properties)
 * 合并两个对象（它们的属性的联合）
 */
export type Merge<T, U> = Omit<T, keyof U> & U;

/**
 * Create strict object where excess properties are disallowed
 * 创建严格对象，不允许有多余的属性
 */
export type StrictObject<T extends Record<string, any>, U extends Record<string, any> = T> = T & { [K in keyof U as K extends keyof T ? never : K]: never };

// MARKER: Primitive and Built-in Types
// 标记：原始类型和内置类型

/**
 * All primitive types
 * 所有原始类型
 */
export type Primitive = string | number | boolean | bigint | symbol | undefined | null;

/**
 * All built-in object types
 * 所有内置对象类型
 */
export type Builtin = Primitive | Function | Date | Error | RegExp;

/**
 * Check if type is primitive
 * 检查类型是否为原始类型
 */
export type IsPrimitive<T> = T extends Primitive ? true : false;

/**
 * Check if type is array
 * 检查类型是否为数组
 */
export type IsArray<T> = T extends readonly unknown[] ? true : false;

/**
 * Check if type is object (but not array)
 * 检查类型是否为对象（但不是数组）
 */
export type IsObject<T> = T extends object
  ? T extends readonly unknown[]
    ? false
    : true
  : false;

/**
 * Check if type is function
 * 检查类型是否为函数
 */
export type IsFunction<T> = T extends Function ? true : false;

/**
 * Check if type is promise
 * 检查类型是否为 Promise
 */
export type IsPromise<T> = T extends Promise<any> ? true : false;