#!/usr/bin/env node --experimental-strip-types
/**
 * Component size analysis utilities for metrics collection
 *
 * Provides component size analysis (files over 150 lines).
 * Extracted from collect-metrics.ts to follow SOLID principles.
 *
 * Usage:
 *   import { getComponentSizes } from './component-analyzer.js'
 *
 * Requires: Node.js 24+ with TypeScript support
 */

import { readFileSync } from 'node:fs'

/**
 * Get component sizes (files over 150 lines)
 *
 * @param tsxFiles - Array of TSX file paths
 * @returns Array of components with line counts
 */
export function getComponentSizes(tsxFiles: string[]): Array<{ file: string; lines: number }> {
  const components: Array<{ file: string; lines: number }> = []

  for (const file of tsxFiles) {
    try {
      const content = readFileSync(file, 'utf-8')
      const lines = content.split('\n').length

      if (lines > 150) {
        components.push({ file, lines })
      }
    } catch {
      // Skip files that can't be read
    }
  }

  return components
}
