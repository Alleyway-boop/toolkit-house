/**
 * Base validator implementation with chainable API
 */

import {
  ChainableValidator,
  Validator,
  ValidationResult,
  ValidationError,
  ValidationContext,
  ValidatorConfig,
  DefaultMessages,
  ErrorMessageResolver
} from '../types';

// MARKER: Default Messages

/**
 * Default error messages
 */
const DEFAULT_MESSAGES: DefaultMessages = {
  required: 'Field is required',
  type: 'Invalid type',
  string: 'Must be a string',
  number: 'Must be a number',
  boolean: 'Must be a boolean',
  array: 'Must be an array',
  object: 'Must be an object',
  date: 'Must be a valid date',
  email: 'Must be a valid email address',
  url: 'Must be a valid URL',
  minLength: (min: number) => 'Must be at least ' + min + ' characters',
  maxLength: (max: number) => 'Must be at most ' + max + ' characters',
  min: (min: number) => 'Must be at least ' + min,
  max: (max: number) => 'Must be at most ' + max,
  pattern: (pattern: string) => 'Does not match the required pattern',
  enum: (values: unknown[]) => 'Must be one of: ' + values.join(', '),
  custom: (code: string) => 'Validation failed: ' + code,
};

// MARKER: Base Validator Class

/**
 * Abstract base validator class providing chainable API
 */
export abstract class BaseValidator<T = any, R = T> implements Validator<R> {
  protected config: ValidatorConfig;
  protected validators: Array<(value: T, context?: ValidationContext) => ValidationError | null> = [];
  protected messages: Partial<DefaultMessages> = {};
  protected transformFn?: (value: T) => R;

  constructor(config: ValidatorConfig = {}) {
    this.config = {
      required: false,
      optional: false,
      nullable: false,
      ...config,
    };
    this.messages = config.messages || {};
  }

  // MARKER: Chainable API

  /**
   * Mark field as required
   */
  required(): this {
    this.config.required = true;
    this.config.optional = false;
    return this;
  }

  /**
   * Mark field as optional
   */
  optional(): this {
    this.config.required = false;
    this.config.optional = true;
    return this;
  }

  /**
   * Allow null values
   */
  nullable(): this {
    this.config.nullable = true;
    return this;
  }

  /**
   * Set default value
   */
  default(value: T): this {
    this.config.default = value;
    return this;
  }

  /**
   * Add transformation function
   */
  transform<R2>(fn: (value: T) => R2): BaseValidator<T, R2> {
    const validator = new (this.constructor as any)(this.config);
    validator.validators = [...this.validators];
    validator.messages = { ...this.messages };
    validator.transformFn = fn;
    return validator as BaseValidator<T, R2>;
  }

  /**
   * Set custom error message
   */
  message(msg: string | ErrorMessageResolver): this {
    const newValidator = new (this.constructor as any)(this.config);
    newValidator.validators = [...this.validators];
    newValidator.messages = { ...this.messages };
    newValidator.addMessageResolver(msg);
    return newValidator;
  }

  // MARKER: Validation Logic

  /**
   * Validate a value
   */
  validate(value: unknown, context?: ValidationContext): ValidationResult<R> {
    // Apply default value if provided and value is undefined
    if (value === undefined && this.config.default !== undefined) {
      value = this.config.default;
    }

    // Handle optional fields
    if (value === undefined && this.config.optional) {
      return {
        valid: true,
        data: value as R,
      };
    }

    // Handle null values
    if (value === null) {
      if (this.config.nullable) {
        return {
          valid: true,
          data: value as R,
        };
      } else {
        return this.createError(['type'], 'Field cannot be null', value);
      }
    }

    // Handle undefined values
    if (value === undefined) {
      if (this.config.required) {
        return this.createError(['required'], 'Field is required', value);
      }
      return {
        valid: true,
        data: value as R,
      };
    }

    // Apply transformation if exists
    let transformedValue: T | R = value as T;
    if (this.transformFn) {
      try {
        transformedValue = this.transformFn(value as T);
      } catch (error) {
        return this.createError(['transform'], 'Transformation failed', value);
      }
    }

    // Run validators
    const errors: ValidationError[] = [];
    for (const validator of this.validators) {
      const error = validator(transformedValue as T, context);
      if (error) {
        errors.push(error);
        if (this.config.abortEarly) {
          break;
        }
      }
    }

    if (errors.length > 0) {
      return {
        valid: false,
        errors,
        value,
      };
    }

    return {
      valid: true,
      data: transformedValue as R,
    };
  }

