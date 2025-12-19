// src/app/global-error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '~/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Global error boundary - catches errors in root layout
 * Must be a client component and must render its own <html> and <body>
 * This is a last resort for catastrophic failures
 */
export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error('Global catastrophic error:', error);
	}, [error]);

	return (
		<html>
			<body>
				<div className="min-h-screen flex items-center justify-center p-4 bg-black text-white">
					<div className="max-w-md w-full text-center space-y-8">
						{/* Icon */}
						<div className="relative">
							<AlertTriangle className="h-20 w-20 text-red-500 mx-auto" strokeWidth={1.5} />
						</div>

						{/* Content */}
						<div className="space-y-3">
							<h1 className="text-3xl font-light">
								Critical Error
							</h1>
							<p className="text-gray-400 font-light leading-relaxed">
								Something went seriously wrong. We're working on it.
							</p>
						</div>

						{/* Actions */}
						<div className="flex flex-col gap-3 justify-center pt-4">
							<Button
								onClick={reset}
								size="lg"
								className="rounded-full"
							>
								<RefreshCw className="mr-2 h-4 w-4" />
								Try Again
							</Button>
							<Button
								variant="outline"
								size="lg"
								onClick={() => window.location.href = '/'}
								className="rounded-full"
							>
								Go Home
							</Button>
						</div>

						{/* Dev info */}
						{process.env.NODE_ENV === 'development' && (
							<details className="mt-8 text-left">
								<summary className="cursor-pointer text-sm text-gray-400 hover:text-white">
									Error details
								</summary>
								<pre className="mt-2 p-4 bg-gray-900 rounded-lg text-xs overflow-auto">
									{error.message}
									{error.stack}
								</pre>
							</details>
						)}
					</div>
				</div>
			</body>
		</html>
	);
}