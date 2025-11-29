/**
 * String validators with fluent API
 */

import {
  BaseValidator,
  createBaseValidator,
  Validator,
  ValidatorConfig,
  ValidationError,
  ValidationContext,
  ValidationResult,
  StringValidatorConfig
} from './base';
import { TypeGuards } from '../types';
import { isEmail, isURL, isLength } from '@toolkit-house/ts-utils';

// MARKER: String Validator Class

/**
 * String validator with fluent API
 */
export class StringValidator extends BaseValidator<string> {
  constructor(config: StringValidatorConfig = {}) {
    super(config);
    
    // Add type validator
    this.addValidator((value, context) => {
      if (!TypeGuards.isString(value)) {
        return {
          path: context?.path || [],
          message: 'Must be a string',
          code: 'type',
          value,
        };
      }
      return null;
    });

    // Add string-specific validators
    this.addLengthValidator(config.minLength, config.maxLength);
    this.addPatternValidator(config.pattern);
    this.addEmailValidator(config.email);
    this.addURLValidator(config.url);
    this.addTrimValidator(config.trim);
    this.addCaseValidators(config.lowercase, config.uppercase);
  }

  // MARKER: Chainable Methods

  /**
   * Set minimum length
   */
  minLength(min: number): this {
    const newValidator = new StringValidator({
      ...this.config,
      minLength: min,
    });
    newValidator.validators = [...this.validators];
    return newValidator as this;
  }

  /**
   * Set maximum length
   */
  maxLength(max: number): this {
    const newValidator = new StringValidator({
      ...this.config,
      maxLength: max,
    });
    newValidator.validators = [...this.validators];
    return newValidator as this;
  }

  /**
   * Set length range
   */
  length(min: number, max: number): this {
    const newValidator = new StringValidator({
      ...this.config,
      minLength: min,
      maxLength: max,
    });
    newValidator.validators = [...this.validators];
    return newValidator as this;
  }

  /**
   * Set pattern validation
   */
  pattern(regex: RegExp | string): this {
    const newValidator = new StringValidator({
      ...this.config,
      pattern: regex,
    });
    newValidator.validators = [...this.validators];
    return newValidator as this;
  }

  /**
   * Set email validation
   */
  email(): this {
    const newValidator = new StringValidator({
      ...this.config,
      email: true,
    });
    newValidator.validators = [...this.validators];
    return newValidator as this;
  }

  /**
   * Set URL validation
   */
  url(): this {
    const newValidator = new StringValidator({
      ...this.config,
      url: true,
    });
    newValidator.validators = [...this.validators];
    return newValidator as this;
  }

  /**
   * Enable trimming
   */
  trim(): this {
    const newValidator = new StringValidator({
      ...this.config,
      trim: true,
    });
    newValidator.validators = [...this.validators];
    return newValidator as this;
  }

  /**
   * Enable lowercase conversion
   */
  lowercase(): this {
    const newValidator = new StringValidator({
      ...this.config,
      lowercase: true,
    });
    newValidator.validators = [...this.validators];
    return newValidator as this;
  }

  /**
   * Enable uppercase conversion
   */
  uppercase(): this {
    const newValidator = new StringValidator({
      ...this.config,
      uppercase: true,
    });
    newValidator.validators = [...this.validators];
    return newValidator as this;
  }

  /**
   * Set alphanumeric validation
   */
  alphanumeric(): this {
    return this.pattern(/^[a-zA-Z0-9]+$/);
  }

  /**
   * Set alphabetic validation
   */
  alphabetic(): this {
    return this.pattern(/^[a-zA-Z]+$/);
  }

  /**
   * Set numeric validation
   */
  numeric(): this {
    return this.pattern(/^[0-9]+$/);
  }

