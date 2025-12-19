// src/app/[locale]/shop/error.tsx
'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '~/components/ui/button';
import { AlertCircle, RefreshCw, Home, Database } from 'lucide-react';
import Link from 'next/link';

export default function ShopError({
	error,
	reset,
}: {
	error: Error & { digest?: string; cause?: any };
	reset: () => void;
}) {
	const t = useTranslations('common.errors');

	useEffect(() => {
		console.error('Shop error:', error);
	}, [error]);

	// Detect database connection errors
	// const isDbError = error.message?.includes('ECONNREFUSED') ||
	// 	error.message?.includes('connection') ||
	// 	error.message?.includes('database');

	const errorMessage = error.message?.toLowerCase() || '';
	const causeMessage = JSON.stringify(error.cause || '').toLowerCase();

	const isDbError =
		errorMessage.includes('econnrefused') ||
		errorMessage.includes('database') ||
		errorMessage.includes('connection') ||
		causeMessage.includes('econnrefused') ||
		error.digest?.includes('database'); // Next.js digest sometimes helps

	return (
		<main className="min-h-[80vh] flex items-center justify-center p-4">
			<div className="max-w-md w-full text-center space-y-8">
				<div className="flex justify-center">
					{isDbError ? (
						<div className="p-6 rounded-full bg-destructive/10">
							<Database className="h-12 w-12 text-destructive" />
						</div>
					) : (
						<div className="p-6 rounded-full bg-destructive/10">
							<AlertCircle className="h-12 w-12 text-destructive" />
						</div>
					)}
				</div>

				<div className="space-y-3">
					<h1 className="text-2xl md:text-3xl font-display font-light">
						{isDbError ? t('shop.dbError.title') : t('error.title')}
					</h1>
					<p className="text-muted-foreground font-display font-light">
						{isDbError ? t('shop.dbError.description') : t('error.description')}
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
					<Link href="/">
						<Button
							variant="outline"
							size="lg"
							className="rounded-full w-full sm:w-auto"
						>
							<Home className="mr-2 h-4 w-4" />
							{t('error.goHome')}
						</Button>
					</Link>
				</div>

				{/* Helpful Links */}
				{isDbError && (
					<div className="pt-4 space-y-2">
						<p className="text-sm text-muted-foreground font-display font-light">
							{t('shop.dbError.meanwhile')}
						</p>
						<div className="flex flex-wrap gap-2 justify-center">
							<Link href="/calculator">
								<Button variant="ghost" size="sm">
									{t('notFound.links.calculator')}
								</Button>
							</Link>
							<Link href="/about">
								<Button variant="ghost" size="sm">
									About Us
								</Button>
							</Link>
							<Link href="/contact">
								<Button variant="ghost" size="sm">
									Contact
								</Button>
							</Link>
						</div>
					</div>
				)}

				{/* Dev info */}
				{process.env.NODE_ENV === 'development' && (
					<details className="mt-8 text-left">
						<summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground font-display">
							{t('error.details')}
						</summary>
						<pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto font-mono max-h-40">
							{error.message}
							{'\n\n'}
							{error.stack}
						</pre>
					</details>
				)}
			</div>
		</main>
	);
}