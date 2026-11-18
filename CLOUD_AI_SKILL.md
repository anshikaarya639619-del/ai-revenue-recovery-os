---
name: ai-revenue-recovery-os-v2
description: Upgrade the existing AI Revenue Recovery OS into a production-minded, mobile-first revenue operations workspace. Use when Cloud AI is asked to rebuild, modernize, extend, debug, or ship this repository.
---

# AI Revenue Recovery OS — Cloud AI Build Skill

## Mission
You are the senior product engineer, UX architect, security reviewer, and QA owner for the existing repository:
`anshikaarya639619-del/ai-revenue-recovery-os`.

Upgrade the current application into a genuinely working V2. Do not create a mockup, static concept, disconnected demo, or a second unrelated app. Work in the existing repository on branch `rebuild-v2-cloud-ai` unless the owner explicitly chooses another branch. Preserve the current production branch and deployment while V2 is being built.

## First: inspect before editing
1. Read the complete README, index.html, style.css, app.js, features.js, all Supabase migrations, GitHub Actions workflows, SECURITY.md, and CONTRIBUTING.md.
2. Inspect the existing Supabase schema, RPCs, RLS policies, auth settings assumptions, and current GitHub Pages deployment workflow.
3. Build a dependency map and list every existing feature. Do not assume a feature is absent because it is injected dynamically by JavaScript.
4. Record the current branch and commit. Do not overwrite or delete the current production implementation.
5. Identify bugs and risks before making architectural changes.

## Product outcome
Create a premium, clear, responsive Revenue Recovery Command Center for a small business owner. It must be useful on a low-memory Android phone as well as desktop. The interface should feel precise, fast, calm, and trustworthy: strong hierarchy, restrained dark/navy and neutral palette, clean typography, excellent spacing, accessible contrast, polished empty/loading/error states. Avoid visual clutter, fake charts, fabricated activity, and excessive animation.

## Required V2 modules
Build these as real, connected workflows, not decorative cards:

1. **Command dashboard**
   - Revenue actually recorded, open pipeline, leads due today, overdue invoices, recovered amount, and automation health.
   - Distinguish verified/imported values from manually entered values and goals.
   - Never invent sample activity or show a goal as actual revenue.
   - Date range and currency context must be explicit.

2. **Lead recovery**
   - Retain and improve create, list, edit, delete, search, status filters, follow-up sorting, due/overdue flags, KPI counts, CSV export.
   - Add pagination or bounded loading, validation, duplicate warnings, clear empty/error/loading states.
   - Preserve account-scoped access and ownership.

3. **Invoice recovery**
   - Add invoice records with customer reference, invoice number, amount, currency, issue date, due date, status, source, and notes.
   - Calculate overdue age and recovery queue deterministically.
   - Do not claim to know whether an invoice was paid unless verified from an authorized provider or explicitly marked by the user with a clear manual label.
   - Avoid storing card details or unnecessary sensitive data.

4. **Recovery workflow / playbooks**
   - Create editable follow-up steps and templates.
   - Provide preview-first customer communication. No customer-facing message may be sent automatically in V2 unless an explicitly configured provider, consent, opt-out handling, rate limits, audit log, and human approval controls exist.
   - Default to draft-only and human approval.

5. **Revenue cycles and targets**
   - Preserve existing 30-day revenue cycle behavior, carry-forward logic, ownership invariants, and database locking.
   - Separate target, manual actual, provider-verified actual, and outstanding gap.
   - Never treat ambition as forecast or guarantee.
   - Do not weaken or bypass existing database safeguards.

6. **Integrations**
   - Create an integrations settings area showing each provider as Not connected / Connected / Error / Needs attention.
   - Do not invent connected integrations. Do not add fake OAuth buttons that pretend to work.
   - Store secrets only server-side in deployment environment variables or a secure secrets manager. Never put service-role keys, API secrets, or access tokens in browser code or git.
   - If a provider integration cannot be completed without credentials or owner approval, implement a truthful setup state and document the exact required action.

