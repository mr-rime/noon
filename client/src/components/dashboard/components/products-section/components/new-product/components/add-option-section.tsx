import { useMutation } from "@apollo/client";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/ui/dropzone";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { UPLOAD_FILE } from "@/graphql/upload-file";
import { useProductStore } from "@/store/create-product-store";

export function AddOptionSection() {
	const [uploadImage] = useMutation(UPLOAD_FILE);
	const options = useProductStore((state) => state.product.productOptions);
	const setProduct = useProductStore((state) => state.setProduct);
	const addOption = useProductStore((state) => state.addOption);

	const handleOptionChange = (index: number, key: keyof (typeof options)[number], value: string | File | null) => {
		const updatedOptions = [...options];
		updatedOptions[index] = { ...updatedOptions[index], [key]: value };
		setProduct({ productOptions: updatedOptions });
	};

	const handleAddOption = () => {
		addOption({ name: "", type: "link", value: "", image_url: "" });
	};

	const handleRemoveOption = (index: number) => {
		const updatedOptions = options.filter((_, i) => i !== index);
		setProduct({ productOptions: updatedOptions });
	};

	const handleImageDrop = async (files: File[], index: number) => {
		if (files.length === 0) return;
		const { data } = await uploadImage({ variables: { file: files[0] } });
		if (data.uploadImage) {
			handleOptionChange(index, "image_url", data.uploadImage.url);
		}
	};

	return (
		<div>
			<div className="flex max-md:flex-col items-center justify-between mb-5">
				<h3 className="text-lg font-semibold">Product Options</h3>
			</div>

			{options.map((option, index) => (
				<div key={index} className="border border-[#E2E5F1] p-4 rounded-lg mb-3 space-y-3">
					<Input
						labelContent="Option Name"
						placeholder="e.g. Color or Size"
						value={option.name}
						onChange={(e) => handleOptionChange(index, "name", e.target.value)}
					/>
					<Select
						labelContent="Type"
						options={[
							{ label: "Text", value: "text" },
							{ label: "Image", value: "image" },
						]}
						defaultValue={option.type}
						onChange={(value) => handleOptionChange(index, "type", value)}
					/>

					{option.type === "link" ? (
						<Input
							labelContent="Value"
							placeholder="Enter value (e.g. Red, Large)"
							value={option.value as string}
							onChange={(e) => handleOptionChange(index, "value", e.target.value)}
						/>
					) : (
						<div className="flex flex-col gap-1">
							<Input
								labelContent="Value"
								placeholder="Enter value (e.g. Red, Large)"
								value={option.value as string}
								onChange={(e) => handleOptionChange(index, "value", e.target.value)}
							/>

							<div className="mt-3">
								<label className="text-sm">Upload Image</label>
								<Dropzone accept="image/*" onFilesDrop={(files) => handleImageDrop(files, index)} />
							</div>
							{option.image_url && (
								<div className="mt-2">
									<img src={option.image_url} alt="Option preview" className="h-20 w-20 object-cover rounded" />
								</div>
							)}
						</div>
					)}

					<Button
						type="button"
						onClick={() => handleRemoveOption(index)}
						className="flex items-center justify-center max-md:w-full gap-1 bg-red-500 hover:bg-red-600 h-[40px]"
					>
						<Trash2 size={20} />
						Remove
					</Button>
				</div>
			))}
			<Button
				type="button"
				onClick={handleAddOption}
				className="flex items-center gap-1 h-[40px] w-full max-w-[220px] max-md:w-full max-md:mt-3 justify-center"
			>
				<Plus className="w-4 h-4" />
				Add Option
			</Button>
		</div>
	);
}
