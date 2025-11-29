/**
 * 商品相关常量
 */

/**
 * 商品状态
 */
export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
  ARCHIVED: 'archived',
  OUT_OF_STOCK: 'out_of_stock',
  DISCONTINUED: 'discontinued',
} as const;

/**
 * 商品类型
 */
export const PRODUCT_TYPES = {
  PHYSICAL: 'physical',
  DIGITAL: 'digital',
  SERVICE: 'service',
  SUBSCRIPTION: 'subscription',
  BUNDLE: 'bundle',
  VIRTUAL: 'virtual',
} as const;

/**
 * 商品条件
 */
export const PRODUCT_CONDITION = {
  NEW: 'new',
  LIKE_NEW: 'like_new',
  VERY_GOOD: 'very_good',
  GOOD: 'good',
  ACCEPTABLE: 'acceptable',
  SALVAGE: 'salvage',
} as const;

/**
 * 库存状态
 */
export const INVENTORY_STATUS = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
  DISCONTINUED: 'discontinued',
  ON_ORDER: 'on_order',
} as const;

/**
 * 商品分类级别
 */
export const CATEGORY_LEVELS = {
  ROOT: 0,
  PRIMARY: 1,
  SECONDARY: 2,
  TERTIARY: 3,
} as const;

/**
 * 商品标签
 */
export const PRODUCT_TAGS = {
  NEW_ARRIVAL: 'new_arrival',
  BESTSELLER: 'bestseller',
  FEATURED: 'featured',
  SALE: 'sale',
  CLEARANCE: 'clearance',
  LIMITED_EDITION: 'limited_edition',
  EXCLUSIVE: 'exclusive',
  TRENDING: 'trending',
  RECOMMENDED: 'recommended',
} as const;

/**
 * 评分等级
 */
export const RATING_LEVELS = {
  EXCELLENT: 5,
  GOOD: 4,
  AVERAGE: 3,
  POOR: 2,
  TERRIBLE: 1,
} as const;

/**
 * 商品状态显示文本
 */
export const PRODUCT_STATUS_TEXT = {
  [PRODUCT_STATUS.ACTIVE]: '上架',
  [PRODUCT_STATUS.INACTIVE]: '下架',
  [PRODUCT_STATUS.DRAFT]: '草稿',
  [PRODUCT_STATUS.ARCHIVED]: '已归档',
  [PRODUCT_STATUS.OUT_OF_STOCK]: '缺货',
  [PRODUCT_STATUS.DISCONTINUED]: '已停产',
} as const;

/**
 * 库存状态显示文本
 */
export const INVENTORY_STATUS_TEXT = {
  [INVENTORY_STATUS.IN_STOCK]: '有货',
  [INVENTORY_STATUS.LOW_STOCK]: '库存不足',
  [INVENTORY_STATUS.OUT_OF_STOCK]: '缺货',
  [INVENTORY_STATUS.DISCONTINUED]: '已停产',
  [INVENTORY_STATUS.ON_ORDER]: '采购中',
} as const;