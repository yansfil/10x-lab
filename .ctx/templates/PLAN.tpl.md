# Implementation Plan: [Feature Name]

**Date**: YYYY-MM-DD
**Status**: Draft | Ready for Review | In Review | Approved | Complete
**Type**: PLAN
**Links**:
  - Spec: [./spec.md](./spec.md)
  - Overview: [./overview.md](./overview.md)
  - Story: `.ctx/stories/[YYYYMMDD-story-name]/`

## Priority Legend
🔴 **Critical** - Must have / Blocks progress
🟡 **Important** - Should have / Affects quality
🟢 **Optional** - Nice to have / Can use defaults

## 📋 Prerequisites
- ✅ [Specification](./spec.md) approved
- ✅ All 🔴 critical clarifications resolved
- ✅ Success metrics defined
- ✅ Test strategy agreed

**IMPORTANT**: Focus on the HOW - provide interfaces and key implementation steps. Avoid full code implementations; use pseudo-code and signatures instead.

## 1. Overview
Brief description of what we're building/changing and why

## 📊 Progress Status
| Stage  | Requirements | Design        | Implementation | Testing     |
| ------ | ------------ | ------------- | -------------- | ----------- |
| SPEC   | ✅ Complete   | ✅ Complete    | -              | -           |
| PLAN   | ✅ Complete   | 🔄 In Progress | ⏳ Pending      | ⏳ Pending   |
| Status | Approved     | In Review     | Not Started    | Not Started |

## 2. Requirements & Clarifications

### 2.1 Spec Requirements Mapping
| Spec Requirement | Implementation Approach           | Phase   |
| ---------------- | --------------------------------- | ------- |
| 🔴 FR-001         | Interface definition + core logic | Phase 1 |
| 🔴 FR-002         | API endpoint + validation         | Phase 2 |
| 🟡 NFR-001        | Performance optimization          | Phase 3 |

### 2.2 Scope
- **In-scope**: What this covers
- **Out-of-scope**: What this doesn't cover
- **Impact**: Affected modules/files

### 2.3 Clarifications from Spec
- **Resolved Clarifications**:
  - [#001]: Question → Resolution → Technical Impact
  - [#002]: Question → Resolution → Technical Impact
- **Pending Clarifications**:
  - Any remaining items affecting implementation
- **Technical Assumptions Made**:
  - Assumption based on clarification #X
  - Default approach chosen for #Y

### 2.4 Technical Design
- **Architecture**: How components interact
- **Data Model**: Schema changes if any
- **APIs**: Interface specifications (signatures only)
- **Dependencies**: External systems/libraries

#### Interface Examples
```typescript
// Define contracts, not implementations
interface ServiceContract {
  method(param: Type): Promise<Result>
  // Key behavior: describe flow, not code
}
```

### 2.5 Acceptance Criteria
- **Functional Tests**: What must work for this to be complete
- **Performance**: Expected response times, resource usage
- **Edge Cases**: How to handle errors, boundary conditions
- **Success Metrics**: How we verify it's working correctly

## 3. Implementation Tasks

### Phase 1: [Name]
**Implements**: FR-001, FR-002 (from spec)

#### Implementation
- [ ] Task 1: Specific action
  - **Key Files**: `src/feature/*.ts`
  - **Interface**: Define contract/signature
  - **Pseudo-code**: High-level flow only

#### Test Plan
- **Test Approach**: Unit tests + integration smoke test
- **Test Cases**:
  - [ ] Test case 1: Expected behavior
  - [ ] Test case 2: Edge case handling
- **Validation Criteria**: What must pass to proceed
- **Rollback Point**: How to revert if tests fail

### Phase 2: [Name]
**Implements**: FR-003, NFR-001 (from spec)

#### Implementation
- [ ] Task 2: Specific action
  - **Key Files**: Category/pattern of files
  - **Changes**: What behavior to implement

#### Test Plan
- **Test Approach**: End-to-end testing
- **Test Cases**:
  - [ ] Test case 1: Complete user flow
  - [ ] Test case 2: Performance validation
- **Validation Criteria**: Success metrics
- **Rollback Point**: Revert strategy

## 4. File Changes Summary

### Key Files by Category
| Category        | Pattern/Location          | Purpose                     | Priority  |
| --------------- | ------------------------- | --------------------------- | --------- |
| 🔴 Core Logic    | `src/feature/*.ts`        | Main feature implementation | Critical  |
| 🟡 API/Interface | `api/feature/*.ts`        | External interfaces         | Important |
| 🟢 Tests         | `tests/feature/*.test.ts` | Test coverage               | Required  |
| ℹ️ Config        | `config/*.json`           | Configuration               | Optional  |

**Note**: Only major files listed. Implementation may touch additional utility files.

## 5. Validation & Human Review

### Pre-Review Checklist (AI Validation)
- [ ] All spec requirements mapped to implementation phases
- [ ] Test plans integrated with each phase
- [ ] Interfaces clearly defined without implementation details
- [ ] Rollback strategies documented for each phase
- [ ] Key files identified (not exhaustive)
- [ ] No [PLACEHOLDER] or ambiguous sections remain

### Human Review Request
```markdown
## 🔍 Ready for Human Review

The implementation plan is complete and ready for your review.

**Please review the following aspects:**
1. Technical approach and architecture decisions
2. Phase breakdown and task sequencing
3. Test coverage and validation criteria
4. Any missing requirements or edge cases

**Your Options:**
- ✅ Type "approve" to proceed with implementation
- 💭 Provide feedback or request changes
- ❓ Ask for clarification on specific sections

**Additional improvements or suggestions are welcome!**
```

### Status Progression
| Status               | Description            | Next Action          |
| -------------------- | ---------------------- | -------------------- |
| **Draft**            | Initial plan creation  | AI validation        |
| **Ready for Review** | AI validation complete | Request human review |
| **In Review**        | Human reviewing        | Await feedback       |
| **Approved**         | Human approved ✅       | Ready to implement   |
| **Complete**         | Implementation done    | -                    |

### Implementation Gate
⚠️ **IMPORTANT**: Implementation can only begin after human approval.
- Status must be "Approved"
- All review feedback addressed
- Final confirmation received
