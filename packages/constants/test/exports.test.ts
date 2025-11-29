import { describe, it, expect } from 'vitest';

// 测试所有导出是否正常工作
import {
  // Common exports
  HTTP_STATUS,
  ERROR_CODES,
  // Business exports
  USER_STATUS,
  ORDER_STATUS,
  PRODUCT_STATUS,
  // Technical exports
  DATETIME_FORMATS,
  EMAIL_PATTERN,
  // Environment exports
  ENVIRONMENTS,
  // Theme exports
  COLORS,
  SPACING,
} from '../src';

// 测试子路径导出
import * as commonExports from '../src/common';
import * as businessExports from '../src/business';
import * as technicalExports from '../src/technical';
import * as environmentExports from '../src/environment';
import * as themeExports from '../src/theme';

describe('Package Exports', () => {
  describe('Main Export', () => {
    it('should export common constants', () => {
      expect(HTTP_STATUS).toBeDefined();
      expect(ERROR_CODES).toBeDefined();
    });

    it('should export business constants', () => {
      expect(USER_STATUS).toBeDefined();
      expect(ORDER_STATUS).toBeDefined();
      expect(PRODUCT_STATUS).toBeDefined();
    });

    it('should export technical constants', () => {
      expect(DATETIME_FORMATS).toBeDefined();
      expect(EMAIL_PATTERN).toBeDefined();
    });

    it('should export environment constants', () => {
      expect(ENVIRONMENTS).toBeDefined();
    });

    it('should export theme constants', () => {
      expect(COLORS).toBeDefined();
      expect(SPACING).toBeDefined();
    });
  });

  describe('Subpath Exports', () => {
    it('should export from common module', () => {
      expect(commonExports.HTTP_STATUS).toBeDefined();
      expect(commonExports.ERROR_CODES).toBeDefined();
    });

    it('should export from business module', () => {
      expect(businessExports.USER_STATUS).toBeDefined();
      expect(businessExports.ORDER_STATUS).toBeDefined();
      expect(businessExports.PRODUCT_STATUS).toBeDefined();
    });

    it('should export from technical module', () => {
      expect(technicalExports.DATETIME_FORMATS).toBeDefined();
      expect(technicalExports.EMAIL_PATTERN).toBeDefined();
      expect(technicalExports.STORAGE_UNITS).toBeDefined();
    });

    it('should export from environment module', () => {
      expect(environmentExports.ENVIRONMENTS).toBeDefined();
      expect(environmentExports.LOG_LEVELS).toBeDefined();
    });

    it('should export from theme module', () => {
      expect(themeExports.COLORS).toBeDefined();
      expect(themeExports.SPACING).toBeDefined();
      expect(themeExports.FONT_SIZES).toBeDefined();
    });
  });

  describe('Constant Values', () => {
    it('should have correct HTTP status codes', () => {
      expect(HTTP_STATUS.OK).toBe(200);
      expect(HTTP_STATUS.NOT_FOUND).toBe(404);
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
    });

    it('should have correct error codes', () => {
      expect(ERROR_CODES.SUCCESS).toBe(0);
      expect(ERROR_CODES.UNKNOWN_ERROR).toBe(-1);
      expect(ERROR_CODES.INVALID_PARAMETER).toBe(1001);
    });

    it('should have correct user status values', () => {
      expect(USER_STATUS.ACTIVE).toBe('active');
      expect(USER_STATUS.INACTIVE).toBe('inactive');
      expect(USER_STATUS.SUSPENDED).toBe('suspended');
    });

    it('should have correct date format', () => {
      expect(DATETIME_FORMATS.ISO_DATE).toBe('YYYY-MM-DD');
      expect(DATETIME_FORMATS.ISO_DATETIME).toBe('YYYY-MM-DDTHH:mm:ssZ');
    });

    it('should have correct email pattern', () => {
      expect(EMAIL_PATTERN).toBeInstanceOf(RegExp);
      expect(EMAIL_PATTERN.test('test@example.com')).toBe(true);
    });

    it('should have correct environment values', () => {
      expect(ENVIRONMENTS.DEVELOPMENT).toBe('development');
      expect(ENVIRONMENTS.TESTING).toBe('testing');
      expect(ENVIRONMENTS.STAGING).toBe('staging');
      expect(ENVIRONMENTS.PRODUCTION).toBe('production');
    });

    it('should have correct color values', () => {
      expect(COLORS.PRIMARY).toBe('#1890ff');
      expect(COLORS.SUCCESS).toBe('#52c41a');
      expect(COLORS.WARNING).toBe('#faad14');
      expect(COLORS.ERROR).toBe('#ff4d4f');
    });

    it('should have correct spacing values', () => {
      expect(SPACING.XS).toBe(4);
      expect(SPACING.SM).toBe(8);
      expect(SPACING.MD).toBe(16);
      expect(SPACING.LG).toBe(24);
    });
  });
});