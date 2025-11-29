/**
 * Advanced utility types for constructors, instances, and other type utilities
 */

// MARKER: Constructor and Instance Types

/**
 * Extract constructor parameters type
 */
export type ConstructorParameters<T extends abstract new (...args: any) => any> = T extends abstract new (
  ...args: infer P
) => any
  ? P
  : never;

/**
 * Extract instance type from constructor
 */
export type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (
  ...args: any
) => infer I
  ? I
  : never;

/**
 * Extract return type from constructor
 */
export type ConstructorReturnType<T extends abstract new (...args: any) => any> = InstanceType<T>;

/**
 * Check if type is constructor
 */
export type IsConstructor<T> = T extends abstract new (...args: any) => any ? true : false;

/**
 * Create constructor type from instance
 */
export type ConstructorOf<T> = abstract new (...args: any) => T;

/**
 * Create concrete constructor from instance
 */
export type ConcreteConstructorOf<T> = new (...args: any) => T;

/**
 * Create constructor with specific parameter types
 */
export type ConstructorWithParams<T, P extends readonly unknown[]> = abstract new (...args: P) => T;

/**
 * Mixin constructor type
 */
export type MixinConstructor<T, B extends abstract new (...args: any) => any> = abstract new (...args: ConstructorParameters<B>) => T;

/**
 * Abstract constructor type
 */
export type AbstractConstructor<T, P extends readonly unknown[]> = abstract new (...args: P) => T;

// MARKER: Instance Type Utilities

/**
 * Get prototype of instance
 */
export type InstancePrototype<T> = T extends { constructor: { prototype: infer P } } ? P : never;

/**
 * Get constructor of instance
 */
export type InstanceConstructor<T> = T extends { constructor: infer C } ? C : never;

/**
 * Check if type is instance of constructor
 */
export type IsInstanceOf<T, C extends abstract new (...args: any) => any> = T extends InstanceType<C> ? true : false;

/**
 * Extract class methods
 */
export type ClassMethods<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

/**
 * Extract class properties
 */
export type ClassProperties<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

/**
 * Extract static members
 */
export type StaticMembers<T> = {
  [K in keyof T]: T extends { constructor: any } ? K extends 'constructor' ? never : K : K;
}[keyof T];

// MARKER: Advanced Type Utilities

/**
 * Create branded type
 */
export type Brand<T, B> = T & { __brand: B };

/**
 * Create nominal type
 */
export type Nominal<T, N> = T & { __nominal: N };

/**
 * Create opaque type
 */
export type Opaque<T, ID> = T & { __opaque: ID };

/**
 * Extract brand from branded type
 */
export type Unbrand<T> = T extends { __brand: infer _B } ? T & { __brand?: never } : T;

/**
 * Extract nominal from nominal type
 */
export type Unnominal<T> = T extends { __nominal: infer _N } ? T & { __nominal?: never } : T;

/**
 * Extract ID from opaque type
 */
export type Unopaque<T> = T extends { __opaque: infer _ID } ? T & { __opaque?: never } : T;

/**
 * Create type with required branding
 */
export type Branded<T, B> = T & { readonly __brand: B };

/**
 * Create type with optional branding
 */
export type OptionalBrand<T, B> = T & { __brand?: B };

// MARKER: Event and Emitter Types

/**
 * Event emitter type
 */
export type EventEmitter<T extends Record<string, any>> = {
  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): void;
  off<K extends keyof T>(event: K, listener: (data: T[K]) => void): void;
  emit<K extends keyof T>(event: K, data: T[K]): void;
};

/**
 * Event listener type
 */
export type EventListener<T extends Record<string, any>, K extends keyof T> = (data: T[K]) => void;

/**
 * Event handler type
 */
export type EventHandler<T extends Record<string, any>> = <K extends keyof T>(
  event: K,
  data: T[K]
) => void;

/**
 * Event map type
 */
export type EventMap<T> = Record<keyof T, any>;

// MARKER: Result and Error Types

/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> = {
  success: true;
  data: T;
} | {
  success: false;
  error: E;
};

/**
 * Success result type
 */
export type SuccessResult<T> = {
  success: true;
  data: T;
};

/**
 * Error result type
 */
export type ErrorResult<E = Error> = {
  success: false;
  error: E;
};

/**
 * Extract success type from result
 */
export type SuccessType<T> = T extends Result<infer U, any> ? U : never;

