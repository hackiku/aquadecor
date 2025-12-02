// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { env } from '~/env';

// Client-side Supabase (uses publishable key)
export const supabase = createClient(
	env.NEXT_PUBLIC_SUPABASE_URL,
	env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

// Server-side Supabase (uses secret key - more permissions)
export const supabaseAdmin = createClient(
	env.NEXT_PUBLIC_SUPABASE_URL,
	env.SUPABASE_SECRET_API_KEY
);