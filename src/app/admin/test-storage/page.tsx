// src/app/admin/test-storage/page.tsx
"use client";

import { useState } from "react";
import { supabase } from "~/lib/supabase";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Upload, Check, X, Loader2 } from "lucide-react";

export default function TestStoragePage() {
	const [status, setStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
	const [message, setMessage] = useState("");
	const [uploadedUrl, setUploadedUrl] = useState("");

	const testConnection = async () => {
		setStatus("testing");
		setMessage("Checking connection to Supabase Storage...");

		try {
			// Test 1: List buckets
			const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

			if (bucketsError) {
				throw new Error(`Cannot list buckets: ${bucketsError.message}`);
			}

			setMessage(`✓ Connected! Found ${buckets?.length ?? 0} bucket(s)`);

			// Test 2: Check if our bucket exists
			const galleryBucket = buckets?.find(b => b.name === 'aquadecor-gallery');

			if (!galleryBucket) {
				setMessage("⚠️ Bucket 'aquadecor-gallery' not found. Create it in Supabase dashboard!");
				setStatus("error");
				return;
			}

			setMessage("✓ Bucket 'aquadecor-gallery' exists!");

			// Test 3: List files in bucket
			const { data: files, error: filesError } = await supabase.storage
				.from('aquadecor-gallery')
				.list('test', { limit: 5 });

			if (filesError) {
				throw new Error(`Cannot list files: ${filesError.message}`);
			}

			setMessage(`✓ All checks passed! ${files?.length ?? 0} file(s) in 'test' folder`);
			setStatus("success");
		} catch (err) {
			setStatus("error");
			setMessage(err instanceof Error ? err.message : "Unknown error");
		}
	};

	const testUpload = async () => {
		setStatus("testing");
		setMessage("Creating test file...");

		try {
			// Create a tiny test file
			const testFile = new Blob(["Hello from Aquadecor admin!"], { type: "text/plain" });
			const fileName = `test-${Date.now()}.txt`;

			setMessage("Uploading to Supabase Storage...");

			// Upload to Supabase
			const { data, error } = await supabase.storage
				.from('aquadecor-gallery')
				.upload(`test/${fileName}`, testFile, {
					cacheControl: '3600',
					upsert: false
				});

			if (error) {
				throw new Error(`Upload failed: ${error.message}`);
			}

			// Get public URL
			const { data: { publicUrl } } = supabase.storage
				.from('aquadecor-gallery')
				.getPublicUrl(data.path);

			setUploadedUrl(publicUrl);
			setMessage(`✓ File uploaded successfully! Path: ${data.path}`);
			setStatus("success");
		} catch (err) {
			setStatus("error");
			setMessage(err instanceof Error ? err.message : "Unknown error");
		}
	};

	return (
		<div className="space-y-8 max-w-3xl">
			<div className="space-y-2">
				<h1 className="text-4xl font-display font-extralight tracking-tight">
					Storage Test
				</h1>
				<p className="text-muted-foreground font-display font-light text-lg">
					Test your Supabase Storage connection
				</p>
			</div>

			{/* Test Connection */}
			<Card className="border-2">
				<CardHeader>
					<CardTitle className="font-display font-normal">
						1. Test Connection
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm text-muted-foreground font-display font-light">
						Check if we can connect to Supabase and see the bucket
					</p>
					<Button
						onClick={testConnection}
						disabled={status === "testing"}
						className="rounded-full"
					>
						{status === "testing" ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Testing...
							</>
						) : (
							"Test Connection"
						)}
					</Button>
				</CardContent>
			</Card>

			{/* Test Upload */}
			<Card className="border-2">
				<CardHeader>
					<CardTitle className="font-display font-normal">
						2. Test Upload
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm text-muted-foreground font-display font-light">
						Upload a test file to verify write permissions
					</p>
					<Button
						onClick={testUpload}
						disabled={status === "testing"}
						className="rounded-full"
					>
						{status === "testing" ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Uploading...
							</>
						) : (
							<>
								<Upload className="mr-2 h-4 w-4" />
								Upload Test File
							</>
						)}
					</Button>
				</CardContent>
			</Card>

			{/* Status Display */}
			{message && (
				<Card className={`border-2 ${status === "success" ? "border-green-500/50 bg-green-500/5" :
						status === "error" ? "border-red-500/50 bg-red-500/5" :
							"border-blue-500/50 bg-blue-500/5"
					}`}>
					<CardHeader>
						<div className="flex items-center gap-2">
							{status === "testing" && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
							{status === "success" && <Check className="h-5 w-5 text-green-500" />}
							{status === "error" && <X className="h-5 w-5 text-red-500" />}
							<CardTitle className="font-display font-normal">
								{status === "testing" && "Testing..."}
								{status === "success" && "Success!"}
								{status === "error" && "Error"}
								{status === "idle" && "Ready"}
							</CardTitle>
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-sm font-display font-light whitespace-pre-wrap">
							{message}
						</p>
						{uploadedUrl && (
							<div className="mt-4 p-3 rounded-lg bg-muted">
								<p className="text-xs text-muted-foreground font-display font-light mb-1">
									Public URL:
								</p>
								<a
									href={uploadedUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-xs text-primary hover:underline font-mono break-all"
								>
									{uploadedUrl}
								</a>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* Environment Info */}
			<Card className="border-2">
				<CardHeader>
					<CardTitle className="font-display font-normal">
						Environment Check
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3 text-sm">
					<div className="flex justify-between items-center">
						<span className="text-muted-foreground font-display font-light">
							Supabase URL
						</span>
						<Badge variant="outline" className="font-mono text-xs">
							{process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Set" : "✗ Missing"}
						</Badge>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-muted-foreground font-display font-light">
							Publishable Key
						</span>
						<Badge variant="outline" className="font-mono text-xs">
							{process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? "✓ Set" : "✗ Missing"}
						</Badge>
					</div>
				</CardContent>
			</Card>

			{/* Instructions */}
			<Card className="border-2 bg-muted/30">
				<CardHeader>
					<CardTitle className="font-display font-normal">
						Setup Checklist
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="space-y-2 text-sm font-display font-light">
						<p className="font-normal">Before testing:</p>
						<ol className="list-decimal list-inside space-y-2 ml-4">
							<li>Create bucket in Supabase dashboard: <code className="px-1 py-0.5 bg-muted rounded">aquadecor-gallery</code></li>
							<li>Set bucket to <strong>Public</strong></li>
							<li>Add env vars to <code className="px-1 py-0.5 bg-muted rounded">.env.local</code></li>
							<li>Restart dev server</li>
							<li>Click "Test Connection" above</li>
						</ol>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}