-- Additive, timestamped notes on a candidate (call logs, chats, etc.).
-- Admin-only — no anon/authenticated policies, managed via service role.
create table if not exists public.candidate_notes (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  body text not null,
  author_name text not null,
  created_at timestamptz not null default now()
);

alter table public.candidate_notes enable row level security;

create index if not exists candidate_notes_candidate_id_idx on public.candidate_notes (candidate_id);
