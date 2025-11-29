/**
 * Simple validation example
 */

import { string, number, Validator } from './dist/index.mjs';

console.log('=== Validation Package Example ===
');

// Example 1: Email validation
const emailValidator = string().email().required();
const emailResult = emailValidator.validate('test@example.com');
console.log('1. Email validation:', emailResult);

const invalidEmailResult = emailValidator.validate('invalid-email');
console.log('   Invalid email:', invalidEmailResult);

// Example 2: Number validation
const ageValidator = number().required().min(18).max(120).integer();
const ageResult = ageValidator.validate(25);
console.log('
2. Age validation:', ageResult);

const invalidAgeResult = ageValidator.validate(16);
console.log('   Invalid age:', invalidAgeResult);

// Example 3: String transformations
const usernameValidator = string().trim().lowercase();
const usernameResult = usernameValidator.validate('  JOHN DOE  ');
console.log('
3. Username transformation:', usernameResult);

// Example 4: String length validation
const passwordValidator = string().required().minLength(8).maxLength(20);
const passwordResult = passwordValidator.validate('securepassword123');
console.log('
4. Password validation:', passwordResult);

// Example 5: Pattern validation
const phoneValidator = string().pattern(/^[+]?[1-9]\d{1,14}$/);
const phoneResult = phoneValidator.validate('+1234567890');
console.log('
5. Phone validation:', phoneResult);

console.log('
=== Example completed successfully\! ===');
