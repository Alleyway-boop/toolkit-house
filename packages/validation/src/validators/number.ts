/**
 * Number validators with fluent API
 */

import {
  BaseValidator,
  createBaseValidator,
  Validator,
  ValidatorConfig,
  ValidationError,
  ValidationContext,
  ValidationResult,
  NumberValidatorConfig
} from './base';
import { TypeGuards } from '../types';
import { isNumeric, isInteger, isFloat } from '@toolkit-house/ts-utils';

// MARKER: Number Validator Class

/**
 * Number validator with fluent API
 */
export class NumberValidator extends BaseValidator<number> {
  constructor(config: NumberValidatorConfig = {}) {
    super(config);
    
    // Add type validator
    this.addValidator((value, context) => {
      if (!TypeGuards.isNumber(value) && !isNumeric(value)) {
        return {
          path: context?.path || [],
          message: 'Must be a number',
          code: 'type',
          value,
        };
      }
      return null;
    });

    // Add number-specific validators
    this.addRangeValidator(config.min, config.max);
    this.addPrecisionValidator(config.precision);
    this.addIntegerValidator(config.integer);
    this.addSignValidators(config.positive, config.negative);
    this.addStepValidator(config.step);
  }

  // MARKER: Chainable Methods

  /**
   * Set minimum value
   */
  min(min: number): this {
    const newValidator = new NumberValidator({
      ...this.config,
      min,
    });
    newValidator.validators = [...this.validators];
    return newValidator as this;
  }

  /**
   * Set maximum value
   */
  max(max: number): this {
    const newValidator = new NumberValidator({
      ...this.config,
      max,
    });
    newValidator.validators = [...this.validators];
    return newValidator as this;
  }

  /**
   * Set value range
   */
  range(min: number, max: number): this {
    const newValidator = new NumberValidator({
      ...this.config,
      min,
      max,
    });
    newValidator.validators = [...this.validators];
    return newValidator as this;
  }

  /**
   * Set precision validation
   */
  precision(decimalPlaces: number): this {
    const newValidator = new NumberValidator({
      ...this.config,
      precision: decimalPlaces,
    });
    newValidator.validators = [...this.validators];
    return newValidator as this;
  }

  /**
   * Require integer value
   */
  integer(): this {
    const newValidator = new NumberValidator({
      ...this.config,
      integer: true,
    });
    newValidator.validators = [...this.validators];
    return newValidator as this;
  }

  /**
   * Require positive number
   */
  positive(): this {
    const newValidator = new NumberValidator({
      ...this.config,
      positive: true,
    });
    newValidator.validators = [...this.validators];
    return newValidator as this;
  }

  /**
   * Require negative number
   */
  negative(): this {
    const newValidator = new NumberValidator({
      ...this.config,
      negative: true,
    });
    newValidator.validators = [...this.validators];
    return newValidator as this;
  }

  /**
   * Set step validation
   */
  step(step: number): this {
    const newValidator = new NumberValidator({
      ...this.config,
      step,
    });
    newValidator.validators = [...this.validators];
    return newValidator as this;
  }

  /**
   * Require finite number (not NaN or Infinity)
   */
  finite(): this {
    const newValidator = new NumberValidator({
      ...this.config,
      finite: true,
    });
    newValidator.validators = [...this.validators];
    return newValidator as this;
  }

  /**
   * Require positive integer
   */
  positiveInteger(): this {
    return this.positive().integer();
  }

  /**
   * Require negative integer
   */
  negativeInteger(): this {
    return this.negative().integer();
  }

  // MARKER: Protected Methods

  /**
   * Add range validator
   */
  private addRangeValidator(min?: number, max?: number): void {
    if (min !== undefined || max !== undefined) {
      this.addValidator((value, context) => {
        if (!isNumeric(value)) return null;
        
        const numValue = parseFloat(value as unknown as string);
        let message = '';
        
        if (min !== undefined && numValue < min) {
          message = 'Must be at least ' + min;
          return {
            path: context?.path || [],
            message,
            code: 'min',
            value,
            meta: { min },
          };
        }
        
        if (max !== undefined && numValue > max) {
          message = 'Must be at most ' + max;
          return {
            path: context?.path || [],
            message,
            code: 'max',
            value,
            meta: { max },
          };
        }
        
        return null;
      });
    }
  }

