import {
  writeFileSync,
  readFileSync,
  existsSync,
  mkdirSync,
  copyFileSync,
  symlinkSync,
  unlinkSync,
  readdirSync,
  appendFileSync,
} from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';
import { loadConfig, validateConfig, CONFIG_DEFAULTS } from '../utils/config.js';
import { renderTemplate } from '../utils/template.js';
import type { GenerateOptions, Config, ClaudeTargetConfig, CursorTargetConfig } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Package root directory
const packageRoot = join(__dirname, '../../..');

interface GeneratedFile {
  path: string;
  action: 'created' | 'updated' | 'skipped';
}

export async function generateCommand(options: GenerateOptions): Promise<void> {
  logger.header('Generating AI configurations');

  // Load and validate config
  let config: Config;
  try {
    config = loadConfig(options.config);
  } catch (error) {
    const err = error as Error;
    logger.error(`Failed to load config: ${err.message}`);
    process.exit(1);
  }

  const { valid, errors } = validateConfig(config);
  if (!valid) {
    logger.error('Configuration has errors:');
    for (const error of errors) {
      logger.list([error], '✗');
    }
    process.exit(1);
  }

  const generatedFiles: GeneratedFile[] = [];
  const outputDir = options.output;
  const strategy = config.generation?.strategy || 'generate';
  const targets = normalizeTargets(config);

  logger.info(`Targets: Claude=${targets.claude.enabled}, Cursor=${targets.cursor.enabled}`);

  // ============================================================================
  // CLAUDE CODE TARGET
  // If enabled → generate ALL Claude features, if disabled → generate NOTHING
  // ============================================================================
  if (targets.claude.enabled) {
    logger.info('');
    logger.header('Claude Code target');

    // 1. CLAUDE.md (main instructions file)
    if (targets.claude.features.includes('main')) {
      const result = await generateClaudeMd(config, outputDir, options);
      generatedFiles.push(result);
    }

    // 2. .claude/ directory (rules, hooks, docs, settings, commands)
    const claudeResults = await generateClaudeDir(
      config,
      outputDir,
      options,
      targets.claude.features
    );
    generatedFiles.push(...claudeResults);
  }

  // ============================================================================
  // CURSOR TARGET
  // If enabled → generate ALL Cursor features, if disabled → generate NOTHING
  // ============================================================================
  if (targets.cursor.enabled) {
    logger.info('');
    logger.header('Cursor target');

    // .cursor/ directory (rules, skills, agents, notepads, commands, hooks)
    const cursorResults = await generateCursorDir(
      config,
      outputDir,
      options,
      targets.cursor.features
    );
    generatedFiles.push(...cursorResults);

    // .cursorrules file (if cursorrules feature enabled)
    if (targets.cursor.features.includes('cursorrules')) {
      const results = await generateIgnoreFiles(config, outputDir, options);
      generatedFiles.push(...results);
    }
  }

  // ============================================================================
  // COMMON TARGETS (enabled for any active IDE)
  // ============================================================================

  // .beads/ if beads task tracking is enabled AND any IDE is active
  if (
    config.services?.task_tracking?.type === 'beads' &&
    (targets.claude.enabled || targets.cursor.enabled)
  ) {
    const results = await generateBeadsDir(config, outputDir, options);
    generatedFiles.push(...results);
  }

  // .perles/ if orchestration is enabled AND any IDE is active
  if (config.options?.orchestration && (targets.claude.enabled || targets.cursor.enabled)) {
    const results = await generatePerlesDir(config, outputDir, options);
    generatedFiles.push(...results);
  }

  // Update .gitignore
  if (config.generation?.gitignore_entries !== false) {
    await updateGitignore(config, outputDir, options, targets);
  }

  // Summary
  logger.info('');
  logger.success('Generation complete');

  const created = generatedFiles.filter((f) => f.action === 'created').length;
  const updated = generatedFiles.filter((f) => f.action === 'updated').length;
  const skipped = generatedFiles.filter((f) => f.action === 'skipped').length;

  logger.table({
    Created: String(created),
    Updated: String(updated),
    Skipped: String(skipped),
    Strategy: strategy,
  });

  if (options.dryRun) {
    logger.warn('Dry run - no files were written');
  }
}

