ALTER TABLE public.clips
ALTER COLUMN kick_clip_id DROP NOT NULL,
ALTER COLUMN created_by DROP NOT NULL,
ALTER COLUMN created_at SET DEFAULT now(),
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS game text,
ADD COLUMN IF NOT EXISTS visibility text DEFAULT 'public',
ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS likes integer DEFAULT 0;

ALTER TABLE public.site_assets
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS hero_banner_url text,
ADD COLUMN IF NOT EXISTS logo_white_url text,
ADD COLUMN IF NOT EXISTS logo_dark_url text,
ADD COLUMN IF NOT EXISTS offline_cover_url text,
ADD COLUMN IF NOT EXISTS default_thumbnail_url text,
ADD COLUMN IF NOT EXISTS illustration_404_url text;

CREATE TABLE IF NOT EXISTS public.fan_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username varchar(100) NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.fan_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fan_messages_public_read" ON public.fan_messages
  FOR SELECT USING (true);

CREATE POLICY "fan_messages_public_insert" ON public.fan_messages
  FOR INSERT WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.cast_poll_vote(poll_id uuid, option_id text, fingerprint text, profile_id uuid DEFAULT NULL)
RETURNS void AS $$
BEGIN
  INSERT INTO public.poll_votes (poll_id, profile_id, fingerprint, option_id)
  VALUES (poll_id, profile_id, fingerprint, option_id);

  UPDATE public.polls
  SET options = (
    SELECT jsonb_agg(
      CASE
        WHEN (val->>'id') = option_id THEN
          jsonb_set(val, '{votes}', to_jsonb(COALESCE((val->>'votes')::int, 0) + 1))
        ELSE
          val
      END
    )
    FROM jsonb_array_elements(options) val
  )
  WHERE id = poll_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
