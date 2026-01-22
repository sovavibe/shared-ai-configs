import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import yaml from 'js-yaml';
import AjvModule from 'ajv';
import { fileURLToPath } from 'url';
import type { Config } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to schema (relative to compiled dist/)
const schemaPath = join(__dirname, '../../../schema/ai-project.schema.json');

// Config defaults that match schema defaults - single source of truth
// These are applied when schema validation isn't available
const CONFIG_DEFAULTS = {
  languages: {
    chat: 'English' as const,
    code: 'English' as const,
  },
  services: {
    ide: {
      paths: {
        claude: '.claude/',
        cursor: '.cursor/',
      },
    },
    vcs: {
      main_branch: 'main',
    },
    task_tracking: {
      paths: {
        beads: '.beads/',
        perles: '.perles/',
      },
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
    strategy: 'generate' as const,
  },
};

export function loadConfig(configPath: string): Config {
  if (!existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }

  const content = readFileSync(configPath, 'utf-8');
  const config = yaml.load(content) as Config;

  // Apply defaults using AJV if schema is available (useDefaults: true)
  if (existsSync(schemaPath)) {
    const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
    const Ajv = AjvModule.default ?? AjvModule;
    // Disable strict mode to allow defaults in oneOf (for multi-target support)
    const ajv = new Ajv({ allErrors: true, useDefaults: true, strict: false });
    const validate = ajv.compile(schema);
    validate(config); // This mutates config, injecting defaults from schema
  }

  // Always apply manual defaults to ensure all required fields exist
  applyDefaults(config);

  return config;
}

// Deep merge defaults into config - only used when schema isn't available
function applyDefaults(config: Config): void {
  // Languages
  if (!config.languages) {
    config.languages = { ...CONFIG_DEFAULTS.languages };
  } else {
    config.languages.chat = config.languages.chat ?? CONFIG_DEFAULTS.languages.chat;
    config.languages.code = config.languages.code ?? CONFIG_DEFAULTS.languages.code;
  }

  // Services
  if (!config.services) {
    config.services = {};
  }

  // IDE paths
  if (!config.services.ide) {
    config.services.ide = {};
  }
  if (!config.services.ide.paths) {
    config.services.ide.paths = { ...CONFIG_DEFAULTS.services.ide.paths };
  } else {
    config.services.ide.paths.claude =
      config.services.ide.paths.claude ?? CONFIG_DEFAULTS.services.ide.paths.claude;
    config.services.ide.paths.cursor =
      config.services.ide.paths.cursor ?? CONFIG_DEFAULTS.services.ide.paths.cursor;
  }

  // VCS
  if (!config.services.vcs) {
    config.services.vcs = {};
  }
  config.services.vcs.main_branch =
    config.services.vcs.main_branch ?? CONFIG_DEFAULTS.services.vcs.main_branch;

  // Task tracking paths
  if (!config.services.task_tracking) {
    config.services.task_tracking = {};
  }
  if (!config.services.task_tracking.paths) {
    config.services.task_tracking.paths = { ...CONFIG_DEFAULTS.services.task_tracking.paths };
  } else {
    config.services.task_tracking.paths.beads =
      config.services.task_tracking.paths.beads ??
      CONFIG_DEFAULTS.services.task_tracking.paths.beads;
    config.services.task_tracking.paths.perles =
      config.services.task_tracking.paths.perles ??
      CONFIG_DEFAULTS.services.task_tracking.paths.perles;
  }

  // MCP defaults
  if (!config.services.mcp) {
    config.services.mcp = { ...CONFIG_DEFAULTS.services.mcp };
  } else {
    for (const [key, value] of Object.entries(CONFIG_DEFAULTS.services.mcp)) {
      const mcpConfig = config.services.mcp as Record<string, { enabled?: boolean }>;
      if (!mcpConfig[key]) {
        mcpConfig[key] = { ...value };
      } else {
        mcpConfig[key].enabled = mcpConfig[key].enabled ?? value.enabled;
      }
    }
  }

  // Options
  if (!config.options) {
    config.options = { ...CONFIG_DEFAULTS.options };
  } else {
    config.options.sdd_enabled = config.options.sdd_enabled ?? CONFIG_DEFAULTS.options.sdd_enabled;
    config.options.orchestration =
      config.options.orchestration ?? CONFIG_DEFAULTS.options.orchestration;
    config.options.agentic_workflows =
      config.options.agentic_workflows ?? CONFIG_DEFAULTS.options.agentic_workflows;
  }

  // Generation
  if (!config.generation) {
    config.generation = { ...CONFIG_DEFAULTS.generation };
  } else {
    if (!config.generation.targets) {
      config.generation.targets = { ...CONFIG_DEFAULTS.generation.targets };
    } else {
      for (const [key, value] of Object.entries(CONFIG_DEFAULTS.generation.targets)) {
        const targets = config.generation.targets as Record<string, boolean | undefined>;
        targets[key] = targets[key] ?? value;
      }
    }
    config.generation.strategy = config.generation.strategy ?? CONFIG_DEFAULTS.generation.strategy;
  }
}

export function validateConfig(config: Config): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Load schema
  if (!existsSync(schemaPath)) {
    return { valid: true, errors: ['Schema not found, skipping validation'] };
  }

  const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
  const Ajv = AjvModule.default ?? AjvModule;
  // Disable strict mode to allow oneOf with defaults (for multi-target support)
  const ajv = new Ajv({ allErrors: true, useDefaults: true, strict: false });
  const validate = ajv.compile(schema);

  const valid = validate(config);

  if (!valid && validate.errors) {
    for (const error of validate.errors) {
      errors.push(`${error.instancePath || '/'}: ${error.message}`);
    }
  }

  // Additional semantic validations
  if (config.services?.task_tracking?.type === 'beads') {
    // Beads requires paths - defaults already applied
  }

  return { valid: errors.length === 0, errors };
}

