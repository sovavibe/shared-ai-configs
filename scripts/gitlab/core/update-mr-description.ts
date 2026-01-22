#!/usr/bin/env node --experimental-strip-types
// TODO(VP-376): Delete this file when GitLab supports MCP
/**
 * Update GitLab Merge Request description
 *
 * Usage:
 *   npm run gitlab:mr:update-description -- --mr 320 --body "<DESCRIPTION>"
 *
 * Requires: Node.js 24+ with TypeScript support
 */

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getGitLabConfig } from '../../shared/config.js';
import { ExternalServiceError, ValidationError } from '../../shared/errors.js';
import { getGitLabClient, getProjectId } from '../../shared/gitlab-client.js';
import { logger } from '../../shared/logger.js';

interface UpdateDescriptionOptions {
  mr: number;
  body?: string;
  file?: string;
}

/**
 * Update MR description in GitLab
 */
async function updateMRDescription(
  config: { project: string },
  options: UpdateDescriptionOptions
): Promise<Record<string, unknown>> {
  const api = getGitLabClient();
  const projectId = getProjectId(config.project);

  // Read description from file if provided
  let description = options.body;
  if (options.file && !description) {
    const fs = await import('node:fs');
    description = fs.readFileSync(options.file, 'utf-8');
  }

  if (!description) {
    throw new ValidationError('Either --body or --file must be provided');
  }

  try {
    await api.MergeRequests.edit(projectId, options.mr, {
      description,
    });

    return {
      success: true,
      mrId: options.mr,
      descriptionLength: description.length,
      message: 'MR description updated successfully',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new ExternalServiceError('GitLab', `Failed to update MR description: ${errorMessage}`);
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const hideBinTyped = hideBin as (args: string[]) => string[];
  const argv = await yargs(hideBinTyped(process.argv))
    .command('$0', 'Update GitLab MR description', (yargs) => {
      return yargs
        .option('mr', {
          alias: 'm',
          type: 'number',
          demandOption: true,
          description: 'Merge Request number (IID)',
        })
        .option('body', {
          alias: 'b',
          type: 'string',
          description: 'MR description content (use quotes for multi-line)',
        })
        .option('file', {
          alias: 'f',
          type: 'string',
          description: 'Path to markdown file containing MR description',
        });
    })
    .help()
    .parse();

  try {
    const config = getGitLabConfig();
    const mrNumber = Number(argv.mr);
    const body = argv.body as string;
    const file = argv.file as string;

    if (Number.isNaN(mrNumber)) {
      throw new ValidationError('MR number must be a valid number');
    }

    if (!body && !file) {
      throw new ValidationError('Either --body or --file must be provided');
    }

    const result = await updateMRDescription(config, {
      mr: mrNumber,
      body,
      file,
    });

    // Output result
    logger.data.json(result);
    logger.infoWithMetadata('✅ MR description updated successfully', {
      mrId: String(mrNumber),
      descriptionLength: String(result.descriptionLength),
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      logger.error('Validation error', error, { details: error.details });
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

main().catch((error) => {
  logger.error('Fatal error', error as Error);
  process.exit(1);
});
