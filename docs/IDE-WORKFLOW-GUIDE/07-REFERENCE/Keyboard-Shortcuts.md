# Keyboard Shortcuts Reference

**Last Updated:** 2026-01-21
**Audience:** All developers
**Quick Reference:** Print and post by monitor

---

## Claude Code Shortcuts

### Navigation

| Shortcut | Action |
|----------|--------|
| `Cmd+K` / `Ctrl+K` | Open command palette |
| `Cmd+P` / `Ctrl+P` | Quick open file |
| `Cmd+Shift+P` / `Ctrl+Shift+P` | Open commands (alternative) |
| `Cmd+/` / `Ctrl+/` | Toggle sidebar |
| `Cmd+B` / `Ctrl+B` | Toggle explorer |
| `Cmd+J` / `Ctrl+J` | Toggle terminal |
| `Cmd+Shift+E` / `Ctrl+Shift+E` | Focus explorer |
| `Cmd+Shift+F` / `Ctrl+Shift+F` | Focus find |
| `Cmd+Shift+D` / `Ctrl+Shift+D` | Focus debug |
| `Cmd+Shift+X` / `Ctrl+Shift+X` | Focus extensions |

### Chat & Prompting

| Shortcut | Action |
|----------|--------|
| `#` | Type to reference files/symbols |
| `@` | Reference specific file or symbol directly |
| `/` | Access slash commands |
| `Cmd+Enter` / `Ctrl+Enter` | Send message / Execute command |
| `Cmd+L` / `Ctrl+L` | Clear chat |
| `Cmd+Shift+C` / `Ctrl+Shift+C` | Copy last response |
| `Tab` | Autocomplete current suggestion |
| `Esc` | Cancel ongoing operation |

### Slash Commands (Quick Reference)

| Command | Purpose | Model |
|---------|---------|-------|
| `/analyze "request"` | Break down requirements | Opus |
| `/architect "design"` | System architecture | Opus |
| `/plan "task"` | Implementation planning | Sonnet |
| `/review` | Code quality review | Opus |
| `/compact` | Compress conversation | System |
| `/mcp` | Check MCP health | System |
| `/rename "name"` | Name session | System |
| `/exit` | End session | System |
| `/model <name>` | Switch model (opus/sonnet/haiku) | System |

### File Editing

| Shortcut | Action |
|----------|--------|
| `Cmd+Z` / `Ctrl+Z` | Undo |
| `Cmd+Shift+Z` / `Ctrl+Shift+Z` | Redo |
| `Cmd+S` / `Ctrl+S` | Save file |
| `Cmd+Shift+S` / `Ctrl+Shift+S` | Save all |
| `Cmd+X` / `Ctrl+X` | Cut |
| `Cmd+C` / `Ctrl+C` | Copy |
| `Cmd+V` / `Ctrl+V` | Paste |
| `Cmd+Shift+V` / `Ctrl+Shift+V` | Paste special (formatting) |
| `Cmd+A` / `Ctrl+A` | Select all |
| `Cmd+F` / `Ctrl+F` | Find in file |
| `Cmd+H` / `Ctrl+H` | Find and replace |
| `Cmd+G` / `Ctrl+G` | Go to line |
| `Cmd+Shift+O` / `Ctrl+Shift+O` | Go to symbol |

### Multi-Cursor & Selection

| Shortcut | Action |
|----------|--------|
| `Cmd+D` / `Ctrl+D` | Add next occurrence to selection |
| `Cmd+K, Cmd+D` / `Ctrl+K, Ctrl+D` | Move selection to next |
| `Cmd+U` / `Ctrl+U` | Undo last selection |
| `Cmd+Shift+L` / `Ctrl+Shift+L` | Select all occurrences |
| `Alt+Click` / `Ctrl+Alt+Click` | Add cursor at click location |
| `Shift+Alt+↓` / `Shift+Alt+Down` | Add cursor to line below |
| `Shift+Alt+↑` / `Shift+Alt+Up` | Add cursor to line above |

### Code Actions

| Shortcut | Action |
|----------|--------|
| `Cmd+.` / `Ctrl+.` | Quick fix / Code actions |
| `Cmd+Shift+R` / `Ctrl+Shift+R` | Refactor |
| `F2` | Rename symbol |
| `F12` | Go to definition |
| `Cmd+F12` / `Ctrl+F12` | Go to type definition |
| `Shift+F12` | Find references |
| `Cmd+Shift+H` / `Ctrl+Shift+H` | Replace in files |

### Terminal Integration

