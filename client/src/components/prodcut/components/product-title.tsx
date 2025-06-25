export function ProductTitle({ name }: { name: string }) {
	return <h2 className="w-full font-semibold text-[13px] md:text-[14px] mt-2 line-clamp-3 leading-[1.2]">{name}</h2>;
}
