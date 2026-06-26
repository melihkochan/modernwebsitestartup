-- Development Seed Data
-- Safe to execute multiple times (idempotent)

-- 1. Seed Admin User and Profile
insert into public.profiles (id, username, avatar_url, kick_username)
values 
  ('00000000-0000-0000-0000-000000000001', 'Zehragn', 'https://api.dicebear.com/7.x/adventurer/svg?seed=zehragn', 'zehragn')
on conflict (id) do nothing;

insert into public.admins (id, role)
values 
  ('00000000-0000-0000-0000-000000000001', 'owner')
on conflict (id) do nothing;


-- 2. Seed Stream State (Single Row)
insert into public.stream_state (id, is_live, viewer_count, current_game, stream_title, started_at)
values (
  true, 
  true, 
  12438, 
  'Valorant', 
  'Solo Ranked Grind — Let''s hit Radiant before season ends!', 
  now() - interval '3 hours'
)
on conflict (id) do update set
  is_live = excluded.is_live,
  viewer_count = excluded.viewer_count,
  current_game = excluded.current_game,
  stream_title = excluded.stream_title,
  started_at = excluded.started_at;


-- 3. Seed FAQ Items
insert into public.faq (id, category, question, answer, order_weight)
values
  ('f0000000-0000-0000-0000-000000000001', 'general', 'When does Zehragn stream?', 'Streams typically go live on Tuesday, Thursday, and Friday evenings starting at 20:00 (UTC+3). Weekend streams are more spontaneous.', 10),
  ('f0000000-0000-0000-0000-000000000002', 'general', 'What games does Zehragn play?', 'Primarily tactical shooters like Valorant and CS2, along with community customs, variety survival, and story-driven single-player titles.', 20),
  ('f0000000-0000-0000-0000-000000000003', 'setup', 'What are the main PC specs?', 'An NVIDIA RTX 4090 GPU paired with an Intel Core i9-14900K processor and 64GB DDR5 RAM to handle dual streaming outputs.', 30),
  ('f0000000-0000-0000-0000-000000000004', 'community', 'Is there an official Discord?', 'Yes! The official ZehrArmy Discord server is home to over 40,000 members. Join via discord.gg/zehragn.', 40)
on conflict (id) do nothing;


-- 4. Seed Setup Categories & Setup Items
insert into public.setup_categories (id, name, order_weight)
values
  ('c0000000-0000-0000-0000-000000000001', 'pc', 10),
  ('c0000000-0000-0000-0000-000000000002', 'peripherals', 20),
  ('c0000000-0000-0000-0000-000000000003', 'audio', 30)
on conflict (id) do nothing;

