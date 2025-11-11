// src/app/admin/_components/primitives/AdminCard.tsx

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

interface AdminCardProps {
	title?: string;
	description?: string;
	children: React.ReactNode;
	className?: string;
}

export function AdminCard({
	title,
	description,
	children,
	className,
}: AdminCardProps) {
	return (
		<Card className={className}>
			{(title || description) && (
				<CardHeader>
					{title && <CardTitle>{title}</CardTitle>}
					{description && <CardDescription>{description}</CardDescription>}
				</CardHeader>
			)}
			<CardContent className={title || description ? "" : "pt-6"}>
				{children}
			</CardContent>
		</Card>
	);
}