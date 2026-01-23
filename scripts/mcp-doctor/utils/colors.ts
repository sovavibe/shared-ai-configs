/**
 * ANSI color codes for terminal output
 * Unified color constants for all mcp-doctor scripts
 */

export const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
} as const;

export type Color = (typeof colors)[keyof typeof colors];
