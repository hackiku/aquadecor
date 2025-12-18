// src/app/[locale]/blog/[slug]/page.tsx

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Calendar, ArrowLeft } from "lucide-react";
import { getBlogPost } from "~/lib/strapi/queries";
import { BlogBody } from "~/components/blog/BlogBody";
// SEO
import { generateSEOMetadata } from "~/i18n/seo/hreflang";
import { generateArticleSchema } from "~/i18n/seo/json-ld";
import type { Metadata } from "next";

interface BlogPostPageProps {
	params: Promise<{
		slug: string;
		locale: string;
	}>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
	const { slug, locale } = await params;
	const post = await getBlogPost(slug);

	if (!post) return { title: "Post Not Found" };


	// TODO: When you have translations in Strapi, fetch them here 
	// and create a map: { de: `/blog/${post.localizations.de.slug}` }
	// For now, we assume slugs are same or handled by redirects

	return generateSEOMetadata({
		currentLocale: locale,
		path: `/blog/${slug}`,
		title: post.seo.metaTitle || post.title,
		description: post.seo.metaDescription || post.description,
		image: post.seo.shared_image?.file.url || post.cover.url,
		type: 'article',
	});
}

// Revalidate every hour
export const revalidate = 3600;

function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}


export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug, locale } = await params;
	const post = await getBlogPost(slug);

	if (!post) {
		notFound();
	}

	// Generate JSON-LD
	const articleJsonLd = generateArticleSchema(post, locale);

	return (
		<main className="min-h-screen">
			{/* Inject JSON-LD */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
			/>

			{/* Back Button */}
			<div className="container px-4 max-w-4xl mx-auto pt-32 pb-8">
				<Link
					href="/blog"
					className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-display font-light"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to blog
				</Link>
			</div>


			{/* Article Header */}
			<article className="pb-16 md:pb-24">
				<header className="container px-4 max-w-4xl mx-auto mb-12">
					{/* Meta Info */}
					<div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground font-display font-light">
						<div className="flex items-center gap-1.5">
							<Calendar className="h-4 w-4" />
							<time dateTime={post.publishedAt}>
								{formatDate(post.publishedAt)}
							</time>
						</div>
						<span>•</span>
						<div className="flex items-center gap-1.5">
							<Clock className="h-4 w-4" />
							<span>{post.reading_time} min read</span>
						</div>
						{post.updatedAt !== post.publishedAt && (
							<>
								<span>•</span>
								<span className="text-xs">
									Updated {formatDate(post.updatedAt)}
								</span>
							</>
						)}
					</div>

					{/* Title */}
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-extralight mb-6 leading-tight">
						{post.title}
					</h1>

					{/* Description */}
					<p className="text-lg md:text-xl text-muted-foreground font-display font-light leading-relaxed">
						{post.description}
					</p>
				</header>

				{/* Featured Image */}
				<div className="container px-4 max-w-5xl mx-auto mb-12">
					<div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-border">
						<Image
							src={post.cover.url}
							alt={post.cover.alternativeText || post.title}
							fill
							className="object-cover"
							priority
							sizes="(max-width: 1280px) 100vw, 1280px"
						/>
					</div>
					{post.cover.caption && (
						<p className="text-sm text-muted-foreground font-display font-light text-center mt-3">
							{post.cover.caption}
						</p>
					)}
				</div>

				{/* Article Body */}
				<div className="container px-4 max-w-3xl mx-auto">
					<div className="prose prose-lg dark:prose-invert max-w-none">
						<BlogBody content={post.body} />
					</div>

					{/* Share / CTA Section */}
					<div className="mt-16 pt-8 border-t border-border">
						<div className="bg-primary/5 backdrop-blur-sm rounded-2xl p-8 text-center">
							<h3 className="text-2xl font-display font-light mb-4">
								Ready to Transform Your Aquarium?
							</h3>
							<p className="text-muted-foreground font-display font-light mb-6">
								Explore our collection of handcrafted 3D backgrounds
							</p>
							<Link
								href="/shop"
								className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-display font-medium hover:bg-primary/90 transition-all hover:scale-105"
							>
								Browse Products
							</Link>
						</div>
					</div>
				</div>
			</article>
		</main>
	);
}