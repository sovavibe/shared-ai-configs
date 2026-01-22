#!/usr/bin/env node --experimental-strip-types
/**
 * Get all notes (comments) from GitLab Merge Request
 *
 * This script fetches ALL notes from a GitLab MR, including:
 * - General MR comments (type: Note without position)
 * - Inline discussion comments (type: DiffNote)
 *
 * Usage:
 *   npm run gitlab:mr:get-all-notes -- --mr 320
 *   npm run gitlab:mr:get-all-notes -- --mr 320 --open-only
 *
 * Requires: Node.js 24+ with TypeScript support
 */

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { ValidationError } from '../../shared/errors.js'
import { logger } from '../../shared/logger.js'
import { getGitLabApiClient } from '../core/api-client.js'

/**
 * Note type from GitLab API
 */
export interface GitLabNote {
  id: number
  type: string
  body: string
  author: {
    id: number
    username: string
    name: string
    web_url: string
  }
  created_at: string
  updated_at: string
  system: boolean
  resolvable: boolean | null
  resolved: boolean | null
  noteable_iid: number
  /** Discussion ID - required for replying to threads */
  discussion_id?: string
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const hideBinTyped = hideBin as (args: string[]) => string[]
  const argv = await yargs(hideBinTyped(process.argv))
    .command('$0 [options]', 'Get all notes from GitLab MR', (yargs) => {
      return yargs
        .option('mr', {
          alias: 'm',
          type: 'number',
          demandOption: true,
          description: 'Merge Request number (IID)',
        })
        .option('open-only', {
          alias: 'o',
          type: 'boolean',
          default: false,
          description: 'Show only unresolved notes',
        })
    })
    .help()
    .parse()

  try {
    const mrNumber = Number(argv.mr)
    if (Number.isNaN(mrNumber)) {
      throw new ValidationError('MR number must be a valid number')
    }

    const client = getGitLabApiClient()
    const encodedProjectId = client.getEncodedProjectId()
    const url = client.getUrl()
    const token = client.getToken()

    // Fetch all notes from MR using GitLab API
    const allNotes: GitLabNote[] = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      const notesUrl = `${url}/api/v4/projects/${encodedProjectId}/merge_requests/${mrNumber}/notes?per_page=100&page=${page}`

      const response = await fetch(notesUrl, {
        headers: {
          'PRIVATE-TOKEN': token,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch notes: ${errorText}`)
      }

      const notes = (await response.json()) as GitLabNote[]
      allNotes.push(...notes)

      // Check if there are more pages using X-Total header (fixes off-by-one bug)
      const totalHeader = response.headers.get('X-Total')
      const total = totalHeader ? parseInt(totalHeader, 10) : 0
      const fetched = allNotes.length
      hasMore = total > 0 && fetched < total
      page += 1
    }

    // Filter by unresolved status if requested
    const filtered = argv['open-only']
      ? allNotes.filter((note) => {
          if (!note.resolvable) return false
          return note.resolved !== true
        })
      : allNotes

    // Exclude system notes (e.g., "mentioned in commit", "approved this merge request")
    const nonSystemNotes = filtered.filter((note) => !note.system)

    // Output notes to stdout for piping/parsing
    logger.data.json(nonSystemNotes)
  } catch (error) {
    if (error instanceof ValidationError) {
      logger.error('Configuration error', error, { details: error.details })
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
