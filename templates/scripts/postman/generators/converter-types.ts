/**
 * Type overrides for openapi-to-postmanv2 library
 *
 * The Converter library has incorrect callback type definitions.
 * This file provides correct types to avoid suppressions.
 *
 * TODO(VP-376): Remove this file when library types are updated or PR is merged
 */

import type { PostmanCollection } from './types.js';

/**
 * Converter result structure
 * Based on actual library behavior, not incorrect type definitions
 */
export interface ConverterResult {
  result: boolean;
  reason?: string;
  output?: Array<{
    data: PostmanCollection;
  }>;
}

/**
 * Converter callback function type
 */
export type ConverterCallback = (err: Error | null, result: ConverterResult) => void;

/**
 * Converter options type
 */
export interface ConverterOptions {
  type: 'json';
  data: string;
}
