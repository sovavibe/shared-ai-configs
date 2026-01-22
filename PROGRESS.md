# shared-ai-configs Progress Tracker

> **Last Updated:** 2026-01-21 (evening)
> **Current Phase:** Phase 4-8 (parallel)
> **Beads Epic:** VP-1h49

## Глобальная цель

Превратить `shared-ai-configs` в полноценный npm-пакет с CLI-генератором, который:

- Читает `.ai-project.yaml` конфиг
- Генерирует все AI-конфиги (правила, hooks, MCP)
- Поддерживает условную генерацию
- **Модульная документация** — секции включаются/исключаются по конфигу
- **Без магических строк** — все defaults из YAML/schema
- **Универсальность** — macOS/Linux, GitHub/GitLab
- **MCP config generation** — генерация конфигов MCP серверов

---

## ✅ Завершено

### Phase 1: Schema & Types ✓

- [x] Schema refactored: `integrations.*` → `services.*` grouping
- [x] Added `languages.chat` / `languages.code` separation
- [x] Added `rules.critical[]` / `rules.custom[]` arrays
- [x] Types updated (`types.ts`)

### Phase 2: CLI Core ✓

- [x] `config.ts` - centralized `CONFIG_DEFAULTS` (no magic strings)
- [x] AJV with `useDefaults: true` for schema defaults
- [x] `generate.ts` - modular generation based on config
- [x] `init.ts` - updated for services.* structure
- [x] `status.ts` - uses CONFIG_DEFAULTS
- [x] `validate.ts` - uses services.*
- [x] `template.ts` - EJS rendering with helpers
- [x] Build passes, dry-run works

### Phase 3: Content & Templates ✓

- [x] Created `120-dual-ide.mdc` rule
- [x] Created `119-gitlab-mr.mdc` rule
- [x] Created `119-github-pr.mdc` rule
- [x] Created `templates/claude/settings.json.ejs`
- [x] Created `templates/claude/docs/MCP-GUIDE.md.ejs`
- [x] Created `templates/claude/docs/SESSION-PROTOCOL.md.ejs`
- [x] Created `templates/claude/docs/TROUBLESHOOTING.md.ejs`
- [x] Created `templates/claude/docs/SDLC-WORKFLOW.md.ejs`
- [x] Verified content/ directories (agents, skills, notepads, commands, hooks)

### Phase 6: Integration & Testing ✓

- [x] `npm run build` - passes
- [x] `generate --dry-run` - works (11 files)
- [x] Actual generation in Front - works
- [x] Generated files: 4 docs + 4 hooks + 2 cursor rules

### Doctor Command ✓

- [x] Platform detection (darwin/linux)
- [x] VCS CLI checks (gh/glab based on config)
- [x] MCP server health checks
- [x] Fix suggestions for each check
- [x] CONFIG_DEFAULTS usage

---

## 🔄 В процессе

### Phase 4: Rules Verification (P2)

