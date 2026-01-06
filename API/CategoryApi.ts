import domin from "@/lib/domin";
import { Category } from "@prisma/client";
import axios from "axios";

// Response Types
interface GetCategoriesResponse {
  categories: Category[];
}

interface CategoryResponse {
  category: Category;
}

interface UpdateCategoryResponse {
  updatedCategory: Category;
}

interface DeleteCategoryResponse {
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

export const CATEGORY_API = {
  /**
   * Get all categories for a store
   */
  getCategories: async (storeId: string): Promise<Category[]|undefined> => {
    try {
      const response = await axios.get<GetCategoriesResponse>(
        `${domin}/api/${storeId}/category`
      );
      return response.data.categories;
    } catch (error) {
      handleApiError(error, "Failed to fetch categories");
    }
  },

  /**
   * Get a single category by ID
   */
  getCategory: async (
    storeId: string,
    categoryId: string
  ): Promise<Category|undefined> => {
    try {
      const response = await axios.get<CategoryResponse>(
        `${domin}/api/${storeId}/category/${categoryId}`
      );
      return response.data.category;
    } catch (error) {
      handleApiError(error, "Failed to fetch category");
    }
  },

  /**
   * Create a new category
   */
  createCategory: async (
    storeId: string,
    data: { name: string; billboardId: string }
  ): Promise<Category|undefined> => {
    try {
      const response = await axios.post<CategoryResponse>(
        `${domin}/api/${storeId}/category`,
        data
      );
      return response.data.category;
    } catch (error) {
      handleApiError(error, "Failed to create category");
    }
  },

  /**
   * Update an existing category
   */
  updateCategory: async (
    storeId: string,
    categoryId: string,
    data: { name: string; billboardId: string }
  ): Promise<Category|undefined> => {
    try {
      const response = await axios.patch<UpdateCategoryResponse>(
        `${domin}/api/${storeId}/category/${categoryId}`,
        data
      );
      return response.data.updatedCategory;
    } catch (error) {
      handleApiError(error, "Failed to update category");
    }
  },

  /**
   * Delete a category
   */
  deleteCategory: async (
    storeId: string,
    categoryId: string
  ): Promise<string|undefined> => {
    try {
      const response = await axios.delete<DeleteCategoryResponse>(
        `${domin}/api/${storeId}/category/${categoryId}`
      );
      return response.data.message;
    } catch (error) {
      handleApiError(error, "Failed to delete category");
    }
  },
};