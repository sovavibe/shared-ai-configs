// Types for AI Project Configuration v2 (services-based grouping)

export interface ProjectConfig {
  name: string;
  short_name?: string;
  description?: string;
  role?: string;
  language?: 'Russian' | 'English';
}

export interface StackConfig {
  type: 'react' | 'node' | 'nextjs' | 'java' | 'python';
  framework?: {
    name: string;
    version: string;
  };
  language?: {
    name: string;
    version: string;
  };
  build?: {
    tool: string;
    version: string;
  };
  state?: {
    server: string;
    client: string;
  };
  ui?: {
    library: string;
    version: string;
    styling?: string;
  };
  api?: {
    codegen?: string;
    client?: string;
    mocks?: string;
  };
  testing?: string;
  linter?: string;
  auth?: string;
  runtime?: string;
}

export interface ArchitectureConfig {
  type?: 'FSD' | 'Clean' | 'Layered' | 'Modular';
  structure?: string;
  import_rule?: string;
}

// Services configuration (new in v2)
export interface IDEServiceConfig {
  primary?: 'Cursor' | 'VSCode' | 'WebStorm' | 'Neovim';
  secondary?: 'Claude Code' | 'Cursor' | 'VSCode' | 'none';
  dual_mode?: boolean;
  paths?: {
    claude?: string;
    cursor?: string;
  };
}

export interface VCSServiceConfig {
  type?: 'gitlab' | 'github' | 'bitbucket' | 'none';
  main_branch?: string;
  project_id?: number;
  group?: string;
}

export interface TaskTrackingServiceConfig {
  type?: 'beads' | 'jira' | 'linear' | 'github-issues' | 'none';
  key_prefix?: string;
  paths?: {
    beads?: string;
    perles?: string;
  };
  jira?: {
    instance?: string;
    board_id?: number;
  };
}

export interface MCPServerConfig {
  enabled: boolean;
}

export interface MCPServiceConfig {
  hindsight?: MCPServerConfig;
  snyk?: MCPServerConfig;
  context7?: MCPServerConfig;
  pal?: MCPServerConfig;
  memory_bank?: MCPServerConfig;
  figma?: MCPServerConfig;
  browser?: MCPServerConfig;
}

export interface ServicesConfig {
  ide?: IDEServiceConfig;
  vcs?: VCSServiceConfig;
  task_tracking?: TaskTrackingServiceConfig;
  mcp?: MCPServiceConfig;
}

export interface CommandsConfig {
  dev: string;
  build: string;
  lint?: string;
  test?: string;
  codegen?: string;
  quality_gates?: string;
  [key: string]: string | undefined;
}

export interface OptionsConfig {
  dev_server_port?: number;
  token_optimization?: string;
  sdd_enabled?: boolean;
  orchestration?: boolean;
  agentic_workflows?: boolean;
  model_switching?: string;
  skip_rules?: {
    enhancement?: string;
    bugfix?: string;
    simple_fix?: string;
  };
}

export interface RulesConfig {
  critical?: string[];
  custom?: string[];
}

export interface GenerationTargetsConfig {
  claude?: boolean;
  cursor?: boolean;
  beads?: boolean;
  perles?: boolean;
  ignore_files?: boolean;
  claude_md?: boolean;
}

export interface GenerationConfig {
  targets?: GenerationTargetsConfig;
  strategy?: 'generate' | 'symlink' | 'copy';
}

// Main config interface for v2
export interface ConfigV2 {
  project: ProjectConfig;
  stack: StackConfig;
  architecture?: ArchitectureConfig;
  services?: ServicesConfig;
  commands: CommandsConfig;
  options?: OptionsConfig;
  rules?: RulesConfig;
  generation?: GenerationConfig;
}

// CLI options (unchanged)
export interface GenerateOptions {
  config: string;
  output: string;
  dryRun?: boolean;
  force?: boolean;
}

export interface InitOptions {
  force?: boolean;
  stack?: string;
  version?: 'v1' | 'v2';
}

export interface ValidateOptions {
  config: string;
}

export interface StatusOptions {
  config: string;
}

// Helper type guards
export function isConfigV2(config: any): config is ConfigV2 {
  return 'services' in config || !('integrations' in config);
}

// Backward compatibility: convert v1 to v2 format
export function normalizeConfig(config: any): ConfigV2 {
  if (isConfigV2(config)) {
    return config as ConfigV2;
  }

  // Convert v1 to v2
  const v2: ConfigV2 = {
    project: config.project,
    stack: config.stack,
    architecture: config.architecture,
    commands: config.commands,
    options: config.options,
    services: {
      ide: config.ide ? {
        primary: config.ide.primary,
        secondary: config.ide.secondary,
        dual_mode: config.ide.dual_mode,
        paths: {
          claude: config.paths?.claude_docs,
          cursor: config.paths?.cursor_rules?.replace('/rules/', '/') || '.cursor/'
        }
      } : undefined,
      vcs: config.integrations?.vcs,
      task_tracking: config.integrations?.task_tracking ? {
        type: config.integrations.task_tracking.type?.toLowerCase() as any,
        key_prefix: config.integrations.task_tracking.key_prefix,
        paths: {
          beads: '.beads/',
          perles: '.perles/'
        }
      } : undefined,
      mcp: config.integrations?.mcp
    },
    rules: {
      critical: [],
      custom: []
    },
    generation: config.generation ? {
      targets: {
        claude_md: config.generation.targets?.claude_md,
        cursor: config.generation.targets?.cursor_rules,
        claude: config.generation.targets?.hooks,
        beads: false,
        perles: false,
        ignore_files: false
      },
      strategy: config.generation.strategy
    } : undefined
  };

  return v2;
}
