// src/lib/supabase/client.ts
// Browser-side Supabase client
// Use in "use client" components
// RLS policies apply

import { createClient } from '@supabase/supabase-js';
import { env } from '~/env';

export const supabase = createClient(
	env.NEXT_PUBLIC_SUPABASE_URL,
	env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

// Re-export for convenience
export { supabase as supabaseClient };