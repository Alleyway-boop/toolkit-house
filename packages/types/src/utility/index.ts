/**
 * Advanced utility types for constructors, instances, and other type utilities
 * 高级工具类型，用于构造函数、实例和其他类型工具
 */

// MARKER: Constructor and Instance Types
// 标记：构造函数和实例类型

/**
 * Extract constructor parameters type
 * 提取构造函数参数类型
 */
export type ConstructorParameters<T extends abstract new (...args: any) => any> = T extends abstract new (
  ...args: infer P
) => any
  ? P
  : never;

/**
 * Extract instance type from constructor
 * 从构造函数提取实例类型
 */
export type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (
  ...args: any
) => infer I
  ? I
  : never;

/**
 * Extract return type from constructor
 * 从构造函数提取返回类型
 */
export type ConstructorReturnType<T extends abstract new (...args: any) => any> = InstanceType<T>;

/**
 * Check if type is constructor
 * 检查类型是否为构造函数
 */
export type IsConstructor<T> = T extends abstract new (...args: any) => any ? true : false;

/**
 * Create constructor type from instance
 * 从实例创建构造函数类型
 */
export type ConstructorOf<T> = abstract new (...args: any) => T;

/**
 * Create concrete constructor from instance
 * 从实例创建具体构造函数
 */
export type ConcreteConstructorOf<T> = new (...args: any) => T;

/**
 * Create constructor with specific parameter types
 * 创建具有特定参数类型的构造函数
 */
export type ConstructorWithParams<T, P extends readonly unknown[]> = abstract new (...args: P) => T;

/**
 * Mixin constructor type
 * 混入构造函数类型
 */
export type MixinConstructor<T, B extends abstract new (...args: any) => any> = abstract new (...args: ConstructorParameters<B>) => T;

/**
 * Abstract constructor type
 * 抽象构造函数类型
 */
export type AbstractConstructor<T, P extends readonly unknown[]> = abstract new (...args: P) => T;

// MARKER: Instance Type Utilities
// 标记：实例类型工具

/**
 * Get prototype of instance
 * 获取实例的原型
 */
export type InstancePrototype<T> = T extends { constructor: { prototype: infer P } } ? P : never;

/**
 * Get constructor of instance
 * 获取实例的构造函数
 */
export type InstanceConstructor<T> = T extends { constructor: infer C } ? C : never;

/**
 * Check if type is instance of constructor
 * 检查类型是否是构造函数的实例
 */
export type IsInstanceOf<T, C extends abstract new (...args: any) => any> = T extends InstanceType<C> ? true : false;

/**
 * Extract class methods
 * 提取类方法
 */
export type ClassMethods<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

/**
 * Extract class properties
 * 提取类属性
 */
export type ClassProperties<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

/**
 * Extract static members
 * 提取静态成员
 */
export type StaticMembers<T> = {
  [K in keyof T]: T extends { constructor: any } ? K extends 'constructor' ? never : K : K;
}[keyof T];

// MARKER: Advanced Type Utilities
// 标记：高级类型工具

/**
 * Create branded type
 * 创建品牌类型
 */
export type Brand<T, B> = T & { __brand: B };

/**
 * Create nominal type
 * 创建标称类型
 */
export type Nominal<T, N> = T & { __nominal: N };

/**
 * Create opaque type
 * 创建不透明类型
 */
export type Opaque<T, ID> = T & { __opaque: ID };

/**
 * Extract brand from branded type
 * 从品牌类型提取品牌
 */
export type Unbrand<T> = T extends { __brand: infer _B } ? T & { __brand?: never } : T;

/**
 * Extract nominal from nominal type
 * 从标称类型提取标称
 */
export type Unnominal<T> = T extends { __nominal: infer _N } ? T & { __nominal?: never } : T;

/**
 * Extract ID from opaque type
 * 从不透明类型提取ID
 */
export type Unopaque<T> = T extends { __opaque: infer _ID } ? T & { __opaque?: never } : T;

/**
 * Create type with required branding
 * 创建带有必需品牌的类型
 */
export type Branded<T, B> = T & { readonly __brand: B };

/**
 * Create type with optional branding
 * 创建带有可选品牌的类型
 */
export type OptionalBrand<T, B> = T & { __brand?: B };

// MARKER: Event and Emitter Types
// 标记：事件和发射器类型

/**
 * Event emitter type
 * 事件发射器类型
 */
export type EventEmitter<T extends Record<string, any>> = {
  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): void;
  off<K extends keyof T>(event: K, listener: (data: T[K]) => void): void;
  emit<K extends keyof T>(event: K, data: T[K]): void;
};

/**
 * Event listener type
 * 事件监听器类型
 */
export type EventListener<T extends Record<string, any>, K extends keyof T> = (data: T[K]) => void;

/**
 * Event handler type
 * 事件处理程序类型
 */
export type EventHandler<T extends Record<string, any>> = <K extends keyof T>(
  event: K,
  data: T[K]
) => void;

/**
 * Event map type
 * 事件映射类型
 */
export type EventMap<T> = Record<keyof T, any>;

// MARKER: Result and Error Types
// 标记：结果和错误类型

/**
 * Result type for operations that can fail
 * 可能失败的操作的结果类型
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
 * 成功结果类型
 */
export type SuccessResult<T> = {
  success: true;
  data: T;
};

/**
 * Error result type
 * 错误结果类型
 */
export type ErrorResult<E = Error> = {
  success: false;
  error: E;
};

/**
 * Extract success type from result
 * 从结果中提取成功类型
 */
