📝 Pre-Development Design Checklist (for AI Agent Development)

Use this guide before starting any implementation work.
✅ Sections 1-3 are mandatory.
🟡 Sections 4–5 are optional — skip them for simple or low-impact changes.

⸻

1. Scope & Impact (Required)
	•	In-scope: What exactly will this change cover?
	•	Out-of-scope: What will not be touched by this change?
	•	Impact areas: Which modules, files, classes, or functions are affected?
	•	Re-use: Which existing code, libraries, or infrastructure can we reuse?

⸻

2. Design Overview (Required)
	•	Architecture / Flow: How does the system change after this update?
(Include a simple diagram if possible.)
	•	Interfaces: Function signatures, API specs, event/message formats.
	•	Data Model Changes: Any additions or modifications to entities/schemas?
	•	External Systems: If any integrations are involved, clarify:
	•	Request/response schema
	•	Timeout/retry/idempotency policies
	•	Authentication/authorization/rate-limit rules

⸻

3. Test & Verification (Required)
	•	Acceptance Criteria: How will we know this change is successful?
	•	Test Plan: What kinds of tests will be added or updated?

⸻

4. Alternatives & Decisions (Optional)
	•	Considered Alternatives: Which approaches were explored?
	•	Decision & Trade-offs: Why was this approach chosen?
	•	ADR Needed?: Should this be captured in an Architecture Decision Record?

⸻

5. Risks & Open Questions (Optional)
	•	Risks: Potential regressions, edge cases, or side effects to watch for.
	•	Open Questions: Any unresolved issues or dependencies?