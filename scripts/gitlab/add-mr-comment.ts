#!/usr/bin/env node --experimental-strip-types
// TODO(VP-376): Delete this file when GitLab supports MCP
/**
 * Add a general comment to a GitLab Merge Request
 *
 * Usage:
 *   npm run gitlab:mr:add-comment -- --mr 322 --body "<COMMENT>"
 *
 * Requires: Node.js 24+ with TypeScript support
 */

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { getGitLabConfig } from '../shared/config.js'
import { ExternalServiceError, ValidationError } from '../shared/errors.js'
import { getGitLabClient, getProjectId } from '../shared/gitlab-client.js'
import { logger } from '../shared/logger.js'

interface AddCommentOptions {
  mr: number
  body: string
}

/**
 * Add a comment to a Merge Request
 */
async function addMRComment(config: { project: string }, options: AddCommentOptions): Promise<Record<string, unknown>> {
  const api = getGitLabClient()
  const projectId = getProjectId(config.project)

  try {
    await api.MergeRequestNotes.create(projectId, options.mr, options.body)

    return {
      success: true,
      mrId: options.mr,
      commentLength: options.body.length,
      message: 'MR comment added successfully',
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new ExternalServiceError('GitLab', `Failed to add MR comment: ${errorMessage}`)
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const hideBinTyped = hideBin as (args: string[]) => string[]
  const argv = await yargs(hideBinTyped(process.argv))
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
      description: 'Comment body (use quotes for multi-line)',
    })
    .help()
    .parse()

  try {
    const config = getGitLabConfig()
    const mrNumber = Number(argv.mr)
    const body = argv.body

    if (Number.isNaN(mrNumber)) {
      throw new ValidationError('MR number must be a valid number')
    }

    const result = await addMRComment(config, { mr: mrNumber, body })

    logger.data.json(result)
  } catch (error) {
    if (error instanceof ValidationError) {
      logger.data.json({ error: error.message })
    } else if (error instanceof ExternalServiceError) {
      logger.data.json({ error: error.message })
    } else {
      logger.data.json({ error: error instanceof Error ? error.message : error })
    }
  }
}

main().catch((error) => {
  logger.data.json({ error: error instanceof Error ? error.message : error })
})
