// src/app/admin/test-storage/_components/DebugEnv.tsx
"use client";

export function DebugEnv() {
	return (
		<div className="space-y-2 text-xs font-mono">
			<div className="flex justify-between">
				<span>NEXT_PUBLIC_SUPABASE_URL:</span>
				<span className="text-green-500">
					{process.env.NEXT_PUBLIC_SUPABASE_URL || "❌ MISSING"}
				</span>
			</div>
			<div className="flex justify-between">
				<span>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:</span>
				<span className="text-green-500">
					{process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
						? `${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.slice(0, 20)}...`
						: "❌ MISSING"
					}
				</span>
			</div>
		</div>
	);
}