| Shortcut | Action |
|----------|--------|
| `Ctrl+`` | Toggle terminal |
| `Cmd+Shift+`` /`Ctrl+Shift+`` | New terminal |
| `Cmd+↑` / `Ctrl+↑` | Scroll terminal up |
| `Cmd+↓` / `Ctrl+↓` | Scroll terminal down |
| `Ctrl+C` | Interrupt running process |
| `Ctrl+Shift+C` | Copy terminal text |
| `Ctrl+Shift+V` | Paste to terminal |

---

## Cursor IDE Shortcuts

### Navigation (Extended)

| Shortcut | Action |
|----------|--------|
| `Cmd+K, Cmd+O` / `Ctrl+K, Ctrl+O` | Open folder |
| `Cmd+K, Cmd+P` / `Ctrl+K, Ctrl+P` | Open recent folder |
| `Cmd+Shift+N` / `Ctrl+Shift+N` | New window |
| `Cmd+W` / `Ctrl+W` | Close editor |
| `Cmd+Shift+W` / `Ctrl+Shift+W` | Close folder |
| `Cmd+Tab` / `Ctrl+Tab` | Switch editor |
| `Cmd+Shift+Tab` / `Ctrl+Shift+Tab` | Switch editor (reverse) |

### AI/Agent Mode (Cursor Specific)

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Inline edit / Agent mode |
| `Cmd+K` / `Ctrl+Shift+K` | Chat with codebase |
| `Cmd+L` | Chat (focus input) |
| `Cmd+Shift+A` / `Ctrl+Shift+A` | Toggle Agent automode |
| `@` | Reference symbol in chat |
| `#` | Reference file in chat |

### Tab Management

| Shortcut | Action |
|----------|--------|
| `Cmd+Option+→` / `Ctrl+Page Down` | Switch to next tab |
| `Cmd+Option+←` / `Ctrl+Page Up` | Switch to previous tab |
| `Cmd+Tab` / `Ctrl+Tab` | Recently used tab |
| `Cmd+Shift+T` / `Ctrl+Shift+T` | Reopen closed tab |
| `Cmd+W` / `Ctrl+W` | Close current tab |

---

## Terminal & Git Shortcuts

### Git Commands (via Terminal)

| Command | Action |
|---------|--------|
| `git status` | Show working tree status |
| `git add <file>` | Stage file |
| `git add .` | Stage all changes |
| `git commit -m "message"` | Create commit |
| `git diff` | Show unstaged changes |
| `git diff --staged` | Show staged changes |
| `git push` | Push to remote |
| `git pull` | Pull from remote |
| `git log --oneline` | View commit history |
| `git branch` | List branches |
| `git checkout -b <branch>` | Create & switch branch |
| `git merge <branch>` | Merge branch |

### Terminal Navigation

| Shortcut | Action |
|----------|--------|
| `Ctrl+A` | Go to line start |
| `Ctrl+E` | Go to line end |
| `Ctrl+R` | Reverse search history |
| `Ctrl+L` | Clear terminal |
| `Cmd+K` | Clear terminal (macOS) |
| `↑` / `↓` | Navigate command history |
| `Ctrl+U` | Clear line from start to cursor |
| `Ctrl+K` | Clear line from cursor to end |

### NPM Scripts (Frequent)

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (port 5173) |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest |
| `npm run test -- --watch` | Watch mode testing |
| `npm run quality:gates` | Pre-commit validation |
| `npm run codegen` | Generate API types (Orval) |
| `npm run type-check` | TypeScript validation |

---

## Beads Task Management (Terminal)

| Command | Action |
|----------|--------|
| `bd ready` | List available tasks |
| `bd show <id>` | Show task details |
| `bd create --title="..."` | Create new task |
| `bd update <id> --status=in_progress` | Claim task |
| `bd update <id> --status=completed` | Complete task |
| `bd update <id> --labels="label1,label2"` | Add labels |
| `bd blocked` | Show blocked tasks |
| `bd sync --flush-only` | Export to JSONL |
| `bd list --filter="status:in_progress"` | Filter tasks |

---

## MCP Commands (Quick Reference)

### Memory Operations

| Command | Purpose |
|---------|---------|
| `mcp__hindsight-alice__recall "topic"` | Retrieve memory |
| `mcp__hindsight-alice__retain "summary"` | Save to memory |
| `mcp__hindsight-alice__reflect "question"` | Synthesize insights |

### Library Documentation

| Command | Purpose |
|---------|---------|
| `mcp__MCP_DOCKER__resolve-library-id "lib-name"` | Find library ID |
| `mcp__MCP_DOCKER__get-library-docs "/org/project"` | Get library docs |

### Security Scanning

| Command | Purpose |
|---------|---------|
| `mcp__Snyk__snyk_code_scan --path "path"` | SAST scan |
| `mcp__Snyk__snyk_sca_scan --path "path"` | Dependency scan |
| `mcp__Snyk__snyk_auth` | Authenticate with Snyk |

### Jira Integration

| Command | Purpose |
|---------|---------|
| `mcp__MCP_DOCKER__jira_search --jql="..."` | Search issues |
| `mcp__MCP_DOCKER__jira_create_issue ...` | Create issue |
| `mcp__MCP_DOCKER__jira_get_issue "KEY"` | Get issue details |
| `mcp__MCP_DOCKER__jira_transition_issue ...` | Change status |

---

## Perles Orchestration (TUI)

