// src/app/admin/_components/primitives/AdminTable.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ChevronLeft, ChevronRight, Search, Loader2 } from "lucide-react";

export interface Column<T = any> {
	header: string;
	accessorKey: keyof T;
	cell?: (row: T) => React.ReactNode;
}

interface AdminTableProps<T = any> {
	columns: Column<T>[];
	data: T[];
	onRowClick?: (row: T) => string | void;
	searchable?: boolean;
	searchPlaceholder?: string;
	pageSize?: number;
	isLoading?: boolean; // <--- Added this prop
}

export function AdminTable<T extends Record<string, any>>({
	columns,
	data,
	onRowClick,
	searchable = true,
	searchPlaceholder = "Search...",
	pageSize = 10,
	isLoading = false, // <--- Default false
}: AdminTableProps<T>) {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);

	const itemsPerPage = pageSize;

	// Filter data based on search
	const filteredData = searchQuery
		? data.filter((row) =>
			Object.values(row).some((value) =>
				String(value).toLowerCase().includes(searchQuery.toLowerCase())
			)
		)
		: data;

	// Pagination
	const totalPages = Math.ceil(filteredData.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentData = filteredData.slice(startIndex, endIndex);

	const handleRowClick = (row: T) => {
		if (!onRowClick) return;
		const result = onRowClick(row);
		if (typeof result === "string") {
			router.push(result);
		}
	};

	return (
		<div className="space-y-4">
			{/* Search */}
			{searchable && (
				<div className="flex items-center gap-2">
					<div className="relative flex-1 max-w-sm">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder={searchPlaceholder}
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value);
								setCurrentPage(1); // Reset to first page on search
							}}
							className="pl-9 font-display font-light"
							disabled={isLoading}
						/>
					</div>
				</div>
			)}

			{/* Table */}
			<div className="rounded-xl border-2 border-border overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow className="bg-muted/50 hover:bg-muted/50">
							{columns.map((column) => (
								<TableHead
									key={String(column.accessorKey)}
									className="font-display font-normal"
								>
									{column.header}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							// Loading State
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-32 text-center"
								>
									<div className="flex flex-col items-center justify-center gap-2">
										<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
										<p className="text-muted-foreground font-display font-light text-sm">
											Loading data...
										</p>
									</div>
								</TableCell>
							</TableRow>
						) : currentData.length === 0 ? (
							// Empty State
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-32 text-center"
								>
									<p className="text-muted-foreground font-display font-light">
										No results found
									</p>
								</TableCell>
							</TableRow>
						) : (
							// Data Rows
							currentData.map((row, rowIndex) => (
								<TableRow
									key={rowIndex}
									className={onRowClick ? "cursor-pointer hover:bg-muted/30" : ""}
									onClick={() => handleRowClick(row)}
								>
									{columns.map((column) => (
										<TableCell
											key={String(column.accessorKey)}
											className="font-display font-light"
										>
											{column.cell
												? column.cell(row)
												: row[column.accessorKey]}
										</TableCell>
									))}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			{!isLoading && totalPages > 1 && (
				<div className="flex items-center justify-between">
					<p className="text-sm text-muted-foreground font-display font-light">
						Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)}{" "}
						of {filteredData.length} results
					</p>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
							disabled={currentPage === 1}
							className="rounded-full font-display font-light"
						>
							<ChevronLeft className="h-4 w-4 mr-1" />
							Previous
						</Button>
						<div className="flex items-center gap-1">
							{Array.from({ length: totalPages }, (_, i) => i + 1)
								.filter(
									(page) =>
										page === 1 ||
										page === totalPages ||
										Math.abs(page - currentPage) <= 1
								)
								.map((page, index, array) => (
									<div key={page} className="contents">
										{index > 0 && array[index - 1]! < page - 1 && (
											<span className="px-2 text-muted-foreground font-display font-light">
												...
											</span>
										)}
										<Button
											variant={currentPage === page ? "default" : "outline"}
											size="sm"
											onClick={() => setCurrentPage(page)}
											className="rounded-full font-display font-light min-w-[36px]"
										>
											{page}
										</Button>
									</div>
								))}
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
							disabled={currentPage === totalPages}
							className="rounded-full font-display font-light"
						>
							Next
							<ChevronRight className="h-4 w-4 ml-1" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}