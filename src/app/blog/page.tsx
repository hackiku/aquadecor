// src/app/blog/page.tsx

import { BlogCard } from "~/components/blog/BlogCard";
import { TEST_POSTS } from "~/lib/strapi/test-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Blog | Aquarium Tips & Stories",
	description: "Expert aquarium advice, installation guides, and stories from the Aquadecor team. Learn how to create the perfect aquatic habitat.",
	keywords: ["aquarium blog", "aquascaping tips", "3D backgrounds", "fish tank setup", "aquarium maintenance"],
};

export default function BlogPage() {
	// TODO: Replace with actual Strapi fetch
	// const posts = await fetchStrapi('/blogs', { ... })
	const posts = TEST_POSTS;

	return (
		<main className="min-h-screen">
			{/* Hero */}
			<section className="relative pt-32 md:pt-40 pb-16 md:pb-24 bg-linar-to-b from-muted/50 to-transparent">
				<div className="container px-4 max-w-7xl mx-auto">
					<div className="space-y-6">
						<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
							<span className="text-sm text-primary font-display font-medium">
								Aquarium Expertise
							</span>
						</div>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extralight tracking-tight">
							Aquadecor Blog
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground font-display font-light max-w-3xl leading-relaxed">
							Expert tips, installation guides, and stories from 20+ years of creating the world's most realistic aquarium backgrounds.
						</p>
					</div>
				</div>
			</section>

			{/* Blog Grid */}
			<section className="py-16 md:py-24">
				<div className="container px-4 max-w-7xl mx-auto">
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{posts.map((post) => (
							<BlogCard key={post.id} post={post} />
						))}
					</div>
				</div>
			</section>
		</main>
	);
}