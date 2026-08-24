-- Named admin accounts (replaces the old single shared-password cookie).
-- Membership in this table is what makes a Supabase Auth user an admin —
-- checked by matching id = auth.uid() against this table.
create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.admin_profiles enable row level security;

create policy "admin can view own profile"
  on public.admin_profiles for select
  to authenticated
  using (id = auth.uid());
