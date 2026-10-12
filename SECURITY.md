# Security Policy

## Current status

This repository is a static frontend prototype with Supabase email/password authentication and database-backed lead/revenue-cycle features. Row Level Security (RLS) is enabled on `public.leads` and `public.revenue_cycles`, with policies intended to scope records to the authenticated user. This configuration still requires end-to-end account-isolation tests before real customer data is used.

The Supabase security advisor currently reports that leaked-password protection is disabled. Enable it in the Supabase Auth/password security settings. No Supabase Edge Functions are currently deployed. No payment processor, customer messaging, CRM, or scheduled automation is connected.

## Reporting a vulnerability

Do not publish secrets, personal data, or exploit details in a public issue. Contact the repository owner privately through GitHub's available contact options and provide a concise description, impact, and safe reproduction steps.

## Secrets and data

- Never commit passwords, API keys, access tokens, private keys, service-role keys, customer data, or real invoice details.
- Only a publishable Supabase key belongs in browser code. A publishable key is not an authorization substitute; RLS and database policies must enforce access.
- Revoke and rotate any privileged secret accidentally committed.
- Test with fictional data until sign-in, ownership rules, deletion, and account isolation are verified.
- Do not store payment-card data, regulated information, or unnecessary sensitive personal data.
- Validate and authorize all operations server-side before adding production integrations.
- Customer-facing messages and payments are not enabled by this prototype.

## Deployment security

GitHub Pages serves a static site. Meta CSP is not equivalent to an HTTP response header, and `frame-ancestors` cannot be enforced from a meta CSP. Production deployment should use a host/CDN that supports appropriate response headers, monitoring, backups, retention controls, and incident response.


## Revenue cycle integrity

Revenue-cycle creation is restricted to authenticated RPC functions. Per-user advisory transaction locks prevent simultaneous cycle initialization/rollover races. Client inserts/deletes are disabled for `revenue_cycles`, and a trigger protects system-calculated cycle dates and target fields. User-entered actual revenue is still self-reported, not payment-verified. Keep the leaked-password protection warning in the Supabase Auth dashboard on the launch checklist until enabled and verified.