  /**
   * Set UUID validation
   */
  uuid(): this {
    return this.pattern(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  }

  /**
   * Set strong password validation
   */
  strongPassword(): this {
    return this.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
  }

  // MARKER: Protected Methods

  /**
   * Add length validator
   */
  private addLengthValidator(min?: number, max?: number): void {
    if (min !== undefined || max !== undefined) {
      this.addValidator((value, context) => {
        if (!TypeGuards.isString(value)) return null;
        
        const length = value.length;
        let message = '';
        
        if (min !== undefined && length < min) {
          message = 'Must be at least ' + min + ' characters';
          return {
            path: context?.path || [],
            message,
            code: 'minLength',
            value,
            meta: { min },
          };
        }
        
        if (max !== undefined && length > max) {
          message = 'Must be at most ' + max + ' characters';
          return {
            path: context?.path || [],
            message,
            code: 'maxLength',
            value,
            meta: { max },
          };
        }
        
        return null;
      });
    }
  }

  /**
   * Add pattern validator
   */
  private addPatternValidator(pattern?: RegExp | string): void {
    if (pattern) {
      this.addValidator((value, context) => {
        if (!TypeGuards.isString(value)) return null;
        
        const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
        
        if (!regex.test(value)) {
          return {
            path: context?.path || [],
            message: 'Does not match the required pattern',
            code: 'pattern',
            value,
            meta: { pattern: pattern.toString() },
          };
        }
        
        return null;
      });
    }
  }

  /**
   * Add email validator
   */
  private addEmailValidator(email?: boolean): void {
    if (email) {
      this.addValidator((value, context) => {
        if (!TypeGuards.isString(value)) return null;
        
        if (!isEmail(value)) {
          return {
            path: context?.path || [],
            message: 'Must be a valid email address',
            code: 'email',
            value,
          };
        }
        
        return null;
      });
    }
  }

  /**
   * Add URL validator
   */
  private addURLValidator(url?: boolean): void {
    if (url) {
      this.addValidator((value, context) => {
        if (!TypeGuards.isString(value)) return null;
        
        if (!isURL(value)) {
          return {
            path: context?.path || [],
            message: 'Must be a valid URL',
            code: 'url',
            value,
          };
        }
        
        return null;
      });
    }
  }

  /**
   * Add trim validator
   */
  private addTrimValidator(trim?: boolean): void {
    if (trim) {
      this.addValidator((value, context) => {
        if (!TypeGuards.isString(value)) return null;
        
        if (value !== value.trim()) {
          return {
            path: context?.path || [],
            message: 'String must be trimmed',
            code: 'trim',
            value,
          };
        }
        
        return null;
      });
    }
  }

  /**
   * Add case validators
   */
  private addCaseValidators(lowercase?: boolean, uppercase?: boolean): void {
    if (lowercase) {
      this.addValidator((value, context) => {
        if (!TypeGuards.isString(value)) return null;
        
        if (value !== value.toLowerCase()) {
          return {
            path: context?.path || [],
            message: 'String must be lowercase',
            code: 'lowercase',
            value,
          };
        }
        
        return null;
      });
    }

    if (uppercase) {
      this.addValidator((value, context) => {
        if (!TypeGuards.isString(value)) return null;
        
        if (value !== value.toUpperCase()) {
          return {
            path: context?.path || [],
            message: 'String must be uppercase',
            code: 'uppercase',
            value,
          };
        }
        
        return null;
      });
    }
  }

  // MARKER: Override validate method for transformations

  validate(value: unknown, context?: ValidationContext) {
    // Apply transformations first
    let transformedValue = value;
    
    if (TypeGuards.isString(value) && this.config.trim) {
      transformedValue = value.trim();
    }
    
    if (TypeGuards.isString(transformedValue)) {
      if (this.config.lowercase) {
        transformedValue = transformedValue.toLowerCase();
      }
      
      if (this.config.uppercase) {
        transformedValue = (transformedValue as string).toUpperCase();
      }
    }

    // Call parent validate with transformed value
    return super.validate(transformedValue, context);
  }
}

// MARKER: Factory Function

/**
 * Create a new string validator
 */
export function string(config: StringValidatorConfig = {}): StringValidator {
  return new StringValidator(config);
}

// MARKER: Validator Utilities

/**
 * Validate a string with a specific pattern
 */
export function validateString(value: unknown, pattern?: RegExp | string): ValidationResult<string> {
  const validator = string();
  
  if (pattern) {
    return validator.pattern(pattern).validate(value);
  }
  
  return validator.validate(value);
}

/**
 * Check if a value is a valid string
 */
export function isValidString(value: unknown): value is string {
  return TypeGuards.isString(value);
}

/**
 * Check if a string matches a specific pattern
 */
export function matchesPattern(value: string, pattern: RegExp | string): boolean {
  if (!TypeGuards.isString(value)) return false;
  
  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
  return regex.test(value);
}
