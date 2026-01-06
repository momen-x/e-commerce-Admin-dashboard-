// ProductApi.ts
import domin from "@/lib/domin";
import { Category, Color, Product, Size } from "@prisma/client";
import axios from "axios";

// Response Types
interface GetProductsResponse {
  products: {
    storeId: string;
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    categoryId: string;
    sizeId: string;
    colorId: string;
    price: number;
    isFeatured: boolean;
    isArchived: boolean;
    images: string[];
    category: Category;
    size: Size;
    color: Color;
  }[];
}

interface ProductResponse {
  product: {
    storeId: string;
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    categoryId: string;
    sizeId: string;
    colorId: string;
    price: number;
    isFeatured: boolean;
    isArchived: boolean;
    images: string[];
    category: Category;
    size: Size;
    color: Color;
  };
}

interface UpdateProductResponse {
  updatedProduct: {
    storeId: string;
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    categoryId: string;
    sizeId: string;
    colorId: string;
    price: number;
    isFeatured: boolean;
    isArchived: boolean;
    images: string[];
    category: Category;
    size: Size;
    color: Color;
  };
}

interface DeleteProductResponse {
  message: string;
}

// API Error Handler
const handleApiError = (error: unknown, defaultMessage: string): never => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || defaultMessage;
    throw new Error(message);
  }
  throw new Error(defaultMessage);
};

export const Product_API = {
  /**
   * Get all Products for a store
   */
  getProducts: async (storeId: string): Promise<Product[] | null> => {
    try {
      const response = await axios.get<GetProductsResponse>(
        `${domin}/api/${storeId}/product`
      );
      return response.data.products;
    } catch (error) {
      handleApiError(error, "Failed to fetch products");
      return null;
    }
  },

  /**
   * Get a single Product by ID
   */
  getProduct: async (
    storeId: string,
    productId: string
  ): Promise<Product | null> => {
    try {
      const response = await axios.get<ProductResponse>(
        `${domin}/api/${storeId}/product/${productId}`
      );
      return response.data.product;
    } catch (error) {
      handleApiError(error, "Failed to fetch product");
      return null;
    }
  },

  /**
   * Create a new Product
   */
  createProduct: async (
    storeId: string,
    data: {
      categoryId: string;
      sizeId: string;
      colorId: string;
      name: string;
      images: string[];
      price: number;
      isFeatured?: boolean;
      isArchived?: boolean;
    }
  ): Promise<Product | null> => {
    try {
      const response = await axios.post<ProductResponse>(
        `${domin}/api/${storeId}/product`,
        data
      );
      return response.data.product;
    } catch (error) {
      handleApiError(error, "Failed to create product");
      return null;
    }
  },

  /**
   * Update an existing Product
   */
  updateProduct: async (
    storeId: string,
    productId: string,
    data: {
      categoryId: string;
      sizeId: string;
      colorId: string;
      name: string;
      images: string[]; // ← Fixed: Array of objects
      price: number;
      isFeatured?: boolean;
      isArchived?: boolean;
    }
  ): Promise<Product | null> => {
    try {
      const response = await axios.patch<UpdateProductResponse>(
        `${domin}/api/${storeId}/product/${productId}`,
        data
      );
      return response.data.updatedProduct;
    } catch (error) {
      handleApiError(error, "Failed to update product");
      return null;
    }
  },

  /**
   * Delete a Product
   */
  deleteProduct: async (
    storeId: string,
    productId: string
  ): Promise<string | null> => {
    try {
      const response = await axios.delete<DeleteProductResponse>(
        `${domin}/api/${storeId}/product/${productId}`
      );
      return response.data.message;
    } catch (error) {
      handleApiError(error, "Failed to delete product");
      return null;
    }
  },
};
