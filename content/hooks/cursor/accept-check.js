#!/usr/bin/env node

/**
 * Accept Check Hook
 *
 * Validates changes before accepting AI suggestions.
 * Blocks modifications to generated code.
 */

const readline = require('readline')

async function main() {
  // Read input from stdin
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  })

  let input = ''
  for await (const line of rl) {
    input += line
  }

  // Parse hook input
  let payload = {}
  try {
    if (input.trim()) {
      payload = JSON.parse(input)
    }
  } catch (e) {
    // If can't parse, accept by default
    console.log(JSON.stringify({ result: 'accept' }))
    return
  }

  // Check for generated file modifications
  const changedFiles = payload.changed_files || payload.files || []
  const generatedPattern = /src\/shared\/api\/generated\//

  const blockedFiles = changedFiles.filter((f) => generatedPattern.test(f))

  if (blockedFiles.length > 0) {
    console.log(
      JSON.stringify({
        result: 'reject',
        message: `Cannot modify generated files:
${blockedFiles.map((f) => `  - ${f}`).join('\n')}

Use \`npm run codegen\` to regenerate API clients.
See: .cursor/rules/022-api-client.mdc`,
      })
    )
    return
  }

  // All checks passed
  console.log(JSON.stringify({ result: 'accept' }))
}

main().catch((err) => {
  console.error('Hook error:', err)
  // On error, accept to not block workflow
  console.log(JSON.stringify({ result: 'accept' }))
})
