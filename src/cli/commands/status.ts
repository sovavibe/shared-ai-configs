import { existsSync, statSync, readdirSync } from 'fs';
import { join } from 'path';
import { logger } from '../utils/logger.js';
import { loadConfig, CONFIG_DEFAULTS } from '../utils/config.js';
import { detectStackType, getStackItemArray } from '../utils/stack-helpers.js';
import type { StatusOptions } from '../types.js';

export async function statusCommand(options: StatusOptions): Promise<void> {
  logger.header('Configuration Status');

  // Check config file
  if (!existsSync(options.config)) {
    logger.error(`Config file not found: ${options.config}`);
    logger.info('Run: npx shared-ai-configs init');
    process.exit(1);
  }

  const config = loadConfig(options.config);

  // Project info
  const stackType = config.stack.type ?? detectStackType(config.stack) ?? 'unknown';
  const frameworks = getStackItemArray(config.stack.framework).join(', ') || 'not set';

  logger.info('');
  logger.info('Project:');
  logger.table({
    Name: config.project.name,
    'Short name': config.project.short_name || config.project.name,
    Stack: stackType,
    Framework: frameworks,
    'Chat language': config.languages?.chat || CONFIG_DEFAULTS.languages.chat,
    'Code language': config.languages?.code || CONFIG_DEFAULTS.languages.code,
  });

  // Services
  logger.info('');
  logger.info('Services:');

  const services = config.services;
  logger.table({
    'IDE Primary': services?.ide?.primary || 'not set',
    'IDE Secondary': services?.ide?.secondary || 'none',
    VCS: services?.vcs?.type || 'none',
    'Task tracking': services?.task_tracking?.type || 'none',
  });

  // MCP Tools
  logger.info('');
  logger.info('MCP Tools:');
  const mcp = services?.mcp;
  logger.table({
    Hindsight: mcp?.hindsight?.enabled ? 'enabled' : 'disabled',
    Snyk: mcp?.snyk?.enabled ? 'enabled' : 'disabled',
    Context7: mcp?.context7?.enabled ? 'enabled' : 'disabled',
    'Memory Bank': mcp?.memory_bank?.enabled ? 'enabled' : 'disabled',
    Figma: mcp?.figma?.enabled ? 'enabled' : 'disabled',
    Browser: mcp?.browser?.enabled ? 'enabled' : 'disabled',
  });

  // Generated files status
  logger.info('');
  logger.info('Generated Files:');

  // Use config paths with CONFIG_DEFAULTS fallback - ensure string values
  const claudePath = services?.ide?.paths?.claude || CONFIG_DEFAULTS.services.ide.paths.claude;
  const cursorPath = services?.ide?.paths?.cursor || CONFIG_DEFAULTS.services.ide.paths.cursor;
  const beadsPath =
    services?.task_tracking?.paths?.beads || CONFIG_DEFAULTS.services.task_tracking.paths.beads;
  const perlesPath =
    services?.task_tracking?.paths?.perles || CONFIG_DEFAULTS.services.task_tracking.paths.perles;

  const files = [
    { path: 'CLAUDE.md', target: config.generation?.targets?.claude_md !== false },
    { path: cursorPath, target: config.generation?.targets?.cursor !== false },
    { path: claudePath, target: config.generation?.targets?.claude !== false },
    { path: beadsPath, target: config.generation?.targets?.beads === true },
    { path: perlesPath, target: config.generation?.targets?.perles === true },
  ];

  for (const file of files) {
    const fullPath = join(process.cwd(), file.path);
    const exists = existsSync(fullPath);
    const isDir = exists && statSync(fullPath).isDirectory();

    let status: string;
    if (!file.target) {
      status = 'disabled';
    } else if (exists) {
      if (isDir) {
        const count = readdirSync(fullPath).length;
        status = `✓ ${count} files`;
      } else {
        status = '✓ exists';
      }
    } else {
      status = '✗ missing';
    }

    logger.table({ [file.path]: status });
  }

  // Generation strategy
  logger.info('');
  logger.info('Generation:');
  logger.table({
    Strategy: config.generation?.strategy || CONFIG_DEFAULTS.generation.strategy,
  });

  // Recommendations
  const recommendations: string[] = [];

  if (!existsSync('CLAUDE.md')) {
    recommendations.push('Run: npx shared-ai-configs generate');
  }

  if (!existsSync(cursorPath)) {
    recommendations.push('Run: npx shared-ai-configs generate');
  }

  const taskTracking = services?.task_tracking;
  if (taskTracking?.type === 'beads') {
    if (!existsSync(beadsPath)) {
      recommendations.push('Initialize beads: bd init');
    }
  }

  if (recommendations.length > 0) {
    logger.info('');
    logger.warn('Recommendations:');
    logger.list([...new Set(recommendations)]); // Dedupe
  }
}
