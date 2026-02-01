---
---

<!-- <div v-pre> -->
# @toolkit-house/validation API 参考

Toolkit House 的类型安全验证库，支持流式 API。

## 安装

```bash
pnpm add @toolkit-house/validation
```

## 核心 API

### Schema

验证模式类，用于定义验证规则。

#### 构造函数

```typescript
new Schema<T>(definition: SchemaDefinition<T>)
```

**参数：**
- `definition` - 模式定义对象

**示例：**

```typescript
import { Schema } from '@toolkit-house/validation'

const userSchema = new Schema({
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    required: true,
    email: true,
  },
  age: {
    required: false,
    min: 0,
    max: 120,
  },
})
```

---

#### `validate(data: unknown): ValidationResult`

验证数据。

**参数：**
- `data` - 要验证的数据

**返回值：** ValidationResult

```typescript
interface ValidationResult {
  valid: boolean
  errors?: Record<string, string[]>
}
```

**示例：**

```typescript
const result = userSchema.validate({
  name: 'Alice',
  email: 'alice@example.com',
  age: 30,
})

if (result.valid) {
  console.log('验证通过')
} else {
  console.error('验证失败：', result.errors)
}
```

---

#### `validateAsync(data: unknown): Promise<ValidationResult>`

异步验证数据。

**参数：**
- `data` - 要验证的数据

**返回值：** Promise<ValidationResult>

**示例：**

```typescript
const result = await userSchema.validateAsync(userData)
```

---

#### `addField(name: string, rules: ValidationRules): Schema`

添加字段验证规则。

**参数：**
- `name` - 字段名
- `rules` - 验证规则

**返回值：** Schema 实例（链式调用）

**示例：**

```typescript
userSchema
  .addField('username', {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-z0-9_]+$/i,
  })
  .addField('password', {
    required: true,
    minLength: 8,
  })
```

---

### Validator

验证器类，提供链式 API。

#### 构造函数

```typescript
new Validator()
```

---

#### `string(): StringValidator`

添加字符串验证。

**返回值：** StringValidator

**示例：**

```typescript
import { Validator } from '@toolkit-house/validation'

const schema = new Validator()
  .string('name')
  .required()
  .minLength(2)
  .maxLength(50)
  .build()
```

---

#### `number(): NumberValidator`

添加数字验证。

**返回值：** NumberValidator

**示例：**

```typescript
const schema = new Validator()
  .number('age')
  .required()
  .min(0)
  .max(120)
  .build()
```

---

#### `boolean(): BooleanValidator`

添加布尔值验证。

**返回值：** BooleanValidator

**示例：**

```typescript
const schema = new Validator()
  .boolean('isActive')
  .required()
  .build()
```

---

#### `array(): ArrayValidator`

添加数组验证。

**返回值：** ArrayValidator

**示例：**

```typescript
const schema = new Validator()
  .array('tags')
  .required()
  .minLength(1)
  .maxLength(5)
  .build()
```

---

#### `object(): ObjectValidator`

添加对象验证。

**返回值：** ObjectValidator

**示例：**

```typescript
const schema = new Validator()
  .object('address')
  .required()
  .addField('street').string().required()
  .addField('city').string().required()
  .build()
```

---

### 内置验证规则

#### 字符串规则

```typescript
{
  required: boolean           // 必填
  minLength: number          // 最小长度
  maxLength: number          // 最大长度
  pattern: RegExp            // 正则表达式
  email: boolean             // 邮箱格式
  url: boolean               // URL 格式
  uuid: boolean              // UUID 格式
  in: string[]               // 枚举值
}
```

**示例：**

```typescript
const schema = new Schema({
  email: { required: true, email: true },
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-z0-9_]+$/i,
  },
  role: {
    required: true,
    in: ['admin', 'user', 'guest'],
  },
})
```

---

#### 数字规则

```typescript
{
  required: boolean           // 必填
  min: number                // 最小值
  max: number                // 最大值
  integer: boolean           // 整数
  positive: boolean          // 正数
  in: number[]               // 枚举值
}
```

**示例：**

```typescript
const schema = new Schema({
  age: { required: true, min: 0, max: 120, integer: true },
  price: { required: true, min: 0, positive: true },
})
```

---

#### 数组规则

