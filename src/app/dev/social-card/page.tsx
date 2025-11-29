// src/app/test-social-card/page.tsx
import { SocialCard } from "~/components/social/SocialCard";
import type { SocialMention } from "~/data/social-mentions";

// Test data
const testMentions: SocialMention[] = [
	{
		id: "tiktok-six-foot-background-review",
		platform: "tiktok",
		url: "https://www.tiktok.com/@aquadecorbackgrounds/video/7530031215806631174",
		videoFile: "/media/social/tiktok/tiktok-six-foot-background-review.mp4",
		thumbnail: "/media/social/tiktok/tiktok-six-foot-background-review-thumb.jpg",
		caption: "Customer showcase - 6-foot background gift from Joey",
		author: "aquadecorbackgrounds",
		aspectRatio: "portrait",
		likes: 11,
		views: 839,
		isFeatured: true,
	},
	{
		id: "youtube-test",
		platform: "youtube",
		url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		thumbnail: "/media/images/3d-backgrounds_500px.webp", // Placeholder
		caption: "Installation guide - A Models rocky backgrounds",
		author: "Aquadecor Backgrounds",
		aspectRatio: "landscape",
		views: 45000,
	},
	{
		id: "instagram-test",
		platform: "instagram",
		url: "https://www.instagram.com/p/ABC123/",
		thumbnail: "/media/images/additional-items_500px.webp", // Placeholder
		caption: "Rocky background perfect for African cichlids",
		author: "aquadecorbackgrounds",
		aspectRatio: "square",
		likes: 2400,
	},
];

export default function TestSocialCardPage() {
	return (
		<main className="py-12 space-y-12 px-4">
			{/* Header */}
			<div className="text-center space-y-4">
				<h1 className="text-4xl font-display font-light">
					SocialCard Component Test
				</h1>
				<p className="text-muted-foreground font-display font-light max-w-2xl mx-auto">
					Click cards to open modal with live embed + follow CTA.
					Videos play inline on click. Modal loads embed on-demand.
				</p>
			</div>

			{/* Test Cases */}
			<div className="space-y-16">
				{/* Single Card - Default */}
				<section className="space-y-4">
					<h2 className="text-2xl font-display font-normal">
						Default Card (Portrait)
					</h2>
					<div className="max-w-sm">
						<SocialCard mention={testMentions[0]!} />
					</div>
				</section>

				{/* Multiple Cards - Grid */}
				<section className="space-y-4">
					<h2 className="text-2xl font-display font-normal">
						Grid Layout (Mixed Aspect Ratios)
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{testMentions.map((mention) => (
							<SocialCard key={mention.id} mention={mention} />
						))}
					</div>
				</section>

				{/* Masonry Layout */}
				<section className="space-y-4">
					<h2 className="text-2xl font-display font-normal">
						Masonry Layout (Like SocialGrid)
					</h2>
					<div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
						{testMentions.map((mention) => (
							<SocialCard key={mention.id} mention={mention} />
						))}
					</div>
				</section>

				{/* Without Embed Button */}
				<section className="space-y-4">
					<h2 className="text-2xl font-display font-normal">
						Without Embed Button (Simple Click to Modal)
					</h2>
					<div className="max-w-sm">
						<SocialCard
							mention={testMentions[0]!}
							showEmbedButton={false}
						/>
					</div>
				</section>
			</div>

			{/* Instructions */}
			<section className="border-t pt-12 space-y-4">
				<h2 className="text-2xl font-display font-normal">
					How It Works
				</h2>
				<div className="prose prose-neutral dark:prose-invert max-w-none">
					<ol className="space-y-3">
						<li>
							<strong>Fast initial load:</strong> Only thumbnail/video loads (no embeds)
						</li>
						<li>
							<strong>Click to play:</strong> Videos play inline without modal
						</li>
						<li>
							<strong>Click card:</strong> Opens modal with live embed
						</li>
						<li>
							<strong>Embed loads on-demand:</strong> 300ms delay after modal opens
						</li>
						<li>
							<strong>Follow CTA:</strong> Direct link to platform profile
						</li>
					</ol>
				</div>
			</section>
		</main>
	);
}