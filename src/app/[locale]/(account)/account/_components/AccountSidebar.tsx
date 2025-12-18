// src/app/[locale]/account/_components/AccountSidebar.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import {
	User,
	Package,
	Heart,
	MapPin,
	LogOut,
	LayoutDashboard
} from "lucide-react";
import { cn } from "~/lib/utils";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Link } from "~/i18n/navigation";

const navigationKeys = [
	{ key: "overview", href: "/account", icon: LayoutDashboard },
	{ key: "orders", href: "/account/orders", icon: Package },
	{ key: "wishlist", href: "/account/wishlist", icon: Heart },
	{ key: "addresses", href: "/account/addresses", icon: MapPin },
	{ key: "settings", href: "/account/settings", icon: User },
] as const;

export function AccountSidebar({ className }: { className?: string }) {
	const pathname = usePathname();
	const router = useRouter();
	const t = useTranslations("account.nav");
	const tToast = useTranslations("account.toast");

	const handleSignOut = async () => {
		try {
			await signOut({ redirect: false });
			toast.success(tToast("signOutSuccess"));
			router.push("/");
		} catch (error) {
			toast.error(tToast("signOutError"));
		}
	};

	return (
		<nav className={cn("space-y-1", className)}>
			{navigationKeys.map((item) => {
				const isActive = pathname === item.href;
				return (
					<Link
						key={item.key}
						href={item.href}
						className={cn(
							"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display font-medium transition-colors",
							isActive
								? "bg-primary/5 text-primary"
								: "text-muted-foreground hover:bg-muted hover:text-foreground"
						)}
					>
						<item.icon className="h-4 w-4" />
						{t(item.key)}
					</Link>
				);
			})}

			<div className="pt-4 mt-4 border-t">
				<button
					className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display font-medium text-red-600/80 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 transition-colors"
					onClick={handleSignOut}
				>
					<LogOut className="h-4 w-4" />
					{t("signOut")}
				</button>
			</div>
		</nav>
	);
}