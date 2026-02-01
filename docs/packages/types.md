---
title: "@toolkit-house/types"
description: Zero-dependency TypeScript type definitions and utilities
chineseTitle: "@toolkit-house/types"
chineseDescription: 零依赖的 TypeScript 类型定义和工具
---

# @toolkit-house/types

Zero-dependency TypeScript type definitions and utilities.

## Introduction

`@toolkit-house/types` is a comprehensive type library that provides essential TypeScript type definitions and utility types. It's designed to be lightweight with zero runtime dependencies while offering powerful type manipulation capabilities for modern TypeScript applications.

### What It Does
- Provides fundamental TypeScript types
- Includes advanced utility types
- Offers type composition utilities
- Supports type guards and predicates
- Includes type-level programming utilities
- Provides type-safe function types

### When to Use It
- When you need reusable type definitions
- For advanced TypeScript type manipulation
- When building type-safe APIs
- For creating domain-specific types
- When implementing type-level programming
- For complex type composition scenarios

## Installation

```bash
pnpm add @toolkit-house/types
```

## Quick Start

```typescript
import {
  // Basic types
  String,
  Number,
  Boolean,
  Array,
  Object,
  Null,
  Undefined,
  Any,
  Unknown,
  Never,
  Literal,
  Union,
  Intersection,
  Tuple,
  Record,
  Partial,
  Required,
  Readonly,
  Pick,
  Omit,
  Extract,
  Exclude,
  Awaited,
  PromiseType
} from '@toolkit-house/types'

// Using basic types
type UserID = String
type Age = Number
type IsActive = Boolean

// Using utility types
type User = {
  id: UserID
  name: String
  age: Age
  active: IsActive
}

type PartialUser = Partial<User>
type RequiredUser = Required<User>
type ReadonlyUser = Readonly<User>

// Using advanced types
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }

type ExtractSuccess<T> = Extract<T, { success: true }>
type ExtractError<T> = Extract<T, { success: false }>
```

## Key Features

### 1. Basic Types

```typescript
import {
  String,
  Number,
  Boolean,
  Array,
  Object,
  Null,
  Undefined,
  Any,
  Unknown,
  Never
} from '@toolkit-house/types'

// Basic primitive types
type Text = String
type Count = Number
type IsEnabled = Boolean

// Complex basic types
type List<T> = Array<T>
type Dictionary<T> = Object<string, T>
type Nothing = Null
type Missing = Undefined

// Special types
type Everything = Any
type Anything = Unknown
type Impossible = Never
```

### 2. String Utilities

```typescript
import {
  String,
  Capitalize,
  Uncapitalize,
  Uppercase,
  Lowercase,
  CamelCase,
  PascalCase,
  KebabCase,
  SnakeCase,
  Trim,
  Replace
} from '@toolkit-house/types'

// String transformations
type UserName = String
type CapitalizedName = Capitalize<UserName>
type LowerizedName = Lowercase<UserName>

// Case conversions
type CSSProperty = KebabCase<'backgroundColor'> // 'background-color'
type JSProperty = CamelCase<'background_color'> // 'backgroundColor'
type ClassName = PascalCase<'user_name'> // 'UserName'

// String operations
type CleanedString = Trim<'  hello world  '> // 'hello world'
type ReplacedString = Replace<'hello world', 'world', 'typescript'> // 'hello typescript'
```

### 3. Number Utilities

```typescript
import {
  Number,
  Positive,
  Negative,
  Integer,
  Float,
  Min,
  Max,
  Range,
  IsEven,
  IsOdd,
  Increment,
  Decrement
} from '@toolkit-house/types'

// Number constraints
type Age = Positive<Number> & Integer & Min<18> & Max<120>

// Numeric operations
type Counter = Increment<5> // 6
type DecrementedCounter = Decrement<10> // 9

// Numeric predicates
type EvenNumbers = Filter<[1, 2, 3, 4, 5], IsEven>
type PositiveNumbers = Filter<[ -2, -1, 0, 1, 2], Positive>
```

