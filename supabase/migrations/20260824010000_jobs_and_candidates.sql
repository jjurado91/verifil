-- Jobs: manually entered/ingested job openings. Admin-only — no anon policies,
-- so RLS blocks all access by default and only the service role can touch this.
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  agency_name text not null,
  hiring_principal text not null,
  country text not null,
  category text not null,
  subcategory text,
  role_title text not null,
  salary_min numeric,
  salary_max numeric,
  salary_currency text not null default 'USD',
  contract_length text,
  openings int not null default 1 check (openings >= 0),
  status text not null default 'open' check (status in ('open', 'filled', 'closed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.jobs enable row level security;

-- Candidate profiles built from a CV submission (or created directly).
-- Admin-only — no anon policies.
create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  cv_submission_id uuid references public.cv_submissions(id) on delete set null,

  full_name text not null,
  birthday date,
  phone text,
  email text,
  address text,
  civil_status text,
  nationality text not null default 'Filipino',

  trade text,
  experience_years int,
  preferred_country text,

  cv_file_path text not null,
  cv_file_name text not null,

  score numeric check (score is null or (score >= 0 and score <= 100)),
  score_notes text,

  status text not null default 'new' check (status in ('new', 'screening', 'verified', 'matched', 'deployed', 'rejected')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.candidates enable row level security;

create index if not exists candidates_cv_submission_id_idx on public.candidates (cv_submission_id);
create index if not exists jobs_country_category_idx on public.jobs (country, category);
