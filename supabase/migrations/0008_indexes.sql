-- Database Performance Indexes

-- 1. Composite query index for active game suggestions sorted by high-votes
create index if not exists game_suggestions_status_votes_idx 
on public.game_suggestions (status, votes_count desc);

-- 2. Foreign key lookup performance index for viewer history
create index if not exists viewer_history_stream_history_timestamp_idx
on public.viewer_history (stream_history_id, timestamp desc);

-- 3. Lookup filter index for FAQ categories
create index if not exists faq_category_idx
on public.faq (category);

-- 4. Sort query performance index for timeline milestones
create index if not exists timeline_event_date_idx
on public.timeline (event_date desc);

-- 5. Sort query performance index for clips list / carousels
create index if not exists clips_featured_created_at_idx
on public.clips (is_featured, created_at desc);

-- 6. Trigram fuzzy search GIN index for fast game title autocomplete (via pg_trgm)
create index if not exists game_suggestions_title_trgm_idx
on public.game_suggestions using gin (game_title gin_trgm_ops);

-- 7. Trigram fuzzy search GIN indexes for FAQ questions and answers full-text filtering
create index if not exists faq_question_trgm_idx
on public.faq using gin (question gin_trgm_ops);

create index if not exists faq_answer_trgm_idx
on public.faq using gin (answer gin_trgm_ops);
