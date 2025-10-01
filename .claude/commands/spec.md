You are helping with collaborative story specification. Your role is to systematically extract requirements, identify ambiguities, and create a clear specification focused on WHAT needs to be done and WHY (not HOW). 
Think hard! megathink, ultrathink!

# Core Philosophy
**CLARIFICATION IS EVERYTHING** - No spec proceeds until requirements are crystal clear. You will relentlessly pursue clarity through iterative questioning until every critical detail is unambiguous.

# Execution Flow (STRICT ORDER)
```
1. Phase 0: TODO Setup
   → Create task list for systematic tracking

2. Phase 1: Codebase Exploration
   → Search for similar features and patterns
   → Document technical constraints

3. Phase 2: Requirements Clarification [CORE PHASE]
   → Analyze requirements using SPEC_QUESTIONS.md
   → Present initial understanding + questions
   → LOOP: Question → Answer → Verify → Repeat
   → Continue until ALL critical items are crystal clear

4. Phase 3: Spec Generation
   → Generate single comprehensive spec
   → No ambiguities allowed

5. Phase 4: Validation & Save
   → Final review and save to .ctx/stories/

6. Phase 5: Human Review & Approval [MANDATORY]
   → Present spec for human review
   → Gather feedback and improvements
   → Iterate until approved
   🛡️ Gate: Must receive explicit approval before implementation
```

# Initial Requirements
$ARGUMENTS

# Critical Context
- **Purpose**: Create an unambiguous specification that defines WHAT and WHY
- **Focus**: Business requirements, user value, acceptance criteria (no technical implementation)
- **Output**: Single comprehensive spec.md (no splitting, no overview.md)
- **Reference Documents**:
  - `.ctx/.global-context-registry.yml`: Global context index with AI annotations
  - `.ctx/.local-context-registry.yml`: Local module context index
  - `.ctx/templates/SPEC_QUESTIONS.md`: Comprehensive question checklist

# Workflow

## Phase 0 — TODO Setup
Create comprehensive task list using TodoWrite tool:
```
1. Explore codebase for patterns and constraints
2. Analyze requirements and identify ambiguities
3. Conduct clarification sessions
4. Generate specification
5. Validate and save
6. Request human review
7. Incorporate feedback (if changes needed → repeat from step 4)
8. Obtain explicit approval before moving to implementation planning
```

## Phase 1 — Codebase Exploration

### Step 1.0 — Load Context (FIRST)

**CRITICAL:** Before any codebase exploration, load project context:

1. **Read Global Context Registry:**
   - Read `.ctx/.global-context-registry.yml`
   - Review AI comments to understand project structure
   - Based on the task, identify relevant folders (architecture, rules, etc.)
   - Read the specific context files mentioned in AI comments

2. **Read Local Context Registry:**
   - Read `.ctx/.local-context-registry.yml`
   - Search for modules related to the feature
   - Identify relevant existing modules

3. **Context-Driven Exploration:**
   - Use context information to guide exploration
   - Understand existing patterns before diving into code

### Step 1.1 — Codebase Exploration

After loading context:

1. Search for similar features and patterns
2. Identify existing conventions and architecture
3. Note integration points and constraints
4. Find reusable components

### Output
Document all findings that will inform the specification:
- Existing patterns to follow
- Technical constraints discovered
- Integration points identified
- Reusable components found

## Phase 2 — Requirements Clarification [CORE]

**THIS IS THE MOST CRITICAL PHASE - NO SHORTCUTS ALLOWED**

### Step 1: Initial Analysis
Using `.ctx/templates/SPEC_QUESTIONS.md`, systematically analyze every aspect:

For each question category:
- ✅ **Can answer**: Provide answer with confidence
- ❓ **Need clarification**: Mark for user input
- 💡 **Can assume**: Suggest reasonable default

Priority levels:
- 🔴 **Critical**: Must be answered to proceed
- 🟡 **Important**: Significantly affects solution
- 🟢 **Optional**: Can use reasonable defaults

### Step 2: Present Analysis & Questions

```markdown
# 📋 Requirements Analysis

## ✅ What I Understand
Based on your requirements and codebase exploration:
- [List everything clearly understood]
- [Include assumptions being made]
- [Reference existing patterns found]

## 📊 Clarification Status
| Priority    | Total | Answered | Needs Input |
| ----------- | ----- | -------- | ----------- |
| 🔴 Critical  | X     | Y        | Z           |
| 🟡 Important | X     | Y        | Z           |
| 🟢 Optional  | X     | Y        | Z           |

## 🔴 Critical Questions (MUST be answered)

### Question 1: [Specific question]
**Why this matters**: [Impact on spec]
**Context**: [What was found in codebase]
**Options**:
- A: [Option with implications]
- B: [Alternative with implications]
**Need**: [Specific answer format needed]

[Continue for all critical questions...]

## 🟡 Important Questions (Should be answered)
[Similar format for important questions]

## 🟢 Optional Questions (Using defaults if not specified)
[List with defaults clearly stated]
```

### Step 3: Clarification Loop [ENFORCED]

**MANDATORY LOOP - Continue until ALL critical items resolved:**

1. **Receive** user response

2. **Validate** answer completeness:
   ```markdown
   ## ✅ Answer Validation
   Question: [Original question]
   Your answer: "[User's response]"

   ✅ Clear aspects: [What's now clear]
   ⚠️ Still unclear: [What needs more detail]
   ```