// ============================================================================
// Target Configuration
// ============================================================================

interface TargetConfig {
  enabled: boolean;
  output_dir: string;
  features: string[];
}

interface NormalizedTargets {
  claude: TargetConfig;
  cursor: TargetConfig;
}

/**
 * Type guard to check if target is an object config (not boolean)
 */
function isTargetConfig(
  target: boolean | ClaudeTargetConfig | CursorTargetConfig | undefined
): target is ClaudeTargetConfig | CursorTargetConfig {
  return typeof target === 'object' && target !== null;
}

/**
 * Normalize targets from config with defaults
 * Handles both old boolean format and new object format
 */
function normalizeTargets(config: Config): NormalizedTargets {
  const genTargets = config.generation?.targets;

  // Default features for each target
  const claudeDefaultFeatures = ['rules', 'hooks', 'commands', 'docs', 'settings', 'main'];
  const cursorDefaultFeatures = [
    'rules',
    'hooks',
    'commands',
    'skills',
    'agents',
    'notepads',
    'mcp',
    'cursorrules',
  ];

  // Determine if Claude is enabled
  let claudeEnabled = true; // Default enabled
  const claudeTarget = genTargets?.claude;
  if (claudeTarget !== undefined) {
    if (typeof claudeTarget === 'boolean') {
      claudeEnabled = claudeTarget;
    } else if (isTargetConfig(claudeTarget)) {
      claudeEnabled = claudeTarget.enabled !== false;
    }
  }

  // Determine if Cursor is enabled
  let cursorEnabled = config.services?.ide?.primary === 'Cursor'; // Default based on IDE
  const cursorTarget = genTargets?.cursor;
  if (cursorTarget !== undefined) {
    if (typeof cursorTarget === 'boolean') {
      cursorEnabled = cursorTarget;
    } else if (isTargetConfig(cursorTarget)) {
      cursorEnabled = cursorTarget.enabled !== false;
    }
  }

  return {
    claude: {
      enabled: claudeEnabled,
      output_dir:
        (isTargetConfig(claudeTarget) ? claudeTarget.output_dir : undefined) ||
        config.services?.ide?.paths?.claude ||
        CONFIG_DEFAULTS.services.ide.paths.claude,
      features:
        (isTargetConfig(claudeTarget) ? claudeTarget.features : undefined) || claudeDefaultFeatures,
    },
    cursor: {
      enabled: cursorEnabled,
      output_dir:
        (isTargetConfig(cursorTarget) ? cursorTarget.output_dir : undefined) ||
        config.services?.ide?.paths?.cursor ||
        CONFIG_DEFAULTS.services.ide.paths.cursor,
      features:
        (isTargetConfig(cursorTarget) ? cursorTarget.features : undefined) || cursorDefaultFeatures,
    },
  };
}

// ============================================================================
// CLAUDE.md Generation
// ============================================================================

async function generateClaudeMd(
  config: Config,
  outputDir: string,
  options: GenerateOptions
): Promise<GeneratedFile> {
  const outputPath = join(outputDir, 'CLAUDE.md');

  if (existsSync(outputPath) && !options.force) {
    if (!options.dryRun) {
      logger.info(`Skipping CLAUDE.md (exists, use --force to overwrite)`);
    }
    return { path: outputPath, action: 'skipped' };
  }

  try {
    const content = await renderTemplate('CLAUDE.md.ejs', config);

    if (!options.dryRun) {
      mkdirSync(dirname(outputPath), { recursive: true });
      writeFileSync(outputPath, content);
      logger.success(`Generated CLAUDE.md`);
    } else {
      logger.info(`Would generate CLAUDE.md`);
    }

    return { path: outputPath, action: existsSync(outputPath) ? 'updated' : 'created' };
  } catch (error) {
    const err = error as Error;
    logger.error(`Failed to generate CLAUDE.md: ${err.message}`);
    return { path: outputPath, action: 'skipped' };
  }
}

