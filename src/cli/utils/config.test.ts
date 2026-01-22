import { describe, it, expect } from 'vitest';
import { isFeatureEnabled, mergeConfigs, getDefaultConfig, CONFIG_DEFAULTS } from './config.js';
import type { Config } from '../types.js';

describe('CONFIG_DEFAULTS', () => {
  it('should have required language defaults', () => {
    expect(CONFIG_DEFAULTS.languages.chat).toBe('English');
    expect(CONFIG_DEFAULTS.languages.code).toBe('English');
  });

  it('should have required service defaults', () => {
    expect(CONFIG_DEFAULTS.services.ide.paths.claude).toBe('.claude/');
    expect(CONFIG_DEFAULTS.services.ide.paths.cursor).toBe('.cursor/');
  });

  it('should have MCP defaults disabled by default', () => {
    expect(CONFIG_DEFAULTS.services.mcp.hindsight.enabled).toBe(false);
    expect(CONFIG_DEFAULTS.services.mcp.snyk.enabled).toBe(false);
    expect(CONFIG_DEFAULTS.services.mcp.context7.enabled).toBe(false);
  });

  it('should have generation defaults', () => {
    expect(CONFIG_DEFAULTS.generation.targets.claude).toBe(true);
    expect(CONFIG_DEFAULTS.generation.targets.cursor).toBe(true);
    expect(CONFIG_DEFAULTS.generation.strategy).toBe('generate');
  });
});

describe('isFeatureEnabled', () => {
  const config: Config = {
    project: { name: 'test', description: 'test' },
    stack: { type: 'react' },
    services: {
      mcp: {
        hindsight: { enabled: true },
        snyk: { enabled: false },
      },
      task_tracking: { type: 'beads' },
    },
    options: {
      orchestration: true,
      sdd_enabled: false,
    },
    generation: {
      targets: { claude: true, cursor: false },
    },
  } as Config;

  it('should return true for enabled boolean features', () => {
    expect(isFeatureEnabled(config, 'options.orchestration')).toBe(true);
  });

  it('should return false for disabled boolean features', () => {
    expect(isFeatureEnabled(config, 'options.sdd_enabled')).toBe(false);
  });

  it('should return true for enabled MCP features', () => {
    expect(isFeatureEnabled(config, 'services.mcp.hindsight')).toBe(true);
  });

  it('should return false for disabled MCP features', () => {
    expect(isFeatureEnabled(config, 'services.mcp.snyk')).toBe(false);
  });

  it('should return false for non-existent paths', () => {
    expect(isFeatureEnabled(config, 'services.mcp.nonexistent')).toBe(false);
  });

  it('should handle deeply nested paths', () => {
    expect(isFeatureEnabled(config, 'generation.targets.claude')).toBe(true);
    expect(isFeatureEnabled(config, 'generation.targets.cursor')).toBe(false);
  });
});

describe('mergeConfigs', () => {
  it('should merge simple configs', () => {
    const base = { project: { name: 'base' } } as Partial<Config>;
    const override = { project: { name: 'override' } } as Partial<Config>;

    const result = mergeConfigs(base, override);
    expect(result.project?.name).toBe('override');
  });

  it('should shallow merge nested objects (1 level deep)', () => {
    // Note: mergeConfigs does shallow merge at 1 level deep
    // So nested objects get replaced, not deep merged
    const base = {
      services: { vcs: { type: 'github' } },
    } as Partial<Config>;
    const override = {
      services: { vcs: { main_branch: 'develop' } },
    } as Partial<Config>;

    const result = mergeConfigs(base, override);
    // vcs gets replaced entirely, so type is lost
    expect(result.services?.vcs?.main_branch).toBe('develop');
    expect(result.services?.vcs?.type).toBeUndefined();
  });

  it('should handle multiple configs', () => {
    const a = { project: { name: 'a' } } as Partial<Config>;
    const b = { project: { description: 'b' } } as Partial<Config>;
    const c = { project: { role: 'c' } } as Partial<Config>;

    const result = mergeConfigs(a, b, c);
    expect(result.project?.name).toBe('a');
    expect(result.project?.description).toBe('b');
    expect(result.project?.role).toBe('c');
  });
});

describe('getDefaultConfig', () => {
  it('should return react defaults', () => {
    const config = getDefaultConfig('/path/to/myproject', 'react');

    expect(config.project?.name).toBe('myproject');
    expect(config.stack?.type).toBe('react');
    expect(config.stack?.framework?.name).toBe('React');
  });

  it('should return node defaults', () => {
    const config = getDefaultConfig('/path/to/api', 'node');

    expect(config.stack?.type).toBe('node');
    expect(config.stack?.framework?.name).toBe('Node.js');
  });

  it('should return python defaults with correct commands', () => {
    const config = getDefaultConfig('/path/to/app', 'python');

    expect(config.stack?.type).toBe('python');
    expect(config.commands?.test).toBe('pytest');
    expect(config.commands?.lint).toBe('ruff check .');
  });

  it('should return java defaults with maven commands', () => {
    const config = getDefaultConfig('/path/to/service', 'java');

    expect(config.stack?.type).toBe('java');
    expect(config.commands?.build).toBe('mvn package');
    expect(config.commands?.test).toBe('mvn test');
  });

  it('should extract project name from path', () => {
    const config = getDefaultConfig('/Users/dev/projects/my-awesome-app', 'react');
    expect(config.project?.name).toBe('my-awesome-app');
  });
});
