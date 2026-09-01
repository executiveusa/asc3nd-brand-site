import { createClient } from "@supabase/supabase-js";

const fallbackUrl = "https://cyxdevcjycmffhmwxojh.supabase.co";
const fallbackPublishableKey = "sb_publishable_PoqI-3PsCqewtJWJ0Z73Ag_5hIE0oKI";

export function createAsc3ndBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackUrl;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || fallbackPublishableKey;

  return createClient(url, publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}