// ============================================================================
// .claude/ Directory Generation
// ============================================================================

async function generateClaudeDir(
  config: Config,
  outputDir: string,
  options: GenerateOptions,
  features: string[]
): Promise<GeneratedFile[]> {
  const results: GeneratedFile[] = [];
  const claudeDir = join(
    outputDir,
    config.services?.ide?.paths?.claude || CONFIG_DEFAULTS.services.ide.paths.claude
  );
  const strategy = config.generation?.strategy || 'generate';

  if (!options.dryRun) {
    mkdirSync(claudeDir, { recursive: true });
  }

  // Generate settings.json from template (if 'settings' feature enabled)
  if (features.includes('settings')) {
    const settingsTemplate = join(packageRoot, 'templates/claude/settings.json.ejs');
    if (existsSync(settingsTemplate)) {
      const result = await generateFromTemplate(
        'claude/settings.json.ejs',
        join(claudeDir, 'settings.json'),
        config,
        options
      );
      if (result) results.push(result);
    }
  }

  // Generate MCP config (if 'mcp' feature enabled or by default)
  if (features.includes('mcp') || features.includes('settings')) {
    const mcpTemplate = join(packageRoot, 'templates/mcp/mcp.json.ejs');
    if (existsSync(mcpTemplate)) {
      const result = await generateFromTemplate(
        'mcp/mcp.json.ejs',
        join(claudeDir, 'mcp.json'),
        config,
        options
      );
      if (result) results.push(result);
    }
  }

  // Generate docs from templates (if 'docs' feature enabled)
  if (features.includes('docs')) {
    const docsDir = join(claudeDir, 'docs');
    if (!options.dryRun) {
      mkdirSync(docsDir, { recursive: true });
    }

    const docTemplates = [
      { template: 'claude/docs/MCP-GUIDE.md.ejs', output: 'MCP-GUIDE.md' },
      { template: 'claude/docs/SESSION-PROTOCOL.md.ejs', output: 'SESSION-PROTOCOL.md' },
      { template: 'claude/docs/TROUBLESHOOTING.md.ejs', output: 'TROUBLESHOOTING.md' },
      { template: 'claude/docs/SDLC-WORKFLOW.md.ejs', output: 'SDLC-WORKFLOW.md' },
      { template: 'claude/docs/DOCUMENTATION-INDEX.md.ejs', output: 'DOCUMENTATION-INDEX.md' },
      { template: 'claude/docs/QUICK-START-REFERENCE.md.ejs', output: 'QUICK-START-REFERENCE.md' },
      { template: 'claude/docs/SLASH-COMMANDS-GUIDE.md.ejs', output: 'SLASH-COMMANDS-GUIDE.md' },
    ];

    for (const doc of docTemplates) {
      const templatePath = join(packageRoot, 'templates', doc.template);
      if (existsSync(templatePath)) {
        const result = await generateFromTemplate(
          doc.template,
          join(docsDir, doc.output),
          config,
          options
        );
        if (result) results.push(result);
      }
    }
  }

  // Shell hooks (if 'hooks' feature enabled)
  if (features.includes('hooks')) {
    const hooksSourceDir = join(packageRoot, 'hooks');
    const hooksTargetDir = join(claudeDir, 'hooks');

    if (!options.dryRun) {
      mkdirSync(hooksTargetDir, { recursive: true });
    }

    if (existsSync(hooksSourceDir)) {
      const hookFiles = readdirSync(hooksSourceDir).filter((f) => f.endsWith('.sh'));
      for (const hook of hookFiles) {
        const sourcePath = join(hooksSourceDir, hook);
        const targetPath = join(hooksTargetDir, hook);

        if (existsSync(targetPath) && !options.force) {
          results.push({ path: targetPath, action: 'skipped' });
          continue;
        }

        if (!options.dryRun) {
          if (existsSync(targetPath)) unlinkSync(targetPath);
          if (strategy === 'symlink') {
            symlinkSync(sourcePath, targetPath);
          } else {
            copyFileSync(sourcePath, targetPath);
          }
        }
        results.push({ path: targetPath, action: existsSync(targetPath) ? 'updated' : 'created' });
      }
    }
  }

  // Claude rules (if 'rules' feature enabled)
  if (features.includes('rules')) {
    const claudeRulesDir = join(claudeDir, 'rules');
    if (!options.dryRun) {
      mkdirSync(claudeRulesDir, { recursive: true });
    }

    const rulesToInclude = getRulesToInclude(config);
    for (const ruleSpec of rulesToInclude) {
      const sourcePath = join(packageRoot, ruleSpec.source);
      const targetPath = join(claudeRulesDir, ruleSpec.target);

      if (!existsSync(sourcePath)) {
        const altPath = join(packageRoot, 'content', ruleSpec.source);
        if (!existsSync(altPath)) continue;
      }

      if (existsSync(targetPath) && !options.force) {
        results.push({ path: targetPath, action: 'skipped' });
        continue;
      }

      if (!options.dryRun) {
        mkdirSync(dirname(targetPath), { recursive: true });
        if (existsSync(targetPath)) unlinkSync(targetPath);

        const actualSource = existsSync(sourcePath)
          ? sourcePath
          : join(packageRoot, 'content', ruleSpec.source);
        if (strategy === 'symlink') {
          symlinkSync(actualSource, targetPath);
        } else {
          copyFileSync(actualSource, targetPath);
        }
      }

      results.push({ path: targetPath, action: existsSync(targetPath) ? 'updated' : 'created' });
    }
  }

  // Commands (if 'commands' feature enabled)
  if (features.includes('commands')) {
    const commandsDir = join(packageRoot, 'content/commands');
    if (existsSync(commandsDir)) {
      const targetCommands = join(claudeDir, 'commands');
      const files = await copyDirectory(commandsDir, targetCommands, options, strategy);
      results.push(...files);
    }
  }

  const count = results.filter((r) => r.action !== 'skipped').length;
  if (count > 0) {
    logger.success(`Generated ${count} files in .claude/`);
  }

  return results;
}

