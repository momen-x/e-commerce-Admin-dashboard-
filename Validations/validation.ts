import z from "zod";

export const AddStore = z.object({
  name: z.string().min(3, "The store name must be at least 3 characters long"),
});

type TAddStore = z.infer<typeof AddStore>;

export const AddBillboardsSchema = z.object({
  label: z.string().min(3, "The label must be at least 3 characters long"),
  imageUrl: z.string().min(1, "The image is required"),
});
type TAddBillboards = z.infer<typeof AddBillboardsSchema>;

export const AddCategorySchema = z.object({
  name: z
    .string()
    .min(3, "The category name must be at least 3 characters long"),
  billboardId: z.string().min(1, "Billboard ID is required"),
});
type TAddCategory = z.infer<typeof AddCategorySchema>;

export const AddSizeSchema = z.object({
  name: z.string().min(2, "The size name must be at least 2 characters long"),
  value: z.string().min(1, "The size value must be at least 1 characters long"),
});
type TAddSize = z.infer<typeof AddSizeSchema>;
export const AddColorSchema = z.object({
  name: z.string().min(2, "The size name must be at least 2 characters long"),
  value: z.string().min(1, "The size value must be at least 1 characters long"),
});
type TAddColor = z.infer<typeof AddSizeSchema>;

export const AddProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .min(3, "Product name must be at least 3 characters long")
    .max(100, "Product name must be less than 100 characters"),

  images: z
    .array(z.string())
    .min(1, "Image URL is required")

    .min(1, "At least one image is required")
    .max(10, "Maximum 10 images allowed"),

  price: z
    .number({
      error: "Price is required",
    })
    .positive("Price must be greater than 0")
    .int("Price must be a whole number"), // If you want cents, use .multipleOf(0.01)

  categoryId: z
    .string()
    .min(1, "Category is required")
    .uuid("Invalid category ID"),

  sizeId: z.string().min(1, "Size is required").uuid("Invalid size ID"),

  colorId: z.string().min(1, "Color is required").uuid("Invalid color ID"),

  isFeatured: z.boolean().default(false).optional(),

  isArchived: z.boolean().default(false).optional(),
});

export type TAddProduct = z.infer<typeof AddProductSchema>;

// For edit/update, you might want a partial version:
export const UpdateProductSchema = AddProductSchema.partial();

export type TUpdateProduct = z.infer<typeof UpdateProductSchema>;

export const AddOrderSchema = z.object({
  // Remove storeId and productId as they're not needed in the body
  isPaid: z.boolean().default(false).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  customerEmail: z.string().email().optional(),
  orderItems: z
    .array(
      z.object({
        productId: z.string().min(1, "Product ID is required"),
        quantity: z.number().min(1, "Quantity must be greater than 0"),
      })
    )
    .default([]), // Make it optional with default empty array
});

type TAddOrder = z.infer<typeof AddOrderSchema>;

export const updateOrderSchema = AddOrderSchema.partial();
type TUpdateOrder = z.infer<typeof updateOrderSchema>;

export type { TAddCategory };
export type { TAddBillboards };
export type { TAddStore };
export type { TAddSize };
export type { TAddColor };
export type { TAddOrder };
export type { TUpdateOrder };
