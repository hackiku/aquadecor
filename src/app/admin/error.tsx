// src/app/admin/error.tsx

"use client";

import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function AdminError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
			<Card className="border-2 max-w-2xl w-full">
				<CardHeader>
					<div className="flex items-center gap-3">
						<AlertCircle className="h-8 w-8 text-destructive" />
						<CardTitle className="font-display font-normal text-2xl">
							Something went wrong
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<p className="font-display font-light text-muted-foreground">
							An error occurred while loading this page. This might be because:
						</p>
						<ul className="list-disc list-inside space-y-1 font-display font-light text-sm text-muted-foreground pl-4">
							<li>The page is still under development</li>
							<li>There was a problem fetching data</li>
							<li>An unexpected error occurred</li>
						</ul>
					</div>

					{error.message && (
						<div className="p-4 rounded-lg bg-muted/50 border">
							<p className="text-sm font-mono text-muted-foreground">
								{error.message}
							</p>
						</div>
					)}

					<div className="flex items-center gap-3">
						<Button
							onClick={reset}
							variant="default"
							className="rounded-full font-display font-light"
						>
							Try again
						</Button>
						<Button
							asChild
							variant="outline"
							className="rounded-full font-display font-light"
						>
							<Link href="/admin">
								<Home className="mr-2 h-4 w-4" />
								Back to Dashboard
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}