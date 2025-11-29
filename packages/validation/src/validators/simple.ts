/**
 * Simple working validators
 */

import { ValidationResult, ValidationError, ValidationContext, Validator } from '../types';

export class SimpleStringValidator implements Validator<string> {
  private options: {
    required: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    email: boolean;
    url: boolean;
    trim: boolean;
    lowercase: boolean;
    uppercase: boolean;
  } = {
    required: false,
    email: false,
    url: false,
    trim: false,
    lowercase: false,
    uppercase: false,
  };

  constructor() {
    this.options = { ...this.options };
  }

  required(): this {
    this.options.required = true;
    return this;
  }

  minLength(length: number): this {
    this.options.minLength = length;
    return this;
  }

  maxLength(length: number): this {
    this.options.maxLength = length;
    return this;
  }

  pattern(regex: RegExp): this {
    this.options.pattern = regex;
    return this;
  }

  email(): this {
    this.options.email = true;
    return this;
  }

  url(): this {
    this.options.url = true;
    return this;
  }

  trim(): this {
    this.options.trim = true;
    return this;
  }

  lowercase(): this {
    this.options.lowercase = true;
    return this;
  }

  uppercase(): this {
    this.options.uppercase = true;
    return this;
  }

  validate(value: unknown, context?: ValidationContext): ValidationResult<string> {
    // Apply transformations first
    let transformedValue = value;
    
    if (typeof transformedValue === 'string') {
      if (this.options.trim) {
        transformedValue = transformedValue.trim();
      }
      if (this.options.lowercase) {
        transformedValue = transformedValue.toLowerCase();
      }
      if (this.options.uppercase) {
        transformedValue = transformedValue.toUpperCase();
      }
    }

    // Handle null/undefined and empty string for required fields
    if (transformedValue === null || transformedValue === undefined) {
      if (this.options.required) {
        return {
          valid: false,
          errors: [{
            path: context?.path || [],
            message: 'Field is required',
            code: 'required',
            value,
          }],
        };
      }
      return {
        valid: true,
        data: transformedValue as string,
      };
    }

    // Handle wrong type
    if (typeof transformedValue !== 'string') {
      return {
        valid: false,
        errors: [{
          path: context?.path || [],
          message: 'Must be a string',
          code: 'type',
          value,
        }],
      };
    }

    const errors: ValidationError[] = [];

    // Check length constraints
    if (this.options.minLength !== undefined && transformedValue.length < this.options.minLength) {
      errors.push({
        path: context?.path || [],
        message: `Must be at least ${this.options.minLength} characters`,
        code: 'minLength',
        value,
        meta: { min: this.options.minLength },
      });
    }

    if (this.options.maxLength !== undefined && transformedValue.length > this.options.maxLength) {
      errors.push({
        path: context?.path || [],
        message: `Must be at most ${this.options.maxLength} characters`,
        code: 'maxLength',
        value,
        meta: { max: this.options.maxLength },
      });
    }

    // Check pattern
    if (this.options.pattern && !this.options.pattern.test(transformedValue)) {
      errors.push({
        path: context?.path || [],
        message: 'Does not match the required pattern',
        code: 'pattern',
        value,
        meta: { pattern: this.options.pattern.toString() },
      });
    }

    // Check email
    if (this.options.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(transformedValue)) {
        errors.push({
          path: context?.path || [],
          message: 'Must be a valid email address',
          code: 'email',
          value,
        });
      }
    }

    // Check URL
    if (this.options.url) {
      try {
        new URL(transformedValue);
      } catch {
        errors.push({
          path: context?.path || [],
          message: 'Must be a valid URL',
          code: 'url',
          value,
        });
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
      data: transformedValue,
    };
  }
}

export function string(): SimpleStringValidator {
  return new SimpleStringValidator();
}

export class SimpleNumberValidator implements Validator<number> {
  private options: {
    required: boolean;
    min?: number;
    max?: number;
    integer: boolean;
    positive: boolean;
    negative: boolean;
    precision?: number;
    step?: number;
    finite: boolean;
  } = {
    required: false,
    integer: false,
    positive: false,
    negative: false,
    finite: false,
  };

  constructor() {
    this.options = { ...this.options };
  }

