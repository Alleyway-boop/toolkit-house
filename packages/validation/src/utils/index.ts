/**
 * Utility functions for validation
 */

// Re-export validation utilities from ts-utils
export {
  isEmail,
  isURL,
  isPhone,
  isUUID,
  isStrongPassword,
  isNumeric,
  isInteger,
  isFloat,
  isAlphanumeric,
  isAlpha,
  isRequired,
  isLength,
  isDate,
  isBoolean,
  isObject,
  isEmpty as isEmptyString,
  isNotEmpty,
} from '@toolkit-house/ts-utils';
