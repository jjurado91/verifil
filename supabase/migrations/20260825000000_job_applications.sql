-- Pipeline linking a candidate to a job they're being considered for.
-- Admin-only (no anon/authenticated policies) — managed from the job
-- detail page's "Candidates" board and mirrored read-only on the
-- candidate's own page.
create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  status text not null default 'screened'
    check (status in ('screened', 'for_interview', 'for_endorsement', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, candidate_id)
);

alter table public.job_applications enable row level security;

create index if not exists job_applications_job_id_idx on public.job_applications (job_id);
create index if not exists job_applications_candidate_id_idx on public.job_applications (candidate_id);
