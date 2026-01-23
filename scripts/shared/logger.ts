/**
 * Unified logger for Node.js scripts
 * Single file for both logging and data output
 *
 * Configuration:
 * - QUIET=true - Suppress all logs (silent mode)
 * - DEBUG=true - Enable debug level logging (all messages)
 * - LOG_FORMAT=text|json - Output format (default: text)
 *   - text: Readable text format (default, for all scripts)
 *   - json: Structured JSON with timestamp (for parsing/debugging)
 * - LOG_TO_FILE=true - Enable file logging (default: false)
 * - LOG_MAX_SIZE=20m - Maximum log file size before rotation (default: 20MB)
 * - LOG_MAX_FILES=14d - Maximum files to keep or retention period (default: 14 days)
 * - LOG_DATE_PATTERN=YYYY-MM-DD - Date pattern for daily rotation (default: daily)
 *
 * Usage:
 *   import { logger } from './shared/logger.js'
 *
 *   // Logging (goes to stderr, formatted by Winston)
 *   logger.info('Message')  // Shows readable text by default
 *   logger.infoWithError('Error occurred', error, { context: 'details' })
 *   logger.infoWithMetadata('Processing data', { id: '123' })
 *   logger.error('Error', error, { context: 'details' })
 *
 *   // Data output (goes to stdout, for piping/parsing)
 *   logger.data.json({ key: 'value' })  // Pretty JSON to stdout
 *   logger.data.jsonCompact({ key: 'value' })  // Minified JSON
 *   logger.data.text('plain text')  // Plain text to stdout
 *
 * File Logging:
 *   Uses winston-daily-rotate-file for automatic daily rotation and archiving:
 *   - Daily rotation: Creates new file each day (YYYY-MM-DD pattern)
 *   - Automatic archiving: Old logs are compressed (.gz)
 *   - Automatic cleanup: Old files deleted based on maxFiles retention
 *   - Size-based rotation: Also rotates when file reaches maxSize
 */

import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const isQuiet = process.env.QUIET === 'true';
const isDebug = process.env.DEBUG === 'true';
const logToFile = process.env.LOG_TO_FILE === 'true';

// Parse maxSize (supports '10m', '100k', etc.)
const parseMaxSize = (value: string): string => {
  // winston-daily-rotate-file accepts string format directly
  return value;
};

// Parse maxFiles (supports '14d', '30', etc.)
const parseMaxFiles = (value: string): string => {
  // winston-daily-rotate-file accepts both number and string (e.g., '14d')
  return value;
};

const logMaxSize = parseMaxSize(process.env.LOG_MAX_SIZE || '20m');
const logMaxFiles = parseMaxFiles(process.env.LOG_MAX_FILES || '14d');
const logDatePattern = process.env.LOG_DATE_PATTERN || 'YYYY-MM-DD';

// Default to readable text format for all scripts
// Use LOG_FORMAT=json explicitly for structured JSON output
const logFormat = (process.env.LOG_FORMAT || 'text').toLowerCase() as 'json' | 'text';

/**
 * Get log directory path
 */
const getLogDir = (): string => {
  return path.join(process.cwd(), 'logs');
};

/**
 * Ensure log directory exists
 */
const ensureLogDir = (): void => {
  if (!logToFile) return;

  const logDir = getLogDir();
  if (!existsSync(logDir)) {
    mkdirSync(logDir, { recursive: true });
  }
};

/**
 * Determine log level based on environment
 * - DEBUG=true: debug level (all messages)
 * - Default: info level (readable text format, shows all messages)
 * - LOG_FORMAT=json: error level (only errors, for structured logging)
 */
const getLogLevel = (): string => {
  if (isQuiet) return 'silent';
  if (isDebug) return 'debug';
  // Default: info level (readable text format)
  // JSON format: only errors by default (for structured logging)
  return logFormat === 'json' ? 'error' : 'info';
};

/**
 * Create format based on LOG_FORMAT environment variable
 */
const createFormat = () => {
  if (logFormat === 'text') {
    // Readable text format (no JSON, no timestamp, no level prefix)
    return winston.format.printf(({ message }) => {
      return String(message);
    });
  }
  // Structured JSON format (default)
  return winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  );
};

/**
 * Create file format (always JSON with timestamp for file logs)
 */
const createFileFormat = () => {
  return winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  );
};

/**
 * Initialize daily rotate file transport if enabled
 * Uses winston-daily-rotate-file for:
 * - Daily rotation (datePattern)
 * - Automatic archiving (zippedArchive)
 * - Size-based rotation (maxSize)
 * - Automatic cleanup (maxFiles)
 */
