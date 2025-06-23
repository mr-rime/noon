import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/ui/dropzone";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type OptionType = "text" | "image";

type ProductOption = {
    name: string;
    type: OptionType;
    value: string | File | null;
};

export function AddOptionSection() {
    const [options, setOptions] = useState<ProductOption[]>([]);

    const handleOptionChange = (index: number, key: keyof ProductOption, value: string | File | null) => {
        setOptions(prev =>
            prev.map((opt, i) => (i === index ? { ...opt, [key]: value } : opt))
        );
    };


    const addOption = () => {
        setOptions(prev => [...prev, { name: "", type: "text", value: "" }]);
    };

    const removeOption = (index: number) => {
        setOptions(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold">Product Options</h3>
                <Button
                    type="button"
                    onClick={addOption}
                    className="flex items-center gap-1 h-[40px]"
                >
                    <Plus className="w-4 h-4" />
                    Add Option
                </Button>
            </div>

            {options.map((option, index) => (
                <div
                    key={index}
                    className="border border-[#E2E5F1] p-4 rounded-lg mb-3 space-y-3"
                >
                    <Input
                        labelContent="Option Name"
                        placeholder="e.g. Color or Size"
                        value={option.name}
                        onChange={e =>
                            handleOptionChange(index, "name", e.target.value)
                        }
                    />
                    <Select
                        labelContent="Type"
                        options={[
                            { label: "Text", value: "text" },
                            { label: "Image", value: "image" },
                        ]}
                        onChange={value =>
                            handleOptionChange(index, "type", value)
                        }
                    />

                    {option.type === "text" ? (
                        <Input
                            labelContent="Value"
                            placeholder="Enter value (e.g. Red, Large)"
                            value={option.value as string}
                            onChange={e =>
                                handleOptionChange(index, "value", e.target.value)
                            }
                        />
                    ) : (
                        <div className="flex flex-col gap-1">
                            <label className="text-sm">Upload Image</label>
                            <Dropzone
                                accept="image/*"
                                onFilesDrop={files =>
                                    handleOptionChange(index, "value", files?.[0] || null)
                                }
                            />
                        </div>
                    )}

                    <Button
                        type="button"
                        onClick={() => removeOption(index)}
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
