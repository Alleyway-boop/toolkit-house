/**
 * 用户相关常量
 */

/**
 * 用户状态
 */
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending',
  DELETED: 'deleted',
} as const;

/**
 * 用户角色
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
  GUEST: 'guest',
} as const;

/**
 * 用户类型
 */
export const USER_TYPES = {
  INDIVIDUAL: 'individual',
  BUSINESS: 'business',
  ENTERPRISE: 'enterprise',
  GOVERNMENT: 'government',
} as const;

/**
 * 性别
 */
export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
  PREFER_NOT_TO_SAY: 'prefer_not_to_say',
} as const;

/**
 * 账户状态
 */
export const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  FROZEN: 'frozen',
  CLOSED: 'closed',
  REstricted: 'restricted',
  UNDER_REVIEW: 'under_review',
} as const;

/**
 * 认证状态
 */
export const VERIFICATION_STATUS = {
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
} as const;

/**
 * 用户状态显示文本
 */
export const USER_STATUS_TEXT = {
  [USER_STATUS.ACTIVE]: '活跃',
  [USER_STATUS.INACTIVE]: '非活跃',
  [USER_STATUS.SUSPENDED]: '已暂停',
  [USER_STATUS.PENDING]: '待审核',
  [USER_STATUS.DELETED]: '已删除',
} as const;

/**
 * 用户角色显示文本
 */
export const USER_ROLES_TEXT = {
  [USER_ROLES.ADMIN]: '管理员',
  [USER_ROLES.MODERATOR]: '版主',
  [USER_ROLES.USER]: '用户',
  [USER_ROLES.GUEST]: '游客',
} as const;

/**
 * 性别显示文本
 */
export const GENDER_TEXT = {
  [GENDER.MALE]: '男',
  [GENDER.FEMALE]: '女',
  [GENDER.OTHER]: '其他',
  [GENDER.PREFER_NOT_TO_SAY]: '不愿透露',
} as const;