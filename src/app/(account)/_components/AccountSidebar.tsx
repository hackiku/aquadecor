// src/app/(account)/_components/AccountSidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	User,
	Package,
	Heart,
	MapPin,
	CreditCard,
	LogOut,
	LayoutDashboard
} from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
const navigation = [
	{ name: "Overview", href: "/account", icon: LayoutDashboard },
	{ name: "My Orders", href: "/account/orders", icon: Package },
	{ name: "Wishlist", href: "/account/wishlist", icon: Heart },
	{ name: "Addresses", href: "/account/addresses", icon: MapPin },
	{ name: "Settings", href: "/account/settings", icon: User },
	// { name: "Saved Cards", href: "/account/billing", icon: CreditCard }, // Usually handled by Stripe, maybe hide for now
];

export function AccountSidebar({ className }: { className?: string }) {
	const pathname = usePathname();

	return (
		<nav className={cn("space-y-1", className)}>
			{navigation.map((item) => {
				const isActive = pathname === item.href;
				return (
					<Link
						key={item.name}
						href={item.href}
						className={cn(
							"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display font-medium transition-colors",
							isActive
								? "bg-primary/10 text-primary"
								: "text-muted-foreground hover:bg-muted hover:text-foreground"
						)}
					>
						<item.icon className="h-4 w-4" />
						{item.name}
					</Link>
				);
			})}

			<div className="pt-4 mt-4 border-t">
				<button
					className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display font-medium text-red-600/80 hover:bg-red-50 hover:text-red-700 transition-colors"
					onClick={() => console.log("Logout")}
				>
					<LogOut className="h-4 w-4" />
					Sign out
				</button>
			</div>
		</nav>
	);
}