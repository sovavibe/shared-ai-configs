#!/usr/bin/env node --experimental-strip-types
// TODO(VP-376): Delete this file when GitLab supports MCP
// Tracked in Beads: VP-zhgs (Delete GitLab scripts when MCP support available)
/**
 * Get unresolved inline comments from GitLab Merge Request
 *
 * This script fetches all unresolved inline comments (DiffNote) from a GitLab MR
 * and outputs them as JSON for further processing (e.g., creating Jira tasks)
 *
 * IMPORTANT: Uses Discussions API to get discussion_id (required for replies)
 * - Notes API does NOT return discussion_id field
 * - Discussions API returns discussion.id which is required for reply-to-thread.ts
 *
 * Usage:
 *   npm run gitlab:unresolved-comments -- --mr 320
 *   npm run gitlab:unresolved-comments -- --mr 320 --inline-only
 *   npm run gitlab:unresolved-comments -- --mr 320 --open-only
 *
 * Requires: Node.js 24+ with TypeScript support
 *
 * Refactored (2026-01-19): Switched to Discussions API to get discussion_id for replies
 */

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { ValidationError } from '../../shared/errors.js';
import { logger } from '../../shared/logger.js';
import { getGitLabApiClient } from '../core/api-client.js';

import { type GitLabNote } from './get-all-notes.js';

/**
 * Discussion from GitLab Discussions API
 * Each discussion contains one or more notes (the first note is the original comment)
 */
interface GitLabDiscussion {
  id: string; // This IS the discussion_id needed for replies!
  individual_note: boolean;
  notes: Array<{
    id: number;
    type: string;
    body: string;
    author: {
      id: number;
      username: string;
      name: string;
      web_url: string;
    };
    created_at: string;
    updated_at: string;
    system: boolean;
    resolvable: boolean | null;
    resolved: boolean | null;
    noteable_iid: number;
    position?: {
      new_path?: string;
      new_line?: number;
      old_path?: string;
      old_line?: number;
    };
  }>;
}

type GitLabNotesResponse = GitLabNote[];

/**
 * Filter notes based on criteria
 */
function filterNotes(
  notes: GitLabNotesResponse,
  options: { openOnly?: boolean; inlineOnly?: boolean }
): GitLabNotesResponse {
  const filtered = notes.filter((note): note is GitLabNote => {
    // Filter out system notes
    if (note.system) return false;

    // Filter by inline comments (DiffNote)
    if (options.inlineOnly && note.type !== 'DiffNote') {
      return false;
    }

    // Filter by unresolved status
    if (options.openOnly) {
      // Only include resolvable notes that are not resolved
      if (!note.resolvable) return false;
      if (note.resolved === true) return false;
    }

    return true;
  });

  return filtered;
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const hideBinTyped = hideBin as (args: string[]) => string[];
  const argv = await yargs(hideBinTyped(process.argv))
    .command('$0 [options]', 'Get unresolved inline comments', (yargs) => {
      return yargs
        .option('mr', {
          alias: 'm',
          type: 'number',
          demandOption: true,
          description: 'Merge Request number (IID)',
        })
        .option('inline-only', {
          alias: 'i',
          type: 'boolean',
          default: false,
          description: 'Show only inline comments (DiffNote)',
        })
        .option('open-only', {
          alias: 'o',
          type: 'boolean',
          default: false,
          description: 'Show only unresolved comments',
        });
    })
    .help()
    .parse();

  try {
    const mrNumber = Number(argv.mr);
    if (Number.isNaN(mrNumber)) {
      throw new ValidationError('MR number must be a valid number');
    }

    const client = getGitLabApiClient();
    const encodedProjectId = client.getEncodedProjectId();
    const url = client.getUrl();
    const token = client.getToken();

    // Fetch all discussions from MR using GitLab Discussions API (with pagination)
    // Discussions API returns discussion.id which is REQUIRED for replies (Notes API does NOT!)
    const allDiscussions: GitLabDiscussion[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const discussionsUrl = `${url}/api/v4/projects/${encodedProjectId}/merge_requests/${mrNumber}/discussions?per_page=100&page=${page}`;

      const response = await fetch(discussionsUrl, {
        headers: {
          'PRIVATE-TOKEN': token,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch discussions: ${errorText}`);
      }

      const discussions = (await response.json()) as GitLabDiscussion[];
      allDiscussions.push(...discussions);

      // Check if there are more pages using X-Total header (fixes off-by-one bug)
      const totalHeader = response.headers.get('X-Total');
      const total = totalHeader ? parseInt(totalHeader, 10) : 0;
      const fetched = allDiscussions.length;
      hasMore = total > 0 && fetched < total;
      page += 1;
    }

    // Convert discussions to notes format with discussion_id populated
    const allNotes: GitLabNote[] = allDiscussions
      .filter((discussion) => discussion.notes.length > 0)
      .map((discussion) => {
        const note = discussion.notes[0];
        return {
          id: note.id,
          type: note.type,
          body: note.body,
          author: note.author,
          created_at: note.created_at,
          updated_at: note.updated_at,
          system: note.system,
          resolvable: note.resolvable,
          resolved: note.resolved,
          noteable_iid: note.noteable_iid,
          discussion_id: discussion.id, // THIS is why we use Discussions API!
        };
      });

    // Filter notes based on options
    const filteredNotes = filterNotes(allNotes, {
      inlineOnly: Boolean(argv['inline-only']),
      openOnly: Boolean(argv['open-only']),
    });

    // Output filtered notes to stdout for piping/parsing
    logger.data.json(filteredNotes);
  } catch (error) {
    if (error instanceof ValidationError) {
      logger.error('Configuration error', error, { details: error.details });
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
