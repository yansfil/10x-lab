# Implementation Plan: [Feature Name]
**Date**: [DATE]
**Overview**: [./overview.md](./overview.md)
**Spec**: [./spec.md](./spec.md) or [./spec-*.md](./spec-*.md)
**Story**: `.spec/specs/[YYYYMMDD-feature-name]/`

**IMPORTANT**: Focus on the HOW - provide detailed, step-by-step implementation instructions that can be followed without ambiguity. Each task should be concrete and actionable.

## 1. Overview
Brief description of what we're building/changing and why

## 2. Requirements & Clarifications
### 2.1 Scope
- **In-scope**: What this covers
- **Out-of-scope**: What this doesn't cover
- **Impact**: Affected modules/files

### 2.2 Clarifications from Spec
- **Resolved Clarifications**:
  - [#001]: Question → Resolution → Technical Impact
  - [#002]: Question → Resolution → Technical Impact
- **Pending Clarifications**:
  - Any remaining items affecting implementation
- **Technical Assumptions Made**:
  - Assumption based on clarification #X
  - Default approach chosen for #Y

### 2.3 Technical Design
- **Architecture**: How components interact
- **Data Model**: Schema changes if any
- **APIs**: Interface specifications
- **Dependencies**: External systems/libraries

### 2.4 Acceptance Criteria
- **Functional Tests**: What must work for this to be complete
- **Performance**: Expected response times, resource usage
- **Edge Cases**: How to handle errors, boundary conditions
- **Success Metrics**: How we verify it's working correctly

## 3. Implementation Tasks
### Phase 1: [Name]
- [ ] Task 1: Specific action
  - File: `path/to/file.ts`
  - Changes: What to add/modify
  - Code snippet if needed

### Phase 2: [Name]
- [ ] Task 2: ...

## 4. File Changes Summary
| File | Action | Purpose |
|------|--------|---------|
| src/new-feature.ts | Create | Main implementation |
| src/existing.ts | Modify | Add integration |
| tests/feature.test.ts | Create | Unit tests |