/**
 * Extract error type from result
 */
export type ErrorType<T> = T extends Result<any, infer E> ? E : never;

// MARKER: Option and Maybe Types

/**
 * Option type for handling nullable values
 */
export type Option<T> = {
  type: 'some';
  value: T;
} | {
  type: 'none';
};

/**
 * Some variant of Option
 */
export type Some<T> = {
  type: 'some';
  value: T;
};

/**
 * None variant of Option
 */
export type None = {
  type: 'none';
};

/**
 * Maybe type (alias for Option)
 */
export type Maybe<T> = Option<T>;

/**
 * Extract value from Option
 */
export type OptionValue<T> = T extends Option<infer U> ? U : never;

// MARKER: Collection Types

/**
 * Pair type
 */
export type Pair<T, U> = [T, U];

/**
 * Triple type
 */
export type Triple<T, U, V> = [T, U, V];

/**
 * KeyValuePair type
 */
export type KeyValuePair<K, V> = {
  key: K;
  value: V;
};

/**
 * Typed record type
 */
export type TypedRecord<K extends PropertyKey, V> = Record<K, V>;

/**
 * Partial record type
 */
export type PartialRecord<K extends PropertyKey, V> = Partial<Record<K, V>>;

/**
 * Required record type
 */
export type RequiredRecord<K extends PropertyKey, V> = Required<Record<K, V>>;

// MARKER: Function Utility Types

/**
 * Debounced function type
 */
export type Debounced<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;

/**
 * Throttled function type
 */
export type Throttled<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;

/**
 * Memoized function type
 */
export type Memoized<T extends (...args: any[]) => any> = T & {
  clear: () => void;
};

/**
 * Cancellable function type
 */
export type Cancellable<T extends (...args: any[]) => any> = (...args: Parameters<T>) => {
  cancel: () => void;
  promise: Promise<ReturnType<T>>;
};

/**
 * Retryable function type
 */
export type Retryable<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => Promise<ReturnType<T>> & {
  retry: () => Promise<ReturnType<T>>;
};

// MARKER: Validation Types

/**
 * Validation result type
 */
export type ValidationResult<T> = {
  valid: true;
  data: T;
} | {
  valid: false;
  errors: string[];
};

/**
 * Validator function type
 */
export type Validator<T> = (value: unknown) => ValidationResult<T>;

/**
 * Schema type for validation
 */
export type Schema<T> = {
  parse: (value: unknown) => ValidationResult<T>;
};

/**
 * Type guard function type
 */
export type TypeGuard<T> = (value: unknown) => value is T;

// MARKER: File System and Path Types

/**
 * File path type
 */
export type FilePath = string & { __type: 'FilePath' };

/**
 * Directory path type
 */
export type DirectoryPath = string & { __type: 'DirectoryPath' };

/**
 * File extension type
 */
export type FileExtension = string & { __type: 'FileExtension' };

/**
 * MIME type
 */
export type MimeType = string & { __type: 'MimeType' };

// MARKER: Network Types

/**
 * URL type
 */
export type URL = string & { __type: 'URL' };

/**
 * Email type
 */
export type Email = string & { __type: 'Email' };

/**
 * Phone number type
 */
export type PhoneNumber = string & { __type: 'PhoneNumber' };

/**
 * IP address type
 */
export type IPAddress = string & { __type: 'IPAddress' };

/**
 * UUID type
 */
export type UUID = string & { __type: 'UUID' };

// MARKER: Time and Date Types

/**
 * Timestamp type
 */
export type Timestamp = number & { __type: 'Timestamp' };

/**
 * ISO date string type
 */
export type ISODateString = string & { __type: 'ISODateString' };

/**
 * Duration type (milliseconds)
 */
export type Duration = number & { __type: 'Duration' };

// MARKER: Database and Query Types

/**
 * ID type
 */
export type ID<T = string> = T & { __type: 'ID' };

/**
 * Database query type
 */
export type Query<T> = Partial<T>;

/**
 * Database filter type
 */
export type Filter<T> = {
  [K in keyof T]?: T[K] | { $eq: T[K] } | { $ne: T[K] } | { $gt: T[K] } | { $lt: T[K] };
};

/**
 * Database sort type
 */
export type Sort<T> = {
  [K in keyof T]?: 1 | -1 | 'asc' | 'desc';
};