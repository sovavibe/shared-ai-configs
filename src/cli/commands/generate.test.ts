import type { Mock } from 'vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { join } from 'path';

// Mock fs module before importing the module under test
vi.mock('fs', () => ({
  writeFileSync: vi.fn(),
  readFileSync: vi.fn(),
  existsSync: vi.fn(),
  mkdirSync: vi.fn(),
  copyFileSync: vi.fn(),
  symlinkSync: vi.fn(),
  unlinkSync: vi.fn(),
  readdirSync: vi.fn(),
  appendFileSync: vi.fn(),
  rmSync: vi.fn(),
}));

// Mock child_process for beads initialization
vi.mock('child_process', () => ({
  execSync: vi.fn(),
}));

// Mock the logger to prevent console output during tests
vi.mock('../utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    success: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    header: vi.fn(),
    table: vi.fn(),
    list: vi.fn(),
  },
}));

// Mock config utilities
vi.mock('../utils/config.js', () => ({
  loadConfig: vi.fn(),
  validateConfig: vi.fn(),
  CONFIG_DEFAULTS: {
    languages: { chat: 'English', code: 'English' },
    services: {
      ide: {
        paths: { claude: '.claude/', cursor: '.cursor/' },
      },
      vcs: { main_branch: 'main' },
      task_tracking: {
        paths: { beads: '.beads/', perles: '.perles/' },
      },
      mcp: {
        hindsight: { enabled: false },
        snyk: { enabled: false },
        context7: { enabled: false },
        memory_bank: { enabled: false },
        figma: { enabled: false },
        browser: { enabled: false },
      },
    },
    options: {
      sdd_enabled: false,
      orchestration: false,
      agentic_workflows: false,
    },
    generation: {
      targets: {
        claude: true,
        cursor: true,
        beads: false,
        perles: false,
        ignore_files: true,
        claude_md: true,
        gitignore_entries: true,
      },
      strategy: 'generate',
    },
  },
}));

// Mock template utility
vi.mock('../utils/template.js', () => ({
  renderTemplate: vi.fn().mockResolvedValue('# Generated content'),
}));

// Import mocked modules
import {
  writeFileSync,
  readFileSync,
  existsSync,
  mkdirSync,
  unlinkSync,
  readdirSync,
  appendFileSync,
  rmSync,
} from 'fs';
import { logger } from '../utils/logger.js';
import { loadConfig, validateConfig } from '../utils/config.js';
import { renderTemplate } from '../utils/template.js';
import type { Config, GenerateOptions } from '../types.js';

// Import the module under test after mocks are set up
import { generateCommand } from './generate.js';

