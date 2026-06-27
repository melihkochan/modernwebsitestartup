-- Sprint 10: Chat & Subscriber Analytics Tables

-- 1. subscriber_history table
-- Tracks official Kick subscriber counts over time (active_subscribers_count field)
create table if not exists public.subscriber_history (
  id uuid primary key default gen_random_uuid(),
  timestamp timestamptz not null default now(),
  active_count integer not null default 0,
  net_change integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.subscriber_history is 'Historical Kick subscriber counts from the official active_subscribers_count API field.';

-- 2. chat_messages table
-- Stores real Kick chat messages via a server-side WebSocket listener (future implementation)
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  stream_history_id uuid references public.stream_history(id) on delete set null,
  username varchar(100) not null,
  display_name varchar(150),
  content text not null,
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

comment on table public.chat_messages is 'Real Kick chat messages stored via a server-side listener. Frontend reads only through Supabase Realtime.';

-- INDEXES
create index if not exists subscriber_history_timestamp_idx
  on public.subscriber_history (timestamp desc);

create index if not exists chat_messages_stream_history_idx
  on public.chat_messages (stream_history_id, sent_at desc);

create index if not exists chat_messages_sent_at_idx
  on public.chat_messages (sent_at desc);

-- RLS
alter table public.subscriber_history enable row level security;

create policy "subscriber_history_public_read"
  on public.subscriber_history for select using (true);

create policy "subscriber_history_admin_all"
  on public.subscriber_history for all using (public.is_admin(auth.uid()));

alter table public.chat_messages enable row level security;

create policy "chat_messages_public_read"
  on public.chat_messages for select using (true);

create policy "chat_messages_admin_all"
  on public.chat_messages for all using (public.is_admin(auth.uid()));

-- TRIGGERS
create trigger trigger_subscriber_history_updated_at
  before update on public.subscriber_history
  for each row execute procedure public.update_updated_at_column();
