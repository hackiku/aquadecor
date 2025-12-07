// src/app/api/admin/storage/test/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '~/lib/supabase/admin';

export async function GET() {
	try {
		// Test 1: List buckets (requires service_role key)
		const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets();

		if (bucketsError) {
			return NextResponse.json(
				{
					success: false,
					error: bucketsError.message,
					step: 'listBuckets'
				},
				{ status: 500 }
			);
		}

		// Test 2: Check specific bucket
		const galleryBucket = buckets?.find(b => b.name === 'aquadecor-gallery');
		const shopBucket = buckets?.find(b => b.name === 'aquadecor-shop');

		return NextResponse.json({
			success: true,
			buckets: buckets?.map(b => ({
				name: b.name,
				public: b.public,
				created_at: b.created_at
			})),
			details: {
				galleryBucket: galleryBucket ? {
					exists: true,
					public: galleryBucket.public
				} : { exists: false },
				shopBucket: shopBucket ? {
					exists: true,
					public: shopBucket.public
				} : { exists: false }
			}
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
}