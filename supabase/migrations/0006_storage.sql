-- Storage Buckets Configuration & Access Policies

-- Define the is_admin checker function first to support storage and RLS policies
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
begin
  return exists (select 1 from public.admins where id = user_id);
end;
$$ language plpgsql security definer;

comment on function public.is_admin(user_id uuid) is 'Bypasses RLS to check if a user profile possesses admin privileges.';


-- 1. Create storage buckets if they do not exist
insert into storage.buckets (id, name, public)
values 
  ('gallery', 'gallery', true),
  ('hero', 'hero', true),
  ('setup', 'setup', true),
  ('avatars', 'avatars', true),
  ('clips', 'clips', true),
  ('documents', 'documents', true),
  ('sponsors', 'sponsors', true)
on conflict (id) do update set public = true;


-- 2. Storage Policies on storage.objects

-- Allow public read access to all files inside public buckets
create policy "Allow Public Select"
on storage.objects for select
using (true);

-- Allow admins full insert control over all buckets
create policy "Allow Admin Insert"
on storage.objects for insert
with check (
  public.is_admin(auth.uid())
);

-- Allow admins full update control over all buckets
create policy "Allow Admin Update"
on storage.objects for update
with check (
  public.is_admin(auth.uid())
);

-- Allow admins full delete control over all buckets
create policy "Allow Admin Delete"
on storage.objects for delete
using (
  public.is_admin(auth.uid())
);

-- Allow authenticated users to upload and manage their own avatars (in avatars bucket, folder named by user's uuid)
create policy "Allow User Insert Own Avatar"
on storage.objects for insert
with check (
  bucket_id = 'avatars' and
  auth.role() = 'authenticated' and
  (storage.foldername(name))[1] = (auth.uid())::text
);

create policy "Allow User Update Own Avatar"
on storage.objects for update
with check (
  bucket_id = 'avatars' and
  auth.role() = 'authenticated' and
  (storage.foldername(name))[1] = (auth.uid())::text
);

create policy "Allow User Delete Own Avatar"
on storage.objects for delete
using (
  bucket_id = 'avatars' and
  auth.role() = 'authenticated' and
  (storage.foldername(name))[1] = (auth.uid())::text
);
