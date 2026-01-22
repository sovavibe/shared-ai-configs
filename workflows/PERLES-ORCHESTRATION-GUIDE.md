# Perles Orchestration Mode - Практический Гайд

> Мультиагентные workflows для комплексных задач

## Быстрый Старт

### 1. Когда Использовать Orchestration?

**Три основных сценария:**

| Сценарий                | Workflow                    | Когда использовать                                                                               |
| ----------------------- | --------------------------- | ------------------------------------------------------------------------------------------------ |
| От идеи до реализации   | **Interactive SDLC**        | Начинаешь с промпта → уточнения → создание задач → полный SDLC цикл                             |
| Полный SDLC цикл        | **Full SDLC**               | Новая фича требует полный цикл: анализ → архитектура → планирование → реализация → тесты → ревью |
| Параллельная разработка | **Epic Batches**            | Epic с множеством подзадач, которые можно делать параллельно (разные компоненты, разные файлы)   |

**НЕ используй для:**

- Простые баги (известное решение)
- Рутинные фичи (по существующим паттернам)
- Code cleanup, документация
- Quick fixes

### 2. Структура Epic для Orchestration

**Обязательная иерархия:**

```
Epic (VP-epic1) - высокоуровневое описание
├── Task 1 (VP-task1) - parent = VP-epic1
├── Task 2 (VP-task2) - parent = VP-epic1
├── Task 3 (VP-task3) - parent = VP-epic1
└── Task 4 (VP-task4) - parent = VP-epic1
```

**ВАЖНО:** Все issues для orchestration ДОЛЖНЫ иметь parent epic.

## Workflow #1: Interactive SDLC from Prompt

### Описание

**Старт с идеи** → интерактивные уточнения → автоматическое создание epic/tasks → Full SDLC цикл.

**3 точки входа:**

1. **От промпта** - пишешь идею → coordinator задаёт вопросы → создаёт структуру → запускает SDLC
2. **От существующего epic** - уже есть epic → пропускаешь уточнения → сразу запускается SDLC
3. **Resume после сбоя** - работа прервалась → продолжаешь с места остановки

**Фазы:**

1. **Clarification** (10-15 мин) - уточнение требований через вопросы
2. **Structure Creation** (10 мин) - создание epic + tasks + dependencies
3. **Full SDLC Execution** (2-3 часа) - полный цикл разработки

### Когда использовать

- У тебя есть идея, но требования не до конца ясны
- Хочешь, чтобы coordinator помог структурировать задачу
- Нужна помощь в разбивке фичи на подзадачи
- Хочешь автоматизировать создание epic структуры

### Как запустить

**Способ 1: От промпта (новая идея)**

```bash
# 1. Запусти Perles
perles

# 2. В Perles TUI:
# Ctrl+O - войти в orchestration mode
# Ctrl+P - открыть workflow picker
# Выбери "Interactive SDLC from Prompt"

# 3. Coordinator спросит: "What do you want to build?"
# Ты отвечаешь своей идеей, например:
# "I want to add dark mode to the application"

# 4. Coordinator задаст уточняющие вопросы:
# - What components need dark mode?
# - Design system exists?
# - User preference storage?
# И т.д.

# 5. После уточнений coordinator автоматически:
# - Создаст epic + tasks
# - Установит dependencies
# - Запустит Full SDLC workflow
```

**Способ 2: От существующего epic**

```bash
# 1. Создай epic (если уже есть, пропусти)
bd create --title="Epic: Dark Mode" --type=feature --priority=1
# Получил VP-epic1

# 2. Запусти Perles
perles

# 3. В Perles TUI:
# Ctrl+O → orchestration mode
# Ctrl+P → workflow picker
# Выбери "Interactive SDLC from Prompt"

# 4. Coordinator спросит: "Existing epic ID or new prompt?"
# Ответь: "VP-epic1"

# 5. Coordinator пропустит clarification, сразу запустит SDLC
```

**Способ 3: Resume после сбоя**

