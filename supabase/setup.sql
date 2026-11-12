-- ============================================================================
-- Gold & Glow — Supabase setup (no Supabase Auth needed)
-- Run this ONCE in YOUR Gold & Glow Supabase project:
--   Dashboard → SQL Editor → New query → paste → Run.
--
-- How access works: the website's server talks to the database with the
-- service-role key (kept in .env, never sent to browsers). Row-level security
-- is switched ON with NO public policies, so nobody can read or write the
-- table directly from a browser. Admin login is checked by the site itself
-- against ADMIN_USERNAME / ADMIN_PASSWORD in .env.
-- ============================================================================

create table if not exists public.gg_products (
  id            text primary key,
  slug          text unique not null,
  name          text not null,
  tagline       text not null default '',
  category      text not null default 'Face Wash',
  price         integer not null default 0,
  compare_at    integer,
  size          text not null default '',
  rating        numeric(2,1) not null default 4.5,
  reviews       integer not null default 0,
  best_seller   boolean not null default false,
  is_new        boolean not null default false,
  images        text[] not null default '{}',
  shade         text not null default '40 49% 40%',
  short         text not null default '',
  description   text not null default '',
  key_ingredients text[] not null default '{}',
  benefits      text[] not null default '{}',
  how_to_use    text not null default '',
  skin_type     text not null default '',
  links         jsonb not null default '{}'::jsonb,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Lock the table down: service role (server) bypasses RLS; everyone else gets nothing.
alter table public.gg_products enable row level security;

-- Keep updated_at fresh.
create or replace function public.gg_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists gg_products_updated_at on public.gg_products;
create trigger gg_products_updated_at before update on public.gg_products
  for each row execute function public.gg_set_updated_at();

-- ----------------------------------------------------------------------------
-- Public storage bucket for product images. Anyone can VIEW an image URL;
-- uploads/deletes only happen through the server (service role).
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('gg-product-images', 'gg-product-images', true)
on conflict (id) do nothing;

-- ============================================================================
-- Done. Next: put the keys in .env.local and open /admin on the site, sign in
-- with ADMIN_USERNAME / ADMIN_PASSWORD, then click "Import starter catalogue".
-- ============================================================================
