import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type ProductSpecification = {
    spec_name: string;
    spec_value: string;
};


export function AddSpecSection() {
    const [specs, setSpecs] = useState<ProductSpecification[]>([]);


    const handleSpecChange = (index: number, key: keyof ProductSpecification, value: string) => {
        setSpecs(prev =>
            prev.map((spec, i) => (i === index ? { ...spec, [key]: value } : spec))
        );
    };

    const addSpec = () => {
        setSpecs(prev => [...prev, { spec_name: "", spec_value: "" }]);
    };

    const removeSpec = (index: number) => {
        setSpecs(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold">Product Specifications</h3>
                <Button
                    type="button"
                    onClick={addSpec}
                    className="flex items-center gap-1 h-[40px]"
                >
                    <Plus className="w-4 h-4" />
                    Add Specification
                </Button>
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
                        onClick={() => removeSpec(index)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 h-[40px]"
                    >
                        <Trash2 size={20} />
                        Remove
                    </Button>
                </div>
            ))}
        </div>
    )
}
