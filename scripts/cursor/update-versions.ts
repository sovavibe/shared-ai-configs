#!/usr/bin/env node --experimental-strip-types
/**
 * Update version numbers in rules and prompts
 * Also adds version to files that don't have it
 *
 * Cross-platform TypeScript version of .cursor/scripts/update-versions.sh
 *
 * Usage:
 *   npm run cursor:update-versions
 *   npm run cursor:update-versions -- 2.0.0
 *
 * Requires: Node.js 24+ with TypeScript support
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { logger } from '../shared/logger.js'

/**
 * Recursively find all rule files (.mdc) in .cursor/rules directory
 */
function findRuleFiles(dir: string, fileList: string[] = []): string[] {
  try {
    const files = readdirSync(dir)

    for (const file of files) {
      const filePath = join(dir, file)
      const stat = statSync(filePath)

      if (stat.isDirectory()) {
        // Skip node_modules and other ignored directories
        if (file === 'node_modules' || file === '.git') {
          continue
        }
        findRuleFiles(filePath, fileList)
      } else if (file.endsWith('.mdc')) {
        fileList.push(filePath)
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error(`Failed to read directory: ${dir} - ${errorMessage}`)
  }

  return fileList
}

/**
 * Recursively find all prompt files (.md) in .cursor/prompts directory
 */
function findPromptFiles(dir: string, fileList: string[] = []): string[] {
  try {
    const files = readdirSync(dir)

    for (const file of files) {
      const filePath = join(dir, file)
      const stat = statSync(filePath)

      if (stat.isDirectory()) {
        // Skip node_modules and other ignored directories
        if (file === 'node_modules' || file === '.git') {
          continue
        }
        findPromptFiles(filePath, fileList)
      } else if (file.endsWith('.md')) {
        fileList.push(filePath)
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error(`Failed to read directory: ${dir} - ${errorMessage}`)
  }

  return fileList
}

/**
 * Check if file has version field
 */
function hasVersion(content: string): boolean {
  return /^version:/m.test(content)
}

/**
 * Check if file has lastUpdated field
 */
function hasLastUpdated(content: string): boolean {
  return /^lastUpdated:/m.test(content)
}

/**
 * Check if file has description field
 */
function hasDescription(content: string): boolean {
  return /^description:/m.test(content)
}

/**
 * Update version in file content
 */
function updateVersion(content: string, version: string): string {
  return content.replace(/^version:.*$/m, `version: '${version}'`)
}

/**
 * Update lastUpdated in file content
 */
function updateLastUpdated(content: string, date: string): string {
  return content.replace(/^lastUpdated:.*$/m, `lastUpdated: '${date}'`)
}

/**
 * Add lastUpdated after version
 */
function addLastUpdatedAfterVersion(content: string, date: string): string {
  return content.replace(/^(version:.*)$/m, `$1\nlastUpdated: '${date}'`)
}

/**
 * Add version and lastUpdated after description
 */
function addVersionAfterDescription(content: string, version: string, date: string): string {
  return content.replace(/^(description:.*)$/m, `$1\nversion: '${version}'\nlastUpdated: '${date}'`)
}

/**
 * Update rule files
 */
function updateRuleFiles(version: string, date: string): { updated: number; added: number } {
  const ruleFiles = findRuleFiles('.cursor/rules')
  let updated = 0
  let added = 0

  for (const file of ruleFiles) {
    try {
      const content = readFileSync(file, 'utf-8')
      let newContent = content
      if (hasVersion(content)) {
        // Update existing version
        newContent = updateVersion(newContent, version)

        // Update or add lastUpdated
        if (hasLastUpdated(newContent)) {
          newContent = updateLastUpdated(newContent, date)
        } else {
          newContent = addLastUpdatedAfterVersion(newContent, date)
        }

        writeFileSync(file, newContent, 'utf-8')
        logger.info(`  ✅ Updated: ${file}`)
        updated++
      } else if (hasDescription(content)) {
        // Add version and lastUpdated after description
        newContent = addVersionAfterDescription(newContent, version, date)
        writeFileSync(file, newContent, 'utf-8')
        logger.info(`  ➕ Added: ${file}`)
        added++
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error(`Failed to update file: ${file} - ${errorMessage}`)
    }
  }

  return { updated, added }
}

/**
 * Update prompt files
 */
function updatePromptFiles(version: string, date: string): number {
  const promptFiles = findPromptFiles('.cursor/prompts')
  let updated = 0

  for (const file of promptFiles) {
    try {
      const content = readFileSync(file, 'utf-8')
      let newContent = content

      if (hasVersion(content)) {
        // Update existing version
        newContent = updateVersion(newContent, version)

        // Update lastUpdated if exists
        if (hasLastUpdated(newContent)) {
          newContent = updateLastUpdated(newContent, date)
        }

        // Write file since we updated the version
        writeFileSync(file, newContent, 'utf-8')
        logger.info(`  ✅ Updated: ${file}`)
        updated++
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error(`Failed to update file: ${file} - ${errorMessage}`)
    }
  }

  return updated
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  const hideBinTyped = hideBin as (args: string[]) => string[]
  const argv = await yargs(hideBinTyped(process.argv))
    .command('$0 [version]', 'Update version numbers in rules and prompts', (yargs) => {
      return yargs.positional('version', {
        type: 'string',
        default: '1.0.0',
        description: 'Version number to set',
      })
    })
    .help()
    .parse()

  const version: string = typeof argv.version === 'string' ? argv.version : '1.0.0'
  const date: string = new Date().toISOString().split('T')[0] ?? new Date().toISOString()

  logger.info(`=== Updating versions to ${version} ===`)
  logger.info(`Date: ${date}`)
  logger.info('')

  // Update rules
  const ruleStats = updateRuleFiles(version, date)

  // Update prompts
  const promptUpdated = updatePromptFiles(version, date)

  logger.info('')
  logger.info('✅ Version update complete!')
  logger.infoWithMetadata(`  Rules: ${ruleStats.updated} updated, ${ruleStats.added} added`, {
    updated: ruleStats.updated,
    added: ruleStats.added,
  })
  logger.infoWithMetadata(`  Prompts: ${promptUpdated} updated`, { prompts: promptUpdated })
}

main().catch((error) => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'
  logger.error(`Fatal error: ${errorMessage}`)
  process.exit(1)
})
