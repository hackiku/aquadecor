// src/app/[locale]/account/_components/MobileAccountNav.tsx
"use client";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { Menu } from "lucide-react";
import { AccountSidebar } from "./AccountSidebar";
import { useState } from "react";
// Drop this into your page.tsx headers for mobile
export function MobileAccountNav() {
	const [open, setOpen] = useState(false);
	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="outline" size="sm" className="lg:hidden">
					<Menu className="h-4 w-4 mr-2" />
					Menu
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="w-[280px] sm:w-[320px]">
				<div className="py-6">
					<h2 className="font-display font-medium text-lg mb-6 px-2">My Account</h2>
					<div onClick={() => setOpen(false)}>
						<AccountSidebar />
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}