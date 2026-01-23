/**
 * Postman collection builder
 *
 * Converts OpenAPI spec to Postman collection and organizes by service
 */

import Converter from 'openapi-to-postmanv2';

import type { ConverterCallback, ConverterOptions, ConverterResult } from './converter-types.js';
import type { OpenAPISpec, PostmanCollection, PostmanItem, PostmanFolder } from './types.js';

/**
 * Convert OpenAPI to Postman using the converter library
 */
export async function convertToPostman(spec: OpenAPISpec): Promise<PostmanCollection> {
  return new Promise((resolve, reject) => {
    const options: ConverterOptions = {
      type: 'json',
      data: JSON.stringify(spec),
    };

    const callback: ConverterCallback = (err: Error | null, result: ConverterResult) => {
      if (err) {
        reject(new Error(`Conversion error: ${err.message}`));
        return;
      }

      if (!result.result) {
        reject(new Error(`Conversion failed: ${result.reason ?? 'Unknown error'}`));
        return;
      }

      if (!result.output || !result.output[0] || !result.output[0].data) {
        reject(new Error('Invalid conversion result format'));
        return;
      }

      resolve(result.output[0].data);
    };

    // Type assertion needed because library types are incorrect
    // But we use our own types for safety
    Converter.convert(options, {}, callback as never);
  });
}

/**
 * Determine which service a request belongs to
 */
export function getServiceName(
  url: string,
  services: Record<string, [string, ...string[]]>
): string {
  for (const [, [serviceName, ...patterns]] of Object.entries(services)) {
    if (patterns.some((pattern) => url.includes(pattern))) {
      return serviceName;
    }
  }
  return 'Other';
}

/**
 * Organize collection items into service folders
 */
export function organizeByService(
  collection: PostmanCollection,
  services: Record<string, [string, ...string[]]>
): PostmanCollection {
  // Initialize service groups
  const serviceNames = Object.values(services).map(([name]) => name);
  const initialGroups: Record<string, PostmanItem[]> = Object.fromEntries(
    [...serviceNames, 'Other'].map((name) => [name, []])
  );

  // Sort items into groups (immutable)
  const serviceGroups = collection.item.reduce((groups, item) => {
    if (!('request' in item)) return groups;

    const url = item.request.url?.raw || '';
    const serviceName = getServiceName(url, services);
    const targetGroup = serviceName in groups ? serviceName : 'Other';
    const currentItems = groups[targetGroup] ?? [];

    return {
      ...groups,
      [targetGroup]: [...currentItems, item],
    };
  }, initialGroups);

  // Rebuild collection with folders (immutable)
  const newItems = Object.entries(serviceGroups)
    .filter(([, items]) => items.length > 0)
    .map(
      ([name, items]): PostmanFolder => ({
        name,
        description: `API endpoints for ${name}`,
        item: items,
      })
    );

  // Return new collection (immutable)
  return {
    ...collection,
    item: newItems,
  };
}

/**
 * Create collection description
 */
export function createCollectionDescription(): string {
  return [
    'Frontend Service API Collection for Java Backend Services',
    '',
    '## Services:',
    '- **Cargo Service** - Cargo requests management',
    '- **Route Service** - Routes and freight calculation',
    '- **Dictionary Service** - Reference data',
    '- **Auth Service** - Authentication and authorization',
    '- **Report Service** - Reports generation',
    '- **Schedule Service** - Vessel schedules',
    '',
    '## Authentication:',
    'Use Azure AD OAuth2 token in Authorization header',
  ].join('\\n');
}

/**
 * Create bearer authentication config
 */
export function createBearerAuth() {
  return {
    type: 'bearer' as const,
    bearer: [
      {
        key: 'token',
        value: '{{access_token}}',
        type: 'string',
      },
    ],
  };
}

/**
 * Create collection variables
 */
export function createCollectionVariables() {
  return [
    {
      key: 'base_url',
      value: 'https://api.dev.eurochem.com',
      type: 'string',
      description: 'Base URL for API Gateway',
    },
    {
      key: 'access_token',
      value: '',
      type: 'string',
      description: 'Azure AD OAuth2 access token',
    },
  ];
}

/**
 * Enhance collection with metadata and authentication
 */
export function enhanceCollection(collection: PostmanCollection): void {
  collection.info.name = 'EuroChem Customer Portal API';
  collection.info.description = createCollectionDescription();
  collection.auth = createBearerAuth();
  collection.variable = createCollectionVariables();
}
