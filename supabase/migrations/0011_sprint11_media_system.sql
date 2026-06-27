-- Sprint 11: Media System — gallery tablosu genişletme + site_assets + media_files + thumbnails bucket
-- Uygulama: Supabase Dashboard > SQL Editor'de çalıştırın

-- ============================================================
-- 1. Mevcut gallery ve gallery_images tablolarını kaldır
--    (eski album yapısı → tekil medya dosyası yapısına geçiş)
-- ============================================================

drop table if exists public.gallery_images cascade;
drop table if exists public.gallery cascade;

-- ============================================================
-- 2. Yeni gallery tablosu (genişletilmiş medya şeması)
-- ============================================================

create table if not exists public.gallery (
  id            uuid primary key default gen_random_uuid(),
  title         varchar(200) not null,
  description   text,
  image_url     text not null,          -- Supabase Storage public URL
  thumbnail_url text,                   -- thumbnails bucket'tan küçük boyut
  category      varchar(50) not null default 'diger',
  alt_text      varchar(300),           -- SEO / erişilebilirlik için (Sprint 13)
  steam_app_id  integer,                -- Steam entegrasyonu (nullable)
  width         integer,               -- Piksel cinsinden orijinal genişlik
  height        integer,               -- Piksel cinsinden orijinal yükseklik
  file_size     bigint,                -- Bayt cinsinden dosya boyutu
  is_featured   boolean not null default false,
  order_index   integer not null default 0,
  usage_context varchar(50) not null default 'kullanilmiyor',
  -- Geçerli değerler: 'galeri', 'ana-sayfa', 'haber', 'kullanilmiyor'
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.gallery is 'Gerçek Supabase Storage dosyalarına bağlı medya öğeleri — SEO ve production odaklı şema.';
comment on column public.gallery.alt_text      is 'Sprint 13 SEO geçişinde kullanılacak alternatif metin.';
comment on column public.gallery.usage_context is 'Görselin kullanım alanı: galeri, ana-sayfa, haber, kullanilmiyor.';
comment on column public.gallery.thumbnail_url is 'thumbnails bucket''tan küçük boyutlu önizleme URL.';
comment on column public.gallery.steam_app_id  is 'İlgili Steam uygulaması ID (opsiyonel).';

-- Trigger
create trigger trigger_gallery_updated_at
  before update on public.gallery
  for each row execute procedure public.update_updated_at_column();

-- İndeksler
create index if not exists idx_gallery_category    on public.gallery (category);
create index if not exists idx_gallery_featured    on public.gallery (is_featured) where is_featured = true;
create index if not exists idx_gallery_order       on public.gallery (order_index);
create index if not exists idx_gallery_usage       on public.gallery (usage_context);

-- ============================================================
-- 3. site_assets tablosu
--    Kod içine URL gömülmez — tek kaynak burası
-- ============================================================

create table if not exists public.site_assets (
  id                      uuid primary key default gen_random_uuid(),
  logo_url                text,
  favicon_url             text,
  avatar_placeholder_url  text,
  image_placeholder_url   text,
  og_image_url            text,         -- Sprint 13 Open Graph görseli
  updated_at              timestamptz not null default now()
);

comment on table public.site_assets is 'Sitenin statik varlıkları — logo, favicon, placeholder görseller. Kod içine URL gömülmez.';

-- Tek satır garanti et (upsert ile yönetilir)
insert into public.site_assets (id) 
values ('00000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;

-- Trigger
create or replace function public.ensure_single_site_assets()
returns trigger as $$
begin
  if (select count(*) from public.site_assets) > 1 then
    raise exception 'site_assets tablosu yalnızca bir satır içerebilir.';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trigger_site_assets_single
  before insert on public.site_assets
  for each row execute procedure public.ensure_single_site_assets();

-- ============================================================
-- 4. Thumbnails bucket ekleme (mevcut migration'da eksikse)
-- ============================================================

insert into storage.buckets (id, name, public)
values ('thumbnails', 'thumbnails', true)
on conflict (id) do update set public = true;

-- ============================================================
-- 5. Gallery tablosu RLS Policies
-- ============================================================

alter table public.gallery enable row level security;
alter table public.site_assets enable row level security;

-- Herkes okuyabilir
create policy "gallery_public_select"
  on public.gallery for select
  using (true);

-- Sadece admin yazabilir
create policy "gallery_admin_insert"
  on public.gallery for insert
  with check (public.is_admin(auth.uid()));

create policy "gallery_admin_update"
  on public.gallery for update
  using (public.is_admin(auth.uid()));

create policy "gallery_admin_delete"
  on public.gallery for delete
  using (public.is_admin(auth.uid()));

-- site_assets policies
create policy "site_assets_public_select"
  on public.site_assets for select
  using (true);

create policy "site_assets_admin_update"
  on public.site_assets for update
  using (public.is_admin(auth.uid()));
