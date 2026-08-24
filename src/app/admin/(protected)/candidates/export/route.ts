import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { toCsv, csvResponse } from "@/lib/csv";
import { parseCandidateFilters } from "../../_shared/candidate-filters";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = new URL(request.url).searchParams;
  const filters = parseCandidateFilters({
    q: searchParams.get("q") ?? undefined,
    trade: searchParams.get("trade") ?? undefined,
    country: searchParams.get("country") ?? undefined,
    min_exp: searchParams.get("min_exp") ?? undefined,
    max_exp: searchParams.get("max_exp") ?? undefined,
    status: searchParams.getAll("status"),
    assigned: searchParams.get("assigned") ?? undefined,
  });

  let query = supabaseAdmin
    .from("candidates")
    .select(
      "full_name, email, phone, trade, experience_years, preferred_country, score, status, assigned_admin_name, created_at",
    )
    .order("created_at", { ascending: false });

  if (filters.q) {
    query = query.or(
      `full_name.ilike.%${filters.q}%,phone.ilike.%${filters.q}%,email.ilike.%${filters.q}%`,
    );
  }
  if (filters.trade) query = query.eq("trade", filters.trade);
  if (filters.country) query = query.eq("preferred_country", filters.country);
  if (filters.minExp) query = query.gte("experience_years", Number(filters.minExp));
  if (filters.maxExp) query = query.lte("experience_years", Number(filters.maxExp));
  if (filters.status.length > 0) query = query.in("status", filters.status);
  if (filters.assigned) query = query.eq("assigned_admin_name", filters.assigned);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const columns = [
    "full_name",
    "email",
    "phone",
    "trade",
    "experience_years",
    "preferred_country",
    "score",
    "status",
    "assigned_admin_name",
    "created_at",
  ];
  const csv = toCsv(data ?? [], columns);
  return csvResponse(csv, `candidates-${new Date().toISOString().slice(0, 10)}.csv`);
}
