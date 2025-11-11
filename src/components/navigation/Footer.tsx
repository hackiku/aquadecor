// src/components/navigation/Footer.tsx

import Link from "next/link";

export function Footer() {
	return (
		<footer className="border-t bg-background">
			<div className="container px-4 py-12 md:py-16">
				<div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Shop</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li><Link href="/store" className="hover:text-foreground">All Products</Link></li>
							<li><Link href="/store/backgrounds" className="hover:text-foreground">3D Backgrounds</Link></li>
							<li><Link href="/store/decorations" className="hover:text-foreground">Decorations</Link></li>
						</ul>
					</div>

					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Company</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li><Link href="/about" className="hover:text-foreground">About Us</Link></li>
							<li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
							<li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
						</ul>
					</div>

					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Support</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
							<li><Link href="/shipping" className="hover:text-foreground">Shipping</Link></li>
							<li><Link href="/returns" className="hover:text-foreground">Returns</Link></li>
						</ul>
					</div>

					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Legal</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
							<li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
						</ul>
					</div>
				</div>

				<div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
					<p>&copy; {new Date().getFullYear()} Aquadecor. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}