/**
 * Check environment variables based on actual MCP configuration
 */

import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'

import { logSuccess, logError, logWarning, logSection, directLog } from '../utils/logger.js'

interface McpServer {
  url?: string
  command?: string
  headers?: Record<string, string>
  env?: Record<string, string>
}

interface McpConfig {
  mcpServers?: Record<string, McpServer>
}

/**
 * Determine which API keys are required based on MCP configuration
 */
function getRequiredApiKeys(): { context7: boolean; zai: boolean } {
  const mcpConfigPath = path.join(process.env.HOME || '~', '.cursor', 'mcp.json')

  if (!existsSync(mcpConfigPath)) {
    return { context7: false, zai: false }
  }

  try {
    const config = JSON.parse(readFileSync(mcpConfigPath, 'utf8')) as McpConfig
    const servers = Object.values(config.mcpServers || {})

    const needsContext7 = servers.some((serverConfig) => {
      const headers = serverConfig.headers || {}
      return (
        headers.CONTEXT7_API_KEY?.includes('${env:CONTEXT7_API_KEY}') ||
        headers.CONTEXT7_API_KEY?.includes('CONTEXT7_API_KEY')
      )
    })

    const needsZai = servers.some((serverConfig) => {
      const headers = serverConfig.headers || {}
      const env = serverConfig.env || {}

      return (
        headers.Authorization?.includes('${env:Z_AI_API_KEY}') ||
        headers.Authorization?.includes('Z_AI_API_KEY') ||
        env.Z_AI_API_KEY?.includes('${env:Z_AI_API_KEY}') ||
        env.Z_AI_API_KEY === '${env:Z_AI_API_KEY}'
      )
    })

    return { context7: needsContext7, zai: needsZai }
  } catch {
    // If config can't be parsed, don't assume any keys are needed
    return { context7: false, zai: false }
  }
}

/**
 * Check environment variables
 * Note: .env files are loaded in mcp-doctor.ts before this function is called
 */
export function checkEnvironmentVariables(): boolean {
  logSection('1️⃣ Checking Environment Variables')

  // Determine which keys are actually needed based on MCP config
  const { context7: needsContext7, zai: needsZai } = getRequiredApiKeys()

  const envVars: Array<{ name: string; required: boolean }> = [
    // GITLAB_TOKEN is always required
    { name: 'GITLAB_TOKEN', required: true },
    // CONTEXT7_API_KEY is required only if used in MCP config
    { name: 'CONTEXT7_API_KEY', required: needsContext7 },
    // Z_AI_API_KEY is required only if used in MCP config
    { name: 'Z_AI_API_KEY', required: needsZai },
    // Hindsight Alice LLM configuration (optional, for Hindsight Alice server)
    { name: 'HINDSIGHT_API_LLM_API_KEY', required: false },
    { name: 'HINDSIGHT_API_LLM_MODEL', required: false },
    { name: 'HINDSIGHT_API_LLM_BASE_URL', required: false },
  ]

  const results = envVars.map(({ name, required }) => {
    const envValue = process.env[name]
    if (envValue) {
      const displayValue = `${name}: SET (${envValue.substring(0, 8)}${envValue.length > 8 ? '...' : ''})`
      logSuccess(displayValue)
      return { name, required, isSet: true }
    }

    if (required) {
      logError(`${name}: NOT SET (REQUIRED)`)
      return { name, required, isSet: false }
    }

    // Show warning for optional keys (CONTEXT7_API_KEY, Z_AI_API_KEY) as "optional but recommended"
    // Don't show warning for Hindsight keys (they are always optional)
    if (!name.startsWith('HINDSIGHT_')) {
      logWarning(`${name}: NOT SET (optional but recommended)`)
    }

    return { name, required, isSet: false }
  })

  const requiredSet = results.every((result) => result.isSet || !result.required)
  const allSet = results.every((result) => result.isSet)

  if (!requiredSet) {
    directLog('\n   Critical: Required environment variables are missing.')
    directLog('   Add them to ~/.zshrc or ~/.bashrc and reload shell,')
    directLog('   or add to .env.development.local:\n')

    if (!process.env.GITLAB_TOKEN) {
      directLog('   export GITLAB_TOKEN="glpat-your-token-here"')
    }
    if (needsContext7 && !process.env.CONTEXT7_API_KEY) {
      directLog('   CONTEXT7_API_KEY="your-context7-key"')
    }
    if (needsZai && !process.env.Z_AI_API_KEY) {
      directLog('   Z_AI_API_KEY="your-zai-key"')
    }
    directLog('')
  } else if (!allSet) {
    directLog('\n   Optional environment variables are not set.')
    directLog('   Add them to .env.development.local for full MCP functionality:\n')
    if (!process.env.CONTEXT7_API_KEY) {
      directLog('   CONTEXT7_API_KEY="your-context7-key"')
    }
    if (!process.env.Z_AI_API_KEY) {
      directLog('   Z_AI_API_KEY="your-zai-key"')
    }
    directLog('   # Hindsight Alice LLM configuration (if using custom LLM):')
    directLog('   HINDSIGHT_API_LLM_API_KEY="your-llm-api-key"')
    directLog('   HINDSIGHT_API_LLM_MODEL="your-model"')
    directLog('   HINDSIGHT_API_LLM_BASE_URL="https://your-llm-api.com"\n')
  } else {
    directLog('\n')
  }

  return requiredSet
}
