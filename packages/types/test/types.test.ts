/**
 * Basic tests for types package
 */

import { describe, it, expect } from 'vitest';

// Test that types can be imported
import type { DeepPartial } from '../src/basic/index';

describe('Types Package', () => {
  it('should import types successfully', () => {
    // This test ensures types can be imported without errors
    expect(true).toBe(true);
  });

  it('should have basic types available', () => {
    // Type-level test - if compilation passes, types are available
    type TestType = {
      a: number;
      b: {
        c: string;
      };
    };

    type PartialTestType = DeepPartial<TestType>;

    // This should compile without errors
    const test: PartialTestType = {
      a: 1,
      b: {
        c: 'test',
      },
    };

    expect(test).toBeDefined();
  });
});