export type SuccessType<T> = T extends Result<infer U, any> ? U : never;

/**
 * Extract error type from result
 * 从结果中提取错误类型
 */
export type ErrorType<T> = T extends Result<any, infer E> ? E : never;

// MARKER: Option and Maybe Types
// 标记：选项和可能类型

/**
 * Option type for handling nullable values
 * 用于处理可空值的选项类型
 */
export type Option<T> = {
  type: 'some';
  value: T;
} | {
  type: 'none';
};

/**
 * Some variant of Option
 * 选项的Some变体
 */
export type Some<T> = {
  type: 'some';
  value: T;
};

/**
 * None variant of Option
 * 选项的None变体
 */
export type None = {
  type: 'none';
};

/**
 * Maybe type (alias for Option)
 * 可能类型（Option的别名）
 */
export type Maybe<T> = Option<T>;

/**
 * Extract value from Option
 * 从选项中提取值
 */
export type OptionValue<T> = T extends Option<infer U> ? U : never;

// MARKER: Collection Types
// 标记：集合类型

/**
 * Pair type
 * 对类型
 */
export type Pair<T, U> = [T, U];

/**
 * Triple type
 * 三元组类型
 */
export type Triple<T, U, V> = [T, U, V];

/**
 * KeyValuePair type
 * 键值对类型
 */
export type KeyValuePair<K, V> = {
  key: K;
  value: V;
};

/**
 * Typed record type
 * 类型化记录类型
 */
export type TypedRecord<K extends PropertyKey, V> = Record<K, V>;

/**
 * Partial record type
 * 部分记录类型
 */
export type PartialRecord<K extends PropertyKey, V> = Partial<Record<K, V>>;

/**
 * Required record type
 * 必需记录类型
 */
export type RequiredRecord<K extends PropertyKey, V> = Required<Record<K, V>>;

// MARKER: Function Utility Types
// 标记：函数工具类型

/**
 * Debounced function type
 * 防抖函数类型
 */
export type Debounced<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;

/**
 * Throttled function type
 * 节流函数类型
 */
export type Throttled<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;

/**
 * Memoized function type
 * 记忆化函数类型
 */
export type Memoized<T extends (...args: any[]) => any> = T & {
  clear: () => void;
};

/**
 * Cancellable function type
 * 可取消函数类型
 */
export type Cancellable<T extends (...args: any[]) => any> = (...args: Parameters<T>) => {
  cancel: () => void;
  promise: Promise<ReturnType<T>>;
};

/**
 * Retryable function type
 * 可重试函数类型
 */
export type Retryable<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => Promise<ReturnType<T>> & {
  retry: () => Promise<ReturnType<T>>;
};

// MARKER: Validation Types
// 标记：验证类型

/**
 * Validation result type
 * 验证结果类型
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
 * 验证器函数类型
 */
export type Validator<T> = (value: unknown) => ValidationResult<T>;

/**
 * Schema type for validation
 * 用于验证的模式类型
 */
export type Schema<T> = {
  parse: (value: unknown) => ValidationResult<T>;
};

/**
 * Type guard function type
 * 类型守卫函数类型
 */
export type TypeGuard<T> = (value: unknown) => value is T;

// MARKER: File System and Path Types
// 标记：文件系统和路径类型

/**
 * File path type
 * 文件路径类型
 */
export type FilePath = string & { __type: 'FilePath' };

/**
 * Directory path type
 * 目录路径类型
 */
export type DirectoryPath = string & { __type: 'DirectoryPath' };

/**
 * File extension type
 * 文件扩展名类型
 */
export type FileExtension = string & { __type: 'FileExtension' };

/**
 * MIME type
 * MIME类型
 */
export type MimeType = string & { __type: 'MimeType' };

// MARKER: Network Types
// 标记：网络类型

/**
 * URL type
 * URL类型
 */
export type URL = string & { __type: 'URL' };

/**
 * Email type
 * 邮箱类型
 */
export type Email = string & { __type: 'Email' };

/**
 * Phone number type
 * 电话号码类型
 */
export type PhoneNumber = string & { __type: 'PhoneNumber' };

/**
 * IP address type
 * IP地址类型
 */
export type IPAddress = string & { __type: 'IPAddress' };

/**
 * UUID type
 * UUID类型
 */
export type UUID = string & { __type: 'UUID' };

// MARKER: Time and Date Types
// 标记：时间和日期类型

/**
 * Timestamp type
 * 时间戳类型
 */
export type Timestamp = number & { __type: 'Timestamp' };

/**
 * ISO date string type
 * ISO日期字符串类型
 */
export type ISODateString = string & { __type: 'ISODateString' };

/**
 * Duration type (milliseconds)
 * 持续时间类型（毫秒）
 */
export type Duration = number & { __type: 'Duration' };

// MARKER: Database and Query Types
// 标记：数据库和查询类型

/**
 * ID type
 * ID类型
 */
export type ID<T = string> = T & { __type: 'ID' };

/**
 * Database query type
 * 数据库查询类型
 */
export type Query<T> = Partial<T>;

/**
 * Database filter type
 * 数据库过滤器类型
 */
export type Filter<T> = {
  [K in keyof T]?: T[K] | { $eq: T[K] } | { $ne: T[K] } | { $gt: T[K] } | { $lt: T[K] };
};

/**
 * Database sort type
 * 数据库排序类型
 */
export type Sort<T> = {
  [K in keyof T]?: 1 | -1 | 'asc' | 'desc';
};