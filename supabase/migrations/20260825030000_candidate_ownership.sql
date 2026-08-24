-- Which admin/recruiter is working this candidate, so multiple admins
-- don't collide on the same person without knowing it.
alter table public.candidates
  add column if not exists assigned_admin_name text;
