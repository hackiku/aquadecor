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
					<p className="text-lg text-muted-foreground font-display font-light leading-relaxed max-w-md mx-auto">
						{t('notFound.description')}
					</p>
				</div>

				{/* Quick Links */}
				<div className="grid sm:grid-cols-3 gap-4 pt-4">
					<Link
						href="/shop"
						className="group p-4 rounded-2xl border bg-card/50 hover:bg-card transition-all hover:scale-[1.02]"
					>
						<div className="text-sm font-display font-medium group-hover:text-primary transition-colors">
							{t('notFound.links.shop')}
						</div>
					</Link>
					<Link
						href="/calculator"
						className="group p-4 rounded-2xl border bg-card/50 hover:bg-card transition-all hover:scale-[1.02]"
					>
						<div className="text-sm font-display font-medium group-hover:text-primary transition-colors">
							{t('notFound.links.calculator')}
						</div>
					</Link>
					<Link
						href="/faq"
						className="group p-4 rounded-2xl border bg-card/50 hover:bg-card transition-all hover:scale-[1.02]"
					>
						<div className="text-sm font-display font-medium group-hover:text-primary transition-colors">
							{t('notFound.links.faq')}
						</div>
					</Link>
				</div>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
					<Button
						onClick={() => window.history.back()}
						variant="outline"
						size="lg"
						className="rounded-full"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						{t('notFound.goBack')}
					</Button>
					<Link href="/">
						<Button
							size="lg"
							className="rounded-full w-full sm:w-auto"
						>
							<Home className="mr-2 h-4 w-4" />
							{t('notFound.goHome')}
						</Button>
					</Link>
				</div>
			</div>
		</main>
	);
}