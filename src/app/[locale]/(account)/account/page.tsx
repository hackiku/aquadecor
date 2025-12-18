// src/app/[locale]/(account)/account/page.tsx
"use client";

import { MobileAccountNav } from "./_components/MobileAccountNav";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Package, Heart, MapPin, Settings, Loader2 } from "lucide-react";
import { api } from "~/trpc/react";
import { useTranslations } from "next-intl";
import { Link } from "~/i18n/navigation";

export default function AccountOverviewPage() {
	const { data: profile, isLoading } = api.account.getProfile.useQuery();
	const { data: addresses } = api.account.address.getAll.useQuery();

	const t = useTranslations("account.overview");
	const tNav = useTranslations("account.nav");

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	const firstName = profile?.name?.split(" ")[0] || null;
	const greeting = firstName ? t("greeting", { name: firstName }) : t("greetingDefault");
	const defaultAddress = addresses?.find(a => a.isDefault);

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl md:text-3xl font-display font-light">
						{greeting} 👋
					</h1>
					<p className="text-muted-foreground font-display font-light">
						{t("welcomeBack")}
					</p>
				</div>
				<MobileAccountNav />
			</div>

			{/* Quick Stats Grid */}
			<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<Link href="/account/orders">
					<Card className="hover:border-primary/50 transition-colors cursor-pointer">
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<CardTitle className="text-sm font-display font-medium text-muted-foreground">
									{tNav("orders")}
								</CardTitle>
								<Package className="h-4 w-4 text-muted-foreground" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-display font-light">0</div>
							<p className="text-xs text-muted-foreground mt-1">
								{t("stats.totalOrders")}
							</p>
						</CardContent>
					</Card>
				</Link>

				<Link href="/account/wishlist">
					<Card className="hover:border-primary/50 transition-colors cursor-pointer">
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<CardTitle className="text-sm font-display font-medium text-muted-foreground">
									{tNav("wishlist")}
								</CardTitle>
								<Heart className="h-4 w-4 text-muted-foreground" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-display font-light">0</div>
							<p className="text-xs text-muted-foreground mt-1">
								{t("stats.savedItems")}
							</p>
						</CardContent>
					</Card>
				</Link>

				<Link href="/account/addresses">
					<Card className="hover:border-primary/50 transition-colors cursor-pointer">
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<CardTitle className="text-sm font-display font-medium text-muted-foreground">
									{tNav("addresses")}
								</CardTitle>
								<MapPin className="h-4 w-4 text-muted-foreground" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-display font-light">
								{addresses?.length || 0}
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								{t("stats.savedAddresses")}
							</p>
						</CardContent>
					</Card>
				</Link>

				<Link href="/account/settings">
					<Card className="hover:border-primary/50 transition-colors cursor-pointer">
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<CardTitle className="text-sm font-display font-medium text-muted-foreground">
									{tNav("settings")}
								</CardTitle>
								<Settings className="h-4 w-4 text-muted-foreground" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-display font-light">•</div>
							<p className="text-xs text-muted-foreground mt-1">
								{t("stats.accountSettings")}
							</p>
						</CardContent>
					</Card>
				</Link>
			</div>

			{/* Account Info Cards */}
			<div className="grid lg:grid-cols-2 gap-6">
				{/* Profile Card */}
				<Card>
					<CardHeader>
						<CardTitle className="font-display font-medium">
							{t("profile.title")}
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<div className="text-sm text-muted-foreground">
								{t("profile.name")}
							</div>
							<div className="font-display font-light">
								{profile?.name || t("profile.notSet")}
							</div>
						</div>
						<div className="space-y-2">
							<div className="text-sm text-muted-foreground">
								{t("profile.email")}
							</div>
							<div className="font-display font-light">{profile?.email}</div>
						</div>
						{profile?.phone && (
							<div className="space-y-2">
								<div className="text-sm text-muted-foreground">
									{t("profile.phone")}
								</div>
								<div className="font-display font-light">{profile.phone}</div>
							</div>
						)}
						<Button variant="outline" size="sm" className="rounded-full" asChild>
							<Link href="/account/settings">{t("profile.editProfile")}</Link>
						</Button>
					</CardContent>
				</Card>

				{/* Default Address Card */}
				<Card>
					<CardHeader>
						<CardTitle className="font-display font-medium">
							{t("defaultAddress.title")}
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{defaultAddress ? (
							<>
								<div className="text-sm font-display font-light space-y-1">
									<p className="font-medium text-foreground">
										{defaultAddress.firstName} {defaultAddress.lastName}
									</p>
									{defaultAddress.company && (
										<p className="text-muted-foreground">{defaultAddress.company}</p>
									)}
									<p className="text-muted-foreground">
										{defaultAddress.streetAddress1}
									</p>
									{defaultAddress.streetAddress2 && (
										<p className="text-muted-foreground">
											{defaultAddress.streetAddress2}
										</p>
									)}
									<p className="text-muted-foreground">
										{defaultAddress.postalCode} {defaultAddress.city}
									</p>
									<p className="text-muted-foreground">
										{defaultAddress.countryCode}
									</p>
								</div>
								<Button variant="outline" size="sm" className="rounded-full" asChild>
									<Link href="/account/addresses">
										{t("defaultAddress.manageAddresses")}
									</Link>
								</Button>
							</>
						) : (
							<>
								<p className="text-sm text-muted-foreground">
									{t("defaultAddress.noAddress")}
								</p>
								<Button variant="outline" size="sm" className="rounded-full" asChild>
									<Link href="/account/addresses">
										{t("defaultAddress.addAddress")}
									</Link>
								</Button>
							</>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Recent Orders Placeholder */}
			<Card>
				<CardHeader>
					<CardTitle className="font-display font-medium">
						{t("recentOrders.title")}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8 text-muted-foreground">
						<Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
						<p className="font-display font-light">{t("recentOrders.noOrders")}</p>
						<p className="text-sm mt-1">{t("recentOrders.noOrdersText")}</p>
						<Button variant="outline" size="sm" className="rounded-full mt-4" asChild>
							<Link href="/shop">{t("recentOrders.startShopping")}</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}