# Sync Global Context Registry with AI Annotation

Synchronize global context files (.ctx/**/*.md) and generate AI-powered descriptions for navigation and understanding.

## Purpose

This command:
1. Runs mechanical sync to update checksums and file lists
2. Identifies files needing AI annotation (new or changed)
3. Generates concise, scenario-focused descriptions
4. Updates the global context registry with AI comments

## Workflow

### Step 1: Run Mechanical Sync

Execute the sync script to update mechanical metadata:

```bash
pnpm ctx:sync:global
```

Parse the output to identify:
- New files without AI comments
- Changed files (checksum mismatch)
- Folders without descriptions

### Step 2: Read Registry and Identify Needs

Read `.ctx/.global-context-registry.yml` to see what needs annotation.

Look for:
- Files with `ai_comment: null`
- Files where content changed since last annotation
- Folders with `ai_comment: null`

### Step 3: Generate AI Comments

For each file or folder needing annotation:

**File-Level Comments:**
Read the file content and generate a 2-3 line description following this structure:

```yaml
ai_comment: |
  [Brief summary of what this document covers]
  Read when: [Specific scenarios when this should be consulted]
```

**Guidelines:**
- Keep it under 3 lines total
- Focus on WHEN to read, not detailed contents
- Be specific about scenarios
- Use active voice

**Examples:**

```yaml
# Good file comment
ai_comment: |
  TypeScript coding standards and type safety guidelines.
  Read when: Writing TS code, setting up new modules, code reviews

# Good file comment
ai_comment: |
  Infrastructure setup and tooling decisions for the monorepo.
  Read when: Setting up dev environment, adding packages, understanding build process
```

**Folder-Level Comments:**
Generate an overview of the folder's purpose:

```yaml
ai_comment: |
  [What this folder contains and its purpose]
  Read when: [Scenarios for exploring this folder]
```

**Examples:**

```yaml
# Good folder comment
ai_comment: |
  Core architectural decisions and patterns for the project.
  Read when: Starting new features, understanding project structure, making architectural changes

# Good folder comment
ai_comment: |
  Development rules and coding standards.
  Read when: Writing code, conducting code reviews, onboarding new developers
```

### Step 4: Update Registry

After generating AI comments:

1. Read the current `.ctx/.global-context-registry.yml`
2. Parse the YAML (be careful with header comments)
3. Update the relevant `ai_comment` fields
4. Update `meta.last_ai_update` to current timestamp
5. Write back to file with proper YAML formatting

**Important:** Preserve all mechanical data (checksums, timestamps, file paths).

### Step 5: Report Results

Output a clear summary:

```
✅ AI Annotation Complete!

Updated annotations:
  📁 architecture/ (folder description)
  📄 architecture/new-patterns.md (new file)
  📄 rules/typescript.md (content changed)

Statistics:
  - Folders annotated: 1
  - Files annotated: 2
  - Total AI comments: 3

💡 Next: Run /plan or /spec to use the updated context registry
```

## Example Execution

When user runs `/sync-global-ctx`:

1. Execute: `pnpm ctx:sync:global`
2. Parse output showing 3 files need annotation
3. Read each file:
   - `architecture/new-patterns.md`
   - `rules/typescript.md`
   - `rules/logging.md`
4. Generate AI comments for each
5. Update `.global-context-registry.yml`
6. Report completion

## Error Handling

- If sync fails, report error and stop
- If file is missing, skip and warn
- If YAML parsing fails, report error
- Always preserve existing data

## Important Notes

- **Concise:** Keep comments brief (2-3 lines max)
- **Scenario-focused:** Emphasize WHEN to read
- **Preserve data:** Don't modify checksums or timestamps
- **Format carefully:** Maintain YAML structure with proper indentation
