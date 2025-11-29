/**
 * @toolkit-house/constants
 *
 * 一个完全独立的常量定义包，提供各类应用程序中使用的常量定义。
 *
 * 特性：
 * - 零依赖，纯数据定义
 * - 支持子路径导出
 * - 完整的 TypeScript 类型定义
 * - 全面的常量覆盖（通用、业务、技术、环境、主题）
 */

// 导出所有模块
export * from './common';
export * from './business';
export * from './technical';
export * from './environment';
export * from './theme';

// 版本信息
export const VERSION = '0.0.0' as const;

// 包信息
export const PACKAGE_NAME = '@toolkit-house/constants' as const;
export const PACKAGE_DESCRIPTION = 'Comprehensive constants library for modern web applications' as const;