import React, { useRef, useState } from "react";
import { Upload, Camera } from "lucide-react";

interface FileUploadProps {
    onFileChange: (file: File | null) => void;
    previewUrl?: string;
    uploading?: boolean;
    label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, previewUrl, uploading, label }) => {

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [dragOver, setDragOver] = useState(false);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        onFileChange(file)
    }

    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setDragOver(false)
        const file = event.dataTransfer.files?.[0] || null;
        onFileChange(file)
    }
    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setDragOver(true);
    }
    const handleDragLeave = () => {
        setDragOver(false);
    }


    return (
        <div className="col-span-2">
            <input
                id="file"
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="sr-only"
            />
            <label className="flex items-center gap-2 mb-2 text-form-label">
                <Camera size={20} />
                  <p className="text-form-label">{label || "Upload media"}</p>
            </label>
            <label
        htmlFor="file"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed min-h-[200px] flex flex-col items-center justify-center rounded-md cursor-pointer
          ${dragOver ? "border-blue-500 bg-blue-50" : "border-form-placeholder"}`}
      >
         <div className="flex flex-col items-center text-center text-form-placeholder">
          <Upload size={50} />
          <span className="text-lg">Drag & drop or click to select a file</span>
          <span className="text-base">Photos and videos can help emergency responders</span>
        </div>
      </label>
      {previewUrl && (
        <div className="mt-3">
          <p className="font-semibold">Preview:</p>
          <img src={previewUrl} alt="file preview" className="mt-2 max-h-48 object-contain border border-gray-200 shadow-md" />
        </div>
      )}
      {uploading && <p className="mt-2 text-blue-600 font-medium">Uploading file...</p>}
        </div>
    );
};



export default FileUpload;