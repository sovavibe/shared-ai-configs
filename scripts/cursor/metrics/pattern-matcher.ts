#!/usr/bin/env node --experimental-strip-types
/**
 * Pattern matching utilities for metrics collection
 *
 * Provides functions for matching and counting patterns in file contents.
 * Extracted from collect-metrics.ts to follow SOLID principles.
 *
 * Usage:
 *   import { countPatternInFiles, findFilesWithPattern } from './pattern-matcher.js'
 *
 * Requires: Node.js 24+ with TypeScript support
 */

import { readFileSync } from 'node:fs';

/**
 * Count pattern matches in files
 *
 * @param files - Array of file paths
 * @param pattern - Regex pattern to match
 * @returns Total count of pattern matches
 */
export function countPatternInFiles(files: string[], pattern: RegExp): number {
  let count = 0;

  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf-8');
      const matches = content.match(pattern);
      if (matches) {
        count += matches.length;
      }
    } catch {
      // Skip files that can't be read
    }
  }

  return count;
}

/**
 * Find files matching pattern with line numbers
 *
 * @param files - Array of file paths
 * @param pattern - Regex pattern to match
 * @returns Array of matches with file, line, and content
 */
export function findFilesWithPattern(
  files: string[],
  pattern: RegExp
): Array<{ file: string; line: number; content: string }> {
  const results: Array<{ file: string; line: number; content: string }> = [];

  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line && pattern.test(line)) {
          results.push({
            file,
            line: i + 1,
            content: line.trim(),
          });
        }
      }
    } catch {
      // Skip files that can't be read
    }
  }

  return results;
}
