-- Employer accounts require admin approval before they can post jobs.
alter table public.employer_profiles
  add column if not exists status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected'));

-- Admin can view/update any employer profile (approve/reject) — separate
-- from the existing "employer can view/update own profile" policies.
create policy "admin can view all employer profiles"
  on public.employer_profiles for select
  to authenticated
  using (exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy "admin can update any employer profile"
  on public.employer_profiles for update
  to authenticated
  using (exists (select 1 from public.admin_profiles where id = auth.uid()))
  with check (exists (select 1 from public.admin_profiles where id = auth.uid()));

-- Tighten the employer job-insert policy: must also be approved.
drop policy if exists "employer can insert own jobs" on public.jobs;
create policy "approved employer can insert own jobs"
  on public.jobs
  for insert
  to authenticated
  with check (
    employer_id = auth.uid()
    and exists (
      select 1 from public.employer_profiles
      where id = auth.uid() and status = 'approved'
    )
  );
