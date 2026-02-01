---
title: "@toolkit-house/constants"
description: Comprehensive constants library for modern web applications
chineseTitle: "@toolkit-house/constants"
chineseDescription: 现代Web应用程序的综合常量库
---

# @toolkit-house/constants

Comprehensive constants library for modern web applications.

## Introduction

`@toolkit-house/constants` provides a centralized collection of commonly used constants across modern web applications. It's organized into logical categories for easy access and includes environment-specific configurations, business rules, technical constants, and design system tokens.

### What It Does
- Provides application-wide constants
- Organizes constants by category
- Supports environment-specific values
- Includes design system tokens
- Offers business rule definitions
- Provides technical and API constants

### When to Use It
- When you need centralized constant management
- For consistent configuration across your application
- When working with design systems
- For environment-specific configurations
- When defining business rules
- For API and technical constants

## Installation

```bash
pnpm add @toolkit-house/constants
```

## Quick Start

```typescript
import {
  // Common constants
  APP_NAME,
  APP_VERSION,
  DEFAULT_LANGUAGE,
  DEFAULT_THEME,

  // Environment constants
  ENVIRONMENT,
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  IS_TESTING,

  // Business constants
  USER_ROLES,
  ORDER_STATUSES,
  PAYMENT_METHODS,

  // Technical constants
  API_VERSION,
  API_BASE_URL,
  CACHE_KEYS,

  // Design tokens
  COLORS,
  SPACING,
  TYPOGRAPHY,
  BREAKPOINTS
} from '@toolkit-house/constants'

// Using constants in your application
console.log(APP_NAME, APP_VERSION)
console.log('Environment:', ENVIRONMENT)

// Conditional logic based on environment
if (IS_DEVELOPMENT) {
  console.log('Development mode enabled')
}

// Using business constants
function getUserRoleDisplayName(role: keyof typeof USER_ROLES) {
  return USER_ROLES[role].displayName
}

// Using design tokens
const style = {
  backgroundColor: COLORS.primary,
  padding: SPACING.md,
  fontSize: TYPOGRAPHY.body.fontSize,
  minWidth: BREAKPOINTS.sm
}
```

## Key Features

### 1. Common Constants

```typescript
import { COMMON } from '@toolkit-house/constants'

// Application metadata
const appInfo = {
  name: COMMON.APP_NAME,
  version: COMMON.APP_VERSION,
  description: COMMON.APP_DESCRIPTION,
  author: COMMON.APP_AUTHOR,
  license: COMMON.APP_LICENSE
}

// Default values
const defaults = {
  language: COMMON.DEFAULT_LANGUAGE,
  theme: COMMON.DEFAULT_THEME,
  timezone: COMMON.DEFAULT_TIMEZONE,
  locale: COMMON.DEFAULT_LOCALE,
  currency: COMMON.DEFAULT_CURRENCY
}

// Application features
const features = {
  darkMode: COMMON.FEATURES.DARK_MODE,
  notifications: COMMON.FEATURES.NOTIFICATIONS,
  analytics: COMMON.FEATURES.ANALYTICS,
  debug: COMMON.FEATURES.DEBUG
}
```

### 2. Environment Constants

```typescript
import { ENVIRONMENT } from '@toolkit-house/constants'

// Environment detection
const environmentConfig = {
  isDevelopment: ENVIRONMENT.IS_DEVELOPMENT,
  isProduction: ENVIRONMENT.IS_PRODUCTION,
  isTesting: ENVIRONMENT.IS_TESTING,
  isStaging: ENVIRONMENT.IS_STAGING
}

// Environment-specific settings
const settings = {
  apiUrl: ENVIRONMENT.API_URL,
  timeout: ENVIRONMENT.TIMEOUT,
  retries: ENVIRONMENT.RETRIES,
  logLevel: ENVIRONMENT.LOG_LEVEL,
  featureFlags: ENVIRONMENT.FEATURE_FLAGS
}

// Environment variables
const envVars = {
  nodeEnv: ENVIRONMENT.NODE_ENV,
  apiUrl: ENVIRONMENT.VITE_API_URL,
  analyticsKey: ENVIRONMENT.VITE_ANALYTICS_KEY,
  sentryDsn: ENVIRONMENT.VITE_SENTRY_DSN
}
```

