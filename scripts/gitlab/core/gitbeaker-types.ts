/**
 * Type overrides for GitBeaker library
 *
 * GitBeaker types may not be up to date, so we create local type overrides
 * to avoid @typescript-eslint/no-explicit-any suppressions.
 *
 * TODO(VP-389): Remove this file when GitBeaker types are updated
 */

import type { Gitlab } from '@gitbeaker/rest'

/**
 * Type override for MergeRequestDiscussions.addNote method
 *
 * GitBeaker's MergeRequestDiscussions type may not include addNote method
 * or have incorrect signature. This override provides correct typing.
 */
export interface MergeRequestDiscussionsAddNote {
  (projectId: string, mrIid: number, discussionId: string, body: string): Promise<void>
}

/**
 * Type-safe wrapper for MergeRequestDiscussions
 */
export interface TypedMergeRequestDiscussions {
  addNote: MergeRequestDiscussionsAddNote
}

/**
 * Get typed MergeRequestDiscussions from GitLab client
 *
 * @param api - GitLab API client instance
 * @returns Typed MergeRequestDiscussions interface
 */
export function getTypedMergeRequestDiscussions(api: Gitlab): TypedMergeRequestDiscussions {
  return api.MergeRequestDiscussions as unknown as TypedMergeRequestDiscussions
}
