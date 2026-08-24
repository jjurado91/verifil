import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { toCsv, csvResponse } from "@/lib/csv";

function toArray(value: string[]) {
  return value.length > 0 ? value : [];
}

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = new URL(request.url).searchParams;
  const statusFilter = toArray(searchParams.getAll("status"));
  const addedByFilter = toArray(searchParams.getAll("added_by"));
  const countryFilter = searchParams.get("country") ?? "";
  const categoryFilter = searchParams.get("category") ?? "";

  let query = supabaseAdmin
    .from("jobs")
    .select(
      "role_title, hiring_principal, country, category, subcategory, openings, status, added_by_name, added_by_role, created_at",
    )
    .order("created_at", { ascending: false });

  if (statusFilter.length > 0) query = query.in("status", statusFilter);
  if (addedByFilter.length > 0) query = query.in("added_by_role", addedByFilter);
  if (countryFilter) query = query.eq("country", countryFilter);
  if (categoryFilter) query = query.eq("category", categoryFilter);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const columns = [
    "role_title",
    "hiring_principal",
    "country",
    "category",
    "subcategory",
    "openings",
    "status",
    "added_by_name",
    "added_by_role",
    "created_at",
  ];
  const csv = toCsv(data ?? [], columns);
  return csvResponse(csv, `jobs-${new Date().toISOString().slice(0, 10)}.csv`);
}
