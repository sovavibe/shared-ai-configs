#!/usr/bin/env node --experimental-strip-types
/**
 * Add a general note to GitLab Merge Request
 *
 * This script adds a general comment (note) to a GitLab MR (not an inline comment).
 * Useful for responding to general MR comments (type: null, resolvable: false).
 *
 * Usage:
 *   npm run gitlab:mr:add-note -- --mr 320 --body "Response text"
 *   npm run gitlab:mr:add-note -- --mr 320 --body "Response" --reply-to 157549
 *
 * Requires: Node.js 24+ with TypeScript support
 */

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { ExternalServiceError, ValidationError } from '../../shared/errors.js'
import { logger } from '../../shared/logger.js'
import { getGitLabApiClient } from '../core/api-client.js'

/**
 * Main function
 */
async function main(): Promise<void> {
  const hideBinTyped = hideBin as (args: string[]) => string[]
  const argv = await yargs(hideBinTyped(process.argv))
    .command('$0 [options]', 'Add a general note to GitLab MR', (yargs) => {
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
          demandOption: true,
          description: 'Note body (comment text)',
        })
        .option('reply-to', {
          alias: 'r',
          type: 'number',
          description: 'Note ID to reply to (optional)',
        })
    })
    .help()
    .parse()

  try {
    const mrNumber = Number(argv.mr)
    const body = String(argv.body)
    const replyTo = argv['reply-to'] ? Number(argv['reply-to']) : undefined

    if (Number.isNaN(mrNumber)) {
      throw new ValidationError('MR number must be a valid number')
    }

    if (!body || body.trim() === '') {
      throw new ValidationError('Note body cannot be empty')
    }

    const client = getGitLabApiClient()
    const url = client.getUrl()
    const token = client.getToken()
    const encodedProjectId = client.getEncodedProjectId()

    // Build note URL
    const notesUrl = `${url}/api/v4/projects/${encodedProjectId}/merge_requests/${mrNumber}/notes`

    // Build request body
    const requestBody: Record<string, string | number> = {
      body,
    }

    if (replyTo) {
      requestBody.in_reply_to = replyTo
    }

    // Create note
    const response = await fetch(notesUrl, {
      method: 'POST',
      headers: {
        'PRIVATE-TOKEN': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new ExternalServiceError('GitLab', `Failed to add note: ${errorText}`)
    }

    const result = (await response.json()) as { id: number }

    logger.infoWithMetadata('Note added successfully', {
      mr: mrNumber,
      noteId: result.id,
      replyTo,
    })

    // Output result for verification
    logger.data.json(result)
  } catch (error) {
    if (error instanceof ValidationError) {
      logger.error('Configuration error', error, { details: error.details })
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

// Run if executed directly
main().catch((error) => {
  logger.error('Fatal error', error as Error)
  process.exit(1)
})
