# Steam API Sync Edge Function

## Purpose
This function queries the public Steam Store Web API for details (cover art, publisher, details) corresponding to game suggestions and caches them locally to avoid rate limiting.

## Deployment
Deploy via Supabase CLI:
```bash
supabase functions deploy steam-sync
```
