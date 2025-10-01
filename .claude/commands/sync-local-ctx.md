# Sync Local Context Registry with AI Assistance

Synchronize local context files (*.ctx.yml) and provide assistance with context file creation and updates.

## Purpose

This command:
1. Runs mechanical sync to update the local context registry
2. Identifies issues (missing contexts, outdated contexts)
3. Assists with creating or updating context files
4. Validates the results

## Workflow

### Step 1: Run Mechanical Sync

Execute the sync script:

```bash
pnpm ctx:sync:local
```

Parse the output to understand:
- How many context files were found
- Any parsing errors
- Registry location and stats

### Step 2: Identify Issues (Optional)

If requested, check for common issues:

**Missing Context Files:**
- New source files without corresponding `.ctx.yml`
- Use file patterns to find source files
- Compare with registry entries

**Outdated Contexts:**
- Context files where source code has changed significantly
- Checksum mismatches (if tracking source files)

**Validation Errors:**
Run validation to check for structural issues:

```bash
pnpm ctx:validate:local
```

### Step 3: Assist with Context Files

Based on user request:

#### Creating New Context Files

If user asks to create context for a specific file:

1. **Analyze Source Code:**
   - Read the target file
   - Identify exports, functions, classes
   - Understand purpose and usage patterns

2. **Read Template:**
   - Read `.ctx/templates/CONTEXT.tpl.md` for structure
   - Follow the template format

3. **Generate Context File:**
   Create a `.ctx.yml` file following this structure:

   ```yaml
   meta:
     version: 0.0.1
     target: /src/path/to/module.ts

   what: |
     [Clear description of what this module does]

   use_when:
     - [Specific scenario 1]
     - [Specific scenario 2]
     - [Specific scenario 3]

   do_not_use_when:
     - [When not to use this module]
     - [Alternative solutions for those cases]

   future:
     - [Known limitations or planned improvements]
   ```

4. **Save and Validate:**
   - Write the context file
   - Run sync and validation
   - Report results

#### Updating Existing Context Files

If user asks to update an existing context:

1. **Read Current Context:**
   - Parse existing `.ctx.yml`
   - Understand current documentation

2. **Analyze Changes:**
   - Read source file
   - Identify what changed
   - Compare with current context

3. **Update Context:**
   - Merge user feedback
   - Update relevant sections
   - Increment version (0.0.1 → 0.0.2)

4. **Save and Validate:**
   - Write updated context
   - Run sync and validation
   - Report results

### Step 4: Re-sync and Validate

After any changes:

1. Run sync: `pnpm ctx:sync:local`
2. Run validation: `pnpm ctx:validate:local`
3. Report any issues

### Step 5: Report Results

Provide clear summary:

```
✅ Local Context Sync Complete!

Registry Statistics:
  - Total contexts: 12
  - Categories: 3
  - Entry points: 2

Actions Taken:
  - Created: src/utils/newUtil.ctx.yml
  - Updated: src/components/Button.ctx.yml

Validation: ✅ All passed
```

## Common Use Cases

### Case 1: General Sync Check

```
User: /sync-local-ctx
Claude: Runs sync, reports status, checks for issues
```

### Case 2: Create Context for New Module

```
User: /sync-local-ctx
User: "Create context file for src/utils/newUtil.ts"

Claude:
1. Reads src/utils/newUtil.ts
2. Analyzes exports and usage
3. Generates newUtil.ctx.yml
4. Syncs and validates
5. Reports success
```

### Case 3: Update Outdated Context

```
User: /sync-local-ctx
User: "Update context for src/components/Button.tsx, it now supports variants"

Claude:
1. Reads current Button.ctx.yml
2. Reads Button.tsx to see changes
3. Updates use_when with variant examples
4. Increments version
5. Syncs and validates
```

### Case 4: Find Missing Contexts

```
User: /sync-local-ctx
User: "Check for missing context files in src/utils/"

Claude:
1. Scans src/utils/ for source files
2. Checks which have .ctx.yml files
3. Reports missing contexts
4. Offers to create them
```

## Important Notes

- **Template-driven:** Always follow `.ctx/templates/CONTEXT.tpl.md`
- **User-focused:** Emphasize "what" and "when to use"
- **Validate:** Always sync and validate after changes
- **Versioning:** Increment version on updates
- **Non-intrusive:** Only create/update when explicitly asked