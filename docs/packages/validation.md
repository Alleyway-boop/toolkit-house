---
title: "@toolkit-house/validation"
description: Type-safe validation library with fluent API leveraging ts-utils
chineseTitle: "@toolkit-house/validation"
chineseDescription: 类型安全的验证库，具有流式API，利用ts-utils
---

# @toolkit-house/validation

Type-safe validation library with fluent API leveraging ts-utils.

## Introduction

`@toolkit-house/validation` is a powerful, type-safe validation library that provides a fluent API for validating data in TypeScript applications. It's built with performance and type safety in mind, leveraging the comprehensive ts-utils library for advanced validation capabilities.

### What It Does
- Validates data with type-safe schema definitions
- Provides a fluent, chainable API for complex validation rules
- Includes built-in validators for common data types
- Supports custom validation logic
- Handles error localization and formatting
- Zero runtime dependencies

### When to Use It
- Form validation in React/Vue applications
- API input validation and sanitization
- Configuration validation
- Data integrity checks in business logic
- Type-safe data processing pipelines

## Installation

```bash
pnpm add @toolkit-house/validation
```

## Quick Start

```typescript
import { Validator, string, number, object, email, required } from '@toolkit-house/validation'

// Simple validation
const emailValidator = string().email().required()
const result = emailValidator.validate('user@example.com')
console.log(result.isValid) // true

// Object validation
const userSchema = object({
  name: string().minLength(2).maxLength(50),
  age: number().min(18).max(120),
  email: string().email().required(),
  preferences: object({
    newsletter: boolean().default(false),
    theme: string().oneOf(['light', 'dark']).default('light')
  })
})

const userData = {
  name: 'John Doe',
  age: 25,
  email: 'john@example.com'
}

const validationResult = userSchema.validate(userData)
if (validationResult.isValid) {
  console.log('Valid data:', validationResult.value)
} else {
  console.log('Validation errors:', validationResult.errors)
}
```

## Key Features

### 1. Fluent API with Chainable Validators

```typescript
import { Validator } from '@toolkit-house/validation'

// Chain multiple validation rules
const usernameValidator = string()
  .minLength(3)
  .maxLength(20)
  .pattern(/^[a-zA-Z0-9_]+$/)
  .required()

const passwordValidator = string()
  .minLength(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .required()
```

### 2. Schema-Based Validation

```typescript
import { object, string, number, array, enum as enumType } from '@toolkit-house/validation'

// Complex object schema
const productSchema = object({
  id: string().uuid(),
  name: string().required(),
  price: number().positive(),
  category: string().oneOf(['electronics', 'clothing', 'books']),
  tags: array().of(string().minLength(1)),
  specifications: object({
    color: string().optional(),
    size: string().optional(),
    weight: number().optional()
  })
})
```

### 3. Built-in Validators

```typescript
import { string, number, boolean, array, object, email, url, uuid, date } from '@toolkit-house/validation'

// String validators
string()
  .required() // Value must exist
  .minLength(5) // Minimum length
  .maxLength(100) // Maximum length
  .pattern(/^[a-zA-Z]+$/) // Regex pattern
  .email() // Valid email format
  .url() // Valid URL format
  .uuid() // Valid UUID format

// Number validators
number()
  .required()
  .min(0) // Minimum value
  .max(100) // Maximum value
  .positive() // Greater than 0
  .negative() // Less than 0
  .integer() // Whole number

// Array validators
array()
  .required()
  .minLength(1) // Minimum items
  .maxLength(10) // Maximum items
  .of(string().email()) // Each item must be an email
```

### 4. Custom Validators

```typescript
import { Validator } from '@toolkit-house/validation'

// Custom string validator
const customStringValidator = string()
  .custom((value, schema) => {
    if (value.includes(' ')) {
      return { isValid: false, error: 'No spaces allowed' }
    }
    return { isValid: true }
  })

// Custom object validator
const customObjectValidator = object({
  username: string().required(),
  preferences: object({
    darkMode: boolean()
  }).custom((obj, schema) => {
    // Custom business logic
    if (obj.username === 'admin' && !obj.preferences.darkMode) {
      return { isValid: false, error: 'Admin must use dark mode' }
    }
    return { isValid: true }
  })
})
```

