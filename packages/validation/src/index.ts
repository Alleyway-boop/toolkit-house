/**
 * @toolkit-house/validation
 *
 * Type-safe validation library with fluent API leveraging ts-utils
 *
 * Features:
 * - Chainable validator API
 * - Schema-based validation
 * - Built-in validators for common types
 * - Error handling and localization
 * - TypeScript type safety
 * - Performance optimized
 * - Zero runtime dependencies
 */

import { schema } from './schema';
import { ValidationContext, ValidationError, ValidationResult } from './types';
import { string, number } from './validators/simple';

// MARKER: Core Exports

// Types and interfaces
export * from './types';

// Simple implementations
export { SimpleStringValidator as StringValidator, string } from './validators/simple';
export { SimpleNumberValidator as NumberValidator, number } from './validators/simple';
export { SimpleObjectSchema as ObjectSchema, simpleSchema as schema } from './schema/simple';

// MARKER: Main Validator Class

/**
 * Main validator class that provides a unified API for all validation operations
 */
export class Validator {
  /**
   * Create a string validator
   */
  static string() {
    return string();
  }

  /**
   * Create a number validator
   */
  static number() {
    return number();
  }

  /**
   * Create a boolean validator
   */
  static boolean() {
    return {
      validate: (value: unknown) => {
        if (value === true || value === false) {
          return { valid: true, data: value };
        }
        return {
          valid: false,
          errors: [{
            path: [],
            message: 'Must be a boolean',
            code: 'type',
            value,
          }],
        };
      },
    };
  }

  /**
   * Create an array validator
   */
  static array<T>(itemValidator?: Validator<T>) {
    return {
      validate: (value: unknown) => {
        if (!Array.isArray(value)) {
          return {
            valid: false,
            errors: [{
              path: [],
              message: 'Must be an array',
              code: 'type',
              value,
            }],
          };
        }

        if (!itemValidator) {
          return { valid: true, data: value };
        }

        const errors: ValidationError[] = [];
        const result: T[] = [];

        for (let i = 0; i < value.length; i++) {
          const result = itemValidator.validate(value[i]);
          
          if (!result.valid) {
            errors.push(...result.errors.map(error => ({
              ...error,
              path: [i, ...error.path],
            })));
          } else {
            result.push(result.data);
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
          data: result,
        };
      },
    };
  }

  /**
   * Create an object/shape validator
   */
  static shape<T extends Record<string, any>>(definition: {
    [K in keyof T]: Validator<T[K]>;
  }) {
    const schemaObj: Record<string, Validator<any>> = {};
    
    for (const [key, validator] of Object.entries(definition)) {
      schemaObj[key as string] = validator;
    }
    
    return schema(schemaObj);
  }
}

// MARKER: Validator Instance

/**
 * Global validator instance for convenience
 */
export const validator = Validator;

// MARKER: Utility Functions

/**
 * Validate any value with a validator
 */
export function validateWith<T>(
  validator: Validator<T>,
  value: unknown,
  context?: ValidationContext
): ValidationResult<T> {
  return validator.validate(value, context);
}

/**
 * Check if a value is valid according to a validator
 */
export function checkValidity<T>(
  validator: Validator<T>,
  value: unknown,
  context?: ValidationContext
): value is T {
  return validator.validate(value, context).valid;
}

/**
 * Get errors from validation result
 */
export function getErrors(result: ValidationResult<any>): ValidationError[] {
  return result.valid ? [] : result.errors;
}

/**
 * Check if validation has errors
 */
export function hasErrors(result: ValidationResult<any>): boolean {
  return !result.valid;
}

/**
 * Get first error from validation result
 */
export function getFirstError(result: ValidationResult<any>): ValidationError | null {
  return result.valid ? null : result.errors[0] || null;
}

// MARKER: Version Information

/**
 * Package version
 */
export const version = '0.0.0';

/**
 * Package name
 */
export const packageName = '@toolkit-house/validation';

/**
 * Package description
 */
export const packageDescription = 'Type-safe validation library with fluent API leveraging ts-utils';

// MARKER: Import validation functions from ts-utils for compatibility
export {
  isEmail,
  isURL,
  isPhone,
  isUUID,
  isStrongPassword,
  isNumeric,
  isInteger,
  isFloat,
  isAlphanumeric,
  isAlpha,
  isRequired,
  isLength,
  isDate,
  isBoolean,
  isObject,
  isEmpty as isEmptyString,
  isNotEmpty,
} from '@toolkit-house/ts-utils';
