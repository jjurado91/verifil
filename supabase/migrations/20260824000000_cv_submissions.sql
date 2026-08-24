-- CV submissions from the public landing page apply form.
create table if not exists public.cv_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  mobile text not null,
  email text,
  trade text not null,
  experience_years int not null check (experience_years >= 0 and experience_years <= 60),
  preferred_country text,
  cv_file_path text not null,
  cv_file_name text not null,
  status text not null default 'new' check (status in ('new', 'reviewing', 'matched', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.cv_submissions enable row level security;

-- Applicants (anon) can submit, but cannot read, update, or delete —
-- including their own or anyone else's row. Only the service role
-- (used by a future admin dashboard) bypasses RLS entirely.
create policy "anon can submit a cv"
  on public.cv_submissions
  for insert
  to anon
  with check (true);

-- Private bucket for resume files. Applicants upload; nothing is
-- publicly readable or listable without the service role.
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

create policy "anon can upload a resume"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'resumes');
