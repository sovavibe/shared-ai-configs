// Types for AI Project Configuration (services-based grouping)

export interface ProjectConfig {
  name: string;
  short_name?: string;
  description?: string;
  role?: string;
}

export interface LanguagesConfig {
  chat?: 'Russian' | 'English';
  code?: 'English';
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

// Services configuration
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
  api_key_env?: string; // Environment variable name for API key (e.g., "CONTEXT7_API_KEY")
  url?: string; // URL for HTTP-based MCP servers
  command?: string; // Command to run for stdio-based MCP servers (e.g., "npx", "node")
  args?: string[]; // Command arguments for stdio-based MCP servers
  env?: Record<string, string>; // Environment variables to pass to the MCP server
}

export interface MCPServiceConfig {
  /** Hindsight Alice MCP - long-term memory (HTTP: localhost:8888) */
  hindsight?: MCPServerConfig;
  /** Snyk MCP - security scanning (stdio: npx snyk@latest mcp) */
  snyk?: MCPServerConfig;
  /** Context7 MCP - library documentation lookup (stdio: npx @upstash/context7-mcp) */
  context7?: MCPServerConfig;
  /** Allpepper Memory Bank MCP - project memory (stdio: npx @allpepper/memory-bank-mcp) */
  memory_bank?: MCPServerConfig;
  /** Figma MCP - design-to-code (HTTP: mcp.figma.com) */
  figma?: MCPServerConfig;
  /**
   * Browser/z.ai services - enables multiple MCP servers:
   * - zai-mcp-server (stdio) - image analysis, UI conversion
   * - web-search-prime (HTTP) - web search
   * - web-reader (HTTP) - URL content fetching
   * - zread (HTTP) - GitHub repo search/read
   * Requires Z_AI_API_KEY environment variable.
   */
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
  never?: string[];
  always?: string[];
  custom?: string[];
}

export interface PluginConfig {
  name: string;
  version?: string;
  source?: 'npm' | 'cargo' | 'pip' | 'brew' | 'binary';
  config?: Record<string, unknown>;
}

export interface PluginsConfig {
  install?: PluginConfig[];
  platform?: {
    darwin?: Record<string, unknown>;
    linux?: Record<string, unknown>;
  };
}

// Target configuration for each IDE/Agent
export interface TargetConfig {
  enabled?: boolean;
  output_dir?: string;
  features?: string[];
}

export interface ClaudeTargetConfig extends TargetConfig {
  features?: ('rules' | 'hooks' | 'commands' | 'docs' | 'settings' | 'main')[];
}

export interface CursorTargetConfig extends TargetConfig {
  features?: (
    | 'rules'
    | 'hooks'
    | 'commands'
    | 'skills'
    | 'agents'
    | 'notepads'
    | 'mcp'
    | 'cursorrules'
  )[];
}

// Future Kilo agent support - extends TargetConfig with no additional properties yet
export type KiloTargetConfig = TargetConfig;

// Targets can be either boolean (legacy) or object (new)
export interface GenerationTargetsConfig {
  claude?: boolean | ClaudeTargetConfig;
  cursor?: boolean | CursorTargetConfig;
  kilo?: boolean | KiloTargetConfig;
  // Legacy boolean options for backward compatibility
  beads?: boolean;
  perles?: boolean;
  ignore_files?: boolean;
  claude_md?: boolean;
}

export interface GenerationCommonConfig {
  sdlc_workflow?: boolean;
  beads_tracking?: boolean;
  quality_gates?: boolean;
  mcp_integration?: boolean;
}

export interface GenerationConfig {
  targets?: GenerationTargetsConfig;
  common?: GenerationCommonConfig;
  strategy?: 'generate' | 'symlink' | 'copy';
  gitignore_entries?: boolean;
}

// Main config interface
export interface Config {
  project: ProjectConfig;
  languages?: LanguagesConfig;
  stack: StackConfig;
  architecture?: ArchitectureConfig;
  services?: ServicesConfig;
  commands: CommandsConfig;
  options?: OptionsConfig;
  rules?: RulesConfig;
  plugins?: PluginsConfig;
  generation?: GenerationConfig;
}

// CLI options
export interface GenerateOptions {
  config: string;
  output: string;
  dryRun?: boolean;
  force?: boolean;
  clean?: boolean;
}

export interface InitOptions {
  force?: boolean;
  stack?: string;
}

export interface ValidateOptions {
  config: string;
}

export interface StatusOptions {
  config: string;
}

export interface SetupOptions {
  config: string;
  skipPlugins?: boolean;
}
