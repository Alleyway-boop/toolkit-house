# @toolkit-house/constants

一个完全独立的常量定义包，为现代 Web 应用程序提供全面的常量定义。

## 特性

- ✅ **零依赖** - 纯数据定义，无任何外部依赖
- ✅ **子路径导出** - 支持按模块导入，减少包体积
- ✅ **TypeScript 支持** - 完整的类型定义
- ✅ **全面的覆盖** - 包含通用、业务、技术、环境、主题等各类常量
- ✅ **国际化支持** - 中英文对照显示文本
- ✅ **标准规范** - 遵循行业标准命名和数值

## 安装

```bash
npm install @toolkit-house/constants
```

```bash
pnpm add @toolkit-house/constants
```

```bash
yarn add @toolkit-house/constants
```

## 使用方法

### 主入口导入

```typescript
import {
  HTTP_STATUS,
  USER_STATUS,
  COLORS,
  ENVIRONMENTS
} from '@toolkit-house/constants';

console.log(HTTP_STATUS.OK); // 200
console.log(USER_STATUS.ACTIVE); // 'active'
console.log(COLORS.PRIMARY); // '#1890ff'
console.log(ENVIRONMENTS.PRODUCTION); // 'production'
```

### 子路径导入（推荐）

只导入需要的模块，减少包体积：

```typescript
// 导入通用常量
import { HTTP_STATUS, ERROR_CODES } from '@toolkit-house/constants/common';

// 导入业务常量
import { USER_STATUS, ORDER_STATUS } from '@toolkit-house/constants/business';

// 导入技术常量
import { DATETIME_FORMATS, EMAIL_PATTERN } from '@toolkit-house/constants/technical';

// 导入环境常量
import { ENVIRONMENTS, LOG_LEVELS } from '@toolkit-house/constants/environment';

// 导入主题常量
import { COLORS, SPACING, FONT_SIZES } from '@toolkit-house/constants/theme';
```

## 模块介绍

### 通用常量 (`/common`)

HTTP 状态码、错误码、头部信息、MIME 类型等通用常量。

```typescript
import { HTTP_STATUS, ERROR_CODES, MIME_TYPES } from '@toolkit-house/constants/common';

// HTTP 状态码
if (response.status === HTTP_STATUS.OK) {
  // 处理成功响应
}

// 错误码
if (errorCode === ERROR_CODES.UNAUTHORIZED) {
  // 处理未授权错误
}

// MIME 类型
const contentType = MIME_TYPES.JSON; // 'application/json'
```

### 业务常量 (`/business`)

用户状态、订单状态、商品状态等业务相关常量。

```typescript
import {
  USER_STATUS,
  USER_ROLES,
  ORDER_STATUS,
  PAYMENT_METHODS
} from '@toolkit-house/constants/business';

// 用户状态
if (user.status === USER_STATUS.ACTIVE) {
  // 用户处于活跃状态
}

// 订单状态
switch (order.status) {
  case ORDER_STATUS.PENDING:
    // 处理待处理订单
    break;
  case ORDER_STATUS.SHIPPED:
    // 处理已发货订单
    break;
}

// 支付方式
const paymentMethod = PAYMENT_METHODS.ALIPAY;
```

### 技术常量 (`/technical`)

日期格式、正则表达式、存储单位等技术相关常量。

```typescript
import {
  DATETIME_FORMATS,
  EMAIL_PATTERN,
  STORAGE_UNITS,
  FILE_SIZE_LIMITS
} from '@toolkit-house/constants/technical';

// 日期格式化
const format = DATETIME_FORMATS.ISO_DATETIME; // 'YYYY-MM-DDTHH:mm:ssZ'

// 正则验证
if (EMAIL_PATTERN.test(email)) {
  // 邮箱格式正确
}

// 文件大小限制
const maxFileSize = FILE_SIZE_LIMITS.MEDIUM; // 10MB
```

### 环境常量 (`/environment`)

环境类型、日志级别、云平台提供商等环境相关常量。

```typescript
import {
  ENVIRONMENTS,
  LOG_LEVELS,
  CLOUD_PROVIDERS
} from '@toolkit-house/constants/environment';

// 环境判断
if (process.env.NODE_ENV === ENVIRONMENTS.PRODUCTION) {
  // 生产环境配置
}

// 日志级别
const logLevel = LOG_LEVELS.ERROR; // 'error'

// 云平台选择
const provider = CLOUD_PROVIDERS.AWS; // 'aws'
```

