import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import type { Config } from '../types.js';

// Mock child_process
vi.mock('child_process', () => ({
  execSync: vi.fn(),
}));

// Mock fs
vi.mock('fs', () => ({
  existsSync: vi.fn(),
}));

// Mock os platform
vi.mock('os', () => ({
  platform: vi.fn(() => 'darwin'),
}));

// Mock logger to prevent console output during tests
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

// Mock config loader
vi.mock('../utils/config.js', () => ({
  loadConfig: vi.fn(),
  CONFIG_DEFAULTS: {
    services: {
      ide: {
        paths: {
          cursor: '.cursor/',
        },
      },
      task_tracking: {
        paths: {
          beads: '.beads/',
        },
      },
    },
  },
}));

// Import after mocks are set up
const mockExecSync = vi.mocked(execSync);
const mockExistsSync = vi.mocked(existsSync);

describe('doctor command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset process.version for node checks
    vi.stubGlobal('process', {
      ...process,
      version: 'v20.10.0',
      cwd: () => '/test/project',
      exit: vi.fn(),
      env: {},
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('checkNodeVersion', () => {
    it('should return ok for Node.js 18+', async () => {
      // Import fresh module to get check functions
      const { doctorCommand } = await import('./doctor.js');

      // We test via the main command - node version is always checked
      mockExistsSync.mockReturnValue(false);
      mockExecSync.mockImplementation((cmd: string) => {
        if (cmd === 'npm --version') return '10.2.0';
        if (cmd === 'git --version') return 'git version 2.39.0';
        throw new Error('Command not found');
      });

      // Run command (will call process.exit)
      await doctorCommand();

      // Check logger was called with success for Node.js
      const { logger } = await import('../utils/logger.js');
      expect(logger.success).toHaveBeenCalledWith(expect.stringContaining('Node.js'));
    });

    it('should return error for Node.js < 18', async () => {
      vi.stubGlobal('process', {
        ...process,
        version: 'v16.14.0',
        cwd: () => '/test/project',
        exit: vi.fn(),
        env: {},
      });

      // Clear module cache to pick up new process.version
      vi.resetModules();

      // Re-mock dependencies after reset
      vi.doMock('child_process', () => ({ execSync: vi.fn() }));
      vi.doMock('fs', () => ({ existsSync: vi.fn(() => false) }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      const childProcess = await import('child_process');
      const fs = await import('fs');

      vi.mocked(fs.existsSync).mockReturnValue(false);
      vi.mocked(childProcess.execSync).mockImplementation((cmd: string) => {
        if (cmd === 'npm --version') return '10.2.0';
        if (cmd === 'git --version') return 'git version 2.39.0';
        throw new Error('Command not found');
      });

      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Node.js: Version v16.14.0 is too old')
      );
    });
  });

  describe('checkPackageManager', () => {
    beforeEach(() => {
      vi.resetModules();
    });

    it('should return ok when npm is installed', async () => {
      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({ existsSync: vi.fn(() => false) }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      expect(logger.success).toHaveBeenCalledWith(expect.stringContaining('npm: v10.2.0'));
    });

    it('should return error when npm is not installed', async () => {
      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'git --version') return 'git version 2.39.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({ existsSync: vi.fn(() => false) }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('npm: Not found'));
    });
  });

  describe('checkConfigFile', () => {
    beforeEach(() => {
      vi.resetModules();
    });

    it('should return ok when .ai-project.yaml exists', async () => {
      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({
        existsSync: vi.fn((path: string) => {
          if (path.endsWith('.ai-project.yaml')) return true;
          return false;
        }),
      }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(() => ({
          project: { name: 'test' },
          stack: { type: 'react' },
          commands: { dev: 'npm run dev', build: 'npm run build' },
        })),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      expect(logger.success).toHaveBeenCalledWith(
        expect.stringContaining('Config: .ai-project.yaml found')
      );
    });

    it('should return warn when .ai-project.yaml does not exist', async () => {
      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({
        existsSync: vi.fn(() => false),
      }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Config: .ai-project.yaml not found')
      );
    });
  });

  describe('checkClaudeCode', () => {
    beforeEach(() => {
      vi.resetModules();
    });

    it('should return ok when claude CLI is installed', async () => {
      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          if (cmd === 'claude --version') return '1.0.15';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({ existsSync: vi.fn(() => false) }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      expect(logger.success).toHaveBeenCalledWith(expect.stringContaining('Claude Code: 1.0.15'));
    });

    it('should return warn when claude CLI is not installed', async () => {
      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({ existsSync: vi.fn(() => false) }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Claude Code: Not installed')
      );
    });
  });

  describe('checkCursor', () => {
    beforeEach(() => {
      vi.resetModules();
    });

    it('should return ok when .cursor directory exists', async () => {
      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({
        existsSync: vi.fn((path: string) => {
          if (path.includes('.cursor')) return true;
          return false;
        }),
      }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      expect(logger.success).toHaveBeenCalledWith(expect.stringContaining('Cursor:'));
      expect(logger.success).toHaveBeenCalledWith(expect.stringContaining('directory found'));
    });

    it('should return warn when .cursor directory does not exist', async () => {
      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({ existsSync: vi.fn(() => false) }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Cursor:'));
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('directory not found'));
    });
  });

  describe('checkBeads', () => {
    beforeEach(() => {
      vi.resetModules();
    });

    it('should return ok when bd CLI is installed and .beads exists', async () => {
      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          if (cmd === 'bd --version') return 'beads 1.0.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({
        existsSync: vi.fn((path: string) => {
          if (path.includes('.beads')) return true;
          return false;
        }),
      }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      expect(logger.success).toHaveBeenCalledWith(expect.stringContaining('Beads: beads 1.0.0'));
    });

    it('should return warn when .beads exists but bd CLI is not installed', async () => {
      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({
        existsSync: vi.fn((path: string) => {
          if (path.includes('.beads')) return true;
          return false;
        }),
      }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Beads:'));
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('bd command not available'));
    });
  });

  describe('checkGitHubCLI', () => {
    beforeEach(() => {
      vi.resetModules();
    });

    it('should return ok when gh CLI is installed', async () => {
      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          if (cmd === 'gh --version')
            return 'gh version 2.40.0 (2024-01-10)\nhttps://github.com/cli/cli/releases/tag/v2.40.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({ existsSync: vi.fn(() => false) }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      expect(logger.success).toHaveBeenCalledWith(
        expect.stringContaining('GitHub CLI (gh): gh version 2.40.0')
      );
    });

    it('should return warn when gh CLI is not installed on macOS', async () => {
      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({ existsSync: vi.fn(() => false) }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('GitHub CLI (gh): Not installed')
      );
    });
  });

  describe('checkGitLabCLI', () => {
    beforeEach(() => {
      vi.resetModules();
    });

    it('should return ok when glab CLI is installed', async () => {
      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          if (cmd === 'glab --version') return 'glab version 1.30.0\nmore info';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({ existsSync: vi.fn(() => false) }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      expect(logger.success).toHaveBeenCalledWith(
        expect.stringContaining('GitLab CLI (glab): glab version 1.30.0')
      );
    });

    it('should return warn when glab CLI is not installed', async () => {
      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({ existsSync: vi.fn(() => false) }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('GitLab CLI (glab): Not installed')
      );
    });
  });

  describe('checkGit', () => {
    beforeEach(() => {
      vi.resetModules();
    });

    it('should return ok when git is installed', async () => {
      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({ existsSync: vi.fn(() => false) }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      expect(logger.success).toHaveBeenCalledWith(
        expect.stringContaining('Git: git version 2.39.0')
      );
    });

    it('should return error when git is not installed', async () => {
      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({ existsSync: vi.fn(() => false) }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Git: Not installed'));
    });
  });

  describe('checkMCPServers', () => {
    beforeEach(() => {
      vi.resetModules();
    });

    it('should check enabled MCP servers', async () => {
      const mockConfig: Config = {
        project: { name: 'test' },
        stack: { type: 'react' },
        commands: { dev: 'npm run dev', build: 'npm run build' },
        services: {
          mcp: {
            hindsight: { enabled: true },
            context7: { enabled: true },
            snyk: { enabled: false },
          },
        },
      };

      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({
        existsSync: vi.fn((path: string) => {
          if (path.endsWith('.ai-project.yaml')) return true;
          return false;
        }),
      }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(() => mockConfig),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      expect(logger.success).toHaveBeenCalledWith(expect.stringContaining('MCP: Hindsight'));
      expect(logger.success).toHaveBeenCalledWith(expect.stringContaining('MCP: Context7'));
    });

    it('should warn when Snyk is enabled but SNYK_TOKEN not set', async () => {
      const mockConfig: Config = {
        project: { name: 'test' },
        stack: { type: 'react' },
        commands: { dev: 'npm run dev', build: 'npm run build' },
        services: {
          mcp: {
            snyk: { enabled: true },
          },
        },
      };

      vi.stubGlobal('process', {
        ...process,
        version: 'v20.10.0',
        cwd: () => '/test/project',
        exit: vi.fn(),
        env: {}, // No SNYK_TOKEN
      });

      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({
        existsSync: vi.fn((path: string) => {
          if (path.endsWith('.ai-project.yaml')) return true;
          return false;
        }),
      }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(() => mockConfig),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('MCP: Snyk'));
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('SNYK_TOKEN not set'));
    });

    it('should check Snyk CLI when enabled and token is set', async () => {
      const mockConfig: Config = {
        project: { name: 'test' },
        stack: { type: 'react' },
        commands: { dev: 'npm run dev', build: 'npm run build' },
        services: {
          mcp: {
            snyk: { enabled: true },
          },
        },
      };

      vi.stubGlobal('process', {
        ...process,
        version: 'v20.10.0',
        cwd: () => '/test/project',
        exit: vi.fn(),
        env: { SNYK_TOKEN: 'test-token' },
      });

      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          if (cmd === 'snyk --version') return '1.1234.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({
        existsSync: vi.fn((path: string) => {
          if (path.endsWith('.ai-project.yaml')) return true;
          return false;
        }),
      }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(() => mockConfig),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      expect(logger.success).toHaveBeenCalledWith(expect.stringContaining('MCP: Snyk'));
    });

    it('should warn when Figma is enabled but FIGMA_API_KEY not set', async () => {
      const mockConfig: Config = {
        project: { name: 'test' },
        stack: { type: 'react' },
        commands: { dev: 'npm run dev', build: 'npm run build' },
        services: {
          mcp: {
            figma: { enabled: true },
          },
        },
      };

      vi.stubGlobal('process', {
        ...process,
        version: 'v20.10.0',
        cwd: () => '/test/project',
        exit: vi.fn(),
        env: {}, // No FIGMA_API_KEY
      });

      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({
        existsSync: vi.fn((path: string) => {
          if (path.endsWith('.ai-project.yaml')) return true;
          return false;
        }),
      }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(() => mockConfig),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('MCP: Figma'));
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('FIGMA_API_KEY not set'));
    });
  });

  describe('doctorCommand integration', () => {
    beforeEach(() => {
      vi.resetModules();
    });

    it('should exit with code 1 when errors exist', async () => {
      const mockExit = vi.fn();

      vi.stubGlobal('process', {
        ...process,
        version: 'v16.0.0', // Old version - will cause error
        cwd: () => '/test/project',
        exit: mockExit,
        env: {},
      });

      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({ existsSync: vi.fn(() => false) }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should not exit when only warnings exist', async () => {
      const mockExit = vi.fn();

      vi.stubGlobal('process', {
        ...process,
        version: 'v20.10.0',
        cwd: () => '/test/project',
        exit: mockExit,
        env: {},
      });

      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({ existsSync: vi.fn(() => false) }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      // Should not exit with 1 (warnings only)
      expect(mockExit).not.toHaveBeenCalledWith(1);
    });

    it('should show success message when all checks pass', async () => {
      const mockExit = vi.fn();

      vi.stubGlobal('process', {
        ...process,
        version: 'v20.10.0',
        cwd: () => '/test/project',
        exit: mockExit,
        env: {},
      });

      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          if (cmd === 'claude --version') return '1.0.15';
          if (cmd === 'gh --version') return 'gh version 2.40.0';
          if (cmd === 'glab --version') return 'glab version 1.30.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({
        existsSync: vi.fn((path: string) => {
          if (path.endsWith('.ai-project.yaml')) return true;
          if (path.includes('.cursor')) return true;
          return false;
        }),
      }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(() => ({
          project: { name: 'test' },
          stack: { type: 'react' },
          commands: { dev: 'npm run dev', build: 'npm run build' },
        })),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      expect(logger.success).toHaveBeenCalledWith('All checks passed!');
    });

    it('should check VCS CLI based on config type', async () => {
      const mockConfig: Config = {
        project: { name: 'test' },
        stack: { type: 'react' },
        commands: { dev: 'npm run dev', build: 'npm run build' },
        services: {
          vcs: { type: 'gitlab' },
        },
      };

      vi.stubGlobal('process', {
        ...process,
        version: 'v20.10.0',
        cwd: () => '/test/project',
        exit: vi.fn(),
        env: {},
      });

      const execCalls: string[] = [];
      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          execCalls.push(cmd);
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          if (cmd === 'glab --version') return 'glab version 1.30.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({
        existsSync: vi.fn((path: string) => {
          if (path.endsWith('.ai-project.yaml')) return true;
          return false;
        }),
      }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(() => mockConfig),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      // Should only check glab, not gh
      expect(execCalls).toContain('glab --version');
      expect(execCalls).not.toContain('gh --version');
    });

    it('should check beads when task_tracking type is beads', async () => {
      const mockConfig: Config = {
        project: { name: 'test' },
        stack: { type: 'react' },
        commands: { dev: 'npm run dev', build: 'npm run build' },
        services: {
          task_tracking: { type: 'beads' },
        },
      };

      vi.stubGlobal('process', {
        ...process,
        version: 'v20.10.0',
        cwd: () => '/test/project',
        exit: vi.fn(),
        env: {},
      });

      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          if (cmd === 'bd --version') return 'beads 1.0.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({
        existsSync: vi.fn((path: string) => {
          if (path.endsWith('.ai-project.yaml')) return true;
          return false;
        }),
      }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(() => mockConfig),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      expect(logger.success).toHaveBeenCalledWith(expect.stringContaining('Beads: beads 1.0.0'));
    });
  });

  describe('platform-specific behavior', () => {
    beforeEach(() => {
      vi.resetModules();
    });

    it('should show Linux-specific fix for GitHub CLI on Linux', async () => {
      vi.stubGlobal('process', {
        ...process,
        version: 'v20.10.0',
        cwd: () => '/test/project',
        exit: vi.fn(),
        env: {},
      });

      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({ existsSync: vi.fn(() => false) }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'linux') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      // The fix suggestion should contain apt for Linux
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('sudo apt install gh'));
    });

    it('should show macOS-specific fix for GitHub CLI on macOS', async () => {
      vi.stubGlobal('process', {
        ...process,
        version: 'v20.10.0',
        cwd: () => '/test/project',
        exit: vi.fn(),
        env: {},
      });

      vi.doMock('child_process', () => ({
        execSync: vi.fn((cmd: string) => {
          if (cmd === 'npm --version') return '10.2.0';
          if (cmd === 'git --version') return 'git version 2.39.0';
          throw new Error('not found');
        }),
      }));
      vi.doMock('fs', () => ({ existsSync: vi.fn(() => false) }));
      vi.doMock('os', () => ({ platform: vi.fn(() => 'darwin') }));
      vi.doMock('../utils/logger.js', () => ({
        logger: {
          info: vi.fn(),
          success: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
          debug: vi.fn(),
          header: vi.fn(),
        },
      }));
      vi.doMock('../utils/config.js', () => ({
        loadConfig: vi.fn(),
        CONFIG_DEFAULTS: {
          services: {
            ide: { paths: { cursor: '.cursor/' } },
            task_tracking: { paths: { beads: '.beads/' } },
          },
        },
      }));

      const { doctorCommand } = await import('./doctor.js');
      await doctorCommand();

      const { logger } = await import('../utils/logger.js');
      // The fix suggestion should contain brew for macOS
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('brew install gh'));
    });
  });
});
