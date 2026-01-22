#!/usr/bin/env node --experimental-strip-types
/**
 * Cursor IDE usage metrics collector
 *
 * Cross-platform TypeScript version of .cursor/scripts/collect-metrics.sh
 *
 * REFACTORED: Split into modules to follow SOLID principles (VP-TBD)
 *
 * Modules:
 * - scripts/cursor/metrics/file-utils.ts (findTsFiles, countFilesByPattern)
 * - scripts/cursor/metrics/pattern-matcher.ts (countPatternInFiles, findFilesWithPattern)
 * - scripts/cursor/metrics/git-analyzer.ts (getGitLog)
 * - scripts/cursor/metrics/package-analyzer.ts (getPackageVersions)
 * - scripts/cursor/metrics/coverage-analyzer.ts (getTestCoverage)
 * - scripts/cursor/metrics/rule-analyzer.ts (countRuleFilesWithPattern, getMcpServersCount)
 * - scripts/cursor/metrics/component-analyzer.ts (getComponentSizes)
 * - scripts/cursor/metrics/report-generator.ts (generateMetricsReport)
 * - scripts/cursor/collect-metrics.ts (main entry point - this file)
 *
 * Usage:
 *   npm run cursor:metrics
 *
 * Requires: Node.js 24+ with TypeScript support
 */

import { writeFileSync } from 'node:fs'

import { logger } from '../shared/logger.js'

import { generateMetricsReport } from './metrics/report-generator.js'

/**
 * Main entry point
 */
function main(): void {
  try {
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0]?.replace(/-/g, '') ?? 'unknown'
    const outputFile = `.cursor/metrics-${dateStr}.md`

    logger.info('Collecting metrics...')

    const report = generateMetricsReport()

    writeFileSync(outputFile, report, 'utf-8')

    logger.info(`✅ Metrics saved to: ${outputFile}`)
    logger.info('')
    logger.info(report)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error(`Failed to collect metrics: ${errorMessage}`)
    process.exit(1)
  }
}

main()
