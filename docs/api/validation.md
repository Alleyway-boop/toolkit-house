# @toolkit-house/validation API Reference

Type-safe validation library with fluent API.

## Installation

```bash
pnpm add @toolkit-house/validation
```

## Basic Usage

```typescript
import { schema, string, number, boolean, array } from '@toolkit-house/validation'

// Define a schema
const userSchema = schema({
  name: string().required().minLength(2),
  email: string().required().email(),
  age: number().optional().min(18).max(120),
  active: boolean().default(false),
  tags: array(string()).minLength(1),
})

// Validate data
const result = userSchema.validate({
  name: 'John Doe',
  email: 'john@example.com',
  tags: ['developer'],
})

if (result.valid) {
  console.log('Valid!')
} else {
  console.error('Errors:', result.errors)
}
```

## Schema Types

### String Schema

```typescript
import { string } from '@toolkit-house/validation'

const emailSchema = string()
  .required()
  .email()
  .minLength(5)
  .maxLength(100)
  .pattern(/^[a-z0-9]+$/)

const result = emailSchema.validate('test@example.com')
```

**Methods:**
- `required(message?: string)` - Field is required
- `optional()` - Field is optional
- `default(value: string)` - Default value
- `email(message?: string)` - Must be valid email
- `url(message?: string)` - Must be valid URL
- `uuid(message?: string)` - Must be valid UUID
- `minLength(length: number, message?: string)` - Minimum length
- `maxLength(length: number, message?: string)` - Maximum length
- `pattern(regex: RegExp, message?: string)` - Must match pattern
- `oneOf(values: string[], message?: string)` - Must be one of values
- `custom(fn: (value: string) => boolean | string, message?: string)` - Custom validator

### Number Schema

```typescript
import { number } from '@toolkit-house/validation'

const ageSchema = number()
  .required()
  .min(18)
  .max(120)
  .integer()
  .positive()

const result = ageSchema.validate(25)
```

**Methods:**
- `required(message?: string)` - Field is required
- `optional()` - Field is optional
- `default(value: number)` - Default value
- `min(value: number, message?: string)` - Minimum value
- `max(value: number, message?: string)` - Maximum value
- `integer(message?: string)` - Must be integer
- `positive(message?: string)` - Must be positive
- `negative(message?: string)` - Must be negative
- `oneOf(values: number[], message?: string)` - Must be one of values
- `custom(fn: (value: number) => boolean | string, message?: string)` - Custom validator

### Boolean Schema

```typescript
import { boolean } from '@toolkit-house/validation'

const acceptedSchema = boolean()
  .required()
  .default(false)

const result = acceptedSchema.validate(true)
```

**Methods:**
- `required(message?: string)` - Field is required
- `optional()` - Field is optional
- `default(value: boolean)` - Default value

### Array Schema

```typescript
import { array, string } from '@toolkit-house/validation'

const tagsSchema = array(string())
  .required()
  .minLength(1)
  .maxLength(5)

const result = tagsSchema.validate(['tag1', 'tag2'])
```

**Methods:**
- `required(message?: string)` - Field is required
- `optional()` - Field is optional
- `default(value: any[])` - Default value
- `minLength(length: number, message?: string)` - Minimum length
- `maxLength(length: number, message?: string)` - Maximum length
- `unique(message?: string)` - All items must be unique

### Object Schema

```typescript
import { object, string, number } from '@toolkit-house/validation'

const addressSchema = object({
  street: string().required(),
  city: string().required(),
  zipCode: string().pattern(/^\d{5}$/),
})

const userSchema = object({
  name: string().required(),
  address: addressSchema,
})
```

**Methods:**
- `required(message?: string)` - Field is required
- `optional()` - Field is optional
- `default(value: Record<string, any>)` - Default value
- `shape(schema: Record<string, Validator>)` - Define object shape

### Custom Validators

```typescript
import { string } from '@toolkit-house/validation'

const passwordSchema = string()
  .required()
  .minLength(8)
  .custom((value) => {
    if (!/[A-Z]/.test(value)) {
      return 'Must contain at least one uppercase letter'
    }
    if (!/[0-9]/.test(value)) {
      return 'Must contain at least one number'
    }
    return true
  })
```

## Validation Result

```typescript
interface ValidationResult<T> {
  valid: boolean
  data?: T
  errors?: ValidationError[]
}

interface ValidationError {
  field: string
  message: string
  value: any
}
```

## Advanced Usage

### Nested Validation

```typescript
const userSchema = schema({
  name: string().required(),
  posts: array(object({
    title: string().required(),
    content: string().required().minLength(10),
  })),
})
```

### Conditional Validation

```typescript
const schema = object({
  type: string().oneOf(['individual', 'company']),
  companyName: string().when('type', {
    is: 'company',
    then: (s) => s.required(),
    otherwise: (s) => s.optional(),
  }),
})
```

### Transform Values

```typescript
const emailSchema = string()
  .required()
  .email()
  .transform((value) => value.toLowerCase().trim())

const result = emailSchema.validate('  TEST@EXAMPLE.COM  ')
// result.data === 'test@example.com'
```

### Async Validation

```typescript
const usernameSchema = string()
  .required()
  .minLength(3)
  .custom(async (value) => {
    const exists = await checkUsernameExists(value)
    if (exists) {
      return 'Username already taken'
    }
    return true
  })

const result = await usernameSchema.validateAsync('john')
```

## License

MIT
