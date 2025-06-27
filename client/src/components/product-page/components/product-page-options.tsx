
export function ProductOption({
	name,
	values,
}: {
	name: string;
	values: { value: string; image_url: string | null }[];
}) {
	return (
		<div>
			<div className="font-normal text-[14px] uppercase mb-2">
				<span className="text-[#667085]">{name}:</span>
			</div>
			<div className="flex items-center flex-wrap gap-2">
				{values.map(({ value, image_url }, i) =>
					image_url ? (
						<div
							key={i}
							className="w-[70px] h-[70px] border border-[#EAECF0] rounded-[10px] flex items-center justify-center cursor-pointer"
						>
							<img src={image_url} alt={value} className="h-[55px] select-none" draggable={false} />
						</div>
					) : (
						<div
							key={i}
							className="p-2 border border-[#EAECF0] rounded-[10px] py-[8px] px-[16px] flex items-center justify-center cursor-pointer"
						>
							{value}
						</div>
					)
				)}
			</div>
		</div>
	);
}
