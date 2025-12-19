// src/components/navigation/Footer.tsx
'use client';

import Image from "next/image";
import { footerLinksByCategory } from "~/data/navigation";
import { FooterSocialLinks } from "~/components/social/FooterSocialLinks";
import { SmallNewsletter } from "~/components/cta/email/SmallNewsletter";
import { useNavigationTranslations } from "~/i18n/useNavigationTranslations";
import { useTranslations } from 'next-intl';
import { Link } from '~/i18n/navigation';
import { ExternalLink } from 'lucide-react';

const isDev = process.env.NODE_ENV === "development";

export function Footer() {
	const { translateNavLink } = useNavigationTranslations();
	const t = useTranslations('common.footer');

	// Translate all nav links once
	const shopLinks = footerLinksByCategory.shop.map(translateNavLink);
	const resourceLinks = footerLinksByCategory.resources.map(translateNavLink);
	const companyLinks = footerLinksByCategory.company.map(translateNavLink);
	const legalLinks = footerLinksByCategory.legal.map(translateNavLink);

	return (
		<footer className="relative bg-black text-white pt-12">
			{/* Subtle wave divider on top */}
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
				{/* Main Content Grid 
					- xs: single column stack
					- sm: Row 1: logo+newsletter (2 cols), Row 2: links stacked
					- md-lg: Row 1: logo+newsletter (2 cols stretched), Row 2: links (3 cols)
					- xl: single row with everything inline
				*/}
				<div className="mb-12">
					<div className="flex flex-col gap-8">
						{/* Row 1: Logo/Socials + (Links on XL only) + Newsletter */}
						<div className="flex flex-col sm:flex-row gap-8 xl:items-start">
							{/* Logo + Socials */}
							<div className="space-y-6 sm:flex-1 xl:flex-none xl:flex-shrink-0 xl:max-w-xs">
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
										{t('copyright', { year: new Date().getFullYear() })}
									</p>
									{isDev && (
										<Link
											href="/admin"
											className="text-xs text-gray-500 hover:text-primary transition-colors"
										>
											{t('adminPanel')}
										</Link>
									)}
								</div>

								<div className="pt-2">
									<FooterSocialLinks />
								</div>
							</div>

							{/* Link Columns - Only visible on xl, inline with logo and newsletter */}
							<div className="hidden xl:flex gap-16">
								{/* Shop */}
								<div className="space-y-4 min-w-[160px]">
									<h3 className="font-display font-normal text-base text-primary">
										{t('categoryShop')}
									</h3>
									<ul className="space-y-3">
										{shopLinks.map((link) => (
											<li key={link.href} className="relative">
												<Link
													href={link.href as any}
													className="text-[15px] font-display font-light text-gray-300 hover:text-primary transition-colors inline-flex items-center gap-2"
												>
													{link.label}
													{link.badge && (
														<span className="px-1.5 py-0.5 text-[10px] bg-primary/20 text-primary rounded-full font-normal">
															{link.badge}
														</span>
													)}
												</Link>
											</li>
										))}
									</ul>
								</div>

								{/* Resources */}
								<div className="space-y-4 min-w-[160px]">
									<h3 className="font-display font-normal text-base text-primary">
										{t('categoryResources')}
									</h3>
									<ul className="space-y-3">
										{resourceLinks.map((link) => (
											<li key={link.href}>
												<Link
													href={link.href as any}
													className="text-[15px] font-display font-light text-gray-300 hover:text-primary transition-colors"
												>
													{link.label}
												</Link>
											</li>
										))}
									</ul>
								</div>

								{/* Company */}
								<div className="space-y-4 min-w-[160px]">
									<h3 className="font-display font-normal text-base text-primary">
										{t('categoryCompany')}
									</h3>
									<ul className="space-y-3">
										{companyLinks.map((link) => (
											<li key={link.href}>
												<Link
													href={link.href as any}
													className="text-[15px] font-display font-light text-gray-300 hover:text-primary transition-colors"
												>
													{link.label}
												</Link>
											</li>
										))}
									</ul>
								</div>
							</div>

							{/* Newsletter */}
							<div className="sm:flex-1 xl:flex-none xl:flex-shrink-0 xl:max-w-xs xl:ml-auto">
								<SmallNewsletter />
							</div>
						</div>

						{/* Row 2: Link Columns (hidden on xl) */}
						{/* md-lg: 3 columns side by side, sm: stacked */}
						<div className="flex flex-col sm:flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 xl:hidden">
							{/* Shop */}
							<div className="space-y-4 md:flex-1">
								<h3 className="font-display font-normal text-base text-primary">
									{t('categoryShop')}
								</h3>
								<ul className="space-y-3">
									{shopLinks.map((link) => (
										<li key={link.href} className="relative">
											<Link
												href={link.href as any}
												className="text-[15px] font-display font-light text-gray-300 hover:text-primary transition-colors inline-flex items-center gap-2"
											>
												{link.label}
												{link.badge && (
													<span className="px-1.5 py-0.5 text-[10px] bg-primary/20 text-primary rounded-full font-normal">
														{link.badge}
													</span>
												)}
											</Link>
										</li>
									))}
								</ul>
							</div>

							{/* Resources */}
							<div className="space-y-4 md:flex-1">
								<h3 className="font-display font-normal text-base text-primary">
									{t('categoryResources')}
								</h3>
								<ul className="space-y-3">
									{resourceLinks.map((link) => (
										<li key={link.href}>
											<Link
												href={link.href as any}
												className="text-[15px] font-display font-light text-gray-300 hover:text-primary transition-colors"
											>
												{link.label}
											</Link>
										</li>
									))}
								</ul>
							</div>

							{/* Company */}
							<div className="space-y-4 md:flex-1">
								<h3 className="font-display font-normal text-base text-primary">
									{t('categoryCompany')}
								</h3>
								<ul className="space-y-3">
									{companyLinks.map((link) => (
										<li key={link.href}>
											<Link
												href={link.href as any}
												className="text-[15px] font-display font-light text-gray-300 hover:text-primary transition-colors"
											>
												{link.label}
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>

				{/* Separator */}
				<div className="h-px bg-white/10 mt-8 mb-6" />

				{/* Bottom row: Legal + Veenie Attribution */}
				<div className="flex flex-col lg:flex-row items-center justify-between gap-6">

					{/* Legal links */}
					<ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs order-2 lg:order-1">
						{legalLinks.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href as any}
									className="text-gray-400 hover:text-primary transition-colors underline underline-offset-2"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>

					{/* Veenie Attribution - Subtle Design */}
					<a
						href="https://veenie.space"
						target="_blank"
						rel="dofollow"
						className="group relative order-1 lg:order-2 inline-flex items-center gap-2 px-2 py-1 transition-all duration-300"
					>
						{/* Balloon Icon with wiggle animation */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-primary group-hover:text-primary/80 transition-colors"
							style={{
								animation: 'balloonWiggle 3s ease-in-out infinite'
							}}
						>
							<path d="M12 16v1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v1" />
							<path d="M12 6a2 2 0 0 1 2 2" />
							<path d="M18 8c0 4-3.5 8-6 8s-6-4-6-8a6 6 0 0 1 12 0" />
						</svg>

						{/* Inline keyframes style */}
						<style jsx>{`
							@keyframes balloonWiggle {
								0%, 100% {
									transform: translateY(0) rotate(0deg);
								}
								25% {
									transform: translateY(-2px) rotate(-2deg);
								}
								50% {
									transform: translateY(-4px) rotate(0deg);
								}
								75% {
									transform: translateY(-2px) rotate(2deg);
								}
							}
						`}</style>

						{/* Text */}
						<span className="text-xs font-display font-light text-gray-500 group-hover:text-gray-400 transition-colors">
							{t('builtBy')}{' '}
							<span className="font-normal text-gray-400 group-hover:text-primary transition-colors">
								Veenie Aerospace
							</span>
						</span>

						{/* External link icon */}
						<ExternalLink className="h-3 w-3 text-gray-600 opacity-0 group-hover:opacity-60 transition-all duration-200" />

						{/* Tooltip on hover - more subtle */}
						<span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900/90 rounded text-[10px] text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
							{t('veenieTagline')}
						</span>
					</a>
				</div>
			</div>
		</footer>
	);
}