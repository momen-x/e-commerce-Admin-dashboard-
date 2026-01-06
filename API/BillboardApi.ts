import domin from "@/lib/domin";
import { Billboard } from "@prisma/client";
import axios from "axios";

// Response Types
interface GetBillboardsResponse {
  billboards: Billboard[];
}

interface CateBillboardResponse {
  billboard: Billboard;
}

interface UpdateBillboardResponse {
  updatedBillboard: Billboard;
}

interface DeleteBillboardResponse {
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

export const BILLBOARD_API = {
  /**
   * Get all billboards for a store
   */
  getBillboards: async (storeId: string): Promise<Billboard[] | undefined> => {
    try {
      const response = await axios.get<GetBillboardsResponse>(
        `${domin}/api/${storeId}/billboard`
      );
      return response.data.billboards;
    } catch (error) {
      handleApiError(error, "Failed to fetch billboards");
    }
  },

  /**
   * Get a single billboard by ID
   */
  getBillboard: async (
    storeId: string,
    billboardId: string
  ): Promise<Billboard | undefined> => {
    try {
      const response = await axios.get<CateBillboardResponse>(
        `${domin}/api/${storeId}/billboard/${billboardId}`
      );
      return response.data.billboard;
    } catch (error) {
      handleApiError(error, "Failed to ");
    }
  },

  /**
   * Create a new billboard
   */
  createBillboard: async (
    storeId: string,
    data: { label: string; imageUrl: string }
  ): Promise<Billboard | undefined> => {
    try {
      const response = await axios.post<CateBillboardResponse>(
        `${domin}/api/${storeId}/billboard`,
        data
      );
      return response.data.billboard;
    } catch (error) {
      handleApiError(error, "Failed to create category");
    }
  },

  /**
   * Update an existing billboard
   */
  updateBillboard: async (
    storeId: string,
    billboardId: string,
    data: { label: string; imageUrl: string }
  ): Promise<Billboard | undefined> => {
    try {
      const response = await axios.patch<UpdateBillboardResponse>(
        `${domin}/api/${storeId}/billboard/${billboardId}`,
        data
      );
      return response.data.updatedBillboard;
    } catch (error) {
      handleApiError(error, "Failed to update billboard");
    }
  },

  /**
   * Delete a billboard
   */
  deleteBillboard: async (
    storeId: string,
    billboardId: string
  ): Promise<string | undefined> => {
    try {
      const response = await axios.delete<DeleteBillboardResponse>(
        `${domin}/api/${storeId}/billboard/${billboardId}`
      );
      return response.data.message;
    } catch (error) {
      handleApiError(error, "Failed to delete billboard");
    }
  },
};
