# AI Revenue Recovery OS

A GitHub-hosted frontend for a future revenue recovery SaaS. The current interface intentionally contains no fabricated customers, invoices, activity, or success metrics.

## Business goal

The long-term ambition is **$100,000,000 USD per 30 days**. This is an aspirational target, not a forecast or guarantee. Verified revenue is currently **$0.00** because no billing or revenue source is connected.

## Current state

- Static frontend in GitHub
- GitHub Actions workflow for validation and GitHub Pages deployment
- Empty lead and invoice states instead of fabricated demo records
- No backend or database
- No login or tenant isolation
- No live AI provider
- No email, SMS, CRM, billing, or payment integrations
- No business automation currently running

## GitHub Pages setup

1. Open **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Open **Actions** and verify the latest **Deploy static site to GitHub Pages** run succeeds.
4. Use the Pages URL shown in Settings → Pages.

The workflow validates required files and JavaScript syntax, then deploys the static site on pushes to `main`. This does not create a backend or keep a business process running 24/7.

## Next required production work

1. Select a backend/database and create the project in the owner's account.
2. Configure server-side secrets; never put private API keys in frontend files.
3. Implement authentication, workspace isolation, authorization and database policies.
4. Implement lead/invoice CRUD with validation, audit logging and data retention.
5. Integrate an AI provider and authorized CRM/email/SMS/billing systems.
6. Add customer consent, human approval where appropriate, idempotency, rate limits and retries.
7. Add background jobs, monitoring, backups, alerting and operational runbooks.
8. Add automated tests and security review.
9. Validate demand and payment willingness with real businesses before scaling.

## Security

Never commit credentials, access tokens, private keys, customer personal information or real invoices. GitHub Pages is a public static host; it must not serve secrets or private customer data. Never send messages or process payments without appropriate authorization and safeguards.

## Honest automation boundary

GitHub Actions runs jobs when triggered; it is not a continuously running server. Scheduled workflows can be delayed and should not be treated as a real-time job queue or an uptime guarantee. Production 24/7 business operations need an appropriate backend/worker and monitoring.
