-- Stream State & Analytics Tables

-- 1. stream_state table
create table if not exists public.stream_state (
  id boolean primary key default true check (id = true),
  is_live boolean not null default false,
  viewer_count integer not null default 0,
  current_game varchar(100),
  stream_title text,
  started_at timestamptz,
  last_checked_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.stream_state is 'Stores current status of the Kick live stream. Limited to a single row.';

-- 2. stream_history table
create table if not exists public.stream_history (
  id uuid primary key default gen_random_uuid(),
  kick_stream_id varchar(50) unique not null,
  title text not null,
  game_played varchar(100) not null,
  started_at timestamptz not null,
  ended_at timestamptz not null,
  peak_viewers integer default 0,
  average_viewers integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.stream_history is 'Historical catalog of completed Kick streams.';

-- 3. live_snapshots table
create table if not exists public.live_snapshots (
  id uuid primary key default gen_random_uuid(),
  stream_id uuid references public.stream_history(id) on delete cascade,
  snapshot_time timestamptz not null default now(),
  viewer_count integer not null default 0,
  bitrate integer not null default 0,
  latency numeric(5,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.live_snapshots is 'Bitrate and performance telemetry snapshots during stream sessions.';

-- 4. viewer_history table
create table if not exists public.viewer_history (
  id uuid primary key default gen_random_uuid(),
  stream_history_id uuid references public.stream_history(id) on delete cascade,
  timestamp timestamptz not null default now(),
  viewers integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.viewer_history is 'Time-series viewer counts sampled during live broadcasts.';

-- 5. follower_history table
create table if not exists public.follower_history (
  id uuid primary key default gen_random_uuid(),
  timestamp timestamptz not null default now(),
  total_followers integer not null,
  net_change integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.follower_history is 'Milestones tracking historical Kick follower counts.';

-- 6. analytics_daily table
create table if not exists public.analytics_daily (
  id uuid primary key default gen_random_uuid(),
  date date unique not null,
  average_viewers integer not null default 0,
  peak_viewers integer not null default 0,
  hours_streamed numeric(5,2) not null default 0.00,
  followers_gained integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.analytics_daily is 'Aggregated metrics computed daily.';

-- 7. analytics_weekly table
create table if not exists public.analytics_weekly (
  id uuid primary key default gen_random_uuid(),
  week_start_date date unique not null,
  average_viewers integer not null default 0,
  peak_viewers integer not null default 0,
  hours_streamed numeric(5,2) not null default 0.00,
  followers_gained integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.analytics_weekly is 'Aggregated metrics computed weekly.';

-- 8. analytics_monthly table
create table if not exists public.analytics_monthly (
  id uuid primary key default gen_random_uuid(),
  month_start_date date unique not null,
  average_viewers integer not null default 0,
  peak_viewers integer not null default 0,
  hours_streamed numeric(5,2) not null default 0.00,
  followers_gained integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.analytics_monthly is 'Aggregated metrics computed monthly.';


-- TRIGGERS

create trigger trigger_stream_state_updated_at
  before update on public.stream_state
  for each row execute procedure public.update_updated_at_column();

create trigger trigger_stream_history_updated_at
  before update on public.stream_history
  for each row execute procedure public.update_updated_at_column();

create trigger trigger_live_snapshots_updated_at
  before update on public.live_snapshots
  for each row execute procedure public.update_updated_at_column();

create trigger trigger_viewer_history_updated_at
  before update on public.viewer_history
  for each row execute procedure public.update_updated_at_column();

create trigger trigger_follower_history_updated_at
  before update on public.follower_history
  for each row execute procedure public.update_updated_at_column();

create trigger trigger_analytics_daily_updated_at
  before update on public.analytics_daily
  for each row execute procedure public.update_updated_at_column();

create trigger trigger_analytics_weekly_updated_at
  before update on public.analytics_weekly
  for each row execute procedure public.update_updated_at_column();

create trigger trigger_analytics_monthly_updated_at
  before update on public.analytics_monthly
  for each row execute procedure public.update_updated_at_column();
