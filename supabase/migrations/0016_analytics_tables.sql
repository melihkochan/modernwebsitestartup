-- 1. Drop clips table if exists
DROP TABLE IF EXISTS public.clips CASCADE;

-- 2. Create analytics_cache table
CREATE TABLE IF NOT EXISTS public.analytics_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payload jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.analytics_cache IS 'Raw cached analytics payload from StreamsCharts API.';

-- 3. Create channel_statistics table
CREATE TABLE IF NOT EXISTS public.channel_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  followers integer,
  followers_gain integer,
  average_viewers integer,
  peak_viewers integer,
  hours_streamed numeric(8,2),
  hours_watched numeric(12,2),
  live_views integer,
  estimated_audience integer,
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.channel_statistics IS 'Aggregated historical statistics for the channel from StreamsCharts.';

-- 4. Create followers_history table
CREATE TABLE IF NOT EXISTS public.followers_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  followers integer NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.followers_history IS 'Historical log of follower counts over time.';

-- Enable Row Level Security (RLS)
ALTER TABLE public.analytics_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followers_history ENABLE ROW LEVEL SECURITY;

-- Create Public Read Policies
CREATE POLICY "Allow Public Read analytics_cache"
  ON public.analytics_cache FOR SELECT USING (true);

CREATE POLICY "Allow Public Read channel_statistics"
  ON public.channel_statistics FOR SELECT USING (true);

CREATE POLICY "Allow Public Read followers_history"
  ON public.followers_history FOR SELECT USING (true);

-- Create Admin Full Access Policies
CREATE POLICY "Allow Admin Full analytics_cache"
  ON public.analytics_cache FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Allow Admin Full channel_statistics"
  ON public.channel_statistics FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Allow Admin Full followers_history"
  ON public.followers_history FOR ALL USING (public.is_admin(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER trigger_analytics_cache_updated_at
  BEFORE UPDATE ON public.analytics_cache
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER trigger_channel_statistics_updated_at
  BEFORE UPDATE ON public.channel_statistics
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
