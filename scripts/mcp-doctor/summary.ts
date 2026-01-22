/**
 * Generate summary and recommendations
 */

import { log, directLog } from './utils/logger.js'
import { colors } from './utils/colors.js'

/**
 * Generate summary and recommendations
 */
export function generateSummary(results: Record<string, boolean>): boolean {
  directLog('📊 Summary')

  const totalChecks = Object.values(results).length
  const passedChecks = Object.values(results).filter((r) => r === true).length

  directLog(`Checks: ${passedChecks}/${totalChecks} passed\n`)

  if (passedChecks === totalChecks) {
    directLog('')
    log('✅ All MCP configuration checks passed!\n', colors.green)
    log('💡 Next steps:', colors.bold)
    directLog('   1. Restart Cursor IDE to reload MCP configuration')
    directLog('   2. Open MCP Tools panel (Cmd/Ctrl + Shift + M)')
    directLog('   3. Verify all servers are showing as "Connected"')
    directLog('   4. Test MCP servers in Cursor AI chat using @mcp/server-name')
    directLog('   For detailed usage, see: .cursor/commands/mcp/all-mcp.md\n')
  } else {
    directLog('')
    log('⚠️  Some checks failed. Please fix issues above.\n', colors.yellow)
    log('💡 Quick fixes:', colors.bold)
    directLog('   1. Set missing environment variables in ~/.zshrc')
    directLog('   2. Copy MCP config: cp .cursor/mcp.json.sample ~/.cursor/mcp.json')
    directLog('   3. Start Docker (for MCP Docker gateway)')
    directLog('   4. Start Hindsight Alice server (see docs/guides/mcp-setup.md)')
    directLog('   5. Run this script again after fixes: npm run mcp:doctor\n')
    directLog('   For troubleshooting, see: docs/guides/mcp-setup.md#troubleshooting\n')
  }

  return passedChecks === totalChecks
}
