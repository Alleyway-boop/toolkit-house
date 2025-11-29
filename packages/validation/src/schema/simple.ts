/**
 * Simple schema implementation
 */

import { ValidationResult, ValidationError, ValidationContext, Schema, Validator } from '../types';

export class SimpleObjectSchema<T extends Record<string, any>> implements Schema<T> {
  private definition: Record<string, Validator<any>>;
  private isStrict: boolean = false;

  constructor(definition: Record<string, Validator<any>>) {
    this.definition = definition;
  }

  strict(): this {
    this.isStrict = true;
    return this;
  }

  parse(value: unknown, context?: ValidationContext): ValidationResult<T> {
    // Handle null/undefined
    if (value === null || value === undefined) {
      return {
        valid: false,
        errors: [{
          path: [],
          message: 'Value is required',
          code: 'required',
          value,
        }],
      };
    }

    // Check if it's an object
    if (typeof value !== 'object' || Array.isArray(value)) {
      return {
        valid: false,
        errors: [{
          path: [],
          message: 'Expected an object',
          code: 'type',
          value,
        }],
      };
    }

    const errors: ValidationError[] = [];
    const result: Record<string, any> = {};
    const inputValue = value as Record<string, any>;

    // Validate each field in the definition
    for (const [key, validator] of Object.entries(this.definition)) {
      const fieldResult = validator(inputValue[key], {
        ...context,
        path: [...(context?.path || []), key],
        parent: inputValue,
        root: context?.root || value,
      });

      if (!fieldResult.valid) {
        errors.push(...fieldResult.errors.map(error => ({
          ...error,
          path: [...(context?.path || []), key, ...error.path],
        })));
      } else {
        result[key] = fieldResult.data;
      }
    }

    // Check for unknown fields in strict mode
    if (this.isStrict) {
      const knownKeys = Object.keys(this.definition);
      const inputKeys = Object.keys(inputValue);
      
      for (const key of inputKeys) {
        if (!knownKeys.includes(key)) {
          errors.push({
            path: [...(context?.path || []), key],
            message: `Unknown field: ${key}`,
            code: 'unknown',
            value: inputValue[key],
            meta: { field: key },
          });
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
      data: result as T,
    };
  }
}

export function simpleSchema<T extends Record<string, any>>(
  definition: Record<string, Validator<any>>
): SimpleObjectSchema<T> {
  return new SimpleObjectSchema(definition);
}
