create table if not exists public.items (
  id text primary key,
  name text not null,
  quantity integer not null default 0,
  note1 text not null default '',
  note2 text not null default '',
  note3 text not null default '',
  category text not null default 'Uncategorized',
  image text not null default '',
  timestamp timestamptz not null default now()
);

alter table public.items enable row level security;

drop policy if exists "Public item images are readable" on storage.objects;

insert into storage.buckets (id, name, public)
values ('item-images', 'item-images', true)
on conflict (id) do update set public = true;

create policy "Public item images are readable"
on storage.objects for select
using (bucket_id = 'item-images');
