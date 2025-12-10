// src/lib/supabase/client.ts

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { env } from '~/env';

// Client-side Supabase (uses publishable key)
// Safe to use in "use client" components
// Can read from public buckets, but uploads require RLS policies
export const supabase = createSupabaseClient(
	env.NEXT_PUBLIC_SUPABASE_URL,
	env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

// Re-export for consistency
export const supabaseClient = supabase;
export const createClient = createSupabaseClient;