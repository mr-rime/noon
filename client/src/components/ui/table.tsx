import type React from "react";
import { useState } from "react";

type Column<T> = {
	key: keyof T;
	header: string;
	render?: (row: T) => React.ReactNode;
	sortable?: boolean;
};

type TableProps<T> = {
	data: T[];
	columns: Column<T>[];
	pageSize?: number;
	currentPage?: number;
	totalItems?: number;
	onPageChange?: (page: number) => void;
	onRowClick?: (row: T) => void;
};

export function Table<T extends object>({
	data,
	columns,
	pageSize = 10,
	currentPage: externalCurrentPage = 1,
	totalItems,
	onPageChange,
	onRowClick,
}: TableProps<T>) {
	const [sortConfig, setSortConfig] = useState<{
		key: keyof T;
		direction: "asc" | "desc";
	} | null>(null);

	// Use internal state if pagination is controlled internally
	const [internalCurrentPage, setInternalCurrentPage] = useState(1);
	const isControlled = onPageChange !== undefined;
	const currentPage = isControlled ? externalCurrentPage : internalCurrentPage;

	const handleSort = (key: keyof T) => {
		setSortConfig((prev) => {
			if (!prev || prev.key !== key) return { key, direction: "asc" };
			return {
				key,
				direction: prev.direction === "asc" ? "desc" : "asc",
			};
		});
	};

	const sortedData = sortConfig
		? [...data].sort((a, b) => {
				const valA = a[sortConfig.key];
				const valB = b[sortConfig.key];
				if (typeof valA === "number" && typeof valB === "number") {
					return sortConfig.direction === "asc" ? valA - valB : valB - valA;
				}
				return sortConfig.direction === "asc"
					? String(valA).localeCompare(String(valB))
					: String(valB).localeCompare(String(valA));
			})
		: data;

	const handlePageChange = (page: number) => {
		if (isControlled) {
			onPageChange(page);
		} else {
			setInternalCurrentPage(page);
		}
	};

	const totalPages = Math.ceil((totalItems || data.length) / pageSize);

	return (
		<div className="w-full overflow-x-auto rounded-2xl">
			<table className="min-w-full divide-gray-200">
				<thead className="bg-[#F9F9F9]">
					<tr>
						{columns.map((col) => (
							<th
								key={String(col.key)}
								onClick={() => col.sortable && handleSort(col.key)}
								className={`text-left font-bold px-4 py-2 text-[#737373] cursor-${
									col.sortable ? "pointer" : "default"
								}`}
							>
								{col.header}
								{sortConfig?.key === col.key && (
									<span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
								)}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-100">
					{sortedData.map((row, i) => (
						<tr
							key={i}
							className={`hover:bg-gray-50 ${onRowClick ? "cursor-pointer" : ""}`}
							onClick={() => onRowClick?.(row)}
						>
							{columns.map((col) => (
								<td key={String(col.key)} className="px-4 py-2 text-sm">
									{col.render ? col.render(row) : String(row[col.key])}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>

			<div className="flex items-center justify-between p-4 text-sm">
				<div>
					Page {currentPage} of {totalPages}
				</div>
				<div className="space-x-2">
					<button
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
						className="px-3 py-1 cursor-pointer rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
					>
						Prev
					</button>
					<button
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
						className="px-3 py-1 cursor-pointer rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
}
