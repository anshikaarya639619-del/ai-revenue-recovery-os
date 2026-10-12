# Contributing

Thanks for helping improve AI Revenue Recovery OS.

## Before submitting

- Keep all example customer records fictional.
- Keep monetary values in USD unless requirements explicitly change.
- Do not claim that demo interactions send messages, verify payments, or run background automation.
- Do not commit credentials, tokens, personal data, or real invoice details.
- Keep the interface responsive and keyboard-accessible.
- Describe changes and tests in the pull request.
- Preserve the truth-first status labels: goals are not forecasts, and manual revenue entries are not payment verification.

## Current architecture

The frontend is static HTML/CSS/JavaScript on GitHub Pages. Supabase currently provides email/password authentication and database tables for leads and revenue cycles, with RLS enabled. The app records revenue manually. There are no deployed Supabase Edge Functions and no connected CRM, billing provider, payment gateway, messaging provider, analytics, or scheduled automation.

## Release checklist

1. Run JavaScript syntax and required-file checks.
2. Test the page at mobile and desktop widths.
3. Test account creation/sign-in, lead CRUD, export and sign-out.
4. Test that two accounts cannot access each other's records.
5. Test revenue-cycle initialization and carry-forward using a safe test environment.
6. Review Supabase security/performance advisors.
7. Never enable customer-facing automation without consent, opt-out handling, retries, logs, rate limits, and a human approval path during initial rollout.
