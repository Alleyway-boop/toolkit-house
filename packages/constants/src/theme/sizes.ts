/**
 * 尺寸常量
 */

/**
 * 间距（spacing）
 */
export const SPACING = {
  // 基础间距
  XS: 4, // 4px
  SM: 8, // 8px
  MD: 16, // 16px
  LG: 24, // 24px
  XL: 32, // 32px
  XXL: 48, // 48px
  XXXL: 64, // 64px

  // 特殊间距
  ZERO: 0,
  AUTO: 'auto',

  // 百分比间距
  PERCENT_5: '5%',
  PERCENT_10: '10%',
  PERCENT_15: '15%',
  PERCENT_20: '20%',
  PERCENT_25: '25%',
  PERCENT_50: '50%',
  PERCENT_75: '75%',
  PERCENT_100: '100%',
} as const;

/**
 * 字体大小（font sizes）
 */
export const FONT_SIZES = {
  // 绝对大小
  XS: 12, // 12px
  SM: 14, // 14px
  MD: 16, // 16px
  LG: 18, // 18px
  XL: 20, // 20px
  XXL: 24, // 24px
  XXXL: 32, // 32px
  HUGE: 40, // 40px

  // 标题大小
  H1: 40, // 40px
  H2: 32, // 32px
  H3: 28, // 28px
  H4: 24, // 24px
  H5: 20, // 20px
  H6: 18, // 18px

  // 相对大小（rem）
  XS_REM: '0.75rem', // 12px
  SM_REM: '0.875rem', // 14px
  MD_REM: '1rem', // 16px
  LG_REM: '1.125rem', // 18px
  XL_REM: '1.25rem', // 20px
  XXL_REM: '1.5rem', // 24px
  XXXL_REM: '2rem', // 32px
} as const;

/**
 * 字重（font weights）
 */
export const FONT_WEIGHTS = {
  THIN: 100,
  EXTRA_LIGHT: 200,
  LIGHT: 300,
  NORMAL: 400,
  MEDIUM: 500,
  SEMI_BOLD: 600,
  BOLD: 700,
  EXTRA_BOLD: 800,
  BLACK: 900,
} as const;

/**
 * 行高（line heights）
 */
export const LINE_HEIGHTS = {
  TIGHT: 1.2,
  NORMAL: 1.4,
  RELAXED: 1.6,
  LOOSE: 1.8,
  EXTRA_LOOSE: 2.0,
} as const;

/**
 * 边框宽度（border widths）
 */
export const BORDER_WIDTHS = {
  NONE: 0,
  THIN: 1,
  NORMAL: 2,
  THICK: 4,
  EXTRA_THICK: 8,
} as const;

/**
 * 圆角（border radius）
 */
export const BORDER_RADIUS = {
  NONE: 0,
  SM: 4, // 4px
  MD: 8, // 8px
  LG: 12, // 12px
  XL: 16, // 16px
  XXL: 24, // 24px
  FULL: '50%', // 圆形
  PILL: 9999, // 胶囊形状
} as const;

/**
 * 阴影（shadows）
 */
export const SHADOWS = {
  NONE: 'none',
  SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  MD: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  XXL: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  INNER: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

/**
 * 宽度（widths）
 */
export const WIDTHS = {
  // 常用宽度
  AUTO: 'auto',
  FULL: '100%',
  HALF: '50%',
  THIRD: '33.333%',
  QUARTER: '25%',
  FIFTH: '20%',
  TWO_THIRDS: '66.666%',
  THREE_QUARTERS: '75%',
  FOUR_FIFTHS: '80%',

  // 固定宽度
  XS: 320, // 移动设备
  SM: 640, // 平板
  MD: 768, // 小屏幕
  LG: 1024, // 桌面
  XL: 1280, // 大屏幕
  XXL: 1536, // 超大屏幕
} as const;

/**
 * 高度（heights）
 */
export const HEIGHTS = {
  AUTO: 'auto',
  FULL: '100%',
  SCREEN: '100vh',
  MIN_SCREEN: '100vh',

  // 常用高度
  XS: 8,
  SM: 16,
  MD: 24,
  LG: 32,
  XL: 48,
  XXL: 64,
} as const;

/**
 * 断点（breakpoints）
 */
export const BREAKPOINTS = {
  XS: 480, // 手机
  SM: 768, // 平板
  MD: 992, // 小屏幕桌面
  LG: 1200, // 桌面
  XL: 1600, // 大屏幕
  XXL: 1920, // 超大屏幕
} as const;

/**
 * Z-index 层级
 */
export const Z_INDEX = {
  AUTO: 'auto',
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
  MAX: 9999,
} as const;

/**
 * 透明度（opacity）
 */
export const OPACITY = {
  TRANSPARENT: 0,
  LOW: 0.25,
  MEDIUM: 0.5,
  HIGH: 0.75,
  OPAQUE: 1,
} as const;