```bash
# Сценарий: работа прервалась (пропал интернет, выключился компьютер)

# 1. Проверь на каком этапе остановился
bd show VP-epic1
# Смотри labels: например "full-sdlc,phase-sdlc-implement"
# Значит Implementation фаза была в процессе

# 2. Запусти Perles
perles

# 3. В Perles TUI:
# Shift+J → переключись на "SDLC Progress Tracking" view
# Увидишь свой epic в колонке "Implementing"
# Ctrl+O → orchestration mode
# Ctrl+P → выбери "Interactive SDLC from Prompt"

# 4. Coordinator спросит: "Resume VP-epic1?"
# Ответь: "Yes"

# 5. Coordinator автоматически:
# - Определит текущую фазу по labels
# - Пропустит выполненные фазы
# - Продолжит с места остановки
```

### Результат

После завершения:

- Epic создан с подзадачами и dependencies
- Полный цикл SDLC выполнен (анализ → архитектура → план → код → тесты → ревью)
- Все задачи закрыты
- Epic помечен `phase-complete`

### Пример: Dark Mode Feature

**Промпт:** "I want to add dark mode to the app"

**Clarification (Coordinator задаёт вопросы):**

- Q: What components need dark mode?
  A: All pages and shared components
- Q: Design system exists?
  A: Yes, we have theme variables
- Q: User preference storage?
  A: localStorage
- Q: Default theme?
  A: Follow system preference
- Q: Transition animation?
  A: Smooth fade

**Structure Creation (Coordinator создаёт):**

```bash
bd create --title="Epic: Dark Mode Support" --type=feature --priority=1
# VP-400

bd create --title="Create theme context and provider" --type=task --priority=2  # VP-401
bd create --title="Define dark theme variables" --type=task --priority=2        # VP-402
bd create --title="Add theme toggle component" --type=task --priority=2         # VP-403
bd create --title="Update all pages with theme support" --type=task --priority=2 # VP-404
bd create --title="Add theme persistence (localStorage)" --type=task --priority=2 # VP-405

bd update VP-401 VP-402 VP-403 VP-404 VP-405 --parent=VP-400

bd dep add VP-403 VP-401  # Toggle depends on context
bd dep add VP-404 VP-402  # Pages depend on theme variables
bd dep add VP-405 VP-401  # Persistence depends on context
```

**Full SDLC Execution:**

1. Analyze → requirements clarified above
2. Architect → theme system architecture
3. Plan → implementation roadmap
4. Implement → all components coded
5. Test → test suite created
6. Review → quality check passed

**Итог:** Dark mode полностью реализован и протестирован.

## Workflow #2: Full SDLC Cycle

### Описание

Полный цикл разработки с 6 агентами:

1. **Analyze** (Opus) - анализ требований
2. **Architect** (Opus) - проектирование архитектуры
3. **Plan** (Opus) - детальное планирование
4. **Implement** (Sonnet) - реализация кода
5. **Test** (Sonnet) - написание тестов
6. **Review** (Opus) - финальное ревью

### Когда использовать

- Новая фича с unclear requirements
- Нужен полный цикл от анализа до ревью
- Архитектурные решения требуют обдумывания
- Критичная функциональность (auth, payments, security)

### Как запустить

**Шаг 1: Создай Epic и Task**

```bash
# 1. Создай epic
bd create --title="Epic: User Authentication System" --type=feature --priority=1
# Получил VP-epic1

# 2. Создай task для Full SDLC
bd create --title="Full SDLC: Implement OAuth2 authentication" --type=task --priority=1
# Получил VP-task1

# 3. Установи parent и label
bd update VP-task1 --parent=VP-epic1
bd update VP-task1 --labels="full-sdlc"
```

**Шаг 2: Запусти Perles**

```bash
cd [PROJECT_PATH]
perles

# В Perles TUI:
# 1. Shift+J → "Orchestration Candidates" view
# 2. Выбери VP-task1 (должен быть в колонке "Full SDLC")
# 3. Ctrl+O - войти в orchestration mode
# 4. Ctrl+P - открыть workflow picker
# 5. Выбери "Full SDLC Cycle"
```