// ============================================================================
// .cursor/ Directory Generation
// ============================================================================

async function generateCursorDir(
  config: Config,
  outputDir: string,
  options: GenerateOptions,
  features: string[]
): Promise<GeneratedFile[]> {
  const results: GeneratedFile[] = [];
  const cursorDir = join(
    outputDir,
    config.services?.ide?.paths?.cursor || CONFIG_DEFAULTS.services.ide.paths.cursor
  );
  const strategy = config.generation?.strategy || 'generate';

  if (!options.dryRun) {
    mkdirSync(cursorDir, { recursive: true });
  }

  // Rules (if 'rules' feature enabled)
  if (features.includes('rules')) {
    const rulesResults = await generateCursorRules(config, cursorDir, options);
    results.push(...rulesResults);
  }

  // Agents (if 'agents' feature enabled)
  if (features.includes('agents')) {
    const agentsDir = join(packageRoot, 'content/agents');
    if (existsSync(agentsDir)) {
      const targetAgents = join(cursorDir, 'agents');
      const files = await copyDirectory(agentsDir, targetAgents, options, strategy);
      results.push(...files);
    }
  }

  // Skills (if 'skills' feature enabled)
  if (features.includes('skills')) {
    const skillsDir = join(packageRoot, 'content/skills');
    if (existsSync(skillsDir)) {
      const targetSkills = join(cursorDir, 'skills');
      const files = await copyDirectory(skillsDir, targetSkills, options, strategy);
      results.push(...files);
    }
  }

  // Notepads (if 'notepads' feature enabled)
  if (features.includes('notepads')) {
    const notepadsDir = join(packageRoot, 'content/notepads');
    if (existsSync(notepadsDir)) {
      const targetNotepads = join(cursorDir, 'notepads');
      const files = await copyDirectory(notepadsDir, targetNotepads, options, strategy);
      results.push(...files);
    }
  }

  // Commands (if 'commands' feature enabled)
  if (features.includes('commands')) {
    const commandsDir = join(packageRoot, 'content/commands');
    if (existsSync(commandsDir)) {
      const targetCommands = join(cursorDir, 'commands');
      const files = await copyDirectory(commandsDir, targetCommands, options, strategy);
      results.push(...files);
    }
  }

  // Cursor JS hooks (if 'hooks' feature enabled)
  if (features.includes('hooks')) {
    const cursorHooksDir = join(packageRoot, 'content/hooks/cursor');
    if (existsSync(cursorHooksDir)) {
      const targetHooks = join(cursorDir, 'hooks');
      const files = await copyDirectory(cursorHooksDir, targetHooks, options, strategy);
      results.push(...files);
    }
  }

  // MCP config (if 'mcp' feature enabled) - uses shared template
  if (features.includes('mcp')) {
    const mcpTemplate = join(packageRoot, 'templates/mcp/mcp.json.ejs');
    if (existsSync(mcpTemplate)) {
      const result = await generateFromTemplate(
        'mcp/mcp.json.ejs',
        join(cursorDir, 'mcp.json'),
        config,
        options
      );
      if (result) results.push(result);
    }
  }

  const count = results.filter((r) => r.action !== 'skipped').length;
  if (count > 0) {
    logger.success(`Generated ${count} files in .cursor/`);
  }

  return results;
}

