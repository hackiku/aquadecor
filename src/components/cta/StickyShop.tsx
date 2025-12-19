// src/components/cta/StickyShop.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Hammer, Shield, Ruler } from "lucide-react";
import { ShopButton } from "./ShopButton";

interface StickyShopProps {
	triggerRef?: React.RefObject<HTMLElement | null>;
}

export function StickyShop({ triggerRef }: StickyShopProps) {
	const locale = useLocale();
	const t = useTranslations('common.trust');
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const internalRef = useRef<HTMLDivElement>(null);

	const targetRef = triggerRef || internalRef;

	const isInView = useInView(targetRef, {
		margin: "-100px 0px -100px 0px",
	});

	useEffect(() => {
		const handleScroll = () => {
			if (isInView) {
				setIsCollapsed(window.scrollY > 300);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [isInView]);

	const showBlurbs = !isCollapsed || isHovered;

	if (!triggerRef) {
		return <div ref={internalRef} className="absolute top-0 left-0 w-full h-px" />;
	}

	const FEATURES = [
		{ icon: Hammer, label: t('handcrafted') },
		{ icon: Shield, label: t('warranty') },
		{ icon: Ruler, label: t('perfectFit') },
	];

	return (
		<AnimatePresence>
			{isInView && (
				<motion.div
					className="fixed bottom-8 right-8 z-50"
					initial={{ opacity: 0, y: 100 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 100 }}
					transition={{ duration: 0.4, ease: "easeOut" }}
				>
					<div
						className="flex items-center gap-6"
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
					>
						{/* Feature Blurbs */}
						<AnimatePresence mode="wait">
							{showBlurbs && (
								<motion.div
									initial={isCollapsed ? { opacity: 0, x: 20, scale: 0.9 } : false}
									animate={{ opacity: 1, x: 0, scale: 1 }}
									exit={{ opacity: 0, x: 20, scale: 0.9 }}
									transition={{ duration: 0.3, ease: "easeOut" }}
									className={`flex ${isCollapsed ? "gap-3" : "gap-6"}`}
								>
									{FEATURES.map((feature, index) => (
										<motion.div
											key={feature.label}
											initial={isCollapsed ? false : { opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.1 }}
											className={`
												flex items-center gap-2 rounded-full
												bg-card/90 backdrop-blur-md border-2 border-border
												shadow-lg
												${isCollapsed ? "px-3 py-2" : "px-4 py-2.5"}
											`}
										>
											<feature.icon className={`text-primary ${isCollapsed ? "h-4 w-4" : "h-5 w-5"}`} />
											<span className={`font-display font-medium text-foreground whitespace-nowrap ${isCollapsed ? "text-xs" : "text-sm"}`}>
												{feature.label}
											</span>
										</motion.div>
									))}
								</motion.div>
							)}
						</AnimatePresence>

						{/* Shop Button */}
						<motion.div
							animate={{
								scale: isCollapsed && !isHovered ? 1.05 : 0.95,
							}}
							transition={{ duration: 0.3 }}
						>
							<ShopButton className="shadow-2xl" />
						</motion.div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}