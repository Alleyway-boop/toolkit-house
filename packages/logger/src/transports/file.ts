import type { Transport, LogEntry, Formatter } from '../types.js';
import { JsonFormatter } from '../formatters/json.js';
import { isNode } from '../utils.js';

/**
 * File transport options
 */
export interface FileTransportOptions {
  filePath: string;
  level?: number;
  formatter?: Formatter;
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  rotate?: boolean;
}

/**
 * File transport for Node.js environments
 */
export class FileTransport implements Transport {
  name: string = 'file';
  level: number;
  formatter: Formatter;
  private filePath: string;
  private maxFileSize: number;
  private maxFiles: number;
  private rotate: boolean;
  private writeQueue: Array<() => Promise<void>> = [];
  private isProcessingQueue = false;

  constructor(options: FileTransportOptions) {
    if (!isNode()) {
      throw new Error('FileTransport is only available in Node.js environment');
    }

    this.filePath = options.filePath;
    this.level = options.level ?? 0; // DEBUG by default
    this.formatter = options.formatter ?? new JsonFormatter({ pretty: false });
    this.maxFileSize = options.maxFileSize ?? 10 * 1024 * 1024; // 10MB default
    this.maxFiles = options.maxFiles ?? 5;
    this.rotate = options.rotate ?? true;
  }

  async log(entry: LogEntry): Promise<void> {
    // Add to write queue
    this.writeQueue.push(() => this.writeLogEntry(entry));

    // Process queue if not already processing
    if (!this.isProcessingQueue) {
      this.processWriteQueue();
    }
  }

  private async processWriteQueue(): Promise<void> {
    if (this.isProcessingQueue || this.writeQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    try {
      while (this.writeQueue.length > 0) {
        const writeOperation = this.writeQueue.shift();
        if (writeOperation) {
          await writeOperation();
        }
      }
    } finally {
      this.isProcessingQueue = false;
    }
  }

  private async writeLogEntry(entry: LogEntry): Promise<void> {
    try {
      // Check if file rotation is needed
      if (this.rotate) {
        await this.rotateIfNeeded();
      }

      // Format and write log entry
      const formatted = this.formatter.format(entry);
      await this.appendToFile(this.filePath, formatted + '\n');
    } catch (error) {
      console.error(`FileTransport failed to write to ${this.filePath}:`, error);
    }
  }

  private async rotateIfNeeded(): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const stats = await fs.stat(this.filePath).catch(() => null);

      if (stats && stats.size >= this.maxFileSize) {
        await this.rotateFiles();
      }
    } catch (error) {
      console.error('Failed to check file size for rotation:', error);
    }
  }

  private async rotateFiles(): Promise<void> {
    const fs = await import('fs/promises');

    // Remove oldest file if it exists
    const oldestFile = `${this.filePath}.${this.maxFiles}`;
    await fs.unlink(oldestFile).catch(() => {});

    // Rotate existing files
    for (let i = this.maxFiles - 1; i >= 1; i--) {
      const currentFile = `${this.filePath}.${i}`;
      const nextFile = `${this.filePath}.${i + 1}`;
      await fs.rename(currentFile, nextFile).catch(() => {});
    }

    // Move current file to .1
    await fs.rename(this.filePath, `${this.filePath}.1`).catch(() => {});
  }

  private async appendToFile(filePath: string, data: string): Promise<void> {
    const fs = await import('fs/promises');
    await fs.appendFile(filePath, data, 'utf8');
  }
}