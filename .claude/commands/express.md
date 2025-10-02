# Express Story Workflow

Create lightweight implementation plans for simple, well-defined changes. Express mode combines requirements (WHAT/WHY) and implementation (HOW) in a single streamlined document.

**AI Instructions**:
- Analyze all edge cases before responding
- Question ambiguous requirements aggressively
- Prioritize clarity over speed
- Think step-by-step through logic

## Core Philosophy

**SPEED WITH RIGOR** - Move fast on simple changes while maintaining quality through clear requirements, explicit decisions, and human review gates.

**This workflow combines WHAT/WHY/HOW** - streamlined for straightforward changes where requirements and implementation are both simple.

## When to Use Express Mode

Use Express for straightforward changes where you're confident about the approach. The user's choice to use `/express` indicates they believe the change is simple enough for this mode.

---

## Execution Flow (STRICT ORDER)

```
1. Phase 0: TODO Setup
   → Create task list

2. Phase 1: Quick Analysis
   → Load context (registries)
   → Identify affected files
   → Understand constraints

3. Phase 2: Rapid Clarification [CORE PHASE]
   → Present understanding + critical questions only
   → LOOP: Question → Answer → Verify (max 2 rounds)
   → Continue until clarity achieved

4. Phase 3: Express Document Generation
   → Use EXPRESS.tpl.md template
   → Combine WHAT/WHY/HOW in single doc
   → Keep it concise

5. Phase 4: AI Validation & Save
   → Quick validation checklist
   → Save to .ctx/stories/

6. Phase 5: Human Review & Approval [MANDATORY]
   → Present for human review
   → Gather feedback and iterate
   → Obtain explicit approval
   🛡️ Gate: Must receive approval to proceed
```

---

## Initial Requirements

$ARGUMENTS

---

## Critical Context

- **Purpose**: Create a concise, actionable plan for simple changes
- **Focus**: Clear requirements + straightforward implementation
- **Output**: Single `express.md` file combining spec and plan
- **Reference Documents**:
  - `.ctx/templates/EXPRESS.tpl.md`: Template structure
  - `.ctx/.global-context-registry.yml`: Global context index
  - `.ctx/.local-context-registry.yml`: Local module context index

---

## Workflow

### Phase 0 — TODO Setup

Create task list using TodoWrite tool:
```
1. Load context from registries
2. Quick codebase analysis
3. Conduct rapid clarification (if needed)
4. Generate express document
5. AI validation
6. Save to .ctx/stories/
7. Request human review
8. Incorporate feedback (if needed → repeat from step 4)
9. Obtain explicit approval
```

---

### Phase 1 — Quick Analysis

**Goal**: Quickly understand the change (keep it minimal for Express mode).

### How to Explore

1. **Check Context (optional, skip if obvious):**
   - Read `.ctx/.global-context-registry.yml` - scan AI comments for relevant docs
   - Read `.ctx/.local-context-registry.yml` - find related modules
   - These are **navigation hints**, not absolute truth

   **Skip context loading ONLY if:**
   - Pure documentation/comment changes (no code logic)
   - Fixing typos in strings/messages
   - Format-only changes (prettier, lint fixes)

   **When in doubt, ALWAYS load context.**

2. **Search & Read Code:**
   - Grep for similar patterns
   - Glob for related files
   - Read affected files and `.ctx.yml`
   - Identify 2-3 files to change

3. **Document Findings:**
   - Files to modify
   - Existing patterns to follow
   - Any constraints

**Next Step**: Present findings in Phase 2 (if critical questions exist) OR skip to Phase 3 (generate express.md).

---

### Phase 2 — Rapid Clarification [CORE]

**THIS IS STREAMLINED - Focus on critical questions only**

#### Step 1: Initial Understanding

Quickly analyze requirements:
- ✅ **Clear**: Can proceed confidently
- ❓ **Need clarification**: Critical ambiguity exists
- 💡 **Assume**: Reasonable default available

**Priority levels (Express mode):**
- 🔴 **Critical Only**: Must be answered to proceed
- 🟢 **Everything else**: Use reasonable defaults

#### Step 2: Present Analysis & Critical Questions

```markdown
# ⚡ Express Analysis

## ✅ What I Understand
Based on requirements:
- [List clear understanding]
- [Affected files identified]
- [Implementation approach]

## 🔴 Critical Questions (if any)

### Question 1: [Specific question]
**Why critical**: [Impact on implementation]
**Options**:
- A: [Approach with trade-off]
- B: [Alternative with trade-off]

[Only include questions that BLOCK implementation]
```

#### Step 3: Rapid Clarification Loop

**STREAMLINED LOOP:**

1. **Ask** critical questions only
2. **Receive** user response
3. **Validate** answer completeness
4. **Confirm** understanding

**Complexity Check**: If during clarification you detect:
- Requirements becoming unclear or expanding significantly
- Multiple architectural options emerging
- Need for extensive exploration or design decisions
- Communication taking more than 2-3 rounds

→ **Suggest to user**: "This is becoming more complex than initially expected. Would you like to switch to `/spec` + `/plan` for a more thorough approach?"

Only proceed with Express if user confirms to continue.

#### Clarification Rules (Express Mode)
- **Critical only** - Don't ask nice-to-know questions
- **Concrete examples** - "Do you mean X or Y?"
- **Quick confirmation** - "To confirm: [understanding]"
- **Time-box** - Max 2 clarification rounds
- **Escalate if complex** - Don't force Express mode

