// src/app/admin/test-storage/page.tsx
"use client";

import { useState } from "react";
import { supabase } from "~/lib/supabase/client";
import { api } from "~/trpc/react";
import { ImageUpload } from "~/components/media/SupabaseImageUpload";
import { StorageGallery } from "./_components/StorageGallery";
import { DebugEnv } from "./_components/DebugEnv";
import { ClientDebug } from "./_components/ClientDebug";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Loader2, Check, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

// Bucket to test with
const BUCKET_NAME = "aquadecor-gallery";

type TestStatus = "idle" | "testing" | "success" | "error";

export default function TestStoragePage() {
	const [connectionStatus, setConnectionStatus] = useState<TestStatus>("idle");
	const [connectionMessage, setConnectionMessage] = useState("");
	const [refreshKey, setRefreshKey] = useState(0);

	// Test basic connection
	const testConnection = async () => {
		setConnectionStatus("testing");
		setConnectionMessage("Checking Supabase Storage connection...");

		try {
			// Test: Try to list files (works with publishable key for public buckets)
			const { data: files, error: filesError } = await supabase.storage
				.from(BUCKET_NAME)
				.list('', { limit: 5 });

			if (filesError) {
				throw new Error(`Cannot list files: ${filesError.message}`);
			}

			setConnectionMessage(
				`✓ All checks passed!\n` +
				`✓ Connected to bucket '${BUCKET_NAME}'\n` +
				`✓ Found ${files?.length ?? 0} file(s) in bucket`
			);
			setConnectionStatus("success");
		} catch (err) {
			setConnectionStatus("error");
			setConnectionMessage(err instanceof Error ? err.message : "Unknown error");
		}
	};

	// IMPORTANT: This uses a SEPARATE test router (admin.supabaseTest)
	// Your production media.create router is UNTOUCHED and still uses old CDN
	const createTestImageMutation = api.admin.supabaseTest.testConnection.useQuery(
		undefined,
		{ enabled: false } // Don't auto-run
	);

	const handleUpload = async (
		file: File,
		metadata: { altText: string; productId?: string; sortOrder: number },
		uploadResult: { publicUrl: string; storagePath: string; dimensions: { width: number; height: number } }
	) => {
		// For now, just show success without saving to DB
		// Later you can create a test-specific table or add to real media table
		toast.success(
			<div className="space-y-1">
				<p className="font-display font-normal">Upload successful!</p>
				<p className="text-xs text-muted-foreground">
					File uploaded to Supabase Storage
				</p>
			</div>
		);

		// Log the result for inspection
		console.log("Supabase upload result:", {
			file: file.name,
			url: uploadResult.publicUrl,
			path: uploadResult.storagePath,
			dimensions: uploadResult.dimensions,
			metadata,
		});

		// Refresh gallery to show new image
		setRefreshKey(prev => prev + 1);
	};

	return (
		<div className="space-y-8 max-w-6xl">
			{/* Warning banner */}
			<div className="border-2 border-yellow-500/50 bg-yellow-500/5 rounded-lg p-4">
				<div className="flex items-start gap-3">
					<AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
					<div className="space-y-1">
						<p className="text-sm font-display font-normal text-yellow-500">
							Testing Environment
						</p>
						<p className="text-xs text-muted-foreground font-display font-light">
							This page tests Supabase Storage only. Your production media system (old CDN)
							is completely untouched and continues to work normally.
						</p>
					</div>
				</div>
			</div>

			<div className="space-y-2">
				<h1 className="text-4xl font-display font-extralight tracking-tight">
					Supabase Storage Test
				</h1>
				<p className="text-muted-foreground font-display font-light text-lg">
					Test Supabase Storage connection, RLS policies, and uploads
				</p>
			</div>

			{/* Debug: Show actual env values */}
			<Card className="border-2 border-yellow-500/50 bg-yellow-500/5">
				<CardHeader>
					<CardTitle className="font-display font-normal text-sm">
						🛠 Debug: Environment Variables & Admin Connection
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<DebugEnv />
					<ClientDebug />
				</CardContent>
			</Card>

			{/* Step 1: Connection Test */}
			<Card className="border-2">
				<CardHeader>
					<CardTitle className="font-display font-normal">
						Step 1: Test Connection
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm text-muted-foreground font-display font-light">
						Check if we can connect to Supabase and read from the bucket
					</p>
					<Button
						onClick={testConnection}
						disabled={connectionStatus === "testing"}
						className="rounded-full"
					>
						{connectionStatus === "testing" ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Testing...
							</>
						) : (
							"Test Connection"
						)}
					</Button>

					{connectionMessage && (
						<div className={`p-4 rounded-lg border-2 ${connectionStatus === "success" ? "border-green-500/50 bg-green-500/5" :
								connectionStatus === "error" ? "border-red-500/50 bg-red-500/5" :
									"border-blue-500/50 bg-blue-500/5"
							}`}>
							<div className="flex items-start gap-2">
								{connectionStatus === "testing" && <Loader2 className="h-5 w-5 animate-spin text-blue-500 flex-shrink-0" />}
								{connectionStatus === "success" && <Check className="h-5 w-5 text-green-500 flex-shrink-0" />}
								{connectionStatus === "error" && <X className="h-5 w-5 text-red-500 flex-shrink-0" />}
								<p className="text-sm font-display font-light whitespace-pre-wrap">
									{connectionMessage}
								</p>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Step 2: View Files */}
			<Card className="border-2">
				<CardHeader>
					<CardTitle className="font-display font-normal">
						Step 2: View Files (Public Read)
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm text-muted-foreground font-display font-light">
						Public buckets allow anyone to read files. This should work without RLS policies.
					</p>
					<StorageGallery key={refreshKey} bucket={BUCKET_NAME} />
				</CardContent>
			</Card>

			{/* Step 3: Upload Test */}
			<Card className="border-2">
				<CardHeader>
					<div className="flex items-start justify-between">
						<div className="space-y-1">
							<CardTitle className="font-display font-normal">
								Step 3: Upload Test (Requires RLS Policy)
							</CardTitle>
							<p className="text-sm text-muted-foreground font-display font-light">
								Uploads require an RLS policy. You'll see "row-level security policy" error until you add one.
							</p>
						</div>
						<Badge variant="outline" className="font-mono text-xs">
							RLS Required
						</Badge>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* RLS Policy Instructions */}
					<div className="p-4 rounded-lg bg-muted border-2">
						<p className="text-sm font-display font-normal mb-2">
							To enable uploads, add this RLS policy in Supabase:
						</p>
						<pre className="text-xs bg-black/50 text-white p-3 rounded overflow-x-auto">
							{`CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (
  bucket_id = '${BUCKET_NAME}'
);`}
						</pre>
						<p className="text-xs text-muted-foreground font-display font-light mt-2">
							Go to: Storage → {BUCKET_NAME} → Policies → New Policy
						</p>
					</div>

					<ImageUpload
						onUpload={handleUpload}
						bucket={BUCKET_NAME}
					/>
				</CardContent>
			</Card>

			{/* Environment Info */}
			<Card className="border-2 bg-muted/30">
				<CardHeader>
					<CardTitle className="font-display font-normal">
						Environment Check
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3 text-sm">
					<div className="flex justify-between items-center">
						<span className="text-muted-foreground font-display font-light">
							NEXT_PUBLIC_SUPABASE_URL
						</span>
						<Badge variant="outline" className="font-mono text-xs">
							{process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Set" : "✗ Missing"}
						</Badge>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-muted-foreground font-display font-light">
							NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
						</span>
						<Badge variant="outline" className="font-mono text-xs">
							{process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? "✓ Set" : "✗ Missing"}
						</Badge>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}