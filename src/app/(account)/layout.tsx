// src/app/(account)/account/layout.tsx

import { AccountSidebar } from "./_components/AccountSidebar";
export default function AccountLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="container px-4 py-8 md:py-12 max-w-7xl mx-auto">
			<div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
				{/* Sidebar - Hidden on mobile, handled by MobileNav inside the content area if needed,
or we use a sticky sidebar approach */}
				<aside className="hidden lg:block w-64 shrink-0">
					<div className="sticky top-24">
						<div className="mb-6 px-2">
							<h2 className="font-display font-medium text-lg">My Account</h2>
							<p className="text-sm text-muted-foreground font-display font-light">
								Welcome back, Branka
							</p>
						</div>
						<AccountSidebar />
					</div>
				</aside>
				{/* Main Content */}
				<main className="flex-1 min-w-0">
					{children}
				</main>
			</div>
		</div>
	);
}

