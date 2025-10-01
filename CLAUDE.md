# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **context-driven development (CDD) playground** exploring a novel approach to software documentation and development. The project implements a context file system where modules self-document their purpose, usage scenarios, and boundaries through structured `.ctx.yml` files.

## Core Commands

### Context Management
```bash
# Sync all contexts (local + global)
pnpm ctx:sync

# Sync local contexts (*.ctx.yml files)
pnpm ctx:sync:local

# Sync global contexts (.ctx/ documentation)
pnpm ctx:sync:global

# Validate all contexts
pnpm ctx:validate

# Validate local contexts
pnpm ctx:validate:local

# Validate global contexts
pnpm ctx:validate:global
```

### AI-Powered Context Commands

Use these Claude Code commands for AI-assisted context management:

```bash
# Generate AI annotations for global contexts
/sync-global-ctx

# Assist with local context file creation/updates
/sync-local-ctx
```

### Development
```bash
# Run development server (web app)
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

## Architecture

### Context File System

The core innovation of this project is the **context file system** - a structured approach to modular and project-level documentation:

**Local Contexts:**
- **Context Files** (`.ctx.yml` or `*.ctx.yml`): YAML files that document what a module does, when to use it, and when NOT to use it
- **Local Registry** (`.ctx/.local-context-registry.yml`): Auto-generated index of all local context files

**Global Contexts:**
- **Documentation** (`.ctx/**/*.md`): Project-level documentation (architecture, rules, etc.)
- **Global Registry** (`.ctx/.global-context-registry.yml`): Auto-generated index with AI-powered descriptions

**Tooling:**
- **Sync Scripts**: Mechanical updates for checksums and file lists
- **Validation Scripts**: Ensure contexts are valid and in sync
- **AI Annotations**: Claude-generated descriptions for navigation and understanding

### Directory Structure

```
.ctx/                               # Context root
  .local-context-registry.yml       # Auto-generated local context index
  .global-context-registry.yml      # Auto-generated global context index with AI comments
  architecture/                     # Architecture documentation
  rules/                            # Development rules
  stories/                          # Feature stories/specs
  templates/                        # Templates for specs and contexts

scripts/                            # Context management tooling
  sync.ts                           # Entry point for sync
  validate.ts                       # Entry point for validation
  lib/
    types.ts                        # Type definitions
    parser.ts                       # YAML parsing utilities
    validator.ts                    # Validation logic (local + global)
    checksumUtil.ts                 # Checksum computation
    localRegistry.ts                # Local context sync logic
    globalRegistry.ts               # Global context sync logic

src/                                # Source code with inline .ctx.yml files
  utils/
    url.ts                          # Example utility module
    url.ctx.yml                     # Context file for url.ts

.claude/commands/                   # Claude Code commands
  sync-global-ctx.md                # AI annotation for global contexts
  sync-local-ctx.md                 # AI assistance for local contexts
  plan.md                           # Planning workflow (uses global registry)
  spec.md                           # Specification workflow (uses global registry)
```

## Working with Context Files

### What Are Context Files?

Context files (`.ctx.yml`) provide usage-oriented documentation for modules. Instead of technical implementation details, they focus on:

- **WHAT**: What problem does this module solve?
- **WHEN**: When should you use this module?
- **WHEN NOT**: When should you NOT use this module?

### Creating a Context File

Every module should have an accompanying `.ctx.yml` file. Required fields:

```yaml
meta:
  version: 0.0.1
  target: /src/path/to/module.ts    # Absolute path from project root

what: |
  Clear description of what this module does
  and the problem it solves

use_when:
  - Specific scenario when this module should be used
  - Another concrete use case
  - Third condition that warrants using this module

do_not_use_when:
  - Scenario when this module should NOT be used
  - Case where a different solution is better
  - Condition where this module will fail or perform poorly

future:  # Optional
  - Planned improvements
  - Known limitations to address
```

### Local Context Workflow

1. **Create/Edit** a `.ctx.yml` file next to your module
2. **Sync** to update the registry: `pnpm ctx:sync:local`
3. **Validate** to check for errors: `pnpm ctx:validate:local`

The local registry (`.ctx/.local-context-registry.yml`) is auto-generated and should not be edited manually.

### Global Context Workflow

1. **Create/Edit** documentation in `.ctx/` (e.g., `.ctx/rules/new-rule.md`)
2. **Mechanical Sync**: `pnpm ctx:sync:global` (updates checksums and file lists)
3. **AI Annotation**: Run `/sync-global-ctx` in Claude Code to generate descriptions
4. **Validate**: `pnpm ctx:validate:global`

The global registry (`.ctx/.global-context-registry.yml`) is auto-generated and should not be edited manually. AI comments are added via Claude Code commands.

### Context File Naming

Two naming conventions are supported:

- `ctx.yml` - Documents the entire directory
- `*.ctx.yml` - Documents a specific file (e.g., `url.ctx.yml` for `url.ts`)

## Development Philosophy

This project explores **context-driven development**, where:

1. Modules are self-documenting through context files
2. Documentation focuses on usage scenarios rather than implementation
3. The context registry provides a searchable index of all capabilities
4. Validation ensures documentation stays in sync with code structure

When adding new code, prioritize creating clear context documentation that helps future developers (human or AI) understand WHEN to use your module and WHEN to avoid it.

## Working with Files - IMPORTANT

**When reading any source file, ALWAYS check for and read its accompanying `.ctx.yml` file.**

For example:
- When reading `src/utils/url.ts`, also read `src/utils/url.ctx.yml`
- When reading `src/components/Button.tsx`, also read `src/components/Button.ctx.yml`

Context files provide essential information about:
- What the module does and why it exists
- When to use it vs. when to avoid it
- Future improvements and known limitations

This context is crucial for making informed decisions about using or modifying code.

## TypeScript Usage

The project uses TypeScript for scripts and source code. Type definitions for the context system are in [scripts/lib/types.ts](scripts/lib/types.ts).

## Monorepo Structure

Uses pnpm workspaces with workspace configuration in [pnpm-workspace.yaml](pnpm-workspace.yaml). The previous `apps/web` package has been removed; current development focuses on the context system infrastructure in `src/`.
