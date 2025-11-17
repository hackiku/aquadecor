// src/components/navigation/Breadcrumbs.tsx

import Link from "next/link";

interface BreadcrumbItem {
	label: string;
	href: string;
}

interface BreadcrumbsProps {
	items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
	return (
		<nav className="flex items-center space-x-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
			{items.map((item, index) => {
				const isLast = index === items.length - 1;

				return (
					<div key={item.href} className="flex items-center space-x-2">
						{isLast ? (
							<span className="text-foreground font-medium">{item.label}</span>
						) : (
							<>
								<Link
									href={item.href}
									className="hover:text-foreground transition-colors"
								>
									{item.label}
								</Link>
								<span aria-hidden="true">›</span>
							</>
						)}
					</div>
				);
			})}
		</nav>
	);
}