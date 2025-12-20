// src/components/navigation/ShopMegaMenu.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Rotate3D, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from 'next-intl';
import { Link } from '~/i18n/navigation';
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface ShopMegaMenuProps {
	router: AppRouterInstance;
}

export function ShopMegaMenu({ router }: ShopMegaMenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const t = useTranslations('common.nav');

	const handleMouseEnter = (href: string) => {
		router.prefetch(href);
	};

	return (
		<div
			className="relative h-full flex items-center"
			onMouseEnter={() => setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
		>
			{/* Trigger */}
			<button className="flex items-center gap-1 text-md font-light transition-colors hover:text-blue-400 text-white font-display outline-none h-full">
				{t('shop')}
				<ChevronDown
					className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
				/>
			</button>

			{/* Mega Menu Dropdown */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -5 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -5 }}
						transition={{ duration: 0.2 }}
						className="absolute top-full -left-4 mt-5 -translate-y-px w-[540px] bg-black border border-white/10 border-t-black rounded-b-lg shadow-xl z-30 overflow-hidden"
					>
						<div className="p-6">
							{/* Main Grid: Shop All + Product Categories */}
							<div className="grid grid-cols-5 gap-4">
								{/* Left Column: Shop Homepage (Tall Vertical Rectangle) */}
								<Link
									href="/shop"
									onMouseEnter={() => handleMouseEnter("/shop")}
									className="group col-span-2 relative rounded-lg overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 row-span-2 flex flex-col"
								>
									{/* Background Image */}
									<div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
										<Image
											src="/media/nav/shop-all.jpg"
											alt="Shop All Products"
											fill
											className="object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-300"
										/>
									</div>

									{/* Content */}
									<div className="relative z-10 p-5 flex flex-col justify-between h-full">
										<div>
											<h3 className="text-lg font-display font-medium text-white mb-2">
												{t('shop')}
											</h3>
											<p className="text-xs text-gray-400 font-display font-light leading-relaxed">
												{t('shopDescription')}
											</p>
										</div>

										<div className="flex items-center text-xs text-primary font-display font-medium mt-4 group-hover:gap-2 transition-all">
											Browse
											<ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
										</div>
									</div>
								</Link>

								{/* Right Column: Product Categories (2 taller rows) */}

								{/* 3D Backgrounds */}
								<Link
									href="/shop/3d-backgrounds"
									onMouseEnter={() => handleMouseEnter("/shop/3d-backgrounds")}
									className="group relative rounded-lg overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 col-span-3 flex min-h-[120px]"
								>
									{/* Background Image */}
									<div className="absolute inset-0">
										<Image
											src="/media/nav/backgrounds.jpg"
											alt="3D Backgrounds"
											fill
											className="object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
										/>
										<div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
									</div>

									{/* Content */}
									<div className="relative z-10 p-4 flex items-center gap-3 w-full">
										<div className="flex-1 min-w-0">
											<h4 className="font-display font-medium text-white mb-0.5">
												{t('backgrounds')}
											</h4>
											<p className="text-xs text-gray-400 font-display font-light">
												{t('backgroundsDescription')}
											</p>
										</div>
										<ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
									</div>
								</Link>

								{/* Aquarium Decorations */}
								<Link
									href="/shop/aquarium-decorations"
									onMouseEnter={() => handleMouseEnter("/shop/aquarium-decorations")}
									className="group relative rounded-lg overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 col-span-3 flex min-h-[120px]"
								>
									{/* Background Image */}
									<div className="absolute inset-0">
										<Image
											src="/media/nav/decorations.jpg"
											alt="Aquarium Decorations"
											fill
											className="object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
										/>
										<div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
									</div>

									{/* Content */}
									<div className="relative z-10 p-4 flex items-center gap-3 w-full">
										<div className="flex-1 min-w-0">
											<h4 className="font-display font-medium text-white mb-0.5">
												{t('decorations')}
											</h4>
											<p className="text-xs text-gray-400 font-display font-light">
												{t('decorationsDescription')}
											</p>
										</div>
										<ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
									</div>
								</Link>

								{/* Custom Calculator - Full Width Bottom Row */}
								<Link
									href="/calculator"
									onMouseEnter={() => handleMouseEnter("/calculator")}
									className="group relative rounded-lg overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 col-span-5 flex"
								>
									<div className="relative z-10 p-4 flex items-center gap-3 w-full bg-gradient-to-r from-primary/5 to-transparent">
										<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
											<Rotate3D className="h-5 w-5 text-primary" />
										</div>
										<div className="flex-1 min-w-0">
											<h4 className="font-display font-medium text-white text-sm">
												{t('calculator')}
											</h4>
											<p className="text-xs text-gray-400 font-display font-light">
												{t('calculatorDescription')}
											</p>
										</div>
										<ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
									</div>
								</Link>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}