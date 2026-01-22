/**
 * MCP doctor logger utilities
 * Unified logging for mcp-doctor scripts using colors and shared logger
 */

import { logger } from '../../shared/logger.js'

import { colors, type Color } from './colors.js'

/**
 * Log message with color
 */
export function log(message: string, color: Color = colors.reset): void {
  logger.info(`${color}${message}${colors.reset}`)
}

/**
 * Log section header
 */
export function logSection(title: string): void {
  logger.info('')
  log(`\n${title}`, colors.bold)
  logger.info('='.repeat(title.length))
}

/**
 * Log success message
 */
export function logSuccess(message: string): void {
  log(`   ${colors.green}✅${colors.reset} ${message}`)
}

/**
 * Log error message
 */
export function logError(message: string): void {
  log(`   ${colors.red}❌${colors.reset} ${message}`)
}

/**
 * Log warning message
 */
export function logWarning(message: string): void {
  log(`   ${colors.yellow}⚠️${colors.reset} ${message}`)
}

/**
 * Log info message
 */
export function logInfo(message: string): void {
  log(`   ${colors.blue}ℹ️${colors.reset} ${message}`)
}

/**
 * Direct log without color prefix
 */
export function directLog(message: string): void {
  logger.info(message)
}
