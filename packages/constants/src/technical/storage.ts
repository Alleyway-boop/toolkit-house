/**
 * 存储相关常量
 */

/**
 * 存储单位（字节）
 */
export const STORAGE_UNITS = {
  BYTE: 1,
  KILOBYTE: 1024,
  MEGABYTE: 1024 * 1024,
  GIGABYTE: 1024 * 1024 * 1024,
  TERABYTE: 1024 * 1024 * 1024 * 1024,
  PETABYTE: 1024 * 1024 * 1024 * 1024 * 1024,
} as const;

/**
 * 文件大小限制（字节）
 */
export const FILE_SIZE_LIMITS = {
  SMALL: 1 * STORAGE_UNITS.MEGABYTE, // 1MB
  MEDIUM: 10 * STORAGE_UNITS.MEGABYTE, // 10MB
  LARGE: 50 * STORAGE_UNITS.MEGABYTE, // 50MB
  EXTRA_LARGE: 100 * STORAGE_UNITS.MEGABYTE, // 100MB
  HUGE: 500 * STORAGE_UNITS.MEGABYTE, // 500MB
  MAX: 1 * STORAGE_UNITS.GIGABYTE, // 1GB
} as const;

/**
 * 支持的图片格式
 */
export const SUPPORTED_IMAGE_FORMATS = [
  'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico', 'tiff', 'tif',
] as const;

/**
 * 支持的视频格式
 */
export const SUPPORTED_VIDEO_FORMATS = [
  'mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', 'm4v', '3gp', 'ogv',
] as const;

/**
 * 支持的音频格式
 */
export const SUPPORTED_AUDIO_FORMATS = [
  'mp3', 'wav', 'ogg', 'aac', 'flac', 'wma', 'm4a', 'opus', 'aiff', 'au',
] as const;

/**
 * 支持的文档格式
 */
export const SUPPORTED_DOCUMENT_FORMATS = [
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'ods', 'odp',
] as const;

/**
 * 支持的压缩格式
 */
export const SUPPORTED_ARCHIVE_FORMATS = [
  'zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'arj', 'cab', 'lzh', 'ace',
] as const;

/**
 * 缓存策略
 */
export const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  CACHE_ONLY: 'cache-only',
  NETWORK_ONLY: 'network-only',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
} as const;

/**
 * 缓存时间（秒）
 */
export const CACHE_TTL = {
  IMMEDIATE: 0,
  SHORT: 60, // 1分钟
  MEDIUM: 300, // 5分钟
  LONG: 1800, // 30分钟
  HOUR: 3600, // 1小时
  DAY: 86400, // 1天
  WEEK: 604800, // 1周
  MONTH: 2592000, // 1月
} as const;

/**
 * 数据库连接类型
 */
export const DB_CONNECTION_TYPES = {
  READ: 'read',
  WRITE: 'write',
  READ_WRITE: 'read_write',
} as const;

/**
 * 数据库事务隔离级别
 */
export const DB_ISOLATION_LEVELS = {
  READ_UNCOMMITTED: 'READ_UNCOMMITTED',
  READ_COMMITTED: 'READ_COMMITTED',
  REPEATABLE_READ: 'REPEATABLE_READ',
  SERIALIZABLE: 'SERIALIZABLE',
} as const;

/**
 * 存储引擎类型
 */
export const STORAGE_ENGINE_TYPES = {
  RELATIONAL: 'relational',
  DOCUMENT: 'document',
  KEY_VALUE: 'key_value',
  COLUMN_FAMILY: 'column_family',
  GRAPH: 'graph',
  TIME_SERIES: 'time_series',
  SEARCH: 'search',
} as const;

/**
 * 云存储提供商
 */
export const CLOUD_STORAGE_PROVIDERS = {
  AWS_S3: 'aws_s3',
  GOOGLE_CLOUD_STORAGE: 'google_cloud_storage',
  AZURE_BLOB_STORAGE: 'azure_blob_storage',
  ALIYUN_OSS: 'aliyun_oss',
  TENCENT_COS: 'tencent_cos',
  QINIU_KODO: 'qiniu_kodo',
  VOLCENGINE_TOS: 'volcengine_tos',
} as const;