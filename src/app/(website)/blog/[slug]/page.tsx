// src/app/(website)/blog/[slug]/page.tsx
export const revalidate = 3600; // ISR: revalidate every hour

export async function generateStaticParams() {
	const posts = await db.query.blogPosts.findMany({
		where: isNotNull(blogPosts.publishedAt),
	});
	return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }) {
	const post = await db.query.blogPosts.findFirst({
		where: eq(blogPosts.slug, params.slug),
	});

	return (
		<article>
			<h1>{post.title[locale]}</h1>
			<div dangerouslySetInnerHTML={{ __html: post.content[locale] }} />
		</article>
	);
}
