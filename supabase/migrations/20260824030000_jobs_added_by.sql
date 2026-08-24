-- Track who added a job — an admin's entered display name, or the
-- employer's company name — so the admin panel can attribute listings.
alter table public.jobs
  add column if not exists added_by_name text,
  add column if not exists added_by_role text check (added_by_role in ('admin', 'employer'));