describe('generate command', () => {
  // Default minimal config for tests
  const minimalConfig: Config = {
    project: { name: 'test-project', description: 'Test project' },
    stack: { type: 'react' },
    commands: { dev: 'npm run dev', build: 'npm run build' },
  };

  // Default options
  const defaultOptions: GenerateOptions = {
    config: 'ai-project.yaml',
    output: '/test/output',
    dryRun: false,
    force: false,
    clean: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    (loadConfig as Mock).mockReturnValue(minimalConfig);
    (validateConfig as Mock).mockReturnValue({ valid: true, errors: [] });
    (existsSync as Mock).mockReturnValue(false);
    (readdirSync as Mock).mockReturnValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ==========================================================================
  // cleanGeneratedFiles() tests - tested through generateCommand with --clean
  // ==========================================================================
  describe('cleanGeneratedFiles (via --clean option)', () => {
    it('should clean existing directories when --clean is set', async () => {
      // Setup: directories exist
      (existsSync as Mock).mockImplementation((path: string) => {
        return (
          path.endsWith('.claude') ||
          path.endsWith('.cursor') ||
          path.endsWith('.perles') ||
          path.endsWith('CLAUDE.md')
        );
      });

      await generateCommand({ ...defaultOptions, clean: true });

      // Should call rmSync for directories
      expect(rmSync).toHaveBeenCalledWith(join('/test/output', '.claude'), {
        recursive: true,
        force: true,
      });
      expect(rmSync).toHaveBeenCalledWith(join('/test/output', '.cursor'), {
        recursive: true,
        force: true,
      });
      expect(rmSync).toHaveBeenCalledWith(join('/test/output', '.perles'), {
        recursive: true,
        force: true,
      });

      // Should call unlinkSync for files
      expect(unlinkSync).toHaveBeenCalledWith(join('/test/output', 'CLAUDE.md'));
    });

    it('should not remove anything in dry-run mode', async () => {
      (existsSync as Mock).mockImplementation((path: string) => {
        return path.endsWith('.claude') || path.endsWith('CLAUDE.md');
      });

      await generateCommand({ ...defaultOptions, clean: true, dryRun: true });

      // Should NOT call rmSync or unlinkSync in dry-run
      expect(rmSync).not.toHaveBeenCalled();
      expect(unlinkSync).not.toHaveBeenCalled();

      // Should log what would be removed
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Would remove'));
    });

    it('should log when no files to clean', async () => {
      (existsSync as Mock).mockReturnValue(false);

      await generateCommand({ ...defaultOptions, clean: true });

      expect(logger.info).toHaveBeenCalledWith('No generated files found to clean');
    });

    it('should clean .cursorrules, .cursorignore, .cursorindexingignore files', async () => {
      (existsSync as Mock).mockImplementation((path: string) => {
        return (
          path.endsWith('.cursorrules') ||
          path.endsWith('.cursorignore') ||
          path.endsWith('.cursorindexingignore') ||
          path.endsWith('AGENTS.md')
        );
      });

      await generateCommand({ ...defaultOptions, clean: true });

      expect(unlinkSync).toHaveBeenCalledWith(join('/test/output', '.cursorrules'));
      expect(unlinkSync).toHaveBeenCalledWith(join('/test/output', '.cursorignore'));
      expect(unlinkSync).toHaveBeenCalledWith(join('/test/output', '.cursorindexingignore'));
      expect(unlinkSync).toHaveBeenCalledWith(join('/test/output', 'AGENTS.md'));
    });
  });

  // ==========================================================================
  // Command options parsing tests
  // ==========================================================================
  describe('command options', () => {
    it('should load config from specified path', async () => {
      await generateCommand({ ...defaultOptions, config: '/custom/config.yaml' });

      expect(loadConfig).toHaveBeenCalledWith('/custom/config.yaml');
    });

    it('should exit with error if config loading fails', async () => {
      const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      (loadConfig as Mock).mockImplementation(() => {
        throw new Error('Config not found');
      });

      await expect(generateCommand(defaultOptions)).rejects.toThrow('process.exit called');
      expect(logger.error).toHaveBeenCalledWith('Failed to load config: Config not found');
      expect(mockExit).toHaveBeenCalledWith(1);

      mockExit.mockRestore();
    });

    it('should exit with error if config validation fails', async () => {
      const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      (validateConfig as Mock).mockReturnValue({
        valid: false,
        errors: ['Missing project.name', 'Invalid stack type'],
      });

      await expect(generateCommand(defaultOptions)).rejects.toThrow('process.exit called');
      expect(logger.error).toHaveBeenCalledWith('Configuration has errors:');
      expect(logger.list).toHaveBeenCalled();
      expect(mockExit).toHaveBeenCalledWith(1);

      mockExit.mockRestore();
    });

    it('should use output directory from options', async () => {
      await generateCommand({ ...defaultOptions, output: '/custom/output' });

      // Check that mkdirSync was called with the custom output path
      expect(mkdirSync).toHaveBeenCalledWith(expect.stringContaining('/custom/output'), {
        recursive: true,
      });
    });

    it('should skip existing files when --force is not set', async () => {
      (existsSync as Mock).mockImplementation((path: string) => {
        // Simulate CLAUDE.md already exists
        return path.endsWith('CLAUDE.md');
      });

      await generateCommand(defaultOptions);

      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('Skipping CLAUDE.md (exists, use --force to overwrite)')
      );
    });

    it('should overwrite existing files when --force is set', async () => {
      // Mock that CLAUDE.md already exists
      (existsSync as Mock).mockImplementation((path: string) => {
        if (path.endsWith('CLAUDE.md')) return true;
        // Templates exist
        if (path.includes('templates')) return true;
        return false;
      });

      await generateCommand({ ...defaultOptions, force: true });

      // Should call renderTemplate and writeFileSync for CLAUDE.md
      expect(renderTemplate).toHaveBeenCalledWith('CLAUDE.md.ejs', expect.any(Object));
      expect(writeFileSync).toHaveBeenCalled();
    });

    it('should not write files in dry-run mode', async () => {
      // Templates exist
      (existsSync as Mock).mockImplementation((path: string) => {
        return path.includes('templates');
      });

      await generateCommand({ ...defaultOptions, dryRun: true });

      // Should not call writeFileSync
      expect(writeFileSync).not.toHaveBeenCalled();

      // Should log dry-run warning
      expect(logger.warn).toHaveBeenCalledWith('Dry run - no files were written');
    });
  });

  // ==========================================================================
  // File generation tests
  // ==========================================================================
  describe('file generation', () => {
    beforeEach(() => {
      // Mock templates exist
      (existsSync as Mock).mockImplementation((path: string) => {
        if (path.includes('templates')) return true;
        return false;
      });
    });

    it('should generate CLAUDE.md when claude target is enabled', async () => {
      const configWithClaude: Config = {
        ...minimalConfig,
        generation: {
          targets: { claude: true },
        },
      };
      (loadConfig as Mock).mockReturnValue(configWithClaude);

      await generateCommand(defaultOptions);

      expect(renderTemplate).toHaveBeenCalledWith('CLAUDE.md.ejs', expect.any(Object));
      expect(logger.success).toHaveBeenCalledWith('Generated CLAUDE.md');
    });

    it('should not generate CLAUDE.md when claude target is disabled', async () => {
      const configWithoutClaude: Config = {
        ...minimalConfig,
        generation: {
          targets: { claude: false },
        },
      };
      (loadConfig as Mock).mockReturnValue(configWithoutClaude);

      await generateCommand(defaultOptions);

      // Should not call renderTemplate for CLAUDE.md
      expect(renderTemplate).not.toHaveBeenCalledWith('CLAUDE.md.ejs', expect.any(Object));
    });

    it('should generate .claude/ directory structure', async () => {
      await generateCommand(defaultOptions);

      // Should create .claude directory
      expect(mkdirSync).toHaveBeenCalledWith(expect.stringContaining('.claude'), {
        recursive: true,
      });
    });

    it('should generate .cursor/ directory when cursor target is enabled', async () => {
      const configWithCursor: Config = {
        ...minimalConfig,
        services: {
          ide: { primary: 'Cursor' },
        },
        generation: {
          targets: { cursor: true },
        },
      };
      (loadConfig as Mock).mockReturnValue(configWithCursor);

      await generateCommand(defaultOptions);

      // Should create .cursor directory
      expect(mkdirSync).toHaveBeenCalledWith(expect.stringContaining('.cursor'), {
        recursive: true,
      });
    });

    it('should generate .beads/ directory when beads task tracking is enabled', async () => {
      const configWithBeads: Config = {
        ...minimalConfig,
        services: {
          task_tracking: { type: 'beads' },
        },
      };
      (loadConfig as Mock).mockReturnValue(configWithBeads);

      await generateCommand(defaultOptions);

      // Should create .beads directory
      expect(mkdirSync).toHaveBeenCalledWith(expect.stringContaining('.beads'), {
        recursive: true,
      });
    });

    it('should generate .perles/ directory when orchestration is enabled', async () => {
      const configWithOrchestration: Config = {
        ...minimalConfig,
        options: {
          orchestration: true,
        },
      };
      (loadConfig as Mock).mockReturnValue(configWithOrchestration);

      await generateCommand(defaultOptions);

      // Should create .perles directory
      expect(mkdirSync).toHaveBeenCalledWith(expect.stringContaining('.perles'), {
        recursive: true,
      });
    });

    it('should display generation summary', async () => {
      await generateCommand(defaultOptions);

      expect(logger.success).toHaveBeenCalledWith('Generation complete');
      expect(logger.table).toHaveBeenCalledWith(
        expect.objectContaining({
          Created: expect.any(String),
          Updated: expect.any(String),
          Skipped: expect.any(String),
          Strategy: expect.any(String),
        })
      );
    });
  });

  // ==========================================================================
  // .gitignore update tests
  // ==========================================================================
  describe('.gitignore update', () => {
    it('should create .gitignore if it does not exist', async () => {
      (existsSync as Mock).mockImplementation((path: string) => {
        if (path.endsWith('.gitignore')) return false;
        if (path.includes('templates')) return true;
        return false;
      });

      await generateCommand(defaultOptions);

      expect(writeFileSync).toHaveBeenCalledWith(
        join('/test/output', '.gitignore'),
        expect.stringContaining('# AI Generated (by shared-ai-configs)')
      );
    });

    it('should append to existing .gitignore without AI marker', async () => {
      (existsSync as Mock).mockImplementation((path: string) => {
        if (path.endsWith('.gitignore')) return true;
        if (path.includes('templates')) return true;
        return false;
      });
      (readFileSync as Mock).mockReturnValue('node_modules/\n.env\n');

      await generateCommand(defaultOptions);

      expect(appendFileSync).toHaveBeenCalledWith(
        join('/test/output', '.gitignore'),
        expect.stringContaining('# AI Generated (by shared-ai-configs)')
      );
    });

    it('should not modify .gitignore if AI marker already exists', async () => {
      // Use config with only Claude enabled to match the mock gitignore content
      const configClaudeOnly: Config = {
        ...minimalConfig,
        generation: { targets: { claude: true, cursor: false } },
      };
      (loadConfig as Mock).mockReturnValue(configClaudeOnly);

      (existsSync as Mock).mockImplementation((path: string) => {
        if (path.endsWith('.gitignore')) return true;
        if (path.includes('templates')) return true;
        return false;
      });
      (readFileSync as Mock).mockReturnValue(
        'node_modules/\n# AI Generated (by shared-ai-configs)\n.claude/\nCLAUDE.md\n.env.aiproject\n'
      );

      await generateCommand(defaultOptions);

      expect(logger.info).toHaveBeenCalledWith('.gitignore already has all AI config entries');
    });

    it('should add missing entries to existing .gitignore with AI marker', async () => {
      const configWithCursor: Config = {
        ...minimalConfig,
        services: { ide: { primary: 'Cursor' } },
        generation: { targets: { cursor: true } },
      };
      (loadConfig as Mock).mockReturnValue(configWithCursor);

      (existsSync as Mock).mockImplementation((path: string) => {
        if (path.endsWith('.gitignore')) return true;
        if (path.includes('templates')) return true;
        return false;
      });
      // Existing gitignore has AI marker but missing .cursorrules
      (readFileSync as Mock).mockReturnValue(
        'node_modules/\n# AI Generated (by shared-ai-configs)\n.claude/\nCLAUDE.md\n.cursor/\n'
      );

      await generateCommand(defaultOptions);

      // Should add missing entries
      expect(appendFileSync).toHaveBeenCalledWith(
        join('/test/output', '.gitignore'),
        expect.stringContaining('.cursorrules')
      );
    });

    it('should skip .gitignore update when gitignore_entries is false', async () => {
      const configNoGitignore: Config = {
        ...minimalConfig,
        generation: {
          gitignore_entries: false,
        },
      };
      (loadConfig as Mock).mockReturnValue(configNoGitignore);

      (existsSync as Mock).mockImplementation((path: string) => {
        if (path.endsWith('.gitignore')) return false;
        if (path.includes('templates')) return true;
        return false;
      });

      await generateCommand(defaultOptions);

      // Should not create or modify .gitignore
      expect(writeFileSync).not.toHaveBeenCalledWith(
        join('/test/output', '.gitignore'),
        expect.any(String)
      );
    });
  });

  // ==========================================================================
  // Target normalization tests
  // ==========================================================================
  describe('target normalization', () => {
    it('should handle boolean target format (legacy)', async () => {
      const legacyConfig: Config = {
        ...minimalConfig,
        generation: {
          targets: {
            claude: true,
            cursor: false,
          },
        },
      };
      (loadConfig as Mock).mockReturnValue(legacyConfig);

      await generateCommand(defaultOptions);

      // Claude should be generated, cursor should not
      expect(logger.info).toHaveBeenCalledWith('Targets: Claude=true, Cursor=false');
    });

    it('should handle object target format with features', async () => {
      const objectConfig: Config = {
        ...minimalConfig,
        generation: {
          targets: {
            claude: {
              enabled: true,
              features: ['main', 'rules'],
            },
            cursor: {
              enabled: false,
            },
          },
        },
      };
      (loadConfig as Mock).mockReturnValue(objectConfig);

      await generateCommand(defaultOptions);

      expect(logger.info).toHaveBeenCalledWith('Targets: Claude=true, Cursor=false');
    });

    it('should default cursor to enabled when IDE primary is Cursor', async () => {
      const cursorIdeConfig: Config = {
        ...minimalConfig,
        services: {
          ide: { primary: 'Cursor' },
        },
        // No explicit cursor target
      };
      (loadConfig as Mock).mockReturnValue(cursorIdeConfig);

      await generateCommand(defaultOptions);

      // Cursor should be enabled by default
      expect(logger.info).toHaveBeenCalledWith('Targets: Claude=true, Cursor=true');
    });
  });

  // ==========================================================================
  // Strategy tests (generate vs symlink)
  // ==========================================================================
  describe('generation strategy', () => {
    it('should use generate strategy by default (copy files)', async () => {
      await generateCommand(defaultOptions);

      expect(logger.table).toHaveBeenCalledWith(
        expect.objectContaining({
          Strategy: 'generate',
        })
      );
    });

    it('should respect symlink strategy from config', async () => {
      const symlinkConfig: Config = {
        ...minimalConfig,
        generation: {
          strategy: 'symlink',
        },
      };
      (loadConfig as Mock).mockReturnValue(symlinkConfig);

      await generateCommand(defaultOptions);

      expect(logger.table).toHaveBeenCalledWith(
        expect.objectContaining({
          Strategy: 'symlink',
        })
      );
    });
  });
});
