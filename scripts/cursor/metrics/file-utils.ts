#!/usr/bin/env node --experimental-strip-types
/**
 * File utilities for metrics collection
 *
 * Provides file system operations for finding and counting TypeScript/TSX files.
 * Extracted from collect-metrics.ts to follow SOLID principles.
 *
 * Usage:
 *   import { findTsFiles, countFilesByPattern } from './file-utils.js'
 *
 * Requires: Node.js 24+ with TypeScript support
 */

import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { logger } from '../../shared/logger.js'

/**
 * Recursively find all TypeScript/TSX files in directory
 *
 * @param dir - Directory to search
 * @param fileList - Accumulator for recursive calls (internal)
 * @returns Array of file paths
 */
export function findTsFiles(dir: string, fileList: string[] = []): string[] {
  try {
    const files = readdirSync(dir)

    for (const file of files) {
      const filePath = join(dir, file)
      const stat = statSync(filePath)

      if (stat.isDirectory()) {
        // Skip node_modules and other ignored directories
        if (file === 'node_modules' || file === '.git' || file === 'dist' || file === '.vite') {
          continue
        }
        findTsFiles(filePath, fileList)
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        fileList.push(filePath)
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error(`Failed to read directory: ${dir} - ${errorMessage}`)
  }

  return fileList
}

/**
 * Count files matching pattern
 *
 * @param dir - Directory to search
 * @param pattern - Regex pattern to match file names
 * @returns Count of matching files
 */
export function countFilesByPattern(dir: string, pattern: RegExp): number {
  let count = 0

  try {
    const files = findTsFiles(dir)
    for (const file of files) {
      if (pattern.test(file)) {
        count++
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error(`Failed to count files: ${dir} - ${errorMessage}`)
  }

  return count
}
