// src/lib/supabase/client.ts

import { createClient } from '@supabase/supabase-js';
import { env } from '~/env';

// Client-side Supabase (uses publishable key)
// Safe to use in "use client" components
// Can read from public buckets, but uploads require RLS policies
export const supabase = createClient(
	env.NEXT_PUBLIC_SUPABASE_URL,
	env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);