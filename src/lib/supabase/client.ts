// src/lib/supabase/client.ts
// Browser-side Supabase client using @supabase/ssr
// Use in "use client" components

import { createBrowserClient } from '@supabase/ssr';
import { env } from '~/env';

export function createClient() {
	return createBrowserClient(
		env.NEXT_PUBLIC_SUPABASE_URL,
		env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
	);
}

// Legacy singleton export for backward compatibility
export const supabase = createClient();
export const supabaseClient = supabase;