interface RuleSpec {
  source: string;
  target: string;
  condition?: (config: Config) => boolean;
}

function getRulesToInclude(config: Config): RuleSpec[] {
  const rules: RuleSpec[] = [];
  const mcp = config.services?.mcp;
  const taskTracking = config.services?.task_tracking;
  const vcs = config.services?.vcs;

  // Core rules (always included)
  const coreRules = [
    'core/persona.mdc',
    'core/quality.mdc',
    'core/core-principles.mdc',
    'core/existing-solutions.mdc',
  ];
  for (const rule of coreRules) {
    const target = rule.split('/').pop() ?? rule;
    rules.push({ source: rule, target });
  }

  // MCP rules (always included if any MCP is enabled)
  const hasAnyMcp = mcp && Object.values(mcp).some((m) => m?.enabled);
  if (hasAnyMcp) {
    const mcpRules = [
      'core/mcp/mcp-troubleshooting.mdc',
      'core/mcp/tool-selection.mdc',
      'core/mcp/ai-workflow.mdc',
      'core/mcp/context-management.mdc',
    ];
    for (const rule of mcpRules) {
      const target = rule.split('/').pop() ?? rule;
      rules.push({ source: rule, target });
    }
  }

  // Conditional MCP rules
  if (mcp?.hindsight?.enabled) {
    rules.push({ source: 'core/mcp/hindsight.mdc', target: 'hindsight.mdc' });
  }

  // Workflow rules
  const workflowRules = [
    'core/workflow/task-management.mdc',
    'core/workflow/git-workflow.mdc',
    'core/workflow/communication-style.mdc',
    'core/workflow/documentation.mdc',
  ];
  for (const rule of workflowRules) {
    const target = rule.split('/').pop() ?? rule;
    rules.push({ source: rule, target });
  }

  // Stack-specific rules
  if (config.stack.type === 'react') {
    const reactRules = [
      'stacks/react/tech-stack.mdc',
      'stacks/react/architecture.mdc',
      'stacks/react/styling.mdc',
    ];
    // Ant Design rule only if UI library is Ant Design
    if (config.stack.ui?.library === 'Ant Design') {
      reactRules.push('stacks/react/ant-design.mdc');
    }
    for (const rule of reactRules) {
      const target = rule.split('/').pop() ?? rule;
      rules.push({ source: rule, target });
    }
  }

  // Beads integration
  if (taskTracking?.type === 'beads') {
    rules.push({ source: 'integrations/beads/beads.mdc', target: 'beads.mdc' });
  }

  // VCS integration
  if (vcs?.type === 'gitlab') {
    rules.push({ source: 'integrations/gitlab/gitlab-mr.mdc', target: 'gitlab-mr.mdc' });
  } else if (vcs?.type === 'github') {
    rules.push({ source: 'integrations/github/github-pr.mdc', target: 'github-pr.mdc' });
  }

  // Security rules
  if (mcp?.snyk?.enabled) {
    rules.push({ source: 'core/security/security.mdc', target: 'security.mdc' });
  }

  // Dual IDE rules
  if (config.services?.ide?.dual_mode) {
    rules.push({ source: 'core/workflow/dual-ide.mdc', target: 'dual-ide.mdc' });
  }

  return rules;
}