### 3. Business Constants

```typescript
import { BUSINESS } from '@toolkit-house/constants'

// User roles
const userRoles = BUSINESS.USER_ROLES
// {
//   ADMIN: { value: 'admin', displayName: 'Administrator', permissions: [...] },
//   USER: { value: 'user', displayName: 'User', permissions: [...] },
//   GUEST: { value: 'guest', displayName: 'Guest', permissions: [...] }
// }

// Order statuses
const orderStatuses = BUSINESS.ORDER_STATUSES
// {
//   PENDING: { value: 'pending', displayName: 'Pending', color: 'warning' },
//   PROCESSING: { value: 'processing', displayName: 'Processing', color: 'info' },
//   SHIPPED: { value: 'shipped', displayName: 'Shipped', color: 'success' },
//   DELIVERED: { value: 'delivered', displayName: 'Delivered', color: 'success' },
//   CANCELLED: { value: 'cancelled', displayName: 'Cancelled', color: 'error' }
// }

// Payment methods
const paymentMethods = BUSINESS.PAYMENT_METHODS
// {
//   CREDIT_CARD: { value: 'credit_card', displayName: 'Credit Card', icon: 'credit-card' },
//   PAYPAL: { value: 'paypal', displayName: 'PayPal', icon: 'paypal' },
//   BANK_TRANSFER: { value: 'bank_transfer', displayName: 'Bank Transfer', icon: 'bank' },
//   CRYPTO: { value: 'crypto', displayName: 'Cryptocurrency', icon: 'crypto' }
// }

// Product categories
const productCategories = BUSINESS.PRODUCT_CATEGORIES
// {
//   ELECTRONICS: { value: 'electronics', displayName: 'Electronics', icon: 'laptop' },
//   CLOTHING: { value: 'clothing', displayName: 'Clothing', icon: 'shirt' },
//   FOOD: { value: 'food', displayName: 'Food', icon: 'utensils' },
//   BOOKS: { value: 'books', displayName: 'Books', icon: 'book' }
// }
```

### 4. Technical Constants

```typescript
import { TECHNICAL } from '@toolkit-house/constants'

// API configuration
const apiConfig = TECHNICAL.API
// {
//   VERSION: 'v1',
//   BASE_URL: 'https://api.example.com',
//   TIMEOUT: 30000,
//   RETRIES: 3,
//   MAX_PAYLOAD_SIZE: 10485760 // 10MB
// }

// Cache keys
const cacheKeys = TECHNICAL.CACHE_KEYS
// {
//   USER_PROFILE: 'user_profile',
//   USER_PREFERENCES: 'user_preferences',
//   APP_SETTINGS: 'app_settings',
//   SEARCH_HISTORY: 'search_history',
//   NOTIFICATIONS: 'notifications'
// }

// Database constants
const dbConfig = TECHNICAL.DATABASE
// {
//   POOL_SIZE: 10,
//   CONNECTION_TIMEOUT: 30000,
//   IDLE_TIMEOUT: 600000,
//   MAX_LIFETIME: 1800000,
//   RETRY_ATTEMPTS: 3
// }

// Security constants
const securityConfig = TECHNICAL.SECURITY
// {
//   TOKEN_EXPIRY: 3600000, // 1 hour
//   REFRESH_TOKEN_EXPIRY: 604800000, // 7 days
//   MAX_LOGIN_ATTEMPTS: 5,
//   LOCKOUT_DURATION: 900000, // 15 minutes
//   PASSWORD_MIN_LENGTH: 8,
//   PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/
// }
```

### 5. Design System Tokens

