#!/usr/bin/env node --experimental-strip-types
/**
 * Test coverage analysis utilities for metrics collection
 *
 * Provides test coverage extraction from coverage reports.
 * Extracted from collect-metrics.ts to follow SOLID principles.
 *
 * Usage:
 *   import { getTestCoverage } from './coverage-analyzer.js'
 *
 * Requires: Node.js 24+ with TypeScript support
 */

import { existsSync, readFileSync } from 'node:fs'

import { logger } from '../../shared/logger.js'

/**
 * Get test coverage if coverage report exists
 *
 * @returns Coverage metrics or null if not found
 */
export function getTestCoverage(): Record<string, string> | null {
  const coveragePath = 'coverage/coverage-summary.json'
  if (!existsSync(coveragePath)) {
    return null
  }

  try {
    const coverage = JSON.parse(readFileSync(coveragePath, 'utf-8')) as {
      total: Record<string, { pct: number }>
    }
    return {
      lines: `${coverage.total.lines?.pct}%`,
      statements: `${coverage.total.statements?.pct}%`,
      functions: `${coverage.total.functions?.pct}%`,
      branches: `${coverage.total.branches?.pct}%`,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error(`Failed to read coverage: ${errorMessage}`)
    return null
  }
}
