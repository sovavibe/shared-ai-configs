#!/usr/bin/env node

/**
 * Session Init Hook
 *
 * Runs when a new chat session starts.
 * Suggests loading Four Pillars context.
 */

const readline = require('readline')

async function main() {
  // Read input from stdin (hook payload)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  })

  let input = ''
  for await (const line of rl) {
    input += line
  }

  // Parse hook input (if any)
  let payload = {}
  try {
    if (input.trim()) {
      payload = JSON.parse(input)
    }
  } catch (e) {
    // Ignore parse errors
  }

  // Check BD_ENABLED from environment
  const bdEnabled = process.env.BD_ENABLED === '1' || process.env.BD_ENABLED === 'true'

  // Suggest context loading
  const beadsSection = bdEnabled
    ? `**Beads (BD_ENABLED=1):**
1. \`bd ready\` - Check available work
2. \`bd blocked\` - Check blocked tasks
3. Claim: \`bd update <id> --status=in_progress\`
4. Complete: \`bd close <id>\` + \`bd sync --flush-only\``
    : `**Beads:** BD_ENABLED not set, beads integration disabled`

  const response = {
    followup_message: `## Session Ready

${beadsSection}

**Context loaded from:**
- .cursorrules (project philosophy)
- .cursor/rules/ (auto-loaded by file type)

Ready to work!`,
  }

  console.log(JSON.stringify(response))
}

main().catch(console.error)
