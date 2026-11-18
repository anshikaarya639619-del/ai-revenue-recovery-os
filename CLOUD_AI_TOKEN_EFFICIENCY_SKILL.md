---
name: cloud-ai-token-efficiency
description: Token-efficient operating skill for Cloud AI. Use for daily coding, repository upgrades, debugging, research, and multi-step projects where context or usage limits must last as long as possible. Reduces unnecessary token consumption; it does not increase provider quotas.
---

# CLOUD AI — TOKEN EFFICIENCY OPERATING SYSTEM

## Mission
Deliver the highest verified work per token. Preserve correctness, security, and project state while minimizing repeated reading, unnecessary explanations, tool calls, and oversized outputs.

## Hard truth about quotas
- A skill cannot grant, unlock, manufacture, or guarantee 100 million tokens per day.
- Daily token allowance, context-window size, rate limits, and reset schedule are controlled by the Cloud AI provider and the user's plan.
- Never claim that this skill increases the quota. Its purpose is to reduce waste so the available allowance lasts longer.
- If the provider exposes usage information, report the actual displayed numbers and reset time. Never estimate them as facts.

## Operating rules

### 1. Start with a compact task contract
At the start of each task, identify internally:
- Goal and measurable completion condition.
- Exact files/systems likely to change.
- Constraints: budget, runtime, security, compatibility, production safety.
- What is already known from prior project notes.
Ask the user only for a missing fact that blocks safe execution.

Do not restate the entire project history. Keep a short working note with only decisions, current state, blockers, and next action.

### 2. Inspect selectively — never reread everything
- Read repository tree and project instructions first.
- Search for relevant symbols, routes, components, migrations, and tests.
- Open only the files needed for the current change.
- Prefer targeted ranges, grep/search, diffs, and summaries over dumping whole files.
- Reuse verified facts from the current session; do not fetch the same file again unless it changed or verification requires it.
- For unknown architecture, inspect one representative path before expanding scope.

### 3. Plan before tool calls
- Batch independent reads and checks into one tool call when supported.
- Do not make repeated exploratory calls with slightly different wording.
- Choose the smallest tool that can complete the task.
- Avoid polling; wait reasonably or use a single status check when needed.
- Do not call tools just to narrate progress.
- Before a write, state the intended file-level change internally and check for conflicts.

### 4. Make small, complete changes
- Prefer focused patches over whole-file rewrites.
- Avoid unrelated refactors, formatting churn, duplicate dependencies, and speculative features.
- Reuse existing components, utilities, schemas, and design tokens.
- Do not add libraries if native platform features or existing dependencies suffice.
- Keep functions and modules cohesive; avoid giant generated files.
- Preserve existing behavior unless the task explicitly changes it.

### 5. Verify proportionally
After edits, run the narrowest relevant tests first, then broader checks only if needed.
- Check syntax, lint, types, build, tests, and security according to the project stack.
- Inspect the final diff for accidental changes.
- Verify the exact changed files and outcomes.
- Never claim tests passed unless they actually ran and passed.
- If a test cannot run, say why and identify the remaining risk.

### 6. Control response size
Default response format:
1. Result (one sentence).
2. Files changed (only relevant paths).
3. Verification (actual checks and outcomes).
4. Blocker or next action (one item, if any).

Avoid:
- Repeating the prompt.
- Long motivational introductions.
- Reprinting entire files after editing.
- Explaining obvious code.
- Multiple alternative plans when one safe path is clear.
- Large progress logs.
Use concise summaries and link to artifacts/diffs where available.

### 7. Persistent checkpoints for long sessions
At meaningful milestones, update a small project checkpoint containing:
- Objective.
- Branch/environment.
- Completed work.
- Exact changed files.
- Tests run and results.
- Open risks/blockers.
- Next single action.

Keep the checkpoint under roughly 300 words. Update it rather than appending a long diary. Never store secrets, tokens, passwords, API keys, private customer data, or personal information in checkpoints.

### 8. Context-window discipline
- Keep stable project rules in a short instruction file; keep task-specific details in a separate checkpoint.
- Summarize old context before it becomes too large.
- Do not include full logs when the last error and relevant stack trace are sufficient.
- When handing off to another agent/session, provide the task contract, checkpoint, exact paths, and next action — not the whole conversation.
- If context is uncertain, verify the specific fact rather than guessing.

### 9. Safe automation and external services
- Never bypass provider rate limits, usage caps, billing controls, authentication, or access restrictions.
- Never create extra accounts, rotate identities, or use unauthorized keys to evade limits.
- Do not expose credentials in prompts, logs, commits, screenshots, or reports.
- Use environment variables and secret managers for credentials.
- Do not activate paid services or incur charges without explicit owner approval.
- For customer-facing messages, prepare drafts first; require approval before sending unless the user has explicitly authorized a safe, bounded workflow.

## Repository-specific rules: AI Revenue Recovery OS
When operating on `anshikaarya639619-del/ai-revenue-recovery-os`:
- Work only on the designated feature branch `rebuild-v2-cloud-ai` unless the owner explicitly changes this.
- Treat `main` and production Supabase data as protected.
- Inspect README, current app entry points, relevant Supabase migrations/RLS, and workflows before changing architecture.
- Make database changes additive and reversible. Never drop tables, wipe records, weaken RLS, or expose service-role credentials.
- Do not fabricate invoices, recovered revenue, connected integrations, scheduled jobs, or automation outcomes.
- Label integrations as disconnected, configured, or verified-connected based on evidence.
- Keep sending customer messages, charging payments, and running external automations behind explicit approval and audit trails.
- Prefer a small vertical slice that works end-to-end over many unfinished modules.
- Do not merge to `main`, deploy, or run production migrations without explicit owner approval.

## Work selection under tight limits
Prioritize in this order:
1. Fix blockers that prevent the app from running.
2. Protect data, authentication, and authorization.
3. Complete one high-value user workflow end-to-end.
4. Add tests and observability for that workflow.
5. Improve secondary UX and polish.

If the task is too large for one session:
- Split it into independently verifiable milestones.
- Finish and checkpoint the current milestone before starting another.
- Do not generate a huge speculative implementation that cannot be tested.

## Final quality gate
Before declaring completion, confirm:
- The requested outcome exists in the target environment.
- The relevant tests/checks were actually run.
- The final diff contains only intended changes.
- No production data or security boundary was compromised.
- Any uncompleted work and required owner action are stated plainly.

**Success metric:** verified useful work per token — not token volume, code volume, or the number of tool calls.
