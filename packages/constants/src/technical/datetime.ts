/**
 * 日期时间相关常量
 */

/**
 * 时间格式
 */
export const DATETIME_FORMATS = {
  // ISO 格式
  ISO_DATE: 'YYYY-MM-DD',
  ISO_TIME: 'HH:mm:ss',
  ISO_DATETIME: 'YYYY-MM-DDTHH:mm:ssZ',
  ISO_DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm:ss',

  // 常用格式
  DATE_SLASH: 'YYYY/MM/DD',
  DATE_DOT: 'YYYY.MM.DD',
  DATE_CN: 'YYYY年MM月DD日',
  TIME_12H: 'hh:mm A',
  TIME_24H: 'HH:mm',
  DATETIME_SLASH: 'YYYY/MM/DD HH:mm:ss',
  DATETIME_CN: 'YYYY年MM月DD日 HH:mm:ss',
  DATETIME_FRIENDLY: 'MM月DD日 HH:mm',

  // 文件格式
  FILENAME_SAFE: 'YYYY-MM-DD_HH-mm-ss',
  TIMESTAMP: 'YYYYMMDDHHmmss',
  DATE_COMPACT: 'YYYYMMDD',
} as const;

/**
 * 时间单位（毫秒）
 */
export const TIME_UNITS = {
  MILLISECOND: 1,
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
} as const;

/**
 * 时区
 */
export const TIMEZONES = {
  UTC: 'UTC',
  LOCAL: 'Local',
  // 主要时区
  EST: 'America/New_York', // 东部标准时间
  PST: 'America/Los_Angeles', // 太平洋标准时间
  CST: 'America/Chicago', // 中部标准时间
  MST: 'America/Denver', // 山地标准时间

  // 亚洲时区
  JST: 'Asia/Tokyo', // 日本标准时间
  KST: 'Asia/Seoul', // 韩国标准时间
  CST_CHINA: 'Asia/Shanghai', // 中国标准时间
  IST: 'Asia/Kolkata', // 印度标准时间

  // 欧洲时区
  GMT: 'Europe/London', // 格林威治标准时间
  CET: 'Europe/Paris', // 中欧时间
  EET: 'Europe/Helsinki', // 东欧时间

  // 澳洲时区
  AEST: 'Australia/Sydney', // 澳洲东部标准时间
  AWST: 'Australia/Perth', // 澳洲西部标准时间
} as const;

/**
 * 时区偏移（相对于 UTC 的分钟数）
 */
export const TIMEZONE_OFFSETS = {
  UTC: 0,
  EST: -5 * 60, // 东部标准时间 (UTC-5)
  EDT: -4 * 60, // 东部夏令时 (UTC-4)
  CST: -6 * 60, // 中部标准时间 (UTC-6)
  CDT: -5 * 60, // 中部夏令时 (UTC-5)
  MST: -7 * 60, // 山地标准时间 (UTC-7)
  MDT: -6 * 60, // 山地夏令时 (UTC-6)
  PST: -8 * 60, // 太平洋标准时间 (UTC-8)
  PDT: -7 * 60, // 太平洋夏令时 (UTC-7)
  JST: 9 * 60, // 日本标准时间 (UTC+9)
  KST: 9 * 60, // 韩国标准时间 (UTC+9)
  CST_CHINA: 8 * 60, // 中国标准时间 (UTC+8)
  IST: 5.5 * 60, // 印度标准时间 (UTC+5:30)
  GMT: 0, // 格林威治标准时间 (UTC+0)
  CET: 1 * 60, // 中欧时间 (UTC+1)
  CEST: 2 * 60, // 中欧夏令时 (UTC+2)
  AEST: 10 * 60, // 澳洲东部标准时间 (UTC+10)
  AWST: 8 * 60, // 澳洲西部标准时间 (UTC+8)
} as const;

/**
 * 星期常量
 */
export const WEEKDAYS = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const;

/**
 * 星期名称（中文）
 */
export const WEEKDAY_NAMES_CN = {
  [WEEKDAYS.SUNDAY]: '周日',
  [WEEKDAYS.MONDAY]: '周一',
  [WEEKDAYS.TUESDAY]: '周二',
  [WEEKDAYS.WEDNESDAY]: '周三',
  [WEEKDAYS.THURSDAY]: '周四',
  [WEEKDAYS.FRIDAY]: '周五',
  [WEEKDAYS.SATURDAY]: '周六',
} as const;

/**
 * 星期名称（英文）
 */
export const WEEKDAY_NAMES_EN = {
  [WEEKDAYS.SUNDAY]: 'Sunday',
  [WEEKDAYS.MONDAY]: 'Monday',
  [WEEKDAYS.TUESDAY]: 'Tuesday',
  [WEEKDAYS.WEDNESDAY]: 'Wednesday',
  [WEEKDAYS.THURSDAY]: 'Thursday',
  [WEEKDAYS.FRIDAY]: 'Friday',
  [WEEKDAYS.SATURDAY]: 'Saturday',
} as const;

/**
 * 月份常量
 */
export const MONTHS = {
  JANUARY: 1,
  FEBRUARY: 2,
  MARCH: 3,
  APRIL: 4,
  MAY: 5,
  JUNE: 6,
  JULY: 7,
  AUGUST: 8,
  SEPTEMBER: 9,
  OCTOBER: 10,
  NOVEMBER: 11,
  DECEMBER: 12,
} as const;

/**
 * 月份名称（中文）
 */
export const MONTH_NAMES_CN = {
  [MONTHS.JANUARY]: '一月',
  [MONTHS.FEBRUARY]: '二月',
  [MONTHS.MARCH]: '三月',
  [MONTHS.APRIL]: '四月',
  [MONTHS.MAY]: '五月',
  [MONTHS.JUNE]: '六月',
  [MONTHS.JULY]: '七月',
  [MONTHS.AUGUST]: '八月',
  [MONTHS.SEPTEMBER]: '九月',
  [MONTHS.OCTOBER]: '十月',
  [MONTHS.NOVEMBER]: '十一月',
  [MONTHS.DECEMBER]: '十二月',
} as const;

/**
 * 月份名称（英文）
 */
export const MONTH_NAMES_EN = {
  [MONTHS.JANUARY]: 'January',
  [MONTHS.FEBRUARY]: 'February',
  [MONTHS.MARCH]: 'March',
  [MONTHS.APRIL]: 'April',
  [MONTHS.MAY]: 'May',
  [MONTHS.JUNE]: 'June',
  [MONTHS.JULY]: 'July',
  [MONTHS.AUGUST]: 'August',
  [MONTHS.SEPTEMBER]: 'September',
  [MONTHS.OCTOBER]: 'October',
  [MONTHS.NOVEMBER]: 'November',
  [MONTHS.DECEMBER]: 'December',
} as const;