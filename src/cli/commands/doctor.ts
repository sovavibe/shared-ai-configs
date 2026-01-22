import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import { platform } from 'os';
import { logger } from '../utils/logger.js';
import { loadConfig, CONFIG_DEFAULTS } from '../utils/config.js';
import type { Config } from '../types.js';

interface CheckResult {
  name: string;
  status: 'ok' | 'warn' | 'error';
  message: string;
  fix?: string; // Suggested fix command
}

// Platform detection
const PLATFORM = platform(); // 'darwin' | 'linux' | 'win32'
const IS_MACOS = PLATFORM === 'darwin';
const IS_LINUX = PLATFORM === 'linux';

export async function doctorCommand(): Promise<void> {
  logger.header('Checking dependencies and configuration');
  logger.info(`Platform: ${PLATFORM} (${IS_MACOS ? 'macOS' : IS_LINUX ? 'Linux' : 'Other'})`);
  logger.info('');

  const checks: CheckResult[] = [];
  let config: Config | null = null;

  // Try to load config for context-aware checks
  const configPath = join(process.cwd(), '.ai-project.yaml');
  if (existsSync(configPath)) {
    try {
      config = loadConfig(configPath);
    } catch {
      // Config will be checked separately
    }
  }

  // Core checks (always run)
  checks.push(checkNodeVersion());
  checks.push(checkPackageManager());
  checks.push(checkConfigFile());

  // IDE checks
  checks.push(checkClaudeCode());
  checks.push(checkCursor(config));

  // VCS CLI checks (based on config)
  const vcsType = config?.services?.vcs?.type;
  if (vcsType === 'github') {
    checks.push(checkGitHubCLI());
  } else if (vcsType === 'gitlab') {
    checks.push(checkGitLabCLI());
  } else if (!vcsType) {
    // No config - check both
    checks.push(checkGitHubCLI());
    checks.push(checkGitLabCLI());
  }

  // Task tracking checks
  const taskTracking = config?.services?.task_tracking?.type;
  const beadsPath =
    config?.services?.task_tracking?.paths?.beads ||
    CONFIG_DEFAULTS.services.task_tracking.paths.beads;
  if (taskTracking === 'beads' || existsSync(beadsPath)) {
    checks.push(checkBeads());
  }
  if (taskTracking === 'jira') {
    checks.push(checkJira(config));
  }

  // MCP checks (if any enabled)
  if (config?.services?.mcp) {
    checks.push(...checkMCPServers(config));
  }

  // Git check
  checks.push(checkGit());

  // Display results
  logger.info('');
  let hasErrors = false;
  let hasWarnings = false;

  for (const check of checks) {
    if (check.status === 'ok') {
      logger.success(`${check.name}: ${check.message}`);
    } else if (check.status === 'warn') {
      logger.warn(`${check.name}: ${check.message}`);
      if (check.fix) {
        logger.info(`  → Fix: ${check.fix}`);
      }
      hasWarnings = true;
    } else {
      logger.error(`${check.name}: ${check.message}`);
      if (check.fix) {
        logger.info(`  → Fix: ${check.fix}`);
      }
      hasErrors = true;
    }
  }

  logger.info('');

  if (hasErrors) {
    logger.error('Some checks failed. Please fix the issues above.');
    process.exit(1);
  } else if (hasWarnings) {
    logger.warn('Some checks have warnings. Consider reviewing them.');
  } else {
    logger.success('All checks passed!');
  }
}

function checkNodeVersion(): CheckResult {
  try {
    const version = process.version;
    const major = parseInt(version.slice(1).split('.')[0], 10);

    if (major < 18) {
      return {
        name: 'Node.js',
        status: 'error',
        message: `Version ${version} is too old. Requires Node.js 18+`,
      };
    }

    return {
      name: 'Node.js',
      status: 'ok',
      message: version,
    };
  } catch {
    return {
      name: 'Node.js',
      status: 'error',
      message: 'Not found',
    };
  }
}

function checkPackageManager(): CheckResult {
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
    return {
      name: 'npm',
      status: 'ok',
      message: `v${npmVersion}`,
    };
  } catch {
    return {
      name: 'npm',
      status: 'error',
      message: 'Not found',
    };
  }
}

function checkConfigFile(): CheckResult {
  const configPath = join(process.cwd(), '.ai-project.yaml');

  if (existsSync(configPath)) {
    return {
      name: 'Config',
      status: 'ok',
      message: '.ai-project.yaml found',
    };
  }

  return {
    name: 'Config',
    status: 'warn',
    message: '.ai-project.yaml not found. Run: npx shared-ai-configs init',
  };
}

function checkClaudeCode(): CheckResult {
  try {
    const version = execSync('claude --version', { encoding: 'utf-8' }).trim();
    return {
      name: 'Claude Code',
      status: 'ok',
      message: version,
    };
  } catch {
    return {
      name: 'Claude Code',
      status: 'warn',
      message: 'Not installed. Install: npm install -g @anthropics/claude-code',
    };
  }
}

function checkCursor(config: Config | null): CheckResult {
  const cursorPath =
    config?.services?.ide?.paths?.cursor || CONFIG_DEFAULTS.services.ide.paths.cursor;

  if (existsSync(cursorPath)) {
    return {
      name: 'Cursor',
      status: 'ok',
      message: `${cursorPath} directory found`,
    };
  }

  return {
    name: 'Cursor',
    status: 'warn',
    message: `${cursorPath} directory not found`,
    fix: `mkdir -p ${cursorPath}`,
  };
}

