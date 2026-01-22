#!/usr/bin/env node --experimental-strip-types
/**
 * Git analysis utilities for metrics collection
 *
 * Provides Git log extraction and analysis.
 * Extracted from collect-metrics.ts to follow SOLID principles.
 *
 * Usage:
 *   import { getGitLog } from './git-analyzer.js'
 *
 * Requires: Node.js 24+ with TypeScript support
 */

import { execSync } from 'node:child_process'

/**
 * Get Git log output (last 30 days by default)
 *
 * @param format - Git log format string
 * @param since - Time period (default: "30 days ago")
 * @returns Git log output as string
 */
export function getGitLog(format: string, since: string = '30 days ago'): string {
  try {
    return execSync(`git log --since="${since}" --pretty=format:"${format}"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return ''
  }
}
