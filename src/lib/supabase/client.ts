import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client. Sessions persist via cookies (not
// localStorage) so the same session is readable from server components.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
