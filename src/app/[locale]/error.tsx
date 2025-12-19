// src/app/[locale]/error.tsx
'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '~/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const t = useTranslations('common.errors');

	useEffect(() => {
		// Log error to monitoring service (Sentry, etc)
		console.error('Global error:', error);
	}, [error]);

	return (
		<main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-muted/30 to-background">
			<div className="max-w-md w-full text-center space-y-8">
				{/* Icon */}
				<div className="relative">
					<div className="absolute inset-0 bg-destructive/20 blur-3xl rounded-full" />
					<AlertCircle className="relative h-20 w-20 text-destructive mx-auto" strokeWidth={1.5} />
				</div>

				{/* Content */}
				<div className="space-y-3">
					<h1 className="text-3xl md:text-4xl font-display font-light">
						{t('error.title')}
					</h1>
					<p className="text-muted-foreground font-display font-light leading-relaxed">
						{t('error.description')}
					</p>
				</div>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
					<Button
						onClick={reset}
						size="lg"
						className="rounded-full"
					>
						<RefreshCw className="mr-2 h-4 w-4" />
						{t('error.retry')}
					</Button>
					<Button
						variant="outline"
						size="lg"
						onClick={() => window.location.href = '/'}
						className="rounded-full"
					>
						<Home className="mr-2 h-4 w-4" />
						{t('error.goHome')}
					</Button>
				</div>

				{/* Dev info */}
				{process.env.NODE_ENV === 'development' && (
					<details className="mt-8 text-left">
						<summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground font-display">
							{t('error.details')}
						</summary>
						<pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto font-mono">
							{error.message}
							{error.stack}
						</pre>
					</details>
				)}
			</div>
		</main>
	);
}