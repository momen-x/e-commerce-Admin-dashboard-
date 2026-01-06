"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputWithValidation from "@/components/ui/InputWithValidation";
import { AddSizeSchema, TAddSize } from "@/Validations/validation";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useAddSize } from "@/Hooks/useSize";

const AddNewSize = () => {
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const storeId = params.storeId;
  const { mutate: addSize } = useAddSize();
  // const router = useRouter();

  const form = useForm<TAddSize>({
    resolver: zodResolver(AddSizeSchema),
    defaultValues: {
      name: "",
      value: "",
    },
  });
  useEffect(() => {
    if (!storeId) return;
  }, [storeId]);

  const onSubmit = async (data: TAddSize) => {
    try {
      setLoading(true);
      addSize(
        { storeId: storeId as string, ...data },
        {
          onSuccess: () => {
            toast.success("Size created!");
          },
          onError: (error) => {
            toast.error(error.message);
          },
        }
      );

      form.reset();
      toast.success("Size created successfully!");
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
          href={`/store/${storeId}/size`}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Sizes table</span>
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-6">Create Size</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Label Input */}
          <InputWithValidation
            label="Size Name"
            name="name"
            register={form.register}
            placeholder="e.g. small"
            error={form.formState.errors.name?.message}
            disabled={loading}
          />
          <InputWithValidation
            label="Size value"
            name="value"
            register={form.register}
            placeholder="e.g. sm 38"
            error={form.formState.errors.name?.message}
            disabled={loading}
          />

          <Button disabled={loading} className="w-full" type="submit">
            {loading ? "Creating..." : "Create Size"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddNewSize;