async function generateCursorRules(
  config: Config,
  cursorDir: string,
  options: GenerateOptions
): Promise<GeneratedFile[]> {
  const results: GeneratedFile[] = [];
  const rulesDir = join(cursorDir, 'rules');
  const strategy = config.generation?.strategy || 'generate';

  if (!options.dryRun) {
    mkdirSync(rulesDir, { recursive: true });
  }

  const rulesToInclude = getRulesToInclude(config);

  for (const ruleSpec of rulesToInclude) {
    const sourcePath = join(packageRoot, ruleSpec.source);
    const targetPath = join(rulesDir, ruleSpec.target);

    if (!existsSync(sourcePath)) {
      // Try alternate locations
      const altPath = join(packageRoot, 'content', ruleSpec.source);
      if (!existsSync(altPath)) {
        logger.warn(`Rule not found: ${ruleSpec.source}`);
        continue;
      }
    }

    if (existsSync(targetPath) && !options.force) {
      results.push({ path: targetPath, action: 'skipped' });
      continue;
    }

    if (!options.dryRun) {
      mkdirSync(dirname(targetPath), { recursive: true });
      if (existsSync(targetPath)) unlinkSync(targetPath);

      const actualSource = existsSync(sourcePath)
        ? sourcePath
        : join(packageRoot, 'content', ruleSpec.source);
      if (strategy === 'symlink') {
        symlinkSync(actualSource, targetPath);
      } else {
        copyFileSync(actualSource, targetPath);
      }
    }

    results.push({ path: targetPath, action: existsSync(targetPath) ? 'updated' : 'created' });
  }

  return results;
}

// ============================================================================
// .beads/ Directory Generation
// ============================================================================

async function generateBeadsDir(
  config: Config,
  outputDir: string,
  options: GenerateOptions
): Promise<GeneratedFile[]> {
  const results: GeneratedFile[] = [];
  const beadsPath =
    config.services?.task_tracking?.paths?.beads ||
    CONFIG_DEFAULTS.services.task_tracking.paths.beads;
  const beadsDir = join(outputDir, beadsPath);
  const strategy = config.generation?.strategy || 'generate';

  if (!options.dryRun) {
    mkdirSync(beadsDir, { recursive: true });
  }

  // Copy static content
  const contentDir = join(packageRoot, 'content/beads');
  if (existsSync(contentDir)) {
    const files = await copyDirectory(contentDir, beadsDir, options, strategy);
    results.push(...files);
  }

  // Generate config.yaml from template
  const templatePath = join(packageRoot, 'templates/beads/config.yaml.ejs');
  if (existsSync(templatePath)) {
    const result = await generateFromTemplate(
      'beads/config.yaml.ejs',
      join(beadsDir, 'config.yaml'),
      config,
      options
    );
    if (result) results.push(result);
  }

  const count = results.filter((r) => r.action !== 'skipped').length;
  if (count > 0) {
    logger.success(`Generated ${count} files in .beads/`);
  }

  return results;
}

// ============================================================================
// .perles/ Directory Generation
// ============================================================================

