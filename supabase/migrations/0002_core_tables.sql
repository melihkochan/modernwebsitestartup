-- Core administrative and identity tables

-- 1. profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username varchar(30) unique not null,
  avatar_url text,
  kick_username varchar(50) unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Profiles of authenticated users, automatically synced from auth.users.';

-- 2. admins table
create table if not exists public.admins (
  id uuid primary key references public.profiles(id) on delete cascade,
  role varchar(20) not null default 'moderator' check (role in ('owner', 'administrator', 'moderator')),
  created_by uuid references public.admins(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.admins is 'Website administrators and moderators mapped to profiles.';

-- 3. settings table
create table if not exists public.settings (
  key varchar(50) primary key,
  value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.settings is 'Key-value config parameters for website system settings.';

-- 4. social_links table
create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform varchar(50) unique not null,
  url text not null,
  icon_name varchar(50),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.social_links is 'Platform social media external links configurations.';


-- TRIGGERS & SYNC FUNCTIONS

-- Automatically update updated_at triggers
create trigger trigger_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

create trigger trigger_admins_updated_at
  before update on public.admins
  for each row execute procedure public.update_updated_at_column();

create trigger trigger_settings_updated_at
  before update on public.settings
  for each row execute procedure public.update_updated_at_column();

create trigger trigger_social_links_updated_at
  before update on public.social_links
  for each row execute procedure public.update_updated_at_column();


-- Trigger function to automatically create a profile row when a new auth user is created
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Attach trigger to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
