#!/usr/bin/env node --experimental-strip-types
// TODO(VP-376): Delete this file when GitLab supports MCP
/**
 * Get GitLab Merge Request diff
 *
 * Usage:
 *   npm run gitlab:mr:diff -- --mr 320
 *
 * Requires: Node.js 24+ with TypeScript support
 */

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { getGitLabConfig } from '../../shared/config.js'
import { ExternalServiceError, ValidationError } from '../../shared/errors.js'
import { getGitLabClient, getProjectId } from '../../shared/gitlab-client.js'
import { logger } from '../../shared/logger.js'

/**
 * Fetch MR diff from GitLab API using GitBeaker
 */
async function fetchMRDiff(config: { project: string }, mrNumber: number): Promise<string> {
  const api = getGitLabClient()
  const projectId = getProjectId(config.project)

  try {
    const changes = (await api.MergeRequests.showChanges(projectId, mrNumber)) as {
      changes?: Array<{ diff: string }>
    }
    if (!changes.changes) {
      return ''
    }
    return changes.changes.map((change) => change.diff).join('\n')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new ExternalServiceError('GitLab', `Failed to fetch MR diff: ${errorMessage}`)
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const hideBinTyped = hideBin as (args: string[]) => string[]
  const argv = await yargs(hideBinTyped(process.argv))
    .command('$0', 'Get GitLab MR diff', (yargs) => {
      return yargs.option('mr', {
        alias: 'm',
        type: 'number',
        demandOption: true,
        description: 'Merge Request number (IID)',
      })
    })
    .help()
    .parse()

  try {
    const config = getGitLabConfig()
    const mrNumber = Number(argv.mr)

    if (Number.isNaN(mrNumber)) {
      throw new ValidationError('MR number must be a valid number')
    }

    const diff = await fetchMRDiff(config, mrNumber)

    // Output diff to stdout for piping/parsing
    logger.data.json(diff)
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

main().catch((error) => {
  logger.error('Fatal error', error as Error)
  process.exit(1)
})
