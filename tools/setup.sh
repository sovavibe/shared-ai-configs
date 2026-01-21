#!/bin/bash
# setup.sh - CLI for shared-ai-configs
# Usage: ./setup.sh [init|sync|generate|link]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SHARED_CONFIGS_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_DIR="${PWD}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[✓]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ═══════════════════════════════════════════════════════════════
# INIT - Initialize project with .ai-project.yaml
# ═══════════════════════════════════════════════════════════════
cmd_init() {
    log_info "Initializing shared-ai-configs in ${PROJECT_DIR}"

    if [[ -f "${PROJECT_DIR}/.ai-project.yaml" ]]; then
        log_warn ".ai-project.yaml already exists. Use 'sync' to update."
        return 1
    fi

    # Copy example config
    cp "${SHARED_CONFIGS_DIR}/schema/ai-project.example.yaml" "${PROJECT_DIR}/.ai-project.yaml"
    log_success "Created .ai-project.yaml - please customize it for your project"

    # Create directories
    mkdir -p "${PROJECT_DIR}/.cursor/rules"
    mkdir -p "${PROJECT_DIR}/.claude/commands"
    mkdir -p "${PROJECT_DIR}/.claude/hooks"

    log_success "Created .cursor/rules and .claude directories"
    log_info "Next steps:"
    echo "  1. Edit .ai-project.yaml with your project settings"
    echo "  2. Run: ${SCRIPT_DIR}/setup.sh sync"
    echo "  3. Run: ${SCRIPT_DIR}/setup.sh generate"
}

# ═══════════════════════════════════════════════════════════════
# SYNC - Sync rules via symlinks
# ═══════════════════════════════════════════════════════════════
cmd_sync() {
    log_info "Syncing shared rules to ${PROJECT_DIR}"

    if [[ ! -f "${PROJECT_DIR}/.ai-project.yaml" ]]; then
        log_error ".ai-project.yaml not found. Run 'init' first."
        return 1
    fi

    # Read stack type from config (simple grep, could use yq for proper parsing)
    STACK_TYPE=$(grep "type:" "${PROJECT_DIR}/.ai-project.yaml" | head -1 | awk '{print $2}' | tr -d '"')
    VCS_TYPE=$(grep -A5 "vcs:" "${PROJECT_DIR}/.ai-project.yaml" | grep "type:" | head -1 | awk '{print $2}' | tr -d '"')
    ISSUES_TYPE=$(grep -A5 "issues:" "${PROJECT_DIR}/.ai-project.yaml" | grep "type:" | head -1 | awk '{print $2}' | tr -d '"')

    log_info "Detected: stack=${STACK_TYPE}, vcs=${VCS_TYPE}, issues=${ISSUES_TYPE}"

    # Sync CORE rules (always)
    log_info "Syncing CORE rules..."
    sync_directory "core" ".cursor/rules/core"

    # Sync STACK rules
    if [[ -d "${SHARED_CONFIGS_DIR}/stacks/${STACK_TYPE}" ]]; then
        log_info "Syncing STACK:${STACK_TYPE} rules..."
        sync_directory "stacks/${STACK_TYPE}" ".cursor/rules/stack"
    fi

    # Sync VCS integration
    if [[ -d "${SHARED_CONFIGS_DIR}/integrations/${VCS_TYPE}" ]]; then
        log_info "Syncing INTEGRATION:${VCS_TYPE}..."
        sync_directory "integrations/${VCS_TYPE}" ".claude/commands/${VCS_TYPE}"
    fi

    # Sync issues integration
    if [[ -d "${SHARED_CONFIGS_DIR}/integrations/${ISSUES_TYPE}" ]]; then
        log_info "Syncing INTEGRATION:${ISSUES_TYPE}..."
        sync_directory "integrations/${ISSUES_TYPE}" ".claude/commands/${ISSUES_TYPE}"
    fi

    # Sync beads integration (if enabled)
    BEADS_ENABLED=$(grep -A3 "task_tracking:" "${PROJECT_DIR}/.ai-project.yaml" | grep "enabled:" | awk '{print $2}')
    if [[ "${BEADS_ENABLED}" == "true" ]]; then
        log_info "Syncing INTEGRATION:beads..."
        sync_directory "integrations/beads" ".cursor/rules/integrations"
    fi

    # Sync hooks
    log_info "Syncing hooks..."
    sync_directory "hooks" ".claude/hooks"
    chmod +x "${PROJECT_DIR}/.claude/hooks/"*.sh 2>/dev/null || true

    log_success "Sync complete!"
}