### 4. Array Utilities

```typescript
import {
  Array,
  Length,
  First,
  Last,
  Tail,
  Head,
  Push,
  Pop,
  Unshift,
  Shift,
  Map,
  Filter,
  Reduce,
  Flat,
  DeepFlat,
  Unique,
  Reverse,
  Sort,
  Includes,
  FindIndex,
  Find,
  Join
} from '@toolkit-house/types'

// Array operations
type Numbers = [1, 2, 3, 4, 5]
type LengthOfArray = Length<Numbers> // 5

// Array manipulation
type FirstElement = First<Numbers> // 1
type LastElement = Last<Numbers> // 5
type Rest = Tail<Numbers> // [2, 3, 4, 5]

// Array transformations
type Doubled = Map<Numbers, X => X * 2> // [2, 4, 6, 8, 10]
type Evens = Filter<Numbers, IsEven> // [2, 4]
type Reversed = Reverse<Numbers> // [5, 4, 3, 2, 1]

// Array utilities
type UniqueNumbers = Unique<[1, 2, 2, 3, 3, 3]> // [1, 2, 3]
type SortedNumbers = Sort<Numbers> // [1, 2, 3, 4, 5]
```

### 5. Object Utilities

```typescript
import {
  Object,
  Keys,
  Values,
  Entries,
  Pick,
  Omit,
  Partial,
  Required,
  Readonly,
  Record,
  Merge,
  DeepMerge,
  Flatten,
  OptionalKeys,
  RequiredKeys,
  ReadonlyKeys,
  Mutable,
  Immutable
} from '@toolkit-house/types'

// Object manipulation
type User = {
  id: number
  name: string
  age: number
  email: string
}

type UserBasic = Pick<User, 'id' | 'name'> // { id: number, name: string }
type UserWithoutEmail = Omit<User, 'email'> // { id: number, name: string, age: number }

// Object transformations
type PartialUser = Partial<User> // All properties optional
type RequiredUser = Required<PartialUser> // All properties required
type ReadonlyUser = Readonly<User> // All properties readonly

// Object utilities
type UserKeys = Keys<User> // 'id' | 'name' | 'age' | 'email'
type UserValues = Values<User> // number | string
type UserEntries = Entries<User> // ['id', number] | ['name', string] | etc.

// Object merging
type BaseUser = { id: number; name: string }
type UserDetails = { email: string; age: number }
type CompleteUser = Merge<BaseUser, UserDetails> // { id: number, name: string, email: string, age: number }
```

### 6. Function Utilities

```typescript
import {
  Function,
  Parameters,
  ReturnType,
  ConstructorParameters,
  InstanceType,
  NonNullable,
  NonUndefined,
  NonFalsy,
  ReturnTypeOf,
  ParametersOf,
  Curried,
  Promisify,
  Awaitable
} from '@toolkit-house/types'

// Function type utilities
type AddFunction = (a: number, b: number) => number
type AddParams = Parameters<AddFunction> // [number, number]
type AddResult = ReturnType<AddFunction> // number

// Constructor utilities
class Person {
  constructor(public name: string, public age: number) {}
}

type PersonParams = ConstructorParameters<typeof Person> // [string, number]
type PersonInstance = InstanceType<typeof Person> // Person

// Function transformations
type Add = (a: number, b: number) => number
type CurriedAdd = Curried<Add> // (a: number) => (b: number) => number
type AsyncAdd = Promisify<Add> // (a: number, b: number) => Promise<number>
```

### 7. Conditional Types

```typescript
import {
  Conditional,
  extends,
  not,
  equals,
  is,
  if,
  then,
  else,
  distribute,
  narrow,
  when,
  unless
} from '@toolkit-house/types'

// Conditional types
type IsString<T> = Conditional<extends<T, String>>
type IsNotString<T> = not<IsString<T>>

// Advanced conditional logic
type FormatValue<T> = Conditional<
  equals<T, string>,
  then<string>,
  Conditional<
    equals<T, number>,
    then<number>,
    then<unknown>
  >
>

// Type guards
type isString<T> = is<T, String>
type isNumber<T> = is<T, Number>
```

