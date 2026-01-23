import { logger } from '../utils/logger.js';
import { loadConfig, validateConfig } from '../utils/config.js';
import { detectStackType, getStackItemArray } from '../utils/stack-helpers.js';
import type { ValidateOptions } from '../types.js';

export async function validateCommand(options: ValidateOptions): Promise<void> {
  logger.header('Validating configuration');

  try {
    const config = loadConfig(options.config);
    const { valid, errors } = validateConfig(config);

    if (valid) {
      logger.success('Configuration is valid');

      // Show summary
      const stackType = config.stack.type ?? detectStackType(config.stack) ?? 'unknown';
      const frameworks = getStackItemArray(config.stack.framework).join(', ') || 'not set';

      logger.info('');
      logger.table({
        Project: config.project.name,
        Stack: stackType,
        Framework: frameworks,
        'Chat language': config.languages?.chat || 'English',
        VCS: config.services?.vcs?.type || 'none',
        'Task tracking': config.services?.task_tracking?.type || 'none',
        'Generation strategy': config.generation?.strategy || 'generate',
      });
    } else {
      logger.error('Configuration has errors:');
      for (const error of errors) {
        logger.list([error], '✗');
      }
      process.exit(1);
    }
  } catch (error) {
    const err = error as Error;
    logger.error(`Failed to validate: ${err.message}`);
    process.exit(1);
  }
}
