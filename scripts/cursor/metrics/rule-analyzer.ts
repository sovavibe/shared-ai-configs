#!/usr/bin/env node --experimental-strip-types
/**
 * Cursor rules analysis utilities for metrics collection
 *
 * Provides rule file analysis and MCP server counting.
 * Extracted from collect-metrics.ts to follow SOLID principles.
 *
 * Usage:
 *   import { countRuleFilesWithPattern, getMcpServersCount } from './rule-analyzer.js'
 *
 * Requires: Node.js 24+ with TypeScript support
 */

import { existsSync, readFileSync } from 'node:fs'

import { logger } from '../../shared/logger.js'

import { findTsFiles } from './file-utils.js'

/**
 * Count rule files matching pattern
 *
 * @param pattern - Regex pattern to match in file content
 * @returns Count of matching files
 */
export function countRuleFilesWithPattern(pattern: RegExp): number {
  let count = 0

  try {
    const ruleFiles = findTsFiles('.cursor/rules')
    for (const file of ruleFiles) {
      try {
        const content = readFileSync(file, 'utf-8')
        if (pattern.test(content)) {
          count++
        }
      } catch {
        // Skip files that can't be read
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error(`Failed to count rule files: ${errorMessage}`)
  }

  return count
}

/**
 * Get MCP servers count from configuration
 *
 * @returns Number of configured MCP servers
 */
export function getMcpServersCount(): number {
  const mcpPath = '.cursor/mcp.json'
  if (!existsSync(mcpPath)) {
    return 0
  }

  try {
    const mcp = JSON.parse(readFileSync(mcpPath, 'utf-8')) as {
      mcpServers?: Record<string, unknown>
    }
    return Object.keys(mcp.mcpServers || {}).length
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error(`Failed to read MCP config: ${errorMessage}`)
    return 0
  }
}
