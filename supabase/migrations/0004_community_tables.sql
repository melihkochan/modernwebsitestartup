-- Community Interaction Tables

-- 1. polls table
create table if not exists public.polls (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  options jsonb not null,
  is_active boolean default true,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.polls is 'Admins interactive polls.';

-- 2. poll_votes table
create table if not exists public.poll_votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  fingerprint text not null,
  option_id varchar(50) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_poll_vote_auth unique (poll_id, profile_id),
  constraint unique_poll_vote_anon unique (poll_id, fingerprint)
);

comment on table public.poll_votes is 'Registry tracking votes cast in interactive polls.';

-- 3. game_suggestions table
create table if not exists public.game_suggestions (
  id uuid primary key default gen_random_uuid(),
  suggested_by uuid references public.profiles(id) on delete set null,
  game_title varchar(150) not null,
  steam_appid integer unique,
  cover_image_url text,
  votes_count integer not null default 0,
  status varchar(20) not null default 'pending' check (status in ('pending', 'considering', 'approved', 'played', 'rejected')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.game_suggestions is 'Games proposed by authenticated fans to be played on stream.';

-- 4. suggestion_votes table (alternative to game_votes for user matching)
create table if not exists public.suggestion_votes (
  id uuid primary key default gen_random_uuid(),
  suggestion_id uuid not null references public.game_suggestions(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  fingerprint text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_suggestion_vote_auth unique (suggestion_id, profile_id),
  constraint unique_suggestion_vote_anon unique (suggestion_id, fingerprint)
);

comment on table public.suggestion_votes is 'Registry tracking fan votes cast on game suggestions.';

-- 5. announcements table
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.admins(id) on delete cascade,
  title varchar(200) not null,
  content text not null,
  is_pinned boolean default false,
  status varchar(20) default 'published',
  published_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

comment on table public.announcements is 'System announcements and updates posted by broadcasters (with soft-delete).';


-- TRIGGERS

create trigger trigger_polls_updated_at
  before update on public.polls
  for each row execute procedure public.update_updated_at_column();

create trigger trigger_poll_votes_updated_at
  before update on public.poll_votes
  for each row execute procedure public.update_updated_at_column();

create trigger trigger_game_suggestions_updated_at
  before update on public.game_suggestions
  for each row execute procedure public.update_updated_at_column();

create trigger trigger_suggestion_votes_updated_at
  before update on public.suggestion_votes
  for each row execute procedure public.update_updated_at_column();

create trigger trigger_announcements_updated_at
  before update on public.announcements
  for each row execute procedure public.update_updated_at_column();
