// src/components/navigation/Footer.tsx

import Link from "next/link";
import Image from "next/image";
import { footerLinksByCategory } from "~/data/navigation";
import { FooterSocialLinks } from "~/components/social/FooterSocialLinks";
import { SmallNewsletter } from "~/components/cta/email/SmallNewsletter";

const isDev = process.env.NODE_ENV === "development";

export function Footer() {
	// Find the calculator link to render it with the badge
	const calculatorLink = footerLinksByCategory.custom.find(l => l.href === '/calculator');
	const allShopLinks = [
		...footerLinksByCategory.shop,
		...(calculatorLink ? [calculatorLink] : [])
	];

	return (
		<footer className="relative bg-black text-white pt-12 ">
			{/* Subtle wave divider on top (CSS animation retained) */}
			<svg
				width="100%"
				height="160"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 1920 60"
				preserveAspectRatio="none"
				className="absolute top-0 left-0 w-full"
			>
				<path
					fill="currentColor"
					className="text-background"
					d="
						M0 20
						C 473,40
							822,0
							1920,25
						V 0
						H 0
						Z"
				>
					<animate
						repeatCount="indefinite"
						fill="currentColor"
						attributeName="d"
						dur="10s"
						attributeType="XML"
						values="
							M0 20
							C 473,40
								822,0
								1920,25
							V 0
							H 0
							Z;

							M0 25
							C 473,0
								1222,40
								1920,20
							V 0
							H 0
							Z;

							M0 20
							C 973,35
								1722,5
								1920,25
							V 0
							H 0
							Z;

							M0 20
							C 473,40
								822,0
								1920,25
							V 0
							H 0
							Z
						"
					/>
				</path>
			</svg>

			<div className="mx-auto max-w-7xl px-4 pt-20 pb-10">

				{/* Main Content Grid: 1 col (mobile) -> 2 col (sm) -> 4 col (lg) */}
				<div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 mb-12">

					{/* 🎯 COLUMN 1: Logo, Copyright & Socials (Always Leftmost) */}
					<div className="space-y-6 order-1">
						{/* Logo & Copyright Block */}
						<div className="flex flex-col items-start gap-3">
							<Link href="/" className="relative">
								<Image
									src="/logos/logo.svg"
									alt="Aquadecor logo"
									width={180}
									height={45}
									className="h-auto w-44"
								/>
							</Link>
							<p className="text-xs text-gray-500">
								© {new Date().getFullYear()} Aquadecor LLC. All rights reserved.
							</p>
							{isDev && (
								<Link
									href="/admin"
									className="text-xs text-gray-500 hover:text-primary transition-colors"
								>
									Admin Panel
								</Link>
							)}
						</div>

						{/* Social Icons */}
						<div className="pt-2">
							<FooterSocialLinks />
						</div>
					</div>

					{/* 🎯 COLUMN 2: Shop & Custom Links */}
					<div className="space-y-4 order-3 sm:order-2">
						<h3 className="font-display font-normal text-base text-primary">Shop</h3>
						<ul className="space-y-2">
							{allShopLinks.map((link) => (
								<li key={link.href} className="relative">
									<Link
										href={link.href}
										className="text-sm font-display font-light text-gray-300 hover:text-primary transition-colors"
									>
										{link.label}
									</Link>
									{/* Render Badge for Calculator link */}
									{link.label === "Calculator" && link.badge && (
										<span className="absolute -top-1 ml-2 px-1.5 py-0.5 text-[10px] bg-primary/20 text-primary rounded-full font-normal">
											{link.badge}
										</span>
									)}
								</li>
							))}
						</ul>
					</div>

					{/* 🎯 COLUMN 3: Help & Company Links (Contact) */}
					<div className="space-y-4 order-4 sm:order-3">
						<h3 className="font-display font-normal text-base text-primary">Help & Company</h3>
						<ul className="space-y-2">
							{[...footerLinksByCategory.help, ...footerLinksByCategory.contact].map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm font-display font-light text-gray-300 hover:text-primary transition-colors"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* 🎯 COLUMN 4: Newsletter (No Title, Always Rightmost) */}
					<div className="space-y-4 order-2 sm:order-4 lg:order-4">
						{/* No h3 tag for the newsletter section */}
						<SmallNewsletter />
					</div>
				</div>

				{/* Separator */}
				<div className="h-px bg-white/10 mt-8 mb-4" />

				{/* Bottom row (Legal links and Veenie Attribution) */}
				<div className="flex flex-col lg:flex-row items-center justify-between gap-4">

					{/* Legal links */}
					<ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs order-2 lg:order-1">
						{footerLinksByCategory.legal.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									className="text-gray-400 hover:text-primary transition-colors underline underline-offset-2"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>

					{/* Veenie Attribution */}
					<p className="text-xs text-gray-500 order-1 lg:order-2">
						Website by <Link href="https://veenie.space" target="_blank" className="text-primary hover:text-blue-400 transition-colors">🎈 Veenie Aerospace</Link>
					</p>
				</div>
			</div>
		</footer>
	);
}