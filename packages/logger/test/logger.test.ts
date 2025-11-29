import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Logger } from '../src/core/logger.js';
import { LogLevel } from '../src/types.js';
import { MemoryTransport } from '../src/transports/memory.js';
import { ConsoleFormatter } from '../src/formatters/console.js';

describe('Logger', () => {
  let logger: Logger;
  let memoryTransport: MemoryTransport;

  beforeEach(() => {
    memoryTransport = new MemoryTransport();
    logger = new Logger({
      level: LogLevel.DEBUG,
      transports: [memoryTransport],
    });
  });

  afterEach(() => {
    memoryTransport.clear();
  });

  describe('Basic logging', () => {
    it('should log messages at different levels', async () => {
      await logger.debug('Debug message');
      await logger.info('Info message');
      await logger.warn('Warning message');
      await logger.error('Error message');
      await logger.fatal('Fatal message');

      const entries = memoryTransport.getEntries();
      expect(entries).toHaveLength(5);
      expect(entries[0].message).toBe('Debug message');
      expect(entries[0].level).toBe(LogLevel.DEBUG);
      expect(entries[1].level).toBe(LogLevel.INFO);
      expect(entries[2].level).toBe(LogLevel.WARN);
      expect(entries[3].level).toBe(LogLevel.ERROR);
      expect(entries[4].level).toBe(LogLevel.FATAL);
    });

    it('should respect minimum log level', async () => {
      logger.setLevel(LogLevel.WARN);

      await logger.debug('Debug message');
      await logger.info('Info message');
      await logger.warn('Warning message');
      await logger.error('Error message');

      const entries = memoryTransport.getEntries();
      expect(entries).toHaveLength(2);
      expect(entries[0].level).toBe(LogLevel.WARN);
      expect(entries[1].level).toBe(LogLevel.ERROR);
    });
  });

  describe('Context and metadata', () => {
    it('should include context in log entries', async () => {
      logger.setContext({ userId: '123', requestId: 'abc' });
      await logger.info('User action');

      const entry = memoryTransport.getEntries()[0];
      expect(entry.context).toEqual({ userId: '123', requestId: 'abc' });
    });

    it('should include metadata in log entries', async () => {
      logger.setMetadata({ service: 'auth', version: '1.0.0' });
      await logger.info('Service started');

      const entry = memoryTransport.getEntries()[0];
      expect(entry.metadata).toEqual({ service: 'auth', version: '1.0.0' });
    });

    it('should merge context and metadata', async () => {
      logger.setContext({ userId: '123' });
      await logger.info('User action', { action: 'login' });

      const entry = memoryTransport.getEntries()[0];
      expect(entry.context).toEqual({ userId: '123' });
      expect(entry.metadata).toEqual({ action: 'login' });
    });
  });

  describe('Tags', () => {
    it('should include tags in log entries', async () => {
      logger.setTags(['auth', 'security']);
      await logger.info('Login attempt');

      const entry = memoryTransport.getEntries()[0];
      expect(entry.tags).toEqual(['auth', 'security']);
    });

    it('should add tags to existing tags', async () => {
      logger.setTags(['auth']);
      logger.addTags('security', 'audit');
      await logger.info('Login attempt');

      const entry = memoryTransport.getEntries()[0];
      expect(entry.tags).toEqual(['auth', 'security', 'audit']);
    });
  });

  describe('Child loggers', () => {
    it('should inherit configuration from parent', async () => {
      const childLogger = logger.child({
        tags: ['child'],
        context: { child: true },
      });

      await childLogger.info('Child message');

      const entry = memoryTransport.getEntries()[0];
      expect(entry.tags).toEqual(['child']);
      expect(entry.context).toEqual({ child: true });
    });

    it('should merge child configuration with parent', async () => {
      logger.setContext({ parent: true });
      logger.setTags(['parent']);

      const childLogger = logger.child({
        context: { child: true },
        tags: ['child'],
      });

      await childLogger.info('Child message');

      const entry = memoryTransport.getEntries()[0];
      expect(entry.context).toEqual({ parent: true, child: true });
      expect(entry.tags).toEqual(['parent', 'child']);
    });
  });

  describe('Lazy evaluation', () => {
    it('should evaluate lazy message functions', async () => {
      let callCount = 0;
      const lazyMessage = () => {
        callCount++;
        return 'Expensive message';
      };

      await logger.info(lazyMessage);

      expect(callCount).toBe(1);
      expect(memoryTransport.getEntries()[0].message).toBe('Expensive message');
    });

    it('should not evaluate lazy message if below log level', async () => {
      logger.setLevel(LogLevel.ERROR);
      let callCount = 0;
      const lazyMessage = () => {
        callCount++;
        return 'Expensive message';
      };

      await logger.debug(lazyMessage);

      expect(callCount).toBe(0);
      expect(memoryTransport.getEntries()).toHaveLength(0);
    });

    it('should evaluate lazy metadata functions', async () => {
      let callCount = 0;
      const lazyMetadata = () => {
        callCount++;
        return { expensive: 'data' };
      };

      await logger.info('Message', lazyMetadata);

      expect(callCount).toBe(1);
      expect(memoryTransport.getEntries()[0].metadata).toEqual({ expensive: 'data' });
    });
  });

  describe('Transport management', () => {
    it('should add and remove transports', async () => {
      // Start with initial transport
      expect(logger.getTransports()).toHaveLength(1);

      const newTransport = new MemoryTransport();
      logger.addTransport(newTransport);
      expect(logger.getTransports()).toHaveLength(2);

      // Just test basic functionality
      logger.removeTransport('memory');
      expect(logger.getTransports()).toHaveLength(0);
    });
  });

  describe('Configuration updates', () => {
    it('should update context', async () => {
      logger.setContext({ initial: 'context' });
      logger.updateContext({ updated: 'context' });

      await logger.info('Test message');

      const entry = memoryTransport.getEntries()[0];
      expect(entry.context).toEqual({ initial: 'context', updated: 'context' });
    });

    it('should update metadata', async () => {
      logger.setMetadata({ initial: 'metadata' });
      logger.updateMetadata({ updated: 'metadata' });

      await logger.info('Test message');

      const entry = memoryTransport.getEntries()[0];
      expect(entry.metadata).toEqual({ initial: 'metadata', updated: 'metadata' });
    });

    it('should clear tags', async () => {
      logger.setTags(['tag1', 'tag2']);
      logger.clearTags();

      await logger.info('Test message');

      const entry = memoryTransport.getEntries()[0];
      expect(entry.tags).toEqual([]);
    });
  });
});