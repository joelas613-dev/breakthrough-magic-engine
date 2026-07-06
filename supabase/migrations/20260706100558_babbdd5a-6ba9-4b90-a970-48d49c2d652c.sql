
-- Subscriptions
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  paddle_subscription_id text not null unique,
  paddle_customer_id text not null,
  product_id text not null,
  price_id text not null,
  status text not null default 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  environment text not null default 'sandbox',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_paddle_id on public.subscriptions(paddle_subscription_id);

grant select on public.subscriptions to authenticated;
grant all on public.subscriptions to service_role;

alter table public.subscriptions enable row level security;
create policy "Users can view own subscription" on public.subscriptions for select using (auth.uid() = user_id);
create policy "Service role manages subscriptions" on public.subscriptions for all using (auth.role() = 'service_role');

-- has_active_subscription
create or replace function public.has_active_subscription(user_uuid uuid, check_env text default 'live')
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from public.subscriptions
    where user_id = user_uuid
    and environment = check_env
    and (
      (status in ('active','trialing','past_due') and (current_period_end is null or current_period_end > now()))
      or (status = 'canceled' and current_period_end > now())
    )
  );
$$;

-- Daily usage
create table public.daily_usage (
  user_id uuid references auth.users(id) on delete cascade not null,
  day date not null default (now() at time zone 'utc')::date,
  message_count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

grant select on public.daily_usage to authenticated;
grant all on public.daily_usage to service_role;

alter table public.daily_usage enable row level security;
create policy "Users can view own usage" on public.daily_usage for select using (auth.uid() = user_id);
create policy "Service role manages usage" on public.daily_usage for all using (auth.role() = 'service_role');

-- Atomic increment
create or replace function public.increment_daily_usage(user_uuid uuid)
returns integer language plpgsql security definer set search_path = public as $$
declare
  new_count integer;
begin
  insert into public.daily_usage (user_id, day, message_count)
  values (user_uuid, (now() at time zone 'utc')::date, 1)
  on conflict (user_id, day)
  do update set message_count = public.daily_usage.message_count + 1, updated_at = now()
  returning message_count into new_count;
  return new_count;
end; $$;
