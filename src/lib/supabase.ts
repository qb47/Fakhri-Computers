import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase is configured entirely through Vite env vars. They live in
 *    · .env                      (local development, git-ignored)
 *    · Netlify → Site configuration → Environment variables   (production)
 *
 * Only the *public* anon key belongs here. It is safe to ship in the browser
 * because every table is protected by row-level security — the key can read
 * published listings, but it cannot read customer data or change anything
 * unless the visitor is signed in as an admin.
 */

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** False until the env vars are set, so the app can fall back to the sample data. */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

/** Throws a readable error instead of a null-deref when a call is made unconfigured. */
export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }
  return supabase;
}
