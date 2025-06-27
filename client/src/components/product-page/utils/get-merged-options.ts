import type { ProductType } from "@/types";

export function getMergedOptions(productOptions: ProductType["productOptions"]) {
	if (!productOptions) return [];

	const merged = new Map<string, { name: string; values: { value: string; image_url: string | null }[] }>();

	for (const option of productOptions) {
		if (merged.has(option.name)) {
			merged.get(option.name)!.values.push({ value: option.value, image_url: option.image_url });
		} else {
			merged.set(option.name, {
				name: option.name,
				values: [{ value: option.value, image_url: option.image_url }],
			});
		}
	}

	for (const opt of merged.values()) {
		const seen = new Set();
		opt.values = opt.values.filter(({ value, image_url }) => {
			const key = `${value}-${image_url}`;
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});
	}

	return Array.from(merged.values());
}
