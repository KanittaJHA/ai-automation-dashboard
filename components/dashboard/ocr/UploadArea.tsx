"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Upload, FileText, X, Image as ImageIcon } from "lucide-react";

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  previewUrl: string | null;
}

export default function UploadArea({
  onFileSelect,
  selectedFile,
  onClear,
  previewUrl,
}: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  if (selectedFile) {
    const isPdf = selectedFile.type === "application/pdf";
    return (
      <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">
            Uploaded File
          </h3>
          <button
            type="button"
            onClick={onClear}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
          {previewUrl && !isPdf ? (
            <Image
              src={previewUrl}
              alt="Preview"
              width={80}
              height={80}
              className="w-20 h-20 object-cover rounded-lg"
            />
          ) : (
            <div className="w-20 h-20 bg-[#A965FF]/10 rounded-lg flex items-center justify-center">
              {isPdf ? (
                <FileText size={28} className="text-[#A965FF]" />
              ) : (
                <ImageIcon size={28} className="text-[#A965FF]" />
              )}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-white">
              {selectedFile.name}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
      <h3 className="text-sm font-semibold text-white mb-4">
        Upload Document
      </h3>
      <button
        type="button"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-[#A965FF] bg-[#A965FF]/5"
            : "border-white/20 hover:border-[#A965FF]/50 hover:bg-white/5"
        }`}
      >
        <div className="w-12 h-12 rounded-xl bg-[#A965FF]/10 mx-auto mb-3 flex items-center justify-center">
          <Upload size={22} className="text-[#A965FF]" />
        </div>
        <p className="text-sm font-medium text-white">
          Drag & drop your file here
        </p>
        <p className="text-xs text-gray-400 mt-1">or click to browse</p>
        <p className="text-xs text-gray-300 mt-3">
          Supports PDF, PNG, JPG, JPEG
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleChange}
          className="hidden"
        />
      </button>
    </div>
  );
}
