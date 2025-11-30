// src/app/(account)/layout.tsx

import { AccountSidebar } from "./_components/AccountSidebar";
import { NavWithBanner } from "~/components/navigation/NavWithBanner";
import { Footer } from "~/components/navigation/Footer";

export default function AccountLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<NavWithBanner /> {/* Server component, fetches sale */}

			<main className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-8 lg:py-12">
					<div className="flex flex-col lg:flex-row gap-8">
						{/* Sidebar - Hidden on mobile, shown on desktop */}
						<aside className="hidden lg:block lg:w-64 lg:flex-shrink-0">
							<div className="sticky top-24">
								<AccountSidebar />
							</div>
						</aside>

						{/* Main Content */}
						<div className="flex-1 min-w-0">
							{children}
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</>
	);
}