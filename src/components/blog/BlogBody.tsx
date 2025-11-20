// src/components/blog/BlogBody.tsx

"use client";

import { BlocksRenderer, type BlocksContent } from "@strapi/blocks-react-renderer";
import Image from "next/image";
import Link from "next/link";

interface BlogBodyProps {
	content: BlocksContent;
}

export function BlogBody({ content }: BlogBodyProps) {
	if (!content) {
		return (
			<p className="text-muted-foreground font-display font-light">
				No content available.
			</p>
		);
	}

	return (
		<BlocksRenderer
			content={content}
			blocks={{
				paragraph: ({ children }) => (
					<p className="text-base md:text-lg text-muted-foreground font-display font-light leading-relaxed mb-6">
						{children}
					</p>
				),
				heading: ({ children, level }) => {
					const className = "font-display font-light mt-12 mb-6";
					switch (level) {
						case 1:
							return <h1 className={`${className} text-3xl md:text-4xl lg:text-5xl`}>{children}</h1>;
						case 2:
							return <h2 className={`${className} text-2xl md:text-3xl lg:text-4xl`}>{children}</h2>;
						case 3:
							return <h3 className={`${className} text-xl md:text-2xl lg:text-3xl`}>{children}</h3>;
						case 4:
							return <h4 className={`${className} text-lg md:text-xl`}>{children}</h4>;
						default:
							return <h5 className={`${className} text-base md:text-lg`}>{children}</h5>;
					}
				},
				list: ({ children, format }) => {
					const className = "font-display font-light space-y-2 my-6 ml-6";
					if (format === "ordered") {
						return <ol className={`${className} list-decimal`}>{children}</ol>;
					}
					return <ul className={`${className} list-disc`}>{children}</ul>;
				},
				link: ({ children, url }) => (
					<Link
						href={url}
						className="text-primary hover:underline font-display font-medium transition-colors inline-flex items-center gap-1"
						target={url.startsWith("http") ? "_blank" : undefined}
						rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
					>
						{children}
						{url.startsWith("http") && <span className="text-sm">→</span>}
					</Link>
				),
				image: ({ image }) => {
					if (!image.url) return null;
					return (
						<div className="my-8">
							<div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-border">
								<Image
									src={image.url}
									alt={image.alternativeText || ""}
									fill
									className="object-cover"
									sizes="(max-width: 768px) 100vw, 768px"
								/>
							</div>
							{image.caption && (
								<p className="text-sm text-muted-foreground font-display font-light text-center mt-3">
									{image.caption}
								</p>
							)}
						</div>
					);
				},
				quote: ({ children }) => (
					<blockquote className="my-8 pl-6 border-l-4 border-primary">
						<p className="text-lg md:text-xl font-display font-light italic text-foreground">
							{children}
						</p>
					</blockquote>
				),
				code: ({ children }) => (
					<pre className="my-6 p-4 bg-muted rounded-lg overflow-x-auto">
						<code className="text-sm font-mono">{children}</code>
					</pre>
				),
			}}
			modifiers={{
				bold: ({ children }) => <strong className="font-medium">{children}</strong>,
				italic: ({ children }) => <em className="italic">{children}</em>,
				underline: ({ children }) => <u>{children}</u>,
				strikethrough: ({ children }) => <s>{children}</s>,
				code: ({ children }) => (
					<code className="px-1.5 py-0.5 bg-muted rounded text-sm font-mono">
						{children}
					</code>
				),
			}}
		/>
	);
}