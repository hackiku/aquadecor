// src/components/navigation/Footer.tsx

// subtle moving wave
// https://codepen.io/pBun/pen/vYGOKKo


// src/components/navigation/Footer.tsx

import Link from "next/link";
import Image from "next/image";
import { footerLinksByCategory } from "~/data/navigation";
import { FooterSocialLinks } from "~/components/social/FooterSocialLinks";
import { SmallNewsletter } from "~/components/cta/email/SmallNewsletter";

const isDev = process.env.NODE_ENV === "development";

export function Footer() {
	return (
		<footer className="relative bg-black text-white pt-12 ">
			{/* Subtle wave divider on top */}
			<svg
				width="100%"
				height="160"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 1920 60"
				preserveAspectRatio="none"
				className="absolute top-0 left-0 w-full "
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
				{/* Main grid */}
				<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mb-12">
					{/* Shop */}
					<div className="space-y-4">
						<h3 className="font-display font-normal text-base text-primary">Shop</h3>
						<ul className="space-y-2">
							{footerLinksByCategory.shop.map((link) => (
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

					{/* Custom */}
					<div className="space-y-4">
						<h3 className="font-display font-normal text-base text-primary">Custom</h3>
						<ul className="space-y-2">
							{footerLinksByCategory.custom.map((link) => (
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

					{/* Help */}
					<div className="space-y-4">
						<h3 className="font-display font-normal text-base text-primary">Help</h3>
						<ul className="space-y-2">
							{footerLinksByCategory.help.map((link) => (
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

					{/* Contact */}
					<div className="space-y-4">
						<h3 className="font-display font-normal text-base text-primary">Contact</h3>
						<ul className="space-y-2">
							{footerLinksByCategory.contact.map((link) => (
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

					{/* Newsletter - Shows earlier on mobile */}
					<div className="order-first sm:order-last sm:col-span-2 md:col-span-4 lg:col-span-1">
						<div className="space-y-4">
							<h3 className="font-display font-normal text-base text-primary">Social</h3>
							<FooterSocialLinks />
						</div>
					</div>
				</div>

				{/* Newsletter */}
				<div className="mb-12 max-w-xl lg:max-w-sm">
					<SmallNewsletter />
				</div>

				{/* Separator */}
				<div className="h-px bg-white/10 mb-8" />

				{/* Bottom row */}
				<div className="flex flex-col lg:flex-row items-center justify-between gap-6">
					{/* Logo & Copyright */}
					<div className="flex flex-col items-center lg:items-start gap-4">
						<Link href="/" className="relative">
							<Image
								src="/logos/logo.svg"
								alt="Aquadecor logo"
								width={180}
								height={45}
								className="h-auto w-44"
							/>
						</Link>
						{isDev && (
							<Link
								href="/admin"
								className="text-xs text-gray-500 hover:text-primary transition-colors"
							>
								Admin
							</Link>
						)}
						<p className="text-xs text-gray-500">
							© {new Date().getFullYear()} Aquadecor LLC. All rights reserved.
						</p>
					</div>

					{/* Legal links */}
					<ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
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
				</div>
			</div>
		</footer>
	);
}