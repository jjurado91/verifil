-- Superadmin flag on admin_profiles
alter table admin_profiles
  add column is_superadmin boolean not null default false;

update admin_profiles
  set is_superadmin = true
  where email = 'jjurado91@gmail.com';

-- Singleton table holding the public homepage's editable copy as JSON.
create table site_content (
  id text primary key default 'homepage',
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into site_content (id, content) values ('homepage', '{}'::jsonb);

-- Singleton table for site-wide settings (SEO, social links, maintenance mode).
create table site_settings (
  id text primary key default 'default',
  seo_title text,
  seo_description text,
  og_image_url text,
  social_facebook text,
  social_instagram text,
  social_linkedin text,
  maintenance_mode boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into site_settings (id) values ('default');

alter table site_content enable row level security;
alter table site_settings enable row level security;

-- Public/anon read access — this is public marketing copy, no sensitive data.
create policy "site_content readable by all"
  on site_content for select
  to public
  using (true);

create policy "site_settings readable by all"
  on site_settings for select
  to public
  using (true);

-- Writes only ever happen via the service-role client from superadmin
-- server actions, which bypasses RLS entirely — no authenticated/anon
-- write policies are needed or granted.
