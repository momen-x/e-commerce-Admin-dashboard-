"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputWithValidation from "@/components/ui/InputWithValidation";
import { AddColorSchema, TAddColor } from "@/Validations/validation";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useGetColor, useUpdateColor } from "@/Hooks/useColor";

const EditColor = () => {
  const [loading, setLoading] = useState(false);

  const { mutate: updateColor } = useUpdateColor();

  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  const colorId = params.colorId as string;
  const { data: color } = useGetColor(storeId, colorId);

  const form = useForm<TAddColor>({
    resolver: zodResolver(AddColorSchema),
    defaultValues: {
      name: color?.name,
      value: color?.value,
    },
  });

  useEffect(() => {
    if (color) {
      form.reset({
        name: color.name || "",
        value: color.value || "",
      });
    }
  }, [color, form]);

  useEffect(() => {
    if (!storeId) return;
  }, [storeId]);

  const onSubmit = async (data: TAddColor) => {
    try {
      setLoading(true);
      updateColor(
        {
          storeId: storeId as string,
          colorId: colorId as string,
          ...data,
        },
        {
          onSuccess: () => {
            toast.success("Color created!");
            router.push(`/store/${storeId}/color`);
          },
          onError: (error) => {
            toast.error(error.message);
          },
        }
      );

      toast.success("Color updated successfully!");
      router.push(`/store/${storeId}/color`);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-6 flex items-center justify-center">
        <p>Loading Color data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 border rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <Link
          href={`/store/${storeId}/color`}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to colors</span>
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-6">Edit Color</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Label Input */}
          <InputWithValidation
            label="Color name"
            name="name"
            register={form.register}
            placeholder="e.g. White"
            error={form.formState.errors.name?.message}
            disabled={loading}
          />
          <InputWithValidation
            label="Color value"
            name="value"
            register={form.register}
            placeholder="e.g. #fff or white"
            error={form.formState.errors.name?.message}
            disabled={loading}
          />

          <Button disabled={loading} className="w-full" type="submit">
            {loading ? "Updating..." : "Update Color"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditColor;
