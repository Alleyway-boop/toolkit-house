import { string, number, Validator } from '../src/index';

describe('Validation Package', () => {
  describe('String Validator', () => {
    it('should validate required strings', () => {
      const validator = string().required();
      
      expect(validator.validate('hello').valid).toBe(true);
      expect(validator.validate('').valid).toBe(false);
      expect(validator.validate(null).valid).toBe(false);
      expect(validator.validate(undefined).valid).toBe(false);
    });

    it('should validate string length', () => {
      const validator = string().minLength(5).maxLength(10);
      
      expect(validator.validate('hello').valid).toBe(true);
      expect(validator.validate('hello world').valid).toBe(false);
      expect(validator.validate('hi').valid).toBe(false);
    });

    it('should validate email format', () => {
      const validator = string().email();
      
      expect(validator.validate('test@example.com').valid).toBe(true);
      expect(validator.validate('invalid-email').valid).toBe(false);
      expect(validator.validate('test@').valid).toBe(false);
    });

    it('should validate URL format', () => {
      const validator = string().url();
      
      expect(validator.validate('https://example.com').valid).toBe(true);
      expect(validator.validate('http://localhost:3000').valid).toBe(true);
      expect(validator.validate('not-a-url').valid).toBe(false);
    });
  });

  describe('Number Validator', () => {
    it('should validate required numbers', () => {
      const validator = number().required();
      
      expect(validator.validate(42).valid).toBe(true);
      expect(validator.validate(0).valid).toBe(true);
      expect(validator.validate(null).valid).toBe(false);
      expect(validator.validate(undefined).valid).toBe(false);
    });

    it('should validate number range', () => {
      const validator = number().min(10).max(100);
      
      expect(validator.validate(50).valid).toBe(true);
      expect(validator.validate(5).valid).toBe(false);
      expect(validator.validate(150).valid).toBe(false);
    });

    it('should validate integer constraint', () => {
      const validator = number().integer();
      
      expect(validator.validate(42).valid).toBe(true);
      expect(validator.validate(42.5).valid).toBe(false);
    });
  });

  describe('Object Schema', () => {
    it('should validate object schemas', () => {
      const schema = Validator.shape({
        name: string().required(),
        age: number().required().min(18),
        email: string().email(),
      });
      
      expect(schema.validate({
        name: 'John Doe',
        age: 25,
        email: 'john@example.com'
      }).valid).toBe(true);
      
      expect(schema.validate({
        name: '',
        age: 16,
        email: 'invalid'
      }).valid).toBe(false);
    });
  });

  describe('Validator API', () => {
    it('should provide static factory methods', () => {
      expect(Validator.string()).toBeDefined();
      expect(Validator.number()).toBeDefined();
    });

    it('should work with utility functions', () => {
      const validator = string().required();
      const result = validator.validate('test');
      
      expect(result.valid).toBe(true);
      expect(result.data).toBe('test');
    });
  });
});
