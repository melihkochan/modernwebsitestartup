-- Curated Content, Static Gear Showcase, Timeline, Clips, Notifications, Audit Logs, and Caches

-- 1. gallery table
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title varchar(100) not null,
  description text,
  slug varchar(120) unique not null,
  cover_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

comment on table public.gallery is 'Media galleries containing albums of pictures (with soft-delete).';

-- 2. gallery_images table
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references public.gallery(id) on delete cascade,
  image_url text not null,
  caption text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.gallery_images is 'Individual media files mapped to media gallery albums.';

-- 3. setup_categories table
create table if not exists public.setup_categories (
  id uuid primary key default gen_random_uuid(),
  name varchar(50) unique not null,
  order_weight integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.setup_categories is 'Categories organizing hardware configurations (e.g. Peripherals, Audio).';

-- 4. setup_items table
create table if not exists public.setup_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.setup_categories(id) on delete cascade,
  name varchar(100) not null,
  brand varchar(50) not null,
  model varchar(100) not null,
  image_url text,
  affiliate_url text,
  personal_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.setup_items is 'Detailed hardware products catalog utilized by the broadcaster.';

-- 5. faq table
create table if not exists public.faq (
  id uuid primary key default gen_random_uuid(),
  category varchar(50) not null,
  question text not null,
  answer text not null,
  order_weight integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

comment on table public.faq is 'Frequently Asked Questions and Answers (with soft-delete).';

-- 6. timeline table
create table if not exists public.timeline (
  id uuid primary key default gen_random_uuid(),
  title varchar(150) not null,
  description text not null,
  event_date date not null,
  category varchar(50) default 'general',
  media_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.timeline is 'Milestones list tracking career timeline.';

-- 7. clips table
create table if not exists public.clips (
  id uuid primary key default gen_random_uuid(),
  kick_clip_id varchar(50) unique not null,
  title text not null,
  duration numeric(5,2) not null,
  video_url text not null,
  thumbnail_url text not null,
  view_count integer default 0,
  created_by varchar(50) not null,
  is_featured boolean default false,
  created_at timestamptz not null,
  updated_at timestamptz not null default now()
);

comment on table public.clips is 'Highlights and viral stream clips synced from Kick.';

-- 8. notifications table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  title varchar(150) not null,
  message text not null,
  type varchar(30) default 'info',
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.notifications is 'Global broadcast messages pushed to live active sessions.';

-- 9. audit_logs table
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.profiles(id) on delete set null,
  action varchar(50) not null,
  table_name varchar(50) not null,
  record_id uuid,
  payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.audit_logs is 'Audit trail database logging administrative state modifications.';

-- 10. steam_cache table
create table if not exists public.steam_cache (
  id uuid primary key default gen_random_uuid(),
  steam_appid integer unique not null,
  game_details jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.steam_cache is 'Key-value cache for Steam Web API schema payloads to prevent rate limiting.';


-- TRIGGERS

create trigger trigger_gallery_updated_at
  before update on public.gallery
  for each row execute procedure public.update_updated_at_column();

create trigger trigger_gallery_images_updated_at
  before update on public.gallery_images
  for each row execute procedure public.update_updated_at_column();

create trigger trigger_setup_categories_updated_at
  before update on public.setup_categories
  for each row execute procedure public.update_updated_at_column();

create trigger trigger_setup_items_updated_at
  before update on public.setup_items
  for each row execute procedure public.update_updated_at_column();

create trigger trigger_faq_updated_at
  before update on public.faq
  for each row execute procedure public.update_updated_at_column();

create trigger trigger_timeline_updated_at
  before update on public.timeline
  for each row execute procedure public.update_updated_at_column();

create trigger trigger_clips_updated_at
  before update on public.clips
  for each row execute procedure public.update_updated_at_column();

create trigger trigger_notifications_updated_at
  before update on public.notifications
  for each row execute procedure public.update_updated_at_column();

create trigger trigger_audit_logs_updated_at
  before update on public.audit_logs
  for each row execute procedure public.update_updated_at_column();

create trigger trigger_steam_cache_updated_at
  before update on public.steam_cache
  for each row execute procedure public.update_updated_at_column();
