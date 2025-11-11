// src/components/cta/ShopButton.tsx

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ShopButtonProps {
	href?: string;
	children?: React.ReactNode;
}

export function ShopButton({ href = "/store", children = "Shop All" }: ShopButtonProps) {
	return (
		<Button asChild size="lg" className="group">
			<Link href={href}>
				{children}
				<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
			</Link>
		</Button>
	);
}