```typescript
import { DESIGN } from '@toolkit-house/constants'

// Colors
const colors = DESIGN.COLORS
// {
//   primary: {
//     50: '#eff6ff',
//     100: '#dbeafe',
//     500: '#3b82f6',
//     900: '#1e3a8a'
//   },
//   secondary: {
//     50: '#f3f4f6',
//     500: '#6b7280',
//     900: '#111827'
//   },
//   success: {
//     50: '#d1fae5',
//     500: '#10b981',
//     900: '#064e3b'
//   },
//   error: {
//     50: '#fee2e2',
//     500: '#ef4444',
//     900: '#7f1d1d'
//   }
// }

// Spacing
const spacing = DESIGN.SPACING
// {
//   xs: '0.25rem',  // 4px
//   sm: '0.5rem',   // 8px
//   md: '1rem',     // 16px
//   lg: '1.5rem',   // 24px
//   xl: '2rem',     // 32px
//   '2xl': '3rem'   // 48px
// }

// Typography
const typography = DESIGN.TYPOGRAPHY
// {
//   heading: {
//     fontFamily: 'Inter, sans-serif',
//     fontSize: '2rem',
//     fontWeight: '700',
//     lineHeight: '1.25'
//   },
//   body: {
//     fontFamily: 'Inter, sans-serif',
//     fontSize: '1rem',
//     fontWeight: '400',
//     lineHeight: '1.5'
//   },
//   caption: {
//     fontFamily: 'Inter, sans-serif',
//     fontSize: '0.875rem',
//     fontWeight: '400',
//     lineHeight: '1.25'
//   }
// }

// Breakpoints
const breakpoints = DESIGN.BREAKPOINTS
// {
//   xs: '0px',
//   sm: '640px',
//   md: '768px',
//   lg: '1024px',
//   xl: '1280px',
//   '2xl': '1536px'
// }

// Shadows
const shadows = DESIGN.SHADOWS
// {
//   sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
//   md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
//   lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
//   xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
// }
```

### 6. Business Rules

```typescript
import { BUSINESS } from '@toolkit-house/constants'

// Business validation rules
const validationRules = BUSINESS.VALIDATION
// {
//   PASSWORD: {
//     MIN_LENGTH: 8,
//     MAX_LENGTH: 64,
//     REQUIRE_UPPERCASE: true,
//     REQUIRE_LOWERCASE: true,
//     REQUIRE_NUMBER: true,
//     REQUIRE_SPECIAL: true,
//     PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
//   },
//   USERNAME: {
//     MIN_LENGTH: 3,
//     MAX_LENGTH: 20,
//     PATTERN: /^[a-zA-Z0-9_]+$/
//   },
//   EMAIL: {
//     PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//   }
// }

// Business limits
const businessLimits = BUSINESS.LIMITS
// {
//   MAX_CART_ITEMS: 50,
//   MAX_ORDER_ITEMS: 100,
//   MIN_ORDER_TOTAL: 0.01,
//   MAX_ORDER_TOTAL: 10000,
//   MAX_FILE_SIZE: 10485760, // 10MB
//   MAX_IMAGE_SIZE: 5242880, // 5MB
//   SUPPORTED_FILE_TYPES: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']
// }

// Time-related business rules
const timeRules = BUSINESS.TIME
// {
//   ORDER_RETENTION_DAYS: 30,
//   SESSION_TIMEOUT: 1800, // 30 minutes
//   TOKEN_REFRESH_WINDOW: 300, // 5 minutes before expiry
//   BUSINESS_HOURS: {
//     START: '09:00',
//     END: '18:00',
//     TIMEZONE: 'America/New_York'
//   }
// }
```

## Common Use Cases

### 1. Application Configuration

