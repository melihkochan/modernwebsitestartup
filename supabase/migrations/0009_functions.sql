-- 0009_functions.sql
-- Database functions and triggers

-- 1. Trigger function to keep game_suggestions.votes_count in sync
CREATE OR REPLACE FUNCTION public.update_game_suggestion_votes_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.game_suggestions
    SET votes_count = votes_count + 1
    WHERE id = NEW.suggestion_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.game_suggestions
    SET votes_count = votes_count - 1
    WHERE id = OLD.suggestion_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger on suggestion_votes
CREATE OR REPLACE TRIGGER trigger_update_game_suggestion_votes_count
AFTER INSERT OR DELETE ON public.suggestion_votes
FOR EACH ROW EXECUTE FUNCTION public.update_game_suggestion_votes_count();

-- 3. RPC function to increment / toggle upvote
CREATE OR REPLACE FUNCTION public.increment_suggestion_votes(suggestion_id uuid)
RETURNS void AS $$
DECLARE
  user_id uuid;
BEGIN
  user_id := auth.uid();
  IF user_id IS NOT NULL THEN
    -- Authenticated user: toggle vote
    IF EXISTS (
      SELECT 1 FROM public.suggestion_votes
      WHERE suggestion_votes.suggestion_id = $1
        AND public.suggestion_votes.profile_id = user_id
    ) THEN
      DELETE FROM public.suggestion_votes
      WHERE suggestion_votes.suggestion_id = $1
        AND public.suggestion_votes.profile_id = user_id;
    ELSE
      INSERT INTO public.suggestion_votes (suggestion_id, profile_id, fingerprint)
      VALUES ($1, user_id, user_id::text);
    END IF;
  ELSE
    -- Anonymous user: generate a unique fingerprint to record their vote
    INSERT INTO public.suggestion_votes (suggestion_id, profile_id, fingerprint)
    VALUES ($1, NULL, gen_random_uuid()::text);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
