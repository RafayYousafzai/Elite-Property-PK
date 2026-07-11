import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

// Static client that doesn't use cookies to avoid opting out of Next.js static cache/generation
export const createStaticClient = () =>
  createBrowserClient(supabaseUrl, supabaseKey);
