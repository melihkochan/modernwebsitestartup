ALTER TABLE public.site_assets
ADD COLUMN IF NOT EXISTS white_logo_url text,
ADD COLUMN IF NOT EXISTS dark_logo_url text;

UPDATE public.site_assets
SET white_logo_url = logo_white_url
WHERE logo_white_url IS NOT NULL AND white_logo_url IS NULL;

UPDATE public.site_assets
SET dark_logo_url = logo_dark_url
WHERE logo_dark_url IS NOT NULL AND dark_logo_url IS NULL;

ALTER TABLE public.clips
ADD COLUMN IF NOT EXISTS views integer DEFAULT 0;

UPDATE public.clips
SET views = view_count
WHERE view_count IS NOT NULL AND views = 0;
