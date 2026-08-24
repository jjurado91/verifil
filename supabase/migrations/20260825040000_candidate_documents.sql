-- Documents beyond the CV: passport, NBI clearance, medical exam, trade
-- certs, visa, etc. Admin-only — uploaded/managed entirely via the
-- service-role client, no anon/authenticated policies needed.
create table if not exists public.candidate_documents (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  doc_type text not null check (
    doc_type in ('passport', 'nbi_clearance', 'medical_exam', 'trade_cert', 'visa', 'other')
  ),
  file_path text not null,
  file_name text not null,
  uploaded_at timestamptz not null default now()
);

alter table public.candidate_documents enable row level security;

create index if not exists candidate_documents_candidate_id_idx
  on public.candidate_documents (candidate_id);

insert into storage.buckets (id, name, public)
values ('candidate-documents', 'candidate-documents', false)
on conflict (id) do nothing;
