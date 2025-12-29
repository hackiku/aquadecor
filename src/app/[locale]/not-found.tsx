// src/app/[locale]/not-found.tsx

'use client';

import { useTranslations } from 'next-intl';
import { Button } from '~/components/ui/button';
import { Search, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
	const t = useTranslations('common.errors');

	return (
		<main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-muted/30 to-background">
			<div className="max-w-2xl w-full text-center space-y-8">
				{/* 404 Display */}
				<div className="relative">
					<div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
					<div className="relative">
						<h1 className="text-[120px] md:text-[180px] font-display font-extralight text-primary/20 leading-none">
							404
						</h1>
						<div className="absolute inset-0 flex items-center justify-center">
							<Search className="h-16 w-16 text-primary/40" strokeWidth={1.5} />
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="space-y-4">
					<h2 className="text-3xl md:text-4xl font-display font-light">
						{t('notFound.title')}
					</h2>
					<p
						className="text-lg text-muted-foreground font-display font-light leading-relaxed max-w-md mx-auto"
						dangerouslySetInnerHTML={{ __html: t.raw('notFound.description') }}
					/>
				</div>

				{/* Quick Links */}
				<div className="flex flex-wrap gap-3 justify-center pt-4">
					<Link href="/">
						<Button
							size="lg"
							className="rounded-full cursor-pointer"
						>
							<Home className="mr-2 h-4 w-4" />
							{t('notFound.links.home')}
						</Button>
					</Link>
					<Link href="/shop">
						<Button
							variant="outline"
							size="lg"
							className="rounded-full cursor-pointer"
						>
							{t('notFound.links.shop')}
						</Button>
					</Link>
					<Link href="/calculator">
						<Button
							variant="outline"
							size="lg"
							className="rounded-full cursor-pointer"
						>
							{t('notFound.links.calculator')}
						</Button>
					</Link>
				</div>

				{/* Back Link */}
				<button
					onClick={() => window.history.back()}
					className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors pt-2"
				>
					<ArrowLeft className="h-4 w-4" />
					{t('notFound.goBack')}
				</button>
			</div>
		</main>
	);
}