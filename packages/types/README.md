# @toolkit-house/types

A zero-dependency TypeScript type definitions and utilities library focused on providing advanced type manipulation, validation, and transformation capabilities.

## Features

- 🚀 **Zero Dependencies** - Pure TypeScript, no runtime dependencies
- 🎯 **Type-Only** - Compile-time type safety with no runtime overhead
- 🔧 **Comprehensive** - Extensive collection of type utilities for all scenarios
- 📦 **Modular** - Import only what you need with subpath exports
- 🧪 **Well-Tested** - Comprehensive type-level tests ensure correctness

## Installation

```bash
npm install @toolkit-house/types
pnpm add @toolkit-house/types
yarn add @toolkit-house/types
```

## Usage

### Basic Usage

```typescript
import type {
  DeepPartial,
  Optional,
  Required,
  If,
  Extends,
  Brand,
  Result,
  Option,
} from '@toolkit-house/types';

interface User {
  id: string;
  name: string;
  email: string;
  profile: {
    age: number;
    settings: {
      theme: 'light' | 'dark';
      notifications: boolean;
    };
  };
}

// Make all properties optional recursively
type PartialUser = DeepPartial<User>;

// Make specific properties optional
type OptionalUser = Optional<User, 'email' | 'profile'>;

// Conditional types
type IsString = Extends<string, string>; // true
type Result = If<IsString, 'is string', 'not string'>; // 'is string'

// Branded types
type UserId = Brand<string, 'UserId'>;
const userId: UserId = 'user-123' as UserId;
```

### Subpath Imports

Import specific modules to reduce bundle size:

```typescript
// Basic type utilities
import type { DeepPartial, Optional, Required } from '@toolkit-house/types/basic';

// Function utilities
import type { Parameters, ReturnType, Curried } from '@toolkit-house/types/function';

// Collection utilities
import type { DeepReadonlyCollection, Flatten } from '@toolkit-house/types/collection';

// Conditional utilities
import type { If, Extends, FilterUnion } from '@toolkit-house/types/conditional';

// Utility types
import type { Brand, Result, Option } from '@toolkit-house/types/utility';
```

## Modules

### Basic Types (`/basic`)

Enhanced versions of TypeScript's built-in utility types:

```typescript
import type {
  DeepPartial,           // Make all properties optional recursively
  DeepRequired,          // Make all properties required recursively
  PartialWithRequired,   // Partial with required keys
  Optional,              // Make specific properties optional
  RequiredExcept,        // Make all required except specific keys
  NonNullableProperties, // Remove undefined from properties
  Nullable,              // Make properties nullable
  DeepReadonly,          // Deep readonly object
  CamelCaseKeys,         // Convert keys to camelCase
  SnakeCaseKeys,         // Convert keys to snake_case
  FilterProperties,      // Filter properties by value type
  UnionToIntersection,   // Convert union to intersection
  Merge,                 // Merge two objects
} from '@toolkit-house/types/basic';
```

### Function Types (`/function`)

Advanced function type manipulation:

```typescript
import type {
  Parameters,           // Extract parameters type
  ReturnType,           // Extract return type
  FirstParameter,       // Get first parameter type
  LastParameter,        // Get last parameter type
  AddOptionalParameter, // Add optional parameters
  RemoveParameterIf,    // Remove parameters conditionally
  Asyncify,             // Convert sync to async function
  Curried,              // Create curried function type
  WithThis,             // Add this parameter
  Memoized,             // Memoized function type
  Debounced,            // Debounced function type
} from '@toolkit-house/types/function';
```

### Collection Types (`/collection`)

Advanced array and object type utilities:

```typescript
import type {
  DeepReadonlyCollection, // Deep readonly collections
  DeepPartialCollection,  // Deep partial collections
  Flatten,               // Flatten nested arrays
  UniqueArray,           // Remove duplicates from array type
  FilterArray,           // Filter array by type
  PickByValue,           // Pick properties by value type
  OmitByValue,           // Omit properties by value type
  MapKeys,               // Transform object keys
  MapValues,             // Transform object values
  GroupBy,               // Group array by key extractor
  Chunk,                 // Chunk array into groups
} from '@toolkit-house/types/collection';
```

### Conditional Types (`/conditional`)

Advanced conditional type utilities:

```typescript
import type {
  If,              // If-Then-Else conditional type
  Not,             // Boolean not operator
  And, Or, Xor,    // Boolean logic operators
  Extends,         // Type extension check
  Equals,          // Type equality check
  IsNever,         // Check if type is never
  IsUnknown,       // Check if type is unknown
  IsAny,           // Check if type is any
  FilterUnion,     // Filter union types
  UnionContains,   // Check if union contains type
  WithFallback,    // Type with fallback
  Distributive,    // Distributive conditional type
} from '@toolkit-house/types/conditional';
```

### Utility Types (`/utility`)

Specialized utility types for common patterns:

```typescript
import type {
  // Constructor and instance utilities
  ConstructorParameters, // Extract constructor parameters
  InstanceType,         // Extract instance type
  IsConstructor,        // Check if type is constructor

  // Branded and nominal types
  Brand,               // Create branded type
  Nominal,             // Create nominal type
  Opaque,              // Create opaque type

  // Result and option types
  Result,              // Success/Error result type
  Option,              // Optional value type
  Maybe,               // Alias for Option

  // Function utilities
  Debounced,           // Debounced function type
  Throttled,           // Throttled function type
  Memoized,            // Memoized function type

  // Validation types
  ValidationResult,     // Validation result type
  Validator,           // Validator function type
  TypeGuard,           // Type guard function type

  // Specialized types
  UserId,              // User ID type
  URL,                 // URL type
  Email,               // Email type
  UUID,                // UUID type
} from '@toolkit-house/types/utility';
```

## Examples

### API Response Types

```typescript
import type { Result, Optional, DeepPartial } from '@toolkit-house/types';

interface User {
  id: string;
  name: string;
  email: string;
  profile: {
    bio?: string;
    avatar?: string;
  };
}

// API response type
type UserResponse = Result<User, 'NOT_FOUND' | 'INVALID_PARAMS'>;

// Update payload with optional profile
type UpdateUserPayload = Optional<User, 'id' | 'profile'> & {
  profile?: DeepPartial<User['profile']>;
};

async function updateUser(id: string, payload: UpdateUserPayload): Promise<UserResponse> {
  // Implementation
}
```

### Form Validation Types

```typescript
import type { ValidationResult, Validator, Brand } from '@toolkit-house/types';

type Email = Brand<string, 'Email'>;
type UserId = Brand<string, 'UserId'>;

interface UserForm {
  name: string;
  email: string;
  age: number;
}

type UserFormValidation = ValidationResult<{
  id: UserId;
  name: string;
  email: Email;
  age: number;
}>;

const validateUserForm: Validator<UserForm> = (data: unknown): UserFormValidation => {
  // Validation implementation
};
```

### State Management Types

```typescript
import type { DeepReadonly, Optional, If } from '@toolkit-house/types';

interface AppState {
  user: {
    id: string;
    name: string;
    preferences: {
      theme: 'light' | 'dark';
      notifications: boolean;
    };
  };
  loading: boolean;
  error?: string;
}

// Read-only state
type ReadonlyState = DeepReadonly<AppState>;

// Partial state for updates
type StateUpdate = DeepPartial<AppState>;

// Conditional state type
type UserState = If<boolean, ReadonlyState, StateUpdate>;
```

### Database Types

```typescript
import type { ID, Query, Filter, Sort, Optional } from '@toolkit-house/types';

interface User {
  id: ID<number>;
  name: string;
  email: string;
  age: number;
  createdAt: Date;
  updatedAt: Date;
}

type UserQuery = Query<User>;
type UserFilter = Filter<User>;
type UserSort = Sort<User>;
type CreateUserPayload = Optional<User, 'id' | 'createdAt' | 'updatedAt'>;

// Usage
const query: UserQuery = { name: 'John', age: 25 };
const filter: UserFilter = { age: { $gt: 18 }, email: { $ne: '' } };
const sort: UserSort = { name: 1, age: -1 };
const payload: CreateUserPayload = {
  name: 'John',
  email: 'john@example.com',
  age: 25,
};
```

## API Reference

### Basic Types

| Type | Description | Example |
|------|-------------|---------|
| `DeepPartial<T>` | Make all properties optional recursively | `DeepPartial<{a: {b: string}}>` → `{a?: {b?: string}}` |
| `Optional<T, K>` | Make specific properties optional | `Optional<User, 'email'>` → `{id: string; email?: string}` |
| `Nullable<T>` | Make properties nullable | `Nullable<string>` → `string \| null` |
| `DeepReadonly<T>` | Deep readonly object | `DeepReadonly<{a: {b: string}}>` → `{readonly a: {readonly b: string}}` |

### Function Types

| Type | Description | Example |
|------|-------------|---------|
| `Curried<T>` | Curried function type | `Curried<(a, b, c) => d>` → `a => b => c => d` |
| `Asyncify<T>` | Convert sync to async | `Asyncify<() => string>` → `() => Promise<string>` |
| `WithThis<T, F>` | Add this parameter | `WithThis<Context, () => void>` → `(this: Context) => void` |

### Conditional Types

| Type | Description | Example |
|------|-------------|---------|
| `If<C, T, F>` | If-Then-Else conditional | `If<true, string, number>` → `string` |
| `Extends<T, U>` | Check type extension | `Extends<string, object>` → `false` |
| `FilterUnion<T, U>` | Filter union by type | `FilterUnion<string \| number, string>` → `string` |

### Utility Types

| Type | Description | Example |
|------|-------------|---------|
| `Brand<T, B>` | Create branded type | `Brand<string, 'UserId'>` |
| `Result<T, E>` | Success/Error result | `Result<string, Error>` |
| `Option<T>` | Optional value type | `Option<string>` → `{type: 'some', value: string} \| {type: 'none'}` |

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Add type definitions with comprehensive tests
4. Ensure all type tests pass: `pnpm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## License

MIT © [Toolkit House](https://github.com/toolkit-house)

## Related Packages

- [`@toolkit-house/ts-utils`](https://github.com/toolkit-house/ts-utils) - TypeScript utility functions
- [`@toolkit-house/vue-components`](https://github.com/toolkit-house/vue-components) - Vue component library