**Шаг 3: Следи за процессом**

Coordinator последовательно выполнит все фазы:

- Analyze → requirements analysis
- Architect → system design
- Plan → implementation roadmap
- Implement → code
- Test → test suite
- Review → quality check

### Результат

После завершения в bead description:

- Analysis summary
- Architecture document с диаграммами
- Implementation plan
- Реализованный код
- Test suite
- Review report с verdict

## Workflow #3: Epic Parallel Batches

### Описание

Разбивает epic на batches и выполняет задачи параллельно:

- Batch 1: задачи без dependencies (параллельно)
- Batch 2: задачи, зависящие от Batch 1 (параллельно)
- Batch 3: задачи, зависящие от Batch 2 (параллельно)
- Integration: финальная интеграция и проверка

### Когда использовать

- Epic с 5-15 подзадачами
- Задачи можно группировать по dependencies
- Нужна быстрая параллельная реализация
- Задачи независимы (разные файлы, разные компоненты)

### Как запустить

**Шаг 1: Создай Epic с Подзадачами**

```bash
# 1. Создай epic
bd create --title="Epic: Dashboard Redesign" --type=feature --priority=1
# Получил VP-epic2

# 2. Создай подзадачи (можно через parallel subagents)
bd create --title="Header component" --type=task --priority=2
bd create --title="Sidebar component" --type=task --priority=2
bd create --title="Footer component" --type=task --priority=2
bd create --title="Main layout" --type=task --priority=2
bd create --title="User profile widget" --type=task --priority=2

# Получил VP-101, VP-102, VP-103, VP-104, VP-105

# 3. Установи parent для всех подзадач
bd update VP-101 --parent=VP-epic2
bd update VP-102 --parent=VP-epic2
bd update VP-103 --parent=VP-epic2
bd update VP-104 --parent=VP-epic2
bd update VP-105 --parent=VP-epic2

# 4. (Опционально) Установи dependencies
# Main layout зависит от Header, Sidebar, Footer
bd dep add VP-104 VP-101  # Layout depends on Header
bd dep add VP-104 VP-102  # Layout depends on Sidebar
bd dep add VP-104 VP-103  # Layout depends on Footer

# 5. Добавь label к epic (НЕ к подзадачам)
bd update VP-epic2 --labels="epic-batches"
```

**Шаг 2: Запусти Perles**

```bash
perles

# В Perles TUI:
# 1. Shift+J → "Orchestration Candidates" view
# 2. Выбери VP-epic2 (должен быть в колонке "Epic Batches")
# 3. Ctrl+O - войти в orchestration mode
# 4. Ctrl+P - открыть workflow picker
# 5. Выбери "Epic Parallel Batches"
```

**Шаг 3: Coordinator разбивает на Batches**

Автоматически группирует задачи:

**Batch 1 (параллельно):**

- VP-101: Header component
- VP-102: Sidebar component
- VP-103: Footer component

**Batch 2 (параллельно, после Batch 1):**

- VP-104: Main layout (зависит от 101, 102, 103)
- VP-105: User profile widget (независимо)

**Batch 3 (интеграция):**

- Integration tests
- Quality gates

### Результат

После завершения:

- Все подзадачи completed
- Batch execution report
- Integration status
- Quality gates passed
- Epic marked as complete

## Практические Примеры

### Пример 1: Full SDLC - OAuth2 Authentication

**Задача:** Внедрить OAuth2 авторизацию с нуля.

```bash
# Создаём epic + task
bd create --title="Epic: OAuth2 Authentication" --type=feature --priority=1
# VP-epic1

bd create --title="Full SDLC: OAuth2 implementation" --type=task --priority=1
# VP-task1

bd update VP-task1 --parent=VP-epic1
bd update VP-task1 --labels="full-sdlc"

# Запускаем Full SDLC workflow
```

