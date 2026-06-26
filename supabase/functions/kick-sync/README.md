# Kick Synchronization Edge Function

## Purpose
This function is triggered periodically (e.g., via cron) or manually to fetch live telemetry details (viewer count, current category, stream title) from the Kick Web API and update the `stream_state` table.

## Deployment
Deploy via Supabase CLI:
```bash
supabase functions deploy kick-sync
```
