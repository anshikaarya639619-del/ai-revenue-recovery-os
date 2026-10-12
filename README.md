# AI Revenue Recovery OS

A truth-first revenue recovery workspace prototype hosted on GitHub Pages.

## Live status

- Public static frontend: https://anshikaarya639619-del.github.io/ai-revenue-recovery-os/
- GitHub Pages deployment and repository quality checks have passed for the latest watermark/cache-busting commit.
- Supabase currently contains `public.leads` and `public.revenue_cycles`; Row Level Security is enabled on both.
- Policies currently scope lead and revenue-cycle rows to the authenticated user's `auth.uid()`.
- The app includes email/password sign-in/sign-up, lead create/list/delete, CSV export, and a manual revenue-cycle tracker.
- The revenue-cycle RPC carries an unmet target into a new 30-day cycle after the previous one ends.
- No Edge Functions are currently deployed.
- No CRM/form source, invoice provider, payment processor, customer messaging provider, analytics, or scheduled/background automation is connected.
- Revenue is manually entered and is not independently verified by a bank or payment provider. The $100M per 30-day target is an ambition, not a forecast or promise.

## First-run verification checklist

1. Create a test account and complete email confirmation if requested.
2. Sign in and add a fictional test lead.
3. Reload the page; confirm the lead remains visible.
4. Export CSV and confirm it contains only the signed-in account's test data.
5. Delete the test lead and confirm it disappears.
6. Test with a second account and confirm the first account's lead is not visible.
7. Verify the revenue cycle is created, the manual actual can be saved, and the next cycle can only start after the current cycle ends. Do not enter invented revenue as real income.
8. Review Supabase Auth settings and enable leaked-password protection.

## Security and privacy

- Browser code contains only a Supabase publishable key. Never put a service-role key or other privileged secret in this repository.
- RLS is enabled on the lead and revenue-cycle tables. Keep database policies enabled and test account isolation before storing any real data.
- Use fictional test records until account isolation and workflows have been verified.
- Do not store sensitive, regulated, payment-card, or unnecessary personal data.
- Customer-facing messages are not sent by this prototype.
- GitHub Pages is static hosting and cannot provide all production security headers by ordinary HTML metadata. A production host/CDN with appropriate response-header support may be required.
- This repository is not yet a production-ready business automation platform.

## Before real launch

1. Select one customer segment and one specific recovery workflow.
2. Confirm the lawful basis/permission for every data source and provide an appropriate privacy notice.
3. Connect an authorized CRM/form/billing source with least-privilege credentials stored server-side.
4. Implement deduplication, consent and opt-out handling, message limits, retries, idempotency, audit logs and failure alerts.
5. Require human approval for customer-facing payment reminders until the workflow is proven safe.
6. Add a payment-provider integration only when needed; verify payments using trusted provider events/server-side verification, not manual browser claims.
7. Configure scheduled jobs/Edge Functions and monitor failures; do not describe the system as 24/7 until this is tested.
8. Add tested backups, retention/deletion procedures, incident response, privacy-safe analytics and independent security review.
9. Add automated integration tests for authentication, account isolation, cycle carry-forward, accessibility, mobile layout and failure paths.

## Local preview

Open `index.html` in a browser. Styling is in `style.css`; core JavaScript is in `app.js`; lead search, status filters, sorting, KPI counts, and lead editing are in `features.js`. Google Fonts and the Supabase JavaScript CDN are external dependencies.

## Lead operations added

The signed-in lead workspace includes search across name/contact/source/notes, status filtering, follow-up-date sorting, due/overdue indicators, account-scoped KPI counts, and an edit form for lead details. These are browser-driven features; they are not a background notification service.

## Revenue-cycle hardening

The database creates the first cycle through `ensure_current_revenue_cycle()` and starts subsequent cycles through `start_next_revenue_cycle()`. Both use a per-user transaction lock. Client-side insert/delete policies for revenue cycles have been removed; a database trigger prevents changing cycle ownership, dates, base target, carry-forward amount, or generated target. Actual revenue remains a user-entered value and is not independently verified by a payment provider. Migration source: `supabase/migrations/20261012_harden_revenue_cycle_controls.sql`.

## Deployment

GitHub Actions deploys the static frontend to GitHub Pages. A successful deployment validates the site build; it does not mean customer acquisition, payments, or 24/7 business automation are running.
