# AI Revenue Recovery OS

A truth-first revenue recovery workspace prototype, hosted with GitHub Pages.

## Current state

- Public static landing page is deployed with GitHub Pages.
- The interface is a front-end prototype only.
- No CRM, lead form, invoice provider, database, email/SMS provider, payment gateway, analytics, or scheduled automation is connected.
- Verified revenue and active automations must remain at zero until real integrations and evidence exist.

## Local preview

Open `index.html` in a browser. The design uses `style.css`; Google Fonts are an optional external dependency with system-font fallbacks.

## Security posture (current prototype)

- A restrictive Content Security Policy is set in a meta tag; Google Fonts are the only external stylesheet/font origins allowed.
- Referrer policy is set to `strict-origin-when-cross-origin`.
- Lead data is stored in browser `localStorage`, which is **not encrypted**, not access-controlled per user, and not shared/synced. Do not store real sensitive customer information here.
- Rendering escapes user-entered text; values are length-limited and select fields are allow-listed.
- GitHub Pages cannot set every HTTP response security header from ordinary static files. Production-grade headers require a host/CDN that supports headers or a correctly configured edge layer.
- No authentication, server-side authorization, rate limiting, audit logs, encrypted database, backups, or secret-management backend is implemented yet.

## Before real launch

1. Choose one narrow customer segment and one recovery workflow.
2. Define a lawful data source and confirm permission/consent to process customer data.
3. Add a backend/database with access controls and secret management. Never put API keys in client-side HTML/JavaScript.
4. Build a test-only integration and validate deduplication, opt-outs, message limits, retries, audit logs and error handling.
5. Add human approval before sending payment reminders or other customer-facing messages.
6. Configure analytics only after privacy notice/consent requirements are addressed.
7. Test mobile layout, keyboard accessibility, page metadata and all links before launch.
8. Add server-side authorization, encrypted storage in transit/at rest, secure secrets, backups, rate limits, audit logs, security monitoring and incident response.
9. Add automated security tests and an independent review before handling real customer data.

## Deployment

GitHub Pages publishes the static site from this repository. A successful Pages deployment does not mean business workflows or 24/7 automations are running.