insert into public.setup_items (id, category_id, name, brand, model, image_url, affiliate_url, personal_note)
values
  ('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'GeForce RTX 4090 Founders Edition', 'NVIDIA', 'RTX 4090 FE', null, 'https://amazon.com', 'The absolute pinnacle of graphics processing. Powering flawless 240fps gameplay in 1440p resolution.'),
  ('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'Wooting 60HE Keyboard', 'Wooting', '60HE', null, 'https://amazon.com', 'Analog input keyboard with rapid trigger switches. Literally game-changing counter-strafing.'),
  ('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', 'Shure SM7B Vocal Microphone', 'Shure', 'SM7B', null, 'https://amazon.com', 'The classic broadcast dynamic microphone. Paired with a Cloudlifter for clean gain levels.')
on conflict (id) do nothing;


-- 5. Seed Timeline milestones
insert into public.timeline (id, title, description, event_date, category)
values
  ('t0000000-0000-0000-0000-000000000001', '285K Followers & Brand New Space', 'Unlocked custom recording studios and reached a massive community milestone of 285k followers.', '2026-06-01', 'milestone'),
  ('t0000000-0000-0000-0000-000000000002', 'Partnership with Kick', 'Signed official broadcaster partnership contract with Kick Streaming Platforms.', '2024-03-15', 'partnership'),
  ('t0000000-0000-0000-0000-000000000003', 'The Inaugural Broadcast', 'Launched the first official Zehragn live stream with just Chatting and CS2 matches.', '2021-08-01', 'stream')
on conflict (id) do nothing;


-- 6. Seed Interactive Polls
insert into public.polls (id, question, options, is_active, expires_at)
values (
  'p0000000-0000-0000-0000-000000000001',
  'Which game should we dedicate Saturday''s long variety stream to?',
  '[{"id": "opt-1", "label": "Resident Evil 4 Remake (Hardcore)", "votes": 842}, {"id": "opt-2", "label": "Minecraft Hardcore Survival", "votes": 1205}, {"id": "opt-3", "label": "Dead by Daylight with Fans", "votes": 412}]'::jsonb,
  true,
  now() + interval '2 days'
)
on conflict (id) do nothing;


-- 7. Seed Game Suggestions
insert into public.game_suggestions (id, game_title, steam_appid, cover_image_url, votes_count, status, admin_note)
values
  ('s0000000-0000-0000-0000-000000000001', 'Elden Ring: Shadow of the Erdtree', 2760200, null, 2420, 'considering', 'Will probably play this right after the next patch drop.'),
  ('s0000000-0000-0000-0000-000000000002', 'Hades II', 1145350, null, 1850, 'approved', 'Super hyped for this, added to upcoming schedules.'),
  ('s0000000-0000-0000-0000-000000000003', 'Cyberpunk 2077: Phantom Liberty', 2138330, null, 1420, 'pending', 'Need to finish previous playthrough first.')
on conflict (id) do nothing;


-- 8. Seed Social Links
insert into public.social_links (id, platform, url, icon_name)
values
  ('l0000000-0000-0000-0000-000000000001', 'Kick', 'https://kick.com/zehragn', 'Kick'),
  ('l0000000-0000-0000-0000-000000000002', 'Discord', 'https://discord.gg/zehragn', 'MessageSquare'),
  ('l0000000-0000-0000-0000-000000000003', 'Instagram', 'https://instagram.com/zehragn', 'Instagram')
on conflict (id) do nothing;


-- 9. Seed Media Gallery albums and gallery images
insert into public.gallery (id, title, description, slug, cover_image_url)
values
  ('g0000000-0000-0000-0000-000000000001', 'Zehragn Dual PC Setup Reveal', 'Visual reveal and pictures of the custom built gaming studio.', 'setup-reveal', null),
  ('g0000000-0000-0000-0000-000000000002', 'ZehrArmy Meetup 2025', 'Highlights from the regional fan meetup event.', 'meetup-2025', null)
on conflict (id) do nothing;

insert into public.gallery_images (id, gallery_id, image_url, caption)
values
  ('i0000000-0000-0000-0000-000000000001', 'g0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f', 'Completed visual setup desk perspective.'),
  ('i0000000-0000-0000-0000-000000000002', 'g0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7', 'Close-up perspective of the custom watercooling loop.'),
  ('i0000000-0000-0000-0000-000000000003', 'g0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4', 'Group photo with fans at the convention hall entrance.')
on conflict (id) do nothing;


-- 10. Seed System Settings configurations
insert into public.settings (key, value)
values
  ('kick_settings', '{"channel_name": "zehragn", "webhook_enabled": true, "sync_interval_seconds": 60}'::jsonb),
  ('steam_settings', '{"cache_expiration_days": 7, "rate_limit_per_minute": 30}'::jsonb)
on conflict (key) do update set value = excluded.value;


-- 11. Seed Announcements
insert into public.announcements (id, author_id, title, content, is_pinned, status)
values (
  'a0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Weekly Custom Lobby Night - Friday at 20:00!',
  'Prepare your setups, ZehrArmy! This Friday we are hosting open Valorant custom lobbies on Kick. There will be giveaways and live coaching sessions. Make sure you are active in the Discord server to secure your lobby invites.',
  true,
  'published'
)
on conflict (id) do nothing;


-- 12. Seed Clips
insert into public.clips (id, kick_clip_id, title, duration, video_url, thumbnail_url, view_count, created_by, is_featured, created_at)
values (
  'e0000000-0000-0000-0000-000000000001',
  'clip_v1_001',
  'Incredible 1v5 Ace Defuse to Win the Match!',
  45.50,
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e',
  12850,
  'TacticalAce',
  true,
  now() - interval '5 days'
)
on conflict (id) do nothing;


-- 13. Seed Analytics Daily metrics for the charts
insert into public.analytics_daily (id, date, average_viewers, peak_viewers, hours_streamed, followers_gained)
values
  ('y0000000-0000-0000-0000-000000000001', current_date - 6, 8400, 11200, 4.5, 120),
  ('y0000000-0000-0000-0000-000000000002', current_date - 5, 9200, 12438, 5.2, 240),
  ('y0000000-0000-0000-0000-000000000003', current_date - 4, 8800, 10800, 4.0, 180),
  ('y0000000-0000-0000-0000-000000000004', current_date - 3, 11200, 14240, 6.0, 310),
  ('y0000000-0000-0000-0000-000000000005', current_date - 2, 12438, 18240, 6.5, 450),
  ('y0000000-0000-0000-0000-000000000006', current_date - 1, 9500, 13100, 3.5, 150),
  ('y0000000-0000-0000-0000-000000000007', current_date, 10500, 14850, 4.8, 210)
on conflict (id) do nothing;
