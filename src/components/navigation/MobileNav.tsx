// src/components/navigation/MobileNav.tsx
"use client";

import { useState } from "react";
import { ChevronDown, Home, Search, ShoppingBag } from "lucide-react";
import { useTranslations } from 'next-intl';
import { Link } from '~/i18n/navigation';
import { enabledNavLinks, resourceLinks } from "~/data/navigation";
import { useNavigationTranslations } from '~/i18n/useNavigationTranslations';
import { ModeToggle } from "../ui/mode-toggle";

interface MobileNavProps {
	isOpen: boolean;
	onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
	const [shopOpen, setShopOpen] = useState(false);
	const [resourcesOpen, setResourcesOpen] = useState(false);

	const t = useTranslations('common.nav');
	const { translateNavLink } = useNavigationTranslations();

	if (!isOpen) return null;

	// Translate and filter nav links
	const translatedLinks = enabledNavLinks.map(translateNavLink);
	const regularLinks = translatedLinks.filter(link => link.labelKey !== "shop");

	return (
		<div className="lg:hidden fixed top-16 left-0 right-0 bottom-0 bg-zinc-900 border-b border-white/10 shadow-lg overflow-y-auto z-40">
			<nav className="px-4 py-6 space-y-4">
				{/* Shop Collapsible */}
				<div>
					<button
						onClick={() => setShopOpen(!shopOpen)}
						className="flex items-center justify-between w-full py-2 text-base font-normal transition-colors hover:text-blue-400 text-white font-display"
					>
						{t('shop')}
						<ChevronDown
							className={`h-4 w-4 transition-transform ${shopOpen ? "rotate-180" : ""}`}
						/>
					</button>

					{shopOpen && (
						<div className="pl-4 space-y-3 mt-2">
							<Link
								href="/shop"
								onClick={onClose}
								className="flex gap-2 items-center py-2 text-md text-white hover:text-blue-400 font-display font-light"
							>
								<Home size={16}/>
								{t('shop')}
							</Link>
							<Link
								href="/shop/3d-backgrounds"
								onClick={onClose}
								className="block py-2 group "
							>
								<span className="text-sm font-display font-normal text-white group-hover:text-primary">
									{t('backgrounds')}
								</span>
								<span className="block text-xs text-gray-400 font-display font-light mt-0.5 group-hover:text-primary/50">
									{t('backgroundsDescription')}
								</span>
							</Link>
							<Link
								href="/shop/aquarium-decorations"
								onClick={onClose}
								className="block py-2"
							>
								<span className="text-sm font-display font-normal text-white group-hover:text-primary">
									{t('decorations')}
								</span>
								<span className="block text-xs text-gray-400 font-display font-light mt-0.5 group-hover:text-primary/50">
									{t('decorationsDescription')}
								</span>
							</Link>

						</div>
					)}
				</div>

				{/* Regular Links */}
				{regularLinks.map((link) => (
					<Link
						key={link.href}
						href={link.href as any}
						onClick={onClose}
						className="block py-2 text-base font-normal transition-colors hover:text-blue-400 text-white font-display"
					>
						<span className="flex items-center gap-2">
							{link.label}
							{link.badge && (
								<span className="px-2 py-0.5 text-[10px] bg-blue-500/20 text-blue-400 rounded-full font-normal">
									{link.badge}
								</span>
							)}
						</span>
						{link.description && (
							<span className="block text-sm text-gray-400 font-light mt-0.5">
								{link.description}
							</span>
						)}
					</Link>
				))}

				{/* Resources Collapsible */}
				<div className="pt-2 border-t border-white/10">
					<button
						onClick={() => setResourcesOpen(!resourcesOpen)}
						className="flex items-center justify-between w-full py-2 text-base font-normal transition-colors hover:text-blue-400 text-white font-display"
					>
						{t('resources')}
						<ChevronDown
							className={`h-4 w-4 transition-transform ${resourcesOpen ? "rotate-180" : ""}`}
						/>
					</button>

					{resourcesOpen && (
						<div className="pl-4 space-y-3 mt-2">
							{resourceLinks.map((resource) => (
								<Link
									key={resource.href}
									href={resource.href as any}
									onClick={onClose}
									className="block py-2"
								>
									<span className="text-sm font-display font-normal text-white">
										{t(resource.labelKey)}
									</span>
									<span className="block text-xs text-gray-400 font-display font-light mt-0.5">
										{t(resource.descriptionKey)}
									</span>
								</Link>
							))}
						</div>
					)}
				</div>

				{/* Search */}
				<div className="pt-4 border-t border-white/10">
					<button
						className="flex items-center gap-2 py-2 text-base font-normal transition-colors hover:text-blue-400 text-white font-display"
						onClick={() => {
							onClose();
							// TODO: Open search modal
						}}
					>
						<Search className="h-4 w-4" />
						Search
					</button>
				</div>

				{/* Theme Toggle */}
				<div className="pt-2 flex items-center gap-2">
					<span className="text-sm text-gray-400 font-display">Theme:</span>
					<ModeToggle />
				</div>
			</nav>
		</div>
	);
}