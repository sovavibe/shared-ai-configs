/**
 * Check Hindsight Alice server and Memory Bank
 */

import { execSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'

import { logSuccess, logWarning, logInfo, logSection, directLog } from '../utils/logger.js'

/**
 * Check Hindsight Alice server
 */
export function checkHindsightAlice(): boolean {
  logSection('4️⃣ Checking Hindsight Alice Server')

  try {
    const response = execSync('curl -s http://localhost:8888/mcp/alice/', {
      stdio: 'pipe',
      timeout: 5000,
    }).toString()

    logSuccess('Hindsight Alice server is running on port 8888')
    logInfo(`Response: ${response.substring(0, 100)}${response.length > 100 ? '...' : ''}\n`)
    return true
  } catch (error) {
    logWarning('Hindsight Alice server is not running on port 8888')
    directLog('   This is required for reflection and pattern learning.')
    directLog('   Setup instructions:')
    directLog('   1. Clone Hindsight Alice repository')
    directLog('   2. Follow setup instructions in docs/guides/mcp-setup.md')
    directLog('   3. Start server: npm run start:hindsight-alice\n')
    return false
  }
}

/**
 * Check Memory Bank directory
 */
export function checkMemoryBank(): boolean {
  logSection('5️⃣ Checking Memory Bank Directory')

  const memoryBankPath = path.join(process.cwd(), 'memory-bank')

  if (existsSync(memoryBankPath)) {
    logSuccess(`Memory Bank directory exists: ${memoryBankPath}`)

    const files = readdirSync(memoryBankPath)
    const coreFiles = ['activeContext.md', 'progress.md', 'projectbrief.md', 'tasks.md']
    const missingFiles = coreFiles.filter((f) => !files.includes(f))

    if (files.length > 0) {
      logInfo(`Files (${files.length}): ${files.join(', ') || '(empty)'}`)
    } else {
      logInfo('Directory is empty (will be populated on first use)')
    }

    if (missingFiles.length > 0) {
      logWarning(`Missing core files: ${missingFiles.join(', ')}`)
      directLog('   These will be created automatically when you use MCP Memory Bank.\n')
    } else {
      logSuccess('All core Memory Bank files present\n')
    }

    return true
  } else {
    logWarning(`Memory Bank directory does not exist: ${memoryBankPath}`)
    directLog('Directory will be created automatically on first use.\n')
    return false
  }
}
