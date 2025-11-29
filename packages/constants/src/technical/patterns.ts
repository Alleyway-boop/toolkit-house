/**
 * 正则表达式模式常量
 */

/**
 * 邮箱验证正则
 */
export const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * 手机号验证正则（中国大陆）
 */
export const PHONE_PATTERN_CN = /^1[3-9]\d{9}$/;

/**
 * 手机号验证正则（国际）
 */
export const PHONE_PATTERN_INTL = /^\+?[1-9]\d{1,14}$/;

/**
 * 密码强度验证正则
 * 至少8位，包含大小写字母、数字和特殊字符
 */
export const PASSWORD_STRONG_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * 密码中等强度验证正则
 * 至少6位，包含字母和数字
 */
export const PASSWORD_MEDIUM_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

/**
 * URL 验证正则
 */
export const URL_PATTERN = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

/**
 * IP 地址验证正则（IPv4）
 */
export const IPV4_PATTERN = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

/**
 * IP 地址验证正则（IPv6）
 */
export const IPV6_PATTERN = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

/**
 * MAC 地址验证正则
 */
export const MAC_PATTERN = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

/**
 * 身份证号验证正则（中国大陆）
 */
export const ID_CARD_PATTERN_CN = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

/**
 * 护照号验证正则
 */
export const PASSPORT_PATTERN = /^[a-zA-Z0-9]{6,20}$/;

/**
 * 银行卡号验证正则
 */
export const BANK_CARD_PATTERN = /^\d{16,19}$/;

/**
 * 社会信用代码验证正则（中国大陆）
 */
export const SOCIAL_CREDIT_CODE_PATTERN_CN = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/;

/**
 * 税号验证正则（中国大陆）
 */
export const TAX_NUMBER_PATTERN_CN = /^\d{15}$/;

/**
 * 中文姓名验证正则
 */
export const CHINESE_NAME_PATTERN = /^[\u4e00-\u9fa5]{2,8}$/;

/**
 * 英文姓名验证正则
 */
export const ENGLISH_NAME_PATTERN = /^[a-zA-Z\s]{2,50}$/;

/**
 * 用户名验证正则
 * 4-20位，允许字母、数字、下划线和减号
 */
export const USERNAME_PATTERN = /^[a-zA-Z0-9_-]{4,20}$/;

/**
 * 文件名验证正则
 */
export const FILENAME_PATTERN = /^[^\\/:*?"<>|]+$/;

/**
 * 文件路径验证正则（Windows）
 */
export const FILE_PATH_PATTERN_WIN = /^[a-zA-Z]:\\(?:[^\\/:*?"<>|]+\\)*[^\\/:*?"<>|]*$/;

/**
 * 文件路径验证正则（Unix/Linux）
 */
export const FILE_PATH_PATTERN_UNIX = /^\/(?:[^\/]+\/)*[^\/]*$/;

/**
 * 颜色值验证正则（十六进制）
 */
export const HEX_COLOR_PATTERN = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

/**
 * 颜色值验证正则（RGB）
 */
export const RGB_COLOR_PATTERN = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;

/**
 * 颜色值验证正则（RGBA）
 */
export const RGBA_COLOR_PATTERN = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([01]?\.?\d*)\s*\)$/;

/**
 * 日期验证正则（YYYY-MM-DD）
 */
export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * 时间验证正则（HH:mm:ss）
 */
export const TIME_PATTERN = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

/**
 * 日期时间验证正则（YYYY-MM-DD HH:mm:ss）
 */
export const DATETIME_PATTERN = /^\d{4}-\d{2}-\d{2} ([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

/**
 * 邮政编码验证正则（中国大陆）
 */
export const ZIP_CODE_PATTERN_CN = /^\d{6}$/;

/**
 * 邮政编码验证正则（美国）
 */
export const ZIP_CODE_PATTERN_US = /^\d{5}(-\d{4})?$/;

/**
 * 数字验证正则（整数）
 */
export const INTEGER_PATTERN = /^-?\d+$/;

/**
 * 数字验证正则（小数）
 */
export const DECIMAL_PATTERN = /^-?\d*\.?\d+$/;

/**
 * 正整数验证正则
 */
export const POSITIVE_INTEGER_PATTERN = /^[1-9]\d*$/;

/**
 * 非负整数验证正则
 */
export const NON_NEGATIVE_INTEGER_PATTERN = /^(0|[1-9]\d*)$/;

/**
 * 金额验证正则（最多两位小数）
 */
export const AMOUNT_PATTERN = /^-?\d+(?:\.\d{1,2})?$/;

/**
 * 百分比验证正则
 */
export const PERCENTAGE_PATTERN = /^-?\d+(?:\.\d+)?%$/;

/**
 * JSON 字符串验证正则
 */
export const JSON_PATTERN = /^[\],:{}\s]*$|^\{(?:\{[^}]*\}|[^{}]|)*}$/;

/**
 * UUID 验证正则
 */
export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * MD5 哈希验证正则
 */
export const MD5_PATTERN = /^[a-f0-9]{32}$/i;

/**
 * SHA-1 哈希验证正则
 */
export const SHA1_PATTERN = /^[a-f0-9]{40}$/i;

/**
 * SHA-256 哈希验证正则
 */
export const SHA256_PATTERN = /^[a-f0-9]{64}$/i;

/**
 * Base64 编码验证正则
 */
export const BASE64_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;