**Процесс:**

1. **Analyze Agent (Opus):**

   - Requirements: OAuth2 flow, JWT tokens, refresh mechanism
   - User stories: Login, Logout, Token refresh, Auto-login
   - Acceptance criteria: Secure storage, CSRF protection, etc.

2. **Architect Agent (Opus):**

   - Component diagram: AuthProvider, TokenManager, API interceptor
   - Data flow: Login → Token → API calls → Refresh → Logout
   - Security: HttpOnly cookies, CSRF tokens, XSS prevention
   - Technology: Zustand for auth state, TanStack Query for API

3. **Planner Agent (Opus):**

   - Step 1: Create AuthProvider component
   - Step 2: Implement TokenManager service
   - Step 3: Add API interceptor for token injection
   - Step 4: Create Login/Logout pages
   - Step 5: Add protected route wrapper
   - Testing: Unit tests, integration tests, E2E flow

4. **Implementation Agent (Sonnet):**

   - Creates all files following FSD
   - Implements OAuth2 flow
   - Integrates with existing app structure

5. **Test Engineer (Sonnet):**

   - Unit tests for TokenManager
   - Integration tests for auth flow
   - MSW handlers for OAuth2 endpoints
   - Test fixtures for tokens

6. **Review Agent (Opus):**
   - Verdict: Approve ✓
   - Security: HttpOnly cookies ✓, CSRF protection ✓
   - Architecture: FSD compliance ✓
   - Tests: 95% coverage ✓

**Итог:** Полностью реализованная OAuth2 авторизация с документацией, кодом и тестами.

### Пример 2: Epic Batches - Dashboard Redesign

**Задача:** Редизайн дашборда с 10 компонентами.

```bash
# Создаём epic
bd create --title="Epic: Dashboard Redesign" --type=feature --priority=1
# VP-epic2

# Создаём 10 подзадач
bd create --title="Header component" --type=task --priority=2      # VP-101
bd create --title="Sidebar component" --type=task --priority=2     # VP-102
bd create --title="Footer component" --type=task --priority=2      # VP-103
bd create --title="Main layout" --type=task --priority=2           # VP-104
bd create --title="User profile widget" --type=task --priority=2   # VP-105
bd create --title="Statistics widget" --type=task --priority=2     # VP-106
bd create --title="Activity feed widget" --type=task --priority=2  # VP-107
bd create --title="Dashboard page" --type=task --priority=2        # VP-108
bd create --title="Integration tests" --type=task --priority=2     # VP-109
bd create --title="E2E tests" --type=task --priority=2             # VP-110

# Устанавливаем parent для всех
bd update VP-101 VP-102 VP-103 VP-104 VP-105 VP-106 VP-107 VP-108 VP-109 VP-110 --parent=VP-epic2

# Устанавливаем dependencies
bd dep add VP-104 VP-101  # Layout depends on Header
bd dep add VP-104 VP-102  # Layout depends on Sidebar
bd dep add VP-104 VP-103  # Layout depends on Footer
bd dep add VP-108 VP-104  # Dashboard page depends on Layout
bd dep add VP-108 VP-105  # Dashboard page depends on User profile
bd dep add VP-108 VP-106  # Dashboard page depends on Statistics
bd dep add VP-108 VP-107  # Dashboard page depends on Activity feed
bd dep add VP-109 VP-108  # Integration tests depend on Dashboard page
bd dep add VP-110 VP-109  # E2E tests depend on Integration tests

# Добавляем label к epic
bd update VP-epic2 --labels="epic-batches"

# Запускаем Epic Batches workflow
```

**Coordinator создаёт Batches:**

**Batch 1 (параллельно, 3 воркера):**

- VP-101: Header component
- VP-102: Sidebar component
- VP-103: Footer component

**Batch 2 (параллельно, 4 воркера):**

- VP-104: Main layout
- VP-105: User profile widget
- VP-106: Statistics widget
- VP-107: Activity feed widget

