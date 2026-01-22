#!/usr/bin/env node --experimental-strip-types
/**
 * Package.json analysis utilities for metrics collection
 *
 * Provides package version extraction.
 * Extracted from collect-metrics.ts to follow SOLID principles.
 *
 * Usage:
 *   import { getPackageVersions } from './package-analyzer.js'
 *
 * Requires: Node.js 24+ with TypeScript support
 */

import { readFileSync } from 'node:fs';

import { logger } from '../../shared/logger.js';

/**
 * Get package.json dependencies versions
 *
 * @returns Record of package versions
 */
export function getPackageVersions(): Record<string, string> {
  try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf-8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    return {
      react: packageJson.dependencies?.react || 'not found',
      typescript: packageJson.devDependencies?.typescript || 'not found',
      vite: packageJson.devDependencies?.vite || 'not found',
      '@tanstack/react-query': packageJson.dependencies?.['@tanstack/react-query'] || 'not found',
      antd: packageJson.dependencies?.antd || 'not found',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to read package.json: ${errorMessage}`);
    return {};
  }
}
