/**
 * Check Docker status and MCP Gateway services
 */

import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

import {
  logSuccess,
  logError,
  logWarning,
  logSection,
  directLog,
  logInfo,
} from '../utils/logger.js';

/**
 * Check if docker mcp gateway command is available
 */
function isDockerMcpCommandAvailable(): boolean {
  try {
    execSync('docker mcp gateway --help', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check Docker MCP Gateway configuration
 * Returns which services are configured (Jira, Context7)
 */
function checkDockerMcpGatewayConfig(): { jira: boolean; context7: boolean } {
  const result = { jira: false, context7: false };

  // Check if docker mcp command exists
  if (!isDockerMcpCommandAvailable()) {
    return result;
  }

  // Check MCP config file
  const mcpConfigPath = path.join(process.env.HOME || '~', '.cursor', 'mcp.json');
  if (!existsSync(mcpConfigPath)) {
    return result;
  }

  try {
    const configContent = readFileSync(mcpConfigPath, 'utf8');
    const config = JSON.parse(configContent) as {
      mcpServers?: Record<string, unknown>;
    };

    // Check if user-MCP_DOCKER or MCP_DOCKER is configured
    const mcpDocker = config.mcpServers?.['user-MCP_DOCKER'] || config.mcpServers?.MCP_DOCKER;
    if (mcpDocker) {
      // Jira is provided by Docker MCP Gateway
      result.jira = true;

      // Context7 is available if CONTEXT7_API_KEY is set
      // (Docker MCP Gateway passes it through to Context7 service)
      if (process.env.CONTEXT7_API_KEY) {
        result.context7 = true;
      }
    }
  } catch {
    // Error reading or parsing config - ignore
  }

  return result;
}

/**
 * Check Docker status and MCP Gateway services
 */
export function checkDocker(): boolean {
  logSection('3️⃣ Checking Docker');

  try {
    const version = execSync('docker --version', { stdio: 'pipe' }).toString().trim();
    logSuccess(`Docker installed: ${version}`);

    // Check if Docker is running
    execSync('docker ps', { stdio: 'pipe' });
    logSuccess('Docker daemon is running');

    // Check Docker MCP Gateway
    directLog('');
    logInfo('Docker MCP Gateway:');

    if (isDockerMcpCommandAvailable()) {
      logSuccess('  ✅ docker mcp gateway command available');

      // Check configured services
      const services = checkDockerMcpGatewayConfig();

      if (services.jira) {
        logSuccess('  ✅ Jira service configured via Docker MCP Gateway');
      } else {
        logWarning('  ⚠️  Jira service not configured');
        directLog('     Add user-MCP_DOCKER to ~/.cursor/mcp.json');
      }

      if (services.context7) {
        logSuccess('  ✅ Context7 service configured via Docker MCP Gateway');
      } else {
        logWarning('  ⚠️  Context7 service not configured');
        directLog('     Set CONTEXT7_API_KEY environment variable');
      }
    } else {
      logWarning('  ⚠️  docker mcp gateway command not found');
      directLog('     Install: npm install -g @docker/mcp');
      directLog('     Or: docker plugin install docker/mcp');
    }

    directLog('');
    return true;
  } catch (error) {
    logError('Docker is not installed or not running');
    directLog('   Install Docker: https://docs.docker.com/get-docker/');
    directLog('   After installation, restart Docker Desktop\n');
    return false;
  }
}
