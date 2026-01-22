# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- GitHub issue and PR templates
- CONTRIBUTING.md with development guide
- Makefile for common operations
- Basic test infrastructure

### Changed

- Improved documentation structure

## [1.0.0] - 2026-01-21

### Added

- Initial release with full CLI functionality
- 5 commands: `init`, `generate`, `validate`, `status`, `doctor`
- Multi-target support: Claude Code and Cursor IDE
- 28 core rules for universal guidance
- 9 stack-specific rules (React, Node.js)
- 4 integration modules (Beads, GitHub, GitLab, Jira)
- EJS templates for CLAUDE.md and documentation
- JSON Schema validation for `.ai-project.yaml`
- Quality tooling: ESLint, Prettier, Husky, markdownlint
- GitHub Actions CI/CD pipeline
- Platform detection (macOS/Linux) in doctor command
- VCS abstraction (GitHub/GitLab) based on config
- MCP server health checks

### Documentation

- README with quick start guide
- CLAUDE.md for Claude Code guidance
- Architecture documentation (docs/ARCHITECTURE.md)
- Design principles (docs/PRINCIPLES.md)
- Multi-target architecture guide (docs/MULTI-TARGET-ARCHITECTURE.md)

[Unreleased]: https://github.com/sovavibe/shared-ai-configs/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/sovavibe/shared-ai-configs/releases/tag/v1.0.0
