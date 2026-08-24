import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

const RESULT_LIMIT = 5;

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ candidates: [], jobs: [], employers: [] });
  }

  const [{ data: candidates }, { data: jobs }, { data: employers }] =
    await Promise.all([
      supabaseAdmin
        .from("candidates")
        .select("id, full_name, trade")
        .or(`full_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`)
        .limit(RESULT_LIMIT),
      supabaseAdmin
        .from("jobs")
        .select("id, role_title, country")
        .or(`role_title.ilike.%${q}%,hiring_principal.ilike.%${q}%`)
        .limit(RESULT_LIMIT),
      supabaseAdmin
        .from("employer_profiles")
        .select("id, company_name")
        .ilike("company_name", `%${q}%`)
        .limit(RESULT_LIMIT),
    ]);

  return NextResponse.json({
    candidates: candidates ?? [],
    jobs: jobs ?? [],
    employers: employers ?? [],
  });
}