function checkBeads(): CheckResult {
  try {
    const result = execSync('bd --version', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    return {
      name: 'Beads',
      status: 'ok',
      message: result || 'installed',
    };
  } catch {
    return {
      name: 'Beads',
      status: 'warn',
      message: '.beads directory found but bd command not available',
      fix: 'npm install -g @anthropic/beads',
    };
  }
}

function checkGitHubCLI(): CheckResult {
  try {
    const version = execSync('gh --version', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] })
      .split('\n')[0]
      .trim();
    return {
      name: 'GitHub CLI (gh)',
      status: 'ok',
      message: version,
    };
  } catch {
    return {
      name: 'GitHub CLI (gh)',
      status: 'warn',
      message: 'Not installed',
      fix: IS_MACOS ? 'brew install gh' : 'sudo apt install gh',
    };
  }
}

function checkGitLabCLI(): CheckResult {
  try {
    const version = execSync('glab --version', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    })
      .split('\n')[0]
      .trim();
    return {
      name: 'GitLab CLI (glab)',
      status: 'ok',
      message: version,
    };
  } catch {
    return {
      name: 'GitLab CLI (glab)',
      status: 'warn',
      message: 'Not installed',
      fix: IS_MACOS ? 'brew install glab' : 'sudo apt install glab',
    };
  }
}

function checkGit(): CheckResult {
  try {
    const version = execSync('git --version', { encoding: 'utf-8' }).trim();
    return {
      name: 'Git',
      status: 'ok',
      message: version,
    };
  } catch {
    return {
      name: 'Git',
      status: 'error',
      message: 'Not installed',
      fix: IS_MACOS ? 'xcode-select --install' : 'sudo apt install git',
    };
  }
}

function checkJira(config: Config | null): CheckResult {
  const integrationMode = config?.services?.task_tracking?.integration_mode || 'cli';

  if (integrationMode === 'cli') {
    // Check jira-cli
    try {
      execSync('which jira', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });

      // Check if authenticated
      try {
        execSync('jira me', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'], timeout: 10000 });
        return {
          name: 'Jira CLI',
          status: 'ok',
          message: 'Installed and authenticated',
        };
      } catch {
        return {
          name: 'Jira CLI',
          status: 'warn',
          message: 'Installed but not authenticated',
          fix: 'jira init',
        };
      }
    } catch {
      return {
        name: 'Jira CLI',
        status: 'warn',
        message: 'Not installed (integration_mode: cli)',
        fix: IS_MACOS
          ? 'brew install jira-cli'
          : 'go install github.com/ankitpokhrel/jira-cli/cmd/jira@latest',
      };
    }
  } else {
    // Check mcp-atlassian requirements
    try {
      execSync('which uvx', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });

      // Check env vars
      const hasJiraUrl = !!process.env.JIRA_URL;
      const hasJiraUser = !!process.env.JIRA_USERNAME;
      const hasJiraToken = !!process.env.JIRA_API_TOKEN;

      if (hasJiraUrl && hasJiraUser && hasJiraToken) {
        return {
          name: 'Jira MCP',
          status: 'ok',
          message: 'uvx installed, environment configured',
        };
      }

      const missing: string[] = [];
      if (!hasJiraUrl) missing.push('JIRA_URL');
      if (!hasJiraUser) missing.push('JIRA_USERNAME');
      if (!hasJiraToken) missing.push('JIRA_API_TOKEN');

      return {
        name: 'Jira MCP',
        status: 'warn',
        message: `uvx installed, missing: ${missing.join(', ')}`,
        fix: 'Add to .env.development.local',
      };
    } catch {
      return {
        name: 'Jira MCP',
        status: 'warn',
        message: 'uvx not installed (integration_mode: mcp)',
        fix: IS_MACOS ? 'brew install uv' : 'pip install uv',
      };
    }
  }
}

function checkMCPServers(config: Config): CheckResult[] {
  const results: CheckResult[] = [];
  const mcp = config.services?.mcp as Record<string, { enabled?: boolean }> | undefined;

  if (!mcp) return results;

  // MCP services with their required env vars
  const mcpChecks: { name: string; key: string; envVar?: string; checkCommand?: string }[] = [
    { name: 'Hindsight', key: 'hindsight' },
    { name: 'Snyk', key: 'snyk', envVar: 'SNYK_TOKEN', checkCommand: 'snyk --version' },
    { name: 'Context7', key: 'context7' },
    { name: 'Memory Bank', key: 'memory_bank' },
    { name: 'Figma', key: 'figma', envVar: 'FIGMA_API_KEY' },
    { name: 'Browser', key: 'browser' },
  ];

  for (const check of mcpChecks) {
    if (mcp[check.key]?.enabled) {
      // Check env var if required
      if (check.envVar) {
        const hasEnvVar = !!process.env[check.envVar];
        if (!hasEnvVar) {
          results.push({
            name: `MCP: ${check.name}`,
            status: 'warn',
            message: `Enabled but ${check.envVar} not set`,
            fix: `export ${check.envVar}="your-token" # Add to ~/.zshrc or .env.local`,
          });
          continue;
        }
      }

      // Check CLI if applicable
      if (check.checkCommand) {
        try {
          execSync(check.checkCommand, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
          results.push({
            name: `MCP: ${check.name}`,
            status: 'ok',
            message: check.envVar ? `Enabled, ${check.envVar} set` : 'Enabled and CLI available',
          });
        } catch {
          results.push({
            name: `MCP: ${check.name}`,
            status: 'warn',
            message: 'Enabled but CLI not found (may still work via MCP)',
            fix: check.key === 'snyk' ? 'npm install -g snyk' : undefined,
          });
        }
      } else {
        results.push({
          name: `MCP: ${check.name}`,
          status: 'ok',
          message: check.envVar ? `Enabled, ${check.envVar} set` : 'Enabled in config',
        });
      }
    }
  }

  return results;
}
