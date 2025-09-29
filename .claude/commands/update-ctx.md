You are helping to create or update module context documentation. Your role is to analyze code structure and manage ctx.yml files based on the provided template.

# Core Philosophy
**USAGE-FOCUSED DOCUMENTATION** - Every module should have clear context documentation that helps developers and AI agents understand WHAT it does, WHEN to use it, and WHEN NOT to use it.

# Execution Flow
```
1. Parse arguments (target path + optional user context)
2. Determine operation mode (CREATE vs UPDATE)
3. Read template from .spec/templates/CONTEXT.tpl.md
4. Analyze code structure or existing context
5. Generate or update ctx.yml with user input
6. Run validation
7. Report results
```

# Input
- Target path: $ARGUMENTS[0] (folder, file, or existing ctx.yml)
- User context: $ARGUMENTS[1] (optional additional context)

# Workflow

## Step 1: Parse Arguments
```bash
TARGET="$ARGUMENTS[0]"  # Required: target path
USER_CONTEXT="$ARGUMENTS[1]"  # Optional: user-provided context
```

## Step 2: Read Template
**CRITICAL**: First, READ the complete template documentation from `.spec/templates/CONTEXT.tpl.md`
- This file contains the current template structure
- It includes field descriptions and examples
- The template format may change, so always read it fresh

## Step 3: Path Validation & Mode Detection
Determine operation mode and output location:

```bash
# Check if target exists
if [ ! -e "$TARGET" ]; then
  echo "Error: Path does not exist: $TARGET"
  exit 1
fi

# Determine operation mode and output file
if [[ "$TARGET" == *"ctx.yml" ]] && [ -f "$TARGET" ]; then
  # UPDATE MODE: Target is existing ctx.yml
  MODE="UPDATE"
  OUTPUT_FILE="$TARGET"
else
  # Check if ctx.yml exists in target location
  if [ -f "$TARGET" ]; then
    # Target is a file
    BASE_NAME="${TARGET%.*}"
    OUTPUT_FILE="${BASE_NAME}.ctx.yml"
  else
    # Target is a directory
    OUTPUT_FILE="$TARGET/ctx.yml"
  fi

  # Set mode based on existence
  if [ -f "$OUTPUT_FILE" ]; then
    MODE="UPDATE"
  else
    MODE="CREATE"
  fi
fi
```

## Step 4: Code Analysis
Analyze the target code to understand:
- **Purpose**: What does this module do?
- **Use Cases**: When should it be used?
- **Anti-patterns**: When should it NOT be used?
- **Constraints**: Any limitations or requirements?
- **Future**: Any TODOs or planned improvements?

## Step 5: Generate or Update Context

### CREATE Mode
Generate new ctx.yml file:
1. Use the YAML structure from CONTEXT.tpl.md
2. Fill in analyzed values based on code understanding
3. Incorporate user-provided context if available
4. Save as YAML format in ctx.yml

### UPDATE Mode
Update existing ctx.yml file:
1. Read and parse existing ctx.yml
2. Merge with user-provided context:
   - Preserve existing fields unless user explicitly updates them
   - Add new information from user context
   - Increment version (patch level)
3. Maintain YAML format consistency

## Step 6: Validation
Run the validation script:

```bash
bash .spec/scripts/validate-ctx.sh "$OUTPUT_FILE"
```

## Step 7: Output
Report the results based on mode:

### CREATE Mode Output
```markdown
✅ Context file created successfully!

📄 File: [output_path]
📊 Analysis Summary:
- Mode: CREATE
- Target: [target_path]
- Purpose: [brief description]
- User Context: [Applied/Not provided]

🔍 Validation Results:
[validation output]

💡 Next steps:
1. Review the generated context
2. Update with more specific use cases if needed
```

### UPDATE Mode Output
```markdown
✅ Context file updated successfully!

📄 File: [output_path]
📊 Update Summary:
- Mode: UPDATE
- Target: [target_path]
- Version: [old_version] → [new_version]
- Changes: [summary of updates]
- User Context: [Applied/Not provided]

🔍 Validation Results:
[validation output]

💡 Modified sections:
[List of sections that were updated]
```

# Important Notes

- **UPDATE MODE**: When updating, preserve existing content and merge intelligently
- **USER CONTEXT**: Always incorporate user-provided context appropriately
- **VERSION CONTROL**: Increment version on updates (0.0.1 → 0.0.2)
- **YAML FORMAT**: Use YAML structure for ctx.yml files
- **ALWAYS** read `.spec/templates/CONTEXT.tpl.md` first for field definitions
- **FOCUS** on practical usage patterns from code analysis
- **BE SPECIFIC** with use cases and constraints
- **CHECK** for existing patterns in the codebase