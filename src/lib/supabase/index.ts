// src/lib/supabase/index.ts
// Central export point for all Supabase utilities

export { createClient as createBrowserClient, supabase, supabaseClient } from './client';
export { createClient as createServerClient, createAdminClient, supabaseServer, supabaseAdmin } from './server';
export * from './storage';