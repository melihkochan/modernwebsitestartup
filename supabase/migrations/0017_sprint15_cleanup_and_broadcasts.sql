-- 1. StreamsCharts tables cleanup
DROP TABLE IF EXISTS public.analytics_cache CASCADE;
DROP TABLE IF EXISTS public.channel_statistics CASCADE;
DROP TABLE IF EXISTS public.followers_history CASCADE;

-- 2. Drop Timeline table (if exists)
DROP TABLE IF EXISTS public.timeline CASCADE;

-- 3. Rebuild setup_items (drop existing setup_items and setup_categories cascade)
DROP TABLE IF EXISTS public.setup_items CASCADE;
DROP TABLE IF EXISTS public.setup_categories CASCADE;

CREATE TABLE public.setup_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  brand text,
  category text,
  description text,
  storage_path text,
  purchase_url text,
  affiliate_url text,
  price numeric(10,2),
  currency varchar(10) DEFAULT 'TRY',
  specifications jsonb DEFAULT '{}'::jsonb,
  display_order integer NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  is_visible boolean NOT NULL DEFAULT true,
  is_archived boolean NOT NULL DEFAULT false,
  availability text DEFAULT 'stokta',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.setup_items IS 'Broadcaster gear and hardware showcase.';

-- Enable RLS and create policies for setup_items
ALTER TABLE public.setup_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow Public Read setup_items"
  ON public.setup_items FOR SELECT USING (true);

CREATE POLICY "Allow Admin Full setup_items"
  ON public.setup_items FOR ALL USING (public.is_admin(auth.uid()));

-- Trigger for setup_items updated_at
CREATE TRIGGER trigger_setup_items_updated_at
  BEFORE UPDATE ON public.setup_items
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- 4. Alter stream_history with new Columns
ALTER TABLE public.stream_history 
RENAME COLUMN game_played TO category;

ALTER TABLE public.stream_history
ADD COLUMN IF NOT EXISTS slug text,
ADD COLUMN IF NOT EXISTS duration_seconds integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS followers_gained integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS vod_url text,
ADD COLUMN IF NOT EXISTS thumbnail text,
ADD COLUMN IF NOT EXISTS language text DEFAULT 'tr',
ADD COLUMN IF NOT EXISTS total_views integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS ended_reason text,
ADD COLUMN IF NOT EXISTS stream_snapshot jsonb,
ADD COLUMN IF NOT EXISTS snapshot_created_at timestamptz,
ADD COLUMN IF NOT EXISTS stream_number integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'ended' CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled'));

-- 5. Modify gallery table schema (drop image_url, add storage_path/metadata/display_order)
ALTER TABLE public.gallery
ADD COLUMN IF NOT EXISTS storage_path text,
ADD COLUMN IF NOT EXISTS mime_type text;

-- Rename order_index to display_order (first check if order_index exists before renaming)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gallery' AND column_name='order_index') THEN
    ALTER TABLE public.gallery RENAME COLUMN order_index TO display_order;
  END IF;
END $$;

ALTER TABLE public.gallery
DROP COLUMN IF EXISTS image_url;

-- 6. Create site_settings table (key-value JSON)
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.site_settings IS 'Key-value based site settings schema.';

-- Enable RLS and create policies for site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow Public Read site_settings"
  ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Allow Admin Full site_settings"
  ON public.site_settings FOR ALL USING (public.is_admin(auth.uid()));

-- Trigger for site_settings updated_at
CREATE TRIGGER trigger_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Seed default site_settings keys
INSERT INTO public.site_settings (key, value)
VALUES 
  ('home', '{"heroTitle": "The Story Told in Numbers", "heroDescription": "Explore the growth metrics, average viewership patterns, streaming times, and community milestones over time.", "liveBanner": null}'::jsonb),
  ('seo', '{"title": "Zehragn - Streamer Platform", "description": "Zehragn official streamer website", "keywords": "Zehragn, Kick, streamer, gaming"}'::jsonb),
  ('social', '{"kickUrl": "https://kick.com/zehragn", "discordUrl": "https://discord.gg/zehragn", "instagramUrl": "https://instagram.com/zehragn", "youtubeUrl": "https://youtube.com/zehragn", "twitterUrl": "https://x.com/zehragn"}'::jsonb),
  ('branding', '{"streamerName": "Zehragn", "logoUrl": null, "faviconUrl": null, "avatarUrl": null, "coverUrl": null}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 7. Create admin_activity_logs table
CREATE TABLE public.admin_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id text,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.admin_activity_logs IS 'Audit logs recording administrative activity.';

-- Enable RLS and create policies for admin_activity_logs
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow Admin Read admin_activity_logs"
  ON public.admin_activity_logs FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Allow Admin Insert admin_activity_logs"
  ON public.admin_activity_logs FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

-- 8. Add setup and gallery storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('setup', 'setup', true),
  ('gallery', 'gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 9. Add suggestions status constraint (update Suggestions table status default and CHECK constraint)
-- First check suggestions structure, we will add status column if not exist
ALTER TABLE public.game_suggestions
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
