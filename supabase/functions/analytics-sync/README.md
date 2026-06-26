# Analytics Synchronization Edge Function

## Purpose
This function aggregates the historical live stream telemetry metrics (calculating peak/average viewers) and caches daily/weekly summaries in `analytics_daily`, `analytics_weekly`, and `analytics_monthly`.

## Deployment
Deploy via Supabase CLI:
```bash
supabase functions deploy analytics-sync
```