### Navigation

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate menu |
| `Enter` | Execute selected item |
| `Esc` | Back / Cancel |
| `Ctrl+Q` | Quit |
| `Ctrl+O` | Open palette |
| `Ctrl+P` | Search workflows |
| `Shift+J` | Progress tracking view |

### Workflow Triggers

| Action | Purpose |
|--------|---------|
| Select "Interactive SDLC" | New idea → auto-structure |
| Select "Full SDLC" | Multi-phase workflow |
| Select "Epic Batches" | Parallel execution |
| Select "Verification Swarm" | P0 debugging |

---

## Browser Automation (Claude in Chrome)

### Navigation

| Shortcut | Action |
|----------|--------|
| `Cmd+W` / `Ctrl+W` | Close tab |
| `Cmd+N` / `Ctrl+N` | New tab |
| `Cmd+T` / `Ctrl+T` | New tab (focus URL) |
| `Cmd+L` / `Ctrl+L` | Focus URL bar |
| `Cmd+R` / `Ctrl+R` | Reload page |
| `Cmd+Shift+R` / `Ctrl+Shift+R` | Hard reload |

### Claude Browser Tools

| Command | Purpose |
|---------|---------|
| `tabs_context_mcp` | Get available tabs |
| `tabs_create_mcp` | Create new tab |
| `navigate "url"` | Go to URL |
| `read_page` | Read page content |
| `find "query"` | Find elements |
| `computer screenshot` | Take screenshot |
| `computer left_click [x,y]` | Click at coords |

---

## Context Management

### Session Management

| Command | Purpose |
|---------|---------|
| `/compact` | Compress conversation (saves 15-25K tokens) |
| `/rename "name"` | Name current session |
| `/exit` | End session cleanly |
| `claude --continue` | Resume previous session |
| `claude --resume <name>` | Resume named session |

### Model Switching

| Command | Purpose |
|---------|---------|
| `/model opus` | Switch to Claude Opus |
| `/model sonnet` | Switch to Claude Sonnet |
| `/model haiku` | Switch to Claude Haiku |

### Session Inspection

| Command | Purpose |
|---------|---------|
| `/mcp` | Check MCP health |
| `bd ready` | Show active tasks (in chat) |
| View token count | Check remaining budget |

---

## File Search Patterns

### Grep (Content Search)

| Command | Purpose |
|---------|---------|
| `Grep --pattern "text" /path` | Find text in files |
| `Grep --pattern "regex" --glob "*.ts"` | Pattern + file type |
| `Grep --pattern "error" -i` | Case-insensitive |
| `Grep --pattern "TODO" --output_mode count` | Count matches |

### Glob (File Search)

| Command | Purpose |
|---------|---------|
| `Glob --pattern "**/*.ts"` | Find all TypeScript |
| `Glob --pattern "src/components/**"` | Search directory |
| `Glob --pattern "*.test.ts"` | Find test files |

---

## Quick Reference Card

### Most Used (Daily)

**Development:**

- `npm run dev` - Start dev server
- `Cmd+S` / `Ctrl+S` - Save file
- `npm run test` - Run tests
- `npm run quality:gates` - Pre-commit check

**Navigation:**

- `Cmd+P` / `Ctrl+P` - Open file
- `Cmd+F` / `Ctrl+F` - Find in file
- `Cmd+G` / `Ctrl+G` - Go to line

**Git:**

- `git status` - Check status
- `git add .` - Stage changes
- `git commit -m "..."` - Create commit

**Claude Code:**

- `#` - Reference files
- `@` - Reference symbols
- `/` - See commands
- `Cmd+Enter` - Send message

### Most Used (Weekly)

- `git diff` - Review changes
- `git push` - Push to remote
- `npm run build` - Production build
- `bd ready` - Check tasks
- `mcp__hindsight-alice__recall` - Get memory
- `/compact` - Save tokens

### Emergency (P0)

- `bd update <id> --labels="p0"` - Mark critical
- `perles` → Swarm debug - Launch swarm
- `npm run quality:gates` - Validate fix
- `git commit && git push` - Deploy

---

## Platform Differences

### macOS

- Use `Cmd` instead of `Ctrl`
- Use `Option` instead of `Alt`
- Use `Shift` same as others

### Windows/Linux

- Use `Ctrl` instead of `Cmd`
- Use `Alt` instead of `Option`
- Use `Shift` same as others

---

## Tips for Efficiency

1. **Memorize top 10 shortcuts** - Huge productivity boost
2. **Create terminal aliases** for frequent npm commands:

   ```bash
   alias dev="npm run dev"
   alias test="npm run test"
   alias build="npm run build"
   alias gates="npm run quality:gates"
   ```

3. **Pin shortcuts cheat sheet** on your monitor
4. **Practice daily** - Speed comes with muscle memory
5. **Use `/compact`** regularly to extend sessions

---

## Related Documentation

- **CLAUDE.md** - Complete command reference
- **SESSION-PROTOCOL.md** - Session workflow
- **TROUBLESHOOTING.md** - Common issues

Print and post this guide for quick reference throughout your day.
