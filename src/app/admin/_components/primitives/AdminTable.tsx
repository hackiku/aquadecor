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
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

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
}

export function AdminTable<T extends Record<string, any>>({
	columns,
	data,
	onRowClick,
	searchable = true,
	searchPlaceholder = "Search...",
}: AdminTableProps<T>) {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

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
							className="pl-9"
						/>
					</div>
				</div>
			)}

			{/* Table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							{columns.map((column) => (
								<TableHead key={String(column.accessorKey)}>
									{column.header}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{currentData.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results found.
								</TableCell>
							</TableRow>
						) : (
							currentData.map((row, rowIndex) => (
								<TableRow
									key={rowIndex}
									className={onRowClick ? "cursor-pointer" : ""}
									onClick={() => handleRowClick(row)}
								>
									{columns.map((column) => (
										<TableCell key={String(column.accessorKey)}>
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
			{totalPages > 1 && (
				<div className="flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)}{" "}
						of {filteredData.length} results
					</p>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
							disabled={currentPage === 1}
						>
							<ChevronLeft className="h-4 w-4" />
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
									<>
										{index > 0 && array[index - 1]! < page - 1 && (
											<span
												key={`ellipsis-${page}`}
												className="px-2 text-muted-foreground"
											>
												...
											</span>
										)}
										<Button
											key={page}
											variant={currentPage === page ? "default" : "outline"}
											size="sm"
											onClick={() => setCurrentPage(page)}
										>
											{page}
										</Button>
									</>
								))}
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
							disabled={currentPage === totalPages}
						>
							Next
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}