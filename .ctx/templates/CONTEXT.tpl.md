# Module Context Documentation Template

## Overview

Module context documentation helps developers and AI agents understand:
- **WHAT** a module does - its primary purpose and responsibility
- **WHEN** to use it - specific scenarios and use cases
- **WHEN NOT** to use it - boundaries and anti-patterns

This approach focuses on practical usage rather than technical classification, making modules more discoverable and preventing misuse.

## Template Structure

### Required Fields

#### `meta.version`
- Semantic version (e.g., `0.0.1`)
- Tracks documentation evolution
- Start with `0.0.1` for new contexts

#### `meta.target`
- Single file or folder path this context applies to
- Absolute path from project root (starting with /)
- Examples: `/apps/web/src/index.tsx`, `/packages/ui/components/TodoList`, `/libs/utils`

#### `what`
- Clear, concise description of the module's purpose
- Focus on the problem it solves
- Avoid implementation details (that's in the code)

#### `use_when`
- List 2-3 specific scenarios when to use this module
- Be concrete and practical
- Help developers quickly identify if this fits their need

#### `do_not_use_when`
- List 2-3 scenarios when NOT to use this module
- Include performance limitations
- Suggest alternatives when possible

### Optional Fields

#### `future`
- Planned improvements or extensions
- Known issues to be addressed
- Potential optimizations

## Template

```yaml
meta:
  version: 0.0.1
  target: /apps/web/src/components/TodoList   # Single file or folder

what: |
  Clear, concise description of what this module does
  and its primary responsibility

use_when:
  - Specific scenario when this module should be used
  - Another clear use case
  - Third condition that warrants using this module

do_not_use_when:
  - Specific scenario when this module should NOT be used
  - Another case where a different solution is better
  - Condition where this module will fail or perform poorly

future: # (optional)
  - Planned improvements or extensions
  - Known issues to be addressed
  - Potential optimizations
```

## Examples

### Example 1: React Component

```yaml
meta:
  version: 0.0.1
  target: /apps/web/src/components/TodoList

what: |
  A React component that manages a list of todo items with
  add, edit, delete, and complete functionality

use_when:
  - You need a self-contained todo list with local state
  - You want drag-and-drop reordering of items
  - You need keyboard shortcuts for quick actions

do_not_use_when:
  - You need server-side persistence (this is client-only)
  - You require real-time collaboration features
  - You have more than 1000 items (performance degrades)

future:
  - Add undo/redo functionality
  - Implement virtual scrolling for large lists
  - Add export to CSV/JSON features
```

### Example 2: Utility Module

```yaml
meta:
  version: 0.0.1
  target: /packages/shared/utils/validation

what: |
  Form validation utilities with built-in rules for
  common field types and custom validation support

use_when:
  - You need client-side form validation
  - You want consistent validation across the app
  - You need custom validation rules with error messages

do_not_use_when:
  - You only need simple HTML5 validation
  - You're using a form library with built-in validation
  - You need async validation (this is sync only)

future:
  - Add async validation support
  - Add i18n for error messages
```

## Best Practices

1. **Be Specific** - Avoid vague descriptions like "handles data"
2. **Focus on Usage** - Describe WHEN to use, not HOW it works
3. **Provide Boundaries** - Clear do_not_use_when prevents misuse
4. **Keep it Current** - Update version when context changes significantly
5. **One Target** - Each context file documents exactly one module/component