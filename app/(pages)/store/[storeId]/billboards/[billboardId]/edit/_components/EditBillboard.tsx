/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputWithValidation from "@/components/ui/InputWithValidation";
import { AddBillboardsSchema, TAddBillboards } from "@/Validations/validation";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useGetBillboard, useUpdateBillboard } from "@/Hooks/useBillboard";

const EditBillBoard = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  const billboardId = params.billboardId as string;
  const { data: billboards } = useGetBillboard(storeId!, billboardId!);
  const { mutate: updateBillboard, error } = useUpdateBillboard();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TAddBillboards>({
    resolver: zodResolver(AddBillboardsSchema),
    defaultValues: {
      label: "",
      imageUrl: "",
    },
  });

  // Fetch billboard data on mount
  useEffect(() => {
    if (!billboardId || !storeId) return;

    setExistingImageUrl(billboards?.imageUrl || null);
    form.setValue("label", billboards?.label || "");
    form.setValue("imageUrl", billboards?.imageUrl || "");
    setImagePreview(billboards?.imageUrl || null);
  }, [billboardId, billboards?.imageUrl, billboards?.label, form, storeId]);

  const onSubmit = async (data: TAddBillboards) => {
    setIsLoading(true);
    try {
      updateBillboard(
        { storeId, billboardId, ...data },
        {
          onSuccess: () => {
            toast.success("Billboard updated!");
            router.push(`/store/${storeId}/billboards`);
          },
          onError: (error) => {
            toast.error(error.message);
          },
        }
      );
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = () => {
    setImagePreview(existingImageUrl);
    form.setValue("imageUrl", existingImageUrl || "");
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto p-6 flex items-center justify-center">
        <p>Loading billboard data...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <p className="text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 border rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <Link
          href={`/store/${storeId}/billboards`}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Billboards</span>
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-6">Edit Billboard</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Label Input */}
          <InputWithValidation
            label="Billboard Label"
            name="label"
            register={form.register}
            placeholder="e.g. Summer Collection"
            error={form.formState.errors.label?.message}
            disabled={isLoading}
          />

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Billboard Image
            </label>

            {/* Current/Preview Image */}
            {imagePreview && (
              <div className="mb-4 relative">
                <img
                  src={imagePreview}
                  alt="Billboard preview"
                  className="w-full max-w-md h-auto rounded-lg border"
                />
                {imagePreview !== existingImageUrl && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleDeleteImage}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove New Image
                  </Button>
                )}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              disabled={isLoading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Validate file size (max 5MB)
                  if (file.size > 5 * 1024 * 1024) {
                    form.setError("imageUrl", {
                      type: "manual",
                      message: "Image size must be less than 5MB",
                    });
                    return;
                  }

                  // Validate file type
                  if (!file.type.startsWith("image/")) {
                    form.setError("imageUrl", {
                      type: "manual",
                      message: "Please upload a valid image file",
                    });
                    return;
                  }

                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64String = reader.result as string;
                    form.setValue("imageUrl", base64String);
                    setImagePreview(base64String);
                    form.clearErrors("imageUrl");
                  };
                  reader.onerror = () => {
                    form.setError("imageUrl", {
                      type: "manual",
                      message: "Failed to read image file",
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />

            <p className="mt-2 text-xs text-gray-500">
              Leave empty to keep the existing image
            </p>

            {form.formState.errors.imageUrl && (
              <p className="mt-2 text-xs text-red-500">
                {form.formState.errors.imageUrl.message}
              </p>
            )}
          </div>

          <Button disabled={isLoading} className="w-full" type="submit">
            {isLoading ? "Updating..." : "Update Billboard"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditBillBoard;
