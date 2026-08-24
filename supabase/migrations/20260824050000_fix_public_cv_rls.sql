-- The public CV form's insert/upload policies were scoped `to anon` only.
-- A visitor with an unrelated active Supabase Auth session in the same
-- browser (e.g. also logged into /admin or /employers/portal) sends
-- requests as `authenticated`, not `anon` — which had no matching policy
-- and got rejected with "new row violates row-level security policy".
-- Re-scope to `public` (anon + authenticated) since anyone should be able
-- to submit a CV regardless of an unrelated session.
drop policy if exists "anon can submit a cv" on public.cv_submissions;
create policy "anyone can submit a cv"
  on public.cv_submissions
  for insert
  to public
  with check (true);

drop policy if exists "anon can upload a resume" on storage.objects;
create policy "anyone can upload a resume"
  on storage.objects
  for insert
  to public
  with check (bucket_id = 'resumes');
