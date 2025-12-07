// src/server/api/routers/test/supabase-test.ts
// TEMPORARY TEST ROUTER - DELETE AFTER MIGRATION TO SUPABASE

import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "~/server/api/trpc";
import { supabaseAdmin } from "~/lib/supabase/admin";

export const supabaseTestRouter = createTRPCRouter({
	// Test connection to Supabase Storage
	testConnection: adminProcedure
		.query(async () => {
			try {
				const { data: buckets, error } = await supabaseAdmin.storage.listBuckets();

				if (error) {
					return {
						success: false,
						error: error.message,
					};
				}

				return {
					success: true,
					buckets: buckets?.map(b => ({
						name: b.name,
						public: b.public,
						created_at: b.created_at,
					})) ?? [],
				};
			} catch (error) {
				return {
					success: false,
					error: error instanceof Error ? error.message : 'Unknown error',
				};
			}
		}),

	// List files in a bucket
	listFiles: adminProcedure
		.input(z.object({
			bucket: z.string(),
			folder: z.string().default(''),
		}))
		.query(async ({ input }) => {
			try {
				const { data, error } = await supabaseAdmin.storage
					.from(input.bucket)
					.list(input.folder, {
						limit: 100,
						sortBy: { column: 'created_at', order: 'desc' }
					});

				if (error) {
					return {
						success: false,
						error: error.message,
						files: [],
					};
				}

				return {
					success: true,
					files: data ?? [],
				};
			} catch (error) {
				return {
					success: false,
					error: error instanceof Error ? error.message : 'Unknown error',
					files: [],
				};
			}
		}),

	// Get public URL for a file
	getPublicUrl: adminProcedure
		.input(z.object({
			bucket: z.string(),
			path: z.string(),
		}))
		.query(({ input }) => {
			const { data } = supabaseAdmin.storage
				.from(input.bucket)
				.getPublicUrl(input.path);

			return {
				publicUrl: data.publicUrl,
			};
		}),
});