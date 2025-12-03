// src/app/admin/test-storage/_components/ClientDebug.tsx
"use client";

import React from "react";
import { useState } from "react";
import { supabase } from "~/lib/supabase";
import { Button } from "~/components/ui/button";

export function ClientDebug() {
	const [result, setResult] = useState<any>(null);

	const testClient = async () => {
		console.log("Supabase client config:", {
			// @ts-ignore - accessing internals for debug
			supabaseUrl: supabase.supabaseUrl,
			// @ts-ignore
			supabaseKey: supabase.supabaseKey?.slice(0, 20) + "...",
		});

		// Test 1: List buckets
		const { data: buckets, error } = await supabase.storage.listBuckets();

		setResult({
			buckets: buckets?.map(b => ({ name: b.name, public: b.public })),
			error: error?.message,
		});
	};

	return (
		<div className="space-y-4">
			<Button onClick={testClient}>Test Supabase Client</Button>
			{result && (
				<pre className="text-xs bg-black text-white p-4 rounded overflow-auto">
					{JSON.stringify(result, null, 2)}
				</pre>
			)}
		</div>
	);
}