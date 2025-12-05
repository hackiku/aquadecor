// src/app/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '~/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log error to monitoring service (Sentry, etc)
		console.error('Global error:', error);
	}, [error]);

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="max-w-md w-full text-center space-y-6">
				<div className="space-y-3">
					<AlertCircle className="h-16 w-16 text-destructive mx-auto" />
					<h2 className="text-2xl font-display font-normal">
						Something went wrong
					</h2>
					<p className="text-muted-foreground font-display font-light">
						We're having trouble loading this page. This usually resolves itself quickly.
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					<Button
						onClick={reset}
						className="rounded-full"
					>
						<RefreshCw className="mr-2 h-4 w-4" />
						Try Again
					</Button>
					<Button
						variant="outline"
						onClick={() => window.location.href = '/'}
						className="rounded-full"
					>
						Go Home
					</Button>
				</div>

				{process.env.NODE_ENV === 'development' && (
					<details className="mt-8 text-left">
						<summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
							Error details
						</summary>
						<pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto">
							{error.message}
						</pre>
					</details>
				)}
			</div>
		</div>
	);
}