```typescript
{
  required: boolean           // 必填
  minLength: number          // 最小长度
  maxLength: number          // 最大长度
  unique: boolean            // 唯一值
  item: Schema               // 项目验证
}
```

**示例：**

```typescript
const schema = new Schema({
  tags: {
    required: true,
    minLength: 1,
    maxLength: 5,
    unique: true,
  },
  items: {
    required: true,
    item: new Schema({
      name: { required: true },
      quantity: { required: true, min: 1 },
    }),
  },
})
```

---

## 自定义验证器

### 添加自定义规则

```typescript
import { Schema, addValidator } from '@toolkit-house/validation'

// 添加自定义验证器
addValidator('passwordStrength', {
  validate: (value: string) => {
    const hasUpperCase = /[A-Z]/.test(value)
    const hasLowerCase = /[a-z]/.test(value)
    const hasNumber = /[0-9]/.test(value)
    const hasSpecial = /[^A-Za-z0-9]/.test(value)
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecial
  },
  message: '密码必须包含大小写字母、数字和特殊字符',
})

// 使用自定义验证器
const schema = new Schema({
  password: {
    required: true,
    minLength: 8,
    passwordStrength: true,
  },
})
```

---

## 使用示例

### 基本验证

```typescript
import { Schema } from '@toolkit-house/validation'

const userSchema = new Schema({
  name: { required: true, minLength: 2 },
  email: { required: true, email: true },
  age: { required: false, min: 0, max: 120 },
})

const result = userSchema.validate({
  name: 'Alice',
  email: 'alice@example.com',
})

console.log(result.valid) // true
```

### 链式验证

```typescript
import { Validator } from '@toolkit-house/validation'

const schema = new Validator()
  .string('name')
  .required()
  .minLength(2)
  .maxLength(50)
  .number('age')
  .required()
  .min(0)
  .max(120)
  .string('email')
  .required()
  .email()
  .build()

const result = schema.validate(userData)
```

### 嵌套对象验证

```typescript
const schema = new Schema({
  user: {
    required: true,
    nested: new Schema({
      name: { required: true },
      email: { required: true, email: true },
    }),
  },
  address: {
    required: false,
    nested: new Schema({
      street: { required: true },
      city: { required: true },
      country: { required: true },
    }),
  },
})
```

### 数组验证

```typescript
const schema = new Schema({
  tags: {
    required: true,
    minLength: 1,
    maxLength: 5,
  },
  items: {
    required: true,
    item: new Schema({
      id: { required: true },
      name: { required: true },
      price: { required: true, min: 0 },
    }),
  },
})
```

### 异步验证

```typescript
const schema = new Schema({
  email: {
    required: true,
    email: true,
    unique: async (value) => {
      const exists = await checkEmailExists(value)
      return !exists
    },
  },
})

const result = await schema.validateAsync({ email: 'user@example.com' })
```

---

## 错误处理

### 错误格式

```typescript
interface ValidationResult {
  valid: boolean
  errors?: Record<string, string[]>
}

// 示例错误输出
{
  valid: false,
  errors: {
    name: ['姓名不能为空', '姓名长度至少为 2 个字符'],
    email: ['邮箱格式不正确'],
    age: ['年龄必须在 0 到 120 之间']
  }
}
```

### 自定义错误消息

```typescript
const schema = new Schema({
  name: {
    required: true,
    minLength: 2,
    messages: {
      required: '姓名是必填项',
      minLength: '姓名至少需要 2 个字符',
    },
  },
})
```

---

## 类型定义

### SchemaDefinition

```typescript
type SchemaDefinition<T> = {
  [K in keyof T]?: ValidationRules | {
    required?: boolean
    nested?: Schema<any>
    [key: string]: any
  }
}
```

### ValidationRules

```typescript
type ValidationRules = {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  email?: boolean
  url?: boolean
  in?: any[]
  [key: string]: any
}
```

---

## 模块导出

```typescript
// 模式验证
import {
  Schema,
  Validator
} from '@toolkit-house/validation'

// 验证器添加
import {
  addValidator
} from '@toolkit-house/validation'

// 类型
import type {
  ValidationResult,
  SchemaDefinition,
  ValidationRules
} from '@toolkit-house/validation'
```

---

## 相关文档

- [包指南](/packages/validation) - 使用指南和示例
- [GitHub 仓库](https://github.com/your-org/toolkit-house) - 源代码
<!-- </div> -->