**Batch 3 (последовательно):**

- VP-108: Dashboard page

**Batch 4 (последовательно):**

- VP-109: Integration tests
- VP-110: E2E tests

**Итог:** 10 задач выполнены оптимально (параллельно где возможно), все зависимости соблюдены.

## Resume и Fault Tolerance

### Как это работает

**Отслеживание прогресса через labels:**

Каждая фаза workflow помечается специальным label:

| Label                    | Фаза                       |
| ------------------------ | -------------------------- |
| `phase-clarify`          | Уточнение требований       |
| `phase-create-structure` | Создание epic/tasks        |
| `phase-sdlc-analyze`     | Анализ                     |
| `phase-sdlc-architect`   | Архитектура                |
| `phase-sdlc-plan`        | Планирование               |
| `phase-sdlc-implement`   | Реализация                 |
| `phase-sdlc-test`        | Тестирование               |
| `phase-sdlc-review`      | Ревью                      |
| `phase-complete`         | Завершено                  |

**Автоматическое сохранение:**

- После каждой фазы coordinator обновляет label: `bd update <id> --labels="full-sdlc,phase-sdlc-implement"`
- Beads автоматически синхронизируется: `bd sync --flush-only`
- Label сохраняется даже если coordinator упадёт

### Resume после сбоя

**Сценарий 1: Пропал интернет во время Implementation**

```bash
# 1. Проверь текущее состояние
bd show VP-epic1
# Видишь label: "full-sdlc,phase-sdlc-plan"
# Это значит Plan завершён, Implementation начата но не закончена

# 2. Запусти Perles
perles

# 3. Переключись на "SDLC Progress Tracking" view
# Shift+J несколько раз

# 4. Увидишь VP-epic1 в колонке "Planning" (последняя завершённая фаза)

# 5. Ctrl+O → Ctrl+P → выбери тот же workflow
# Coordinator спросит: "Resume from Implementation phase?"
# Ответь: "Yes"

# 6. Работа продолжится с Implementation фазы
```

**Сценарий 2: Компьютер выключился во время Epic Batches**

```bash
# 1. Проверь состояние
bd show VP-epic2
# Видишь: некоторые tasks completed, некоторые in_progress

# 2. Coordinator автоматически определит:
# - Какие batches выполнены
# - Какие tasks в процессе
# - С какого batch продолжить

# 3. Работа продолжится с незавершённого batch
```

**Сценарий 3: Ошибка в середине Architect фазы**

```bash
# 1. Проверь label
bd show VP-epic1
# Label: "full-sdlc,phase-sdlc-analyze"
# Analyze завершён, Architect был в процессе

# 2. Resume через Perles
# Coordinator пропустит Analyze
# Перезапустит Architect фазу с начала
```

### View для отслеживания прогресса

**SDLC Progress Tracking view:**

```bash
# В Perles TUI:
# Shift+J → переключись на "SDLC Progress Tracking"

# Увидишь колонки:
# - Clarifying → issues в фазе уточнений
# - Creating Structure → создаётся epic структура
# - Analyzing → в фазе анализа
# - Architecting → в фазе архитектуры
# - Planning → в фазе планирования
# - Implementing → в фазе реализации
# - Testing → в фазе тестирования
# - Reviewing → в фазе ревью
# - Complete → завершённые issues
```

Это позволяет:

- Видеть на каком этапе находится каждый issue
- Быстро найти прерванную работу после сбоя
- Понимать прогресс по всем orchestration задачам

### Best Practices

**1. Проверяй прогресс перед shutdown:**

```bash
bd list --status=in_progress
# Смотри какие issues в работе
# Если есть orchestration issues - знай что можешь продолжить позже
```

**2. После сбоя - используй "SDLC Progress Tracking" view:**

```bash
perles
# Shift+J → "SDLC Progress Tracking"
# Найди свой issue по фазе
# Ctrl+O → resume
```

**3. Если сомневаешься на какой фазе:**

