// src/components/social/SocialLinks.tsx

import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";

interface SocialLinkProps {
	href: string;
	label: string;
	icon: React.ReactNode;
	followers?: number;
	showFollowers?: boolean;
}

function SocialLink({ href, label, icon, followers, showFollowers = false }: SocialLinkProps) {
	const formattedFollowers = followers
		? followers >= 1000
			? `${(followers / 1000).toFixed(0)}K`
			: followers.toString()
		: null;

	return (
		<Link
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={label}
			className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
		>
			<div className="transition-transform group-hover:scale-110">
				{icon}
			</div>
			{showFollowers && formattedFollowers && (
				<span className="text-sm font-display font-medium">{formattedFollowers}</span>
			)}
		</Link>
	);
}

interface SocialLinksProps {
	showFollowers?: boolean;
	className?: string;
}

export function SocialLinks({ showFollowers = false, className = "" }: SocialLinksProps) {
	return (
		<div className={`flex items-center gap-6 ${className}`}>
			<SocialLink
				href="https://www.instagram.com/aquadecor/"
				label="Instagram"
				icon={<Instagram className="h-5 w-5" />}
				followers={100000}
				showFollowers={showFollowers}
			/>
			<SocialLink
				href="https://www.facebook.com/aquadecorbackgrounds"
				label="Facebook"
				icon={<Facebook className="h-5 w-5" />}
				followers={95000}
				showFollowers={showFollowers}
			/>
			<SocialLink
				href="https://www.youtube.com/@AquadecorBackgrounds"
				label="YouTube"
				icon={<Youtube className="h-5 w-5" />}
				followers={12000}
				showFollowers={showFollowers}
			/>
			<SocialLink
				href="https://www.tiktok.com/@aquadecorbackgrounds"
				label="TikTok"
				icon={
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z" />
					</svg>
				}
				followers={45000}
				showFollowers={showFollowers}
			/>
			<SocialLink
				href="https://www.pinterest.com/aquadecorbackgrounds/"
				label="Pinterest"
				icon={
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path d="M8 0a8 8 0 0 0-2.915 15.452c-.07-.633-.134-1.606.027-2.297.146-.625.938-3.977.938-3.977s-.239-.479-.239-1.187c0-1.113.645-1.943 1.448-1.943.682 0 1.012.512 1.012 1.127 0 .686-.437 1.712-.663 2.663-.188.796.4 1.446 1.185 1.446 1.422 0 2.515-1.5 2.515-3.664 0-1.915-1.377-3.254-3.342-3.254-2.276 0-3.612 1.707-3.612 3.471 0 .688.265 1.425.595 1.826a.24.24 0 0 1 .056.23c-.061.252-.196.796-.222.907-.035.146-.116.177-.268.107-1-.465-1.624-1.926-1.624-3.1 0-2.523 1.834-4.84 5.286-4.84 2.775 0 4.932 1.977 4.932 4.62 0 2.757-1.739 4.976-4.151 4.976-.811 0-1.573-.421-1.834-.919l-.498 1.902c-.181.695-.669 1.566-.995 2.097A8 8 0 1 0 8 0z" />
					</svg>
				}
				showFollowers={showFollowers}
			/>
		</div>
	);
}