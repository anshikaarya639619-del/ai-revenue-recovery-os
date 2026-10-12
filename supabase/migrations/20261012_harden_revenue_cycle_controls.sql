create or replace function public.ensure_current_revenue_cycle()
returns public.revenue_cycles language plpgsql security definer set search_path = '' as $$
declare v_user_id uuid := auth.uid(); v_cycle public.revenue_cycles%rowtype; v_start timestamptz;
begin
 if v_user_id is null then raise exception 'Sign in is required'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user_id::text,0));
 select * into v_cycle from public.revenue_cycles where user_id=v_user_id order by cycle_number desc limit 1;
 if not found then v_start:=now(); insert into public.revenue_cycles(user_id,cycle_number,starts_at,ends_at,base_target_usd,carried_gap_usd) values(v_user_id,1,v_start,v_start+interval '30 days',100000000,0) returning * into v_cycle; end if;
 return v_cycle;
end; $$;
create or replace function public.start_next_revenue_cycle()
returns public.revenue_cycles language plpgsql security definer set search_path = '' as $$
declare v_user_id uuid:=auth.uid(); v_prev public.revenue_cycles%rowtype; v_cycle public.revenue_cycles%rowtype; v_start timestamptz; v_number bigint; v_gap numeric(18,2):=0;
begin
 if v_user_id is null then raise exception 'Sign in is required'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user_id::text,0));
 select * into v_prev from public.revenue_cycles where user_id=v_user_id order by cycle_number desc limit 1;
 if not found then v_start:=now(); v_number:=1;
 else if v_prev.ends_at>now() then raise exception 'Current 30-day cycle has not ended'; end if; v_gap:=greatest(v_prev.target_usd-v_prev.actual_revenue_usd,0); v_start:=now(); v_number:=v_prev.cycle_number+1; end if;
 insert into public.revenue_cycles(user_id,cycle_number,starts_at,ends_at,base_target_usd,carried_gap_usd) values(v_user_id,v_number,v_start,v_start+interval '30 days',100000000,v_gap) returning * into v_cycle;
 return v_cycle;
end; $$;
create or replace function public.guard_revenue_cycle_updates()
returns trigger language plpgsql set search_path = '' as $$
begin
 if new.user_id is distinct from old.user_id or new.cycle_number is distinct from old.cycle_number or new.starts_at is distinct from old.starts_at or new.ends_at is distinct from old.ends_at or new.base_target_usd is distinct from old.base_target_usd or new.carried_gap_usd is distinct from old.carried_gap_usd or new.target_usd is distinct from old.target_usd or new.actual_revenue_usd<0 then
 raise exception 'Cycle dates, targets, ownership and carry-forward values are system-controlled; actual revenue must be non-negative'; end if;
 return new;
end; $$;
drop trigger if exists guard_revenue_cycle_updates on public.revenue_cycles;
create trigger guard_revenue_cycle_updates before update on public.revenue_cycles for each row execute function public.guard_revenue_cycle_updates();
drop policy if exists "Users can create their own revenue cycles" on public.revenue_cycles;
drop policy if exists "Users can delete their own revenue cycles" on public.revenue_cycles;
revoke all on function public.ensure_current_revenue_cycle() from public,anon;
grant execute on function public.ensure_current_revenue_cycle() to authenticated;
revoke all on function public.start_next_revenue_cycle() from public,anon;
grant execute on function public.start_next_revenue_cycle() to authenticated;