/**
 * Type definitions for Postman generation
 */

export interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version?: string;
    description?: string;
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  paths: Record<string, unknown>;
}

export interface PostmanCollection {
  info: {
    name: string;
    description: string;
    schema: string;
  };
  auth?: unknown;
  variable?: Array<{
    key: string;
    value: string;
    type: string;
    description?: string;
  }>;
  item: Array<PostmanItem | PostmanFolder>;
}

export interface PostmanItem {
  name: string;
  request: {
    url?: {
      raw: string;
    };
    method?: string;
  };
}

export interface PostmanFolder {
  name: string;
  description: string;
  item: PostmanItem[];
}

export interface PostmanEnvironment {
  name: string;
  values: Array<{
    key: string;
    value: string;
    enabled: boolean;
    type: 'default' | 'secret';
  }>;
}
