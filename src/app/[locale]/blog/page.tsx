// src/app/[locale]/blog/page.tsx

import { BlogCard } from "~/components/blog/BlogCard";
import { getBlogPosts } from "~/lib/strapi/queries";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { generateSEOMetadata } from "~/i18n/seo/hreflang";
import { routing } from "~/i18n/routing";
import type { Metadata } from "next";

type Props = {
	params: Promise<{ locale: string }>;
};

// ========================================
// SEO METADATA
// ========================================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'blog' });

	return generateSEOMetadata({
		currentLocale: locale,
		path: '/blog',
		title: t('hero.title'),
		description: t('hero.subtitle'),
		type: 'website',
	});
}

// ========================================
// STATIC GENERATION
// ========================================
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

// Revalidate every hour
export const revalidate = 3600;

export default async function BlogPage({ params }: Props) {
	const { locale } = await params;

	// Enable static rendering
	setRequestLocale(locale);

	// Get translations
	const t = await getTranslations({ locale, namespace: 'blog' });

	// Fetch posts
	const posts = await getBlogPosts();

	// ========================================
	// JSON-LD for Blog CollectionPage
	// ========================================
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aquadecorbackgrounds.com';
	const canonicalUrl = `${baseUrl}/${locale}/blog`;

	const collectionJsonLd = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		"name": t('hero.title'),
		"description": t('hero.subtitle'),
		"url": canonicalUrl,
		"mainEntity": {
			"@type": "ItemList",
			"itemListElement": posts.map((post, index) => ({
				"@type": "ListItem",
				"position": index + 1,
				"url": `${baseUrl}/${locale}/blog/${post.slug}`
			}))
		}
	};

	return (
		<main className="min-h-screen">
			{/* Inject JSON-LD */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
			/>

			{/* Hero */}
			<section className="relative pt-16 md:pt-24 pb-16 md:pb-24 bg-linear-to-b from-muted/50 to-transparent">
				<div className="container px-4 max-w-7xl mx-auto">
					<div className="space-y-6">
						<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
							<span className="text-sm text-primary font-display font-medium">
								{t('hero.badge')}
							</span>
						</div>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extralight tracking-tight">
							{t('hero.title')}
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground font-display font-light max-w-3xl leading-relaxed">
							{t('hero.subtitle')}
						</p>
					</div>
				</div>
			</section>

			{/* Blog Grid */}
			<section className="pb-16 md:pb-24">
				<div className="container px-4 max-w-7xl mx-auto">
					{posts.length > 0 ? (
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
							{posts.map((post) => (
								<BlogCard key={post.id} post={post} />
							))}
						</div>
					) : (
						<div className="text-center py-12">
							<p className="text-lg text-muted-foreground font-display font-light">
								{t('empty.description')}
							</p>
						</div>
					)}
				</div>
			</section>
		</main>
	);
}