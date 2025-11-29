import { describe, it, expect } from 'vitest';
import { string, number, validator, schema } from '../src/index';

describe('Validation Library - Basic Tests', () => {
  describe('String Validator', () => {
    it('should validate required strings', () => {
      const validator = string().required();
      
      expect(validator.validate('hello').valid).toBe(true);
      expect(validator.validate('').valid).toBe(false);
      expect(validator.validate(null).valid).toBe(false);
      expect(validator.validate(undefined).valid).toBe(false);
    });

    it('should validate email addresses', () => {
      const emailValidator = string().email();
      
      expect(emailValidator.validate('test@example.com').valid).toBe(true);
      expect(emailValidator.validate('invalid-email').valid).toBe(false);
      expect(emailValidator.validate('test@.com').valid).toBe(false);
    });

    it('should validate length constraints', () => {
      const validator = string().minLength(3).maxLength(10);
      
      expect(validator.validate('abc').valid).toBe(true);
      expect(validator.validate('ab').valid).toBe(false);
      expect(validator.validate('abcdefghijkl').valid).toBe(false);
    });

    it('should validate patterns', () => {
      const validator = string().pattern(/^[A-Z][a-z]+$/);
      
      expect(validator.validate('Hello').valid).toBe(true);
      expect(validator.validate('hello').valid).toBe(false);
      expect(validator.validate('HELLO').valid).toBe(false);
    });

    it('should transform strings', () => {
      const validator = string().trim().lowercase();
      
      const result = validator.validate('  HELLO WORLD  ');
      expect(result.valid).toBe(true);
      expect(result.data).toBe('hello world');
    });
  });

  describe('Number Validator', () => {
    it('should validate required numbers', () => {
      const validator = number().required();
      
      expect(validator.validate(42).valid).toBe(true);
      expect(validator.validate('42').valid).toBe(true);
      expect(validator.validate(null).valid).toBe(false);
      expect(validator.validate(undefined).valid).toBe(false);
    });

    it('should validate numeric ranges', () => {
      const validator = number().min(10).max(100);
      
      expect(validator.validate(50).valid).toBe(true);
      expect(validator.validate(5).valid).toBe(false);
      expect(validator.validate(150).valid).toBe(false);
    });

    it('should validate integers', () => {
      const validator = number().integer();
      
      expect(validator.validate(42).valid).toBe(true);
      expect(validator.validate('42').valid).toBe(true);
      expect(validator.validate(42.5).valid).toBe(false);
      expect(validator.validate('42.5').valid).toBe(false);
    });

    it('should validate positive numbers', () => {
      const validator = number().positive();
      
      expect(validator.validate(42).valid).toBe(true);
      expect(validator.validate(0).valid).toBe(false);
      expect(validator.validate(-5).valid).toBe(false);
    });

    it('should validate precision', () => {
      const validator = number().precision(2);
      
      expect(validator.validate(42.5).valid).toBe(true);
      expect(validator.validate(42.567).valid).toBe(false);
      expect(validator.validate('42.567').valid).toBe(false);
    });
  });

  describe('Schema Validation', () => {
    it('should validate simple objects', () => {
      const userSchema = schema({
        name: string().minLength(2).required(),
        age: number().min(18).max(120),
        email: string().email().required(),
      });

      const validData = {
        name: 'John Doe',
        age: 25,
        email: 'john@example.com',
      };

      const invalidData = {
        name: 'J',
        age: 150,
        email: 'invalid-email',
      };

      expect(userSchema.parse(validData).valid).toBe(true);
      expect(userSchema.parse(invalidData).valid).toBe(false);
    });

    it('should provide detailed error information', () => {
      const userSchema = schema({
        name: string().minLength(2).required(),
        age: number().min(18).max(120),
        email: string().email().required(),
      });

      const result = userSchema.parse({
        name: 'J',
        age: 150,
        email: 'invalid-email',
      });

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(error => error.code === 'minLength')).toBe(true);
      expect(result.errors.some(error => error.code === 'max')).toBe(true);
      expect(result.errors.some(error => error.code === 'email')).toBe(true);
    });

    it('should handle optional fields', () => {
      const schema = schema({
        required: string().required(),
        optional: string().optional(),
      });

      expect(schema.parse({ required: 'test' }).valid).toBe(true);
      expect(schema.parse({ required: 'test', optional: 'value' }).valid).toBe(true);
    });

    it('should transform values', () => {
      const schema = schema({
        username: string().trim().lowercase(),
        age: number().transform(Number),
      });

      const result = schema.parse({
        username: '  JOHNDOE  ',
        age: '25',
      });

      expect(result.valid).toBe(true);
      expect(result.data.username).toBe('johndoe');
      expect(result.data.age).toBe(25);
    });
  });

  describe('Validator Class', () => {
    it('should provide static methods for creating validators', () => {
      const stringValidator = validator.string().required();
      const numberValidator = validator.number().min(0);
      const booleanValidator = validator.boolean();
      const dateValidator = validator.date();

      expect(stringValidator.validate('test').valid).toBe(true);
      expect(numberValidator.validate(42).valid).toBe(true);
      expect(booleanValidator.validate(true).valid).toBe(true);
      expect(dateValidator.validate(new Date()).valid).toBe(true);
    });

    it('should create shape validators', () => {
      const userShape = validator.shape({
        name: validator.string().required(),
        age: validator.number().min(18),
      });

      const result = userShape.parse({
        name: 'John',
        age: 25,
      });

      expect(result.valid).toBe(true);
      expect(result.data.name).toBe('John');
      expect(result.data.age).toBe(25);
    });
  });

  describe('Utility Functions', () => {
    it('should validate with utility functions', () => {
      const validator = string().email();
      const result = validator.validate('test@example.com');
      
      expect(result.valid).toBe(true);
      expect(result.data).toBe('test@example.com');
    });

    it('should check validity', () => {
      const validator = string().required();
      expect(validator.validate('hello').valid).toBe(true);
      expect(validator.validate('').valid).toBe(false);
    });
  });
});
