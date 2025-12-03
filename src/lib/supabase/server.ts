// src/lib/supabase/server.ts
// Server-side Supabase client using @supabase/ssr
// Use in Server Components, API Routes, Server Actions

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from '~/env';

export async function createClient() {
	const cookieStore = await cookies();

	return createServerClient(
		env.NEXT_PUBLIC_SUPABASE_URL,
		env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options)
						);
					} catch {
						// The `setAll` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing user sessions.
					}
				},
			},
		}
	);
}

// Admin client that bypasses RLS (uses service_role key)
export async function createAdminClient() {
	const cookieStore = await cookies();

	return createServerClient(
		env.NEXT_PUBLIC_SUPABASE_URL,
		env.SUPABASE_SECRET_API_KEY, // Service role key
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options)
						);
					} catch { }
				},
			},
		}
	);
}

// Legacy exports for backward compatibility
export const supabaseServer = createClient;
export const supabaseAdmin = createAdminClient;