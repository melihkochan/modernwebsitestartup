-- Row Level Security (RLS) Configuration

-- Enable RLS for all tables
alter table public.profiles enable row level security;
alter table public.admins enable row level security;
alter table public.settings enable row level security;
alter table public.social_links enable row level security;
alter table public.stream_state enable row level security;
alter table public.stream_history enable row level security;
alter table public.live_snapshots enable row level security;
alter table public.viewer_history enable row level security;
alter table public.follower_history enable row level security;
alter table public.analytics_daily enable row level security;
alter table public.analytics_weekly enable row level security;
alter table public.analytics_monthly enable row level security;
alter table public.polls enable row level security;
alter table public.poll_votes enable row level security;
alter table public.game_suggestions enable row level security;
alter table public.suggestion_votes enable row level security;
alter table public.announcements enable row level security;
alter table public.gallery enable row level security;
alter table public.gallery_images enable row level security;
alter table public.setup_categories enable row level security;
alter table public.setup_items enable row level security;
alter table public.faq enable row level security;
alter table public.timeline enable row level security;
alter table public.clips enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;
alter table public.steam_cache enable row level security;


-- 1. PROFILES POLICIES
create policy "Allow Public Read Profiles"
  on public.profiles for select using (true);

create policy "Allow User Update Own Profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Allow Admin Full Profiles"
  on public.profiles for all using (public.is_admin(auth.uid()));

-- 2. ADMINS POLICIES
create policy "Allow Public Read Admins"
  on public.admins for select using (true);

create policy "Allow Admin Full Admins"
  on public.admins for all using (public.is_admin(auth.uid()));

-- 3. SETTINGS POLICIES
create policy "Allow Public Read Settings"
  on public.settings for select using (true);

create policy "Allow Admin Full Settings"
  on public.settings for all using (public.is_admin(auth.uid()));

-- 4. SOCIAL LINKS POLICIES
create policy "Allow Public Read Social Links"
  on public.social_links for select using (true);

create policy "Allow Admin Full Social Links"
  on public.social_links for all using (public.is_admin(auth.uid()));

-- 5. STREAM STATE POLICIES
create policy "Allow Public Read Stream State"
  on public.stream_state for select using (true);

create policy "Allow Admin Full Stream State"
  on public.stream_state for all using (public.is_admin(auth.uid()));

-- 6. STREAM HISTORY POLICIES
create policy "Allow Public Read Stream History"
  on public.stream_history for select using (true);

create policy "Allow Admin Full Stream History"
  on public.stream_history for all using (public.is_admin(auth.uid()));

-- 7. LIVE SNAPSHOTS POLICIES
create policy "Allow Public Read Live Snapshots"
  on public.live_snapshots for select using (true);

create policy "Allow Admin Full Live Snapshots"
  on public.live_snapshots for all using (public.is_admin(auth.uid()));

-- 8. VIEWER HISTORY POLICIES
create policy "Allow Public Read Viewer History"
  on public.viewer_history for select using (true);

create policy "Allow Admin Full Viewer History"
  on public.viewer_history for all using (public.is_admin(auth.uid()));

-- 9. FOLLOWER HISTORY POLICIES
create policy "Allow Public Read Follower History"
  on public.follower_history for select using (true);

create policy "Allow Admin Full Follower History"
  on public.follower_history for all using (public.is_admin(auth.uid()));

-- 10. ANALYTICS POLICIES
create policy "Allow Public Read Analytics Daily"
  on public.analytics_daily for select using (true);

create policy "Allow Admin Full Analytics Daily"
  on public.analytics_daily for all using (public.is_admin(auth.uid()));

create policy "Allow Public Read Analytics Weekly"
  on public.analytics_weekly for select using (true);

create policy "Allow Admin Full Analytics Weekly"
  on public.analytics_weekly for all using (public.is_admin(auth.uid()));

create policy "Allow Public Read Analytics Monthly"
  on public.analytics_monthly for select using (true);

create policy "Allow Admin Full Analytics Monthly"
  on public.analytics_monthly for all using (public.is_admin(auth.uid()));

-- 11. POLLS POLICIES
create policy "Allow Public Read Polls"
  on public.polls for select using (true);

