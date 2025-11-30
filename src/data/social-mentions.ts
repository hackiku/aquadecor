// src/data/social-mentions.ts

// dl tiktok vids
// https://snaptik.app/

export type SocialPlatform = "tiktok" | "youtube" | "instagram" | "facebook" | "reddit";

export interface SocialMention {
	id: string;
	platform: SocialPlatform;
	url: string; // Link to original post

	// Media files
	thumbnail: string; // Path to image/video thumbnail
	videoFile?: string; // Path to video file (for TikTok/YouTube clips)

	// Content
	caption?: string;
	author?: string;

	// Metrics (update manually when needed)
	likes?: number;
	views?: number;
	comments?: number;

	// Display
	aspectRatio?: "square" | "portrait" | "landscape";
	isFeatured?: boolean; // Show on homepage
}

// ============================================================================
// SOCIAL MENTIONS DATA
// ============================================================================

export const socialMentions: SocialMention[] = [
	// ========================================
	// TIKTOK - Customer Showcases
	// ========================================
	{
		id: "tiktok-six-foot-background-review",
		platform: "tiktok",
		url: "https://www.tiktok.com/@aquadecorbackgrounds/video/7530031215806631174",

		// Downloaded from SnapTik
		videoFile: "/media/social/tiktok/tiktok-six-foot-background-review.mp4",
		thumbnail: "/media/social/tiktok/tiktok-six-foot-background-review-thumb.jpg",

		caption: "Customer showcase - 6-foot background gift from Joey",
		author: "aquadecorbackgrounds",
		aspectRatio: "landscape",
		likes: 11,
		views: 839,
		isFeatured: true,
	},
	{
		id: "tiktok-amazonian-installation",
		platform: "tiktok",
		url: "https://www.tiktok.com/@aquadecorbackgrounds/video/7523456789012345678",

		videoFile: "/media/social/tiktok/tiktok-installation-amazonian-tree-trunk.mp4",
		thumbnail: "/media/social/tiktok/tiktok-installation-amazonian-tree-trunk-thumb.jpg",

		caption: "Installation timelapse - Amazonian tree trunk background",
		author: "aquadecorbackgrounds",
		aspectRatio: "portrait",
		likes: 8900,
		views: 156000,
		isFeatured: true,
	},
	{
		id: "tiktok-discus-tank-transformation",
		platform: "tiktok",
		url: "https://www.tiktok.com/@aquadecorbackgrounds/video/placeholder3",

		videoFile: "/media/social/tiktok/tiktok-showcase-discus-tank-before-after.mp4",
		thumbnail: "/media/social/tiktok/tiktok-showcase-discus-tank-before-after-thumb.jpg",

		caption: "Before & after - Discus tank transformation",
		author: "aquadecorbackgrounds",
		aspectRatio: "portrait",
		likes: 12400,
		views: 198000,
	},

	// ========================================
	// YOUTUBE - Reviews & Tutorials
	// ========================================
	{
		id: "youtube-joey-mullen-review",
		platform: "youtube",
		url: "https://www.youtube.com/watch?v=placeholder-joey",

		// Use YouTube thumbnail API or screenshot
		thumbnail: "/media/social/youtube/youtube-review-joey-mullen-amazonian-background.jpg",

		caption: "Joey Mullen reviews Amazonian tree trunk background",
		author: "Joey Mullen",
		aspectRatio: "landscape",
		views: 45000,
		isFeatured: true,
	},
	{
		id: "youtube-installation-guide-a-models",
		platform: "youtube",
		url: "https://www.youtube.com/watch?v=placeholder-install",

		thumbnail: "/media/social/youtube/youtube-tutorial-installation-guide-a-models.jpg",

		caption: "Complete installation guide - A Models rocky backgrounds",
		author: "Aquadecor Backgrounds",
		aspectRatio: "landscape",
		views: 38000,
	},
	{
		id: "youtube-customer-review-6-months",
		platform: "youtube",
		url: "https://www.youtube.com/watch?v=placeholder-review",

		thumbnail: "/media/social/youtube/youtube-review-customer-6-month-update.jpg",

		caption: "6-month review - How the background held up",
		author: "Aquarium Enthusiast",
		aspectRatio: "landscape",
		views: 28000,
	},

	// ========================================
	// INSTAGRAM - Product Showcases
	// ========================================
	{
		id: "instagram-rocky-background-cichlids",
		platform: "instagram",
		url: "https://www.instagram.com/p/placeholder1/",

		// Screenshot of Instagram post
		thumbnail: "/media/social/instagram/instagram-showcase-rocky-background-cichlids.jpg",

		caption: "Rocky background perfect for African cichlids",
		author: "aquadecorbackgrounds",
		aspectRatio: "square",
		likes: 2400,
		isFeatured: true,
	},
	{
		id: "instagram-amazonian-tree-trunk-custom",
		platform: "instagram",
		url: "https://www.instagram.com/p/placeholder2/",

		thumbnail: "/media/social/instagram/instagram-showcase-amazonian-tree-trunk-custom.jpg",

		caption: "Custom Amazonian tree trunk - Made to measure",
		author: "aquadecorbackgrounds",
		aspectRatio: "square",
		likes: 3100,
	},
	{
		id: "instagram-slim-model-installation",
		platform: "instagram",
		url: "https://www.instagram.com/p/placeholder3/",

		thumbnail: "/media/social/instagram/instagram-tutorial-slim-model-installation.jpg",

		caption: "Slim model installation in 200L tank",
		author: "aquadecorbackgrounds",
		aspectRatio: "portrait",
		likes: 1850,
	},
	{
		id: "instagram-discus-tank-setup",
		platform: "instagram",
		url: "https://www.instagram.com/p/placeholder4/",

		thumbnail: "/media/social/instagram/instagram-showcase-discus-tank-planted.jpg",

		caption: "Discus breeding tank with planted background",
		author: "aquadecorbackgrounds",
		aspectRatio: "square",
		likes: 2900,
	},

	// ========================================
	// FACEBOOK - Community Posts
	// ========================================
	{
		id: "facebook-tank-transformation-customer",
		platform: "facebook",
		url: "https://www.facebook.com/aquadecorbackgrounds/posts/placeholder1",

		// Screenshot of Facebook post
		thumbnail: "/media/social/facebook/facebook-testimonial-tank-transformation-before-after.jpg",

		caption: "Customer's 300L tank transformation - Before & after",
		author: "Aquadecor Backgrounds",
		aspectRatio: "landscape",
		likes: 890,
	},
	{
		id: "facebook-community-showcase-winner",
		platform: "facebook",
		url: "https://www.facebook.com/aquadecorbackgrounds/posts/placeholder2",

		thumbnail: "/media/social/facebook/facebook-showcase-community-contest-winner.jpg",

		caption: "Community contest winner - Best setup 2024",
		author: "Aquadecor Backgrounds",
		aspectRatio: "landscape",
		likes: 1240,
	},

	// ========================================
	// REDDIT - Authentic Reviews
	// ========================================
	{
		id: "reddit-aquariums-best-purchase",
		platform: "reddit",
		url: "https://www.reddit.com/r/Aquariums/comments/placeholder1",

		// Screenshot of Reddit thread
		thumbnail: "/media/social/reddit/reddit-review-best-purchase-aquariums-subreddit.jpg",

		caption: '"Best purchase I\'ve made for my tank" - r/Aquariums',
		author: "u/aquarium_enthusiast",
		aspectRatio: "landscape",
	},
	{
		id: "reddit-plantedtank-amazonian-setup",
		platform: "reddit",
		url: "https://www.reddit.com/r/PlantedTank/comments/placeholder2",

		thumbnail: "/media/social/reddit/reddit-showcase-plantedtank-amazonian-setup.jpg",

		caption: "Amazonian planted tank with tree trunk background - r/PlantedTank",
		author: "u/planted_tank_lover",
		aspectRatio: "landscape",
	},
];

// ============================================================================
// FILTER HELPERS
// ============================================================================

export const getMentionsByPlatform = (platform: SocialPlatform) =>
	socialMentions.filter((mention) => mention.platform === platform);

export const getFeaturedMentions = () =>
	socialMentions.filter((mention) => mention.isFeatured);

export const getAllPlatforms = (): SocialPlatform[] =>
	Array.from(new Set(socialMentions.map((m) => m.platform)));

export const getPlatformCount = (platform: SocialPlatform): number =>
	socialMentions.filter((m) => m.platform === platform).length;