const createFileTransport = (): DailyRotateFile | null => {
  if (!logToFile) return null;

  ensureLogDir();
  const logDir = getLogDir();

  return new DailyRotateFile({
    filename: path.join(logDir, 'scripts-%DATE%.log'),
    datePattern: logDatePattern, // Daily rotation: YYYY-MM-DD
    zippedArchive: true, // Compress old logs (.gz)
    maxSize: logMaxSize, // Rotate when file reaches this size (e.g., '20m')
    maxFiles: logMaxFiles, // Keep files for retention period (e.g., '14d')
    format: createFileFormat(),
    // Handle errors silently - don't break logger initialization
    handleExceptions: false,
    handleRejections: false,
  });
};

/**
 * Unified Winston logger instance
 * - Supports both JSON (default) and text formats
 * - Environment-based level control
 * - Errors and warnings go to stderr
 * - Optional file logging with daily rotation and archiving
 */
const transports: winston.transport[] = [
  new winston.transports.Console({
    silent: isQuiet,
    stderrLevels: ['error', 'warn'], // Errors and warnings go to stderr
    consoleWarnLevels: ['warn'],
  }),
];

const fileTransport = createFileTransport();
if (fileTransport) {
  transports.push(fileTransport);
}

const winstonLogger = winston.createLogger({
  level: getLogLevel(),
  format: createFormat(),
  transports,
  // Don't exit on error (let scripts handle errors)
  exitOnError: false,
});

/**
 * Unified logger interface for all Node.js scripts
 *
 * API:
 * - logger.error(message, error?, metadata?)
 * - logger.warn(message, error?, metadata?)
 * - logger.info(message) - simple info message
 * - logger.infoWithError(message, error, metadata?) - info with error
 * - logger.infoWithMetadata(message, metadata) - info with metadata
 * - logger.debug(message) - simple debug message
 * - logger.debugWithError(message, error, metadata?) - debug with error
 * - logger.debugWithMetadata(message, metadata) - debug with metadata
 * - logger.log(message) - alias for info
 */
export const logger = {
  /**
   * Log error message with optional error object and metadata
   * Always logged (unless QUIET=true)
   */
  error(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    if (error instanceof Error) {
      winstonLogger.error(message, { error: error.message, stack: error.stack, ...metadata });
    } else {
      winstonLogger.error(message, metadata);
    }
  },

  /**
   * Log warning message with optional metadata
   * Logged when: DEBUG=true OR level >= warn (default: always shown in text format)
   */
  warn(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    if (error instanceof Error) {
      winstonLogger.warn(message, { error: error.message, stack: error.stack, ...metadata });
    } else {
      winstonLogger.warn(message, metadata);
    }
  },

  /**
   * Log info message
   * Logged when: DEBUG=true OR level >= info (default: always shown in text format)
   */
  info(message: string): void {
    winstonLogger.info(message);
  },

  /**
   * Log info message with error
   * Logged when: DEBUG=true OR level >= info (default: always shown in text format)
   */
  infoWithError(message: string, error: Error, metadata?: Record<string, unknown>): void {
    winstonLogger.info(message, { error: error.message, stack: error.stack, ...metadata });
  },

  /**
   * Log info message with metadata
   * Logged when: DEBUG=true OR level >= info (default: always shown in text format)
   */
  infoWithMetadata(message: string, metadata: Record<string, unknown>): void {
    winstonLogger.info(message, metadata);
  },

  /**
   * Log debug message
   * Only logged when DEBUG=true
   */
  debug(message: string): void {
    winstonLogger.debug(message);
  },

  /**
   * Log debug message with error
   * Only logged when DEBUG=true
   */
  debugWithError(message: string, error: Error, metadata?: Record<string, unknown>): void {
    winstonLogger.debug(message, { error: error.message, stack: error.stack, ...metadata });
  },

  /**
   * Log debug message with metadata
   * Only logged when DEBUG=true
   */
  debugWithMetadata(message: string, metadata: Record<string, unknown>): void {
    winstonLogger.debug(message, metadata);
  },

  /**
   * Log message without level prefix (for scripts that need raw output)
   * Same as info() - logged when DEBUG=true OR level >= info (default: always shown)
   */
  log(message: string): void {
    // Use info level for log() method (same as old logger)
    this.info(message);
  },

  /**
   * Data output utilities for CLI piping/parsing
   * These methods output directly to stdout (not through Winston)
   * Use for: JSON data output, piping to other tools (jq, node scripts, etc.)
   */
  data: {
    /**
     * Output JSON to stdout (pretty-printed)
     * @param data - Data to serialize as JSON
     * @param spaces - Number of spaces for indentation (default: 2)
     */
    json(data: unknown, spaces: number = 2): void {
      process.stdout.write(JSON.stringify(data, null, spaces) + '\n');
    },

    /**
     * Output minified JSON to stdout (no whitespace)
     * @param data - Data to serialize as JSON
     */
    jsonCompact(data: unknown): void {
      process.stdout.write(JSON.stringify(data) + '\n');
    },

    /**
     * Output plain text to stdout
     * @param text - Text to output
     */
    text(text: string): void {
      process.stdout.write(text + '\n');
    },
  },
};