create policy "Allow Admin Full Polls"
  on public.polls for all using (public.is_admin(auth.uid()));

-- 12. POLL VOTES POLICIES
create policy "Allow Public Read Poll Votes"
  on public.poll_votes for select using (true);

create policy "Allow Public Insert Poll Votes"
  on public.poll_votes for insert with check (true);

create policy "Allow Admin Full Poll Votes"
  on public.poll_votes for all using (public.is_admin(auth.uid()));

-- 13. GAME SUGGESTIONS POLICIES
create policy "Allow Public Read Game Suggestions"
  on public.game_suggestions for select using (true);

create policy "Allow Authenticated Insert Game Suggestions"
  on public.game_suggestions for insert with check (
    auth.role() = 'authenticated' and
    suggested_by = auth.uid()
  );

create policy "Allow Admin Full Game Suggestions"
  on public.game_suggestions for all using (public.is_admin(auth.uid()));

-- 14. SUGGESTION VOTES POLICIES
create policy "Allow Public Read Suggestion Votes"
  on public.suggestion_votes for select using (true);

create policy "Allow Public Insert Suggestion Votes"
  on public.suggestion_votes for insert with check (true);

create policy "Allow Admin Full Suggestion Votes"
  on public.suggestion_votes for all using (public.is_admin(auth.uid()));

-- 15. ANNOUNCEMENTS POLICIES
create policy "Allow Public Read Announcements"
  on public.announcements for select using (
    deleted_at is null and
    status = 'published'
  );

create policy "Allow Admin Full Announcements"
  on public.announcements for all using (public.is_admin(auth.uid()));

-- 16. GALLERY POLICIES
create policy "Allow Public Read Gallery"
  on public.gallery for select using (deleted_at is null);

create policy "Allow Admin Full Gallery"
  on public.gallery for all using (public.is_admin(auth.uid()));

-- 17. GALLERY IMAGES POLICIES
create policy "Allow Public Read Gallery Images"
  on public.gallery_images for select using (true);

create policy "Allow Admin Full Gallery Images"
  on public.gallery_images for all using (public.is_admin(auth.uid()));

-- 18. SETUP CATEGORIES POLICIES
create policy "Allow Public Read Setup Categories"
  on public.setup_categories for select using (true);

create policy "Allow Admin Full Setup Categories"
  on public.setup_categories for all using (public.is_admin(auth.uid()));

-- 19. SETUP ITEMS POLICIES
create policy "Allow Public Read Setup Items"
  on public.setup_items for select using (true);

create policy "Allow Admin Full Setup Items"
  on public.setup_items for all using (public.is_admin(auth.uid()));

-- 20. FAQ POLICIES
create policy "Allow Public Read FAQ"
  on public.faq for select using (deleted_at is null);

create policy "Allow Admin Full FAQ"
  on public.faq for all using (public.is_admin(auth.uid()));

-- 21. TIMELINE POLICIES
create policy "Allow Public Read Timeline"
  on public.timeline for select using (true);

create policy "Allow Admin Full Timeline"
  on public.timeline for all using (public.is_admin(auth.uid()));

-- 22. CLIPS POLICIES
create policy "Allow Public Read Clips"
  on public.clips for select using (true);

create policy "Allow Admin Full Clips"
  on public.clips for all using (public.is_admin(auth.uid()));

-- 23. NOTIFICATIONS POLICIES
create policy "Allow Public Read Notifications"
  on public.notifications for select using (
    expires_at is null or expires_at > now()
  );

create policy "Allow Admin Full Notifications"
  on public.notifications for all using (public.is_admin(auth.uid()));

-- 24. AUDIT LOGS POLICIES
create policy "Allow Admin Read Audit Logs"
  on public.audit_logs for select using (public.is_admin(auth.uid()));

create policy "Allow Admin Full Audit Logs"
  on public.audit_logs for all using (public.is_admin(auth.uid()));

-- 25. STEAM CACHE POLICIES
create policy "Allow Public Read Steam Cache"
  on public.steam_cache for select using (true);

create policy "Allow Admin Full Steam Cache"
  on public.steam_cache for all using (public.is_admin(auth.uid()));
