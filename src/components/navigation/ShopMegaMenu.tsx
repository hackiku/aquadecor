// src/components/navigation/ShopMegaMenu.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface ShopMegaMenuProps {
	router: AppRouterInstance;
}

export function ShopMegaMenu({ router }: ShopMegaMenuProps) {
	const [isOpen, setIsOpen] = useState(false);

	const handleMouseEnter = (href: string) => {
		router.prefetch(href);
	};

	return (
		<div
			className="relative"
			onMouseEnter={() => setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
		>
			{/* Trigger */}
			<button className="flex items-center gap-1 text-sm font-normal transition-colors hover:text-blue-400 text-white font-display outline-none">
				Shop
				<ChevronDown
					className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
				/>
			</button>

			{/* Mega Menu Dropdown */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
						className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[500px] bg-zinc-900 border border-white/10 rounded-lg shadow-2xl p-6"
					>
						{/* Product Lines */}
						<div className="mb-6">
							<h3 className="text-xs uppercase tracking-wide text-gray-400 font-display mb-4">
								Product Lines
							</h3>
							<div className="grid grid-cols-2 gap-4">
								{/* 3D Backgrounds */}
								<Link
									href="/shop/3d-backgrounds"
									onMouseEnter={() => handleMouseEnter("/shop/3d-backgrounds")}
									className="group p-4 rounded-lg hover:bg-white/5 transition-colors"
								>
									<div className="flex items-start gap-3">
										<div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
											<span className="text-2xl">🪨</span>
										</div>
										<div>
											<h4 className="font-display font-normal text-white mb-1">
												3D Backgrounds
											</h4>
											<p className="text-xs text-gray-400 font-display font-light">
												Custom-made realistic backgrounds
											</p>
										</div>
									</div>
								</Link>

								{/* Decorations */}
								<Link
									href="/shop/aquarium-decorations"
									onMouseEnter={() => handleMouseEnter("/shop/aquarium-decorations")}
									className="group p-4 rounded-lg hover:bg-white/5 transition-colors"
								>
									<div className="flex items-start gap-3">
										<div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
											<span className="text-2xl">🌿</span>
										</div>
										<div>
											<h4 className="font-display font-normal text-white mb-1">
												Decorations
											</h4>
											<p className="text-xs text-gray-400 font-display font-light">
												Plants, rocks & driftwood
											</p>
										</div>
									</div>
								</Link>
							</div>
						</div>

						{/* Quick Links */}
						<div className="pt-4 border-t border-white/10">
							<div className="flex items-center justify-between gap-4">
								<Link
									href="/shop"
									onMouseEnter={() => handleMouseEnter("/shop")}
									className="text-sm text-gray-400 hover:text-blue-400 transition-colors font-display font-light"
								>
									View All Products
								</Link>
								<Link
									href="/calculator"
									onMouseEnter={() => handleMouseEnter("/calculator")}
									className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-display font-normal"
								>
									<Sparkles className="h-3.5 w-3.5" />
									Custom Designer
								</Link>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}