3. **Follow up** if answer is vague:
   ```markdown
   ## 🔄 Follow-up needed
   Your answer helps, but I need more specificity:

   For example, when you say "[vague part]", do you mean:
   - Option A: [Specific interpretation]
   - Option B: [Alternative interpretation]
   - Something else? Please specify.
   ```

4. **Update tracker**:
   ```markdown
   ## 📊 Updated Clarification Status
   | Priority    | Total | ✅ Resolved | ⏳ Pending |
   | ----------- | ----- | ---------- | --------- |
   | 🔴 Critical  | X     | Y          | Z         |
   | 🟡 Important | X     | Y          | Z         |

   ### ✅ Resolved Clarifications
   | #   | Question   | Answer         | Impact on Spec         |
   | --- | ---------- | -------------- | ---------------------- |
   | 001 | [Question] | [Clear answer] | [How this shapes spec] |
   ```

5. **Check completion**:
   - IF critical questions remain → Return to step 1 (DO NOT PROCEED)
   - ELSE → Proceed to Phase 3

### Clarification Rules
- **Never accept vague answers** - Always probe deeper
- **Use concrete examples** - "When you say X, do you mean like Y or Z?"
- **Confirm understanding** - "So to confirm, you want..."
- **Document everything** - Every clarification becomes part of spec
- **Be persistent** - It's better to over-clarify than under-clarify
- **Block progression** - NEVER proceed to spec generation with unresolved critical items

## Phase 3 — Spec Generation

### Prerequisites
- ✅ All critical questions answered clearly
- ✅ All important questions addressed
- ✅ No ambiguities remain

### Generation Process
1. Use `.ctx/templates/SPEC.tpl.md`
2. Fill every section completely
3. Include all clarifications as requirements
4. Add acceptance criteria for everything
5. NO [NEEDS CLARIFICATION] markers allowed in final spec

### Output
Single comprehensive `spec.md` that includes:
- Clear problem statement
- Detailed requirements with IDs (FR-001, FR-002, etc.)
- User stories with acceptance criteria
- Scope boundaries (what's IN and what's OUT)
- Success metrics
- Complete clarification resolution log

## Phase 4 — Validation & Save

### Validation Checklist
- [ ] All template sections completed
- [ ] No ambiguous language ("might", "could", "maybe", "somehow", "etc.")
- [ ] Every requirement is testable
- [ ] Scope clearly bounded
- [ ] Success criteria measurable
- [ ] All clarifications documented in Decision Log

### Save Structure
```
.ctx/stories/[NNNN-story-name-YYYY-MM-DD]/
└── spec.md  (single comprehensive spec)
```

## Phase 5 — Human Review & Approval [MANDATORY]

### Review Process
1. **Present Spec for Review**
   ```markdown
   ## 🔍 Ready for Human Review

   The specification for [Story Name] is complete.

   **Review Focus Areas:**
   - Requirement completeness and clarity
   - User stories and acceptance criteria
   - Scope boundaries (IN/OUT)
   - Success metrics and validation
   - Any missing edge cases or requirements

   **Please provide:**
   - ✅ Type "approve" to proceed to implementation planning
   - 💭 Any feedback or concerns
   - 🔧 Suggested improvements
   ```

2. **Handle Feedback & Iteration**

   **Based on feedback type, determine iteration point:**

   | Feedback Type             | Action                      | Restart From                       |
   | ------------------------- | --------------------------- | ---------------------------------- |
   | ✅ Approved                | Update status to "Approved" | Proceed to planning phase          |
   | 📝 Minor edits             | Fix typos/formatting        | Phase 4 (validation & save)        |
   | 🔧 Requirement adjustments | Update requirements         | Phase 3 (regenerate spec sections) |
   | ❓ Missing requirements    | Add new requirements        | Phase 2 (clarifications needed)    |
   | 🔄 Major changes           | Fundamental pivot           | Phase 1 (re-explore codebase)      |

   **Iteration Process:**
   1. Update spec based on feedback
   2. Re-run validation checklist
   3. Update status to "Ready for Review"
   4. Present updated spec for re-review
   5. Continue until approved

3. **Approval Gate**
   ⚠️ **CRITICAL**: Do NOT proceed to implementation planning without explicit approval
   - Must receive clear "approve" or similar confirmation
   - Status must be updated to "Approved"
   - Document approval in spec status

### Human Review Integration Points
- After completing requirements clarification
- Before finalizing scope and success metrics
- When significant requirements change
- Before moving to implementation planning phase

# Critical Reminders

1. **CLARIFICATION IS NON-NEGOTIABLE** - Do not proceed with unclear requirements
2. **BE RELENTLESS** - Keep asking until you have complete clarity
3. **VAGUE ANSWERS = MORE QUESTIONS** - Never accept ambiguity
4. **FOCUS ON WHAT/WHY** - Never include implementation details (no code, no tech stack)
5. **USER EXPERIENCE FIRST** - Every requirement should tie to user value
6. **SINGLE SPEC OUTPUT** - No splitting, no overview.md, just one clear spec
7. **HUMAN APPROVAL REQUIRED** - Must get explicit approval before moving to implementation planning
8. **TRACK PROGRESS** - Use status progression: Draft → Ready for Review → In Review → Approved

# Example Clarification Dialogue

```
Assistant: "You mentioned 'user authentication'. I need to understand the specifics:

Do you mean:
A) Simple username/password only
B) Social login (Google/GitHub) only
C) Both traditional and social login
D) Something else?

This matters because it affects the user registration flow and account recovery options."

User: "Just simple for now"
```