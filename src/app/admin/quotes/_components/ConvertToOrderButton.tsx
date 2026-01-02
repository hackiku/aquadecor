// src/app/admin/quotes/[id]/_components/ConvertToOrderButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Wand2, Loader2 } from "lucide-react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

interface ConvertToOrderButtonProps {
	quoteId: string;
}

export function ConvertToOrderButton({ quoteId }: ConvertToOrderButtonProps) {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);

	const convertMutation = api.admin.quote.convertToOrder.useMutation({
		onSuccess: (data) => {
			toast.success("Quote converted to order successfully!");
			router.push(`/admin/orders/${data.orderId}`);
		},
		onError: (error) => {
			toast.error(error.message || "Failed to convert quote to order");
		},
	});

	const handleConvert = () => {
		convertMutation.mutate({ quoteId });
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogTrigger asChild>
				<Button
					className="rounded-full"
					disabled={convertMutation.isPending}
				>
					{convertMutation.isPending ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Converting...
						</>
					) : (
						<>
							<Wand2 className="mr-2 h-4 w-4" />
							Convert to Order
						</>
					)}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="font-display font-normal">
						Convert Quote to Order?
					</AlertDialogTitle>
					<AlertDialogDescription className="font-display font-light">
						This will create a new order with status "pending" and mark this quote as "accepted".
						The customer will need to complete payment separately.
						<br /><br />
						This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="font-display font-light">
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleConvert}
						disabled={convertMutation.isPending}
						className="font-display font-normal"
					>
						{convertMutation.isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Converting...
							</>
						) : (
							"Convert to Order"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}