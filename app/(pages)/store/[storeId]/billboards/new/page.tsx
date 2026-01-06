/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputWithValidation from "@/components/ui/InputWithValidation";
import { AddBillboardsSchema, TAddBillboards } from "@/Validations/validation";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAddBillboard } from "@/Hooks/useBillboard";

const AddNewBillBoard = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const params = useParams();
  const storeId = params.storeId;
  const [loading, setLoading] = useState(false);
  const { mutate: addBillboard } = useAddBillboard();

  const form = useForm<TAddBillboards>({
    resolver: zodResolver(AddBillboardsSchema),
    defaultValues: {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: TAddBillboards) => {
    try {
      setLoading(true);
      addBillboard(
        { storeId: storeId as string, ...data },
        {
          onSuccess: () => {
            form.reset();
            setImagePreview(null);
            toast.success("Billboard created successfully!");
            // router.push(`/store/${storeId}/category`);
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
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 border rounded-lg shadow-sm ">
      <div className="flex items-center justify-between mb-8">
        <Link
          href={`/store/${storeId}/billboards`}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Billboards</span>
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-6">Create Billboard</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Label Input */}
          <InputWithValidation
            label="Billboard Label"
            name="label"
            register={form.register}
            placeholder="e.g. Summer Collection"
            error={form.formState.errors.label?.message}
            disabled={loading}
          />

          {/* Image Upload - DON'T use register for file inputs */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Billboard Image
            </label>
            <input
              type="file"
              accept="image/*"
              disabled={loading}
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
            {form.formState.errors.imageUrl && (
              <p className="mt-2 text-xs text-red-500">
                {form.formState.errors.imageUrl.message}
              </p>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Billboard preview"
                  className="w-full max-w-md h-auto rounded-lg border"
                />
              </div>
            )}
          </div>

          <Button disabled={loading}  className="w-full" type="submit">
            {loading ? "Creating..." : "Create Billboard"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddNewBillBoard;
