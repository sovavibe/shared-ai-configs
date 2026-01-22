#!/usr/bin/env node --experimental-strip-types
// TODO(VP-376): Delete this file when GitLab supports MCP
// Tracked in Beads: VP-zhgs (Delete GitLab scripts when MCP support available)
/**
 * Reply to GitLab MR discussion thread
 *
 * Usage:
 *   npm run gitlab:mr:reply -- --mr 320 --discussion-id 12345 --body "Reply text"
 *
 * Requires: Node.js 24+ with TypeScript support
 */

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { ExternalServiceError, ValidationError } from '../../shared/errors.js';
import { logger } from '../../shared/logger.js';
import { getGitLabApiClient } from '../core/api-client.js';

/**
 * Validate Discussion ID before replying (prevents 404 errors)
 * Uses Notes API for real-time validation
 */
async function validateDiscussionId(
  client: ReturnType<typeof getGitLabApiClient>,
  mrNumber: number,
  discussionId: string
): Promise<void> {
  const validation = await client.validateDiscussionId(mrNumber, discussionId);

  if (!validation.valid) {
    logger.warn(`Discussion ID validation failed: MR=${mrNumber}, ID=${discussionId}, Reason=${validation.reason}`);
    throw new ValidationError(`Invalid Discussion ID: ${validation.reason}`);
  }

  logger.info(`Discussion ID validated: MR=${mrNumber}, ID=${discussionId}`);
}

/**
 * Reply to GitLab discussion thread
 * Uses centralized GitLab API client
 *
 * CRITICAL: Validates Discussion ID before reply to prevent 404 cascades
 */
async function replyToThread(mrNumber: number, discussionId: string, body: string): Promise<void> {
  const client = getGitLabApiClient();

  // Validate Discussion ID before attempting reply (prevents 404 errors)
  await validateDiscussionId(client, mrNumber, discussionId);

  await client.replyToThread(mrNumber, discussionId, body);
  logger.infoWithMetadata('✅ Reply added to discussion', { mrNumber: String(mrNumber), discussionId });
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const hideBinTyped = hideBin as (args: string[]) => string[];
  const argv = await yargs(hideBinTyped(process.argv))
    .command('$0 [options]', 'Reply to GitLab discussion thread', (yargs) => {
      return yargs
        .option('mr', {
          alias: 'm',
          type: 'number',
          demandOption: true,
          description: 'Merge Request number (IID)',
        })
        .option('discussion-id', {
          alias: 'd',
          type: 'string',
          demandOption: true,
          description: 'Discussion ID',
        })
        .option('body', {
          alias: 'b',
          type: 'string',
          demandOption: true,
          description: 'Reply body text',
        });
    })
    .help()
    .parse();

  try {
    const mrNumber = Number(argv.mr);
    const discussionId = String(argv['discussion-id']);
    const body = String(argv.body);

    if (Number.isNaN(mrNumber)) {
      throw new ValidationError('MR number must be a valid number');
    }

    if (!discussionId || discussionId.trim() === '') {
      throw new ValidationError('Discussion ID is required');
    }

    if (!body || body.trim() === '') {
      throw new ValidationError('Reply body cannot be empty');
    }

    await replyToThread(mrNumber, discussionId, body);
  } catch (error) {
    if (error instanceof ValidationError) {
      logger.error('Configuration error', error, { details: error.details });
      process.exit(1);
    } else if (error instanceof ExternalServiceError) {
      logger.error('GitLab API error', error);
      process.exit(1);
    } else {
      logger.error('Unexpected error', error as Error);
      process.exit(1);
    }
  }
}

// Run if executed directly
main().catch((error) => {
  logger.error('Fatal error', error as Error);
  process.exit(1);
});
