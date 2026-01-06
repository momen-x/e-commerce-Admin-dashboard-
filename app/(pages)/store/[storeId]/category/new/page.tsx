"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputWithValidation from "@/components/ui/InputWithValidation";
import { AddCategorySchema, TAddCategory } from "@/Validations/validation";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddCategory } from "@/Hooks/useCategory";
import { useGetBillboards } from "@/Hooks/useBillboard";

const AddNewCategory = () => {
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const storeId = params.storeId;
  const { mutate: addCategory } = useAddCategory();
  const { data: billboards } = useGetBillboards(storeId as string);
  // const router = useRouter();

  const form = useForm<TAddCategory>({
    resolver: zodResolver(AddCategorySchema),
    defaultValues: {
      name: "",
      billboardId: "",
    },
  });
  useEffect(() => {
    if (!storeId) return;
    if (!billboards) {
      toast.error("Something went wrong");
      return;
    }
  }, [storeId, billboards]);
  const handleBillBoardChange = (billbordId: string) => {
    form.setValue("billboardId", billbordId);
  };
  const onSubmit = async (data: TAddCategory) => {
    try {
      setLoading(true);
      addCategory(
        { storeId: storeId as string, ...data },
        {
          onSuccess: () => {
            toast.success("Category created!");
            // router.push(`/store/${storeId}/category`);
          },
          onError: (error) => {
            toast.error(error.message);
          },
        }
      );

      form.reset();
      toast.success("Category created successfully!");
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
          href={`/store/${storeId}/category`}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Categories</span>
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-6">Create Category</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Label Input */}
          <InputWithValidation
            label="Category Name"
            name="name"
            register={form.register}
            placeholder="e.g. Men Clothing"
            error={form.formState.errors.name?.message}
            disabled={loading}
          />

          <Select onValueChange={handleBillBoardChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a billboard" />
            </SelectTrigger>
            <SelectContent>
              {billboards?.map((billboard) => (
                <SelectItem key={billboard.id} value={billboard.id}>
                  {billboard.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button disabled={loading} className="w-full" type="submit">
            {loading ? "Creating..." : "Create Category"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddNewCategory;
