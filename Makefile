# shared-ai-configs Makefile
# Common development commands

.PHONY: help install build watch test lint format quality fix clean link unlink

# Default target
help:
	@echo "shared-ai-configs development commands:"
	@echo ""
	@echo "  make install    Install dependencies"
	@echo "  make build      Compile TypeScript"
	@echo "  make watch      Watch mode compilation"
	@echo "  make test       Run tests"
	@echo "  make lint       Run ESLint"
	@echo "  make format     Format code with Prettier"
	@echo "  make quality    Run all quality checks"
	@echo "  make fix        Auto-fix lint and format issues"
	@echo "  make clean      Remove build artifacts"
	@echo "  make link       npm link for local development"
	@echo "  make unlink     npm unlink"
	@echo ""

# Dependencies
install:
	npm install

# Build
build:
	npm run build

watch:
	npm run watch

# Testing
test:
	npm run test

test-watch:
	npm run test -- --watch

# Quality
lint:
	npm run lint
	npm run lint:md

format:
	npm run format

format-check:
	npm run format:check

quality:
	npm run quality

fix:
	npm run quality:fix

# Cleanup
clean:
	rm -rf dist/
	rm -rf coverage/
	rm -rf node_modules/.cache/

# Development
link:
	npm link

unlink:
	npm unlink -g shared-ai-configs

# Release preparation
prepublish: quality build test
	@echo "Ready for publish"

# Generate in dry-run mode
dry-run:
	npx shared-ai-configs generate --dry-run

# Validate schema
validate:
	npx shared-ai-configs validate
