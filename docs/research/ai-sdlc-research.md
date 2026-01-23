# Исследование: AI SDLC Best Practices

> **Задача**: shared-ai-configs-n4f
> **Дата**: 2026-01-23
> **Статус**: Completed

## Источники

### Официальная документация

- [Claude Code Common Workflows](https://code.claude.com/docs/en/common-workflows)
- [Claude Code Subagents](https://www.cursor-ide.com/blog/claude-code-subagents)

### Академические источники

- [LLM-Based Multi-Agent Systems for Software Engineering](https://arxiv.org/html/2404.04834v4) - ACM TOSEM
- [The AI-Native Software Development Lifecycle](https://www.arxiv.org/pdf/2408.03416)

### Индустриальные практики

- [AI-Driven SDLC - AWS DevOps Blog](https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/)
- [AI in SDLC 2026 - Ciklum](https://www.ciklum.com/blog/ai-revolutionize-software-development-lifecycle/)
- [AI-Powered SDLC Framework](https://jgelin.medium.com/ai-powered-sdlc-building-an-ai-framework-for-developer-experience-335dd2afac1d)

---

## Ключевые Findings

### 1. Роли в AI SDLC

| Framework | Роли |
|-----------|------|
| **MetaGPT** | Product Manager → Architect → Engineer → QA Engineer |
| **AgileCoder** | Product Manager, Scrum Master, Developer, Tester |
| **Claude Code** | Plan Mode Agent, Specialized Subagents, Execution Agent |
| **Product Trinity** | PM Agent, UX Designer Agent, Implementation Specialist |
| **Generic** | Analyst, Architect, Planner, Implementer, Reviewer |

**Вывод**: Роли должны быть **функциональными** (что делает), а не **инструментальными** (какой инструмент).

### 2. Паттерны Workflow

#### Sequential Workflow (Линейный)

```
Analyze → Architect → Plan → Implement → Review → Done
```

- Используется в MetaGPT, AgileCoder
- Чёткая передача контекста между фазами
- Подходит для структурированных задач

#### Parallel Workflow (Параллельный)

```
         ┌─ Security Audit ─┐
Task ────┼─ Implementation ─┼──→ Merge
         └─ Documentation ──┘
```

- Claude Code поддерживает до 10 параллельных subagents
- Требует orchestration и context management
- Подходит для независимых подзадач

#### Iterative Workflow (Итеративный)

```
Plan ─→ Implement ─→ Review ─→ Fix ─→ Review ─→ Done
                       ↑         │
                       └─────────┘
```

- Agile-подход с циклами
- Включает feedback loops
- Подходит для сложных/неопределённых задач

#### Dynamic Workflow (Динамический)

```
Think-on-Process: workflow генерируется на лету
```

- Нет фиксированных шагов
- Агент сам решает следующее действие
- Подходит для research/exploration задач

### 3. Способности vs Инструменты

**Текущая проблема dual-ide.mdc**:

```
Claude Code Opus ← Жёсткая привязка к продукту
Cursor Agent ← Жёсткая привязка к IDE
```

**Правильный подход**:

```
Capability: Deep Reasoning → Examples: Opus, GPT-4, Gemini Pro
Capability: Fast Coding → Examples: Cursor Agent, Copilot, Claude Sonnet
```

| Способность | Описание | Примеры агентов |
|-------------|----------|-----------------|
| **Deep Reasoning** | Архитектура, анализ, принятие решений | Opus, GPT-4o, Gemini Pro |
| **Fast Implementation** | Генерация кода, итерации | Cursor Agent, Copilot, Sonnet |
| **Specialized Analysis** | Security, Performance, Testing | Snyk, Lighthouse, Jest |
| **Context Preservation** | Память, handoff | Hindsight, Memory Bank |

### 4. Координация между агентами

#### Message Passing (Рекомендуется)

- Агенты НЕ общаются напрямую
- Orchestrator управляет потоком
- Structured handoff через shared state

#### Context Management

```yaml
handoff:
  continuation_id: "sdlc-123"  # Для MCP tools
  memory_bank_key: "project/phase"  # Для persistence
  summary: "Краткое описание контекста"
```

#### Context Windowing

- Сжатие вывода перед передачей следующему агенту
- Сохранение только критичной информации
- Предотвращение context overflow

### 5. Best Practices (2026)

#### Governance

- AI systems требуют auditability и explainability
- EU AI Act, NIST AI RMF влияют на процессы
- Нужны regulatory artifacts в SDLC

#### Human-AI Collaboration

```
AI creates plan → Asks clarifying questions → Human validates → AI implements
```

- AI как ассистент, не замена
- Human oversight на критичных решениях
- Итеративное уточнение требований

#### Recommendations по годам (Gartner/McKinsey)

- **2026**: Production-grade copilots, eval packs, RBAC for model access
- **2027**: 2-3 agent patterns в CI/CD, QA, FinOps
- **2028**: Agent orchestration, model lifecycle governance

---

## Архитектурные Рекомендации

### 1. Абстрактные роли (не привязаны к инструментам)

```
┌─────────────────────────────────────────────────────────┐
│                    AI SDLC ROLES                        │
├─────────────┬───────────────────────────────────────────┤
│ ANALYST     │ Deep analysis, requirements, research     │
│ ARCHITECT   │ System design, patterns, decisions       │
│ PLANNER     │ Task breakdown, estimation, priorities   │
│ IMPLEMENTER │ Code generation, fast iterations         │
│ REVIEWER    │ Quality, security, compliance            │
└─────────────┴───────────────────────────────────────────┘
```

### 2. Capability Mapping (динамический)

```yaml
roles:
  analyst:
    capabilities: [deep_reasoning, context_awareness]
    examples:
      - { agent: "Claude Opus", context: "Claude Code" }
      - { agent: "GPT-4o", context: "API" }
      - { agent: "Gemini Pro", context: "Vertex AI" }

  implementer:
    capabilities: [fast_coding, iteration]
    examples:
      - { agent: "Cursor Agent", context: "Cursor IDE" }
      - { agent: "Copilot", context: "VS Code" }
      - { agent: "Claude Sonnet", context: "Any" }
```

### 3. Workflow как конфигурация

```yaml
workflow: sequential  # or parallel, iterative, dynamic

phases:
  - name: analyze
    role: analyst
    mode: plan
    output: requirements.md

  - name: architect
    role: architect
    mode: plan
    depends_on: [analyze]
    output: design.md

  - name: implement
    role: implementer
    mode: auto
    depends_on: [architect]
    output: code

  - name: review
    role: reviewer
    mode: plan
    depends_on: [implement]
    output: review.md
```

### 4. Handoff Protocol

```yaml
handoff:
  format: structured
  preserve:
    - continuation_id  # MCP context
    - key_decisions    # Important choices made
    - constraints      # What NOT to change
    - test_plan        # How to verify
  compress:
    - verbose_output   # Summarize long outputs
    - intermediate_steps  # Keep only results
```

---

## Выводы для ai-sdlc-workflow.mdc

### Переименовать

`dual-ide.mdc` → `ai-sdlc-workflow.mdc`

### Структура нового файла

1. **Overview** - Что такое AI SDLC
2. **Roles** - Абстрактные роли (Analyst, Architect, Planner, Implementer, Reviewer)
3. **Capabilities** - Какие способности нужны для каждой роли
4. **Agent Mapping** - Как маппить свои инструменты на роли
5. **Workflow Patterns** - Sequential, Parallel, Iterative
6. **Handoff Protocol** - Как передавать контекст
7. **Examples** - Примеры для разных стеков

### Убрать

- Жёсткую привязку "Claude Code = X, Cursor = Y"
- Упоминания конкретных IDE как единственных опций
- "Dual IDE" терминологию

### Добавить

- Capability-based role assignment
- Dynamic agent mapping
- Workflow configuration patterns
- Universal handoff protocol
