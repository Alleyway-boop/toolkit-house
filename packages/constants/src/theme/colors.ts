/**
 * 颜色常量
 */

/**
 * 基础颜色
 */
export const COLORS = {
  // 主色调
  PRIMARY: '#1890ff',
  PRIMARY_LIGHT: '#40a9ff',
  PRIMARY_DARK: '#096dd9',

  // 辅助色
  SECONDARY: '#722ed1',
  SECONDARY_LIGHT: '#9254de',
  SECONDARY_DARK: '#531dab',

  // 成功色
  SUCCESS: '#52c41a',
  SUCCESS_LIGHT: '#73d13d',
  SUCCESS_DARK: '#389e0d',

  // 警告色
  WARNING: '#faad14',
  WARNING_LIGHT: '#ffc53d',
  WARNING_DARK: '#d48806',

  // 错误色
  ERROR: '#ff4d4f',
  ERROR_LIGHT: '#ff7875',
  ERROR_DARK: '#cf1322',

  // 信息色
  INFO: '#1890ff',
  INFO_LIGHT: '#40a9ff',
  INFO_DARK: '#096dd9',
} as const;

/**
 * 中性色
 */
export const NEUTRAL_COLORS = {
  // 文本色
  TEXT_PRIMARY: '#262626',
  TEXT_SECONDARY: '#595959',
  TEXT_TERTIARY: '#8c8c8c',
  TEXT_QUATERNARY: '#bfbfbf',
  TEXT_DISABLED: '#d9d9d9',

  // 背景色
  BG_PRIMARY: '#ffffff',
  BG_SECONDARY: '#fafafa',
  BG_TERTIARY: '#f5f5f5',
  BG_QUATERNARY: '#f0f0f0',
  BG_DISABLED: '#f5f5f5',

  // 边框色
  BORDER_PRIMARY: '#d9d9d9',
  BORDER_SECONDARY: '#e8e8e8',
  BORDER_TERTIARY: '#f0f0f0',
  BORDER_DISABLED: '#e8e8e8',

  // 分割线色
  DIVIDER: '#f0f0f0',

  // 阴影色
  SHADOW: 'rgba(0, 0, 0, 0.1)',
  SHADOW_DARK: 'rgba(0, 0, 0, 0.2)',
} as const;

/**
 * 深色主题颜色
 */
export const DARK_COLORS = {
  // 文本色
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#a6a6a6',
  TEXT_TERTIARY: '#737373',
  TEXT_QUATERNARY: '#595959',
  TEXT_DISABLED: '#434343',

  // 背景色
  BG_PRIMARY: '#141414',
  BG_SECONDARY: '#1f1f1f',
  BG_TERTIARY: '#262626',
  BG_QUATERNARY: '#303030',
  BG_DISABLED: '#262626',

  // 边框色
  BORDER_PRIMARY: '#434343',
  BORDER_SECONDARY: '#303030',
  BORDER_TERTIARY: '#262626',
  BORDER_DISABLED: '#303030',

  // 分割线色
  DIVIDER: '#303030',

  // 阴影色
  SHADOW: 'rgba(0, 0, 0, 0.3)',
  SHADOW_DARK: 'rgba(0, 0, 0, 0.5)',
} as const;

/**
 * 渐变色
 */
export const GRADIENTS = {
  // 蓝色渐变
  BLUE_PRIMARY: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  BLUE_LIGHT: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  BLUE_DARK: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',

  // 绿色渐变
  GREEN_PRIMARY: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  GREEN_LIGHT: 'linear-gradient(135deg, #96e6a1 0%, #d4fc79 100%)',
  GREEN_DARK: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',

  // 紫色渐变
  PURPLE_PRIMARY: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  PURPLE_LIGHT: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  PURPLE_DARK: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',

  // 橙色渐变
  ORANGE_PRIMARY: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  ORANGE_LIGHT: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  ORANGE_DARK: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)',
} as const;

/**
 * 状态颜色
 */
export const STATUS_COLORS = {
  // 在线状态
  ONLINE: '#52c41a',
  OFFLINE: '#bfbfbf',
  BUSY: '#fa8c16',
  AWAY: '#faad14',

  // 系统状态
  HEALTHY: '#52c41a',
  WARNING: '#faad14',
  ERROR: '#ff4d4f',
  UNKNOWN: '#d9d9d9',

  // 优先级
  HIGH: '#ff4d4f',
  MEDIUM: '#faad14',
  LOW: '#52c41a',
  NONE: '#d9d9d9',
} as const;

/**
 * 品牌色
 */
export const BRAND_COLORS = {
  // 社交媒体
  FACEBOOK: '#1877f2',
  TWITTER: '#1da1f2',
  INSTAGRAM: '#e4405f',
  LINKEDIN: '#0077b5',
  YOUTUBE: '#ff0000',
  WEIBO: '#e6162d',
  WECHAT: '#07c160',
  QQ: '#1da1f2',

  // 技术公司
  GOOGLE: '#4285f4',
  MICROSOFT: '#00a1f1',
  APPLE: '#000000',
  AMAZON: '#ff9900',
  ALIBABA: '#ff6a00',
  TENCENT: '#00b140',
  BAIDU: '#2932e1',

  // 开源项目
  GITHUB: '#24292e',
  GITLAB: '#fca121',
  BITBUCKET: '#0052cc',
  VUE: '#4fc08d',
  REACT: '#61dafb',
  ANGULAR: '#dd0031',
} as const;