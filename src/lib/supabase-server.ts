// src/lib/supabase-server.ts
// Server-side ONLY - do NOT import in client components!

import { createClient } from '@supabase/supabase-js';
import { env } from '~/env';

// Admin client with full permissions (server-side only)
export const supabaseAdmin = createClient(
	env.NEXT_PUBLIC_SUPABASE_URL!,
	env.SUPABASE_SECRET_API_KEY! // Secret key - server only!
);