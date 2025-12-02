// src/app/(website)/calculator/layout.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { UnitProvider } from "./_context/UnitContext";
import { createContext, useContext, useState, type ReactNode } from "react";

// Context to manage calculator view state globally
interface CalculatorLayoutContextType {
	isCalculatorExpanded: boolean;
	setIsCalculatorExpanded: (expanded: boolean) => void;
}

const CalculatorLayoutContext = createContext<CalculatorLayoutContextType | undefined>(undefined);

export function useCalculatorLayout() {
	const context = useContext(CalculatorLayoutContext);
	if (!context) {
		throw new Error("useCalculatorLayout must be used within CalculatorLayout");
	}
	return context;
}

export default function CalculatorLayout({ children }: { children: ReactNode }) {
	const [isCalculatorExpanded, setIsCalculatorExpanded] = useState(false);

	return (
		<UnitProvider>
			<CalculatorLayoutContext.Provider value={{ isCalculatorExpanded, setIsCalculatorExpanded }}>
				{/* Animated content wrapper */}
				<motion.div
					animate={{
						marginRight: isCalculatorExpanded ? "28rem" : "0", // 448px (28rem) for calculator width
					}}
					transition={{
						type: "spring",
						stiffness: 300,
						damping: 30,
					}}
					className="will-change-[margin]"
				>
					{children}
				</motion.div>
			</CalculatorLayoutContext.Provider>
		</UnitProvider>
	);
}