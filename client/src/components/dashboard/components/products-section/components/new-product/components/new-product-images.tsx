import { useMutation } from "@apollo/client";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Dropzone } from "@/components/ui/dropzone";
import { Skeleton } from "@/components/ui/skeleton";
import { UPLOAD_FILE } from "@/graphql/upload-file";
import { useProductStore } from "@/store/create-product-store";

type ProductImageFile = {
	file: File;
	imgUrl: string;
	name: string;
	size: string;
	type: string;
	loading: boolean;
};

export function NewProductImages() {
	const [uploadImage] = useMutation(UPLOAD_FILE);
	const [files, setFiles] = useState<ProductImageFile[]>([]);
	const addImage = useProductStore((state) => state.addImage);
	const setProduct = useProductStore((state) => state.setProduct);

	const handleFiles = async (incomingFiles: File[]) => {
		try {
			const existingFileNames = new Set(files.map((f) => f.name));

			const newUniqueFiles = incomingFiles.filter((file) => !existingFileNames.has(file.name));
			if (newUniqueFiles.length === 0) return;

			setFiles((prev) => [
				...prev,
				...newUniqueFiles.map((file) => ({
					file,
					imgUrl: "",
					name: file.name,
					size: "",
					type: file.type,
					loading: true,
				})),
			]);

			const uploadPromises = newUniqueFiles.map(async (file) => {
				const { data } = await uploadImage({
					variables: { file },
				});

				const uploadedUrl = data?.uploadImage?.url;
				if (!uploadedUrl) return null;

				return {
					file,
					imgUrl: uploadedUrl,
					name: file.name,
					size:
						file.size > 1024 * 1024
							? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
							: `${(file.size / 1024).toFixed(2)} KB`,
					type: file.type,
					loading: false,
				};
			});

			const uploadedFiles = await Promise.all(uploadPromises);
			const validFiles = uploadedFiles.filter((f): f is ProductImageFile => !!f);

			setFiles((prev) => {
				const updated = prev.map((p) => {
					const match = validFiles.find((v) => v.name === p.name);
					return match ? match : p;
				});
				return updated;
			});

			validFiles.forEach((f, idx) => {
				addImage({
					image_url: f.imgUrl,
					is_primary: idx === 0,
				});
			});
		} catch (err) {
			console.error("Error uploading files:", err);
		}
	};

	const handleDelete = (idx: number) => {
		setFiles((prev) => {
			const updated = [...prev];
			const [removed] = updated.splice(idx, 1);

			if (removed?.imgUrl) {
				setProduct({
					images: files
						.filter((_, i) => i !== idx)
						.filter((f) => !!f.imgUrl)
						.map((f) => ({
							image_url: f.imgUrl,
							is_primary: false,
						})),
				});
			}

			return updated;
		});
	};

	return (
		<div className="md:w-1/2 w-full border border-[#E4E4E7] p-5 rounded-xl md:h-[calc(100vh-160px)] overflow-y-auto">
			<div className="mb-2 text-[#6B6D6E]">Add Images</div>
			<Dropzone accept="image/*" onFilesDrop={handleFiles} className="w-full h-[250px]" />
			<div className="flex flex-col items-start justify-center mt-8 space-y-3">
				{files.map((file, idx) => (
					<ProductImageFile key={file.imgUrl} {...file} onDelete={() => handleDelete(idx)} />
				))}
			</div>
		</div>
	);
}

function ProductImageFile({ name, size, imgUrl, loading, onDelete }: ProductImageFile & { onDelete: () => void }) {
	return (
		<div className="flex items-center justify-between border p-2 border-[#E4E4E7] w-full rounded-[10px]">
			<div className="flex items-center space-x-2">
				{loading ? (
					<Skeleton className="w-[70px] h-[70px] rounded-[10px] flex items-center justify-center" />
				) : (
					<div className="w-[70px] h-[70px] p-2 rounded-[10px] overflow-hidden bg-[#F8F8F8]">
						<img src={imgUrl} alt={imgUrl} className="w-full h-full object-cover" />
					</div>
				)}
				<div>
					<div className="text-[17px]">{name}</div>
					<div className="text-[14px] text-[#B1B5B4]">{size}</div>
				</div>
			</div>
			{loading ? (
				<Trash2 size={22} className="cursor-not-allowed text-[#7A7E83] transition-colors " />
			) : (
				<Trash2
					size={22}
					className="cursor-pointer text-[#7A7E83] transition-colors hover:text-red-400"
					onClick={onDelete}
				/>
			)}
		</div>
	);
}
