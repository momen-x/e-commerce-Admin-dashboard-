import domin from "@/lib/domin";
import { Size } from "@prisma/client";
import axios from "axios";

// Response Types
interface GetSizesResponse {
  sizes: Size[];
}

interface SizeResponse {
  size: Size;
}

interface UpdateSizeResponse {
  updatedSize: Size;
}

interface DeleteSizeResponse {
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

export const SIZE_API = {
  /**
   * Get all sizes for a store
   */
  getSizes: async (storeId: string): Promise<Size[] | undefined> => {
    try {
      const response = await axios.get<GetSizesResponse>(
        `${domin}/api/${storeId}/size`
      );
      return response.data.sizes;
    } catch (error) {
      handleApiError(error, "Failed to fetch sizes");
    }
  },

 
  getSize: async (
    storeId: string,
    sizeId: string
  ): Promise<Size | undefined> => {
    try {
      const response = await axios.get<SizeResponse>(
        `${domin}/api/${storeId}/size/${sizeId}`
      );
      return response.data.size;
    } catch (error) {
      handleApiError(error, "Failed to fetch size");
    }
  },

  /**
   * Create a new size
   */
  createSize: async (
    storeId: string,
    data: { name: string; value: string }
  ): Promise<Size | undefined> => {
    try {
      const response = await axios.post<SizeResponse>(
        `${domin}/api/${storeId}/size`,
        data
      );
      return response.data.size;
    } catch (error) {
      handleApiError(error, "Failed to create size");
    }
  },

  /**
   * Update an existing size
   */
  updateSize: async (
    storeId: string,
    sizeId: string,
    data: { name: string; value: string }
  ): Promise<Size | undefined> => {
    try {
      const response = await axios.patch<UpdateSizeResponse>(
        `${domin}/api/${storeId}/size/${sizeId}`,
        data
      );
      return response.data.updatedSize;
    } catch (error) {
      handleApiError(error, "Failed to update size");
    }
  },

  /**
   * Delete a size
   */
  deleteSize: async (
    storeId: string,
    sizeId: string
  ): Promise<string | undefined> => {
    try {
      const response = await axios.delete<DeleteSizeResponse>(
        `${domin}/api/${storeId}/size/${sizeId}`
      );
      return response.data.message;
    } catch (error) {
      handleApiError(error, "Failed to delete size");
    }
  },
};
