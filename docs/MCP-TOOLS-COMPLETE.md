# MCP Tools Complete Guide

**Version**: 2.0.0 | **Updated**: 2025-01-20 | **Status**: Consolidated

Master reference for all MCP (Model Context Protocol) servers available to Claude Code and Cursor IDE. This is the single source of truth for MCP tools, setup, configuration, troubleshooting, and best practices.

---

## Table of Contents

1. [Overview](#overview)
2. [Available MCP Servers](#available-mcp-servers)
3. [Setup & Configuration](#setup--configuration)
4. [MCP Services Reference](#mcp-services-reference)
5. [Tool Selection Matrix](#tool-selection-matrix)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)
8. [Security](#security)
9. [Maintenance](#maintenance)

---

## Overview

MCP servers provide AI agents (Claude Code, Cursor IDE) access to external tools, documentation, and services. Proper MCP configuration is **critical** for full workflow capabilities.

### Critical vs Optional Servers

**REQUIRED** (workflow breaks without these):

- **Beads** - Local task tracking (not MCP, but essential)
- **Hindsight Alice** - Long-term memory via MCP
- **Memory Bank** - Context preservation via MCP
- **Docker MCP Gateway** - Jira integration

**Optional but Recommended**:

- **Context7** - Library documentation (React, TypeScript, TanStack Query, etc.)
- **Web Search** (webSearchPrime) - Real-time information
- **ZRead** - GitHub repository exploration
- **Snyk** - Security scanning
- **ZAI Image Analysis** - Screenshot analysis
- **Claude in Chrome** - Browser automation

### Key Points

- MCP configuration is **per-user** at `~/.cursor/mcp.json` (not per-project)
- `.cursor/mcp.json.sample` in repo is the template
- Docker is **required** for Hindsight Alice and Docker MCP Gateway
- All MCP servers require environment variables for authentication

---

## Available MCP Servers

### 1. PAL (External AI Models)

**Purpose**: Access GPT-5, O3, GLM-4.7, and other frontier models for specialized analysis

**Available Models**:

```
OpenAI: gpt-5.2, gpt-5.1-codex, gpt-5-codex, o3, o3-pro, gpt-5-mini
Custom: glm-4.7 (Z.AI), llama3.2 (local)
```

**Tools**:

| Tool | Use For | Model Options |
|------|---------|---------------|
| `chat` | Quick questions, brainstorming | gpt-5.2, glm-4.7 (cheaper) |
| `thinkdeep` | Complex problem analysis, debugging | gpt-5.1-codex, gpt-5.2 |
| `planner` | Multi-step planning with branching | Opus, Sonnet |
| `consensus` | Multi-model decision making | Any combination |
| `codereview` | Structured code review | gpt-5.2, gpt-5.1-codex |
| `precommit` | Pre-commit validation | gpt-5.2 |
| `debug` | Root cause analysis | gpt-5.1-codex, gpt-5.2 |
| `challenge` | Challenge assumptions, devil's advocate | gpt-5.2 |
| `apilookup` | Current API documentation | gpt-5.2 |

**Usage Examples**:

```bash
# Quick chat with GPT-5
mcp__pal__chat "Explain React Server Components" --model gpt-5.2

# Deep debugging with code-focused model
mcp__pal__debug --hypothesis "Memory leak in useEffect" --model gpt-5.1-codex

# Cost-effective option for simple tasks
mcp__pal__chat "Simple question" --model glm-4.7

# Multi-model consensus
mcp__pal__consensus --models [{"model":"gpt-5.2"},{"model":"glm-4.7"}] "Best approach?"
```

---

### 2. Hindsight Alice (Long-term Memory)

**Purpose**: Persistent memory and reflection across sessions

**MCP Server ID**: `user-hindsight-alice`

**Tools**:

| Tool | Use For |
|------|---------|
| `retain` | Save important decisions and patterns |
| `recall` | Retrieve stored context and memories |
| `reflect` | Deep analysis with synthesis from memory |
| `list_banks` | Show all memory banks |
| `create_bank` | Create new memory bank |

**Memory Banks**:

- `patterns` - Architecture and code patterns (preserve!)
- `lessons` - Lessons learned (preserve!)
- `session` - Current work session
- `alice` - General preferences

**Usage Examples**:

```bash
# Save important decision
mcp__hindsight-alice__retain "Decision: Use Zustand over Redux for simplicity because..."

# Recall project context
mcp__hindsight-alice__recall "How do we handle API errors?"

# Deep analysis
mcp__hindsight-alice__reflect "What's the best approach given past decisions?"

# List all memory banks
mcp__hindsight-alice__list_banks
```

**Best Practices**:

- ✅ `retain` after every significant decision
- ✅ `recall` at session start
- ✅ `reflect` for complex choices
- ❌ NEVER delete `patterns` or `lessons` banks

---

### 3. Memory Bank (Project Memory)

**Purpose**: Project-specific research, analysis, and context storage

**MCP Server ID**: `user-allpepper-memory-bank`

**Tools**:

| Tool | Use For |
|------|---------|
| `list_projects` | Show all projects |
| `list_project_files` | List files in project |
| `memory_bank_read` | Read memory file |
| `memory_bank_write` | Create memory file |
| `memory_bank_update` | Update memory file |

**Core Memory Bank Files**:

- `activeContext.md` - Current work context
- `progress.md` - Task progress tracking
- `projectbrief.md` - Project overview
- `techContext.md` - Technical details
- `systemPatterns.md` - Code/architecture patterns
- `style-guide.md` - Style guidelines

**Usage Examples**:

```bash
# List all projects
mcp__allpepper-memory-bank__list_projects

# Write project memory
mcp__allpepper-memory-bank__memory_bank_write \
  --projectName "Front" \
  --fileName "decisions.md" \
  --content "..."

# Read memory
mcp__allpepper-memory-bank__memory_bank_read \
  --projectName "Front" \
  --fileName "activeContext.md"
```

---

### 4. MCP_DOCKER (Context7 + Jira + Confluence)

**Purpose**: Library documentation, task management, wiki access

**MCP Server ID**: `user-MCP_DOCKER`

#### Context7 (Library Documentation)

Access documentation for React, TypeScript, TanStack Query, and 100+ libraries.

**Common Libraries**:

| Library | Context7 ID |
|---------|-------------|
| TanStack Query | `/tanstack/query` |
| React | `/facebook/react` |
| Ant Design | `/ant-design/ant-design` |
| Zustand | `/pmndrs/zustand` |
| Vite | `/vitejs/vite` |
| Vitest | `/vitest-dev/vitest` |
| TypeScript | `/microsoft/typescript` |

**Usage**:

```bash
# Step 1: Find library ID
mcp__MCP_DOCKER__resolve-library-id "tanstack query"

# Step 2: Get specific documentation
mcp__MCP_DOCKER__get-library-docs "/tanstack/query" --topic "useMutation"

# One-liner example
mcp__MCP_DOCKER__get-library-docs "/facebook/react" --topic "useEffect cleanup"
```

#### Jira (Task Management)

```bash
# Search issues
mcp__MCP_DOCKER__jira_search "project = FRONT AND status = 'In Progress'"

# Get issue details
mcp__MCP_DOCKER__jira_get_issue "FRONT-123"

# Create issue
mcp__MCP_DOCKER__jira_create_issue \
  --project_key "FRONT" \
  --summary "Bug: ..." \
  --issue_type "Bug"

# Update issue
mcp__MCP_DOCKER__jira_update_issue "FRONT-123" --fields {status: "Done"}
```

#### Confluence (Wiki)

```bash
# Search pages
mcp__MCP_DOCKER__confluence_search "API documentation"

# Get page content
mcp__MCP_DOCKER__confluence_get_page --page_id "123456"

# Create page
mcp__MCP_DOCKER__confluence_create_page \
  --space_key "DEV" \
  --title "New Feature" \
  --content "..."
```

---

### 5. Snyk (Security Scanning)

**Purpose**: Find vulnerabilities in code, dependencies, containers, and IaC

**Tools**:

| Tool | Use For |
|------|---------|
| `snyk_code_scan` | SAST - Static code analysis |
| `snyk_sca_scan` | SCA - Dependency vulnerabilities |
| `snyk_container_scan` | Container image scanning |
| `snyk_iac_scan` | Infrastructure as Code scanning |

**Usage Examples**:

```bash
# Scan code for vulnerabilities (SAST)
mcp__Snyk__snyk_code_scan --path "/Users/ap/work/Front/src"

# Scan dependencies (SCA)
mcp__Snyk__snyk_sca_scan --path "/Users/ap/work/Front"

# Scan container image
mcp__Snyk__snyk_container_scan --image "my-app:latest"

# Quick security check before commit
mcp__Snyk__snyk_code_scan --path "/Users/ap/work/Front/src" --severity_threshold "high"
```

**When to Use**:

- Before committing security-sensitive code
- After adding new dependencies
- During code review
- Periodic security audits

---

### 6. Web Search & Reader

**Tools**:

| Tool | Use For |
|------|---------|
| `webSearchPrime` | Web search with summaries |
| `webReader` | Fetch and parse URL content |

**Usage Examples**:

```bash
# Search for information
mcp__web-search-prime__webSearchPrime "React 19 new features 2026"

# Read specific URL
mcp__web-reader__webReader --url "https://react.dev/blog/2026/..."
```

**Priority**: Use Context7 first for library docs, WebSearch for external/current info

---

### 7. ZRead (GitHub Repository Reader)

**Purpose**: Read GitHub repos without cloning

**Tools**:

| Tool | Use For |
|------|---------|
| `search_doc` | Search repo docs, issues, commits |
| `read_file` | Read specific file |
| `get_repo_structure` | Get directory structure |

**Usage Examples**:

```bash
# Search React repo
mcp__zread__search_doc \
  --repo_name "facebook/react" \
  --query "useEffect cleanup"

# Read specific file
mcp__zread__read_file \
  --repo_name "tanstack/query" \
  --file_path "docs/react/guides/mutations.md"

# Get repo structure
mcp__zread__get_repo_structure --repo_name "pmndrs/zustand"
```

---

### 8. Figma (Design Integration)

**Purpose**: Get design context and generate code from designs

**Tools**:

| Tool | Use For |
|------|---------|
| `get_design_context` | Generate code from Figma node |
| `get_screenshot` | Screenshot of design |
| `get_metadata` | Node structure overview |
| `get_variable_defs` | Design tokens/variables |
| `add_code_connect_map` | Link design to code component |

**Usage Examples**:

```bash
# Get code from Figma design
mcp__Figma__get_design_context --fileKey "abc123" --nodeId "1:2"

# Get screenshot for reference
mcp__Figma__get_screenshot --fileKey "abc123" --nodeId "1:2"

# Get design variables
mcp__Figma__get_variable_defs --fileKey "abc123" --nodeId "1:2"

# Link design to code
mcp__Figma__add_code_connect_map \
  --fileKey "abc123" \
  --nodeId "1:2" \
  --componentName "Button" \
  --source "src/Button.tsx" \
  --label "React"
```

---

### 9. ZAI Image Analysis

**Purpose**: Analyze screenshots, diagrams, UI, and visual content

**Tools**:

| Tool | Use For |
|------|---------|
| `ui_to_artifact` | Generate code from UI screenshot |
| `extract_text_from_screenshot` | OCR text extraction |
| `diagnose_error_screenshot` | Debug error screenshots |
| `understand_technical_diagram` | Analyze architecture diagrams |
| `analyze_data_visualization` | Interpret charts/graphs |
| `ui_diff_check` | Compare expected vs actual UI |

**Usage Examples**:

```bash
# Generate code from UI screenshot
mcp__zai-mcp-server__ui_to_artifact \
  --image_source "/path/to/screenshot.png" \
  --output_type "code"

# Extract text from error screenshot
mcp__zai-mcp-server__diagnose_error_screenshot \
  --image_source "/path/to/error.png"

# Compare UI implementations
mcp__zai-mcp-server__ui_diff_check \
  --expected "/design.png" \
  --actual "/implementation.png"
```

---

### 10. Claude in Chrome (Browser Automation)

**Purpose**: Automate browser tasks, testing, and interaction

**Key Tools**:

| Tool | Use For |
|------|---------|
| `tabs_context_mcp` | Get browser tab context (ALWAYS call first!) |
| `navigate` | Go to URL or navigate history |
| `read_page` | Get page accessibility tree |
| `computer` | Click, type, scroll, screenshot |
| `find` | Find elements by description |
| `javascript_tool` | Execute JavaScript in page context |

**Usage Examples**:

```bash
# Get tab context FIRST (required)
mcp__claude-in-chrome__tabs_context_mcp

# Navigate to URL
mcp__claude-in-chrome__navigate --url "http://localhost:5173" --tabId 123

# Take screenshot
mcp__claude-in-chrome__computer --action "screenshot" --tabId 123

# Click element
mcp__claude-in-chrome__computer --action "left_click" --coordinate [100, 200] --tabId 123

# Type text
mcp__claude-in-chrome__computer --action "type" --text "search query" --tabId 123

# Find element by description
mcp__claude-in-chrome__find --query "search bar" --tabId 123

# Read page content
mcp__claude-in-chrome__read_page --tabId 123

# Execute JavaScript
mcp__claude-in-chrome__javascript_tool --action "javascript_exec" --text "window.location.pathname" --tabId 123
```

**Important**: Always call `tabs_context_mcp` first to get available tab IDs.

---

## Setup & Configuration

### Prerequisites

#### 1. Cursor IDE v0.42.0+

- Download from <https://cursor.com>
- Minimum version: 0.42.0 (recommended: 0.43.0+)
- Restart after configuration changes

#### 2. Required API Keys

| Service | Purpose | Get From |
|---------|---------|----------|
| **CONTEXT7_API_KEY** | Library documentation | <https://context7.com> |
| **Z_AI_API_KEY** | Web search, ZRead, ZAI | Z.ai platform |
| **GITLAB_TOKEN** | Jira integration | GitLab Settings → Access Tokens |
| **SNYK_API_KEY** | Security scanning | <https://snyk.io> (optional) |

#### 3. Docker (Required)

Required for:

- Hindsight Alice server
- Docker MCP Gateway (Jira)

**Install**:

- macOS/Windows: [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Linux: [Docker Engine](https://docs.docker.com/engine/install/)

**Verify**:

```bash
docker --version
docker ps
```

#### 4. Node.js v20+

```bash
node --version   # v20.x.x
npm --version    # 10.x.x+
```

### Step-by-Step Setup

#### Step 1: Copy MCP Configuration Template

```bash
cp /Users/ap/work/Front/.cursor/mcp.json.sample ~/.cursor/mcp.json
```

#### Step 2: Configure Environment Variables

**For zsh (macOS default)**:

```bash
nano ~/.zshrc

# Add these lines:
export CONTEXT7_API_KEY="your_context7_api_key_here"
export Z_AI_API_KEY="your_z_ai_api_key_here"
export GITLAB_TOKEN="glpat-your_gitlab_token_here"

# Save with Ctrl+O, Enter, Ctrl+X
```

**For bash**:

```bash
nano ~/.bashrc
# Add same environment variables
```

**Reload**:

```bash
source ~/.zshrc
# or
source ~/.bashrc
```

**Verify**:

```bash
echo $CONTEXT7_API_KEY  # Should show API key (not empty)
echo $Z_AI_API_KEY
echo $GITLAB_TOKEN
```

#### Step 3: Start Hindsight Alice Server

**Option A: Docker (Recommended)**

```bash
# Create data directory
mkdir -p ~/.hindsight-alice

# Run container
docker run -d \
  --name hindsight-alice \
  -p 8888:8888 \
  -v ~/.hindsight-alice:/app/data \
  allpepper/hindsight-alice:latest

# Verify
curl http://localhost:8888/mcp/alice/
# Expected: JSON response
```

**Option B: systemd (Linux)**

```bash
sudo cat > /etc/systemd/system/hindsight-alice.service << 'EOF'
[Unit]
Description=Hindsight Alice MCP Server
After=docker.service
Requires=docker.service

[Service]
Type=simple
User=$USER
ExecStart=/usr/bin/docker run --rm -p 8888:8888 -v /home/$USER/.hindsight-alice:/app/data allpepper/hindsight-alice:latest
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable hindsight-alice
sudo systemctl start hindsight-alice
```

**Option C: launchd (macOS)**

```bash
cat > ~/Library/LaunchAgents/com.hindsight-alice.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.hindsight-alice</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/docker</string>
        <string>run</string>
        <string>--rm</string>
        <string>-p</string>
        <string>8888:8888</string>
        <string>-v</string>
        <string>~/.hindsight-alice:/app/data</string>
        <string>allpepper/hindsight-alice:latest</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
EOF

launchctl load ~/Library/LaunchAgents/com.hindsight-alice.plist
launchctl start com.hindsight-alice
```

#### Step 4: Complete MCP Configuration

Edit `~/.cursor/mcp.json` with all MCP servers:

```json
{
  "mcpServers": {
    "user-allpepper-memory-bank": {
      "command": "npx",
      "args": ["-y", "@allpepper/memory-bank-mcp"],
      "env": {
        "MEMORY_BANK_ROOT": "${workspaceFolder}/memory-bank"
      }
    },
    "user-hindsight-alice": {
      "url": "http://localhost:8888/mcp/alice/",
      "headers": {}
    },
    "user-MCP_DOCKER": {
      "command": "docker",
      "args": ["mcp", "gateway", "run"],
      "type": "stdio",
      "headers": {
        "CONTEXT7_API_KEY": "${env:CONTEXT7_API_KEY}"
      }
    },
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "${env:CONTEXT7_API_KEY}"
      }
    },
    "user-web-search-prime": {
      "type": "http",
      "url": "https://api.z.ai/api/mcp/web_search_prime/mcp",
      "headers": {
        "Authorization": "Bearer ${env:Z_AI_API_KEY}"
      }
    },
    "user-zread": {
      "type": "http",
      "url": "https://api.z.ai/api/mcp/zread/mcp",
      "headers": {
        "Authorization": "Bearer ${env:Z_AI_API_KEY}"
      }
    },
    "user-Snyk": {
      "command": "npx",
      "args": ["-y", "snyk@latest", "mcp", "-t", "stdio"],
      "env": {}
    },
    "user-zai-mcp-server": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@z_ai/mcp-server"],
      "env": {
        "Z_AI_MODE": "ZAI",
        "Z_AI_API_KEY": "${env:Z_AI_API_KEY}"
      }
    },
    "cursor-ide-browser": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"],
      "env": {}
    }
  }
}
```

#### Step 5: Restart Cursor IDE

1. Close Cursor IDE completely (Cmd/Ctrl + Q)
2. Reopen Cursor IDE
3. Open the project (`/Users/ap/work/Front`)
4. MCP servers should appear in MCP Tools panel

### Verification

#### Automated Health Check

```bash
npm run mcp:doctor
```

Checks:

- ✅ Environment variables
- ✅ MCP configuration file
- ✅ Docker status
- ✅ Hindsight Alice server
- ✅ Memory Bank directory
- ✅ Node.js and npm versions

#### Manual Verification

```bash
# 1. Environment variables
echo $CONTEXT7_API_KEY  # Should be SET

# 2. Docker
docker ps

# 3. Hindsight Alice
curl http://localhost:8888/mcp/alice/

# 4. Memory Bank directory
ls -la memory-bank/

# 5. In Cursor IDE: Check MCP Tools panel (should show ✅ Connected servers)
```

---

## MCP Services Reference

**CRITICAL**: MCP services and local folders are NOT the same.

| Service | MCP Server ID | Purpose | Storage | Local Folder |
|---------|---------------|---------|---------|--------------|
| **Beads** | Local CLI (not MCP) | Task tracking + artifacts | Local `.beads/` | ✅ `.beads/` |
| **Hindsight** | `user-hindsight-alice` | Long-term memory | MCP | ❌ NOT local |
| **Memory Bank** | `user-allpepper-memory-bank` | Project context | MCP | ❌ NOT local |
| **Jira** | `user-MCP_DOCKER` | Team tasks | Jira | ❌ NOT local |
| **Context7** | `user-MCP_DOCKER` | Library docs | Cache | ❌ NOT local |

### Storage Decision Tree

```
Research/Analysis/Reports → Beads task description
Reflections → Hindsight MCP (reflect)
Experience/Patterns → Hindsight MCP (retain)
Team Tasks → Jira MCP
Library Docs → Context7 MCP
```

---

## Tool Selection Matrix

| Need | Primary Tool | Fallback |
|------|--------------|----------|
| Library docs | Context7 | ZRead, WebSearch |
| Past decisions | Hindsight `recall` | Memory Bank |
| Deep analysis | Hindsight `reflect` | PAL `thinkdeep` |
| Code review | PAL `codereview` | Manual review |
| Security scan | Snyk | npm audit |
| Debug bug | PAL `debug` | Manual |
| UI from design | Figma `get_design_context` | ZAI `ui_to_artifact` |
| External info | WebSearch | ZRead (GitHub) |
| Browser testing | Claude in Chrome | Manual testing |
| Task tracking | Beads (local CLI) | Jira (team) |
| Session memory | Hindsight Alice | Memory Bank |

---

## Best Practices

### Session Start

```bash
bd ready                                    # Check tasks
mcp__hindsight-alice__recall "..."         # Load context
npm run mcp:doctor                         # Verify setup
```

### Before Implementing

```bash
# Check existing patterns
mcp__hindsight-alice__recall "How do we handle [X]?"

# Check library docs
mcp__MCP_DOCKER__resolve-library-id "[library]"
mcp__MCP_DOCKER__get-library-docs "[id]" --topic "[topic]"
```

### Before Committing

```bash
mcp__Snyk__snyk_code_scan --path "..." --severity_threshold "high"
npm run quality:gates
```

### After Important Decisions

```bash
mcp__hindsight-alice__retain "Decision: [what and why]"
```

### MCP Priority Order

1. **Beads** → Task context (`bd ready`)
2. **Codebase** → Existing patterns (Grep, Glob)
3. **Hindsight** → Past decisions (`recall`, `reflect`)
4. **Context7** → Library docs
5. **PAL** → External models for complex tasks
6. **WebSearch** → External info (last resort)

---

## Troubleshooting

### MCP Servers Not Appearing

**Symptoms**: MCP Tools panel shows no servers or "Error"/"Loading"

**Solutions**:

1. Restart Cursor IDE (Cmd/Ctrl + Q)
2. Verify MCP config is valid JSON: `cat ~/.cursor/mcp.json | jq .`
3. Check Cursor IDE logs: Help → Toggle Developer Tools → Console
4. Run `npm run mcp:doctor` for automated diagnosis

### Environment Variables Not Loaded

**Symptoms**: MCP servers show authentication errors

**Solutions**:

```bash
# Verify variables are set
echo $CONTEXT7_API_KEY
echo $Z_AI_API_KEY
echo $GITLAB_TOKEN

# Reload shell
source ~/.zshrc
# or
source ~/.bashrc

# Restart Cursor IDE (must restart after setting variables)
```

### Docker/Hindsight Alice Issues

**Symptoms**: Connection refused on localhost:8888

**Solutions**:

```bash
# Check if running
curl http://localhost:8888/mcp/alice/

# Check container status
docker ps | grep hindsight-alice
docker logs hindsight-alice

# Restart container
docker stop hindsight-alice
docker rm hindsight-alice
docker run -d --name hindsight-alice -p 8888:8888 \
  -v ~/.hindsight-alice:/app/data \
  allpepper/hindsight-alice:latest

# Check port availability
lsof -i :8888
```

### Port 8888 Already in Use

**Solutions**:

```bash
# Find process using port
lsof -i :8888

# Kill process
kill -9 <PID>

# Or use different port in ~/.cursor/mcp.json
# Change: "url": "http://localhost:9999/mcp/alice/"
# And: docker run ... -p 9999:8888 ...
```

### Context7 API Authentication

**Symptoms**: "Unauthorized" or "Invalid API key"

**Solutions**:

```bash
# Verify API key
echo $CONTEXT7_API_KEY

# Test API key
curl -H "CONTEXT7_API_KEY: $CONTEXT7_API_KEY" \
  https://mcp.context7.com/mcp

# If invalid: Visit https://context7.com → Login → Settings → API Keys
# Generate new key, update ~/.zshrc, reload shell, restart Cursor
```

### Snyk Authentication

**Symptoms**: Snyk MCP shows authentication errors

**Solutions**:

```bash
snyk auth        # Opens browser for authentication
snyk whoami      # Verify authentication
# Then restart Cursor IDE
```

### Memory Bank Access Issues

**Symptoms**: "Cannot read directory" or "Permission denied"

**Solutions**:

```bash
# Verify directory exists
cd /Users/ap/work/Front
ls -la memory-bank/

# Create if missing
mkdir -p memory-bank

# Check permissions (should be readable/writable)
chmod 755 memory-bank

# Verify MCP config
cat ~/.cursor/mcp.json | grep MEMORY_BANK_ROOT
# Should be: "MEMORY_BANK_ROOT": "${workspaceFolder}/memory-bank"
```

---

## Security

### Best Practices

✅ **DO**:

- Use environment variables for API keys (never commit to git)
- Add `*.local` files to `.gitignore`
- Rotate API keys every 90 days
- Use separate keys for dev/prod
- Revoke unused/compromised keys immediately
- Use strong, randomly generated keys
- Enable two-factor authentication on accounts

❌ **DON'T**:

- Commit API keys to git
- Share API keys in chat/email
- Use production keys for development
- Hardcode API keys in config files
- Store API keys in unencrypted files

### Environment Variable Safety

```bash
# Secure your shell config files
chmod 600 ~/.zshrc ~/.bashrc

# Don't commit secrets
echo ".env*" >> .gitignore
echo ".cursor/mcp.json" >> .gitignore
```

---

## Maintenance

### Regular Checks (Weekly)

```bash
# MCP health check
npm run mcp:doctor

# Check Docker
docker ps

# View Hindsight Alice logs
docker logs hindsight-alice

# Check for Cursor IDE updates
# Cursor IDE → Help → Check for Updates
```

### Updating API Keys

1. Generate new key from service provider
2. Update environment variable: `nano ~/.zshrc`
3. Reload shell: `source ~/.zshrc`
4. Restart Cursor IDE
5. Run `npm run mcp:doctor` to verify
6. Test MCP servers in Cursor

### Updating Hindsight Alice

```bash
# Stop current
docker stop hindsight-alice
docker rm hindsight-alice

# Pull latest
docker pull allpepper/hindsight-alice:latest

# Start with new image
docker run -d --name hindsight-alice -p 8888:8888 \
  -v ~/.hindsight-alice:/app/data \
  allpepper/hindsight-alice:latest

# Verify
curl http://localhost:8888/mcp/alice/
```

### Backup MCP Configuration

```bash
# Backup config
cp ~/.cursor/mcp.json ~/.cursor/mcp.json.backup

# Backup Memory Bank (contains project context)
tar -czf ~/memory-bank-backup.tar.gz memory-bank/
```

---

## Cost Optimization

| Task | Recommended Model |
|------|-------------------|
| Quick questions | `glm-4.7` (cheapest) |
| Code generation | `gpt-5.1-codex` |
| Complex reasoning | `gpt-5.2` or `o3` |
| Code review | `gpt-5.2` |
| Multi-model consensus | Mix of models |

---

## Quick Reference Commands

```bash
# Setup
cp .cursor/mcp.json.sample ~/.cursor/mcp.json

# Environment setup (add to ~/.zshrc)
export CONTEXT7_API_KEY="..."
export Z_AI_API_KEY="..."
export GITLAB_TOKEN="..."

# Reload shell
source ~/.zshrc

# Health check
npm run mcp:doctor

# Verify services
docker ps
curl http://localhost:8888/mcp/alice/
ls -la memory-bank/

# Common MCP commands
bd ready
mcp__hindsight-alice__recall "..."
mcp__MCP_DOCKER__resolve-library-id "react"
mcp__Snyk__snyk_code_scan --path "src"
```

---

## Additional Resources

- [MCP Protocol](https://modelcontextprotocol.io)
- [Cursor IDE Docs](https://docs.cursor.com)
- [Context7 Docs](https://context7.com)
- [Project CLAUDE.md](/Users/ap/work/Front/CLAUDE.md) - Project instructions
- [Cursor Rules](/Users/ap/work/Front/.cursor/rules/)
- [Development Workflow Guide](./development-workflow.md)
- [Cursor Quick Start](./cursor-quick-start.md)

---

## Summary Checklist

- [ ] Cursor IDE v0.42.0+ installed
- [ ] API keys obtained (CONTEXT7, Z_AI, GITLAB)
- [ ] Docker installed and running
- [ ] Node.js v20+ and npm 10.x+ installed
- [ ] `~/.cursor/mcp.json` created
- [ ] Environment variables configured in `~/.zshrc`
- [ ] Shell reloaded: `source ~/.zshrc`
- [ ] Hindsight Alice running (port 8888)
- [ ] Required MCP servers in config:
  - [ ] user-allpepper-memory-bank
  - [ ] user-hindsight-alice
  - [ ] user-MCP_DOCKER
- [ ] Optional MCP servers configured as needed
- [ ] Cursor IDE restarted
- [ ] MCP servers visible in MCP Tools panel
- [ ] `npm run mcp:doctor` passes all checks
- [ ] MCP servers tested in Cursor

---

**Last Updated**: 2025-01-20 | **Consolidated from**: 6 source files | **Status**: Active
