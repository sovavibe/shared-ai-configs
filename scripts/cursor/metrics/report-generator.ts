#!/usr/bin/env node --experimental-strip-types
/**
 * Metrics report generator
 *
 * Generates comprehensive metrics report from collected data.
 * Extracted from collect-metrics.ts to follow SOLID principles.
 *
 * Usage:
 *   import { generateMetricsReport } from './report-generator.js'
 *
 * Requires: Node.js 24+ with TypeScript support
 */

import { findTsFiles } from './file-utils.js'
import { countPatternInFiles, findFilesWithPattern } from './pattern-matcher.js'
import { getGitLog } from './git-analyzer.js'
import { getPackageVersions } from './package-analyzer.js'
import { getTestCoverage } from './coverage-analyzer.js'
import { countRuleFilesWithPattern, getMcpServersCount } from './rule-analyzer.js'
import { getComponentSizes } from './component-analyzer.js'

/**
 * Count files by pattern (internal helper for report generation)
 */
function countFilesByPattern(dir: string, pattern: RegExp): number {
  const files = findTsFiles(dir)
  return files.filter((f) => pattern.test(f)).length
}

/**
 * Generate metrics report as markdown string
 *
 * @returns Formatted markdown report
 */
export function generateMetricsReport(): string {
  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-US', { hour12: false })

  let report = `# Cursor IDE Usage Metrics

> Generated: ${now.toISOString().split('T')[0]} ${timeStr}

## Code Quality Metrics

`

  // TypeScript Issues
  const tsFiles = findTsFiles('src')
  const anyTypesCount = countPatternInFiles(tsFiles, /:\s*any\b/g)
  const typeAssertionsCount = countPatternInFiles(tsFiles, /\s+as\s+/g)

  report += `### TypeScript Issues
\`\`\`
Checking for 'any' types:
  any types: ${anyTypesCount}
Checking for type assertions:
  type assertions: ${typeAssertionsCount}
\`\`\`

`

  // Production Code Quality
  const consoleLogCount = countPatternInFiles(tsFiles, /console\.log/g)
  const debuggerCount = countPatternInFiles(tsFiles, /debugger\b/g)

  report += `### Production Code Quality
\`\`\`
console.log statements:
  ${consoleLogCount}
debugger statements:
  ${debuggerCount}
\`\`\`

`

  // Component Sizes
  const tsxFiles = tsFiles.filter((f) => f.endsWith('.tsx'))
  const largeComponents = getComponentSizes(tsxFiles)

  report += `### Component Sizes
\`\`\`
Components over 150 lines:
${largeComponents.length === 0 ? '  None' : largeComponents.map((c) => `  ${c.file} (${c.lines} lines)`).join('\n')}
\`\`\`

`

  // Accessibility
  const buttonFiles = findFilesWithPattern(tsxFiles, /<Button/g)
  const buttonsWithoutAria = buttonFiles.filter((f) => !f.content.includes('aria-label')).length
  const inlineStylesCount = countPatternInFiles(tsxFiles, /style=\{\{/g)

  report += `### Accessibility
\`\`\`
Missing aria-label on buttons:
  ${buttonsWithoutAria}
Inline styles (style={{})):
  ${inlineStylesCount}
\`\`\`

`

  // Git Activity
  const gitDates = getGitLog('%ad', '30 days ago')
  const gitCommits = getGitLog('%s', '30 days ago')

  // Count commit types
  const commitTypes: Record<string, number> = {}
  if (gitCommits) {
    gitCommits.split('\n').forEach((commit) => {
      const type = commit.split(':')[0] || 'unknown'
      commitTypes[type] = (commitTypes[type] || 0) + 1
    })
  }

  const commitTypesStr =
    Object.keys(commitTypes).length > 0
      ? Object.entries(commitTypes)
          .sort((a, b) => b[1] - a[1])
          .map(([type, count]) => `  ${count} ${type}`)
          .join('\n')
      : '  No commits'

  report += `## Git Activity

### Commits (last 30 days)
\`\`\`
${gitDates ? gitDates.split('\n').slice(-10).join('\n') : '  No commits'}
\`\`\`

### Commit Types (last 30 days)
\`\`\`
${commitTypesStr}
\`\`\`

`

  // Jira References
  const jiraCommits = getGitLog('%s', '30 days ago')
    .split('\n')
    .filter((c) => /VP-/.test(c)).length

  report += `### Jira References
\`\`\`
Commits with Jira refs (last 30 days):
  ${jiraCommits}
\`\`\`

`

  // Codebase Structure
  const tsxCount = countFilesByPattern('src', /\.tsx$/)
  const tsCount = countFilesByPattern('src', /\.ts$/) - countFilesByPattern('src', /\.test\.ts$/)
  const testCount = countFilesByPattern('src', /\.test\.ts/)
  const styledCount = countFilesByPattern('src', /styled\.ts/)

  report += `## Codebase Structure

### Files by Type
\`\`\`
TSX components: ${tsxCount}
TS files: ${tsCount}
Test files: ${testCount}
Styled files: ${styledCount}
\`\`\`

`

  // Dependencies
  const versions = getPackageVersions()

  report += `## Dependencies

### Package Versions
\`\`\`
react: ${versions.react}
typescript: ${versions.typescript}
vite: ${versions.vite}
@tanstack/react-query: ${versions['@tanstack/react-query']}
antd: ${versions.antd}
\`\`\`

`

  // Test Coverage
  const coverage = getTestCoverage()
  if (coverage) {
    report += `## Test Coverage
\`\`\`
Lines: ${coverage.lines}
Statements: ${coverage.statements}
Functions: ${coverage.functions}
Branches: ${coverage.branches}
\`\`\`

`
  }

  // Cursor Rules Usage
  const totalRules = findTsFiles('.cursor/rules').length
  const alwaysApplyCount = countRuleFilesWithPattern(/alwaysApply:\s*true/g)
  const globsCount = countRuleFilesWithPattern(/^globs:/gm)
  const versionCount = countRuleFilesWithPattern(/^version:/gm)

  report += `## Cursor Rules Usage

### Rules Statistics
\`\`\`
Total rules: ${totalRules}
Always apply rules: ${alwaysApplyCount}
Context-based rules: ${globsCount}
Rules with version: ${versionCount}
\`\`\`

`

  // Prompts Statistics
  const promptFiles = findTsFiles('.cursor/prompts')
  const promptsWithVersion = countRuleFilesWithPattern(/^version:/gm)

  report += `### Prompts Statistics
\`\`\`
Total prompts: ${promptFiles.length}
Prompts with version: ${promptsWithVersion}
\`\`\`

`

  // MCP Servers
  const mcpCount = getMcpServersCount()

  report += `### MCP Servers
\`\`\`
${mcpCount > 0 ? `Configured servers: ${mcpCount}` : 'MCP config: not found (use mcp.json.sample)'}
\`\`\`

`

  report += `

---

Generated by: scripts/cursor/collect-metrics.ts
`

  return report
}
