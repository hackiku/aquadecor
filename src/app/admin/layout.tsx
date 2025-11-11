// src/app/admin/layout.tsx

import { Sidebar } from "./_components/layout/Sidebar";
import { Header } from "./_components/layout/Header";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// TODO: Add auth protection back before production
	// const session = await auth();
	// if (!session?.user) {
	//   redirect("/api/auth/signin");
	// }
	// if (session.user.role !== "admin") {
	//   redirect("/");
	// }

	return (
		<div className="flex min-h-screen">
			<Sidebar />
			<div className="ml-64 flex-1">
				<Header />
				<main className="container py-8">{children}</main>
			</div>
		</div>
	);
}