sync_directory() {
    local src_rel="$1"
    local dst_rel="$2"
    local src_dir="${SHARED_CONFIGS_DIR}/${src_rel}"
    local dst_dir="${PROJECT_DIR}/${dst_rel}"

    mkdir -p "${dst_dir}"

    # Create symlinks for each file
    for file in "${src_dir}"/*; do
        if [[ -f "$file" ]]; then
            local filename=$(basename "$file")
            local dst_file="${dst_dir}/${filename}"

            # Remove existing file/symlink
            rm -f "${dst_file}" 2>/dev/null || true

            # Create symlink
            ln -s "${file}" "${dst_file}"
            log_success "  → ${dst_rel}/${filename}"
        fi
    done

    # Handle subdirectories
    for subdir in "${src_dir}"/*/; do
        if [[ -d "$subdir" ]]; then
            local subdirname=$(basename "$subdir")
            sync_directory "${src_rel}/${subdirname}" "${dst_rel}/${subdirname}"
        fi
    done
}

# ═══════════════════════════════════════════════════════════════
# GENERATE - Generate CLAUDE.md from template
# ═══════════════════════════════════════════════════════════════
cmd_generate() {
    log_info "Generating CLAUDE.md from template..."

    if [[ ! -f "${PROJECT_DIR}/.ai-project.yaml" ]]; then
        log_error ".ai-project.yaml not found. Run 'init' first."
        return 1
    fi

    local template="${SHARED_CONFIGS_DIR}/templates/CLAUDE.template.md"
    local output="${PROJECT_DIR}/CLAUDE.md"
    local config="${PROJECT_DIR}/.ai-project.yaml"

    if [[ ! -f "${template}" ]]; then
        log_error "Template not found: ${template}"
        return 1
    fi

    # Simple template substitution using sed
    # For complex templates, consider using envsubst or a proper templating engine

    cp "${template}" "${output}"

    # Extract values from YAML and substitute
    substitute_yaml_value "project.name" "project:" "name:"
    substitute_yaml_value "project.description" "project:" "description:"
    substitute_yaml_value "project.role" "project:" "role:"
    substitute_yaml_value "project.language" "project:" "language:"

    substitute_yaml_value "stack.framework.name" "framework:" "name:" 1
    substitute_yaml_value "stack.framework.version" "framework:" "version:" 1
    substitute_yaml_value "stack.build.tool" "build:" "tool:"
    substitute_yaml_value "stack.build.version" "build:" "version:" 1
    substitute_yaml_value "stack.language.name" "language:" "name:" 2
    substitute_yaml_value "stack.language.version" "language:" "version:" 2
    substitute_yaml_value "stack.ui.library" "ui:" "library:"
    substitute_yaml_value "stack.ui.version" "ui:" "version:" 3
    substitute_yaml_value "stack.ui.styling" "ui:" "styling:"
    substitute_yaml_value "stack.state.server" "state:" "server:"
    substitute_yaml_value "stack.state.client" "state:" "client:"
    substitute_yaml_value "stack.api.codegen" "api:" "codegen:"
    substitute_yaml_value "stack.api.mocks" "api:" "mocks:"
    substitute_yaml_value "stack.linter" "stack:" "linter:"

    substitute_yaml_value "integrations.task_tracking.type" "task_tracking:" "type:"
    substitute_yaml_value "integrations.task_tracking.key_prefix" "task_tracking:" "key_prefix:"

    substitute_yaml_value "commands.dev" "commands:" "dev:"
    substitute_yaml_value "commands.build" "commands:" "build:"
    substitute_yaml_value "commands.lint" "commands:" "lint:"
    substitute_yaml_value "commands.test" "commands:" "test:"
    substitute_yaml_value "commands.codegen" "commands:" "codegen:"
    substitute_yaml_value "commands.quality_gates" "commands:" "quality_gates:"
    substitute_yaml_value "commands.task_ready" "commands:" "task_ready:"
    substitute_yaml_value "commands.task_update" "commands:" "task_update:"
    substitute_yaml_value "commands.task_close" "commands:" "task_close:"
    substitute_yaml_value "commands.task_sync" "commands:" "task_sync:"

    substitute_yaml_value "paths.codegen_output" "paths:" "codegen_output:"
    substitute_yaml_value "paths.cursor_rules" "paths:" "cursor_rules:"
    substitute_yaml_value "paths.claude_docs" "paths:" "claude_docs:"
    substitute_yaml_value "paths.context_handoff" "paths:" "context_handoff:"

    substitute_yaml_value "ide.primary" "ide:" "primary:"
    substitute_yaml_value "ide.secondary" "ide:" "secondary:"

    substitute_yaml_value "options.dev_server_port" "options:" "dev_server_port:"
    substitute_yaml_value "options.model_switching" "options:" "model_switching:"
    substitute_yaml_value "options.token_optimization" "options:" "token_optimization:"
    substitute_yaml_value "options.skip_rules.enhancement" "skip_rules:" "enhancement:"
    substitute_yaml_value "options.skip_rules.bugfix" "skip_rules:" "bugfix:"
    substitute_yaml_value "options.skip_rules.simple_fix" "skip_rules:" "simple_fix:"

    substitute_yaml_value "shared_configs.source" "shared_configs:" "source:"

    # Handle architecture.structure (multiline)
    # This is simplified - for proper multiline, use a real YAML parser

    log_success "Generated CLAUDE.md"
    log_info "Review the generated file and adjust as needed"
}

