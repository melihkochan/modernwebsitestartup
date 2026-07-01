-- Add platform column to game_suggestions table
ALTER TABLE public.game_suggestions
ADD COLUMN IF NOT EXISTS platform text DEFAULT 'PC';

COMMENT ON COLUMN public.game_suggestions.platform IS 'The platforms the suggested game runs on.';
