/**
 * Basic Usage Examples for @toolkit-house/validation
 */

import { 
  validator, 
  string, 
  number, 
  schema,
  arraySchema,
  conditionalSchema,
  validateWith,
  getErrors,
  hasErrors 
} from '../src/index';

// MARKER: Basic Validators

console.log('=== Basic Validators ===');

// String validation
const emailValidator = string()
  .email()
  .required()
  .minLength(5)
  .maxLength(100);

const emailResult = emailValidator.validate('test@example.com');
console.log('Email validation:', emailResult.valid ? 'Valid' : 'Invalid');

const emailResult2 = emailValidator.validate('invalid-email');
console.log('Email validation 2:', emailResult2.valid ? 'Valid' : 'Invalid');
console.log('Errors:', getErrors(emailResult2));

// Number validation
const ageValidator = number()
  .min(18)
  .max(120)
  .integer();

const ageResult = ageValidator.validate(25);
console.log('Age validation:', ageResult.valid ? 'Valid' : 'Invalid');

const ageResult2 = ageValidator.validate(150);
console.log('Age validation 2:', ageResult2.valid ? 'Valid' : 'Invalid');
console.log('Errors:', getErrors(ageResult2));

// MARKER: Schema Validation

console.log('\n=== Schema Validation ===');

// User schema
const userSchema = schema({
  name: string()
    .minLength(2)
    .maxLength(50)
    .required(),
  
  age: number()
    .min(18)
    .max(120)
    .required(),
  
  email: string()
    .email()
    .required(),
  
  website: string()
    .url()
    .optional(),
  
  tags: arraySchema(
    string().minLength(2).maxLength(20),
    { unique: true, maxItems: 10 }
  ),
  
  newsletter: validator.boolean().default(false),
});

const userData = {
  name: 'John Doe',
  age: 25,
  email: 'john@example.com',
  website: 'https://johndoe.com',
  tags: ['developer', 'typescript', 'javascript'],
  newsletter: true,
};

const userResult = userSchema.parse(userData);
console.log('User schema validation:', userResult.valid ? 'Valid' : 'Invalid');
if (userResult.valid) {
  console.log('User data:', userResult.data);
}

// Invalid data
const invalidUserData = {
  name: 'J',
  age: 150,
  email: 'invalid-email',
  tags: ['developer', 'developer'], // Duplicate
};

const invalidResult = userSchema.parse(invalidUserData);
console.log('Invalid user validation:', invalidResult.valid ? 'Valid' : 'Invalid');
console.log('Errors:', invalidResult.errors);

console.log('\n=== Examples Complete ===');
