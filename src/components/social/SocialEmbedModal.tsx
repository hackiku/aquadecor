// src/components/social/SocialEmbedModal.tsx
"use client";

import { useEffect, useState } from "react";
import { X, ExternalLink, Heart, MessageCircle, Eye } from "lucide-react";
import { Button } from "~/components/ui/button";
import { SocialVideoEmbed } from "./SocialVideoEmbed";
import type { SocialMention } from "~/data/social-mentions";

interface SocialEmbedModalProps {
	mention: SocialMention;
	isOpen: boolean;
	onClose: () => void;
}

export function SocialEmbedModal({ mention, isOpen, onClose }: SocialEmbedModalProps) {
	const [embedLoaded, setEmbedLoaded] = useState(false);

	// Lock body scroll when modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
			// Load embed after a short delay to improve perceived performance
			const timer = setTimeout(() => setEmbedLoaded(true), 300);
			return () => {
				document.body.style.overflow = "unset";
				clearTimeout(timer);
			};
		}
	}, [isOpen]);

	if (!isOpen) return null;

	const platformColor = {
		tiktok: "bg-pink-500",
		youtube: "bg-red-500",
		instagram: "bg-purple-500",
		facebook: "bg-blue-500",
		reddit: "bg-orange-500",
	}[mention.platform];

	const platformName = {
		tiktok: "TikTok",
		youtube: "YouTube",
		instagram: "Instagram",
		facebook: "Facebook",
		reddit: "Reddit",
	}[mention.platform];

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in duration-300"
				onClick={onClose}
			/>

			{/* Modal */}
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
				<div
					className="relative w-full max-w-4xl max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden pointer-events-auto animate-in zoom-in-95 duration-300"
					onClick={(e) => e.stopPropagation()}
				>
					{/* Header */}
					<div className="flex items-center justify-between p-4 border-b">
						<div className="flex items-center gap-3">
							<div className={`w-8 h-8 ${platformColor} rounded-full flex items-center justify-center`}>
								<span className="text-white text-xs font-bold uppercase">
									{mention.platform[0]}
								</span>
							</div>
							<div>
								<h3 className="font-display font-medium text-sm">
									{platformName}
								</h3>
								{mention.author && (
									<p className="text-xs text-muted-foreground">
										@{mention.author}
									</p>
								)}
							</div>
						</div>

						<Button
							variant="ghost"
							size="icon"
							onClick={onClose}
							className="rounded-full"
						>
							<X className="h-5 w-5" />
						</Button>
					</div>

					{/* Content */}
					<div className="overflow-y-auto max-h-[calc(90vh-140px)]">
						{/* Embed Area */}
						<div className="bg-muted">
							{embedLoaded ? (
								<SocialVideoEmbed url={mention.url} />
							) : (
								<div className="aspect-[9/16] md:aspect-video flex items-center justify-center">
									<div className="text-muted-foreground font-display text-sm">
										Loading embed...
									</div>
								</div>
							)}
						</div>

						{/* Caption & Metrics */}
						<div className="p-6 space-y-4">
							{/* Metrics */}
							{(mention.likes || mention.views || mention.comments) && (
								<div className="flex items-center gap-6 text-sm text-muted-foreground">
									{mention.likes && (
										<div className="flex items-center gap-2">
											<Heart className="h-4 w-4" />
											<span className="font-display font-medium">
												{mention.likes.toLocaleString()}
											</span>
										</div>
									)}
									{mention.views && (
										<div className="flex items-center gap-2">
											<Eye className="h-4 w-4" />
											<span className="font-display font-medium">
												{mention.views.toLocaleString()}
											</span>
										</div>
									)}
									{mention.comments && (
										<div className="flex items-center gap-2">
											<MessageCircle className="h-4 w-4" />
											<span className="font-display font-medium">
												{mention.comments.toLocaleString()}
											</span>
										</div>
									)}
								</div>
							)}

							{/* Caption */}
							{mention.caption && (
								<p className="font-display font-light text-muted-foreground leading-relaxed">
									{mention.caption}
								</p>
							)}
						</div>
					</div>

					{/* Footer */}
					<div className="border-t p-4 flex items-center justify-between">
						<Button
							variant="outline"
							size="sm"
							asChild
							className="rounded-full"
						>
							<a
								href={mention.url}
								target="_blank"
								rel="noopener noreferrer"
								className="gap-2"
							>
								<ExternalLink className="h-3.5 w-3.5" />
								View on {platformName}
							</a>
						</Button>

						<Button
							variant="default"
							size="sm"
							asChild
							className="rounded-full"
						>
							<a
								href={getFollowUrl(mention.platform)}
								target="_blank"
								rel="noopener noreferrer"
							>
								Follow us on {platformName}
							</a>
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}

// Helper to get follow URLs for each platform
function getFollowUrl(platform: SocialMention["platform"]): string {
	const followUrls = {
		tiktok: "https://www.tiktok.com/@aquadecorbackgrounds",
		youtube: "https://www.youtube.com/@aquadecorbackgrounds",
		instagram: "https://www.instagram.com/aquadecorbackgrounds",
		facebook: "https://www.facebook.com/aquadecorbackgrounds",
		reddit: "https://www.reddit.com/user/aquadecorbackgrounds",
	};

	return followUrls[platform] || "#";
}