/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useGetCategories } from "@/Hooks/useCategory";
import { useGetSizes } from "@/Hooks/useSize";
import { useGetColors } from "@/Hooks/useColor";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddProductSchema, TAddProduct } from "@/Validations/validation";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useAddProduct } from "@/Hooks/useProduct";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";

const AddNewProduct = () => {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;

  const { mutate: addProduct } = useAddProduct();
  const { data: categories } = useGetCategories(storeId);
  const { data: sizes } = useGetSizes(storeId);
  const { data: colors } = useGetColors(storeId);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<TAddProduct>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: {
      name: "",
      images: [],
      price: 0,
      categoryId: "",
      sizeId: "",
      colorId: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 5MB`);
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        const currentImages = form.getValues("images");

        // Update form value
        form.setValue("images", [...currentImages, base64String]);

        // Update previews
        setImagePreviews((prev) => [...prev, base64String]);

        // Clear validation error
        form.clearErrors("images");
      };

      reader.onerror = () => {
        toast.error(`Error reading ${file.name}`);
      };

      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images");
    const newImages = currentImages.filter((_, i) => i !== index);
    form.setValue("images", newImages);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: TAddProduct) => {


    try {
      setLoading(true);

      addProduct(
        {
          storeId,
          ...data,
        },
        {
          onSuccess: () => {
            form.reset();
            setImagePreviews([]);
            toast.success("Product created successfully!");
            router.push(`/store/${storeId}/products`);
          },
          onError: (error) => {
            toast.error(error.message || "Failed to create product");
          },
          onSettled: () => {
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

  return (
    <div className="max-w-2xl mx-auto p-6 border rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <Link
          href={`/store/${storeId}/products`}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Products</span>
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-6">Create Product</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={loading}
                    placeholder="e.g. T-Shirt"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (in cents) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={loading}
                    placeholder="e.g. 1999 (for $19.99)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Images */}
          <FormItem>
            <FormLabel>Product Images *</FormLabel>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mb-4 flex gap-4 flex-wrap">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative w-[150px] h-[150px] rounded-md overflow-hidden border"
                  >
                    <Button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 z-10"
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <Input
              type="file"
              accept="image/*"
              multiple
              disabled={loading}
              onChange={handleFileChange}
            />

            {form.formState.errors.images && (
              <p className="text-sm text-red-500 mt-2">
                {form.formState.errors.images.message}
              </p>
            )}
          </FormItem>

          {/* Category */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border p-2 rounded"
                    disabled={loading}
                  >
                    <option value="" className="bg-white dark:bg-gray-600">Select category</option>
                    {categories?.map((c) => (
                      <option key={c.id} value={c.id} className="bg-white dark:bg-gray-600">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Size */}
          <FormField
            control={form.control}
            name="sizeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size *</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border p-2 rounded"
                    disabled={loading}
                  >
                    <option value="" className="bg-white dark:bg-gray-600">Select size</option>
                    {sizes?.map((s) => (
                      <option key={s.id} value={s.id} className="bg-white dark:bg-gray-600">
                        {s.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Color */}
          <FormField
            control={form.control}
            name="colorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color *</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border p-2 rounded"
                    disabled={loading}
                  >
                    <option value="" className="bg-white dark:bg-gray-600">Select color</option>
                    {colors?.map((c) => (
                      <option key={c.id} value={c.id} className="bg-white dark:bg-gray-600">
                        {c.name}
                     
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} type="submit" className="w-full">
            {loading ? "Creating..." : "Create Product"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddNewProduct;