### 8. Utility Types

```typescript
import {
  Extract,
  Exclude,
  ExcludeProperty,
  ExtractProperty,
  DeepPartial,
  DeepRequired,
  DeepReadonly,
  DeepMutable,
  DeepPick,
  DeepOmit,
  FlattenObject,
  DeepFlattenObject,
  UnionToTuple,
  TupleToUnion,
  DeepNonNullable,
  DeepOptional,
  UnionToIntersection,
  IntersectionToUnion,
  Without,
  With
} from '@toolkit-house/types'

// Type extraction
type NumericTypes = string | number | boolean
type OnlyNumbers = Extract<NumericTypes, Number> // number
type NonStrings = Exclude<NumericTypes, String> // number | boolean

// Deep object utilities
type NestedUser = {
  user: {
    profile: {
      name: string
      age: number
    }
    preferences: {
      theme: 'light' | 'dark'
    }
  }
}

type DeepPartialUser = DeepPartial<NestedUser> // All properties optional at all levels
type DeepRequiredUser = DeepRequired<DeepPartialUser> // All properties required at all levels

// Complex type operations
type UnionToIntersectionType = UnionToTuple<string | number> // [string, number]
type IntersectionToUnionType = IntersectionToUnion<{ a: 1 } & { b: 2 }> // { a: 1 } | { b: 2 }
```

## Common Use Cases

### 1. API Response Types

```typescript
import {
  Object,
  String,
  Number,
  Boolean,
  Array,
  Pick,
  Omit,
  Partial,
  Required,
  Record
} from '@toolkit-house/types'

// API response types
type ApiResponse<T> = {
  data: T
  success: Boolean
  message: String
  timestamp: String
  errors?: Array<String>
}

type UserResponse = ApiResponse<{
  id: Number
  name: String
  email: String
  avatar: String
  createdAt: String
  updatedAt: String
}>

type UserListResponse = ApiResponse<Array<{
  id: Number
  name: String
  email: String
}>>

// API request types
type CreateUserRequest = {
  name: String
  email: String
  password: String
  avatar?: String
}

type UpdateUserRequest = Partial<CreateUserRequest> & {
  id: Number
}
```

### 2. Component Props Types

```typescript
import {
  Object,
  String,
  Number,
  Boolean,
  Array,
  Union,
  Function,
  Required,
  Optional,
  Readonly,
  ComponentProps
} from '@toolkit-house/types'

// Component props with strict typing
type ButtonProps = ComponentProps<{
  variant: Union<'primary' | 'secondary' | 'outline' | 'ghost'>
  size: Union<'sm' | 'md' | 'lg'>
  disabled?: Boolean
  loading?: Boolean
  onClick: Function<(event: Event) => void>
  children?: String | Array<String>
  className?: String
  style?: Readonly<Object<string, any>>
}>

// Form component props
type FormProps<T> = {
  initialValues: T
  onSubmit: Function<(values: T) => void>
  onChange?: Function<(values: T) => void>
  validate?: Function<(values: T) => Object<string, String>>
  children: React.ReactNode
}

// Usage in React
function Button({ variant, size, disabled, loading, onClick, children }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
```

### 3. State Management Types

```typescript
import {
  Object,
  String,
  Number,
  Boolean,
  Array,
  Union,
  Pick,
  Omit,
  Partial,
  Required,
  Readonly,
  DeepPartial,
  DeepRequired,
  Record
} from '@toolkit-house/types'

// Application state
type AppState = {
  user: {
    id: Number
    name: String
    email: String
    avatar: String
    preferences: {
      theme: Union<'light' | 'dark'>
      language: String
      notifications: Boolean
    }
  }
  ui: {
    theme: Union<'light' | 'dark'>
    sidebarOpen: Boolean
    loading: Boolean
    errors: Array<String>
  }
  data: {
    items: Array<{
      id: Number
      name: String
      category: String
      price: Number
    }>
  }
}

// State utilities
type UserState = Pick<AppState, 'user'>['user']
type UIState = Pick<AppState, 'ui'>['ui']
type DataState = Pick<AppState, 'data'>['data']

// State updates
type UpdateUserAction = {
  type: 'UPDATE_USER'
  payload: DeepPartial<UserState>
}

type UpdateUIAction = {
  type: 'UPDATE_UI'
  payload: DeepPartial<UIState>
}

// Reducer type
type AppReducer = Function<
  (state: AppState, action: UpdateUserAction | UpdateUIAction) => AppState
>
```

