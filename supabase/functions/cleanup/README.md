# Database Cleanup Edge Function

## Purpose
This function executes background maintenance jobs (e.g. archiving older time-series metrics, cleaning expired cache files, and permanently deleting flagged/spam entries).

## Deployment
Deploy via Supabase CLI:
```bash
supabase functions deploy cleanup
```
