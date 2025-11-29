// src/components/social/SocialVideoEmbed.tsx
"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";

interface SocialVideoEmbedProps {
	url: string;
	className?: string;
}

type Platform = "tiktok" | "youtube" | "instagram" | "facebook" | "twitter" | "unknown";

interface EmbedConfig {
	platform: Platform;
	embedUrl: string | null;
	supportsEmbed: boolean;
}

/**
 * Detect platform and generate embed URL from social media URL
 */
function parseEmbedUrl(url: string): EmbedConfig {
	// TikTok
	if (url.includes("tiktok.com")) {
		const videoIdMatch = url.match(/video\/(\d+)/);
		if (videoIdMatch) {
			return {
				platform: "tiktok",
				embedUrl: `https://www.tiktok.com/embed/${videoIdMatch[1]}`,
				supportsEmbed: true,
			};
		}
	}

	// YouTube
	if (url.includes("youtube.com") || url.includes("youtu.be")) {
		let videoId: string | null = null;

		// youtube.com/watch?v=VIDEO_ID
		const watchMatch = url.match(/[?&]v=([^&]+)/);
		if (watchMatch) {
			videoId = watchMatch[1];
		}

		// youtu.be/VIDEO_ID
		const shortMatch = url.match(/youtu\.be\/([^?]+)/);
		if (shortMatch) {
			videoId = shortMatch[1];
		}

		if (videoId) {
			return {
				platform: "youtube",
				embedUrl: `https://www.youtube.com/embed/${videoId}`,
				supportsEmbed: true,
			};
		}
	}

	// Instagram
	if (url.includes("instagram.com")) {
		// Instagram embeds require oEmbed API (complex)
		// Format: https://www.instagram.com/p/POST_ID/
		const postIdMatch = url.match(/\/p\/([^/?]+)/);
		if (postIdMatch) {
			return {
				platform: "instagram",
				embedUrl: `${url}embed/`,
				supportsEmbed: true,
			};
		}
	}

	// Facebook
	if (url.includes("facebook.com")) {
		// Facebook embeds are complex (require SDK)
		return {
			platform: "facebook",
			embedUrl: null,
			supportsEmbed: false,
		};
	}

	// Twitter/X
	if (url.includes("twitter.com") || url.includes("x.com")) {
		// Twitter embeds require oEmbed API or widget.js
		return {
			platform: "twitter",
			embedUrl: null,
			supportsEmbed: false,
		};
	}

	return {
		platform: "unknown",
		embedUrl: null,
		supportsEmbed: false,
	};
}

export function SocialVideoEmbed({ url, className = "" }: SocialVideoEmbedProps) {
	const [embedConfig, setEmbedConfig] = useState<EmbedConfig>(() => parseEmbedUrl(url));
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		setEmbedConfig(parseEmbedUrl(url));
		setHasError(false);
	}, [url]);

	// If platform doesn't support simple iframe embeds
	if (!embedConfig.supportsEmbed || !embedConfig.embedUrl) {
		return (
			<div className={`flex flex-col items-center justify-center bg-muted rounded-lg p-8 ${className}`}>
				<p className="text-muted-foreground font-display text-sm mb-4">
					{embedConfig.platform === "unknown"
						? "Embed not supported for this URL"
						: `${embedConfig.platform} embeds require additional setup`
					}
				</p>
				<a
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-2 text-primary hover:underline font-display font-medium"
				>
					View original post
					<ExternalLink className="h-4 w-4" />
				</a>
			</div>
		);
	}

	// Error state
	if (hasError) {
		return (
			<div className={`flex flex-col items-center justify-center bg-muted rounded-lg p-8 ${className}`}>
				<p className="text-muted-foreground font-display text-sm mb-4">
					Failed to load embed
				</p>
				<a
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-2 text-primary hover:underline font-display font-medium"
				>
					View original post
					<ExternalLink className="h-4 w-4" />
				</a>
			</div>
		);
	}

	// Platform-specific embed configurations
	const embedProps = {
		tiktok: {
			width: "100%",
			height: "740",
			frameBorder: "0",
			allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
			allowFullScreen: true,
		},
		youtube: {
			width: "100%",
			height: "315",
			frameBorder: "0",
			allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
			allowFullScreen: true,
		},
		instagram: {
			width: "100%",
			height: "600",
			frameBorder: "0",
			scrolling: "no",
			allowtransparency: true,
		},
	}[embedConfig.platform] || {};

	return (
		<div className={`relative ${className}`}>
			<iframe
				src={embedConfig.embedUrl}
				title={`${embedConfig.platform} embed`}
				className="w-full rounded-lg"
				onError={() => setHasError(true)}
				{...embedProps}
			/>

			{/* Fallback link if iframe fails */}
			<noscript>
				<div className="flex items-center justify-center bg-muted rounded-lg p-8">
					<a
						href={url}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 text-primary hover:underline font-display font-medium"
					>
						View original post
						<ExternalLink className="h-4 w-4" />
					</a>
				</div>
			</noscript>
		</div>
	);
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// Basic usage
<SocialVideoEmbed url="https://www.tiktok.com/@user/video/7530031215806631174" />

// With custom styling
<SocialVideoEmbed 
	url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
	className="aspect-video"
/>

// Test different platforms
const urls = [
	"https://www.tiktok.com/@aquadecorbackgrounds/video/7530031215806631174",
	"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
	"https://www.instagram.com/p/ABC123/",
	"https://www.facebook.com/user/posts/123456",
	"https://twitter.com/user/status/123456",
];

urls.map(url => (
	<div key={url} className="mb-8">
		<h3>{url}</h3>
		<SocialVideoEmbed url={url} />
	</div>
));
*/