substitute_yaml_value() {
    local placeholder="$1"
    local section="$2"
    local key="$3"
    local occurrence="${4:-1}"

    local config="${PROJECT_DIR}/.ai-project.yaml"
    local output="${PROJECT_DIR}/CLAUDE.md"

    # Extract value from YAML (simple grep-based, not perfect but works for flat values)
    local value
    value=$(grep -A100 "${section}" "${config}" | grep "${key}" | head -n "${occurrence}" | tail -1 | sed "s/.*${key}[[:space:]]*//" | tr -d '"' | tr -d "'" | xargs)

    if [[ -n "$value" ]]; then
        # Escape special characters for sed
        local escaped_value
        escaped_value=$(echo "$value" | sed 's/[&/\]/\\&/g')
        sed -i '' "s|{{${placeholder}}}|${escaped_value}|g" "${output}" 2>/dev/null || \
        sed -i "s|{{${placeholder}}}|${escaped_value}|g" "${output}"
    fi
}

# ═══════════════════════════════════════════════════════════════
# LINK - Create symlinks to individual files
# ═══════════════════════════════════════════════════════════════
cmd_link() {
    local src="$1"
    local dst="$2"

    if [[ -z "$src" ]] || [[ -z "$dst" ]]; then
        log_error "Usage: setup.sh link <source> <destination>"
        echo "  Example: setup.sh link core/001-persona.mdc .cursor/rules/001-persona.mdc"
        return 1
    fi

    local src_path="${SHARED_CONFIGS_DIR}/${src}"
    local dst_path="${PROJECT_DIR}/${dst}"

    if [[ ! -f "${src_path}" ]]; then
        log_error "Source not found: ${src_path}"
        return 1
    fi

    mkdir -p "$(dirname "${dst_path}")"
    rm -f "${dst_path}" 2>/dev/null || true
    ln -s "${src_path}" "${dst_path}"

    log_success "Linked: ${dst} → ${src}"
}

# ═══════════════════════════════════════════════════════════════
# STATUS - Show current state
# ═══════════════════════════════════════════════════════════════
cmd_status() {
    log_info "Shared-ai-configs status for ${PROJECT_DIR}"
    echo ""

    if [[ -f "${PROJECT_DIR}/.ai-project.yaml" ]]; then
        log_success ".ai-project.yaml exists"

        local stack_type
        stack_type=$(grep "type:" "${PROJECT_DIR}/.ai-project.yaml" | head -1 | awk '{print $2}' | tr -d '"')
        echo "  Stack: ${stack_type}"
    else
        log_warn ".ai-project.yaml not found - run 'init'"
    fi

    echo ""
    log_info "Symlinked rules:"
    find "${PROJECT_DIR}/.cursor/rules" -type l 2>/dev/null | while read -r link; do
        target=$(readlink "$link")
        echo "  $(basename "$link") → ${target}"
    done

    echo ""
    log_info "Symlinked hooks:"
    find "${PROJECT_DIR}/.claude/hooks" -type l 2>/dev/null | while read -r link; do
        target=$(readlink "$link")
        echo "  $(basename "$link") → ${target}"
    done
}

# ═══════════════════════════════════════════════════════════════
# HELP
# ═══════════════════════════════════════════════════════════════
cmd_help() {
    echo "shared-ai-configs CLI"
    echo ""
    echo "Usage: setup.sh <command> [options]"
    echo ""
    echo "Commands:"
    echo "  init      Initialize project with .ai-project.yaml"
    echo "  sync      Sync rules via symlinks based on .ai-project.yaml"
    echo "  generate  Generate CLAUDE.md from template"
    echo "  link      Create symlink to specific file"
    echo "  status    Show current configuration status"
    echo "  help      Show this help"
    echo ""
    echo "Examples:"
    echo "  # Initialize new project"
    echo "  cd /path/to/my-project"
    echo "  ${SCRIPT_DIR}/setup.sh init"
    echo ""
    echo "  # Sync after editing .ai-project.yaml"
    echo "  ${SCRIPT_DIR}/setup.sh sync"
    echo ""
    echo "  # Generate CLAUDE.md"
    echo "  ${SCRIPT_DIR}/setup.sh generate"
    echo ""
    echo "  # Link specific file"
    echo "  ${SCRIPT_DIR}/setup.sh link core/001-persona.mdc .cursor/rules/001-persona.mdc"
}

# ═══════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════
main() {
    local cmd="${1:-help}"
    shift || true

    case "$cmd" in
        init)     cmd_init "$@" ;;
        sync)     cmd_sync "$@" ;;
        generate) cmd_generate "$@" ;;
        link)     cmd_link "$@" ;;
        status)   cmd_status "$@" ;;
        help|--help|-h) cmd_help ;;
        *)
            log_error "Unknown command: $cmd"
            cmd_help
            exit 1
            ;;
    esac
}

main "$@"
