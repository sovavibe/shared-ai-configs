/**
 * Helper functions for working with stack configuration
 * Supports both array format (new) and object format (legacy)
 */

import type { StackConfig } from '../types.js';

/**
 * Get stack item as string (first item if array, formatted from object if legacy)
 */
export function getStackItemString(
  item:
    | string[]
    | { name?: string; version?: string; tool?: string; library?: string }
    | string
    | undefined
): string | undefined {
  if (!item) return undefined;
  if (typeof item === 'string') return item;
  if (Array.isArray(item)) return item[0];
  // Object format
  if ('name' in item && item.name) return item.version ? `${item.name} ${item.version}` : item.name;
  if ('tool' in item && item.tool) return item.version ? `${item.tool} ${item.version}` : item.tool;
  if ('library' in item && item.library)
    return item.version ? `${item.library} ${item.version}` : item.library;
  return undefined;
}

/**
 * Get all stack items as array of strings
 */
export function getStackItemArray(
  item:
    | string[]
    | { name?: string; version?: string; tool?: string; library?: string }
    | string
    | undefined
): string[] {
  if (!item) return [];
  if (typeof item === 'string') return [item];
  if (Array.isArray(item)) return item;
  // Object format - convert to array
  const str = getStackItemString(item);
  return str ? [str] : [];
}

/**
 * Check if stack item contains a specific value (case-insensitive)
 */
export function stackItemContains(
  item:
    | string[]
    | { name?: string; version?: string; tool?: string; library?: string; styling?: string }
    | string
    | undefined,
  search: string
): boolean {
  const searchLower = search.toLowerCase();
  if (!item) return false;
  if (typeof item === 'string') return item.toLowerCase().includes(searchLower);
  if (Array.isArray(item)) return item.some((i) => i.toLowerCase().includes(searchLower));
  // Object format
  const values = Object.values(item).filter((v): v is string => typeof v === 'string');
  return values.some((v) => v.toLowerCase().includes(searchLower));
}

/**
 * Get framework name (without version)
 */
export function getFrameworkName(stack: StackConfig): string | undefined {
  const item = stack.framework;
  if (!item) return undefined;
  if (Array.isArray(item)) {
    // Extract name from first item (e.g., "React 18" -> "React")
    return item[0]?.split(/\s+/)[0];
  }
  return item.name;
}

/**
 * Get UI library name (without version)
 */
export function getUILibraryName(stack: StackConfig): string | undefined {
  const item = stack.ui;
  if (!item) return undefined;
  if (Array.isArray(item)) {
    return item[0]?.split(/\s+/)[0];
  }
  return item.library;
}

/**
 * Detect stack type from framework
 */
export function detectStackType(
  stack: StackConfig
): 'react' | 'node' | 'nextjs' | 'java' | 'python' | undefined {
  const framework = getFrameworkName(stack)?.toLowerCase();
  if (!framework) return undefined;

  if (framework.includes('react')) return 'react';
  if (framework.includes('next')) return 'nextjs';
  if (framework.includes('node') || framework.includes('express') || framework.includes('fastify'))
    return 'node';
  if (framework.includes('spring') || framework.includes('java')) return 'java';
  if (framework.includes('django') || framework.includes('flask') || framework.includes('python'))
    return 'python';

  return undefined;
}