async function generatePerlesDir(
  config: Config,
  outputDir: string,
  options: GenerateOptions
): Promise<GeneratedFile[]> {
  const results: GeneratedFile[] = [];
  const perlesPath =
    config.services?.task_tracking?.paths?.perles ||
    CONFIG_DEFAULTS.services.task_tracking.paths.perles;
  const perlesDir = join(outputDir, perlesPath);
  const strategy = config.generation?.strategy || 'generate';

  if (!options.dryRun) {
    mkdirSync(perlesDir, { recursive: true });
  }

  // Copy static content
  const contentDir = join(packageRoot, 'content/perles');
  if (existsSync(contentDir)) {
    const files = await copyDirectory(contentDir, perlesDir, options, strategy);
    results.push(...files);
  }

  // Generate config.yaml from template
  const templatePath = join(packageRoot, 'templates/perles/config.yaml.ejs');
  if (existsSync(templatePath)) {
    const result = await generateFromTemplate(
      'perles/config.yaml.ejs',
      join(perlesDir, 'config.yaml'),
      config,
      options
    );
    if (result) results.push(result);
  }

  const count = results.filter((r) => r.action !== 'skipped').length;
  if (count > 0) {
    logger.success(`Generated ${count} files in .perles/`);
  }

  return results;
}

// ============================================================================
// Ignore Files Generation
// ============================================================================

async function generateIgnoreFiles(
  config: Config,
  outputDir: string,
  options: GenerateOptions
): Promise<GeneratedFile[]> {
  const results: GeneratedFile[] = [];

  const ignoreFiles = [
    { template: 'ignore/cursorignore.ejs', output: '.cursorignore' },
    { template: 'ignore/cursorindexingignore.ejs', output: '.cursorindexingignore' },
    { template: 'ignore/cursorrules.ejs', output: '.cursorrules' },
  ];

  for (const file of ignoreFiles) {
    const templatePath = join(packageRoot, 'templates', file.template);
    if (existsSync(templatePath)) {
      const result = await generateFromTemplate(
        file.template,
        join(outputDir, file.output),
        config,
        options
      );
      if (result) results.push(result);
    } else {
      // Copy from content if template doesn't exist
      const contentPath = join(packageRoot, 'content', file.output);
      if (existsSync(contentPath)) {
        const targetPath = join(outputDir, file.output);
        if (!existsSync(targetPath) || options.force) {
          if (!options.dryRun) {
            copyFileSync(contentPath, targetPath);
          }
          results.push({ path: targetPath, action: 'created' });
        }
      }
    }
  }

  const count = results.filter((r) => r.action !== 'skipped').length;
  if (count > 0) {
    logger.success(`Generated ${count} ignore files`);
  }

  return results;
}

// ============================================================================
// .gitignore Update
// ============================================================================

