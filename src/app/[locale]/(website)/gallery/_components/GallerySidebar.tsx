// src/app/gallery/_components/GallerySidebar.tsx

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
	ChevronDown,
	Layers,
	Package,
	Image as ImageIcon,
	Filter,
	X
} from "lucide-react";
import { cn } from "~/lib/utils";

interface GallerySidebarProps {
	selectedCategory?: string;
	onSelectCategory: (id?: string) => void;
	// Future props for other filters
	// selectedProduct?: string;
	// onSelectProduct: (id?: string) => void;
	// selectedUsage?: string;
	// onSelectUsage: (type?: string) => void;
}

export function GallerySidebar({
	selectedCategory,
	onSelectCategory
}: GallerySidebarProps) {
	// Fetch data
	const { data: categories } = api.media.getCategories.useQuery();

	// Section states
	const [sectionsOpen, setSectionsOpen] = useState({
		categories: true,
		products: false, // Placeholder for future
		usage: true,
	});

	const toggleSection = (key: keyof typeof sectionsOpen) => {
		setSectionsOpen(prev => ({ ...prev, [key]: !prev[key] }));
	};

	return (
		<div className="w-full lg:w-64 flex-shrink-0 space-y-8 sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide pb-12">

			{/* Mobile Filter Toggle (Visible only on mobile/tablet) */}
			<div className="lg:hidden flex items-center justify-between">
				<h3 className="font-display font-medium text-lg">Filters</h3>
				<Button variant="ghost" size="sm">
					<Filter className="h-4 w-4 mr-2" />
					Expand
				</Button>
			</div>

			{/* Desktop Sidebar Content */}
			<div className="hidden lg:block space-y-8">

				{/* Active Filters Clear */}
				{selectedCategory && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
					>
						<span className="text-sm font-display font-medium">Active Filters</span>
						<Button
							variant="ghost"
							size="xs"
							onClick={() => onSelectCategory(undefined)}
							className="h-6 px-2 text-xs hover:bg-destructive/10 hover:text-destructive"
						>
							Clear All
						</Button>
					</motion.div>
				)}

				{/* 1. Usage Types (General vs Product) */}
				<FilterSection
					title="Image Type"
					icon={ImageIcon}
					isOpen={sectionsOpen.usage}
					onToggle={() => toggleSection("usage")}
				>
					<div className="space-y-1">
						{/* Hardcoded for now, can be dynamic */}
						{["All Images", "Customer Setups", "Product Details", "General"].map((type) => (
							<Button
								key={type}
								variant="ghost"
								size="sm"
								className={cn(
									"w-full justify-start font-display font-light",
									type === "All Images" && !selectedCategory && "bg-primary/5 text-primary font-medium"
								)}
							>
								{type}
							</Button>
						))}
					</div>
				</FilterSection>

				{/* 2. Categories */}
				<FilterSection
					title="Categories"
					icon={Layers}
					isOpen={sectionsOpen.categories}
					onToggle={() => toggleSection("categories")}
				>
					<div className="space-y-1 relative">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onSelectCategory(undefined)}
							className={cn(
								"w-full justify-start font-display font-light",
								!selectedCategory && "bg-primary/5 text-primary font-medium"
							)}
						>
							All Categories
						</Button>

						{categories?.slice(0, 8).map((cat) => (
							<Button
								key={cat.id}
								variant="ghost"
								size="sm"
								onClick={() => onSelectCategory(cat.id)}
								className={cn(
									"w-full justify-start justify-between font-display font-light",
									selectedCategory === cat.id && "bg-primary/5 text-primary font-medium"
								)}
							>
								<span className="truncate">{cat.name}</span>
								<Badge variant="secondary" className="ml-2 text-[10px] h-5 px-1.5 min-w-[20px] justify-center bg-muted">
									{cat.imageCount}
								</Badge>
							</Button>
						))}

						{/* Fade & More Button */}
						{(categories?.length ?? 0) > 8 && (
							<div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none flex items-end justify-center pb-1">
								<span className="text-xs text-muted-foreground font-display cursor-pointer pointer-events-auto hover:text-primary">
									+ {(categories?.length ?? 0) - 8} more
								</span>
							</div>
						)}
					</div>
				</FilterSection>

				{/* 3. Products (Placeholder for future) */}
				<FilterSection
					title="Products"
					icon={Package}
					isOpen={sectionsOpen.products}
					onToggle={() => toggleSection("products")}
				>
					<p className="text-sm text-muted-foreground font-display font-light px-2">
						Select a category to see products
					</p>
				</FilterSection>

			</div>
		</div>
	);
}

// Reusable Section Component
function FilterSection({
	title,
	icon: Icon,
	isOpen,
	onToggle,
	children
}: {
	title: string;
	icon: any;
	isOpen: boolean;
	onToggle: () => void;
	children: React.ReactNode;
}) {
	return (
		<div className="space-y-3">
			<button
				onClick={onToggle}
				className="flex items-center justify-between w-full group"
			>
				<div className="flex items-center gap-2 text-foreground/80 group-hover:text-primary transition-colors">
					<Icon className="h-4 w-4" />
					<span className="font-display font-medium text-sm tracking-wide uppercase">{title}</span>
				</div>
				<ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
			</button>

			<AnimatePresence initial={false}>
				{isOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="overflow-hidden"
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}