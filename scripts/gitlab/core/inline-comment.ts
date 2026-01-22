#!/usr/bin/env node --experimental-strip-types
// TODO(VP-376): Delete this file when GitLab supports MCP
/**
 * Create inline comment in GitLab Merge Request
 *
 * Usage:
 *   npm run gitlab:inline-comment -- --mr 320 --file src/app.tsx --line 42 --side new --body "Comment body"
 *
 * Requires: Node.js 24+ with TypeScript support
 */

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { ExternalServiceError, ValidationError } from '../../shared/errors.js'
import { logger } from '../../shared/logger.js'

import { getGitLabApiClient, type InlineCommentOptions } from './api-client.js'

/**
 * Create inline comment in GitLab MR
 * Uses centralized GitLab API client
 */
async function createInlineComment(options: InlineCommentOptions): Promise<Record<string, unknown>> {
  const client = getGitLabApiClient()
  return client.createInlineComment(options)
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const hideBinTyped = hideBin as (args: string[]) => string[]
  const argv = await yargs(hideBinTyped(process.argv))
    .command('$0', 'Create inline comment in GitLab MR', (yargs) => {
      return yargs
        .option('mr', {
          alias: 'm',
          type: 'number',
          demandOption: true,
          description: 'Merge Request number (IID)',
        })
        .option('file', {
          alias: 'f',
          type: 'string',
          demandOption: true,
          description: 'File path relative to repository root',
        })
        .option('line', {
          alias: 'l',
          type: 'number',
          demandOption: true,
          description: 'Line number',
        })
        .option('side', {
          alias: 's',
          type: 'string',
          choices: ['new', 'old'] as const,
          default: 'new' as const,
          description: 'Side of the diff (new or old)',
        })
        .option('body', {
          alias: 'b',
          type: 'string',
          demandOption: true,
          description: 'Comment body (use quotes for multi-line)',
        })
    })
    .help()
    .parse()

  try {
    const mrNumber = Number(argv.mr)
    const lineNumber = Number(argv.line)
    const side = (argv.side as 'new' | 'old') || 'new'

    if (Number.isNaN(mrNumber)) {
      throw new ValidationError('MR number must be a valid number')
    }

    if (Number.isNaN(lineNumber)) {
      throw new ValidationError('Line number must be a valid number')
    }

    const options: InlineCommentOptions = {
      mr: mrNumber,
      file: argv.file as string,
      line: lineNumber,
      side,
      body: argv.body as string,
    }

    await createInlineComment(options)

    // Output result
    logger.data.json({
      success: true,
      message: 'Inline comment created successfully',
    })
  } catch (error) {
    if (error instanceof ValidationError) {
      logger.error('Validation error', error, { details: error.details })
      process.exit(1)
    } else if (error instanceof ExternalServiceError) {
      logger.error('GitLab API error', error)
      process.exit(1)
    } else {
      logger.error('Unexpected error', error as Error)
      process.exit(1)
    }
  }
}

main().catch((error) => {
  logger.error('Fatal error', error as Error)
  process.exit(1)
})
