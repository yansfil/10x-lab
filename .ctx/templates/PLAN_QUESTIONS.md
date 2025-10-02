📝 Pre-Development Design Checklist (for AI Agent Development)

Use this guide before starting any implementation work.

**Purpose**: This checklist focuses on **HOW** - technical design, architecture decisions, and implementation strategy.

**Use during**: `/plan` workflow - AFTER spec is approved.

**Prerequisites**: Spec must be completed first. This checklist builds on approved requirements.

**Focus areas**: Technical approach, interfaces, test strategy, implementation phasing (NOT business requirements).

## Priority Levels
- 🔴 **Critical**: Must be answered to proceed
- 🟡 **Important**: Significantly affects solution
- 🟢 **Optional**: Can use reasonable defaults

✅ Sections 1-3 are mandatory.
🟡 Sections 4–6 are recommended.
🟢 Section 7 is optional.

⸻

1. Scope & Impact (🔴 Critical)
	•	In-scope: What exactly will this change cover?
	•	Out-of-scope: What will not be touched by this change?
	•	Impact areas: Which modules, files, classes, or functions are affected?
	•	Re-use: Which existing code, libraries, or infrastructure can we reuse?
	•	Key files: Which are the MAIN files to modify (not exhaustive list)?

⸻

2. Design Overview (🔴 Critical)
	•	Architecture / Flow: How does the system change after this update?
	•	Interfaces: Define contracts and signatures (NOT full implementations)
		•	What are the main interfaces/classes?
		•	What are their key methods (signatures only)?
		•	How do they interact (sequence/flow)?
	•	Data Model Changes: Any additions or modifications to entities/schemas?
	•	External Systems: If any integrations are involved, clarify:
		•	Request/response schema
		•	Timeout/retry/idempotency policies
		•	Authentication/authorization/rate-limit rules

⸻

3. Test & Verification (🔴 Critical)
	•	Acceptance Criteria: How will we know this change is successful?
	•	Test Plan: What kinds of tests will be added or updated?
	•	Test Checkpoints: Where should we validate during implementation?
		•	After which phases should we test?
		•	What are the rollback points?
		•	What are the smoke tests for each phase?
	•	Test Data: What test scenarios and data are needed?

⸻

4. Implementation Strategy (🟡 Important)
	•	Phasing: How should implementation be broken down?
	•	Dependencies: What must be done in sequence vs parallel?
	•	Interfaces First: Which contracts should be defined before coding?
	•	Test Points: Where are natural validation checkpoints?

5. Alternatives & Decisions (🟡 Important)
	•	Considered Alternatives: Which approaches were explored?
	•	Decision & Trade-offs: Why was this approach chosen?
	•	ADR Needed?: Should this be captured in an Architecture Decision Record?

⸻

6. Risks & Mitigations (🟡 Important)
	•	Risks: Potential regressions, edge cases, or side effects
	•	Mitigations: How to prevent or handle each risk?
	•	Rollback Plan: How to revert if something goes wrong?
	•	Monitoring: What to watch during/after deployment?

7. Open Questions (🟢 Optional)
	•	Unresolved Issues: Any pending decisions?
	•	Future Considerations: What's out of scope but should be noted?