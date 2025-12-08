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
		// The parent div is the trigger area
		<div
			className="relative h-full flex items-center"
			onMouseEnter={() => setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
		>
			{/* Trigger */}
			<button className="flex items-center gap-1 text-md font-light transition-colors hover:text-blue-400 text-white font-display outline-none h-full">
				Shop
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
						// 🎯 STYLING CHANGES: Aligned left/top, no shadow, clean borders
						className="absolute top-full -left-4 mt-0 pt-2 w-[400px] bg-black border-r border-l border-b border-white/10 rounded-b-lg shadow-xl z-30 overflow-hidden"
					>
						<div className="p-6">
							{/* Product Lines */}
							<div className="mb-6">
								<h3 className="text-xs uppercase tracking-wide text-gray-400 font-display mb-4">
									Product Lines
								</h3>
								<div className="grid grid-cols-1 gap-1">
									{/* 3D Backgrounds */}
									<Link
										href="/shop/3d-backgrounds"
										onMouseEnter={() => handleMouseEnter("/shop/3d-backgrounds")}
										className="group flex items-center p-3 rounded-lg hover:bg-white/5 transition-colors -mx-3"
									>
										<span className="text-2xl mr-3">🪨</span>
										<div>
											<h4 className="font-display font-medium text-white">3D Backgrounds</h4>
											<p className="text-xs text-gray-400 font-display font-light">Custom-made realistic backgrounds</p>
										</div>
									</Link>

									{/* Decorations */}
									<Link
										href="/shop/aquarium-decorations"
										onMouseEnter={() => handleMouseEnter("/shop/aquarium-decorations")}
										className="group flex items-center p-3 rounded-lg hover:bg-white/5 transition-colors -mx-3"
									>
										<span className="text-2xl mr-3">🌿</span>
										<div>
											<h4 className="font-display font-medium text-white">Decorations</h4>
											<p className="text-xs text-gray-400 font-display font-light">Plants, rocks & driftwood</p>
										</div>
									</Link>
								</div>
							</div>

							{/* Quick Links */}
							<div className="pt-4 border-t border-white/10 flex flex-col space-y-2">
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