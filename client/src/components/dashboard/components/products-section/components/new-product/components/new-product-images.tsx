import { Dropzone } from "@/components/ui/dropzone";
import { getImageBase64 } from "@/utils/get-image-base-64";
import { Trash2 } from "lucide-react";
import { useState } from "react";

type ProductImageFile = {
    file: File;
    imgUrl: string;
    name: string;
    size: string;
    type: string;
};

export function NewProductImages() {
    const [files, setFiles] = useState<ProductImageFile[]>([]);

    const handleFiles = async (incomingFiles: File[]) => {
        try {
            const base64Images = await Promise.all(
                incomingFiles.map(file => getImageBase64(file))
            );

            const newFileObjects: ProductImageFile[] = incomingFiles.map((file, idx) => ({
                file,
                imgUrl: base64Images[idx],
                name: file.name,
                size:
                    file.size > 1024 * 1024
                        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                        : `${(file.size / 1024).toFixed(2)} KB`,
                type: file.type,
            }));

            const existingBase64 = new Set(files.map(f => f.imgUrl));
            const uniqueFiles = newFileObjects.filter(f => !existingBase64.has(f.imgUrl));

            if (uniqueFiles.length === 0) return;

            setFiles(prev => [...prev, ...uniqueFiles]);
        } catch (err) {
            console.error("Error processing files:", err);
        }
    };

    const handleDelete = (idx: number) => {
        setFiles(prev => prev.filter((_, i) => i !== idx));
    };

    return (
        <div className="w-1/2 border border-[#E4E4E7] p-5 rounded-xl min-h-[calc(100vh-160px)]">
            <div className="mb-2 text-[#6B6D6E]">
                Add Images
            </div>
            <Dropzone accept="image/*" onFilesDrop={handleFiles} className="w-full h-[250px]" />
            <div className="flex flex-col items-start justify-center mt-8 space-y-3">
                {files.map((file, idx) => (
                    <ProductImageFile
                        key={file.imgUrl}
                        {...file}
                        onDelete={() => handleDelete(idx)}
                    />
                ))}
            </div>
        </div>
    );
}

function ProductImageFile({
    name,
    size,
    imgUrl,
    onDelete
}: ProductImageFile & { onDelete: () => void }) {
    return (
        <div className="flex items-center justify-between border p-2 border-[#E4E4E7] w-full rounded-[10px]">
            <div className="flex items-center space-x-2">
                <div className="w-[70px] h-[70px] p-2 rounded-[10px] overflow-hidden bg-[#F8F8F8]">
                    <img src={imgUrl} alt={imgUrl} className="w-full h-full object-cover" />
                </div>
                <div>
                    <div className="text-[17px]">{name}</div>
                    <div className="text-[14px] text-[#B1B5B4]">{size}</div>
                </div>
            </div>
            <Trash2
                size={22}
                className="cursor-pointer text-[#7A7E83] transition-colors hover:text-red-400"
                onClick={onDelete}
            />
        </div>
    );
}