### 主题常量 (`/theme`)

颜色、尺寸、字体等设计系统令牌。

```typescript
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS
} from '@toolkit-house/constants/theme';

// 颜色使用
const primaryColor = COLORS.PRIMARY; // '#1890ff'
const successColor = COLORS.SUCCESS; // '#52c41a'

// 间距使用
const padding = SPACING.MD; // 16px

// 字体大小
const titleSize = FONT_SIZES.H1; // 40px

// 圆角
const borderRadius = BORDER_RADIUS.LG; // 12px
```

## 常量分类

### 通用常量

- **HTTP 相关**: 状态码、方法、头部、MIME 类型
- **错误码**: 业务错误码、错误级别、错误类型
- **通用编码**: 各种标准编码和格式

### 业务常量

- **用户相关**: 用户状态、角色、类型、性别
- **订单相关**: 订单状态、支付状态、配送方式
- **商品相关**: 商品状态、类型、库存状态
- **支付相关**: 支付方式、支付状态
- **评分相关**: 评分等级、评价状态

### 技术常量

- **日期时间**: 时间格式、时区、时间单位
- **正则表达式**: 各种验证模式
- **存储相关**: 存储单位、文件大小、格式支持
- **缓存相关**: 缓存策略、TTL 时间
- **数据库相关**: 连接类型、隔离级别

### 环境常量

- **环境类型**: 开发、测试、预发布、生产
- **运行时环境**: Node.js、浏览器、操作系统
- **云平台**: 各种云服务提供商
- **监控平台**: 监控和日志平台
- **CI/CD**: 持续集成和部署平台

### 主题常量

- **颜色**: 主色调、辅助色、状态色、品牌色
- **尺寸**: 间距、字体大小、边框、圆角
- **字体**: 字体系列、字重、行高
- **布局**: 宽度、高度、断点
- **效果**: 阴影、透明度、Z-index

## API 参考

### 模块导出

每个模块都导出相应的常量对象，所有常量都是只读的：

```typescript
export const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  // ... 更多状态码
} as const;
```

### 类型推断

所有常量都使用 `as const` 断言，提供精确的字面量类型：

```typescript
type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
// 等同于: 200 | 201 | 204 | 400 | 401 | 403 | 404 | 500 | ...

type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];
// 等同于: 'active' | 'inactive' | 'suspended' | 'pending' | 'deleted'
```

## 最佳实践

### 1. 使用子路径导入

```typescript
// ✅ 推荐：只导入需要的模块
import { HTTP_STATUS } from '@toolkit-house/constants/common';

// ❌ 避免：导入整个包
import { HTTP_STATUS } from '@toolkit-house/constants';
```

### 2. 使用常量进行验证

```typescript
// ✅ 推荐：使用常量进行状态比较
if (user.status === USER_STATUS.ACTIVE) {
  // 处理活跃用户
}

// ❌ 避免：使用硬编码字符串
if (user.status === 'active') {
  // 容易出错，无法获得类型提示
}
```

### 3. 使用显示文本

```typescript
// ✅ 推荐：使用预定义的显示文本
const statusText = USER_STATUS_TEXT[user.status];

// ❌ 避免：硬编码显示文本
const statusText = user.status === 'active' ? '活跃' : '非活跃';
```

### 4. 结合 TypeScript 使用

```typescript
// ✅ 推荐：使用类型约束
function updateUserStatus(userId: string, status: typeof USER_STATUS[keyof typeof USER_STATUS]) {
  // 确保状态值是有效的
}

// ❌ 避免：使用泛型字符串
function updateUserStatus(userId: string, status: string) {
  // 无法验证状态值的有效性
}
```

## 贡献

欢迎提交 Issue 和 Pull Request 来完善这个常量库。

### 提交规范

- 遵循项目的代码风格
- 添加相应的类型定义
- 编写测试用例
- 更新文档

### 开发环境

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm run dev

# 运行测试
pnpm run test

# 类型检查
pnpm run typecheck

# 构建
pnpm run build
```

## 许可证

[MIT](LICENSE)

## 更新日志

### 0.0.0

- 初始版本发布
- 包含完整的常量定义
- 支持子路径导出
- 完整的 TypeScript 支持