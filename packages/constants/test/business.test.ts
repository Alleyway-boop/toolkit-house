import { describe, it, expect } from 'vitest';
import {
  USER_STATUS,
  USER_ROLES,
  USER_TYPES,
  GENDER,
  USER_STATUS_TEXT,
  USER_ROLES_TEXT,
  GENDER_TEXT,
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  ORDER_STATUS_TEXT,
  PAYMENT_STATUS_TEXT,
  PRODUCT_STATUS,
  PRODUCT_TYPES,
  INVENTORY_STATUS,
  PRODUCT_STATUS_TEXT,
  INVENTORY_STATUS_TEXT,
} from '../src/business';

describe('User Constants', () => {
  describe('User Status', () => {
    it('should have correct user status values', () => {
      expect(USER_STATUS.ACTIVE).toBe('active');
      expect(USER_STATUS.INACTIVE).toBe('inactive');
      expect(USER_STATUS.SUSPENDED).toBe('suspended');
      expect(USER_STATUS.PENDING).toBe('pending');
      expect(USER_STATUS.DELETED).toBe('deleted');
    });

    it('should have corresponding status text', () => {
      expect(USER_STATUS_TEXT[USER_STATUS.ACTIVE]).toBe('活跃');
      expect(USER_STATUS_TEXT[USER_STATUS.INACTIVE]).toBe('非活跃');
      expect(USER_STATUS_TEXT[USER_STATUS.SUSPENDED]).toBe('已暂停');
    });
  });

  describe('User Roles', () => {
    it('should have correct user role values', () => {
      expect(USER_ROLES.ADMIN).toBe('admin');
      expect(USER_ROLES.MODERATOR).toBe('moderator');
      expect(USER_ROLES.USER).toBe('user');
      expect(USER_ROLES.GUEST).toBe('guest');
    });

    it('should have corresponding role text', () => {
      expect(USER_ROLES_TEXT[USER_ROLES.ADMIN]).toBe('管理员');
      expect(USER_ROLES_TEXT[USER_ROLES.MODERATOR]).toBe('版主');
      expect(USER_ROLES_TEXT[USER_ROLES.USER]).toBe('用户');
    });
  });

  describe('User Types', () => {
    it('should have correct user type values', () => {
      expect(USER_TYPES.INDIVIDUAL).toBe('individual');
      expect(USER_TYPES.BUSINESS).toBe('business');
      expect(USER_TYPES.ENTERPRISE).toBe('enterprise');
      expect(USER_TYPES.GOVERNMENT).toBe('government');
    });
  });

  describe('Gender', () => {
    it('should have correct gender values', () => {
      expect(GENDER.MALE).toBe('male');
      expect(GENDER.FEMALE).toBe('female');
      expect(GENDER.OTHER).toBe('other');
      expect(GENDER.PREFER_NOT_TO_SAY).toBe('prefer_not_to_say');
    });

    it('should have corresponding gender text', () => {
      expect(GENDER_TEXT[GENDER.MALE]).toBe('男');
      expect(GENDER_TEXT[GENDER.FEMALE]).toBe('女');
      expect(GENDER_TEXT[GENDER.OTHER]).toBe('其他');
    });
  });
});

describe('Order Constants', () => {
  describe('Order Status', () => {
    it('should have correct order status values', () => {
      expect(ORDER_STATUS.PENDING).toBe('pending');
      expect(ORDER_STATUS.CONFIRMED).toBe('confirmed');
      expect(ORDER_STATUS.PROCESSING).toBe('processing');
      expect(ORDER_STATUS.DELIVERED).toBe('delivered');
      expect(ORDER_STATUS.CANCELLED).toBe('cancelled');
    });

    it('should have corresponding status text', () => {
      expect(ORDER_STATUS_TEXT[ORDER_STATUS.PENDING]).toBe('待处理');
      expect(ORDER_STATUS_TEXT[ORDER_STATUS.CONFIRMED]).toBe('已确认');
      expect(ORDER_STATUS_TEXT[ORDER_STATUS.DELIVERED]).toBe('已送达');
    });
  });

  describe('Payment Status', () => {
    it('should have correct payment status values', () => {
      expect(PAYMENT_STATUS.PENDING).toBe('pending');
      expect(PAYMENT_STATUS.COMPLETED).toBe('completed');
      expect(PAYMENT_STATUS.FAILED).toBe('failed');
      expect(PAYMENT_STATUS.REFUNDED).toBe('refunded');
    });

    it('should have corresponding status text', () => {
      expect(PAYMENT_STATUS_TEXT[PAYMENT_STATUS.PENDING]).toBe('待支付');
      expect(PAYMENT_STATUS_TEXT[PAYMENT_STATUS.COMPLETED]).toBe('支付完成');
      expect(PAYMENT_STATUS_TEXT[PAYMENT_STATUS.FAILED]).toBe('支付失败');
    });
  });

  describe('Payment Methods', () => {
    it('should have correct payment method values', () => {
      expect(PAYMENT_METHODS.CREDIT_CARD).toBe('credit_card');
      expect(PAYMENT_METHODS.PAYPAL).toBe('paypal');
      expect(PAYMENT_METHODS.ALIPAY).toBe('alipay');
      expect(PAYMENT_METHODS.WECHAT_PAY).toBe('wechat_pay');
    });
  });
});

describe('Product Constants', () => {
  describe('Product Status', () => {
    it('should have correct product status values', () => {
      expect(PRODUCT_STATUS.ACTIVE).toBe('active');
      expect(PRODUCT_STATUS.INACTIVE).toBe('inactive');
      expect(PRODUCT_STATUS.DRAFT).toBe('draft');
      expect(PRODUCT_STATUS.OUT_OF_STOCK).toBe('out_of_stock');
    });

    it('should have corresponding status text', () => {
      expect(PRODUCT_STATUS_TEXT[PRODUCT_STATUS.ACTIVE]).toBe('上架');
      expect(PRODUCT_STATUS_TEXT[PRODUCT_STATUS.INACTIVE]).toBe('下架');
      expect(PRODUCT_STATUS_TEXT[PRODUCT_STATUS.OUT_OF_STOCK]).toBe('缺货');
    });
  });

  describe('Product Types', () => {
    it('should have correct product type values', () => {
      expect(PRODUCT_TYPES.PHYSICAL).toBe('physical');
      expect(PRODUCT_TYPES.DIGITAL).toBe('digital');
      expect(PRODUCT_TYPES.SERVICE).toBe('service');
      expect(PRODUCT_TYPES.SUBSCRIPTION).toBe('subscription');
    });
  });

  describe('Inventory Status', () => {
    it('should have correct inventory status values', () => {
      expect(INVENTORY_STATUS.IN_STOCK).toBe('in_stock');
      expect(INVENTORY_STATUS.LOW_STOCK).toBe('low_stock');
      expect(INVENTORY_STATUS.OUT_OF_STOCK).toBe('out_of_stock');
    });

    it('should have corresponding status text', () => {
      expect(INVENTORY_STATUS_TEXT[INVENTORY_STATUS.IN_STOCK]).toBe('有货');
      expect(INVENTORY_STATUS_TEXT[INVENTORY_STATUS.LOW_STOCK]).toBe('库存不足');
      expect(INVENTORY_STATUS_TEXT[INVENTORY_STATUS.OUT_OF_STOCK]).toBe('缺货');
    });
  });
});