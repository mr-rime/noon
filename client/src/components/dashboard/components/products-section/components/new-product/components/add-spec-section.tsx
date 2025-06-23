import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProductStore } from "@/store/create-product-store";
import { Plus, Trash2 } from "lucide-react";

export function AddSpecSection() {
    const {
        product,
        setProduct,
        addSpecification
    } = useProductStore();

    const specs = product.productSpecifications;

    const handleSpecChange = (
        index: number,
        key: keyof typeof specs[number],
        value: string
    ) => {
        const updatedSpecs = [...specs];
        updatedSpecs[index] = { ...updatedSpecs[index], [key]: value };
        setProduct({ productSpecifications: updatedSpecs });
    };

    const handleAddSpec = () => {
        addSpecification({ spec_name: "", spec_value: "" });
    };

    const handleRemoveSpec = (index: number) => {
        const updatedSpecs = specs.filter((_, i) => i !== index);
        setProduct({ productSpecifications: updatedSpecs });
    };

    return (
        <div>
            <div className="flex max-md:flex-col items-center justify-between mb-5">
                <h3 className="text-lg font-semibold">Product Specifications</h3>
            </div>

            {specs.map((spec, index) => (
                <div
                    key={index}
                    className="border border-[#E2E5F1] p-4 rounded-lg mb-3 space-y-3"
                >
                    <Input
                        labelContent="Specification Name"
                        placeholder="e.g. RAM, Storage"
                        value={spec.spec_name}
                        onChange={e =>
                            handleSpecChange(index, "spec_name", e.target.value)
                        }
                    />
                    <Input
                        labelContent="Specification Value"
                        placeholder="e.g. 8GB, 128GB"
                        value={spec.spec_value}
                        onChange={e =>
                            handleSpecChange(index, "spec_value", e.target.value)
                        }
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
