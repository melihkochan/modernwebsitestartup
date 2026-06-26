# Supabase Infrastructure & Development Workflow

This directory contains the production-grade database schema, storage policies, seeding data, and edge functions configuration for the Zehragn platforms.

## Commands Reference

Ensure you have the Supabase CLI installed locally or run via `npx`.

### 1. Boot Local Stack
Starts the local Postgres database, Auth, Storage, and Edge Function containers:
```bash
npx supabase start
```

### 2. Shutdown Local Stack
Gracefully stops all local Supabase service containers:
```bash
npx supabase stop
```

### 3. Reset Local Database
Wipes the local database, re-applies all migrations in `/migrations` in chronological order, and executes `seed.sql`:
```bash
npx supabase db reset
```

### 4. Push Schema to Production
Applies all pending migrations to the linked remote production database:
```bash
npx supabase db push
```

### 5. Create a New Migration File
Creates a blank migration file with a correct timestamp prefix:
```bash
npx supabase migration new <migration_name>
```

### 6. Generate TypeScript Types
Generates strongly-typed database schema interfaces from the local state:
```bash
npx supabase gen types typescript --local > src/types/database.ts
```
