// src/components/navigation/Footer.tsx
'use client';

import Image from "next/image";
import { footerLinksByCategory } from "~/data/navigation";
import { FooterSocialLinks } from "~/components/social/FooterSocialLinks";
import { SmallNewsletter } from "~/components/cta/email/SmallNewsletter";
import { useNavigationTranslations } from "~/i18n/useNavigationTranslations";
import { useTranslations } from 'next-intl';
import { Link } from '~/i18n/navigation';
import { ExternalLink, Rocket } from 'lucide-react';

const isDev = process.env.NODE_ENV === "development";

export function Footer() {
	const { translateNavLink } = useNavigationTranslations();
	const t = useTranslations('common.footer');

	// Translate all nav links
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
				{/* Main Content Grid: Brand + Newsletter on top row (mobile), then 3 link columns */}
				<div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5 mb-12">

					{/* COLUMN 1: Logo, Copyright & Socials - Desktop: Far Left, Mobile: Top Left */}
					<div className="space-y-6 order-1 lg:col-span-1">
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

					{/* COLUMN 2 (Mobile): Newsletter - Right of logo on mobile, Far right on desktop */}
					<div className="space-y-4 order-2 lg:order-5 lg:col-span-1">
						<SmallNewsletter />
					</div>

					{/* COLUMN 3: Shop - Second row on mobile, middle columns on desktop */}
					<div className="space-y-4 order-3 lg:order-2 lg:col-span-1">
						<h3 className="font-display font-normal text-base text-primary">
							{t('categoryShop')}
						</h3>
						<ul className="space-y-2">
							{shopLinks.map((link) => (
								<li key={link.href} className="relative">
									<Link
										href={link.href as any}
										className="text-sm font-display font-light text-gray-300 hover:text-primary transition-colors inline-flex items-center gap-2"
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

					{/* COLUMN 4: Resources */}
					<div className="space-y-4 order-4 lg:order-3 lg:col-span-1">
						<h3 className="font-display font-normal text-base text-primary">
							{t('categoryResources')}
						</h3>
						<ul className="space-y-2">
							{resourceLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href as any}
										className="text-sm font-display font-light text-gray-300 hover:text-primary transition-colors"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* COLUMN 5: Company */}
					<div className="space-y-4 order-5 lg:order-4 lg:col-span-1">
						<h3 className="font-display font-normal text-base text-primary">
							{t('categoryCompany')}
						</h3>
						<ul className="space-y-2">
							{companyLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href as any}
										className="text-sm font-display font-light text-gray-300 hover:text-primary transition-colors"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
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

					{/* Veenie Attribution - Pattern Interrupt Design */}
					<a
						href="https://veenie.space"
						target="_blank"
						rel="dofollow"
						className="group relative order-1 lg:order-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105"
					>
						{/* Subtle glow effect on hover */}
						<div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 rounded-lg blur-xl transition-all duration-300 -z-10" />

						{/* Icon */}
						<Rocket className="h-3.5 w-3.5 text-blue-400 group-hover:text-blue-300 transition-colors" />

						{/* Text */}
						<span className="text-xs font-display font-light text-gray-400 group-hover:text-gray-300 transition-colors">
							{t('builtBy')}{' '}
							<span className="font-normal text-blue-400 group-hover:text-blue-300">
								Veenie Aerospace
							</span>
						</span>

						{/* External link icon */}
						<ExternalLink className="h-3 w-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0" />

						{/* Tooltip on hover */}
						<span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 border border-blue-500/30 rounded-md text-xs text-blue-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
							{t('veenieTagline')}
						</span>
					</a>
				</div>
			</div>
		</footer>
	);
}