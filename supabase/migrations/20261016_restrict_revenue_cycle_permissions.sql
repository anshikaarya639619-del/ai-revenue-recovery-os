-- Restrict direct client privileges on revenue cycles.
-- Cycle creation and rollover remain behind the authenticated SECURITY DEFINER RPCs.
-- Signed-in users may only edit their own actual revenue and notes (RLS still applies).

REVOKE TRUNCATE, TRIGGER ON TABLE public.leads FROM authenticated;

REVOKE INSERT, DELETE, TRUNCATE, TRIGGER, UPDATE
ON TABLE public.revenue_cycles FROM authenticated;

REVOKE INSERT (id, user_id, cycle_number, starts_at, ends_at, base_target_usd, carried_gap_usd, target_usd, actual_revenue_usd, notes, created_at),
       UPDATE (id, user_id, cycle_number, starts_at, ends_at, base_target_usd, carried_gap_usd, target_usd, actual_revenue_usd, notes, created_at)
ON TABLE public.revenue_cycles FROM authenticated;

GRANT UPDATE (actual_revenue_usd, notes)
ON TABLE public.revenue_cycles TO authenticated;
