"use client"
import { Button } from "@/components/ui/button";
import { Trash, Plus, ImageIcon } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary-client";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string[]) => void; // Cloudinary URLs only
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);

    try {
      const uploadedUrls = await Promise.all(
        files.map((file) => uploadToCloudinary(file))
      );

      onChange([...value, ...uploadedUrls]);
    } catch (error) {
      console.error(error);
      alert("Image upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4 w-full">
      <Input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        disabled={disabled || uploading}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {value.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="relative aspect-square rounded-md overflow-hidden border group"
          >
            <Button
              type="button"
              onClick={() => onRemove(url)}
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 z-10 h-8 w-8"
            >
              <Trash className="h-4 w-4" />
            </Button>

            <Image
              fill
              className="object-cover"
              alt={`Product image ${index + 1}`}
              src={url}
            />
          </div>
        ))}

        <div
          className="aspect-square rounded-md bg-slate-100 border-2 border-dashed flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer"
          onClick={handleUploadClick}
        >
          <ImageIcon className="h-10 w-10 mb-2 opacity-20" />
          <p className="text-xs">
            {uploading ? "Uploading..." : "Click to upload"}
          </p>
        </div>
      </div>

      <Button
        type="button"
        disabled={disabled || uploading}
        variant="secondary"
        onClick={handleUploadClick}
      >
        <Plus className="h-4 w-4 mr-2" />
        Upload Images
      </Button>
    </div>
  );
};

export default ImageUpload;