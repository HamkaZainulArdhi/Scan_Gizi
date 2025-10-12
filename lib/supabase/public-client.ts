// lib/supabase/public-client.ts
import { createClient } from '@supabase/supabase-js';

export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: false }, // ⛔ Tanpa user login
  },
);
