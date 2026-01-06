"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputWithValidation from "@/components/ui/InputWithValidation";
import { AddCategorySchema, TAddCategory } from "@/Validations/validation";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateCategory, useGetCategory } from "@/Hooks/useCategory";
import { useGetBillboards } from "@/Hooks/useBillboard";

const EditCategory = () => {
  const [loading, setLoading] = useState(false);
  const { mutate: updateCategory } = useUpdateCategory();

  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  const categoryId = params.categoryId as string;

  const { data: category, isLoading: isCategoryLoading } = useGetCategory(
    storeId,
    categoryId
  );
  const { data: billboards, isLoading: isBillboardsLoading } =
    useGetBillboards(storeId);

  const form = useForm<TAddCategory>({
    resolver: zodResolver(AddCategorySchema),
    defaultValues: {
      name: category?.name || "",
      billboardId: category?.billboardId || "",
    },
  });

  // Update form when category data loads
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        billboardId: category.billboardId,
      });
    }
  }, [category, form]);

  const handleBillBoardChange = (billboardId: string) => {
    form.setValue("billboardId", billboardId);
    form.reset({
      name: category?.name,
      billboardId: category?.billboardId,
    });
  };

  const onSubmit = async (data: TAddCategory) => {
    try {
      setLoading(true);
      updateCategory(
        {
          storeId,
          categoryId,
          ...data,
        },
        {
          onSuccess: () => {
            toast.success("Category updated successfully!");
            router.push(`/store/${storeId}/category`);
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

  if (isCategoryLoading || isBillboardsLoading) {
    return (
      <div className="max-w-xl mx-auto p-6 flex items-center justify-center">
        <p>Loading category data...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <p className="text-red-500">Category not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 border rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <Link
          href={`/store/${storeId}/category`}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Categories</span>
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-6">Edit Category</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Category Name Input */}
          <InputWithValidation
            label="Category Name"
            name="name"
            register={form.register}
            placeholder="e.g. Men Clothing"
            error={form.formState.errors.name?.message}
            disabled={loading}
          />

          {/* Billboard Select with Default Value */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Billboard</label>
            <Select
              onValueChange={handleBillBoardChange}
              value={form.watch("billboardId")} // ← This shows the selected value
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a billboard" />
              </SelectTrigger>
              <SelectContent>
                {billboards && billboards.length > 0 ? (
                  billboards.map((billboard) => (
                    <SelectItem key={billboard.id} value={billboard.id}>
                      {billboard.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-billboards" disabled>
                    No billboards available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {form.formState.errors.billboardId && (
              <p className="text-xs text-red-500">
                {form.formState.errors.billboardId.message}
              </p>
            )}
          </div>

          <Button
            disabled={loading || isCategoryLoading || isBillboardsLoading}
            className="w-full"
            type="submit"
          >
            {loading ? "Updating..." : "Update Category"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditCategory;
