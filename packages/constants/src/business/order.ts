/**
 * 订单相关常量
 */

/**
 * 订单状态
 */
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  RETURNED: 'returned',
  EXCHANGED: 'exchanged',
} as const;

/**
 * 支付状态
 */
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
} as const;

/**
 * 支付方式
 */
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  ALIPAY: 'alipay',
  WECHAT_PAY: 'wechat_pay',
  BANK_TRANSFER: 'bank_transfer',
  CASH_ON_DELIVERY: 'cash_on_delivery',
  CRYPTOCURRENCY: 'cryptocurrency',
} as const;

/**
 * 配送方式
 */
export const SHIPPING_METHODS = {
  STANDARD: 'standard',
  EXPRESS: 'express',
  OVERNIGHT: 'overnight',
  INTERNATIONAL: 'international',
  PICKUP: 'pickup',
  DIGITAL: 'digital',
} as const;

/**
 * 订单类型
 */
export const ORDER_TYPES = {
  REGULAR: 'regular',
  SUBSCRIPTION: 'subscription',
  PREORDER: 'preorder',
  BULK: 'bulk',
  GIFT: 'gift',
  EXCHANGE: 'exchange',
  RETURN: 'return',
} as const;

/**
 * 退款状态
 */
export const REFUND_STATUS = {
  REQUESTED: 'requested',
  PROCESSING: 'processing',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

/**
 * 订单优先级
 */
export const ORDER_PRIORITY = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

/**
 * 订单状态显示文本
 */
export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING]: '待处理',
  [ORDER_STATUS.CONFIRMED]: '已确认',
  [ORDER_STATUS.PROCESSING]: '处理中',
  [ORDER_STATUS.SHIPPED]: '已发货',
  [ORDER_STATUS.DELIVERED]: '已送达',
  [ORDER_STATUS.CANCELLED]: '已取消',
  [ORDER_STATUS.REFUNDED]: '已退款',
  [ORDER_STATUS.RETURNED]: '已退货',
  [ORDER_STATUS.EXCHANGED]: '已换货',
} as const;

/**
 * 支付状态显示文本
 */
export const PAYMENT_STATUS_TEXT = {
  [PAYMENT_STATUS.PENDING]: '待支付',
  [PAYMENT_STATUS.PROCESSING]: '支付中',
  [PAYMENT_STATUS.COMPLETED]: '支付完成',
  [PAYMENT_STATUS.FAILED]: '支付失败',
  [PAYMENT_STATUS.CANCELLED]: '支付取消',
  [PAYMENT_STATUS.REFUNDED]: '已退款',
  [PAYMENT_STATUS.PARTIALLY_REFUNDED]: '部分退款',
} as const;