### 5. Error Handling and Localization

```typescript
import { Validator, setLocale } from '@toolkit-house/validation'

// Set error messages in different languages
setLocale({
  required: 'This field is required',
  minLength: 'Minimum length is {min}',
  maxLength: 'Maximum length is {max}',
  email: 'Please enter a valid email address',
  pattern: 'Format is invalid'
})

// Validate and get detailed errors
const result = string().required().minLength(5).validate('')
if (!result.isValid) {
  result.errors.forEach(error => {
    console.log(error.path, error.message, error.value)
  })
}
```

## Common Use Cases

### 1. Form Validation

```typescript
// React form example
import { useState } from 'react'
import { Validator, string, number, email } from '@toolkit-house/validation'

const loginSchema = object({
  email: string().email().required(),
  password: string().minLength(6).required()
})

function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = loginSchema.validate(formData)

    if (result.isValid) {
      // Submit form
      console.log('Submitting:', formData)
    } else {
      // Display errors
      const errorMap: Record<string, string> = {}
      result.errors.forEach(error => {
        errorMap[error.path] = error.message
      })
      setErrors(errorMap)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>
      <button type="submit">Login</button>
    </form>
  )
}
```

### 2. API Input Validation

```typescript
// API endpoint validation
import { object, string, number } from '@toolkit-house/validation'
import { NextRequest, NextResponse } from 'next/server'

const createUserSchema = object({
  name: string().minLength(2).maxLength(50),
  email: string().email(),
  age: number().min(18).max(120),
  role: string().oneOf(['user', 'admin']).default('user')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validationResult = createUserSchema.validate(body)

    if (!validationResult.isValid) {
      return NextResponse.json(
        { errors: validationResult.errors },
        { status: 400 }
      )
    }

    // Process valid data
    const user = { ...validationResult.value, id: generateId() }
    await saveUser(user)

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
```

### 3. Configuration Validation

```typescript
// Validate application configuration
import { object, string, number, boolean } from '@toolkit-house/validation'

const configSchema = object({
  database: object({
    host: string().required(),
    port: number().min(1).max(65535),
    username: string().required(),
    password: string().required(),
    ssl: boolean().default(true)
  }),
  server: object({
    port: number().default(3000),
    cors: boolean().default(true),
    rateLimit: number().min(1).max(10000)
  }),
  features: object({
    experimental: boolean().default(false),
    analytics: boolean().default(false)
  })
})

function validateConfig(config: unknown) {
  const result = configSchema.validate(config)
  if (!result.isValid) {
    throw new Error(`Invalid configuration: ${result.errors.map(e => e.message).join(', ')}`)
  }
  return result.value
}

// Usage
const config = {
  database: {
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: 'secret123',
    ssl: true
  },
  server: {
    port: 8080,
    cors: true,
    rateLimit: 100
  },
  features: {
    experimental: true,
    analytics: false
  }
}

const validatedConfig = validateConfig(config)
console.log('Valid config:', validatedConfig)
```

## API Reference

### Main Classes

- `Validator` - Main validator class providing fluent API
- `ValidationResult` - Result object containing validation outcome
- `ValidationError` - Individual validation error details

### Core Modules

- `@toolkit-house/validation/schema` - Schema-based validation
- `@toolkit-house/validation/types` - Type definitions and interfaces
- `@toolkit-house/validation/validators` - Built-in validators
- `@toolkit-house/validation/utils` - Utility functions

### Advanced Features

- Schema composition and inheritance
- Async validation support
- Conditional validation
- Validation groups
- Custom error messages
- Localization support

## Development

```bash
# Navigate to package directory
cd packages/validation

# Build the package
pnpm run build

# Run tests
pnpm run test

# Run type checking
pnpm run typecheck

# Run linting
pnpm run lint
```

## License

MIT