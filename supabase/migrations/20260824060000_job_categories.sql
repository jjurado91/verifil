-- Admin-managed job categories, replacing the static taxonomy list.
-- Public read (populates the applicant CV form's dropdown); writes are
-- admin-only via the service role (no anon/authenticated write policy).
create table if not exists public.job_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

alter table public.job_categories enable row level security;

create policy "anyone can view job categories"
  on public.job_categories for select
  to public
  using (true);

insert into public.job_categories (name) values
  ('Construction'),
  ('Logistics / Warehouse'),
  ('Welding / Fabrication'),
  ('Electrical'),
  ('Healthcare & Caregiving'),
  ('Hospitality / Food Service'),
  ('Manufacturing'),
  ('Driving / Heavy Equipment'),
  ('Other')
on conflict (name) do nothing;
