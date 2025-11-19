// src/data/social-mentions.ts

export type SocialPlatform = "tiktok" | "youtube" | "instagram" | "facebook" | "reddit";

export interface SocialMention {
	id: string;
	platform: SocialPlatform;
	url: string;
	embedUrl?: string; // For iframe embeds
	thumbnail?: string; // Fallback image if embed fails
	caption?: string;
	author?: string;
	likes?: number;
	views?: number;
	aspectRatio?: "square" | "portrait" | "landscape"; // For masonry layout
}

export const socialMentions: SocialMention[] = [
	// TikTok - Best customer reviews
	{
		id: "tiktok-1",
		platform: "tiktok",
		url: "https://www.tiktok.com/@aquadecorbackgrounds/video/7530031215806631174",
		embedUrl: "https://www.tiktok.com/embed/7530031215806631174",
		thumbnail: "/media/social/tiktok-1.jpg",
		caption: "Customer showcase - Amazonian setup",
		aspectRatio: "portrait",
		likes: 15200,
		views: 245000,
	},
	{
		id: "tiktok-2",
		platform: "tiktok",
		url: "https://www.tiktok.com/@aquadecorbackgrounds/video/placeholder",
		embedUrl: "https://www.tiktok.com/embed/placeholder",
		thumbnail: "/media/social/tiktok-2.jpg",
		caption: "Installation process timelapse",
		aspectRatio: "portrait",
		likes: 8900,
		views: 156000,
	},

	// YouTube - Installation guides and reviews
	{
		id: "youtube-1",
		platform: "youtube",
		url: "https://www.youtube.com/watch?v=placeholder1",
		embedUrl: "https://www.youtube.com/embed/placeholder1",
		thumbnail: "https://img.youtube.com/vi/placeholder1/maxresdefault.jpg",
		caption: "Full installation guide - A Models",
		author: "Aquadecor Backgrounds",
		aspectRatio: "landscape",
		views: 45000,
	},
	{
		id: "youtube-2",
		platform: "youtube",
		url: "https://www.youtube.com/watch?v=placeholder2",
		embedUrl: "https://www.youtube.com/embed/placeholder2",
		thumbnail: "https://img.youtube.com/vi/placeholder2/maxresdefault.jpg",
		caption: "Customer review - 6 months update",
		author: "Joey's Aquarium",
		aspectRatio: "landscape",
		views: 28000,
	},

	// Instagram - Product showcases
	{
		id: "instagram-1",
		platform: "instagram",
		url: "https://www.instagram.com/p/placeholder1/",
		thumbnail: "/media/social/instagram-1.jpg",
		caption: "Rocky background with cichlids",
		aspectRatio: "square",
		likes: 2400,
	},
	{
		id: "instagram-2",
		platform: "instagram",
		url: "https://www.instagram.com/p/placeholder2/",
		thumbnail: "/media/social/instagram-2.jpg",
		caption: "Custom Amazonian tree trunk",
		aspectRatio: "square",
		likes: 3100,
	},
	{
		id: "instagram-3",
		platform: "instagram",
		url: "https://www.instagram.com/p/placeholder3/",
		thumbnail: "/media/social/instagram-3.jpg",
		caption: "Slim model installation",
		aspectRatio: "portrait",
		likes: 1850,
	},

	// Facebook - Community posts
	{
		id: "facebook-1",
		platform: "facebook",
		url: "https://www.facebook.com/aquadecorbackgrounds/posts/placeholder1",
		thumbnail: "/media/social/facebook-1.jpg",
		caption: "Customer tank transformation",
		aspectRatio: "landscape",
		likes: 890,
	},

	// Reddit - Authentic reviews
	{
		id: "reddit-1",
		platform: "reddit",
		url: "https://www.reddit.com/r/Aquariums/comments/placeholder1",
		thumbnail: "/media/social/reddit-1.jpg",
		caption: "\"Best purchase I've made for my tank\" - r/Aquariums",
		author: "u/aquarium_enthusiast",
		aspectRatio: "landscape",
	},
];

// Filter helpers
export const getMentionsByPlatform = (platform: SocialPlatform) =>
	socialMentions.filter((mention) => mention.platform === platform);

export const getAllPlatforms = (): SocialPlatform[] =>
	Array.from(new Set(socialMentions.map((m) => m.platform)));