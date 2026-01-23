# Contributing to shared-ai-configs

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

```bash
# Clone the repository
git clone https://github.com/sovavibe/shared-ai-configs.git
cd shared-ai-configs

# Install dependencies
npm install

# Build
npm run build

# Link for local development
npm link
```

After linking, you can use `sac` or `shared-ai-configs` commands globally.

## Project Structure

```
shared-ai-configs/
├── src/cli/              # CLI implementation
│   ├── commands/         # init, generate, validate, status, doctor
│   ├── utils/            # config, template, logger
│   └── types.ts          # TypeScript interfaces
├── core/                 # Universal rules (.mdc files)
├── stacks/               # Stack-specific rules (react/, node/)
├── integrations/         # Tool integrations (beads/, github/, gitlab/)
├── templates/            # EJS templates
├── content/              # Commands, skills, agents, notepads
├── hooks/                # Shell hooks for Claude Code
└── schema/               # JSON Schema for .ai-project.yaml
```

## Making Changes

### Adding or Editing Rules

Rules are `.mdc` files with YAML frontmatter:

```markdown
---
description: 'Brief description of the rule'
globs: ['**/*.ts', '**/*.tsx'] # Optional: file patterns
alwaysApply: false # true = always loaded
---

# Rule Title

Your rule content here...
```

**Location by type:**

| Type            | Directory              |
| --------------- | ---------------------- |
| Universal rules | `core/`                |
| Stack-specific  | `stacks/<stack>/`      |
| Integrations    | `integrations/<tool>/` |

### Adding Templates

Templates use [EJS](https://ejs.co/) syntax. The full `Config` object is available:

```ejs
<% if (config.services.mcp?.hindsight?.enabled) { %>
## MCP: Hindsight
Use hindsight for memory and recall.
<% } %>
```

### Modifying CLI Commands

Commands are in `src/cli/commands/`. Key utilities:

- `utils/config.ts` - `loadConfig()`, `validateConfig()`, `CONFIG_DEFAULTS`
- `utils/template.ts` - `renderTemplate()`
- `utils/logger.ts` - `log.info()`, `log.success()`, `log.error()`

## Code Quality

We enforce quality gates on every commit:

```bash
# Run all quality checks
npm run quality

# Or individually
npm run lint        # ESLint
npm run lint:md     # Markdown lint
npm run format:check # Prettier

# Auto-fix
npm run quality:fix
```

Pre-commit hooks automatically run lint-staged.

## Testing

```bash
# Run tests
npm run test

# Watch mode
npm run test -- --watch
```

Tests are in `src/**/*.test.ts`. We use [Vitest](https://vitest.dev/).

## Pull Request Process

1. **Fork** the repository
2. **Create a branch** from `main`: `git checkout -b feature/my-feature`
3. **Make changes** and ensure quality checks pass
4. **Write tests** for new functionality
5. **Update documentation** if needed
6. **Submit PR** with clear description

### PR Checklist

- [ ] `npm run quality` passes
- [ ] `npm run build` succeeds
- [ ] `npm run test` passes
- [ ] Documentation updated (if applicable)
- [ ] CHANGELOG.md updated (for significant changes)

## Commit Messages

We follow conventional commits:

```
feat: add new stack support for Python
fix: correct glob pattern in react rules
docs: update README with new options
refactor: extract template helpers
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Reporting Issues

Use GitHub Issues with these templates:

- **Bug Report** - Something isn't working
- **Feature Request** - New functionality suggestion

Include:

- Node.js version (`node -v`)
- Package version (`sac --version`)
- Minimal reproduction steps

## Questions?

Open a [Discussion](https://github.com/sovavibe/shared-ai-configs/discussions) for questions or ideas.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