### 4. Database Schema Types

```typescript
import {
  Object,
  String,
  Number,
  Boolean,
  Array,
  Union,
  Pick,
  Omit,
  Partial,
  Required,
  Record,
  ExtractProperty,
  ExcludeProperty
} from '@toolkit-house/types'

// Database types
type ColumnType =
  | { type: 'string'; length?: Number }
  | { type: 'number'; precision?: Number; scale?: Number }
  | { type: 'boolean' }
  | { type: 'date' }
  | { type: 'datetime' }
  | { type: 'json' }

type TableSchema = Record<string, ColumnType>

// User table
type UserTable = {
  id: { type: 'number' }
  name: { type: 'string'; length: 100 }
  email: { type: 'string'; length: 255; unique: true }
  password: { type: 'string'; length: 255 }
  avatar: { type: 'string'; length: 500; nullable: true }
  created_at: { type: 'datetime' }
  updated_at: { type: 'datetime' }
  is_active: { type: 'boolean'; default: true }
}

// Product table
type ProductTable = {
  id: { type: 'number' }
  name: { type: 'string'; length: 200 }
  description: { type: 'string'; length: 2000; nullable: true }
  price: { type: 'number'; precision: 10; scale: 2 }
  category_id: { type: 'number'; references: 'categories.id' }
  stock: { type: 'number'; default: 0 }
  created_at: { type: 'datetime' }
  updated_at: { type: 'datetime' }
  is_active: { type: 'boolean'; default: true }
}

// Database utilities
type UserColumns = ExtractProperty<UserTable, { type: 'string' | 'number' | 'boolean' | 'datetime' }>
type NullableColumns = ExtractProperty<UserTable, { nullable: true }>
```

## API Reference

### Core Modules

- `@toolkit-house/types/basic` - Basic primitive types
- `@toolkit-house/types/string` - String utilities
- `@toolkit-house/types/number` - Number utilities
- `@toolkit-house/types/array` - Array utilities
- `toolkit-house/types/object` - Object utilities
- `@toolkit-house/types/function` - Function utilities
- `@toolkit-house/types/conditional` - Conditional types
- `@toolkit-house/types/utility` - Advanced utility types

### Type Categories

#### Basic Types
- `String` - String type
- `Number` - Number type
- `Boolean` - Boolean type
- `Array<T>` - Array type
- `Object<K, V>` - Object type
- `Null` - Null type
- `Undefined` - Undefined type
- `Any` - Any type
- `Unknown` - Unknown type
- `Never` - Never type

#### Utility Types
- `Partial<T>` - Make all properties optional
- `Required<T>` - Make all properties required
- `Readonly<T>` - Make all properties readonly
- `Pick<T, K>` - Pick specific properties
- `Omit<T, K>` - Omit specific properties
- `Record<K, T>` - Create object from keys
- `Extract<T, U>` - Extract from union
- `Exclude<T, U>` - Exclude from union

### Advanced Types
- `DeepPartial<T>` - Deep partial
- `DeepRequired<T>` - Deep required
- `DeepReadonly<T>` - Deep readonly
- `DeepPick<T, K>` - Deep pick
- `DeepOmit<T, K>` - Deep omit
- `FlattenObject<T>` - Flatten object
- `UnionToTuple<T>` - Convert union to tuple
- `TupleToUnion<T>` - Convert tuple to union

## Development

```bash
# Navigate to package directory
cd packages/types

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