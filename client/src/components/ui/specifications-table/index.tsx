export function SpecificationsTable({ children }: { children?: React.ReactNode }) {
	return (
		<div className="w-full">
			<table className="table-fixed w-full">
				<tbody>{children}</tbody>
			</table>
		</div>
	);
}
