// src/components/blog/BlogCard.tsx

import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import type { BlogPostPreview } from "~/lib/strapi/types";

interface BlogCardProps {
	post: BlogPostPreview;
}

function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export function BlogCard({ post }: BlogCardProps) {
	return (
		<Link
			href={`/blog/${post.slug}`}
			className="group block h-full"
		>
			<article className="h-full bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] flex flex-col">
				{/* Image */}
				<div className="relative aspect-video overflow-hidden">
					<Image
						src={post.cover.url}
						alt={post.cover.alternativeText || post.title}
						fill
						className="object-cover group-hover:scale-105 transition-transform duration-500"
						sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
					/>
					{/* Reading Time Badge */}
					<div className="absolute bottom-3 right-3">
						<div className="flex items-center gap-1.5 px-3 py-1.5 bg-background/90 backdrop-blur-sm rounded-full">
							<Clock className="h-3 w-3 text-primary" />
							<span className="text-xs font-display font-medium">
								{post.reading_time} min read
							</span>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="p-6 flex-1 flex flex-col">
					{/* Date */}
					<div className="flex items-center gap-1.5 mb-3">
						<Calendar className="h-3 w-3 text-muted-foreground" />
						<time
							dateTime={post.publishedAt}
							className="text-xs text-muted-foreground font-display font-light"
						>
							{formatDate(post.publishedAt)}
						</time>
					</div>

					{/* Title */}
					<h2 className="text-xl md:text-2xl font-display font-light mb-3 group-hover:text-primary transition-colors line-clamp-2">
						{post.title}
					</h2>

					{/* Description */}
					<p className="text-sm text-muted-foreground font-display font-light leading-relaxed line-clamp-3 flex-1">
						{post.description}
					</p>

					{/* Read More Link */}
					<div className="mt-4 pt-4 border-t border-border">
						<span className="text-sm text-primary font-display font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
							Read article
							<span className="text-lg">→</span>
						</span>
					</div>
				</div>
			</article>
		</Link>
	);
}