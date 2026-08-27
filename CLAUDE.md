@AGENTS.md

# Verifil

A recruitment platform connecting global employers with blue-collar Filipino
talent (OFWs). Built around credential verification and transparent,
anti-exploitation hiring — not just cost/efficiency. Live at
https://verifiljobs.com.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4
- Supabase (Postgres + Auth + Storage) — project "Verifil",
  `oczdqhngbcbkkymmrjwk`, region `ap-northeast-2`
- Deployed on Vercel (project `jgjurado/verifil`, custom domain
  `verifiljobs.com`)

## Three surfaces, three auth models

1. **Public site** (`/`, `/employers` marketing) — anonymous. The CV form and
   job listings on the homepage are **static/curated only**
   (`src/lib/data.ts`) — never wired to the live `jobs` table. Real job data
   stays internal to the admin/employer surfaces by design.
2. **Admin panel** (`/admin/*`) — Supabase Auth, gated by membership in
   `admin_profiles` (not a role flag — presence of the row *is* the
   permission). Uses the **service-role client** (`supabaseAdmin` from
   `src/lib/supabase-admin.ts`) for all reads/writes, so it bypasses RLS
   entirely. Every server action re-checks `isAdminAuthenticated()`
   independently of the layout gate, since Next.js server actions are
   directly invokable and don't inherit a page's auth check.
   - **Superadmin** is a second flag layered on top: `admin_profiles.is_superadmin`.
     Every admin can use the CRM; only superadmins see the "Superadmin" nav
     group and can access `/admin/superadmin/*` (Settings, SEO, Edit
     Homepage). Each superadmin page independently calls `isSuperAdmin()`
     and redirects to `/admin/dashboard` if false — same "re-check, don't
     trust the nav" pattern as `isAdminAuthenticated()`. Currently only
     `jjurado91@gmail.com` has the flag.
3. **Employer portal** (`/employers/portal/*`) — Supabase Auth, gated by
   `employer_profiles.status = 'approved'` (new signups start `pending`).
   Uses the **request-scoped client** (`createClient()` from
   `src/lib/supabase/server.ts`), so RLS does the enforcement — an employer
   physically cannot see or touch another employer's rows, even if the app
   code has a bug. This is the one surface where RLS is the real gate rather
   than a service-role bypass.

