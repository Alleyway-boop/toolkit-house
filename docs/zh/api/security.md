---
---

<!-- <div v-pre> -->
# @toolkit-house/security API 参考

Toolkit House 安全工具 - 密钥管理、加密和加密操作。

## 安装

```bash
pnpm add @toolkit-house/security
```

## 核心 API

### KeyManager

密钥管理操作的主类。

#### 构造函数

```typescript
new KeyManager(config?: KeyManagerConfig)
```

**配置选项：**

```typescript
interface KeyManagerConfig {
  keySize?: number              // 密钥大小，单位字节（默认：32）
  algorithm?: string            // 加密算法（默认：'aes-256-cbc'）
  keyDerivation?: {
    iterations?: number         // PBKDF2 迭代次数（默认：100000）
    saltLength?: number         // 盐长度，单位字节（默认：16）
    digest?: string             // 摘要算法（默认：'sha256'）
  }
}
```

---

#### `generateKey(algorithm?: string): string`

生成新的加密密钥。

**参数：**
- `algorithm` - 可选的算法覆盖

**返回值：** 用于引用密钥的密钥 ID

**示例：**

```typescript
import { defaultKeyManager } from '@toolkit-house/security'

const keyId = defaultKeyManager.generateKey('AES-256-CBC')
console.log('生成的密钥：', keyId)
```

---

#### `encrypt(data: string, keyId: string): EncryptedData`

使用指定密钥加密数据。

**参数：**
- `data` - 要加密的字符串数据
- `keyId` - 用于加密的密钥 ID

**返回值：** 加密数据对象

```typescript
interface EncryptedData {
  data: string        // Base64 编码的加密数据
  iv: string          // Base64 编码的初始化向量
  authTag?: string    // Base64 编码的身份验证标签（用于 GCM）
  algorithm: string   // 使用的加密算法
}
```

**示例：**

```typescript
const encrypted = defaultKeyManager.encrypt('你好，世界！', keyId)
console.log('加密结果：', encrypted)
```

---

#### `decrypt(encrypted: EncryptedData, keyId: string): string`

使用指定密钥解密加密数据。

**参数：**
- `encrypted` - 加密数据对象
- `keyId` - 用于解密的密钥 ID

**返回值：** 解密后的字符串

**示例：**

```typescript
const decrypted = defaultKeyManager.decrypt(encrypted, keyId)
console.log('解密结果：', decrypted) // '你好，世界！'
```

---

#### `rotateKey(keyId: string): string`

轮换加密密钥，生成新密钥。

**参数：**
- `keyId` - 要轮换的密钥 ID

**返回值：** 新密钥 ID

**示例：**

```typescript
const newKeyId = defaultKeyManager.rotateKey(keyId)
```

---

#### `reEncrypt(encrypted: EncryptedData, oldKeyId: string, newKeyId: string): EncryptedData`

使用新密钥重新加密数据。

**参数：**
- `encrypted` - 加密数据对象
- `oldKeyId` - 当前密钥 ID
- `newKeyId` - 新密钥 ID

**返回值：** 新的加密数据对象

**示例：**

```typescript
const reEncrypted = defaultKeyManager.reEncrypt(encrypted, keyId, newKeyId)
```

---

#### `removeKey(keyId: string): void`

从存储中删除密钥。

**参数：**
- `keyId` - 要删除的密钥 ID

**示例：**

```typescript
defaultKeyManager.removeKey(keyId)
```

---

#### `getKeyInfo(keyId: string): KeyInfo | undefined`

获取存储密钥的信息。

**参数：**
- `keyId` - 要查询的密钥 ID

**返回值：** 密钥信息对象或 undefined

```typescript
interface KeyInfo {
  id: string
  algorithm: string
  createdAt: Date
  size: number
}
```

**示例：**

```typescript
const keyInfo = defaultKeyManager.getKeyInfo(keyId)
console.log('密钥信息：', keyInfo)
```

---

## 单例实例

### `defaultKeyManager`

预配置的 KeyManager 单例实例。

```typescript
import { defaultKeyManager } from '@toolkit-house/security'

// 直接使用，无需实例化
const keyId = defaultKeyManager.generateKey()
```

---

## 类型定义

### EncryptedData

```typescript
interface EncryptedData {
  data: string        // Base64 编码的加密数据
  iv: string          // Base64 编码的初始化向量
  authTag?: string    // Base64 编码的身份验证标签（用于 GCM）
  algorithm: string   // 使用的加密算法
}
```

### KeyInfo

```typescript
interface KeyInfo {
  id: string
  algorithm: string
  createdAt: Date
  size: number
}
```

### KeyManagerConfig

```typescript
interface KeyManagerConfig {
  keySize?: number
  algorithm?: string
  keyDerivation?: {
    iterations?: number
    saltLength?: number
    digest?: string
  }
}
```

---

## 使用示例

### 基本加密/解密

```typescript
import { defaultKeyManager } from '@toolkit-house/security'

// 生成密钥
const keyId = defaultKeyManager.generateKey()

// 加密敏感数据
const encrypted = defaultKeyManager.encrypt(
  JSON.stringify({ userId: 123, email: 'user@example.com' }),
  keyId
)

// 需要时解密
const decrypted = defaultKeyManager.decrypt(encrypted, keyId)
const data = JSON.parse(decrypted)
```

### 密钥轮换工作流程

```typescript
// 1. 生成新密钥
const newKeyId = defaultKeyManager.rotateKey(oldKeyId)

// 2. 重新加密现有数据
const reEncrypted = defaultKeyManager.reEncrypt(
  encryptedData,
  oldKeyId,
  newKeyId
)

// 3. 删除旧密钥
defaultKeyManager.removeKey(oldKeyId)
```

### 自定义配置

```typescript
import { KeyManager } from '@toolkit-house/security'

const keyManager = new KeyManager({
  keySize: 32,
  algorithm: 'aes-256-cbc',
  keyDerivation: {
    iterations: 100000,
    saltLength: 16,
  },
})
```

---

## 安全注意事项

- **密钥存储**：密钥仅存储在内存中。请使用您自己的存储解决方案安全地持久化密钥。
- **密钥轮换**：建议生产系统定期进行密钥轮换。
- **算法**：默认使用 AES-256-CBC。对于经过身份验证的加密，请考虑使用 GCM 模式。
- **密钥派生**：PBKDF2 用于基于密码的密钥派生，具有可配置的迭代次数。

---

## 模块导出

```typescript
// 密钥管理
import {
  KeyManager,
  defaultKeyManager
} from '@toolkit-house/security'

// 类型
import type {
  EncryptedData,
  KeyInfo,
  KeyManagerConfig
} from '@toolkit-house/security'
```

---

## 相关文档

- [包指南](/packages/security) - 使用指南和示例
- [GitHub 仓库](https://github.com/your-org/toolkit-house) - 源代码
<!-- </div> -->
