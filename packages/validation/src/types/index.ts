/**
 * Core types for the validation library
 */

// MARKER: Core Validation Types

/**
 * Detailed validation error with path and context
 */
export interface ValidationError {
  path: string[];
  message: string;
  value?: unknown;
  code?: string;
  meta?: Record<string, unknown>;
}

/**
 * Enhanced validation result with detailed error information
 */
export type ValidationResult<T> = 
  | {
      valid: true;
      data: T;
    }
  | {
      valid: false;
      errors: ValidationError[];
      value?: unknown;
    };

/**
 * Validation context for field dependencies
 */
export interface ValidationContext {
  parent?: Record<string, unknown>;
  root?: unknown;
  path?: string[];
  [key: string]: unknown;
}

/**
 * Schema type for validation
 */
export interface Schema<T> {
  parse: (value: unknown, context?: ValidationContext) => ValidationResult<T>;
};

/**
 * Type guard function type
 */
export type TypeGuard<T> = (value: unknown) => value is T;

// MARKER: Error Types

/**
 * Error message resolver function
 */
export type ErrorMessageResolver = (path: string[], error: ValidationError) => string;

/**
 * Default error messages
 */
export interface DefaultMessages {
  required: string;
  type: string;
  string: string;
  number: string;
  boolean: string;
  array: string;
  object: string;
  date: string;
  email: string;
  url: string;
  minLength: (min: number) => string;
  maxLength: (max: number) => string;
  min: (min: number) => string;
  max: (max: number) => string;
  pattern: (pattern: string) => string;
  enum: (values: unknown[]) => string;
  custom: (code: string) => string;
}

// MARKER: Validator Configuration

/**
 * Base validator configuration
 */
export interface ValidatorConfig {
  required?: boolean;
  optional?: boolean;
  nullable?: boolean;
  default?: unknown;
  messages?: Partial<DefaultMessages>;
  transform?: (value: unknown) => unknown;
  abortEarly?: boolean;
}

/**
 * String validator configuration
 */
export interface StringValidatorConfig extends ValidatorConfig {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp | string;
  email?: boolean;
  url?: boolean;
  trim?: boolean;
  lowercase?: boolean;
  uppercase?: boolean;
}

/**
 * Number validator configuration
 */
export interface NumberValidatorConfig extends ValidatorConfig {
  min?: number;
  max?: number;
  precision?: number;
  integer?: boolean;
  positive?: boolean;
  negative?: boolean;
  step?: number;
  finite?: boolean;
}

/**
 * Date validator configuration
 */
export interface DateValidatorConfig extends ValidatorConfig {
  min?: Date | string;
  max?: Date | string;
  past?: boolean;
  future?: boolean;
  format?: string;
}

/**
 * Array validator configuration
 */
export interface ArrayValidatorConfig extends ValidatorConfig {
  minItems?: number;
  maxItems?: number;
  unique?: boolean;
  itemValidator?: Validator<unknown>;
}

/**
 * Object validator configuration
 */
export interface ObjectValidatorConfig extends ValidatorConfig {
  shape?: Record<string, Validator<unknown>>;
  strict?: boolean;
  allowUnknown?: boolean;
  deep?: boolean;
}

// MARKER: Schema Types

/**
 * Schema definition for object validation
 */
export interface SchemaDefinition<T extends Record<string, any>> {
  [K in keyof T]: Validator<T[K]>;
}

/**
 * Partial schema definition
 */
export type PartialSchema<T> = {
  [K in keyof T]?: Validator<T[K]>;
};

/**
 * Array schema definition
 */
export interface ArraySchema<T> {
  item: Validator<T>;
  minItems?: number;
  maxItems?: number;
  unique?: boolean;
}

/**
 * Conditional validation rule
 */
export interface ConditionalRule {
  when: (context: ValidationContext) => boolean;
  then: Validator<unknown>;
  otherwise?: Validator<unknown>;
}

// MARKER: Chain API Types

/**
 * Chainable validator interface
 */
export interface ChainableValidator<T, R = T> {
  required: () => ChainableValidator<T, R>;
  optional: () => ChainableValidator<T, R>;
  nullable: () => ChainableValidator<T, R>;
  default: (value: T) => ChainableValidator<T, R>;
  transform: (fn: (value: T) => R) => ChainableValidator<T, R>;
  message: (msg: string | ErrorMessageResolver) => ChainableValidator<T, R>;
  validate: (value: unknown, context?: ValidationContext) => ValidationResult<R>;
}

// MARKER: Advanced Types

/**
 * Validator function type
 */
export type Validator<T> = (value: unknown, context?: ValidationContext) => ValidationResult<T>;

/**
 * Async validator function
 */
export type AsyncValidator<T> = (value: unknown, context?: ValidationContext) => Promise<ValidationResult<T>>;

/**
 * Validation rule with async support
 */
export interface ValidationRule {
  validator: Validator<unknown> | AsyncValidator<unknown>;
  code: string;
  message: string | ErrorMessageResolver;
}

/**
 * Validation options
 */
export interface ValidationOptions {
  strict?: boolean;
  abortEarly?: boolean;
  stripUnknown?: boolean;
  recursive?: boolean;
  context?: ValidationContext;
  messages?: Partial<DefaultMessages>;
}

// MARKER: Utility Types

/**
 * Extract the validated type from a validator
 */
export type ValidatedType<T extends Validator<unknown>> = T extends Validator<infer U> ? U : never;

/**
 * Extract the validated type from a schema
 */
export type SchemaType<T extends Schema<unknown>> = T extends Schema<infer U> ? U : never;

/**
 * Make all properties in an object optional
 */
export type Partialify<T> = {
  [P in keyof T]?: T[P];
};

/**
 * Make all properties in an object required
 */
export type Requiredify<T> = {
  [P in keyof T]-?: T[P];
};

/**
 * Deep partial type
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

// MARKER: Built-in Type Guards

/**
 * Built-in type guards
 */
export const TypeGuards = {
  isString: (value: unknown): value is string => typeof value === 'string',
  isNumber: (value: unknown): value is number => typeof value === 'number' && !isNaN(value),
  isBoolean: (value: unknown): value is boolean => typeof value === 'boolean',
  isArray: (value: unknown): value is any[] => Array.isArray(value),
  isObject: (value: unknown): value is Record<string, any> => 
    value !== null && typeof value === 'object' && !Array.isArray(value),
  isDate: (value: unknown): value is Date => value instanceof Date && !isNaN(value.getTime()),
  isNull: (value: unknown): value is null => value === null,
  isUndefined: (value: unknown): value is undefined => value === undefined,
  isEmpty: (value: unknown): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  },
} as const;

// Export for backward compatibility
