-- Enable required PostgreSQL extensions
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";
create extension if not exists "unaccent";

-- Reusable trigger function to automatically update updated_at columns
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

comment on function public.update_updated_at_column() is 'Automatically sets updated_at column to current timestamp on row modification.';
