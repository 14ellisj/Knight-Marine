const url = window.KM_SUPABASE_URL?.trim();
const key = window.KM_SUPABASE_PUBLISHABLE_KEY?.trim();

export const isSupabaseConfigured = Boolean(
  url &&
  key &&
  !url.includes("PASTE") &&
  !key.includes("PASTE")
);

export let supabase = null;

if (isSupabaseConfigured) {
  const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
  supabase = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
}

export const configurationMessage =
  "The secure stories service is not connected yet. Complete SUPABASE-SETUP.md before staff can publish.";
