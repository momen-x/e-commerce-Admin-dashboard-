/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateProductSchema, TUpdateProduct } from "@/Validations/validation";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useGetProduct, useUpdateProduct } from "@/Hooks/useProduct";
import { Button } from "@/components/ui/button";
import { Form, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { ArrowLeft, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useGetCategories } from "@/Hooks/useCategory";
import { useGetSizes } from "@/Hooks/useSize";
import { useGetColors } from "@/Hooks/useColor";
import { Checkbox } from "@/components/ui/checkbox";

const EditProduct = ({
  storeId,
  productId,
}: {
  storeId: string;
  productId: string;
}) => {
  const router = useRouter();

  const { mutate: updateProduct } = useUpdateProduct();
  const { data: categories } = useGetCategories(storeId);
  const { data: sizes } = useGetSizes(storeId);
  const { data: colors } = useGetColors(storeId);
  const { data: product, isLoading: isProductLoading } = useGetProduct(
    storeId,
    productId
  );

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<TUpdateProduct>({
    resolver: zodResolver(UpdateProductSchema),
    defaultValues: {
      name: "",
      images: [],
      price: 0,
      categoryId: "",
      sizeId: "",
      colorId: "",
      isFeatured: false,
      isArchived: false,
    },
  });

  // Populate form when product data loads
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        price: product.price,
        categoryId: product.categoryId,
        sizeId: product.sizeId,
        colorId: product.colorId,
        images: product.images,
        isArchived: product.isArchived || false,
        isFeatured: product.isFeatured || false,
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExistingImages(product.images);
    }
  }, [product, form]);

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
        const currentImages = form.getValues("images") || [];

        // Update form value
        form.setValue("images", [...currentImages, base64String]);

        // Update new previews
        setNewImagePreviews((prev) => [...prev, base64String]);

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

  const removeExistingImage = (index: number) => {
    const currentImages = form.getValues("images") || [];
    const imageToRemove = existingImages[index];

    // Remove from form
    const newImages = currentImages.filter((img) => img !== imageToRemove);
    form.setValue("images", newImages);

    // Remove from display
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    const currentImages = form.getValues("images") || [];
    const imageToRemove = newImagePreviews[index];

    // Remove from form
    const newImages = currentImages.filter((img) => img !== imageToRemove);
    form.setValue("images", newImages);

    // Remove from display
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: TUpdateProduct) => {
    try {
      setLoading(true);

      // Validate that we have at least one image
      if (!data.images || data.images.length === 0) {
        toast.error("Please add at least one image");
        setLoading(false);
        return;
      }

      // Validate required fields
      if (!data.categoryId) {
        toast.error("Please select a category");
        setLoading(false);
        return;
      }

      if (!data.sizeId) {
        toast.error("Please select a size");
        setLoading(false);
        return;
      }

      if (!data.colorId) {
        toast.error("Please select a color");
        setLoading(false);
        return;
      }

      console.log("Submitting update with data:", {
        storeId,
        productId,
        categoryId: data.categoryId,
        sizeId: data.sizeId,
        colorId: data.colorId,
        name: data.name,
        price: data.price,
        isFeatured: data.isFeatured,
        isArchived: data.isArchived,
        imageCount: data.images.length,
      });

      updateProduct(
        {
          storeId,
          productId,
          categoryId: data.categoryId,
          sizeId: data.sizeId,
          colorId: data.colorId, // ✅ FIXED: Now using correct colorId
          name: data.name || "",
          images: data.images,
          price: data.price || 0,
          isFeatured: data.isFeatured || false,
          isArchived: data.isArchived || false,
        },
        {
          onSuccess: () => {
            toast.success("Product updated successfully!");
            router.push(`/store/${storeId}/products`);
          },
          onError: (error) => {
            console.error("Update error:", error);
            toast.error(error.message || "Failed to update product");
            setLoading(false);
          },
          onSettled: () => {
            setLoading(false);
          },
        }
      );
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Something went wrong.");
      setLoading(false);
    }
  };

  // Loading state
  if (isProductLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p>Loading product data...</p>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-red-500">Product not found</p>
        <Link href={`/store/${storeId}/products`}>
          <Button className="mt-4">Back to Products</Button>
        </Link>
      </div>
    );
  }

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

      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>

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
                <FormLabel>Price (USD) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={loading}
                    placeholder="e.g. 19.99"
                  />
                </FormControl>
                <FormDescription>
                  Enter price in dollars (e.g., 19.99)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Images */}
          <FormItem>
            <FormLabel>Product Images *</FormLabel>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Current Images:</p>
                <div className="flex gap-4 flex-wrap">
                  {existingImages.map((image, index) => (
                    <div
                      key={`existing-${index}`}
                      className="relative w-[150px] h-[150px] rounded-md overflow-hidden border"
                    >
                      <Button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 z-10 h-8 w-8"
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <img
                        src={image}
                        alt={`Existing ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Image Previews */}
            {newImagePreviews.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">New Images:</p>
                <div className="flex gap-4 flex-wrap">
                  {newImagePreviews.map((preview, index) => (
                    <div
                      key={`new-${index}`}
                      className="relative w-[150px] h-[150px] rounded-md overflow-hidden border border-blue-500"
                    >
                      <Button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 z-10 h-8 w-8"
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <img
                        src={preview}
                        alt={`New ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Input
              type="file"
              accept="image/*"
              multiple
              disabled={loading}
              onChange={handleFileChange}
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload new images or keep existing ones (Max 5MB per image)
            </p>

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
                    <option value="">Select category</option>
                    {categories?.map((c) => (
                      <option key={c.id} value={c.id}>
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
                    <option value="">Select size</option>
                    {sizes?.map((s) => (
                      <option key={s.id} value={s.id}>
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
                    <option value="">Select color</option>
                    {colors?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Featured Checkbox */}
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="Featured"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel
                    htmlFor="Featured"
                    className="cursor-pointer text-sm font-normal"
                  >
                    Featured
                  </FormLabel>
                  <FormDescription className="text-xs">
                    Featured products will appear on the home page
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {/* Archived Checkbox */}
          <FormField
            control={form.control}
            name="isArchived"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="isArchived"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel
                    htmlFor="isArchived"
                    className="cursor-pointer text-sm font-normal"
                  >
                    Archived
                  </FormLabel>
                  <FormDescription className="text-xs">
                    Archived products won&apos;t appear in your store
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <Button disabled={loading} type="submit" className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Product"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditProduct;

