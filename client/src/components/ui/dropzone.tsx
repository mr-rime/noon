
import React, { useState, useCallback } from "react";

type DropzoneProps = {
    onFilesDrop?: (files: File[]) => void;
    multiple?: boolean;
    accept?: string;
};

export const Dropzone: React.FC<DropzoneProps> = ({
    onFilesDrop,
    multiple = true,
    accept,
}) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            setIsDragging(false);
            const files = Array.from(event.dataTransfer.files);
            if (onFilesDrop) onFilesDrop(files);
        },
        [onFilesDrop]
    );

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        if (onFilesDrop) onFilesDrop(files);
    };

    return (
        <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
            onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput")?.click()}
        >
            <input
                type="file"
                id="fileInput"
                hidden
                multiple={multiple}
                accept={accept}
                onChange={handleFileSelect}
            />
            <p className="text-sm text-gray-600">
                {isDragging ? "Drop files here..." : "Drag and drop files here or click to upload"}
            </p>
        </div>
    );
};

