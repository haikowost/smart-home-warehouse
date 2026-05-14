-- Run this in Supabase SQL Editor after unpausing the project.
-- Dashboard: https://supabase.com/dashboard/project/xowwrvlxsxfcihxnpjlt/sql

create extension if not exists "uuid-ossp";

create table if not exists products (
  id           uuid primary key default uuid_generate_v4(),
  slug         text unique not null,
  sku          text,
  name         text not null,
  short_desc   text,
  description  text,
  category     text not null default 'power-control',
  brand        text not null default 'Unknown',
  price        numeric(10,2) not null default 0,
  compare_price numeric(10,2),
  images       text[]  default '{}',
  tags         text[]  default '{}',
  in_stock     boolean not null default false,
  featured     boolean not null default false,
  updated_at   timestamptz not null default now()
);

-- Allow public read access (for the storefront)
alter table products enable row level security;

create policy "Public products are viewable by everyone"
  on products for select
  using (true);

-- Service role (used by the exporter and admin API) bypasses RLS.

-- Indexes for common query patterns
create index if not exists products_category_idx on products(category);
create index if not exists products_brand_idx    on products(brand);
create index if not exists products_in_stock_idx on products(in_stock);
create index if not exists products_featured_idx on products(featured);
