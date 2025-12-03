// src/lib/supabase/server.ts
// Server-side Supabase client with admin privileges
// Use in Server Components, API Routes, Server Actions, Cron Jobs
// BYPASSES RLS - use with caution!

import { createClient } from '@supabase/supabase-js';
import { env } from '~/env';

// Admin client with full permissions (server-side only)
export const supabaseAdmin = createClient(
	env.NEXT_PUBLIC_SUPABASE_URL,
	env.SUPABASE_SECRET_API_KEY, // Service role key - bypasses RLS
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	}
);

// Re-export for convenience
export { supabaseAdmin as supabaseServer };