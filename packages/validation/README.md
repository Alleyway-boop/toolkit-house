# @toolkit-house/validation

Type-safe validation library with fluent API leveraging ts-utils.

## Features

- **Chainable validator API** - Build complex validations with method chaining
- **Schema-based validation** - Define object schemas with nested validation
- **Built-in validators** - Common validators for string, number, boolean, array, object
- **TypeScript type safety** - Full type inference for validated data
- **Error handling** - Detailed error messages with paths and codes
- **Performance optimized** - Efficient validation with early exit
- **Zero runtime dependencies** - Only depends on ts-utils for type utilities

## Installation

```bash
pnpm add @toolkit-house/validation
```

## Quick Start

```typescript
import { Validator } from '@toolkit-house/validation'

// Simple string validation
const emailValidator = Validator.string()
  .email()
  .minLength(5)
  .maxLength(100)

const result = emailValidator.validate('test@example.com')
if (result.valid) {
  console.log(result.data) // TypeScript knows this is a string
} else {
  console.log(result.errors)
}

// Object schema validation
const userSchema = {
  name: Validator.string().minLength(2).required(),
  email: Validator.string().email().required(),
  age: Validator.number().min(18).max(120).required(),
  role: Validator.string().oneOf(['admin', 'user']).optional(),
}

const userResult = Validator.object(userSchema).validate({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
})
```

## API Reference

### Validator

#### `Validator.string()`

Create a string validator with chainable methods.

```typescript
Validator.string()
  .required()
  .email()
  .minLength(5)
  .maxLength(100)
  .pattern(/^[a-z]+$/)
  .oneOf(['allowed', 'values'])
  .custom(value => value.length > 10 || 'Too short')
```

**Methods:**
- `.required()` - Value must be present
- `.optional()` - Value is optional
- `.email()` - Must be a valid email
- `.minLength(n)` - Minimum length
- `.maxLength(n)` - Maximum length
- `.pattern(regex)` - Must match pattern
- `.oneOf(values)` - Must be one of the values
- `.custom(fn)` - Custom validation function

#### `Validator.number()`

Create a number validator.

```typescript
Validator.number()
  .required()
  .min(0)
  .max(100)
  .integer()
  .positive()
```

**Methods:**
- `.required()` - Value must be present
- `.optional()` - Value is optional
- `.min(n)` - Minimum value
- `.max(n)` - Maximum value
- `.integer()` - Must be an integer
- `.positive()` - Must be positive
- `.negative()` - Must be negative

#### `Validator.boolean()`

Create a boolean validator.

```typescript
Validator.boolean().required()
```

#### `Validator.array(itemValidator?)`

Create an array validator.

```typescript
Validator.array(Validator.string().email())
Validator.array() // Any array
```

#### `Validator.object(schema)`

Create an object schema validator.

```typescript
const userSchema = {
  name: Validator.string().required(),
  email: Validator.string().email().required(),
  age: Validator.number().min(18).optional(),
}

Validator.object(userSchema)
```

### ValidationResult

Validation result type returned by validators.

```typescript
interface ValidationResult<T> {
  valid: boolean
  data?: T
  errors?: ValidationError[]
}

interface ValidationError {
  path: (string | number)[]
  message: string
  code: string
  value?: unknown
}
```

## Advanced Usage

### Custom Validators

```typescript
const passwordValidator = Validator.string()
  .minLength(8)
  .custom(password => {
    if (!/[A-Z]/.test(password)) {
      return 'Must contain uppercase letter'
    }
    if (!/[0-9]/.test(password)) {
      return 'Must contain number'
    }
    return true
  })
```

### Nested Validation

```typescript
const addressSchema = {
  street: Validator.string().required(),
  city: Validator.string().required(),
  zip: Validator.string().pattern(/^\d{5}$/).required(),
}

const personSchema = {
  name: Validator.string().required(),
  address: Validator.object(addressSchema).required(),
}
```

### Conditional Validation

```typescript
const formSchema = (hasAddress: boolean) => ({
  name: Validator.string().required(),
  address: hasAddress
    ? Validator.object(addressSchema).required()
    : Validator.object(addressSchema).optional(),
})
```

## Module Exports

```typescript
// Main validator
import { Validator } from '@toolkit-house/validation'

// Types
import type {
  ValidationContext,
  ValidationError,
  ValidationResult,
  Validator as ValidatorType
} from '@toolkit-house/validation/types'

// Schema utilities
import { schema } from '@toolkit-house/validation/schema'

// Validators
import { string, number } from '@toolkit-house/validation/validators'
```

## Dependencies

- `@toolkit-house/ts-utils` (workspace:*) - Core utilities
- `@toolkit-house/types` (workspace:*) - Shared types
- `@toolkit-house/constants` (workspace:*, peer) - Constants

## License

MIT
