// src/app/admin/content/page.tsx
"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
	Image,
	HelpCircle,
	FileText,
	ArrowRight,
	Upload,
	MessageSquare,
} from "lucide-react";

export default function ContentOverviewPage() {
	// Get stats for content sections
	const { data: galleryStats } = api.admin.media.getStats.useQuery(); 
	const { data: faqs } = api.admin.faq.getAll.useQuery();

	const contentSections = [
		{
			title: "Gallery",
			description: "Manage product images, marketing photos, and media assets",
			icon: Image,
			href: "/admin/content/gallery",
			stats: [
				{ label: "Images", value: galleryStats?.total ?? 0 },
				{ label: "Storage", value: `${galleryStats?.totalSizeMB ?? 0} MB` },
			],
			color: "text-blue-500",
		},
		{
			title: "FAQ",
			description: "Manage frequently asked questions for different regions",
			icon: HelpCircle,
			href: "/admin/content/faq",
			stats: [
				{ label: "Questions", value: faqs?.length ?? 0 },
				{ label: "Regions", value: 2 }, // ROW + US
			],
			color: "text-green-500",
		},
		{
			title: "Blog Posts",
			description: "Create and manage blog articles (Coming Soon)",
			icon: FileText,
			href: "/admin/content/blog",
			stats: [
				{ label: "Posts", value: 0 },
				{ label: "Drafts", value: 0 },
			],
			color: "text-purple-500",
			disabled: true,
		},
		{
			title: "Testimonials",
			description: "Customer reviews and testimonials (Coming Soon)",
			icon: MessageSquare,
			href: "/admin/content/testimonials",
			stats: [
				{ label: "Reviews", value: 0 },
				{ label: "Featured", value: 0 },
			],
			color: "text-orange-500",
			disabled: true,
		},
	];

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="space-y-2">
				<h1 className="text-4xl font-display font-extralight tracking-tight">
					Content Management
				</h1>
				<p className="text-muted-foreground font-display font-light text-lg">
					Manage images, FAQs, blog posts, and other content
				</p>
			</div>

			{/* Quick Stats */}
			<div className="grid gap-6 md:grid-cols-3">
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Total Images
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">
							{galleryStats?.total ?? 0}
						</p>
					</CardContent>
				</Card>
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							FAQ Items
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">
							{faqs?.length ?? 0}
						</p>
					</CardContent>
				</Card>
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Storage Used
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">
							{galleryStats?.totalSizeMB ?? 0} MB
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Content Sections Grid */}
			<div className="grid gap-6 md:grid-cols-2">
				{contentSections.map((section) => (
					<Link
						key={section.href}
						href={section.href}
						className={section.disabled ? "pointer-events-none" : ""}
					>
						<Card
							className={`border-2 transition-all h-full ${section.disabled
									? "opacity-50 cursor-not-allowed"
									: "hover:border-primary/50 hover:shadow-lg group"
								}`}
						>
							<CardHeader className="space-y-4">
								<div className="flex items-start justify-between">
									<div className="space-y-2 flex-1">
										<div className="flex items-center gap-3">
											<section.icon className={`h-8 w-8 ${section.color}`} />
											<div>
												<h3 className="text-xl font-display font-normal group-hover:text-primary transition-colors">
													{section.title}
												</h3>
												{section.disabled && (
													<Badge variant="secondary" className="font-display font-light text-xs mt-1">
														Coming Soon
													</Badge>
												)}
											</div>
										</div>
										<p className="text-sm text-muted-foreground font-display font-light">
											{section.description}
										</p>
									</div>
									{!section.disabled && (
										<ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
									)}
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									{section.stats.map((stat, idx) => (
										<div key={idx} className="p-3 rounded-lg bg-muted/30 space-y-1">
											<p className="text-xs text-muted-foreground font-display font-light">
												{stat.label}
											</p>
											<p className="text-xl font-display font-light">
												{stat.value}
											</p>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>

			{/* Quick Actions */}
			<div className="pt-8 border-t">
				<h2 className="text-2xl font-display font-light mb-4">Quick Actions</h2>
				<div className="grid gap-4 md:grid-cols-3">
					<Link href="/admin/content/gallery">
						<Card className="border hover:border-primary/50 transition-colors group">
							<CardContent className="p-6 flex items-center justify-between">
								<div className="flex items-center gap-3">
									<Upload className="h-5 w-5 text-primary" />
									<span className="font-display font-light">Upload Image</span>
								</div>
								<ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
							</CardContent>
						</Card>
					</Link>
					<Link href="/admin/content/faq">
						<Card className="border hover:border-primary/50 transition-colors group">
							<CardContent className="p-6 flex items-center justify-between">
								<div className="flex items-center gap-3">
									<HelpCircle className="h-5 w-5 text-primary" />
									<span className="font-display font-light">Add FAQ</span>
								</div>
								<ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
							</CardContent>
						</Card>
					</Link>
					<Link href="/admin/catalog/products">
						<Card className="border hover:border-primary/50 transition-colors group">
							<CardContent className="p-6 flex items-center justify-between">
								<div className="flex items-center gap-3">
									<FileText className="h-5 w-5 text-primary" />
									<span className="font-display font-light">View Products</span>
								</div>
								<ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
							</CardContent>
						</Card>
					</Link>
				</div>
			</div>
		</div>
	);
}