// src/components/navigation/Footer-Alternative.tsx
// USE THIS VERSION FOR A/B TESTING - More aggressive pattern interrupt
'use client';

import Image from "next/image";
import { footerLinksByCategory } from "~/data/navigation";
import { FooterSocialLinks } from "~/components/social/FooterSocialLinks";
import { SmallNewsletter } from "~/components/cta/email/SmallNewsletter";
import { useNavigationTranslations } from "~/i18n/useNavigationTranslations";
import { useTranslations } from 'next-intl';
import { Link } from '~/i18n/navigation';
import { ExternalLink, Rocket, Sparkles } from 'lucide-react';

const isDev = process.env.NODE_ENV === "development";

export function FooterAlternative() {
	const { translateNavLink } = useNavigationTranslations();
	const t = useTranslations('common.footer');

	const shopLinks = footerLinksByCategory.shop.map(translateNavLink);
	const resourceLinks = footerLinksByCategory.resources.map(translateNavLink);
	const companyLinks = footerLinksByCategory.company.map(translateNavLink);
	const legalLinks = footerLinksByCategory.legal.map(translateNavLink);

	return (
		<footer className="relative bg-black text-white pt-12">
			{/* Wave SVG (same as original) */}
			<svg
				width="100%"
				height="160"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 1920 60"
				preserveAspectRatio="none"
				className="absolute top-0 left-0 w-full"
			>
				<path fill="currentColor" className="text-background" d="M0 20 C 473,40 822,0 1920,25 V 0 H 0 Z">
					<animate repeatCount="indefinite" fill="currentColor" attributeName="d" dur="10s" attributeType="XML"
						values="M0 20 C 473,40 822,0 1920,25 V 0 H 0 Z; M0 25 C 473,0 1222,40 1920,20 V 0 H 0 Z; M0 20 C 973,35 1722,5 1920,25 V 0 H 0 Z; M0 20 C 473,40 822,0 1920,25 V 0 H 0 Z" />
				</path>
			</svg>

			<div className="mx-auto max-w-7xl px-4 pt-20 pb-10">
				<div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5 mb-12">

					{/* Logo + Socials */}
					<div className="space-y-6 order-1 lg:col-span-1">
						<div className="flex flex-col items-start gap-3">
							<Link href="/">
								<Image src="/logos/logo.svg" alt="Aquadecor logo" width={180} height={45} className="h-auto w-44" />
							</Link>
							<p className="text-xs text-gray-500">
								{t('copyright', { year: new Date().getFullYear() })}
							</p>
							{isDev && (
								<Link href="/admin" className="text-xs text-gray-500 hover:text-primary transition-colors">
									{t('adminPanel')}
								</Link>
							)}
						</div>
						<div className="pt-2">
							<FooterSocialLinks />
						</div>
					</div>

					{/* Shop */}
					<div className="space-y-4 order-2 lg:order-2">
						<h3 className="font-display font-normal text-base text-primary">{t('categoryShop')}</h3>
						<ul className="space-y-2">
							{shopLinks.map((link) => (
								<li key={link.href} className="relative">
									<Link href={link.href} className="text-sm font-display font-light text-gray-300 hover:text-primary transition-colors inline-flex items-center gap-2">
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
					<div className="space-y-4 order-3 lg:order-3">
						<h3 className="font-display font-normal text-base text-primary">{t('categoryResources')}</h3>
						<ul className="space-y-2">
							{resourceLinks.map((link) => (
								<li key={link.href}>
									<Link href={link.href} className="text-sm font-display font-light text-gray-300 hover:text-primary transition-colors">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Company */}
					<div className="space-y-4 order-4 lg:order-4">
						<h3 className="font-display font-normal text-base text-primary">{t('categoryCompany')}</h3>
						<ul className="space-y-2">
							{companyLinks.map((link) => (
								<li key={link.href}>
									<Link href={link.href} className="text-sm font-display font-light text-gray-300 hover:text-primary transition-colors">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Newsletter */}
					<div className="space-y-4 order-5 lg:order-5">
						<SmallNewsletter />
					</div>
				</div>

				<div className="h-px bg-white/10 mt-8 mb-6" />

				<div className="flex flex-col lg:flex-row items-center justify-between gap-6">

					{/* Legal links */}
					<ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs order-2 lg:order-1">
						{legalLinks.map((link) => (
							<li key={link.href}>
								<Link href={link.href} className="text-gray-400 hover:text-primary transition-colors underline underline-offset-2">
									{link.label}
								</Link>
							</li>
						))}
					</ul>

					{/* 🚀 ALTERNATIVE: More Aggressive Veenie Attribution */}
					<a
						href="https://veenie.space"
						target="_blank"
						rel="noopener noreferrer"
						className="group relative order-1 lg:order-2 inline-flex flex-col items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-br from-blue-500/15 via-purple-500/10 to-pink-500/15 border border-blue-400/30 hover:border-blue-300/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
					>
						{/* Animated background glow */}
						<div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/30 group-hover:via-purple-500/20 group-hover:to-pink-500/30 rounded-xl blur-xl transition-all duration-500 -z-10 opacity-0 group-hover:opacity-100" />

						{/* Top row: Icon + Brand name with gradient */}
						<div className="flex items-center gap-2">
							<Rocket className="h-4 w-4 text-blue-400 group-hover:text-blue-300 transition-colors group-hover:rotate-12 duration-300" />

							<span className="text-sm font-display font-light">
								{t('builtBy')}{' '}
								<span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 group-hover:from-blue-300 group-hover:via-purple-300 group-hover:to-pink-300 transition-all">
									Veenie Aerospace
								</span>
							</span>

							<ExternalLink className="h-3 w-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0" />
						</div>

						{/* Bottom row: Tagline with sparkle */}
						<div className="flex items-center gap-1.5 text-[10px] text-blue-400/70 group-hover:text-blue-300/90 transition-colors">
							<Sparkles className="h-2.5 w-2.5 opacity-60 group-hover:opacity-100" />
							<span className="uppercase tracking-wider font-medium">
								{t('veenieTagline')}
							</span>
						</div>

						{/* Tooltip with mission counter */}
						<span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-2 bg-gray-900/95 backdrop-blur-sm border border-blue-400/40 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl">
							<span className="block text-blue-300 font-medium mb-0.5">50+ Missions Launched</span>
							<span className="block text-gray-400 text-[10px]">Taking 2 more clients this quarter</span>
						</span>
					</a>
				</div>
			</div>
		</footer>
	);
}