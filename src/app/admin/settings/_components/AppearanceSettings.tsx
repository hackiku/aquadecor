// src/app/admin/settings/_components/AppearanceSettings.tsx
"use client";

import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Palette, Check } from "lucide-react";
import { useEffect, useState } from "react";

export function AppearanceSettings() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Card className="border-2">
				<CardHeader>
					<div className="flex items-center gap-2">
						<Palette className="h-5 w-5 text-primary" />
						<CardTitle className="font-display font-normal">Appearance</CardTitle>
					</div>
					<CardDescription className="font-display font-light">
						Customize admin panel theme
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="h-32 animate-pulse bg-muted rounded-lg" />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="border-2">
			<CardHeader>
				<div className="flex items-center gap-2">
					<Palette className="h-5 w-5 text-primary" />
					<CardTitle className="font-display font-normal">Appearance</CardTitle>
				</div>
				<CardDescription className="font-display font-light">
					Customize admin panel theme
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label className="font-display font-normal text-sm">Theme</Label>
					<div className="grid grid-cols-3 gap-3">
						<Button
							variant={theme === "light" ? "default" : "outline"}
							className="h-20 rounded-xl relative"
							onClick={() => setTheme("light")}
						>
							<div className="text-center">
								<div className="mb-1 text-xs font-display font-light">Light</div>
								{theme === "light" && (
									<Check className="h-4 w-4 absolute top-2 right-2" />
								)}
							</div>
						</Button>

						<Button
							variant={theme === "dark" ? "default" : "outline"}
							className="h-20 rounded-xl relative"
							onClick={() => setTheme("dark")}
						>
							<div className="text-center">
								<div className="mb-1 text-xs font-display font-light">Dark</div>
								{theme === "dark" && (
									<Check className="h-4 w-4 absolute top-2 right-2" />
								)}
							</div>
						</Button>

						<Button
							variant={theme === "system" ? "default" : "outline"}
							className="h-20 rounded-xl relative"
							onClick={() => setTheme("system")}
						>
							<div className="text-center">
								<div className="mb-1 text-xs font-display font-light">System</div>
								{theme === "system" && (
									<Check className="h-4 w-4 absolute top-2 right-2" />
								)}
							</div>
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}