```bash
bd show <issue-id>
# Смотри labels - это надёжный источник правды
```

**4. Manual override (редко нужен):**

```bash
# Если хочешь перезапустить с конкретной фазы:
bd update VP-epic1 --labels="full-sdlc,phase-sdlc-plan"
# Coordinator начнёт с Plan фазы при следующем запуске
```

## Управление Labels

### Trigger Labels

```bash
# Interactive SDLC from Prompt workflow
bd update VP-task --labels="from-prompt"

# Full SDLC workflow
bd update VP-task --labels="full-sdlc"

# Epic Batches workflow
bd update VP-epic --labels="epic-batches"
```

### Phase Labels (автоматически устанавливаются coordinator)

**Interactive SDLC фазы:**

```bash
phase-clarify           # Уточнение требований
phase-create-structure  # Создание epic/tasks
```

**Full SDLC фазы:**

```bash
phase-sdlc-analyze      # Анализ
phase-sdlc-architect    # Архитектура
phase-sdlc-plan         # Планирование
phase-sdlc-implement    # Реализация
phase-sdlc-test         # Тестирование
phase-sdlc-review       # Ревью
phase-complete          # Завершено
```

**Эти labels НЕ нужно ставить вручную** - coordinator ставит их автоматически после каждой фазы для отслеживания прогресса.

## Views в Perles

### Default View

**Колонки:**

- Blocked
- Ready
- In Progress

**Когда использовать:** Ежедневная работа

### SDLC Pipeline View

**Колонки:**

- Analyze
- Architect
- Plan
- Implement
- Review

**Когда использовать:** Tracking текущих фаз для single-phase work

### Orchestration Candidates View

**Колонки:**

- Full SDLC (full-sdlc label + parent != null)
- Epic Batches (epic-batches label + parent != null)
- From Prompt (from-prompt label)
- Orchestration Ready (any orchestration label + in_progress)

**Когда использовать:** Выбор задач для запуска orchestration

**ВАЖНО:** Full SDLC и Epic Batches требуют parent epic. From Prompt создаёт epic автоматически.

### SDLC Progress Tracking View

**Колонки:**

- Clarifying (phase-clarify)
- Creating Structure (phase-create-structure)
- Analyzing (phase-sdlc-analyze)
- Architecting (phase-sdlc-architect)
- Planning (phase-sdlc-plan)
- Implementing (phase-sdlc-implement)
- Testing (phase-sdlc-test)
- Reviewing (phase-sdlc-review)
- Complete (phase-complete)

**Когда использовать:** Отслеживание прогресса orchestration работы, resume после сбоя

**Shift+J несколько раз** чтобы переключаться между views.

## Troubleshooting

### Workflow не запускается

**Проблема:** Ctrl+P не открывает workflow picker

**Решение:**

1. Убедись что в orchestration mode (Ctrl+O сначала)
2. Проверь workflows:
   ```bash
   ls -la ~/.perles/workflows/
   # Должны быть: full-sdlc.yaml, epic-batches.yaml
   ```

### Issue не появляется в Orchestration Candidates

**Проблема:** Добавил label, но issue не виден

**Решение:**

1. **ВАЖНО: Проверь parent:**

   ```bash
   bd show VP-xxx
   # parent должен быть установлен
   ```

   Если нет:

   ```bash
   bd update VP-xxx --parent=VP-epic1
   ```

2. Проверь label:

   ```bash
   bd show VP-xxx
   # labels должны включать: full-sdlc или epic-batches
   ```

3. Проверь status:
   ```bash
   # Для "Full SDLC" и "Epic Batches": status = open
   # Для "Orchestration Ready": status = in_progress
   ```

### Epic Batches не находит подзадачи

**Проблема:** Workflow запустился, но не видит child tasks

**Решение:**

1. Убедись что label установлен на EPIC, не на tasks:

   ```bash
   bd update VP-epic --labels="epic-batches"  # ✓ Правильно
   bd update VP-task --labels="epic-batches"  # ✗ Неправильно
   ```

