export function ProductPageTitle({ title, children }: { title: string; children?: React.ReactNode }) {
	return (
		<>
			<h1 className="text-[1.6em] font-semibold text-[#1d2939]">{title}</h1>

			{children}
		</>
	);
}