Employers and admins are both plain Supabase Auth users in the same
`auth.users` table — what distinguishes them is which profile table
(`admin_profiles` vs `employer_profiles`) has a matching row. Logging into
`/admin/login` with valid employer credentials is explicitly tested to fail
(see the RLS policies and the login page's post-auth membership check).

## Data model

- `cv_submissions` — public intake (anon insert-only RLS; admin reads via
  service role). Resume files land in the private `resumes` storage bucket.
- `candidates` — full profiles, usually created from a submission
  (`cv_submission_id`, nullable). Admin-only, no anon/authenticated RLS
  policies at all.
- `jobs` — `employer_id` nullable: set for employer self-service posts, null
  for admin-ingested ones. `hiring_principal` is now always resolved from a
  real `employer_profiles` row (dropdown, not free text) — the admin Job
  form requires selecting an *approved* employer. `added_by_name` /
  `added_by_role` record who created it for the admin table's "Added By"
  column.
- `job_applications` — candidate↔job pipeline, one row per pairing, `status`
  one of `screened | for_interview | for_endorsement | approved | rejected`.
  Admin-only. Drives the job page's kanban board, the candidate page's
  mirrored pipeline entries in the activity timeline, and the dashboard's
  stalled-candidate list. `bulk-actions.ts` upserts these
  (`onConflict: "job_id,candidate_id"`, `ignoreDuplicates: true`) so
  bulk-adding candidates to a job never creates duplicate pipeline rows.
- `candidate_notes` — additive call-log notes, never edited/deleted. Rendered
  merged into `CandidateTimeline.tsx` alongside profile-created and
  pipeline-status events, sorted chronologically as one feed.
- `candidate_documents` — per-candidate files beyond the CV (passport, NBI
  clearance, medical, certificates — see `doc_type` in `src/lib/documents.ts`)
  in the private `candidate-documents` storage bucket. Admin-only upload/
  download/delete via signed URLs.
- `job_categories` — admin-managed pick-list (`/admin/categories`) that
  replaced a static array; every category `<select>` site-wide fetches this
  live via `src/lib/categories.ts`.
- `admin_profiles`, `employer_profiles` — see auth model above.
  `candidates.assigned_admin_name` records ownership (sourced from
  `src/lib/admins.ts`), shown as a dropdown on `CandidateForm.tsx`.
- `site_content`, `site_settings` — singleton tables (`id = 'homepage'` /
  `id = 'default'`, always exactly one row) backing the public homepage.
  Public-readable RLS (`to public`, marketing copy only, nothing
  sensitive); writes only ever happen via `supabaseAdmin` from superadmin
  server actions, so no authenticated/anon write policy exists or is
  needed. `site_content.content` is a single `jsonb` blob shaped like
  `HomepageContent` (`src/lib/site-content.ts`); `site_settings` holds SEO
  fields, social links, and `maintenance_mode` (`src/lib/site-settings.ts`).
  Homepage components render DB content merged over hardcoded defaults, so
  a missing/partial row never breaks the page.

Countries are **not** database-backed — `src/lib/taxonomy.ts` has a full
world list with a curated "top" group (Canada, Germany, Hong Kong, Japan,
Kuwait, Philippines, Qatar, Saudi Arabia, UAE, USA) rendered first, then a
disabled divider, then everything else A-Z. Shared across every country
`<select>` via `src/components/CountryOptions.tsx`.

Migrations live in `supabase/migrations/`, applied with
`supabase db push` (needs `SUPABASE_ACCESS_TOKEN` — a personal access token,
not the project anon/service key). There's no local Supabase stack in use;
every migration goes straight to the linked remote project.

## Matching

`src/lib/matching.ts` — deliberately **not AI**. `computeFitScore(candidate,
job)` is a plain weighted rule set (trade/category match dominates, then
subcategory overlap, country preference, experience, job openness) returning
a 0-100 score plus human-readable reasons. Used for the jobs-page kanban
bucketing (a job is placed by its furthest-along non-rejected applicant;
jobs with no applicants, or only rejected ones, land in a leftmost
"No Matches" column) and for the job detail page's candidate table: every
approved candidate is scored against that job, sorted best-first, and rows
≥70 are highlighted. That table also flags a candidate's "Placement" if
they're already active in another job's pipeline, to prevent double-booking.

## Admin panel structure

- **Nav** (`AdminNav.tsx`) is grouped into dropdowns, not a flat list:
  Dashboard (standalone) · Candidates (CV Submissions, Profiles) · Jobs
  (Employers, Roles, Job Categories) · Superadmin (Settings, SEO, Edit
  Homepage — rendered only when `isSuperAdmin`). Labels like "Profiles"
  and "Roles" are just nav display names — the underlying routes are still
  `/admin/candidates` and `/admin/jobs`. Desktop dropdowns open on hover
  (with a short close-delay to survive the gap between button and panel)
  as well as click; mobile flattens each group into a labeled section
  inside the hamburger panel.
- Header right side is a `ProfileMenu.tsx` — circular initials avatar
  (derived from the admin's name) opening a Profile / Log out dropdown.
  `/admin/profile` lets an admin edit their own display name
  (`admin_profiles.name`, via `supabaseAdmin` since there's no
  authenticated-role update policy) and shows their superadmin badge if
  applicable.
- A `GlobalSearch.tsx` box (desktop: header row; mobile: row below it)
  debounce-queries `/admin/search` (candidates/jobs/employers by
  name/email/phone/company, 5 results each) and links straight to the
  matched record.
- `/admin/dashboard` — stat cards (new CVs last 7 days, pending employer
  approvals, candidates stalled 14+ days with no status change, open jobs
  30+ days with zero non-rejected applicants) plus the underlying lists,
  each linking straight to the relevant record. All queries run in parallel
  via `Promise.all`; date-window math is done in a small pure helper
  (`getDateWindows()`) defined outside the component — React's
  `react-hooks/purity` lint rule flags impure calls like `Date.now()` made
  directly in an async Server Component body.
- `/admin` (CV Submissions) — preview (modal, iframe/img by file type) and
  download via signed-URL routes; converting a submission into a candidate
  profile deletes the submission row (the storage file is *not* deleted —
  see the shared-object note below).
- `/admin/candidates` — search/filter/paginated list (`_shared/` components:
  `CandidateFilterSidebar`, `CandidateSearchBar`, `CandidatePagination`,
  `candidate-filters.ts` for the shared parse/PAGE_SIZE=20 logic), rendered
  by `CandidatesTable.tsx` which adds row checkboxes, a floating
  bulk-action bar (bulk-add selected candidates to a job's Screened column,
  or bulk-change status — see `bulk-actions.ts`), and a per-row status
  `<select>` that calls the same bulk action with a single-element array
  for inline status changes without opening the detail page. A "My
  Candidates" toggle (`MyCandidatesToggle.tsx`) filters
  `assigned_admin_name` to the logged-in admin via an `assigned` query
  param (parsed/preserved alongside the other filters in
  `candidate-filters.ts`). "Export CSV" hits `/admin/candidates/export`,
  which re-parses the same filter params server-side and streams a CSV of
  the full filtered set (not just the current page).
  - Candidate detail page wires `CandidateForm` (biodata + ownership),
    `CandidateDocuments`, and `CandidateTimeline`, plus a
    `/candidates/[id]/endorsement` printable summary page
    (`window.print()`, `print:hidden` used elsewhere to hide chrome).
  - New-candidate flow does duplicate detection by phone/email match against
    existing candidates — shows a warning with links to the existing
    profile(s) but does not block creation.
- `/admin/jobs` — table/kanban toggle (`?view=table|kanban`); the table view
  (`JobsTable.tsx`) has the same inline status `<select>` pattern as
  Candidates (via `updateJobStatus`) and an "Export CSV" button
  (`/admin/jobs/export`). Job detail page candidate section reuses the same
  filter/search/pagination pieces as the Candidates list, adding the %fit
  and Placement columns described above.
- `/admin/employers` — approve/reject employer accounts (gates their ability
  to post jobs); detail page has an editable profile form, an "Add Job"
  button that deep-links to `/admin/jobs/new?employer_id=<id>` with that
  employer pre-selected in the job form, and lists every job that employer
  has posted.
- `/admin/superadmin/*` — superadmin-only, each page redirects to
  `/admin/dashboard` if `isSuperAdmin()` is false:
  - **Edit Homepage** — a structured content editor (not a drag/drop page
    builder — deliberately scoped down after discussion) for the Hero,
    trust stats, Jobs Preview, How It Works steps, and Apply Section copy,
    with a live-updating hero preview panel. Saves the whole
    `HomepageContent` object at once via `saveHomepageContent`.
  - **SEO** — editable site title/description/OG image, written to
    `site_settings`; consumed by `generateMetadata()` in `src/app/page.tsx`
    (route-level metadata override, so this DB read only happens for the
    homepage request, not every page in the app).
  - **Settings** — editable social links (Footer reads these, falling back
    to hardcoded defaults for the one client-component page that can't
    await server data — see Footer note below) and a `maintenance_mode`
    toggle that swaps the entire homepage for a static "we'll be right
    back" page while leaving `/admin` and `/employers/portal` untouched.

## Conventions worth knowing before changing things

- **Client components calling server actions directly** (not via
  `<form action={fn}>`) — e.g. the categories add/edit/delete UI — don't get
  Next's automatic router refresh. Call `router.refresh()` explicitly after
  the action resolves, or the UI won't reflect the change until a manual
  reload.
- **Resume filenames are sanitized before becoming part of the storage
  key** (`sanitizeFileName` in `CvForm.tsx`) — real filenames have slashes,
  unicode, and excessive length that can silently break an upload.
- **RLS policies use `to public`, not `to anon`, for the CV submission
  insert/upload path.** A visitor with *any* unrelated active Supabase Auth
  session in that browser (e.g. also logged into `/admin`) sends requests as
  `authenticated`, not `anon` — an `anon`-only policy will reject them. This
  was a real production bug; see the git history if it resurfaces.
- **`resumes` storage objects can be shared** between a `cv_submissions` row
  and the `candidates` row created from it (same object key, not a copy).
  The submission-delete action checks for a matching candidate before
  deleting the file so it doesn't break that candidate's download.
- Route groups: `/admin/(protected)/` wraps every authenticated admin page
  in the auth-gated layout; `/admin/login` deliberately sits *outside* that
  group to avoid a redirect loop.
- `next/loading.tsx` files (app root, `/admin/(protected)`,
  `/employers/portal`) show a spinner + dimmed placeholder automatically
  during server-fetched navigations — no manual loading state needed on
  those pages. In practice admin navigations render in ~1-1.3s, so the
  spinner often doesn't get a chance to paint; that's expected, not a bug.
- **Admin auth is wrapped in React's `cache()`** (`getAdminProfile` in
  `src/lib/admin-auth.ts`) so the layout, page, and any server actions that
  each want to know "is this an admin" within one request share a single
  Supabase round trip instead of each independently calling
  `auth.getUser()` + querying `admin_profiles`. Don't reintroduce a
  duplicate uncached lookup when adding new admin pages/actions.
- **Vercel functions are pinned to `icn1` (Seoul)** via `vercel.json`
  `regions`, matching the Supabase project's `ap-northeast-2` region, to
  avoid cross-region round trips on every query. Keep this in sync if the
  Supabase project region ever changes.
- When measuring perceived page speed, don't rely on Playwright's
  `networkidle` — Next.js prefetches every visible `<Link>`'s RSC payload in
  the background (e.g. all admin nav items), which keeps the network "busy"
  well after the page is actually visible and interactive. Measure against
  a real content selector instead.
- **`src/lib/site-settings-defaults.ts` exists solely to be client-safe** —
  it holds the `SiteSettings` type and hardcoded defaults with *no* import
  of `supabase-admin`. `src/lib/site-settings.ts` (server-only, wraps the
  actual DB read in `cache()`) re-exports the same type/const for
  server-side callers. This split exists because Next.js can't tree-shake
  a `"server-only"` import out of a module just because a client component
  only uses one of its named exports — the whole module (and its
  `supabase-admin` import) still gets pulled into the client bundle and
  fails the build. `Footer.tsx` is the reason this split exists: it's
  rendered from one client-component page (`employers/signup/page.tsx`)
  that can't `await` server data, so `Footer` takes an optional `settings`
  prop (server-component pages fetch and pass it; the signup page omits it
  and gets the hardcoded defaults). Don't merge these two files back
  together, and don't import the server file's `getSiteSettings` from
  anything a client component might transitively pull in.
- The homepage (`src/app/page.tsx`) still builds as a **static** route
  (`○` in the build output) even though it now reads `site_content` /
  `site_settings` from the database — Next.js doesn't detect a
  request-specific dependency, so it prerenders at build time. This is
  fine: every superadmin save action calls `revalidatePath("/")`, which
  triggers on-demand ISR regeneration, so edits show up without a redeploy.
  Don't "fix" this by forcing the route dynamic — that would reintroduce a
  live DB round trip on every homepage hit for no benefit.

## Environment variables

Set in both `.env.local` and Vercel (production):
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY` (server-only, never expose to the client).
`ADMIN_PASSWORD` is retired — admin auth is per-person Supabase accounts now.

## Deploying

```
npm run build              # verify first
git push                   # main branch
vercel deploy --prod --yes
```

No CI is wired up — deploys are manual via the Vercel CLI. Database changes
go out via `supabase db push` *before* the app deploy that depends on them.

## What's still explicitly placeholder / future work

- Homepage gallery/testimonial photos are stock placeholders, flagged
  in-code, meant to be swapped for real consented OFW photos before launch.
- No bulk employer import yet — the admin Job form's hiring-principal
  dropdown only lists employers who self-registered and got approved.
- Candidate scoring beyond `computeFitScore` is manual (notes only); no
  AI-driven scoring is planned — matching stays rule-based by design.
