// src/components/blog/FeaturedArticles.tsx

import { BlogCard } from "./BlogCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getRecentBlogPosts } from "~/lib/strapi/queries";

interface FeaturedArticlesProps {
	limit?: number;
	showViewAll?: boolean;
	title?: string;
	description?: string;
}

export async function FeaturedArticles({
	limit = 3,
	showViewAll = true,
	title = "Latest from Our Blog",
	description = "Expert tips, guides, and inspiration for your aquarium",
}: FeaturedArticlesProps) {
	// Fetch real posts from Strapi
	let posts;
	try {
		posts = await getRecentBlogPosts(limit);
	} catch (error) {
		console.error("Error fetching blog posts:", error);
		posts = [];
	}

	// Don't render if no posts
	if (!posts || posts.length === 0) {
		return null;
	}

	return (
		<section className="py-16 md:py-24">
			<div className="container px-4">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
					<div className="max-w-2xl">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-tight mb-3">
							{title}
						</h2>
						<p className="text-lg text-muted-foreground font-display font-light">
							{description}
						</p>
					</div>

					{showViewAll && (
						<Link
							href="/blog"
							className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-display font-medium text-lg transition-colors group flex-shrink-0"
						>
							View all articles
							<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
						</Link>
					)}
				</div>

				{/* Blog Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
					{posts.map((post) => (
						<BlogCard key={post.id} post={post} />
					))}
				</div>
			</div>
		</section>
	);
}