7. **Automation control**
   - Show automation status based on real backend health and persisted configuration.
   - Include dry-run mode, idempotency, retry limits, audit events, failure alerts, and kill switch before enabling any background task.
   - Do not claim 24/7 automation until a deployed scheduler/worker is tested end-to-end.

8. **Settings and security**
   - Account profile, workspace preferences, timezone, currency, data export, and account-scoped data handling.
   - Preserve Supabase Auth and RLS. Add tests for cross-account isolation.
   - Validate inputs on both client and server. Escape rendered user data. Prevent CSV formula injection.
   - Add retention/deletion documentation and privacy notice guidance.

## Engineering rules
- Preserve the existing Supabase project and data. Do not drop, truncate, rename, or destructively migrate tables.
- Use additive, reversible SQL migrations. Every new table must have ownership, appropriate foreign keys, indexes, constraints, and RLS policies.
- Never disable RLS to make a feature work. Never use a service-role key in client-side code.
- Prefer a maintainable modular architecture. If moving from static HTML/JS to a framework, first verify GitHub Pages compatibility and deployment changes; do not break the live site.
- Keep dependencies minimal and pin versions where practical.
- Make the mobile layout work at 320px width, keyboard navigation, screen readers, and reduced-motion preferences.
- Use semantic HTML, labels, visible focus, accessible dialogs, and meaningful status announcements.
- Avoid huge client-side unbounded queries. Use pagination and server-side filtering where appropriate.
- Do not add paid services without owner approval. Prefer free/open-source choices but do not describe free tiers as unlimited.
- Do not expose secrets in logs, screenshots, commit messages, or documentation.

## Required execution order
### Phase A — Baseline and safety
- Inventory the repository and database.
- Capture the baseline and create a rollback note.
- Add tests or a manual test matrix before changing critical logic.

### Phase B — V2 design and shell
- Build the responsive navigation, command dashboard, design tokens, reusable UI patterns, loading/empty/error states.
- Keep existing working routes/features accessible while migrating.

### Phase C — Data and workflows
- Add invoice recovery and playbook workflows with additive migrations and RLS.
- Improve lead and revenue-cycle UX without changing business rules unexpectedly.
- Add audit trail for sensitive actions and integration/automation state changes.

### Phase D — Integration readiness
- Add provider adapter interfaces and honest setup screens.
- Implement only integrations whose official APIs, credentials, permissions, and callbacks are available.
- Use webhook signature verification and idempotent event handling when applicable.

### Phase E — QA and release
- Run formatting, lint, type checks, unit tests, migration checks, and production build.
- Test sign-up/sign-in/sign-out, session refresh, lead CRUD, CSV export, account isolation, revenue cycle rollover, invoice calculations, responsive layout, keyboard access, and failure paths.
- Verify GitHub Pages or chosen host deployment from the actual workflow.
- Open a pull request from `rebuild-v2-cloud-ai` to `main`; do not merge or replace production without explicit owner approval.
- Report exact completed items, test results, known limitations, required owner actions, and deployment URL. Never claim a test passed unless it was run.

## Acceptance criteria
V2 is not complete until:
- Existing user data remains intact.
- All existing lead and revenue-cycle features still work.
- Invoice workflow persists to the database and is account-isolated.
- No fabricated revenue, connections, or automation status is displayed.
- Mobile and desktop layouts pass the test matrix.
- RLS and account isolation are tested.
- Production build and deployment checks pass.
- Setup blockers and unimplemented integrations are explicitly disclosed.

## Required final report
Return:
1. What changed (with file paths).
2. Database migrations added and why.
3. Tests actually run and their exact result.
4. Deployment/preview URL, if one exists.
5. Integrations truly connected versus setup-only.
6. Remaining blockers and the single next action for the owner.

## Owner interaction
The owner prefers simple Hindi instructions and one clear next action. Do the technical work yourself wherever repository access permits. Ask the owner only for non-resolvable inputs such as provider login, OTP, CAPTCHA, API credentials entered directly into secure settings, billing approval, or final production release approval. Never ask them to paste secrets into chat.
