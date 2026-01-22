import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { generateCommand } from './commands/generate.js';
import { validateCommand } from './commands/validate.js';
import { doctorCommand } from './commands/doctor.js';
import { statusCommand } from './commands/status.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read version from package.json
const packageJsonPath = join(__dirname, '../../package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

const program = new Command();

program
  .name('shared-ai-configs')
  .description('Generate AI configurations for Claude Code and Cursor IDE')
  .version(packageJson.version);

program
  .command('init')
  .description('Initialize .ai-project.yaml in current directory')
  .option('-f, --force', 'Overwrite existing config')
  .option('--stack <type>', 'Stack type (react, node, nextjs, java)', 'react')
  .action(initCommand);

program
  .command('generate')
  .description('Generate AI configs from .ai-project.yaml')
  .option('-c, --config <path>', 'Path to config file', '.ai-project.yaml')
  .option('-o, --output <dir>', 'Output directory', '.')
  .option('--dry-run', 'Show what would be generated without writing files')
  .option('--force', 'Overwrite existing files')
  .option('--clean', 'Remove all generated directories before regenerating')
  .action(generateCommand);

program
  .command('validate')
  .description('Validate .ai-project.yaml against schema')
  .option('-c, --config <path>', 'Path to config file', '.ai-project.yaml')
  .action(validateCommand);

program.command('doctor').description('Check dependencies and configuration').action(doctorCommand);

program
  .command('status')
  .description('Show current configuration status')
  .option('-c, --config <path>', 'Path to config file', '.ai-project.yaml')
  .action(statusCommand);

program.parse();
