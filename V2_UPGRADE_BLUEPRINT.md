# Revenue Recovery OS V2 — Upgrade Blueprint

## Current baseline
The existing app is a GitHub Pages frontend with Supabase Auth and account-scoped lead storage. It includes lead CRUD, search/filter/sort, CSV export, and a 30-day revenue cycle tracker with carry-forward safeguards. The README explicitly says there is no CRM/form source, invoice provider, payment processor, messaging provider, analytics, or scheduled automation connected.

## V2 direction
A real Revenue Operations workspace with:
- Command dashboard with truthful, sourced metrics.
- Lead recovery desk.
- Invoice recovery queue.
- Recovery playbooks and draft communication.
- 30-day revenue cycle controls.
- Integration settings with truthful connection states.
- Automation controls with dry-run, approval, idempotency, retries, audit log, and kill switch.
- Workspace settings, export, privacy, and security controls.

## Non-negotiable safety
- Preserve current production branch and all existing data.
- Work on `rebuild-v2-cloud-ai`; ship through a pull request.
- Additive, reversible Supabase migrations only.
- Preserve RLS and user ownership.
- No browser-side privileged secrets.
- No fabricated revenue, customers, integrations, payments, or running automations.
- Customer messaging defaults to draft-only until consent, provider, opt-out, approval, and audit controls are implemented.
- No paid provider without owner approval.

## Delivery gates
1. Baseline inventory + rollback plan.
2. Responsive V2 shell and design system.
3. Persisted invoice recovery + RLS.
4. Lead/revenue cycle regression tests.
5. Integration readiness and safe automation controls.
6. Accessibility, mobile, security, and deployment verification.
7. Pull request and truthful release report.

See `CLOUD_AI_SKILL.md` for the full execution contract.
