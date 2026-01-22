import ejs from 'ejs';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';
import type { Config } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to templates (relative to compiled dist/)
const templatesDir = join(__dirname, '../../../templates');

export interface TemplateContext extends Config {
  // Helper functions available in templates
  hasMcp: (name: string) => boolean;
  isVcs: (type: string) => boolean;
  hasFeature: (feature: string) => boolean;
  isTaskTracking: (type: string) => boolean;
  // Orchestration config (for perles templates)
  orchestration: {
    client: string;
    claude: { model: string };
    codex: { model: string };
  };
}

function createTemplateContext(config: Config): TemplateContext {
  // Ensure all commonly used properties exist with defaults
  // This prevents "variable is not defined" errors in templates

  // Build services with nested defaults (deep merge for null-safety in templates)
  const services = {
    vcs: { type: 'none' as const, main_branch: 'main', ...config.services?.vcs },
    task_tracking: { type: 'none' as const, key_prefix: '', ...config.services?.task_tracking },
    mcp: {
      hindsight: { enabled: false },
      snyk: { enabled: false },
      context7: { enabled: false },
      memory_bank: { enabled: false },
      figma: { enabled: false },
      browser: { enabled: false },
      ...config.services?.mcp,
    },
    ide: {
      primary: 'Cursor' as const,
      secondary: 'none' as const,
      dual_mode: false,
      paths: { claude: '.claude/', cursor: '.cursor/' },
      ...config.services?.ide,
    },
    ...config.services,
  };

  // Determine task tracking commands based on type
  const taskType = services.task_tracking?.type || 'none';
  const taskCommands =
    taskType === 'beads'
      ? {
          task_create: 'bd create',
          task_close: 'bd close',
          task_ready: 'bd ready',
          task_update: 'bd update',
          task_show: 'bd show',
          task_sync: 'bd sync --flush-only',
        }
      : taskType === 'jira'
        ? {
            task_create: 'jira create',
            task_close: 'jira close',
            task_ready: 'jira list --status=ready',
            task_update: 'jira update',
            task_show: 'jira show',
            task_sync: 'jira sync',
          }
        : taskType === 'linear'
          ? {
              task_create: 'linear issue create',
              task_close: 'linear issue close',
              task_ready: 'linear issue list --status=todo',
              task_update: 'linear issue update',
              task_show: 'linear issue view',
              task_sync: 'linear sync',
            }
          : taskType === 'github-issues'
            ? {
                task_create: 'gh issue create',
                task_close: 'gh issue close',
                task_ready: 'gh issue list --state=open',
                task_update: 'gh issue edit',
                task_show: 'gh issue view',
                task_sync: 'gh issue list --json number,title,state',
              }
            : {
                task_create: '',
                task_close: '',
                task_ready: '',
                task_update: '',
                task_show: '',
                task_sync: '',
              };

  return {
    // Spread config first
    ...config,
    // Ensure these always exist (even if undefined/empty)
    project: config.project || { name: 'Project' },
    stack: config.stack || { type: 'react' },
    commands: { ...taskCommands, ...config.commands },
    services,
    options: config.options || {},
    rules: config.rules || { never: [], always: [], custom: [] },
    languages: config.languages || { chat: 'English', code: 'English' },
    architecture: config.architecture || {},
    generation: config.generation || {},
    // Orchestration config (for perles templates)
    orchestration: {
      client: 'claude',
      claude: { model: 'sonnet' },
      codex: { model: 'gpt-5.2-codex' },
    },
    // Helper functions
    hasMcp: (name: string) => {
      const mcp = config.services?.mcp as Record<string, { enabled?: boolean }> | undefined;
      return mcp?.[name]?.enabled ?? false;
    },
    isVcs: (type: string) => config.services?.vcs?.type === type,
    isTaskTracking: (type: string) => config.services?.task_tracking?.type === type,
    hasFeature: (feature: string) => {
      const options = config.options as unknown as Record<string, unknown>;
      return options?.[feature] === true;
    },
  };
}

export async function renderTemplate(templateName: string, config: Config): Promise<string> {
  const templatePath = join(templatesDir, templateName);

  if (!existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  const template = readFileSync(templatePath, 'utf-8');
  const context = createTemplateContext(config);

  try {
    const result = ejs.render(template, context, {
      filename: templatePath, // For includes
      rmWhitespace: false, // Preserve formatting
    });

    // Clean up extra blank lines (more than 2 consecutive)
    return result.replace(/\n{3,}/g, '\n\n');
  } catch (error) {
    const err = error as Error;
    throw new Error(`Template rendering error in ${templateName}: ${err.message}`);
  }
}

export function listTemplates(): string[] {
  const pattern = join(templatesDir, '**/*.ejs');
  return globSync(pattern).map((p: string) => p.replace(templatesDir + '/', ''));
}

export function getTemplateOutputPath(templateName: string): string {
  // Remove .ejs extension
  return templateName.replace(/\.ejs$/, '');
}