async function updateGitignore(
  config: Config,
  outputDir: string,
  options: GenerateOptions,
  targets: NormalizedTargets
): Promise<void> {
  const gitignorePath = join(outputDir, '.gitignore');

  const entries: string[] = [
    '',
    '# AI Generated (by shared-ai-configs) - DO NOT EDIT',
    '# Regenerate with: npx shared-ai-configs generate',
    '',
    '# Memory Bank (stored in MCP, not in git)',
    '.memory',
    'memory-bank/',
  ];

  // Claude-specific entries (only if Claude target enabled)
  if (targets.claude.enabled) {
    entries.push('');
    entries.push('# Claude Code');
    entries.push('.claude/');
    entries.push('CLAUDE.md');
  }

  // Cursor-specific entries (only if Cursor target enabled)
  if (targets.cursor.enabled) {
    entries.push('');
    entries.push('# Cursor IDE');
    entries.push('.cursor/');
    entries.push('.cursorignore');
    entries.push('.cursorindexingignore');
    entries.push('.cursorrules');
    entries.push('AGENTS.md');
  }

  // Beads entries (only ignore local db, issues.jsonl is tracked for collaboration)
  if (config.services?.task_tracking?.type === 'beads') {
    entries.push('');
    entries.push('# Beads (local database - issues.jsonl is tracked)');
    const beadsPath =
      config.services.task_tracking.paths?.beads ||
      CONFIG_DEFAULTS.services.task_tracking.paths.beads;
    entries.push(`${beadsPath}*.db`);
    entries.push(`${beadsPath}*.db-*`);
  }

  // Perles orchestration (generated)
  if (config.options?.orchestration) {
    entries.push('');
    entries.push('# Perles (orchestration - generated)');
    entries.push('.perles/');
  }

  // Future IDE support placeholders
  entries.push('');
  entries.push('# Future IDE support');
  entries.push('.kilo/');
  entries.push('.jb-ai/');

  if (!existsSync(gitignorePath)) {
    if (!options.dryRun) {
      writeFileSync(gitignorePath, entries.join('\n') + '\n');
      logger.success('Created .gitignore with AI config entries');
    }
    return;
  }

  // Check if entries already exist (check multiple possible markers for backwards compat)
  const content = readFileSync(gitignorePath, 'utf-8');
  const markers = [
    '# AI Generated (by shared-ai-configs)',
    '# Generated AI configs',
    '# AI Configuration (generated by shared-ai-configs)',
  ];
  const hasMarker = markers.some((marker) => content.includes(marker));

  if (hasMarker) {
    // Check if we need to update (missing cursor files)
    const missingEntries: string[] = [];
    if (targets.cursor.enabled) {
      if (!content.includes('.cursorignore')) missingEntries.push('.cursorignore');
      if (!content.includes('.cursorindexingignore')) missingEntries.push('.cursorindexingignore');
      if (!content.includes('.cursorrules')) missingEntries.push('.cursorrules');
      if (!content.includes('AGENTS.md')) missingEntries.push('AGENTS.md');
    }
    if (targets.claude.enabled) {
      if (!content.includes('CLAUDE.md')) missingEntries.push('CLAUDE.md');
    }
    if (config.options?.orchestration && !content.includes('.perles/')) {
      missingEntries.push('.perles/');
    }

    if (missingEntries.length > 0 && !options.dryRun) {
      // Append missing entries
      const newEntries = ['\n# Additional AI entries (auto-added)', ...missingEntries];
      appendFileSync(gitignorePath, newEntries.join('\n') + '\n');
      logger.success(`Updated .gitignore with missing entries: ${missingEntries.join(', ')}`);
    } else if (missingEntries.length === 0) {
      logger.info('.gitignore already has all AI config entries');
    }
    return;
  }

  if (!options.dryRun) {
    appendFileSync(gitignorePath, entries.join('\n') + '\n');
    logger.success('Updated .gitignore with AI config entries');
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

async function copyDirectory(
  sourceDir: string,
  targetDir: string,
  options: GenerateOptions,
  strategy: string
): Promise<GeneratedFile[]> {
  const results: GeneratedFile[] = [];

  if (!existsSync(sourceDir)) {
    return results;
  }

  if (!options.dryRun) {
    mkdirSync(targetDir, { recursive: true });
  }

  const entries = readdirSync(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = join(sourceDir, entry.name);
    const targetPath = join(targetDir, entry.name);

    if (entry.isDirectory()) {
      const subResults = await copyDirectory(sourcePath, targetPath, options, strategy);
      results.push(...subResults);
    } else {
      if (existsSync(targetPath) && !options.force) {
        results.push({ path: targetPath, action: 'skipped' });
        continue;
      }

      if (!options.dryRun) {
        mkdirSync(dirname(targetPath), { recursive: true });
        if (existsSync(targetPath)) unlinkSync(targetPath);

        if (strategy === 'symlink') {
          symlinkSync(sourcePath, targetPath);
        } else {
          copyFileSync(sourcePath, targetPath);
        }
      }

      results.push({ path: targetPath, action: existsSync(targetPath) ? 'updated' : 'created' });
    }
  }

  return results;
}

async function generateFromTemplate(
  templateName: string,
  outputPath: string,
  config: Config,
  options: GenerateOptions
): Promise<GeneratedFile | null> {
  const templatePath = join(packageRoot, 'templates', templateName);

  if (!existsSync(templatePath)) {
    return null;
  }

  if (existsSync(outputPath) && !options.force) {
    return { path: outputPath, action: 'skipped' };
  }

  try {
    const content = await renderTemplate(templateName, config);

    if (!options.dryRun) {
      mkdirSync(dirname(outputPath), { recursive: true });
      writeFileSync(outputPath, content);
    }

    return { path: outputPath, action: existsSync(outputPath) ? 'updated' : 'created' };
  } catch (error) {
    const err = error as Error;
    logger.warn(`Failed to generate ${templateName}: ${err.message}`);
    return null;
  }
}