  /**
   * Add precision validator
   */
  private addPrecisionValidator(decimalPlaces?: number): void {
    if (decimalPlaces !== undefined) {
      this.addValidator((value, context) => {
        if (!isNumeric(value)) return null;
        
        const numValue = parseFloat(value as unknown as string);
        const decimalStr = numValue.toString();
        const decimalIndex = decimalStr.indexOf('.');
        
        if (decimalIndex !== -1) {
          const actualDecimalPlaces = decimalStr.length - decimalIndex - 1;
          
          if (actualDecimalPlaces > decimalPlaces) {
            return {
              path: context?.path || [],
              message: 'Maximum ' + decimalPlaces + ' decimal places allowed',
              code: 'precision',
              value,
              meta: { precision: decimalPlaces },
            };
          }
        }
        
        return null;
      });
    }
  }

  /**
   * Add integer validator
   */
  private addIntegerValidator(integer?: boolean): void {
    if (integer) {
      this.addValidator((value, context) => {
        if (!isNumeric(value)) return null;
        
        if (!isInteger(value)) {
          return {
            path: context?.path || [],
            message: 'Must be an integer',
            code: 'integer',
            value,
          };
        }
        
        return null;
      });
    }
  }

  /**
   * Add sign validators
   */
  private addSignValidators(positive?: boolean, negative?: boolean): void {
    if (positive) {
      this.addValidator((value, context) => {
        if (!isNumeric(value)) return null;
        
        const numValue = parseFloat(value as unknown as string);
        
        if (numValue <= 0) {
          return {
            path: context?.path || [],
            message: 'Must be positive',
            code: 'positive',
            value,
          };
        }
        
        return null;
      });
    }

    if (negative) {
      this.addValidator((value, context) => {
        if (!isNumeric(value)) return null;
        
        const numValue = parseFloat(value as unknown as string);
        
        if (numValue >= 0) {
          return {
            path: context?.path || [],
            message: 'Must be negative',
            code: 'negative',
            value,
          };
        }
        
        return null;
      });
    }
  }

  /**
   * Add step validator
   */
  private addStepValidator(step?: number): void {
    if (step !== undefined && step > 0) {
      this.addValidator((value, context) => {
        if (!isNumeric(value)) return null;
        
        const numValue = parseFloat(value as unknown as string);
        const remainder = Math.abs(numValue % step);
        
        // Check if the remainder is close to 0 or close to step
        const tolerance = 1e-10;
        if (remainder > tolerance && (step - remainder) > tolerance) {
          return {
            path: context?.path || [],
            message: 'Must be a multiple of ' + step,
            code: 'step',
            value,
            meta: { step },
          };
        }
        
        return null;
      });
    }
  }

  // MARKER: Override validate method for transformations

  validate(value: unknown, context?: ValidationContext) {
    // Apply numeric conversion first
    let transformedValue = value;
    
    if (isNumeric(value)) {
      transformedValue = parseFloat(value as unknown as string);
    }

    // Call parent validate with transformed value
    return super.validate(transformedValue, context);
  }
}

// MARKER: Factory Function

/**
 * Create a new number validator
 */
export function number(config: NumberValidatorConfig = {}): NumberValidator {
  return new NumberValidator(config);
}

// MARKER: Validator Utilities

/**
 * Validate a number with specific rules
 */
export function validateNumber(value: unknown, min?: number, max?: number): ValidationResult<number> {
  const validator = number();
  
  if (min !== undefined && max !== undefined) {
    return validator.range(min, max).validate(value);
  } else if (min !== undefined) {
    return validator.min(min).validate(value);
  } else if (max !== undefined) {
    return validator.max(max).validate(value);
  }
  
  return validator.validate(value);
}

/**
 * Check if a value is a valid number
 */
export function isValidNumber(value: unknown): value is number {
  return TypeGuards.isNumber(value) && isFinite(value);
}

/**
 * Check if a value is a finite number (not NaN or Infinity)
 */
export function isFiniteNumber(value: unknown): value is number {
  return TypeGuards.isNumber(value) && isFinite(value) && !isNaN(value);
}

/**
 * Check if a value is an integer
 */
export function isValidInteger(value: unknown): value is number {
  return isInteger(value);
}

/**
 * Check if a value is a float
 */
export function isValidFloat(value: unknown): value is number {
  return isFloat(value);
}

/**
 * Check if a number is within a range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Check if a number has a specific precision
 */
export function hasPrecision(value: number, decimalPlaces: number): boolean {
  const decimalStr = value.toString();
  const decimalIndex = decimalStr.indexOf('.');
  
  if (decimalIndex === -1) return true;
  
  const actualDecimalPlaces = decimalStr.length - decimalIndex - 1;
  return actualDecimalPlaces <= decimalPlaces;
}

/**
 * Check if a number is a multiple of step
 */
export function isMultipleOf(value: number, step: number): boolean {
  const remainder = Math.abs(value % step);
  const tolerance = 1e-10;
  return remainder < tolerance || (step - remainder) < tolerance;
}
