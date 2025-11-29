/**
 * Enhanced basic type utilities
 */

// MARKER: Enhanced Optional, Required, Partial

/**
 * Make all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Make all properties required recursively
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/**
 * Make all properties optional, but include required keys
 */
export type PartialWithRequired<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;

/**
 * Make specific properties optional while keeping others
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific properties required while keeping others
 */
export type RequiredExcept<T, K extends keyof T> = Required<Omit<T, K>> & Partial<Pick<T, K>>;

/**
 * Exclude undefined from properties
 */
export type NonNullableProperties<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

/**
 * Make properties nullable
 */
export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

/**
 * Make properties nullable or optional
 */
export type NullableOrOptional<T> = {
  [P in keyof T]?: T[P] | null;
};

// MARKER: Array and Object Utilities

/**
 * Make all properties in an object readonly
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Make all properties in an object writable
 */
export type DeepWritable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? DeepWritable<T[P]> : T[P];
};

/**
 * Extract array element type
 */
export type ArrayElement<T extends readonly unknown[]> = T extends readonly (infer U)[] ? U : never;

/**
 * Extract array element type recursively (for nested arrays)
 */
export type ArrayElementDeep<T> = T extends readonly (infer U)[]
  ? U extends readonly unknown[]
    ? ArrayElementDeep<U>
    : U
  : never;

/**
 * Convert object keys to camelCase
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
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/**
 * Filter properties by value type
 */
export type FilterProperties<T, U> = Pick<T, KeysOfType<T, U>>;

/**
 * Omit properties by value type
 */
export type OmitProperties<T, U> = Pick<T, KeysOfType<T, Exclude<T[keyof T], U>>>;

// MARKER: Union and Intersection Utilities

/**
 * Convert union to intersection
 */
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;

/**
 * Get last element of union
 */
export type UnionLast<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R
  ? R
  : never;

/**
 * Get array of union members
 */
export type UnionToArray<T> = T extends never ? never : UnionToTuple<T, []>;

type UnionToTuple<T, R extends readonly unknown[]> = T extends never
  ? R
  : UnionToTuple<Exclude<T, UnionLast<T>>, [UnionLast<T>, ...R]>;

/**
 * Merge two objects (union of their properties)
 */
export type Merge<T, U> = Omit<T, keyof U> & U;

/**
 * Create strict object where excess properties are disallowed
 */
export type StrictObject<T extends Record<string, any>, U extends Record<string, any> = T> = T & { [K in keyof U as K extends keyof T ? never : K]: never };

// MARKER: Primitive and Built-in Types

/**
 * All primitive types
 */
export type Primitive = string | number | boolean | bigint | symbol | undefined | null;

/**
 * All built-in object types
 */
export type Builtin = Primitive | Function | Date | Error | RegExp;

/**
 * Check if type is primitive
 */
export type IsPrimitive<T> = T extends Primitive ? true : false;

/**
 * Check if type is array
 */
export type IsArray<T> = T extends readonly unknown[] ? true : false;

/**
 * Check if type is object (but not array)
 */
export type IsObject<T> = T extends object
  ? T extends readonly unknown[]
    ? false
    : true
  : false;

/**
 * Check if type is function
 */
export type IsFunction<T> = T extends Function ? true : false;

/**
 * Check if type is promise
 */
export type IsPromise<T> = T extends Promise<any> ? true : false;