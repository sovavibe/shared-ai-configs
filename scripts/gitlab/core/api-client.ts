#!/usr/bin/env node --experimental-strip-types
// TODO(VP-376): Delete this file when GitLab supports MCP
// TODO(VP-389): Remove gitbeaker-types.ts when GitBeaker types updated
// Tracked in Beads: VP-zhgs (Delete GitLab scripts), VP-pgaa (Remove gitbeaker-types.ts)
/**
 * Centralized GitLab API client
 *
 * Provides unified interface for all GitLab API operations.
 * Supports GitLab Community Edition 15.x (no MCP support).
 *
 * ## API Usage Standard
 *
 * When to use each approach:
 *
 * | Approach | Use For | Examples |
 * |----------|---------|----------|
 * | **GitBeaker** | Standard operations with good type support | getMR, createNote, addNote |
 * | **Direct fetch** | CE 15.x compatibility gaps, custom endpoints | createInlineComment, Notes API |
 * | **Notes API** | Real-time unresolved/resolved status | getUnresolvedNotes |
 *
 * ### Why Notes API over Discussions API?
 * - Discussions API caches data and may show stale `resolved` status
 * - Notes API provides real-time status (preferred for validation)
 *
 * ## Architecture
 * - Uses direct fetch for operations not supported by GitBeaker
 * - Uses GitBeaker client where available
 * - Applies SOLID, KISS, DRY principles
 *
 * Usage:
 *   import { GitLabApiClient } from './api-client.js'
 *   const client = new GitLabApiClient()
 *   await client.getMR(321)
 */

import { getGitLabConfig } from '../../shared/config.js'
import { ExternalServiceError } from '../../shared/errors.js'
import { getGitLabClient, getProjectId, type GitLabDiscussion } from '../../shared/gitlab-client.js'

import { getTypedMergeRequestDiscussions } from './gitbeaker-types.js'

/**
 * Options for creating inline comment
 */
export interface InlineCommentOptions {
  mr: number
  file: string
  line: number
  side: 'new' | 'old'
  body: string
  baseSha?: string
  startSha?: string
  headSha?: string
}

/**
 * Position object for inline comments
 */
interface Position {
  position_type: 'text'
  base_sha: string
  start_sha: string
  head_sha: string
  new_path: string
  old_path?: string
  new_line?: number
  old_line?: number
}

/**
 * MR details response
 */
export interface MRDetails {
  id: number
  iid: number
  title: string
  description: string
  state: string
  diff_refs?: {
    base_sha: string
    start_sha: string
    head_sha: string
  }
  sha?: string
}

/**
 * Centralized GitLab API client
 *
 * Provides unified interface for all GitLab API operations.
 * Combines GitBeaker (where available) with direct fetch (for CE 15.x compatibility).
 */
export class GitLabApiClient {
  private readonly config: ReturnType<typeof getGitLabConfig>

  private readonly projectId: string

  private readonly encodedProjectId: string

  /**
   * Get project ID (for external use)
   */
  public getProjectId(): string {
    return this.projectId
  }

  /**
   * Get encoded project ID (for external use)
   */
  public getEncodedProjectId(): string {
    return this.encodedProjectId
  }

  /**
   * Get GitLab API URL (for external use)
   */
  public getUrl(): string {
    return this.config.url
  }

  /**
   * Get GitLab API token (for external use)
   */
  public getToken(): string {
    return this.config.token
  }

  constructor() {
    this.config = getGitLabConfig()
    this.projectId = getProjectId(this.config.project)
    this.encodedProjectId = encodeURIComponent(this.projectId)
  }

  /**
   * Get MR details
   * Uses GitBeaker for typed response
   */
  async getMR(mrId: number): Promise<MRDetails> {
    const api = getGitLabClient()

    try {
      const mr = (await api.MergeRequests.show(this.projectId, mrId)) as MRDetails
      return mr
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new ExternalServiceError('GitLab', `Failed to fetch MR details: ${errorMessage}`)
    }
  }

  /**
   * Get MR SHAs (base, start, head)
   * Extracts SHAs from MR details
   */
  async getMRSHAs(mrId: number): Promise<{ baseSha: string; startSha: string; headSha: string }> {
    const mr = await this.getMR(mrId)

    const diffRefs = mr.diff_refs
    const baseSha = diffRefs?.base_sha || mr.sha || ''
    const startSha = diffRefs?.start_sha || mr.sha || ''
    const headSha = diffRefs?.head_sha || mr.sha || ''

    return { baseSha, startSha, headSha }
  }

