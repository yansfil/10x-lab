# Spec Development Question Checklist
*Systematic guide for identifying clarifications needed*

**Purpose**: This checklist focuses on **WHAT and WHY** - understanding user needs and business requirements.

**Use during**: `/spec` workflow - before implementation planning begins.

**Focus areas**: User value, business rules, acceptance criteria (NOT technical implementation).

## Core Questions by Category

### 🎯 Problem & Value
- What problem are we solving?
- Who are the target users?
- What's the expected benefit?
- How do we measure success?

### 👥 Users & Access
- User types and roles?
- Authentication needs?
- Permission model?
- Multi-user scenarios?

### 📊 Data & State
- What data to persist?
- Data lifecycle?
- Privacy/security needs?
- Existing data migration?

### 🔄 Behavior & Rules
- Core workflows?
- Business rules?
- Error scenarios?
- Edge cases?

### 🔌 Integration
- External systems?
- API needs?
- Dependencies?
- Constraints from existing system?

### 📏 Scale & Performance
- User volume?
- Data volume?
- Performance targets?
- Growth expectations?

### 🚫 Scope & Constraints
- What's explicitly out of scope?
- Timeline constraints?
- Technical limitations?
- Resource constraints?

---

## Priority Framework

**🔴 Critical** - Must answer to proceed
**🟡 Important** - Significantly affects solution
**🟢 Optional** - Can use reasonable defaults

---

## How to Use

1. **Scan** all categories for relevance
2. **Answer** what's clear from context
3. **Flag** ambiguities with priority
4. **Suggest** sensible defaults
5. **Group** related questions for efficiency