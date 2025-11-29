import { describe, it, expect } from 'vitest';

describe('Package exports', () => {
  it('should export main module correctly', async () => {
    const loggerModule = await import('../src/index.js');

    expect(loggerModule.Logger).toBeDefined();
    expect(loggerModule.LogLevel).toBeDefined();
    expect(loggerModule.ConsoleTransport).toBeDefined();
    expect(loggerModule.MemoryTransport).toBeDefined();
    expect(loggerModule.JsonFormatter).toBeDefined();
    expect(loggerModule.ConsoleFormatter).toBeDefined();
    expect(loggerModule.SimpleFormatter).toBeDefined();
    expect(loggerModule.LevelFilter).toBeDefined();
    expect(loggerModule.IncludeTagFilter).toBeDefined();
    expect(loggerModule.ExcludeTagFilter).toBeDefined();
    expect(loggerModule.CustomFilter).toBeDefined();
  });

  it('should export core module correctly', async () => {
    const coreModule = await import('../src/core/index.js');

    expect(coreModule.Logger).toBeDefined();
    expect(coreModule.LogLevel).toBeDefined();
  });

  it('should export transports module correctly', async () => {
    const transportsModule = await import('../src/transports/index.js');

    expect(transportsModule.ConsoleTransport).toBeDefined();
    expect(transportsModule.MemoryTransport).toBeDefined();
    // FileTransport is Node.js only, so it may not be available in test environment
    expect(transportsModule.FileTransport).toBeDefined();
  });

  it('should export formatters module correctly', async () => {
    const formattersModule = await import('../src/formatters/index.js');

    expect(formattersModule.JsonFormatter).toBeDefined();
    expect(formattersModule.ConsoleFormatter).toBeDefined();
    expect(formattersModule.SimpleFormatter).toBeDefined();
  });

  it('should export filters module correctly', async () => {
    const filtersModule = await import('../src/filters/index.js');

    expect(filtersModule.LevelFilter).toBeDefined();
    expect(filtersModule.LevelRangeFilter).toBeDefined();
    expect(filtersModule.ExactLevelFilter).toBeDefined();
    expect(filtersModule.IncludeTagFilter).toBeDefined();
    expect(filtersModule.ExcludeTagFilter).toBeDefined();
    expect(filtersModule.AllTagsFilter).toBeDefined();
    expect(filtersModule.CustomFilter).toBeDefined();
    expect(filtersModule.MessageFilter).toBeDefined();
    expect(filtersModule.TimeRangeFilter).toBeDefined();
    expect(filtersModule.CompositeFilter).toBeDefined();
  });
});