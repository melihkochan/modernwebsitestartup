-- 0012_live_sync_fields.sql
-- Add thumbnail_url and stream_url columns to stream_state table

ALTER TABLE public.stream_state
ADD COLUMN IF NOT EXISTS thumbnail_url text,
ADD COLUMN IF NOT EXISTS stream_url text;

COMMENT ON COLUMN public.stream_state.thumbnail_url IS 'URL of the current live stream thumbnail.';
COMMENT ON COLUMN public.stream_state.stream_url IS 'Direct URL to the live stream.';