  required(): this {
    this.options.required = true;
    return this;
  }

  min(value: number): this {
    this.options.min = value;
    return this;
  }

  max(value: number): this {
    this.options.max = value;
    return this;
  }

  integer(): this {
    this.options.integer = true;
    return this;
  }

  positive(): this {
    this.options.positive = true;
    return this;
  }

  negative(): this {
    this.options.negative = true;
    return this;
  }

  precision(decimalPlaces: number): this {
    this.options.precision = decimalPlaces;
    return this;
  }

  step(stepValue: number): this {
    this.options.step = stepValue;
    return this;
  }

  finite(): this {
    this.options.finite = true;
    return this;
  }

  validate(value: unknown, context?: ValidationContext): ValidationResult<number> {
    // Handle null/undefined and empty string for required fields
    if (value === null || value === undefined) {
      if (this.options.required) {
        return {
          valid: false,
          errors: [{
            path: context?.path || [],
            message: 'Field is required',
            code: 'required',
            value,
          }],
        };
      }
      return {
        valid: true,
        data: value as number,
      };
    }

    // Convert to number if string
    let numValue: number;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      if (isNaN(parsed)) {
        return {
          valid: false,
          errors: [{
            path: context?.path || [],
            message: 'Must be a valid number',
            code: 'type',
            value,
          }],
        };
      }
      numValue = parsed;
    } else if (typeof value !== 'number') {
      return {
        valid: false,
        errors: [{
          path: context?.path || [],
          message: 'Must be a number',
          code: 'type',
          value,
        }],
      };
    } else {
      numValue = value;
    }

    // Check finite constraint
    if (this.options.finite && (!isFinite(numValue) || isNaN(numValue))) {
      return {
        valid: false,
        errors: [{
          path: context?.path || [],
          message: 'Must be a finite number',
          code: 'finite',
          value,
        }],
      };
    }

    const errors: ValidationError[] = [];

    // Check integer constraint
    if (this.options.integer && !Number.isInteger(numValue)) {
      errors.push({
        path: context?.path || [],
        message: 'Must be an integer',
        code: 'integer',
        value,
      });
    }

    // Check range constraints
    if (this.options.min !== undefined && numValue < this.options.min) {
      errors.push({
        path: context?.path || [],
        message: `Must be at least ${this.options.min}`,
        code: 'min',
        value,
        meta: { min: this.options.min },
      });
    }

    if (this.options.max !== undefined && numValue > this.options.max) {
      errors.push({
        path: context?.path || [],
        message: `Must be at most ${this.options.max}`,
        code: 'max',
        value,
        meta: { max: this.options.max },
      });
    }

    // Check sign constraints
    if (this.options.positive && numValue <= 0) {
      errors.push({
        path: context?.path || [],
        message: 'Must be positive',
        code: 'positive',
        value,
      });
    }

    if (this.options.negative && numValue >= 0) {
      errors.push({
        path: context?.path || [],
        message: 'Must be negative',
        code: 'negative',
        value,
      });
    }

    // Check precision constraint
    if (this.options.precision !== undefined) {
      const decimalStr = numValue.toString();
      const decimalIndex = decimalStr.indexOf('.');
      
      if (decimalIndex !== -1) {
        const actualDecimalPlaces = decimalStr.length - decimalIndex - 1;
        
        if (actualDecimalPlaces > this.options.precision) {
          errors.push({
            path: context?.path || [],
            message: `Maximum ${this.options.precision} decimal places allowed`,
            code: 'precision',
            value,
            meta: { precision: this.options.precision },
          });
        }
      }
    }

    // Check step constraint
    if (this.options.step !== undefined && this.options.step > 0) {
      const remainder = Math.abs(numValue % this.options.step);
      
      // Check if the remainder is close to 0 or close to step
      const tolerance = 1e-10;
      if (remainder > tolerance && (this.options.step - remainder) > tolerance) {
        errors.push({
          path: context?.path || [],
          message: `Must be a multiple of ${this.options.step}`,
          code: 'step',
          value,
          meta: { step: this.options.step },
        });
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
      data: numValue,
    };
  }
}

export function number(): SimpleNumberValidator {
  return new SimpleNumberValidator();
}