  /**
   * Get unresolved discussions from MR
   * Uses existing fetchMRDiscussionsRaw from shared/gitlab-client.ts
   *
   * NOTE: For real-time validation, prefer Notes API via getUnresolvedNotes()
   */
  async getUnresolvedDiscussions(mrId: number): Promise<GitLabDiscussion[]> {
    const { fetchMRDiscussionsRaw } = await import('../../shared/gitlab-client.js')

    const allDiscussions: GitLabDiscussion[] = []
    let page = 1
    let hasMore = true
    let totalFetched = 0
    let total = 0

    while (hasMore) {
      const response = await fetchMRDiscussionsRaw(mrId, page)
      const discussions = response.data
      allDiscussions.push(...discussions)
      totalFetched += discussions.length

      // Use X-Total header if available (fixes off-by-one bug when last page has exactly 100 items)
      if (response.headers?.['x-total']) {
        total = parseInt(response.headers['x-total'], 10)
        hasMore = total > 0 && totalFetched < total
      } else {
        // Fallback: check if we received a full page
        hasMore = discussions.length === 100
      }

      page += 1
    }

    // Filter unresolved discussions
    return allDiscussions.filter((discussion) => {
      const note = discussion.notes[0]
      if (!note) return false
      if (!note.resolvable) return false
      return note.resolved !== true
    })
  }

  /**
   * Validate Discussion ID before replying (prevents 404 errors)
   * Uses Discussions API for validation (Notes API doesn't return discussion_id)
   *
   * Returns: { valid: boolean, reason?: string }
   */
  async validateDiscussionId(mrId: number, discussionId: string): Promise<{ valid: boolean; reason?: string }> {
    const encodedProjectId = this.encodedProjectId
    const url = this.config.url
    const token = this.config.token

    // Fetch discussions using Discussions API (Notes API doesn't return discussion_id!)
    const discussionsUrl = `${url}/api/v4/projects/${encodedProjectId}/merge_requests/${mrId}/discussions?per_page=100`

    try {
      const response = await fetch(discussionsUrl, {
        headers: { 'PRIVATE-TOKEN': token },
      })

      if (!response.ok) {
        return { valid: false, reason: `GitLab API error: ${response.status}` }
      }

      const discussions = (await response.json()) as Array<{
        id: string
        notes: Array<{
          resolvable: boolean
          resolved: boolean | null
        }>
      }>

      // Filter for unresolved, resolvable discussions
      const unresolvedDiscussions = discussions.filter((d) => {
        const note = d.notes[0]
        return note?.resolvable && note?.resolved !== true
      })

      // Check if discussion ID exists in unresolved discussions
      const isValid = unresolvedDiscussions.some((d) => d.id === discussionId)

      if (!isValid) {
        return {
          valid: false,
          reason: 'Discussion ID not found in unresolved discussions (may be resolved or invalid)',
        }
      }

      return { valid: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return { valid: false, reason: `Validation failed: ${errorMessage}` }
    }
  }

  /**
   * Reply to discussion thread
   * Uses GitBeaker MergeRequestDiscussions.addNote with type-safe wrapper
   */
  async replyToThread(mrId: number, discussionId: string, body: string): Promise<void> {
    const api = getGitLabClient()
    const discussions = getTypedMergeRequestDiscussions(api)

    try {
      await discussions.addNote(this.projectId, mrId, discussionId, body)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new ExternalServiceError('GitLab', `Failed to reply to thread: ${errorMessage}`)
    }
  }

  /**
   * Create inline comment in MR
   * Uses direct fetch for GitLab CE 15.x compatibility
   */
  async createInlineComment(options: InlineCommentOptions): Promise<Record<string, unknown>> {
    // Get SHAs if not provided
    let { baseSha, startSha, headSha } = options

    if (!baseSha || !startSha || !headSha) {
      const shas = await this.getMRSHAs(options.mr)
      baseSha = baseSha || shas.baseSha
      startSha = startSha || shas.startSha
      headSha = headSha || shas.headSha
    }

    // Build position object
    const position: Position = {
      position_type: 'text',
      base_sha: baseSha,
      start_sha: startSha,
      head_sha: headSha,
      new_path: options.file,
    }

    // Add line based on side
    if (options.side === 'new') {
      position.new_line = options.line
    } else {
      position.old_path = options.file
      position.old_line = options.line
    }

    // Create discussion with inline comment
    const discussionUrl = `${this.config.url}/api/v4/projects/${this.encodedProjectId}/merge_requests/${options.mr}/discussions`

    const response = await fetch(discussionUrl, {
      method: 'POST',
      headers: {
        'PRIVATE-TOKEN': this.config.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body: options.body,
        position,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new ExternalServiceError('GitLab', `Failed to create inline comment: ${errorText}`)
    }

    return (await response.json()) as Record<string, unknown>
  }
}

/**
 * Get singleton instance of GitLabApiClient
 * Creates new instance on each call (stateless)
 */
export function getGitLabApiClient(): GitLabApiClient {
  return new GitLabApiClient()
}
