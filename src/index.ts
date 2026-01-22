// Main exports for programmatic usage
export * from './cli/types.js';
export { loadConfig, validateConfig, getDefaultConfig, mergeConfigs } from './cli/utils/config.js';
export { renderTemplate, listTemplates, getTemplateOutputPath } from './cli/utils/template.js';
export { logger } from './cli/utils/logger.js';
