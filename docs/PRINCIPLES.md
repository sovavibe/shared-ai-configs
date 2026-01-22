# Shared AI Configs — Core Principles

> **Философия:** Эти принципы — фундамент всей системы. Каждое решение должно им соответствовать.

## 1. DRY — Don't Repeat Yourself

### Принцип

Каждая единица знания имеет **единственное, однозначное, авторитетное представление** в системе.

### Применение

```
❌ ПЛОХО:
.claude/rules/react.mdc   (копия)
.cursor/rules/react.mdc   (копия)
.kilo/rules/react.mdc     (копия)

✅ ХОРОШО:
content/rules/react.mdc   (источник)
    ├──► .claude/rules/react.mdc  (сгенерировано)
    ├──► .cursor/rules/react.mdc  (сгенерировано)
    └──► .kilo/rules/react.mdc    (сгенерировано)
```

### Правила

1. **Правила (rules)** — один MDC файл → все IDE
2. **Команды (commands)** — один MD файл → все IDE
3. **Документация** — один EJS шаблон → разные выходные файлы
4. **Конфигурация** — один `.ai-project.yaml` → все настройки

---

## 2. Configuration over Convention

### Принцип

Всё настраиваемо через конфиг. **Нет магических строк** в коде.

### Применение

```yaml
# .ai-project.yaml — единственный источник правды

commands:
  dev: "pnpm dev"           # НЕ хардкод "npm run dev"
  lint: "pnpm lint"         # НЕ хардкод "npm run lint"
  quality_gates: "pnpm quality:gates"

services:
  vcs:
    type: gitlab            # НЕ хардкод "github"
  task_tracking:
    type: beads             # НЕ хардкод "jira"
```

### Правила

1. **CONFIG_DEFAULTS** — все fallback значения в одном месте
2. **Schema validation** — AJV + `useDefaults: true`
3. **Template variables** — `<%= commands.dev %>` вместо `npm run dev`
4. **No hardcoded paths** — `<%= project.path %>` вместо `/Users/ap/work/Front`

---

## 3. Conditional Generation

### Принцип

Генерируем **только то, что нужно** на основе конфига.

### Применение

```typescript
// НЕ генерируем hindsight правила если hindsight отключен
if (config.services?.mcp?.hindsight?.enabled) {
  generateRule('100-hindsight.mdc');
}

// НЕ включаем GitLab секцию если VCS = github
if (config.services?.vcs?.type === 'gitlab') {
  includeSection('gitlab-workflow');
}
```

### В шаблонах

```ejs
<% if (services?.task_tracking?.type === 'beads') { %>
## Beads Task Tracking

```bash
bd ready           # Find work
bd close <id>      # Complete task
```
<% } %>
```

### Правила

1. **Включать только enabled сервисы**
2. **Не генерировать пустые секции**
3. **Экономить токены** — меньше контекста = быстрее ответ

---

## 4. Multi-Target Architecture

### Принцип

Один контент → множество целей (IDE, агенты).

### Матрица целей

| Контент | Claude Code | Cursor | Kilo (future) |
|---------|-------------|--------|---------------|
| Rules | `.claude/rules/` | `.cursor/rules/` | `.kilo/rules/` |
| Commands | `.claude/commands/` | `.cursor/commands/` | `.kilo/commands/` |
| Hooks | Bash (`.sh`) | JavaScript (`.js`) | TBD |
| Main | `CLAUDE.md` | `.cursorrules` | `KILO.md` |

### Конфигурация целей

```yaml
generation:
  targets:
    claude:
      enabled: true
      output_dir: ".claude"
      features: [rules, hooks, commands, docs, settings]
    cursor:
      enabled: true
      output_dir: ".cursor"
      features: [rules, hooks, commands, skills, agents, notepads]
    kilo:
      enabled: false  # Future
```

### Правила

1. **Каждая цель независима** — можно включать/выключать
2. **Общий контент, разные адаптации** — hooks разные, rules одинаковые
3. **Расширяемость** — добавить новую цель без изменения контента

---

## 5. Project-Specific Adaptations

### Принцип

Каждый проект уникален. Конфиг позволяет **адаптировать генерацию** под проект.

### Примеры адаптаций

```yaml
# Проект A: React + GitLab + Beads
stack:
  type: react
services:
  vcs: { type: gitlab }
  task_tracking: { type: beads }
commands:
  dev: "npm run dev"

# Проект B: Node + GitHub + Jira
stack:
  type: node
services:
  vcs: { type: github }
  task_tracking: { type: jira }
commands:
  dev: "yarn dev"

# Проект C: Python + None
stack:
  type: python
services:
  vcs: { type: none }
  task_tracking: { type: none }
commands:
  dev: "python manage.py runserver"
```

### Использование в hooks

```bash
#!/bin/bash
# Hook использует команды из конфига проекта
QUALITY_GATES="<%= commands.quality_gates %>"
$QUALITY_GATES || exit 1
```

### Правила

1. **Проектные команды в конфиге** — не в коде
2. **Генерация адаптируется** — разные проекты → разные файлы
3. **Переопределение defaults** — CONFIG_DEFAULTS ← project config

---

## 6. Token Optimization

### Принцип

Минимизируем **потребление токенов** при работе с AI.

### Стратегии

```
┌─────────────────────────────────────────────────────┐
│ БЕЗ оптимизации:                                    │
│   Session Start: 180K tokens                        │
│   - Все правила загружены                           │
│   - Все MCP инструменты в контексте                 │
│   - Полная документация                             │
└─────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────┐
│ С оптимизацией:                                     │
│   Session Start: 5-8K tokens (60-70% экономия)     │
│   - Только core правила (alwaysApply: true)         │
│   - MCP по требованию                               │
│   - Glob-based loading                              │
└─────────────────────────────────────────────────────┘
```

