import { describe, it, expect, beforeEach } from 'vitest';
import { LogLevel, type LogEntry } from '../src/types.js';
import {
  LevelFilter,
  LevelRangeFilter,
  ExactLevelFilter,
  IncludeTagFilter,
  ExcludeTagFilter,
  AllTagsFilter,
  CustomFilter,
  MessageFilter,
  TimeRangeFilter,
  CompositeFilter
} from '../src/filters/index.js';

describe('Filters', () => {
  let testEntry: LogEntry;

  beforeEach(() => {
    testEntry = {
      level: LogLevel.INFO,
      message: 'Test message',
      timestamp: new Date('2023-01-01T12:00:00.000Z'),
      metadata: { key: 'value' },
      context: { user: 'test' },
      tags: ['auth', 'security'],
    };
  });

  describe('LevelFilter', () => {
    it('should filter entries below minimum level', () => {
      const filter = new LevelFilter(LogLevel.WARN);

      expect(filter.shouldLog({ ...testEntry, level: LogLevel.DEBUG })).toBe(false);
      expect(filter.shouldLog({ ...testEntry, level: LogLevel.INFO })).toBe(false);
      expect(filter.shouldLog({ ...testEntry, level: LogLevel.WARN })).toBe(true);
      expect(filter.shouldLog({ ...testEntry, level: LogLevel.ERROR })).toBe(true);
    });

    it('should allow updating minimum level', () => {
      const filter = new LevelFilter(LogLevel.INFO);

      expect(filter.shouldLog({ ...testEntry, level: LogLevel.DEBUG })).toBe(false);

      filter.setMinLevel(LogLevel.DEBUG);
      expect(filter.shouldLog({ ...testEntry, level: LogLevel.DEBUG })).toBe(true);
    });
  });

  describe('LevelRangeFilter', () => {
    it('should filter entries outside level range', () => {
      const filter = new LevelRangeFilter(LogLevel.INFO, LogLevel.ERROR);

      expect(filter.shouldLog({ ...testEntry, level: LogLevel.DEBUG })).toBe(false);
      expect(filter.shouldLog({ ...testEntry, level: LogLevel.INFO })).toBe(true);
      expect(filter.shouldLog({ ...testEntry, level: LogLevel.WARN })).toBe(true);
      expect(filter.shouldLog({ ...testEntry, level: LogLevel.ERROR })).toBe(true);
      expect(filter.shouldLog({ ...testEntry, level: LogLevel.FATAL })).toBe(false);
    });
  });

  describe('ExactLevelFilter', () => {
    it('should only allow specified levels', () => {
      const filter = new ExactLevelFilter([LogLevel.INFO, LogLevel.ERROR]);

      expect(filter.shouldLog({ ...testEntry, level: LogLevel.DEBUG })).toBe(false);
      expect(filter.shouldLog({ ...testEntry, level: LogLevel.INFO })).toBe(true);
      expect(filter.shouldLog({ ...testEntry, level: LogLevel.WARN })).toBe(false);
      expect(filter.shouldLog({ ...testEntry, level: LogLevel.ERROR })).toBe(true);
    });

    it('should allow adding and removing levels', () => {
      const filter = new ExactLevelFilter([LogLevel.INFO]);

      expect(filter.shouldLog({ ...testEntry, level: LogLevel.INFO })).toBe(true);
      expect(filter.shouldLog({ ...testEntry, level: LogLevel.ERROR })).toBe(false);

      filter.addLevel(LogLevel.ERROR);
      expect(filter.shouldLog({ ...testEntry, level: LogLevel.ERROR })).toBe(true);

      filter.removeLevel(LogLevel.INFO);
      expect(filter.shouldLog({ ...testEntry, level: LogLevel.INFO })).toBe(false);
    });
  });

  describe('IncludeTagFilter', () => {
    it('should only allow entries with required tags', () => {
      const filter = new IncludeTagFilter(['auth', 'api']);

      expect(filter.shouldLog({ ...testEntry, tags: ['auth', 'security'] })).toBe(true);
      expect(filter.shouldLog({ ...testEntry, tags: ['api', 'request'] })).toBe(true);
      expect(filter.shouldLog({ ...testEntry, tags: ['database', 'query'] })).toBe(false);
    });

    it('should allow entries without tags if no required tags', () => {
      const filter = new IncludeTagFilter([]);

      expect(filter.shouldLog({ ...testEntry, tags: undefined })).toBe(true);
      expect(filter.shouldLog({ ...testEntry, tags: [] })).toBe(true);
    });
  });

  describe('ExcludeTagFilter', () => {
    it('should exclude entries with specified tags', () => {
      const filter = new ExcludeTagFilter(['debug', 'verbose']);

      expect(filter.shouldLog({ ...testEntry, tags: ['auth', 'security'] })).toBe(true);
      expect(filter.shouldLog({ ...testEntry, tags: ['debug', 'trace'] })).toBe(false);
      expect(filter.shouldLog({ ...testEntry, tags: ['verbose', 'detail'] })).toBe(false);
    });

    it('should allow entries without tags', () => {
      const filter = new ExcludeTagFilter(['debug']);

      expect(filter.shouldLog({ ...testEntry, tags: undefined })).toBe(true);
      expect(filter.shouldLog({ ...testEntry, tags: [] })).toBe(true);
    });
  });

  describe('AllTagsFilter', () => {
    it('should require all specified tags', () => {
      const filter = new AllTagsFilter(['auth', 'security']);

      expect(filter.shouldLog({ ...testEntry, tags: ['auth', 'security', 'api'] })).toBe(true);
      expect(filter.shouldLog({ ...testEntry, tags: ['auth'] })).toBe(false);
      expect(filter.shouldLog({ ...testEntry, tags: ['security'] })).toBe(false);
      expect(filter.shouldLog({ ...testEntry, tags: ['api', 'request'] })).toBe(false);
    });
  });

  describe('CustomFilter', () => {
    it('should use custom predicate', () => {
      const filter = new CustomFilter((entry) => entry.message.includes('error'));

      expect(filter.shouldLog({ ...testEntry, message: 'An error occurred' })).toBe(true);
      expect(filter.shouldLog({ ...testEntry, message: 'Normal message' })).toBe(false);
    });

    it('should handle predicate errors gracefully', () => {
      const filter = new CustomFilter(() => {
        throw new Error('Predicate failed');
      });

      // Filter should default to allowing the log entry if predicate fails
      expect(filter.shouldLog(testEntry)).toBe(true);
    });
  });

  describe('MessageFilter', () => {
    it('should filter by string patterns', () => {
      const filter = new MessageFilter({
        includes: ['user', 'auth'],
        excludes: ['debug', 'trace'],
      });

      expect(filter.shouldLog({ ...testEntry, message: 'User login successful' })).toBe(true);
      expect(filter.shouldLog({ ...testEntry, message: 'Auth token generated' })).toBe(true);
      expect(filter.shouldLog({ ...testEntry, message: 'User debug info' })).toBe(false);
      expect(filter.shouldLog({ ...testEntry, message: 'Debug trace' })).toBe(false);
      expect(filter.shouldLog({ ...testEntry, message: 'System started' })).toBe(true);
    });

    it('should filter by regex patterns', () => {
      const filter = new MessageFilter({
        includes: [/user \d+/, /\[error\]/i],
        excludes: [/debug.*trace/],
      });

      expect(filter.shouldLog({ ...testEntry, message: 'User 123 logged in' })).toBe(true);
      expect(filter.shouldLog({ ...testEntry, message: '[ERROR] System failure' })).toBe(true);
      expect(filter.shouldLog({ ...testEntry, message: 'debug with trace enabled' })).toBe(false);
      // User login doesn't match the required patterns, so it should be included as default
      expect(filter.shouldLog({ ...testEntry, message: 'User login' })).toBe(true);
    });
  });

  describe('TimeRangeFilter', () => {
    it('should filter by time range', () => {
      const startTime = new Date('2023-01-01T00:00:00.000Z');
      const endTime = new Date('2023-01-01T23:59:59.000Z');
      const filter = new TimeRangeFilter({ startTime, endTime });

      expect(filter.shouldLog({ ...testEntry, timestamp: new Date('2022-12-31T23:59:59.000Z') })).toBe(false);
      expect(filter.shouldLog({ ...testEntry, timestamp: new Date('2023-01-01T12:00:00.000Z') })).toBe(true);
      expect(filter.shouldLog({ ...testEntry, timestamp: new Date('2023-01-02T00:00:00.000Z') })).toBe(false);
    });

    it('should work with only start time', () => {
      const startTime = new Date('2023-01-01T00:00:00.000Z');
      const filter = new TimeRangeFilter({ startTime });

      expect(filter.shouldLog({ ...testEntry, timestamp: new Date('2022-12-31T23:59:59.000Z') })).toBe(false);
      expect(filter.shouldLog({ ...testEntry, timestamp: new Date('2023-01-01T12:00:00.000Z') })).toBe(true);
      expect(filter.shouldLog({ ...testEntry, timestamp: new Date('2023-01-02T00:00:00.000Z') })).toBe(true);
    });

    it('should work with only end time', () => {
      const endTime = new Date('2023-01-01T23:59:59.000Z');
      const filter = new TimeRangeFilter({ endTime });

      expect(filter.shouldLog({ ...testEntry, timestamp: new Date('2022-12-31T23:59:59.000Z') })).toBe(true);
      expect(filter.shouldLog({ ...testEntry, timestamp: new Date('2023-01-01T12:00:00.000Z') })).toBe(true);
      expect(filter.shouldLog({ ...testEntry, timestamp: new Date('2023-01-02T00:00:00.000Z') })).toBe(false);
    });
  });

  describe('CompositeFilter', () => {
    it('should combine filters with AND logic', () => {
      const levelFilter = new LevelFilter(LogLevel.INFO);
      const tagFilter = new IncludeTagFilter(['auth']);
      const composite = new CompositeFilter({
        filters: [levelFilter, tagFilter],
        operator: 'AND',
      });

      expect(composite.shouldLog({
        ...testEntry,
        level: LogLevel.DEBUG,
        tags: ['auth'],
      })).toBe(false); // Level too low

      expect(composite.shouldLog({
        ...testEntry,
        level: LogLevel.INFO,
        tags: ['api'],
      })).toBe(false); // Missing required tag

      expect(composite.shouldLog({
        ...testEntry,
        level: LogLevel.INFO,
        tags: ['auth'],
      })).toBe(true); // Both conditions met
    });

    it('should combine filters with OR logic', () => {
      const levelFilter = new LevelFilter(LogLevel.WARN);
      const tagFilter = new IncludeTagFilter(['auth']);
      const composite = new CompositeFilter({
        filters: [levelFilter, tagFilter],
        operator: 'OR',
      });

      expect(composite.shouldLog({
        ...testEntry,
        level: LogLevel.INFO,
        tags: ['auth'],
      })).toBe(true); // Has required tag

      expect(composite.shouldLog({
        ...testEntry,
        level: LogLevel.ERROR,
        tags: ['api'],
      })).toBe(true); // Level high enough

      expect(composite.shouldLog({
        ...testEntry,
        level: LogLevel.INFO,
        tags: ['api'],
      })).toBe(false); // Neither condition met
    });

    it('should allow adding and removing filters', () => {
      const filter1 = new LevelFilter(LogLevel.INFO);
      const filter2 = new IncludeTagFilter(['auth']);
      const composite = new CompositeFilter({ filters: [filter1] });

      expect(composite.shouldLog({
        ...testEntry,
        level: LogLevel.DEBUG,
        tags: ['auth'],
      })).toBe(false);

      composite.addFilter(filter2);
      expect(composite.shouldLog({
        ...testEntry,
        level: LogLevel.INFO,
        tags: ['auth'],
      })).toBe(true);

      composite.removeFilter(filter1);
      expect(composite.shouldLog({
        ...testEntry,
        level: LogLevel.DEBUG,
        tags: ['auth'],
      })).toBe(true);
    });
  });
});