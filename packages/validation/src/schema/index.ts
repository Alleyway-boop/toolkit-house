/**
 * Schema-based validation system
 */

import {
  Schema,
  SchemaDefinition,
  PartialSchema,
  ValidationResult,
  ValidationError,
  ValidationContext,
  Validator,
  DeepPartial,
  Requiredify
} from '../types';

// MARKER: Schema Class

/**
 * Schema for validating objects with type-safe rules
 */
export class ObjectSchema<T extends Record<string, any>> implements Schema<T> {
  private definition: SchemaDefinition<T>;
  private options: {
    strict: boolean;
    abortEarly: boolean;
    stripUnknown: boolean;
    recursive: boolean;
    context?: ValidationContext;
    messages?: Record<string, string>;
  };

  constructor(definition: SchemaDefinition<T>, options: {
    strict?: boolean;
    abortEarly?: boolean;
    stripUnknown?: boolean;
    recursive?: boolean;
    context?: ValidationContext;
    messages?: Record<string, string>;
  } = {}) {
    this.definition = definition;
    this.options = {
      strict: false,
      abortEarly: false,
      stripUnknown: false,
      recursive: true,
      ...options,
    };
  }

  /**
   * Parse and validate input data
   */
  parse(value: unknown, context?: ValidationContext): ValidationResult<T> {
    if (value === undefined || value === null) {
      return {
        valid: false,
        errors: [{
          path: [],
          message: 'Value is required',
          code: 'required',
          value,
        }],
        value,
      };
    }

    if (!Array.isArray(value) && typeof value !== 'object') {
      return {
        valid: false,
        errors: [{
          path: [],
          message: 'Expected an object',
          code: 'type',
          value,
        }],
        value,
      };
    }

    const finalContext: ValidationContext = {
      ...this.options.context,
      ...context,
      root: value,
    };

    const errors: ValidationError[] = [];
    const result: Record<string, any> = {};

    // Validate known fields
    for (const [key, validator] of Object.entries(this.definition)) {
      const fieldResult = validator((value as any)[key], {
        ...finalContext,
        path: [...(finalContext.path || []), key],
      });

      if (!fieldResult.valid) {
        errors.push(...fieldResult.errors.map(error => ({
          ...error,
          path: [...(finalContext.path || []), key, ...error.path],
        })));
      } else {
        result[key] = fieldResult.data;
      }

      if (this.options.abortEarly && errors.length > 0) {
        break;
      }
    }

    // Check for unknown fields in strict mode
    if (this.options.strict) {
      const knownKeys = Object.keys(this.definition);
      const inputKeys = Object.keys(value as object);
      
      for (const key of inputKeys) {
        if (!knownKeys.includes(key)) {
          errors.push({
            path: [...(finalContext.path || []), key],
            message: `Unknown field: ${key}`,
            code: 'unknown',
            value: (value as any)[key],
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

  /**
   * Update schema definition
   */
  with<U extends Record<string, any>>(newDefinition: Partial<SchemaDefinition<T>>): ObjectSchema<T> {
    const mergedDefinition = { ...this.definition, ...newDefinition };
    return new ObjectSchema(mergedDefinition, this.options);
  }

  /**
   * Configure schema options
   */
  configure(options: Partial<ObjectSchema<T>['options']>): ObjectSchema<T> {
    return new ObjectSchema(this.definition, { ...this.options, ...options });
  }

  /**
   * Set strict mode
   */
  strict(): ObjectSchema<T> {
    return this.configure({ strict: true });
  }

  /**
   * Set abort early mode
   */
  abortEarly(): ObjectSchema<T> {
    return this.configure({ abortEarly: true });
  }

  /**
   * Set strip unknown mode
   */
  stripUnknown(): ObjectSchema<T> {
    return this.configure({ stripUnknown: true });
  }
}

// MARKER: Schema Factory Functions

/**
 * Create an object schema
 */
export function schema<T extends Record<string, any>>(
  definition: SchemaDefinition<T>,
  options?: ObjectSchema<T>['options']
): ObjectSchema<T> {
  return new ObjectSchema(definition, options);
}

/**
 * Create a partial schema
 */
export function partialSchema<T extends Record<string, any>>(
  definition: PartialSchema<T>
): ObjectSchema<DeepPartial<T>> {
  return new ObjectSchema(definition as any);
}

/**
 * Create a required schema
 */
export function requiredSchema<T extends Record<string, any>>(
  definition: SchemaDefinition<T>
): ObjectSchema<Requiredify<T>> {
  return new ObjectSchema(definition);
}

// MARKER: Array Schema

/**
 * Schema for validating arrays
 */
export class ArraySchema<T> implements Schema<T[]> {
  private itemValidator: Validator<T>;
  private options: {
    minItems?: number;
    maxItems?: number;
    unique?: boolean;
    strict?: boolean;
    abortEarly?: boolean;
    context?: ValidationContext;
  };

  constructor(
    itemValidator: Validator<T>,
    options: {
      minItems?: number;
      maxItems?: number;
      unique?: boolean;
      strict?: boolean;
      abortEarly?: boolean;
      context?: ValidationContext;
    } = {}
  ) {
    this.itemValidator = itemValidator;
    this.options = {
      strict: false,
      abortEarly: false,
      ...options,
    };
  }

  /**
   * Parse and validate array data
   */
  parse(value: unknown, context?: ValidationContext): ValidationResult<T[]> {
    if (!Array.isArray(value)) {
      return {
        valid: false,
        errors: [{
          path: [],
          message: 'Expected an array',
          code: 'type',
          value,
        }],
        value,
      };
    }

    const finalContext: ValidationContext = {
      ...this.options.context,
      ...context,
      root: value,
    };

    const errors: ValidationError[] = [];
    const result: T[] = [];

    // Validate array length constraints
    if (this.options.minItems !== undefined && value.length < this.options.minItems) {
      errors.push({
        path: [],
        message: `Array must have at least ${this.options.minItems} items`,
        code: 'minItems',
        value,
        meta: { min: this.options.minItems },
      });
    }

    if (this.options.maxItems !== undefined && value.length > this.options.maxItems) {
      errors.push({
        path: [],
        message: `Array must have at most ${this.options.maxItems} items`,
        code: 'maxItems',
        value,
        meta: { max: this.options.maxItems },
      });
    }

    // Validate each item
    for (let i = 0; i < value.length; i++) {
      const itemResult = this.itemValidator(value[i], {
        ...finalContext,
        path: [...(finalContext.path || []), i],
      });

      if (!itemResult.valid) {
        errors.push(...itemResult.errors.map(error => ({
          ...error,
          path: [...(finalContext.path || []), i, ...error.path],
        })));
      } else {
        result.push(itemResult.data);
      }

      if (this.options.abortEarly && errors.length > 0) {
        break;
      }
    }

    // Check for uniqueness
    if (this.options.unique) {
      const seen = new Set();
      for (let i = 0; i < result.length; i++) {
        const item = result[i];
        const key = JSON.stringify(item);
        
        if (seen.has(key)) {
          errors.push({
            path: [...(finalContext.path || []), i],
            message: 'Array items must be unique',
            code: 'unique',
            value: item,
            meta: { index: i },
          });
        }
        
        seen.add(key);
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
  }

  /**
   * Configure array options
   */
  configure(options: Partial<ArraySchema<T>['options']>): ArraySchema<T> {
    return new ArraySchema(this.itemValidator, { ...this.options, ...options });
  }

  /**
   * Set minimum number of items
   */
  minItems(min: number): ArraySchema<T> {
    return this.configure({ minItems: min });
  }

  /**
   * Set maximum number of items
   */
  maxItems(max: number): ArraySchema<T> {
    return this.configure({ maxItems: max });
  }

  /**
   * Require unique items
   */
  unique(): ArraySchema<T> {
    return this.configure({ unique: true });
  }

  /**
   * Set strict mode
   */
  strict(): ArraySchema<T> {
    return this.configure({ strict: true });
  }

  /**
   * Set abort early mode
   */
  abortEarly(): ArraySchema<T> {
    return this.configure({ abortEarly: true });
  }
}

/**
 * Create an array schema
 */
export function arraySchema<T>(
  itemValidator: Validator<T>,
  options?: ArraySchema<T>['options']
): ArraySchema<T> {
  return new ArraySchema(itemValidator, options);
}

// MARKER: Conditional Schema

/**
 * Conditional schema with dependencies
 */
export class ConditionalSchema<T> implements Schema<T> {
  private rules: Array<{
    condition: (context: ValidationContext) => boolean;
    then: Validator<T>;
    otherwise?: Validator<T>;
  }>;

  constructor(rules: Array<{
    condition: (context: ValidationContext) => boolean;
    then: Validator<T>;
    otherwise?: Validator<T>;
  }>) {
    this.rules = rules;
  }

  /**
   * Parse and validate conditional data
   */
  parse(value: unknown, context?: ValidationContext): ValidationResult<T> {
    const finalContext: ValidationContext = {
      root: context?.root,
      ...context,
    };

    // Find the first matching rule
    for (const rule of this.rules) {
      if (rule.condition(finalContext)) {
        return rule.then(value, finalContext);
      }
    }

    // If no rule matches, use the last 'otherwise' validator if available
    const lastRule = this.rules[this.rules.length - 1];
    if (lastRule && lastRule.otherwise) {
      return lastRule.otherwise(value, finalContext);
    }

    return {
      valid: false,
      errors: [{
        path: [],
        message: 'No matching validation rule found',
        code: 'no_match',
        value,
      }],
      value,
    };
  }

  /**
   * Add another rule
   */
  addRule(
    condition: (context: ValidationContext) => boolean,
    then: Validator<T>,
    otherwise?: Validator<T>
  ): ConditionalSchema<T> {
    return new ConditionalSchema([...this.rules, { condition, then, otherwise }]);
  }
}

/**
 * Create a conditional schema
 */
export function conditionalSchema<T>(
  condition: (context: ValidationContext) => boolean,
  then: Validator<T>,
  otherwise?: Validator<T>
): ConditionalSchema<T> {
  return new ConditionalSchema([{ condition, then, otherwise }]);
}

// MARKER: Utility Functions

/**
 * Validate a value against a schema
 */
export function validate<T>(
  schema: Schema<T>,
  value: unknown,
  context?: ValidationContext
): ValidationResult<T> {
  return schema.parse(value, context);
}

/**
 * Check if a value is valid according to a schema
 */
export function isValid<T>(
  schema: Schema<T>,
  value: unknown,
  context?: ValidationContext
): value is T {
  return schema.parse(value, context).valid;
}

/**
 * Create a schema that validates optional fields
 */
export function optional<T>(
  validator: Validator<T>
): Validator<T | undefined> {
  return (value, context) => {
    if (value === undefined) {
      return {
        valid: true,
        data: value,
      };
    }
    return validator(value, context);
  };
}

/**
 * Create a schema that validates nullable fields
 */
export function nullable<T>(
  validator: Validator<T>
): Validator<T | null> {
  return (value, context) => {
    if (value === null) {
      return {
        valid: true,
        data: value,
      };
    }
    return validator(value, context);
  };
}

/**
 * Create a schema that validates optional or nullable fields
 */
export function optionalNullable<T>(
  validator: Validator<T>
): Validator<T | null | undefined> {
  return (value, context) => {
    if (value === null || value === undefined) {
      return {
        valid: true,
        data: value,
      };
    }
    return validator(value, context);
  };
}
