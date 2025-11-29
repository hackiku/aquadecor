// src/components/navigation/ResourcesMegaMenu.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Wrench, Headphones, CircleHelp, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { resourceLinks } from "~/data/navigation";

interface ResourcesMegaMenuProps {
	router: AppRouterInstance;
}

const iconMap: Record<string, any> = {
	wrench: Wrench,
	headphones: Headphones,
	"circle-help": CircleHelp,
	truck: Truck,
};

export function ResourcesMegaMenu({ router }: ResourcesMegaMenuProps) {
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
				Resources
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
						className="absolute top-full right-0 mt-2 w-[320px] bg-zinc-900 border border-white/10 rounded-lg shadow-2xl overflow-hidden"
					>
						<div className="p-2">
							{resourceLinks.map((resource, index) => {
								const Icon = resource.icon ? iconMap[resource.icon] : null;

								return (
									<motion.div
										key={resource.href}
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.05 }}
									>
										<Link
											href={resource.href}
											onMouseEnter={() => handleMouseEnter(resource.href)}
											className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
										>
											{Icon && (
												<div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
													<Icon className="h-5 w-5 text-blue-400" />
												</div>
											)}
											<div className="flex-1 min-w-0">
												<h4 className="font-display font-normal text-white mb-0.5">
													{resource.label}
												</h4>
												<p className="text-xs text-gray-400 font-display font-light leading-relaxed">
													{resource.description}
												</p>
											</div>
										</Link>
									</motion.div>
								);
							})}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}