  // MARKER: Protected Methods

  /**
   * Add a validation function
   */
  protected addValidator(fn: (value: T, context?: ValidationContext) => ValidationError | null): void {
    this.validators.push(fn);
  }

  /**
   * Add a message resolver
   */
  protected addMessageResolver(msg: string | ErrorMessageResolver): void {
    const resolver = typeof msg === 'string'
      ? (path: string[], error: ValidationError) => msg
      : msg;

    // Create adapter to convert ErrorMessageResolver to expected format
    this.messages.custom = (code: string) => {
      // For compatibility, create a mock error object
      const mockError: ValidationError = {
        path: [],
        message: '',
        code,
      };
      return resolver([], mockError);
    };
  }

  /**
   * Create a validation error
   */
  protected createError(
    path: string[], 
    message: string, 
    value?: unknown, 
    code?: string,
    meta?: Record<string, unknown>
  ): ValidationResult<R> {
    const resolvedMessage = this.resolveMessage(path, {
      path,
      message,
      value,
      code,
      meta,
    });

    return {
      valid: false,
      errors: [{
        path,
        message: resolvedMessage,
        value,
        code,
        meta,
      }],
      value,
    };
  }

  /**
   * Resolve error message
   */
  protected resolveError(path: string[], error: ValidationError): string {
    // Check custom messages first
    if (this.messages.custom) {
      const customMessage = this.messages.custom(error.code || 'custom');
      if (customMessage) return customMessage;
    }

    // Check specific error codes
    switch (error.code) {
      case 'required':
        return this.messages.required || DEFAULT_MESSAGES.required;
      case 'type':
        return this.messages.type || DEFAULT_MESSAGES.type;
      case 'string':
        return this.messages.string || DEFAULT_MESSAGES.string;
      case 'number':
        return this.messages.number || DEFAULT_MESSAGES.number;
      case 'boolean':
        return this.messages.boolean || DEFAULT_MESSAGES.boolean;
      case 'array':
        return this.messages.array || DEFAULT_MESSAGES.array;
      case 'object':
        return this.messages.object || DEFAULT_MESSAGES.object;
      case 'date':
        return this.messages.date || DEFAULT_MESSAGES.date;
      case 'email':
        return this.messages.email || DEFAULT_MESSAGES.email;
      case 'url':
        return this.messages.url || DEFAULT_MESSAGES.url;
      case 'minLength':
        if (error.meta?.min) {
          return (this.messages.minLength || DEFAULT_MESSAGES.minLength)(error.meta.min as number);
        }
        break;
      case 'maxLength':
        if (error.meta?.max) {
          return (this.messages.maxLength || DEFAULT_MESSAGES.maxLength)(error.meta.max as number);
        }
        break;
      case 'min':
        if (error.meta?.min) {
          return (this.messages.min || DEFAULT_MESSAGES.min)(error.meta.min as number);
        }
        break;
      case 'max':
        if (error.meta?.max) {
          return (this.messages.max || DEFAULT_MESSAGES.max)(error.meta.max as number);
        }
        break;
      case 'pattern':
        if (error.meta?.pattern) {
          return (this.messages.pattern || DEFAULT_MESSAGES.pattern)(error.meta.pattern as string);
        }
        break;
      case 'enum':
        if (error.meta?.values) {
          return (this.messages.enum || DEFAULT_MESSAGES.enum)(error.meta.values as unknown[]);
        }
        break;
    }

    // Fallback to error message or default
    return error.message || DEFAULT_MESSAGES.custom('unknown');
  }

  /**
   * Resolve message from resolver
   */
  protected resolveMessage(path: string[], error: ValidationError): string {
    if (this.messages.custom) {
      return this.messages.custom(error.code || 'custom');
    }
    return this.resolveError(path, error);
  }
}

// MARKER: Factory Function

/**
 * Create a new base validator
 */
export function createBaseValidator<T>(
  initialConfig: ValidatorConfig = {}
): new (config?: ValidatorConfig) => BaseValidator<T> {
  return class extends BaseValidator<T> {
    constructor(config?: ValidatorConfig) {
      super({ ...initialConfig, ...config });
    }
  };
}

// Re-export types for other validator modules
export type {
  Validator,
  ValidationResult,
  ValidationError,
  ValidationContext,
  ValidatorConfig,
  DefaultMessages,
  ErrorMessageResolver,
  StringValidatorConfig,
  NumberValidatorConfig,
  DateValidatorConfig,
  ArrayValidatorConfig,
  ObjectValidatorConfig
} from '../types';