export function getDefaultConfig(projectPath: string, stack: string): Partial<Config> {
  const projectName = projectPath.split('/').pop() || 'project';

  const baseConfig: Partial<Config> = {
    project: {
      name: projectName,
      short_name: projectName,
      description: 'Project description',
      role: 'Senior Developer',
    },
    languages: CONFIG_DEFAULTS.languages,
    commands: {
      dev: 'npm run dev',
      build: 'npm run build',
      lint: 'npm run lint',
      test: 'npm run test',
    },
    services: {
      ide: {
        primary: 'Cursor',
        secondary: 'none',
        paths: CONFIG_DEFAULTS.services.ide.paths,
      },
      vcs: {
        type: 'github',
        main_branch: CONFIG_DEFAULTS.services.vcs.main_branch,
      },
      task_tracking: {
        type: 'none',
        paths: CONFIG_DEFAULTS.services.task_tracking.paths,
      },
      mcp: CONFIG_DEFAULTS.services.mcp,
    },
    options: {
      dev_server_port: 3000,
      ...CONFIG_DEFAULTS.options,
    },
    architecture: {
      structure: `src/
├── app/       # Entry, providers
├── pages/     # Route pages
├── shared/    # Shared components
└── index.ts   # Main entry`,
    },
    generation: CONFIG_DEFAULTS.generation,
  };

  // Stack-specific defaults
  const stackDefaults: Record<string, Partial<Config>> = {
    react: {
      stack: {
        type: 'react',
        framework: { name: 'React', version: '18' },
        language: { name: 'TypeScript', version: '5.5' },
        build: { tool: 'Vite', version: '5' },
        linter: 'ESLint',
      },
    },
    node: {
      stack: {
        type: 'node',
        framework: { name: 'Node.js', version: '20' },
        language: { name: 'TypeScript', version: '5.5' },
        linter: 'ESLint',
      },
    },
    nextjs: {
      stack: {
        type: 'nextjs',
        framework: { name: 'Next.js', version: '14' },
        language: { name: 'TypeScript', version: '5.5' },
        linter: 'ESLint',
      },
    },
    java: {
      stack: {
        type: 'java',
        framework: { name: 'Spring Boot', version: '3.2' },
        language: { name: 'Java', version: '21' },
        build: { tool: 'Maven', version: '3.9' },
        linter: 'Checkstyle',
      },
      commands: {
        dev: 'mvn spring-boot:run',
        build: 'mvn package',
        lint: 'mvn checkstyle:check',
        test: 'mvn test',
      },
    },
    python: {
      stack: {
        type: 'python',
        framework: { name: 'FastAPI', version: '0.109' },
        language: { name: 'Python', version: '3.12' },
        linter: 'Ruff',
      },
      commands: {
        dev: 'uvicorn main:app --reload',
        build: 'pip install -e .',
        lint: 'ruff check .',
        test: 'pytest',
      },
    },
  };

  return {
    ...baseConfig,
    ...stackDefaults[stack],
  };
}

export function mergeConfigs(...configs: Partial<Config>[]): Config {
  const result: any = {};

  for (const config of configs) {
    for (const [key, value] of Object.entries(config)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[key] = { ...result[key], ...value };
      } else {
        result[key] = value;
      }
    }
  }

  return result as Config;
}

// Helper to check if a feature is enabled
export function isFeatureEnabled(config: Config, feature: string): boolean {
  const parts = feature.split('.');
  let value: any = config;

  for (const part of parts) {
    value = value?.[part];
    if (value === undefined) return false;
  }

  if (typeof value === 'boolean') return value;
  if (typeof value === 'object' && 'enabled' in value) return value.enabled;

  return !!value;
}

// Export defaults for use in other modules (no magic strings!)
export { CONFIG_DEFAULTS };
