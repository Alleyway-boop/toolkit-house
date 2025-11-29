/**
 * 字体相关常量
 */

/**
 * 字体系列（font families）
 */
export const FONT_FAMILIES = {
  // 无衬线字体
  SANS: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    '"Noto Sans"',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    '"Noto Color Emoji"',
  ].join(', '),

  // 衬线字体
  SERIF: [
    'Georgia',
    'Cambria',
    '"Times New Roman"',
    'Times',
    'serif',
  ].join(', '),

  // 等宽字体
  MONO: [
    'Menlo',
    'Monaco',
    'Consolas',
    '"Liberation Mono"',
    '"Courier New"',
    'monospace',
  ].join(', '),

  // 中文字体
  CHINESE: [
    '"PingFang SC"',
    '"Hiragino Sans GB"',
    '"Microsoft YaHei"',
    '"WenQuanYi Micro Hei"',
    'sans-serif',
  ].join(', '),

  // 日文字体
  JAPANESE: [
    '"Hiragino Kaku Gothic ProN"',
    '"Hiragino Sans"',
    'YuGothic',
    'Yu Gothic',
    '"Meiryo"',
    'sans-serif',
  ].join(', '),

  // 韩文字体
  KOREAN: [
    '"Malgun Gothic"',
    'Gulim',
    'sans-serif',
  ].join(', '),

  // 系统字体
  SYSTEM: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    'Helvetica',
    'Arial',
    'sans-serif',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
  ].join(', '),
} as const;

/**
 * 常用英文字体名称
 */
export const ENGLISH_FONTS = {
  ARIAL: 'Arial',
  HELVETICA: 'Helvetica',
  TIMES_NEW_ROMAN: 'Times New Roman',
  GEORGIA: 'Georgia',
  VERDANA: 'Verdana',
  TAHOMA: 'Tahoma',
  TREBUCHET_MS: 'Trebuchet MS',
  IMPACT: 'Impact',
  COMIC_SANS_MS: 'Comic Sans MS',
  COURIER_NEW: 'Courier New',
  LUCIDA_CONSOLE: 'Lucida Console',
} as const;

/**
 * 常用中文字体名称
 */
export const CHINESE_FONTS = {
  SONG: '宋体',
  HEI: '黑体',
  KAI: '楷体',
  FANG_SONG: '仿宋',
  SIM_SUN: 'SimSun',
  SIM_HEI: 'SimHei',
  MICROSOFT_YAHEI: 'Microsoft YaHei',
  MICROSOFT_JHENGHEI: 'Microsoft JhengHei',
  PINGFANG_SC: 'PingFang SC',
  HIRAGINO_SANS_GB: 'Hiragino Sans GB',
  WENQUANYI_MICRO_HEI: 'WenQuanYi Micro Hei',
} as const;

/**
 * 字体样式（font styles）
 */
export const FONT_STYLES = {
  NORMAL: 'normal',
  ITALIC: 'italic',
  OBLIQUE: 'oblique',
} as const;

/**
 * 文本转换（text transforms）
 */
export const TEXT_TRANSFORMS = {
  NONE: 'none',
  CAPITALIZE: 'capitalize',
  UPPERCASE: 'uppercase',
  LOWERCASE: 'lowercase',
} as const;

/**
 * 文本装饰（text decorations）
 */
export const TEXT_DECORATIONS = {
  NONE: 'none',
  UNDERLINE: 'underline',
  OVERLINE: 'overline',
  LINE_THROUGH: 'line-through',
  BLINK: 'blink',
} as const;

/**
 * 文本对齐（text align）
 */
export const TEXT_ALIGNS = {
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center',
  JUSTIFY: 'justify',
} as const;

/**
 * 文本换行（text wrapping）
 */
export const TEXT_WRAPPING = {
  NORMAL: 'normal',
  NOWRAP: 'nowrap',
  PRE: 'pre',
  PRE_WRAP: 'pre-wrap',
  PRE_LINE: 'pre-line',
  BREAK_WORD: 'break-word',
} as const;

/**
 * 文本溢出（text overflow）
 */
export const TEXT_OVERFLOW = {
  CLIP: 'clip',
  ELLIPSIS: 'ellipsis',
  STRING: 'string',
} as const;

/**
 * 字母间距（letter spacing）
 */
export const LETTER_SPACING = {
  TIGHTER: '-0.05em',
  TIGHTER_2: '-0.025em',
  NORMAL: '0em',
  WIDE: '0.025em',
  WIDER: '0.05em',
  WIDEST: '0.1em',
} as const;

/**
 * 单词间距（word spacing）
 */
export const WORD_SPACING = {
  TIGHTER: '-0.05em',
  NORMAL: '0em',
  WIDER: '0.05em',
  WIDEST: '0.1em',
} as const;

/**
 * 垂直对齐（vertical align）
 */
export const VERTICAL_ALIGNS = {
  BASELINE: 'baseline',
  TOP: 'top',
  MIDDLE: 'middle',
  BOTTOM: 'bottom',
  TEXT_TOP: 'text-top',
  TEXT_BOTTOM: 'text-bottom',
  SUB: 'sub',
  SUPER: 'super',
} as const;