/**
 * Postman environment builder
 *
 * Creates environment configurations for different deployment stages
 */

import type { PostmanEnvironment } from './types.js';

export interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  isLocal?: boolean;
}

/**
 * Create environment configuration
 */
export function createEnvironment(
  name: string,
  baseUrl: string,
  isLocal: boolean = false
): PostmanEnvironment {
  return {
    name,
    values: [
      {
        key: 'base_url',
        value: baseUrl,
        enabled: true,
        type: 'default',
      },
      {
        key: 'access_token',
        value: isLocal ? 'mock-token-for-development' : '',
        enabled: true,
        type: isLocal ? 'default' : 'secret',
      },
    ],
  };
}
