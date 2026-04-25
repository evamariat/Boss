-- Daily usage table
create table if not exists token_usage_daily (
  user_id uuid references auth.users(id) on delete cascade,
  usage_date date not null default current_date,
  tokens_used int not null default 0,
  primary key (user_id, usage_date)
);

-- Monthly usage table
create table if not exists token_usage_monthly (
  user_id uuid references auth.users(id) on delete cascade,
  period_date date not null default current_date,
  year int generated always as (extract(year from period_date)) stored,
  month int generated always as (extract(month from period_date)) stored,
  tokens_used int not null default 0,
  primary key (user_id, year, month)
);

-- Quotas table
create table if not exists token_quotas (
  user_id uuid references auth.users(id) on delete cascade primary key,
  daily_limit int not null default 50000,
  monthly_limit int not null default 1000000
);

-- Enable RLS
alter table token_usage_daily enable row level security;
alter table token_usage_monthly enable row level security;
alter table token_quotas enable row level security;

-- RLS: daily usage
create policy "Users can read their own daily usage"
on token_usage_daily for select
using (auth.uid() = user_id);

create policy "Users can insert their own daily usage"
on token_usage_daily for insert
with check (auth.uid() = user_id);

create policy "Users can update their own daily usage"
on token_usage_daily for update
using (auth.uid() = user_id);

-- RLS: monthly usage
create policy "Users can read their own monthly usage"
on token_usage_monthly for select
using (auth.uid() = user_id);

create policy "Users can insert their own monthly usage"
on token_usage_monthly for insert
with check (auth.uid() = user_id);

create policy "Users can update their own monthly usage"
on token_usage_monthly for update
using (auth.uid() = user_id);

-- RLS: quotas
create policy "Users can read their own quotas"
on token_quotas for select
using (auth.uid() = user_id);
