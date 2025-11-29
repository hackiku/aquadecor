// src/app/dev/embeds/page.tsx
import { SocialVideoEmbed } from "~/components/social/SocialVideoEmbed";

export default function TestEmbedsPage() {
	const urls = [
		"https://www.tiktok.com/@aquadecorbackgrounds/video/7530031215806631174",
		"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		"https://www.instagram.com/aquadecor/reel/DRfYysFjV-w/",
	];

	return (
		<div className="container py-12 space-y-8">
			<h1 className="text-3xl font-display font-normal">Embed Tests</h1>

			{urls.map(url => (
				<div key={url} className="space-y-4">
					<h2 className="text-xl font-display">{url}</h2>
					<SocialVideoEmbed url={url} className="max-w-2xl" />
				</div>
			))}
		</div>
	);
}