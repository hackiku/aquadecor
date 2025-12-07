// src/app/admin/test-storage/_components/ClientDebug.tsx
"use client";

import React from "react";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export function ClientDebug() {
	const [result, setResult] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	const testClient = async () => {
		setLoading(true);
		try {
			// Call our API route which uses the admin client
			const response = await fetch('/api/admin/storage/test');
			const data = await response.json();
			setResult(data);
		} catch (error) {
			setResult({
				success: false,
				error: error instanceof Error ? error.message : 'Failed to fetch'
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			<Button onClick={testClient} disabled={loading}>
				{loading ? 'Testing...' : 'Test Supabase Admin Connection'}
			</Button>
			{result && (
				<pre className="text-xs bg-black text-white p-4 rounded overflow-auto">
					{JSON.stringify(result, null, 2)}
				</pre>
			)}
		</div>
	);
}