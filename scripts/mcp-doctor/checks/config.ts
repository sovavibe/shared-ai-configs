/**
 * Check MCP configuration file
 */

import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

import { logSuccess, logError, logWarning, logSection, directLog, logInfo } from '../utils/logger.js';

/**
 * Check MCP configuration file
 */
export function checkMcpConfig(): boolean {
  logSection('2️⃣ Checking MCP Configuration');

  const mcpConfigPath = path.join(process.env.HOME || '~', '.cursor', 'mcp.json');

  if (existsSync(mcpConfigPath)) {
    logSuccess(`MCP config exists: ${mcpConfigPath}`);

    try {
      const config = JSON.parse(readFileSync(mcpConfigPath, 'utf8')) as { mcpServers?: Record<string, unknown> };
      const servers = Object.keys(config.mcpServers || {});

      if (servers.length > 0) {
        logSuccess(`Configured servers: ${servers.length}`);
        logInfo(servers.map((s) => `     - ${s}`).join('\n'));

        // Check for required servers (with or without user- prefix)
        const requiredServers = [
          { withPrefix: 'user-allpepper-memory-bank', withoutPrefix: 'allpepper-memory-bank' },
          { withPrefix: 'user-hindsight-alice', withoutPrefix: 'hindsight-alice' },
          { withPrefix: 'user-MCP_DOCKER', withoutPrefix: 'MCP_DOCKER' },
        ];

        const missingServers = requiredServers.filter(
          ({ withPrefix, withoutPrefix }) => !servers.includes(withPrefix) && !servers.includes(withoutPrefix)
        );

        if (missingServers.length > 0) {
          const missingNames = missingServers.map(({ withPrefix }) => withPrefix).join(', ');
          logWarning(`Missing required servers: ${missingNames}`);
          directLog('   Copy template: cp .cursor/mcp.json.sample ~/.cursor/mcp.json\n');
          return false;
        }

        return true;
      } else {
        logWarning('No servers configured in MCP config');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logError(`Failed to parse MCP config: ${errorMessage}`);
      directLog('   Fix JSON syntax or recreate from template:');
      directLog('   cp .cursor/mcp.json.sample ~/.cursor/mcp.json\n');
      return false;
    }
  } else {
    logError(`MCP config not found: ${mcpConfigPath}`);
    directLog('   Create from project template:');
    directLog('   cp .cursor/mcp.json.sample ~/.cursor/mcp.json\n');
    return false;
  }
}
