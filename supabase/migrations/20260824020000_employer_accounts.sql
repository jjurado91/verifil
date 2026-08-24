-- Employer accounts: one row per auth.users employer, holding company info.
create table if not exists public.employer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_name text not null,
  contact_name text not null,
  contact_email text not null,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.employer_profiles enable row level security;

create policy "employer can view own profile"
  on public.employer_profiles for select
  to authenticated
  using (id = auth.uid());

create policy "employer can insert own profile"
  on public.employer_profiles for insert
  to authenticated
  with check (id = auth.uid());

create policy "employer can update own profile"
  on public.employer_profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Let jobs be either admin-ingested (employer_id null, managed only via
-- the service-role admin CRM) or self-service (employer_id set, owned
-- and managed by that employer through RLS).
alter table public.jobs
  add column if not exists employer_id uuid references auth.users(id) on delete set null;

create index if not exists jobs_employer_id_idx on public.jobs (employer_id);

create policy "employer can view own jobs"
  on public.jobs for select
  to authenticated
  using (employer_id = auth.uid());

create policy "employer can insert own jobs"
  on public.jobs for insert
  to authenticated
  with check (employer_id = auth.uid());

create policy "employer can update own jobs"
  on public.jobs for update
  to authenticated
  using (employer_id = auth.uid())
  with check (employer_id = auth.uid());

create policy "employer can delete own jobs"
  on public.jobs for delete
  to authenticated
  using (employer_id = auth.uid());
