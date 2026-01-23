/**
 * Configuration validation module using Zod
 * Following nodejs-env-config.mdc patterns
 *
 * Validates environment variables and provides typed configuration
 * instead of direct process.env access
 */

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import dotenv from 'dotenv';
import { z } from 'zod';

import { ValidationError } from './errors.js';

/**
 * Load environment variables in order of priority (lowest to highest)
 */
export function loadEnvFiles(): void {
  // 1. .env (base) - loaded first
  dotenv.config();

  // 2. .env.development (dev defaults) - loaded second, doesn't override .env
  if (existsSync(resolve(process.cwd(), '.env.development'))) {
    dotenv.config({ path: resolve(process.cwd(), '.env.development'), override: false });
  }

  // 3. .env.development.local (local overrides) - loaded last, overrides all files
  if (existsSync(resolve(process.cwd(), '.env.development.local'))) {
    dotenv.config({ path: resolve(process.cwd(), '.env.development.local'), override: true });
  }
}

// Load env files on module import
loadEnvFiles();

/**
 * GitLab configuration schema using Zod
 */
const GitLabConfigSchema = z.object({
  token: z.string().min(1, 'GITLAB_TOKEN is required'),
  url: z.url({ error: 'GITLAB_URL must be a valid URL' }).default('https://gitlab.eurochem.ru'),
  project: z
    .string()
    .regex(/^[^/]+\/[^/]+$/, 'GITLAB_PROJECT must be in format: group/project')
    .default('customer-portal/front'),
});

export type GitLabConfig = z.infer<typeof GitLabConfigSchema>;

/**
 * Validate GitLab configuration from environment variables
 *
 * @throws {ValidationError} if required variables are missing or invalid
 */
export function getGitLabConfig(): GitLabConfig {
  const rawConfig = {
    token: process.env.GITLAB_TOKEN,
    url: process.env.GITLAB_URL,
    project: process.env.GITLAB_PROJECT,
  };

  const result = GitLabConfigSchema.safeParse(rawConfig);

  if (!result.success) {
    const errors = result.error.issues
      .map((err) => `${err.path.map(String).join('.')}: ${err.message}`)
      .join(', ');
    const details: Record<string, string> = {};

    if (!rawConfig.token) {
      details.hint = 'See docs/gitlab-setup.md for GitLab setup instructions';
    }

    throw new ValidationError(`Invalid GitLab configuration: ${errors}`, details);
  }

  return result.data;
}

/**
 * Jira configuration schema using Zod
 * Can be read from bd config or environment variables
 */
const JiraConfigSchema = z.object({
  url: z.url({ error: 'JIRA_URL must be a valid URL' }),
  project: z.string().min(1, 'JIRA_PROJECT is required'),
  username: z.string().min(1, 'JIRA_USERNAME is required'),
  apiToken: z.string().min(1, 'JIRA_API_TOKEN is required'),
  // Optional: JQL query (defaults to project = {project})
  jql: z.string().optional(),
});

export type JiraConfig = z.infer<typeof JiraConfigSchema>;

/**
 * Get Jira configuration from bd config or environment variables
 * Tries bd config first, then falls back to environment variables
 *
 * @throws {ValidationError} if required variables are missing or invalid
 */
export function getJiraConfig(): JiraConfig {
  // Try to get from bd config first
  let url: string | undefined;
  let project: string | undefined;
  let username: string | undefined;
  let apiToken: string | undefined;
  let jql: string | undefined;

  try {
    // Check if bd is available via BD_PATH or PATH
    const bdCommand = process.env.BD_PATH || 'bd';
    execSync(`"${bdCommand}" --version`, { stdio: 'ignore' });

    // Try to get config from bd (synchronous)
    const getBdConfig = (key: string): string | undefined => {
      try {
        const stdout = execSync(`"${bdCommand}" config get --json ${key}`, {
          encoding: 'utf-8',
          timeout: 5000,
        });
        const data = JSON.parse(stdout) as { value?: string };
        return typeof data.value === 'string' ? data.value : undefined;
      } catch {
        return undefined;
      }
    };

    url = getBdConfig('jira.url');
    project = getBdConfig('jira.project');
    username = getBdConfig('jira.username');
    apiToken = getBdConfig('jira.api_token');
    jql = getBdConfig('jira.jql');
  } catch {
    // bd not available, use environment variables
  }

  // Fallback to environment variables
  // Support both naming conventions: JIRA_URL/JIRA_BASE_URL, JIRA_API_TOKEN/JIRA_TOKEN
  const rawConfig = {
    url: url || process.env.JIRA_URL || process.env.JIRA_BASE_URL,
    project: project || process.env.JIRA_PROJECT,
    username: username || process.env.JIRA_USERNAME,
    apiToken: apiToken || process.env.JIRA_API_TOKEN || process.env.JIRA_TOKEN,
    jql: jql || process.env.JIRA_JQL,
  };

  const result = JiraConfigSchema.safeParse(rawConfig);

  if (!result.success) {
    const errors = result.error.issues
      .map((err) => `${err.path.map(String).join('.')}: ${err.message}`)
      .join(', ');
    const details: Record<string, string> = {};

    if (!rawConfig.apiToken) {
      details.hint =
        'Set JIRA_API_TOKEN env var or run: bd config set jira.api_token "YOUR_TOKEN"\n' +
        'For Jira Cloud, create a token at: https://id.atlassian.com/manage-profile/security/api-tokens';
    }
    if (!rawConfig.username) {
      details.hint =
        (details.hint || '') +
        '\nSet JIRA_USERNAME env var or run: bd config set jira.username "your_email@example.com"';
    }

    throw new ValidationError(`Invalid Jira configuration: ${errors}`, details);
  }

  return result.data;
}
