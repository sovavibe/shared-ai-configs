/**
 * Formatting utilities for Postman generation
 */

import { logger } from '../../shared/logger.js';

/**
 * Display import instructions
 */
export function showInstructions(): void {
  logger.infoWithMetadata('Import instructions', {
    collection: 'docs/api/postman/collection.json',
    environments: 'docs/api/postman/environments/*.json',
  });
  logger.log('\n📝 Import instructions:');
  logger.log('1. Open Postman');
  logger.log('2. Import collection from docs/api/postman/collection.json');
  logger.log('3. Import environments from docs/api/postman/environments/*.json');
  logger.log('4. Select environment and add your access_token');
  logger.log('5. Start testing API!');
}
