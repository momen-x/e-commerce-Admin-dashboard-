"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputWithValidation from "@/components/ui/InputWithValidation";
import { AddSizeSchema, TAddSize } from "@/Validations/validation";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useGetSize, useUpdateSize } from "@/Hooks/useSize";

const EditSize = () => {
  const [loading, setLoading] = useState(false);

  const { mutate: updateSize } = useUpdateSize();

  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  const sizeId = params.sizeId as string;
  const { data: size, isLoading: isSizeLoading } = useGetSize(storeId, sizeId);

  const form = useForm<TAddSize>({
    resolver: zodResolver(AddSizeSchema),
    defaultValues: {
      name: "",
      value: "",
    },
  });

  // Reset form when size data loads
  useEffect(() => {
    if (size) {
      form.reset({
        name: size.name || "",
        value: size.value || "",
      });
    }
  }, [size, form]);

  const onSubmit = async (data: TAddSize) => {
    try {
      setLoading(true);
      updateSize(
        {
          storeId: storeId as string,
          SizeId: sizeId as string,
          ...data,
        },
        {
          onSuccess: () => {
            toast.success("Size updated successfully!");
            router.push(`/store/${storeId}/size`);
          },
          onError: (error) => {
            toast.error(error.message);
            setLoading(false);
          },
        }
      );
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
      setLoading(false);
    }
  };

  // Remove duplicate toast and router push in try block
  // They're already handled in the mutation callbacks

  if (isSizeLoading) {
    return (
      <div className="max-w-xl mx-auto p-6 flex items-center justify-center">
        <p>Loading size data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 border rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <Link
          href={`/store/${storeId}/size`}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to sizes</span>
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-6">Edit size</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Label Input */}
          <InputWithValidation
            label="Size name"
            name="name"
            register={form.register}
            placeholder="e.g. small"
            error={form.formState.errors.name?.message}
            disabled={loading || isSizeLoading}
          />
          <InputWithValidation
            label="Size value"
            name="value"
            register={form.register}
            placeholder="e.g. 38"
            error={form.formState.errors.value?.message} // Fixed: was showing name error
            disabled={loading || isSizeLoading}
          />

          <Button
            disabled={loading || isSizeLoading || !form.formState.isDirty}
            className="w-full"
            type="submit"
          >
            {loading ? "Updating..." : "Update size"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditSize;