- [ ] Verify core/workflow/*.mdc GLOBS and alwaysApply
- [ ] Verify core/code-quality/*.mdc token optimization
- [ ] Verify core/mcp/*.mdc conditional loading
- [ ] Verify integrations/gitlab/*.mdc completeness
- [ ] Verify integrations/github/*.mdc completeness
- [ ] Verify integrations/beads/*.mdc accuracy
- [ ] Verify stacks/react/*.mdc GLOBS patterns
- [ ] Check all .mdc for hardcoded paths

### Phase 5: Platform Abstraction (P2)

- [x] Platform detection utility (in doctor.ts)
- [ ] Abstract gh CLI commands for GitHub
- [ ] Abstract glab CLI commands for GitLab
- [ ] Create VCS command wrapper based on config
- [ ] Document platform differences

---

## 📋 NEW: Phase 7 & 8

### Phase 7: MCP Config Generation (P1) - VP-0ke2

**Проблема:** MCP конфиги сейчас копируются в `~/`, нужно генерировать на основе конфига.

**Задачи:**

1. [ ] Design MCP config generation strategy
   - Вариант A: генерация в `.claude/mcp/` и `.cursor/mcp/`
   - Вариант B: генерация в `~/.config/claude/mcp/`
2. [ ] Create MCP config template for Claude
3. [ ] Create MCP config template for Cursor
4. [ ] Handle Docker MCP servers (Context7, Jira, Confluence)
   - docker-compose.yaml генерация
   - Environment variables handling
5. [ ] Generate MCP server entries conditionally
6. [ ] Update generate.ts to include MCP config

### Phase 8: Contribution Workflow (P2) - VP-e5it

**Проблема:** Как редактировать правила и вносить изменения?

**Задачи:**

1. [ ] Document npm link workflow for local development
2. [ ] Create CONTRIBUTING.md with rule editing guide
3. [ ] Design patch review workflow
4. [ ] Add 'watch' mode for template changes

---

## 🎯 Ключевые принципы

1. **Нет магических строк** - все fallbacks из `CONFIG_DEFAULTS`
2. **Модульность** - генерируем только нужное по конфигу
3. **Универсальность** - macOS/Linux, GitHub/GitLab
4. **Token optimization** - 60-70% экономия контекста
5. **Single source of truth** - schema defaults = CONFIG_DEFAULTS
6. **MCP унификация** - конфиги генерируются, не копируются

---

## 📁 Структура пакета

```
shared-ai-configs/
├── bin/cli.js                    # CLI entry point
├── schema/
│   └── ai-project.schema.json    # ✅ Updated
├── src/cli/
│   ├── commands/
│   │   ├── generate.ts           # ✅ Updated
│   │   ├── init.ts               # ✅ Updated
│   │   ├── status.ts             # ✅ Updated
│   │   ├── validate.ts           # ✅ Updated
│   │   └── doctor.ts             # ✅ Enhanced
│   ├── utils/
│   │   ├── config.ts             # ✅ CONFIG_DEFAULTS
│   │   ├── template.ts           # ✅ EJS helpers
│   │   └── logger.ts             # ✅ Done
│   └── types.ts                  # ✅ Updated
├── templates/
│   ├── CLAUDE.md.ejs             # ✅ Updated
│   └── claude/
│       ├── settings.json.ejs     # ✅ Created
│       └── docs/
│           ├── MCP-GUIDE.md.ejs        # ✅ Created
│           ├── SESSION-PROTOCOL.md.ejs # ✅ Created
│           ├── TROUBLESHOOTING.md.ejs  # ✅ Created
│           └── SDLC-WORKFLOW.md.ejs    # ✅ Created
├── core/                         # Rules
├── stacks/                       # Stack-specific rules
├── integrations/
│   ├── beads/005-beads.mdc       # ✅ Exists
│   ├── gitlab/119-gitlab-mr.mdc  # ✅ Created
│   └── github/119-github-pr.mdc  # ✅ Created
├── content/                      # Static content
│   ├── agents/                   # ✅ 3 files
│   ├── skills/                   # ✅ 4 dirs
│   ├── notepads/                 # ✅ 7 files
│   ├── commands/core/            # ✅ 7 files
│   ├── commands/session/         # ✅ 6 files
│   └── hooks/cursor/             # ✅ 3 JS files
└── hooks/                        # Shell hooks
```

---

## 🚨 Важные решения (консолидировано)

### Архитектура

1. **services.* группировка** - `integrations.*` → `services.*`
2. **CONFIG_DEFAULTS** - единый источник fallback значений
3. **EJS шаблоны** - условная генерация секций документации

### Platform & VCS

4. **Platform detection** - darwin/linux в doctor.ts
5. **VCS abstraction** - gh для GitHub, glab для GitLab
6. **Universal commands** - macOS/Linux совместимость

### MCP (NEW)

7. **MCP config generation** - вместо копирования в ~/
8. **Docker MCP** - Context7, Jira, Confluence абстракция
9. **Conditional MCP** - включаем только enabled серверы

### Workflow

10. **CRITICAL:** Сложные задачи → Beads structure СРАЗУ
11. **При переносе файлов проверять:** GLOBS, DESCRIPTION, alwaysApply, token optimization
12. **Cursor rules + Claude rules/skills** - оба нужны

---

## 📊 Beads Statistics

```
Epic: VP-1h49 (shared-ai-configs npm package)
├── Phase 1: VP-4f98 ✓ CLOSED
├── Phase 2: VP-2idy ✓ CLOSED
├── Phase 3: VP-l75y ✓ CLOSED
├── Phase 4: VP-49s9 (Rules Verification) - 8 tasks
├── Phase 5: VP-mnws (Platform Abstraction) - 6 tasks
├── Phase 6: VP-4mh6 ✓ CLOSED
├── Phase 7: VP-0ke2 (MCP Config) - 6 tasks
└── Phase 8: VP-e5it (Contribution) - 4 tasks
```

**Status:** 4/8 phases complete, 24 tasks remaining (mostly P2-P3)

---

## 📝 Changelog

### 2026-01-21 (evening)

- Completed Phase 1, 2, 3, 6
- Enhanced doctor.ts with platform/VCS/MCP checks
- Created all 4 doc templates
- Added Phase 7 (MCP Config) and Phase 8 (Contribution Workflow)
- Consolidated all requirements from chat history

### 2026-01-21 (morning)

- Schema refactored to services-based grouping
- CONFIG_DEFAULTS centralized (no magic strings)
- CLI commands updated for new structure
- Created missing rule files
- Started PROGRESS.md for tracking

---

## 🔗 Related Files

- `/Users/ap/work/Front/.ai-project.yaml` - Test config
- `/Users/ap/.claude/plans/merry-singing-fox.md` - Original plan
- Beads: `bd show VP-1h49` - Main epic
