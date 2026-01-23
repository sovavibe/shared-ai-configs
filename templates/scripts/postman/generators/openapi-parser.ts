/**
 * OpenAPI specification parser
 *
 * Loads and validates OpenAPI spec from file
 */

import { readFileSync, existsSync } from 'node:fs';

import { logger } from '../../shared/logger.js';

import type { OpenAPISpec } from './types.js';

/**
 * Load and validate OpenAPI specification
 */
export function loadOpenAPISpec(apiDocsPath: string): OpenAPISpec {
  if (!existsSync(apiDocsPath)) {
    logger.error('api-docs.json not found', undefined, { path: apiDocsPath });
    logger.info('Please ensure backend OpenAPI spec is available at api-docs.json');
    process.exit(1);
  }

  const rawData = readFileSync(apiDocsPath, 'utf8');
  const spec = JSON.parse(rawData) as OpenAPISpec;

  // Add version if missing (required by converter)
  if (!spec.info.version) {
    spec.info.version = '1.0.0';
  }

  return spec;
}
