// src/lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';
import { env } from '~/env';

// Admin Supabase client (uses secret key)
// DO NOT use directly in client components - only in API routes or server actions
export const supabaseAdmin = createClient(
	env.NEXT_PUBLIC_SUPABASE_URL,
	env.SUPABASE_SECRET_API_KEY,
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	}
);