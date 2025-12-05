// src/app/admin/settings/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Settings, User, Database, ExternalLink } from "lucide-react";
import { AppearanceSettings } from "./_components/AppearanceSettings";
import { ProfileSettings } from "./_components/ProfileSettings";
import { SecuritySettings } from "./_components/SecuritySettings";

export default function AdminSettingsPage() {
	// Mock data - replace with real auth when ready
	const adminUser = {
		name: "Ivan",
		email: "ivan@aquadecor.com",
		role: "Owner",
		lastLogin: new Date().toLocaleDateString(),
	};

	const systemInfo = {
		version: "1.0.0",
		environment: process.env.NODE_ENV,
		database: "PostgreSQL",
		lastBackup: "2 hours ago",
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="space-y-2">
				<div className="flex items-center gap-3">
					<Settings className="h-8 w-8 text-primary" />
					<h1 className="text-4xl font-display font-extralight tracking-tight">
						Admin Settings
					</h1>
				</div>
				<p className="text-muted-foreground font-display font-light text-lg">
					Configure your admin panel and account
				</p>
			</div>

			<div className="grid gap-8 lg:grid-cols-2">
				{/* Left Column */}
				<div className="space-y-6">
					{/* Profile Settings Component */}
					<ProfileSettings user={adminUser} />

					{/* Security Settings Component */}
					<SecuritySettings />

					{/* Admin Info */}
					<Card className="border-2">
						<CardHeader>
							<div className="flex items-center gap-2">
								<User className="h-5 w-5 text-primary" />
								<CardTitle className="font-display font-normal">Admin Info</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-start justify-between">
								<div className="space-y-1">
									<p className="font-display font-normal text-lg">{adminUser.name}</p>
									<p className="text-sm text-muted-foreground font-display font-light">
										{adminUser.email}
									</p>
								</div>
								<Badge className="font-display font-light">{adminUser.role}</Badge>
							</div>

							<Separator />

							<div className="space-y-3">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground font-display font-light">
										Last Login
									</span>
									<span className="font-display font-light">{adminUser.lastLogin}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground font-display font-light">
										Session Status
									</span>
									<Badge variant="secondary" className="font-display font-light text-xs">
										Active
									</Badge>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right Column */}
				<div className="space-y-6">
					{/* Appearance Component */}
					<AppearanceSettings />

					{/* System Info */}
					<Card className="border-2">
						<CardHeader>
							<div className="flex items-center gap-2">
								<Database className="h-5 w-5 text-primary" />
								<CardTitle className="font-display font-normal">System Information</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-3 text-sm">
								<div className="flex justify-between">
									<span className="text-muted-foreground font-display font-light">
										Version
									</span>
									<span className="font-display font-light">{systemInfo.version}</span>
								</div>
								<Separator />
								<div className="flex justify-between">
									<span className="text-muted-foreground font-display font-light">
										Environment
									</span>
									<Badge variant="secondary" className="font-display font-light text-xs">
										{systemInfo.environment}
									</Badge>
								</div>
								<Separator />
								<div className="flex justify-between">
									<span className="text-muted-foreground font-display font-light">
										Database
									</span>
									<span className="font-display font-light">{systemInfo.database}</span>
								</div>
								<Separator />
								<div className="flex justify-between">
									<span className="text-muted-foreground font-display font-light">
										Last Backup
									</span>
									<span className="font-display font-light">{systemInfo.lastBackup}</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Quick Links */}
					<Card className="border-2">
						<CardHeader>
							<CardTitle className="font-display font-normal">External Services</CardTitle>
							<CardDescription className="font-display font-light">
								Quick access to service dashboards
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<Button
								variant="outline"
								className="w-full justify-between rounded-full"
								asChild
							>
								<a
									href="https://dashboard.stripe.com"
									target="_blank"
									rel="noopener noreferrer"
								>
									<span className="font-display font-light">Stripe Dashboard</span>
									<ExternalLink className="h-4 w-4" />
								</a>
							</Button>

							<Button
								variant="outline"
								className="w-full justify-between rounded-full"
								asChild
							>
								<a
									href="https://supabase.com/dashboard"
									target="_blank"
									rel="noopener noreferrer"
								>
									<span className="font-display font-light">Supabase Console</span>
									<ExternalLink className="h-4 w-4" />
								</a>
							</Button>

							<Button
								variant="outline"
								className="w-full justify-between rounded-full"
								asChild
							>
								<a
									href="https://vercel.com/dashboard"
									target="_blank"
									rel="noopener noreferrer"
								>
									<span className="font-display font-light">Vercel Dashboard</span>
									<ExternalLink className="h-4 w-4" />
								</a>
							</Button>
						</CardContent>
					</Card>

					{/* Danger Zone */}
					<Card className="border-2 border-destructive/50">
						<CardHeader>
							<CardTitle className="font-display font-normal text-destructive">
								Danger Zone
							</CardTitle>
							<CardDescription className="font-display font-light">
								Irreversible and destructive actions
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<Button
								variant="outline"
								className="w-full rounded-full border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
								disabled
							>
								Clear All Cache
							</Button>
							<Button
								variant="outline"
								className="w-full rounded-full border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
								disabled
							>
								Reset Database
							</Button>
							<p className="text-xs text-muted-foreground font-display font-light">
								Contact developer before performing destructive actions
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}