```typescript
import { COMMON, ENVIRONMENT, BUSINESS, TECHNICAL } from '@toolkit-house/constants'

// Application configuration
const appConfig = {
  // Basic info
  name: COMMON.APP_NAME,
  version: COMMON.APP_VERSION,

  // Environment settings
  environment: ENVIRONMENT.NODE_ENV,
  isProduction: ENVIRONMENT.IS_PRODUCTION,
  apiUrl: ENVIRONMENT.API_URL,

  // Business settings
  defaultRole: BUSINESS.USER_ROLES.USER.value,
  defaultCurrency: BUSINESS.DEFAULT_CURRENCY,

  // Technical settings
  apiTimeout: TECHNICAL.API.TIMEOUT,
  maxRetries: TECHNICAL.API.RETRIES,
  cacheExpiry: TECHNICAL.CACHE.EXPIRY
}

// Environment-specific configuration
const getEnvironmentConfig = () => {
  if (ENVIRONMENT.IS_DEVELOPMENT) {
    return {
      apiUrl: ENVIRONMENT.DEV_API_URL,
      logLevel: 'debug',
      features: {
        darkMode: true,
        analytics: false
      }
    }
  }

  if (ENVIRONMENT.IS_PRODUCTION) {
    return {
      apiUrl: ENVIRONMENT.PROD_API_URL,
      logLevel: 'error',
      features: {
        darkMode: true,
        analytics: true
      }
    }
  }

  return {}
}
```

### 2. Styling and Design

```typescript
import { DESIGN } from '@toolkit-house/constants'

// CSS-in-JS styles
const buttonStyles = {
  primary: {
    backgroundColor: DESIGN.COLORS.primary[500],
    color: DESIGN.COLORS.white,
    padding: `${DESIGN.SPACING.sm} ${DESIGN.SPACING.md}`,
    borderRadius: DESIGN.BORDER_RADIUS.md,
    fontSize: DESIGN.TYPOGRAPHY.body.fontSize,
    fontWeight: DESIGN.TYPOGRAPHY.body.fontWeight,
    '&:hover': {
      backgroundColor: DESIGN.COLORS.primary[600]
    }
  },

  secondary: {
    backgroundColor: DESIGN.COLORS.secondary[500],
    color: DESIGN.COLORS.white,
    padding: `${DESIGN.SPACING.sm} ${DESIGN.SPACING.md}`,
    borderRadius: DESIGN.BORDER_RADIUS.md,
    fontSize: DESIGN.TYPOGRAPHY.body.fontSize
  }
}

// Responsive utility functions
const getResponsiveValue = (key: keyof typeof DESIGN.BREAKPOINTS) => {
  const value = DESIGN.BREAKPOINTS[key]
  return `@media (min-width: ${value})`
}

// Theme provider
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = {
    colors: DESIGN.COLORS,
    spacing: DESIGN.SPACING,
    typography: DESIGN.TYPOGRAPHY,
    breakpoints: DESIGN.BREAKPOINTS,
    shadows: DESIGN.SHADOWS
  }

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}
```

### 3. Form Validation

```typescript
import { BUSINESS } from '@toolkit-house/constants'

// Validation schema
const validationSchema = {
  username: {
    required: true,
    minLength: BUSINESS.VALIDATION.USERNAME.MIN_LENGTH,
    maxLength: BUSINESS.VALIDATION.USERNAME.MAX_LENGTH,
    pattern: BUSINESS.VALIDATION.USERNAME.PATTERN
  },

  email: {
    required: true,
    pattern: BUSINESS.VALIDATION.EMAIL.PATTERN
  },

  password: {
    required: true,
    minLength: BUSINESS.VALIDATION.PASSWORD.MIN_LENGTH,
    maxLength: BUSINESS.VALIDATION.PASSWORD.MAX_LENGTH,
    pattern: BUSINESS.VALIDATION.PASSWORD.PATTERN
  },

  confirmPassword: {
    required: true,
    validate: (value: string, values: any) =>
      value === values.password || 'Passwords must match'
  }
}

// Form component
const RegistrationForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = (field: string, value: any) => {
    const rules = validationSchema[field]
    const fieldErrors: string[] = []

    if (rules.required && !value) {
      fieldErrors.push('This field is required')
    }

    if (rules.minLength && value.length < rules.minLength) {
      fieldErrors.push(`Minimum length is ${rules.minLength}`)
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      fieldErrors.push(`Maximum length is ${rules.maxLength}`)
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      fieldErrors.push('Invalid format')
    }

    if (rules.validate) {
      const validateError = rules.validate(value, formData)
      if (validateError) {
        fieldErrors.push(validateError)
      }
    }

    return fieldErrors
  }

  const handleChange = (field: string, value: any) => {
    const fieldErrors = validateField(field, value)
    setErrors(prev => ({
      ...prev,
      [field]: fieldErrors[0] || null
    }))
  }

  return (
    <form>
      <FormInput
        label="Username"
        value={formData.username}
        onChange={(e) => handleChange('username', e.target.value)}
        error={errors.username}
      />

      <FormInput
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={errors.email}
      />

      <FormInput
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => handleChange('password', e.target.value)}
        error={errors.password}
      />

      <FormInput
        label="Confirm Password"
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => handleChange('confirmPassword', e.target.value)}
        error={errors.confirmPassword}
      />
    </form>
  )
}
```

