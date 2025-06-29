import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProductStore } from "@/store/create-product-store";
import type { ProductSpecification } from "@/types";

export function AddSpecSection({ specs: initialSpecs }: { specs: ProductSpecification[] }) {
	const { product, setProduct, addSpecification } = useProductStore();
	const storeSpecs = product.productSpecifications;

	const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

	useEffect(() => {
		if (!hasLoadedInitial && initialSpecs?.length > 0) {
			const specs = initialSpecs.map((spec) => ({
				spec_name: spec.spec_name,
				spec_value: spec.spec_value,
			}));
			setProduct({ productSpecifications: specs });
			setHasLoadedInitial(true);
		}
	}, [initialSpecs, hasLoadedInitial, setProduct]);

	const handleSpecChange = (index: number, key: keyof ProductSpecification, value: string) => {
		const updated = [...storeSpecs];
		updated[index] = { ...updated[index], [key]: value };
		setProduct({ productSpecifications: updated });
	};

	const handleAddSpec = () => {
		addSpecification({ spec_name: "", spec_value: "" });
	};

	const handleRemoveSpec = (index: number) => {
		const updated = storeSpecs.filter((_, i) => i !== index);
		setProduct({ productSpecifications: updated });
	};

	return (
		<div>
			<div className="flex max-md:flex-col items-center justify-between mb-5">
				<h3 className="text-lg font-semibold">Product Specifications</h3>
			</div>

			{storeSpecs.map((spec, index) => (
				<div key={index} className="border border-[#E2E5F1] p-4 rounded-lg mb-3 space-y-3">
					<Input
						labelContent="Specification Name"
						placeholder="e.g. RAM, Storage"
						value={spec.spec_name}
						onChange={(e) => handleSpecChange(index, "spec_name", e.target.value)}
					/>
					<Input
						labelContent="Specification Value"
						placeholder="e.g. 8GB, 128GB"
						value={spec.spec_value}
						onChange={(e) => handleSpecChange(index, "spec_value", e.target.value)}
					/>

					<Button
						type="button"
						onClick={() => handleRemoveSpec(index)}
						className="flex items-center justify-center max-md:w-full gap-1 bg-red-500 hover:bg-red-600 h-[40px]"
					>
						<Trash2 size={20} />
						Remove
					</Button>
				</div>
			))}

			<Button
				type="button"
				onClick={handleAddSpec}
				className="flex items-center justify-center w-full max-w-[220px] max-md:w-full max-md:mt-3 gap-1 h-[40px]"
			>
				<Plus className="w-4 h-4" />
				Add Specification
			</Button>
		</div>
	);
}
