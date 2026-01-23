// TODO(VP-376): Delete this file when GitLab supports MCP
/**
 * GitLab API client using GitBeaker
 * Replaces custom fetch() calls with typed GitBeaker client
 */

import { Gitlab } from '@gitbeaker/rest';

import { getGitLabConfig } from './config.js';

/**
 * Get GitLab API client instance
 * @returns Configured GitLab client
 */
export function getGitLabClient(): Gitlab {
  const config = getGitLabConfig();

  return new Gitlab({
    host: config.url,
    token: config.token,
  });
}

/**
 * Get project ID from project path (group/project)
 * Encodes project path for use in GitLab API
 *
 * @param project - Project path in format "group/project"
 * @returns Encoded project ID
 */
export function getProjectId(project: string): string {
  // Don't encode - GitLab API expects plain project path (e.g., "group/project")
  return project;
}

/**
 * GitLab API response types
 */
export interface GitLabNote {
  id: number;
  type: string | null;
  body: string;
  resolvable: boolean;
  resolved: boolean | null;
  author: {
    id: number;
    username: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
  position?: {
    new_path?: string;
    old_path?: string;
    new_line?: number;
    old_line?: number;
  };
}

export interface GitLabDiscussion {
  id: string;
  individual_note: boolean;
  notes: GitLabNote[];
}

/**
 * Fetch MR discussions from GitLab API
 * Uses direct fetch for GitLab Community Edition 15.x compatibility
 *
 * @param mrNumber - Merge request number
 * @param pageNumber - Page number (default: 1)
 * @param perPage - Items per page (default: 100)
 * @returns Array of discussions
 */
export async function fetchMRDiscussions(
  mrNumber: number,
  pageNumber: number = 1,
  perPage: number = 100
): Promise<GitLabDiscussion[]> {
  const config = getGitLabConfig();
  const projectId = encodeURIComponent(config.project);
  const url = `${config.url}/api/v4/projects/${projectId}/merge_requests/${mrNumber}/discussions?per_page=${perPage}&page=${pageNumber}`;

  const response = await fetch(url, {
    headers: {
      'PRIVATE-TOKEN': config.token,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`GitLab API error: HTTP ${response.status} - ${errorText}`);
  }

  return (await response.json()) as GitLabDiscussion[];
}

/**
 * Raw response type for pagination support
 */
export interface FetchMRDiscussionsRawResponse {
  data: GitLabDiscussion[];
  headers: Record<string, string>;
}

/**
 * Fetch MR discussions from GitLab API with raw response headers
 * Returns both data and headers for proper pagination support using X-Total header
 *
 * @param mrNumber - Merge request number
 * @param pageNumber - Page number (default: 1)
 * @param perPage - Items per page (default: 100)
 * @returns Object containing data array and response headers
 */
export async function fetchMRDiscussionsRaw(
  mrNumber: number,
  pageNumber: number = 1,
  perPage: number = 100
): Promise<FetchMRDiscussionsRawResponse> {
  const config = getGitLabConfig();
  const projectId = encodeURIComponent(config.project);
  const url = `${config.url}/api/v4/projects/${projectId}/merge_requests/${mrNumber}/discussions?per_page=${perPage}&page=${pageNumber}`;

  const response = await fetch(url, {
    headers: {
      'PRIVATE-TOKEN': config.token,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`GitLab API error: HTTP ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as GitLabDiscussion[];

  // Extract pagination headers (GitLab uses lowercase header names)
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return { data, headers };
}
