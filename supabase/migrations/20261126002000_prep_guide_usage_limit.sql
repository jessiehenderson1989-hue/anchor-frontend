-- Counts AI prep guide requests per user per day (already applied to the live database).
create table if not exists public.prep_guide_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  requests integer not null default 0,
  primary key (user_id, day)
);
alter table public.prep_guide_usage enable row level security;
-- No policies on purpose: only the edge function (service role) reads or writes it.

create or replace function public.bump_prep_guide_usage(p_user uuid)
returns integer
language sql
security definer
set search_path = public
as $$
  insert into public.prep_guide_usage (user_id, day, requests)
  values (p_user, (now() at time zone 'America/Los_Angeles')::date, 1)
  on conflict (user_id, day) do update set requests = public.prep_guide_usage.requests + 1
  returning requests;
$$;
revoke all on function public.bump_prep_guide_usage(uuid) from public, anon, authenticated;
grant execute on function public.bump_prep_guide_usage(uuid) to service_role;