### Реализация

```yaml
---
# Rule with glob-based loading
description: 'React patterns'
alwaysApply: false              # НЕ загружать всегда
globs: ['src/**/*.tsx']         # Загружать только для TSX файлов
---
```

### Правила

1. **alwaysApply: false** по умолчанию
2. **Globs для context-aware loading**
3. **Условная генерация** — меньше файлов = меньше контекста
4. **Диаграммы вместо текста** — 87% экономия

---

## 7. IDE Parity

### Принцип

**Одинаковое поведение** в разных IDE. Переключение IDE не должно менять workflow.

### Применение

```
Claude Code                    Cursor
──────────────────────────────────────────
/analyze                   =   /analyze
/architect                 =   /architect
/plan                      =   /plan
/review                    =   /review
bd ready                   =   bd ready
bd close                   =   bd close
npm run quality:gates      =   npm run quality:gates
```

### Правила

1. **Команды идентичны** — одни и те же slash commands
2. **Правила идентичны** — MDC формат общий
3. **Workflow идентичен** — SDLC фазы одинаковые
4. **Quality gates одинаковые** — pre-commit hooks унифицированы

---

## 8. Separation of Concerns

### Принцип

Разделение **контента, шаблонов, логики генерации**.

### Структура

```
shared-ai-configs/
├── content/              # ЧТО генерировать (данные)
│   ├── rules/            # Правила
│   ├── commands/         # Команды
│   └── hooks/            # Hooks
│
├── templates/            # КАК форматировать (представление)
│   ├── CLAUDE.md.ejs
│   └── cursorrules.ejs
│
├── src/cli/              # ЛОГИКА генерации (контроллер)
│   ├── commands/generate.ts
│   └── utils/template.ts
│
└── schema/               # ВАЛИДАЦИЯ (контракт)
    └── ai-project.schema.json
```

### Правила

1. **Контент — чистые данные** (MDC, MD)
2. **Шаблоны — только форматирование** (EJS)
3. **Логика — только в CLI** (TypeScript)
4. **Schema — контракт валидации** (JSON Schema)

---

## 9. Idempotent Generation

### Принцип

Повторная генерация **не меняет результат** если конфиг не изменился.

### Проверка

```bash
# Первая генерация
npx shared-ai-configs generate

# Повторная генерация
npx shared-ai-configs generate

# Проверка: diff должен быть пустым
git diff
# (пусто)
```

### Правила

1. **Детерминированный вывод** — одинаковый input → одинаковый output
2. **Нет timestamps в генерации** (если не указано явно)
3. **Нет random элементов**
4. **Сортировка массивов** — порядок файлов стабильный

---

## 10. Extensibility

### Принцип

Легко добавить **новые IDE, стеки, интеграции** без изменения core.

### Точки расширения

1. **Новый IDE** — добавить target в config + templates
2. **Новый стек** — добавить `content/rules/stacks/newstack/`
3. **Новая интеграция** — добавить в `services.mcp.*`
4. **Кастомные правила** — `rules.custom[]` в конфиге

### Пример: добавление Kilo

```yaml
# 1. Добавить в schema
generation:
  targets:
    kilo:
      enabled: boolean
      output_dir: string

# 2. Добавить templates
templates/kilo/
├── KILO.md.ejs
└── config.json.ejs

# 3. Добавить в generate.ts
if (config.generation?.targets?.kilo?.enabled) {
  generateForTarget('kilo', config);
}
```

### Правила

1. **Плагинная архитектура** — новые фичи не ломают существующие
2. **Feature flags** — `enabled: true/false` для каждой фичи
3. **Schema evolution** — новые поля с defaults

---

## Чеклист для новых фич

При добавлении новой функциональности проверь:

- [ ] **DRY**: Контент в одном месте?
- [ ] **Config**: Настраивается через `.ai-project.yaml`?
- [ ] **Conditional**: Генерируется только если нужно?
- [ ] **Multi-target**: Работает для всех IDE?
- [ ] **Token-optimized**: Не добавляет лишний контекст?
- [ ] **IDE Parity**: Одинаково работает везде?
- [ ] **Idempotent**: Повторная генерация стабильна?
- [ ] **Extensible**: Легко расширить в будущем?

---

## Anti-patterns

### ❌ НЕ делай так:

```typescript
// Хардкод команды
const lintCmd = 'npm run lint';  // ❌

// Хардкод пути
const projectPath = '/Users/ap/work/Front';  // ❌

// Генерация без условия
generateRule('gitlab-mr.mdc');  // ❌ А если GitHub?

// Дублирование контента
copyFile('rules/react.mdc', '.claude/rules/');
copyFile('rules/react.mdc', '.cursor/rules/');  // ❌ Дубликат

// Timestamps в генерации
content += `Generated: ${new Date()}`;  // ❌ Не idempotent
```

### ✅ Делай так:

```typescript
// Команды из конфига
const lintCmd = config.commands?.lint || CONFIG_DEFAULTS.commands.lint;  // ✅

// Путь из конфига
const projectPath = config.project?.path || process.cwd();  // ✅

// Условная генерация
if (config.services?.vcs?.type === 'gitlab') {
  generateRule('gitlab-mr.mdc');  // ✅
}

// Единый источник
for (const target of getEnabledTargets(config)) {
  generateRuleForTarget('react.mdc', target);  // ✅ Один файл → много целей
}

// Без timestamps (если не нужно)
content += `# Generated by shared-ai-configs`;  // ✅ Без даты
```
