-- =============================================================
-- SUBIQ Database Schema
-- Run this in Supabase SQL Editor to set up all tables + RLS
-- =============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- =============================================================
-- PROFILES (extends auth.users)
-- =============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================
-- SUBSCRIPTIONS
-- =============================================================
create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  price numeric(10,2) not null default 0,
  billing_cycle text not null default 'Monthly' check (billing_cycle in ('Monthly', 'Yearly')),
  payment_method text not null default '',
  start_date date not null default current_date,
  renewal_date date,
  status text not null default 'Active' check (status in ('Active', 'Trial', 'Cancelled')),
  icon text default 'credit-card',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.subscriptions enable row level security;

create policy "Users can read own subscriptions"
  on public.subscriptions for select using (auth.uid() = user_id);

create policy "Users can insert own subscriptions"
  on public.subscriptions for insert with check (auth.uid() = user_id);

create policy "Users can update own subscriptions"
  on public.subscriptions for update using (auth.uid() = user_id);

create policy "Users can delete own subscriptions"
  on public.subscriptions for delete using (auth.uid() = user_id);

-- =============================================================
-- ASSETS
-- =============================================================
create table if not exists public.assets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  brand text not null default '',
  purchase_date date not null default current_date,
  warranty_start date not null default current_date,
  warranty_end date not null,
  has_invoice boolean default false,
  reminder_enabled boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.assets enable row level security;

create policy "Users can read own assets"
  on public.assets for select using (auth.uid() = user_id);

create policy "Users can insert own assets"
  on public.assets for insert with check (auth.uid() = user_id);

create policy "Users can update own assets"
  on public.assets for update using (auth.uid() = user_id);

create policy "Users can delete own assets"
  on public.assets for delete using (auth.uid() = user_id);

-- =============================================================
-- ACTIVITIES
-- =============================================================
create table if not exists public.activities (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null,
  activity_name text not null,
  duration text,
  notes text,
  created_at timestamptz default now() not null
);

alter table public.activities enable row level security;

create policy "Users can read own activities"
  on public.activities for select using (auth.uid() = user_id);

create policy "Users can insert own activities"
  on public.activities for insert with check (auth.uid() = user_id);

create policy "Users can update own activities"
  on public.activities for update using (auth.uid() = user_id);

create policy "Users can delete own activities"
  on public.activities for delete using (auth.uid() = user_id);

-- =============================================================
-- SUBSCRIPTION LOGS
-- =============================================================
create table if not exists public.subscription_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subscription_name text not null,
  action text not null check (action in ('Added', 'Renewed', 'Cancelled', 'Payment Failed', 'Price Changed')),
  details text,
  created_at timestamptz default now() not null
);

alter table public.subscription_logs enable row level security;

create policy "Users can read own subscription logs"
  on public.subscription_logs for select using (auth.uid() = user_id);

create policy "Users can insert own subscription logs"
  on public.subscription_logs for insert with check (auth.uid() = user_id);

-- =============================================================
-- ASSET LOGS
-- =============================================================
create table if not exists public.asset_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  asset_name text not null,
  action text not null check (action in ('Added', 'Warranty Expiring', 'Warranty Expired', 'Maintenance Due')),
  details text,
  created_at timestamptz default now() not null
);

alter table public.asset_logs enable row level security;

create policy "Users can read own asset logs"
  on public.asset_logs for select using (auth.uid() = user_id);

create policy "Users can insert own asset logs"
  on public.asset_logs for insert with check (auth.uid() = user_id);

-- =============================================================
-- RECOMMENDATIONS
-- =============================================================
create table if not exists public.recommendations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('Duplicate', 'Inactive', 'Trial')),
  title text not null,
  description text not null,
  savings numeric(10,2) default 0,
  confidence numeric(3,2) default 0 check (confidence >= 0 and confidence <= 1),
  is_dismissed boolean default false,
  created_at timestamptz default now() not null
);

alter table public.recommendations enable row level security;

create policy "Users can read own recommendations"
  on public.recommendations for select using (auth.uid() = user_id);

create policy "Users can update own recommendations"
  on public.recommendations for update using (auth.uid() = user_id);

create policy "Users can insert own recommendations"
  on public.recommendations for insert with check (auth.uid() = user_id);

-- =============================================================
-- EXPENSE SUMMARY FUNCTION
-- =============================================================
create or replace function public.get_expense_summary(p_user_id uuid)
returns table (
  total_monthly numeric,
  total_yearly numeric,
  trend_percentage numeric
) as $$
begin
  return query
  select
    coalesce(sum(case when s.billing_cycle = 'Monthly' then s.price else s.price / 12 end), 0) as total_monthly,
    coalesce(sum(case when s.billing_cycle = 'Yearly' then s.price else s.price * 12 end), 0) as total_yearly,
    0::numeric as trend_percentage
  from public.subscriptions s
  where s.user_id = p_user_id and s.status != 'Cancelled';
end;
$$ language plpgsql security definer;

-- =============================================================
-- UPDATED_AT TRIGGER
-- =============================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger set_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

create trigger set_assets_updated_at
  before update on public.assets
  for each row execute function public.set_updated_at();