2. Убедись что у tasks установлен parent:
   ```bash
   bd show VP-task
   # parent должен быть = VP-epic
   ```

## Keyboard Shortcuts

### В Perles TUI

| Shortcut  | Действие                 |
| --------- | ------------------------ |
| `Shift+J` | Next view                |
| `Shift+K` | Previous view            |
| `j` / `k` | Navigate issues          |
| `Enter`   | Open issue details       |
| `Ctrl+O`  | Enter orchestration mode |
| `Ctrl+P`  | Open workflow picker     |
| `q`       | Quit Perles              |

## Best Practices

### 1. Выбор между Full SDLC и Epic Batches

**Full SDLC:**

- Новая система/компонент
- Unclear requirements
- Архитектурные решения нужны
- Критичная функциональность

**Epic Batches:**

- Epic с >5 подзадачами
- Задачи можно распараллелить
- Известные паттерны
- Быстрая итерация нужна

### 2. Подготовка Epic для Epic Batches

**Хорошая структура:**

- Epic описание чёткое
- Подзадачи независимы (разные файлы)
- Dependencies явно указаны
- 5-15 задач (не слишком мало, не слишком много)

**Плохая структура:**

- Epic слишком большой (>20 задач)
- Подзадачи слишком связанные
- Нет dependencies (coordinator не может оптимизировать)
- Tasks модифицируют одни файлы

### 3. После Orchestration

**Обязательно:**

1. Review результат в bead
2. Run `npm run quality:gates`
3. Создай follow-up tasks если нужно
4. Обнови epic status
5. Sync: `bd sync --flush-only`

## FAQ

**Q: Какой workflow выбрать для новой идеи?**
A: Используй **Interactive SDLC from Prompt** - начнёшь с промпта, coordinator задаст уточняющие вопросы, создаст структуру и запустит Full SDLC.

**Q: Можно ли использовать Epic Batches для одной большой задачи?**
A: Нет, Epic Batches для epics с множеством подзадач. Для одной задачи используй Full SDLC.

**Q: Сколько воркеров максимум в Epic Batches?**
A: До 5 воркеров параллельно. Если batch > 5 задач, coordinator разобьёт на sub-batches.

**Q: Можно ли прервать workflow?**
A: Да, Ctrl+C → подтвердить. Прогресс сохранится через labels, сможешь продолжить позже.

**Q: Как продолжить после сбоя (пропал интернет, выключился компьютер)?**
A:
1. `bd show <issue-id>` - проверь labels, увидишь последнюю завершённую фазу
2. `perles` → Shift+J → "SDLC Progress Tracking" - найди issue
3. Ctrl+O → Ctrl+P → выбери тот же workflow
4. Coordinator автоматически продолжит с места остановки

**Q: Можно ли перезапустить с конкретной фазы?**
A: Да, вручную установи нужный label:
```bash
bd update VP-epic1 --labels="full-sdlc,phase-sdlc-plan"
# При следующем resume начнёт с Plan фазы
```

**Q: Как выбрать между orchestration и single-agent?**
A: Orchestration для сложных/комплексных задач (10%). Single-agent для рутины (90%).

**Q: Что если coordinator падает в середине фазы?**
A: Coordinator автоматически сохраняет label после КАЖДОЙ завершённой фазы. Упавшая фаза будет перезапущена с начала при resume.

**Q: Можно ли запустить Full SDLC на уже существующем epic?**
A: Да, используй **Interactive SDLC from Prompt** → при запросе "Existing epic ID or new prompt?" ответь ID существующего epic → coordinator пропустит clarification и запустит SDLC.

---

**Итог:** Три workflow для разных сценариев:

1. **Interactive SDLC** - от идеи до реализации с уточнениями
2. **Full SDLC** - полный цикл разработки на существующем epic
3. **Epic Batches** - параллельная работа над множеством подзадач

**Ключевая фича:** Resume functionality - можешь продолжить с места остановки после любого сбоя.
