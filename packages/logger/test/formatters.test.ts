import { describe, it, expect, beforeEach } from 'vitest';
import { LogLevel, type LogEntry } from '../src/types.js';
import { JsonFormatter } from '../src/formatters/json.js';
import { ConsoleFormatter } from '../src/formatters/console.js';
import { SimpleFormatter } from '../src/formatters/simple.js';

describe('Formatters', () => {
  let testEntry: LogEntry;

  beforeEach(() => {
    testEntry = {
      level: LogLevel.INFO,
      message: 'Test message',
      timestamp: new Date('2023-01-01T12:00:00.000Z'),
      metadata: { userId: '123', action: 'login' },
      context: { service: 'auth', version: '1.0.0' },
      tags: ['auth', 'security'],
    };
  });

  describe('JsonFormatter', () => {
    it('should format entry as compact JSON', () => {
      const formatter = new JsonFormatter();
      const result = formatter.format(testEntry);

      const parsed = JSON.parse(result);
      expect(parsed.level).toBe('INFO');
      expect(parsed.message).toBe('Test message');
      expect(parsed.timestamp).toBe('2023-01-01T12:00:00.000Z');
      expect(parsed.metadata).toEqual({ userId: '123', action: 'login' });
      expect(parsed.context).toEqual({ service: 'auth', version: '1.0.0' });
      expect(parsed.tags).toEqual(['auth', 'security']);
    });

    it('should format entry as pretty JSON', () => {
      const formatter = new JsonFormatter({ pretty: true });
      const result = formatter.format(testEntry);

      expect(result).toContain('  "level": "INFO"');
      expect(result).toContain('  "message": "Test message"');
      expect(result).toContain('  "metadata": {');
      expect(result).toContain('  "context": {');
      expect(result).toContain('  "tags": [');
    });

    it('should omit empty fields', () => {
      const entry: LogEntry = {
        level: LogLevel.DEBUG,
        message: 'Simple message',
        timestamp: new Date('2023-01-01T12:00:00.000Z'),
      };

      const formatter = new JsonFormatter();
      const result = formatter.format(entry);

      const parsed = JSON.parse(result);
      expect(parsed).not.toHaveProperty('metadata');
      expect(parsed).not.toHaveProperty('context');
      expect(parsed).not.toHaveProperty('tags');
    });
  });

  describe('ConsoleFormatter', () => {
    it('should format entry with colors', () => {
      const formatter = new ConsoleFormatter({ useColors: true });
      const result = formatter.format(testEntry);

      expect(result).toContain('[2023-01-01T12:00:00.000Z]');
      expect(result).toContain('INFO');
      expect(result).toContain('auth');
      expect(result).toContain('security');
      expect(result).toContain('Test message');
      expect(result).toContain('Context:');
      expect(result).toContain('service');
      expect(result).toContain('Metadata:');
      expect(result).toContain('userId');
    });

    it('should format entry without colors', () => {
      const formatter = new ConsoleFormatter({ useColors: false });
      const result = formatter.format(testEntry);

      expect(result).toContain('[2023-01-01T12:00:00.000Z]');
      expect(result).toContain('INFO');
      expect(result).toContain('auth');
      expect(result).toContain('security');
      expect(result).toContain('Test message');
      expect(result).not.toContain('\x1b['); // No ANSI escape codes
    });

    it('should exclude timestamp if disabled', () => {
      const formatter = new ConsoleFormatter({ includeTimestamp: false });
      const result = formatter.format(testEntry);

      expect(result).not.toContain('[2023-01-01T12:00:00.000Z]');
      expect(result).toContain('INFO');
      expect(result).toContain('Test message');
    });

    it('should exclude metadata if disabled', () => {
      const formatter = new ConsoleFormatter({ includeMetadata: false });
      const result = formatter.format(testEntry);

      expect(result).toContain('[2023-01-01T12:00:00.000Z]');
      expect(result).toContain('INFO');
      expect(result).toContain('Test message');
      expect(result).not.toContain('Context:');
      expect(result).not.toContain('Metadata:');
    });

    it('should handle entry without tags, context, or metadata', () => {
      const entry: LogEntry = {
        level: LogLevel.DEBUG,
        message: 'Simple message',
        timestamp: new Date('2023-01-01T12:00:00.000Z'),
      };

      const formatter = new ConsoleFormatter();
      const result = formatter.format(entry);

      expect(result).toContain('[2023-01-01T12:00:00.000Z]');
      expect(result).toContain('DEBUG');
      expect(result).toContain('Simple message');
      // Should not contain color codes in basic output
    });

    it('should handle entry with only context', () => {
      const entry: LogEntry = {
        level: LogLevel.INFO,
        message: 'Message with context',
        timestamp: new Date('2023-01-01T12:00:00.000Z'),
        context: { service: 'test' },
      };

      const formatter = new ConsoleFormatter();
      const result = formatter.format(entry);

      expect(result).toContain('Message with context');
      expect(result).toContain('Context:');
      expect(result).toContain('test');
      expect(result).not.toContain('Metadata:');
    });

    it('should handle entry with only metadata', () => {
      const entry: LogEntry = {
        level: LogLevel.INFO,
        message: 'Message with metadata',
        timestamp: new Date('2023-01-01T12:00:00.000Z'),
        metadata: { key: 'value' },
      };

      const formatter = new ConsoleFormatter();
      const result = formatter.format(entry);

      expect(result).toContain('Message with metadata');
      expect(result).not.toContain('Context:');
      expect(result).toContain('Metadata:');
      expect(result).toContain('value');
    });
  });

  describe('SimpleFormatter', () => {
    it('should format entry as simple text', () => {
      const formatter = new SimpleFormatter();
      const result = formatter.format(testEntry);

      expect(result).toContain('[2023-01-01T12:00:00.000Z]');
      expect(result).toContain('[INFO]');
      expect(result).toContain('(auth, security)');
      expect(result).toContain('Test message');
      expect(result).toContain('Context: {"service":"auth","version":"1.0.0"}');
      expect(result).toContain('Metadata: {"userId":"123","action":"login"}');
    });

    it('should exclude timestamp if disabled', () => {
      const formatter = new SimpleFormatter({ includeTimestamp: false });
      const result = formatter.format(testEntry);

      expect(result).not.toContain('[2023-01-01T12:00:00.000Z]');
      expect(result).toContain('[INFO]');
      expect(result).toContain('Test message');
    });

    it('should exclude metadata if disabled', () => {
      const formatter = new SimpleFormatter({ includeMetadata: false });
      const result = formatter.format(testEntry);

      expect(result).toContain('[2023-01-01T12:00:00.000Z]');
      expect(result).toContain('[INFO]');
      expect(result).toContain('Test message');
      expect(result).not.toContain('Context:');
      expect(result).not.toContain('Metadata:');
    });

    it('should handle entry without optional fields', () => {
      const entry: LogEntry = {
        level: LogLevel.DEBUG,
        message: 'Simple message',
        timestamp: new Date('2023-01-01T12:00:00.000Z'),
      };

      const formatter = new SimpleFormatter();
      const result = formatter.format(entry);

      expect(result).toBe('[2023-01-01T12:00:00.000Z] [DEBUG] Simple message');
    });

    it('should format metadata inline', () => {
      const formatter = new SimpleFormatter();
      const result = formatter.format(testEntry);

      expect(result).toContain('Context: {"service":"auth","version":"1.0.0"} | Metadata: {"userId":"123","action":"login"}');
    });
  });

  describe('All formatters', () => {
    it('should handle different log levels', () => {
      const formatters = [
        new JsonFormatter(),
        new ConsoleFormatter(),
        new SimpleFormatter(),
      ];

      const levels = [
        LogLevel.DEBUG,
        LogLevel.INFO,
        LogLevel.WARN,
        LogLevel.ERROR,
        LogLevel.FATAL,
      ];

      formatters.forEach(formatter => {
        levels.forEach(level => {
          const entry = { ...testEntry, level };
          const result = formatter.format(entry);

          if (formatter instanceof JsonFormatter) {
            const parsed = JSON.parse(result);
            expect(['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']).toContain(parsed.level);
          } else {
            expect(['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'].some(levelStr =>
              result.includes(levelStr)
            )).toBe(true);
          }
        });
      });
    });
  });
});