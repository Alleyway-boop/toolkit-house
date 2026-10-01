import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const otelStub = fileURLToPath(new URL('./tests/otel-stub.ts', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      // ts-utils tracing 将 OpenTelemetry 视为可选依赖；测试环境提供无操作桩
      '@opentelemetry/api': otelStub
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts', 'tests/**/*']
    }
  }
});