---

### Phase 3 — Express Document Generation

**Goal**: Create single comprehensive document using `.ctx/templates/EXPRESS.tpl.md`

#### Prerequisites
- ✅ Critical questions resolved (or none exist)
- ✅ Files and approach identified
- ✅ Implementation is straightforward

#### Generation Process

1. Use `.ctx/templates/EXPRESS.tpl.md`
2. Fill all sections concisely
3. Combine WHAT (requirements) + HOW (implementation)
4. Keep it brief but complete
5. NO [PLACEHOLDER] markers allowed

#### Output Structure

Single `express.md` that includes:
- **Quick Summary**: What, Why, Impact (3-4 lines)
- **Requirements**: Must-have items with IDs
- **Implementation**: Files to change + approach
- **Testing**: Test cases + manual verification
- **Review**: Human approval gate

#### Content Guidelines

**Be Concise:**
```markdown
❌ Avoid: Long explanations
This feature will add a new button component that allows users to...
[5 more paragraphs]

✅ Prefer: Direct statements
Add blue variant to Button component. Changes default color prop from 'gray' to 'blue'.
```

**Be Specific:**
```markdown
❌ Avoid: Vague requirements
- Update the button styling

✅ Prefer: Testable requirements
- FR-001: Button MUST accept 'blue' variant prop
- FR-002: Default color MUST be 'blue' when variant unspecified
```

---

### Phase 4 — AI Validation & Save

#### Pre-Review Validation Checklist
- [ ] Complexity confirmed (Trivial or Simple)
- [ ] ≤ 3 files affected
- [ ] All requirements are testable
- [ ] Implementation steps are clear
- [ ] Test cases cover critical paths
- [ ] Rollback plan documented
- [ ] No ambiguous language
- [ ] Status set to "Ready for Review"

#### Save Structure
```
.ctx/stories/[NNNN-story-name-YYYY-MM-DD]/
└── express.md  (single comprehensive doc)
```

**Folder Naming:**
- Use next available story number (check existing stories)
- Use kebab-case for story name
- Include current date: YYYY-MM-DD
- Example: `0003-button-blue-variant-2025-10-02/`

---

### Phase 5 — Human Review & Approval [MANDATORY]

#### Review Process

**1. Present Express Plan for Review**

```markdown
## 🔍 Ready for Human Review

The express implementation plan for [Story Name] is complete.

**Express Summary:**
- **Complexity**: [Trivial/Simple]
- **Files affected**: [Number]
- **Estimated time**: [Duration]

**Review Focus:**
1. Requirements clarity
2. Implementation approach
3. Test coverage
4. Risk assessment

**Your options:**
- ✅ Type "approve" to proceed with implementation
- 💭 Provide feedback or request changes
- ❓ Ask for clarification
- ⚠️ Escalate to full `/spec` + `/plan` if too complex
```

**2. Handle Feedback & Iteration**

| Feedback Type | Action | Restart From |
|---------------|--------|-------------|
| ✅ Approved | Update status to "Approved" | Proceed to implementation |
| 📝 Minor edits | Fix typos/formatting | Phase 4 (re-save) |
| 🔧 Technical adjustments | Update approach | Phase 3 (regenerate sections) |
| ❓ Missing requirements | Add requirements | Phase 2 (clarify if needed) |
| 🔄 Major changes | Too complex for Express | Exit → Recommend `/spec` + `/plan` |

**Iteration Process:**
1. Update express.md based on feedback
2. Re-run validation checklist
3. Update status to "Ready for Review"
4. Present updated plan for re-review
5. Continue until approved OR escalate to full workflow

**3. Approval Gate**

⚠️ **CRITICAL**: Do NOT proceed to implementation without explicit approval
- Must receive clear "approve" or similar confirmation
- Status must be updated to "Approved"
- Document approval timestamp in express.md

#### Human Review Integration Points
- After initial plan generation
- After each significant change
- Before moving to "Approved" status
- When complexity increases (consider escalation)

---

## Critical Reminders

1. **KEEP IT SIMPLE** - If it gets complex, escalate to full workflow
2. **CRITICAL QUESTIONS ONLY** - Don't over-clarify for simple changes
3. **SINGLE DOCUMENT** - Combine WHAT/WHY/HOW in express.md
4. **HUMAN APPROVAL REQUIRED** - Must get explicit approval before implementation
5. **ESCALATE WHEN NEEDED** - Don't force Express mode on complex changes
6. **TRACK PROGRESS** - Use status: Draft → Ready for Review → In Review → Approved

---

## Example Express Dialogue

```
User: /express "Change button default color to blue"

Assistant: # ⚡ Express Analysis

## ✅ What I Understand
- Change button default color from current value to blue
- Affects Button component file
- Need to update corresponding tests
- Simple prop/style change

## 🔴 Critical Questions
None - requirement is clear and straightforward.

[Generates express.md, saves to .ctx/stories/0003-button-blue-default-2025-10-02/]

## 🔍 Ready for Human Review

The express implementation plan is complete.

**Express Summary:**
- **Complexity**: Trivial
- **Files affected**: 2 (Button.tsx, Button.test.tsx)
- **Estimated time**: 30 minutes

**Your options:**
- ✅ Type "approve" to proceed
- 💭 Provide feedback

User: "approve"

Assistant: [Updates status to "Approved", proceeds with implementation]
```