### 4. Business Logic Implementation

```typescript
import { BUSINESS, TECHNICAL } from '@toolkit-house/constants'

// Order service
class OrderService {
  async createOrder(orderData: OrderData) {
    // Validate order data
    this.validateOrder(orderData)

    // Check business rules
    this.checkBusinessRules(orderData)

    // Create order
    const order = await this.api.post('/orders', orderData)

    // Send notifications
    await this.sendOrderNotifications(order)

    return order
  }

  private validateOrder(orderData: OrderData) {
    // Check cart items limit
    if (orderData.items.length > BUSINESS.LIMITS.MAX_CART_ITEMS) {
      throw new Error('Too many items in cart')
    }

    // Check order total
    const total = orderData.items.reduce((sum, item) => sum + item.price, 0)
    if (total > BUSINESS.LIMITS.MAX_ORDER_TOTAL) {
      throw new Error('Order total exceeds maximum')
    }

    // Check payment method
    if (!BUSINESS.PAYMENT_METHODS[orderData.paymentMethod]) {
      throw new Error('Invalid payment method')
    }
  }

  private checkBusinessRules(orderData: OrderData) {
    // Check business hours
    const now = new Date()
    const businessHours = BUSINESS.TIME.BUSINESS_HOURS

    if (now.getHours() < parseInt(businessHours.START.split(':')[0])) {
      throw new Error('Business has not started yet')
    }

    if (now.getHours() >= parseInt(businessHours.END.split(':')[0])) {
      throw new Error('Business is closed')
    }

    // Check inventory
    for (const item of orderData.items) {
      const inventory = await this.getInventory(item.productId)
      if (inventory.quantity < item.quantity) {
        throw new Error(`Insufficient inventory for ${item.productId}`)
      }
    }
  }

  private async sendOrderNotifications(order: Order) {
    const notification = {
      type: 'ORDER_CREATED',
      message: `Order #${order.id} has been created`,
      data: order
    }

    // Send email notification
    if (order.userPreferences.emailNotifications) {
      await this.emailService.send(
        order.email,
        'Order Confirmation',
        this.getOrderEmailTemplate(order)
      )
    }

    // Send push notification
    if (order.userPreferences.pushNotifications) {
      await this.pushService.send(order.userId, notification)
    }
  }
}
```

## API Reference

### Core Categories

#### `COMMON`
- Application metadata constants
- Default values
- Feature flags

#### `ENVIRONMENT`
- Environment detection
- Environment-specific URLs
- Configuration flags

#### `BUSINESS`
- User roles and permissions
- Order statuses
- Payment methods
- Product categories
- Business rules and limits
- Time-related constants

#### `TECHNICAL`
- API configuration
- Database settings
- Cache keys
- Security settings

#### `DESIGN`
- Color palette
- Spacing scale
- Typography scale
- Breakpoints
- Shadows

### Usage Patterns

```typescript
// Import specific categories
import { BUSINESS, ENVIRONMENT } from '@toolkit-house/constants'

// Use in components
const { USER_ROLES } = BUSINESS
const { IS_PRODUCTION } = ENVIRONMENT

// Dynamic configuration based on environment
const config = IS_PRODUCTION
  ? PRODUCTION_CONFIG
  : DEVELOPMENT_CONFIG
```

## Development

```bash
# Navigate to package directory
cd packages/constants

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