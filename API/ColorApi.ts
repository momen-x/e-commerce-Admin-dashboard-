import domin from "@/lib/domin";
import { Color } from "@prisma/client";
import axios from "axios";

// Response Types
interface GetColorResponse {
  colors: Color[];
}

interface ColorResponse {
  color: Color;
}

interface UpdateColorResponse {
  updatedColor: Color;
}

interface DeleteColorResponse {
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

export const Color_API = {
  getColors: async (storeId: string): Promise<Color[] | undefined> => {
    try {
      const response = await axios.get<GetColorResponse>(
        `${domin}/api/${storeId}/color`
      );
      return response.data.colors;
    } catch (error) {
      handleApiError(error, "Failed to fetch Colors");
    }
  },
  getColor: async (
    storeId: string,
    ColorId: string
  ): Promise<Color | undefined> => {
    try {
      const response = await axios.get<ColorResponse>(
        `${domin}/api/${storeId}/color/${ColorId}`
      );
      return response.data.color;
    } catch (error) {
      handleApiError(error, "Failed to fetch Color");
    }
  },

  /**
   * Create a new Color
   */
  createColor: async (
    storeId: string,
    data: { name: string; value: string }
  ): Promise<Color | undefined> => {
    try {
      const response = await axios.post<ColorResponse>(
        `${domin}/api/${storeId}/color`,
        data
      );
      return response.data.color;
    } catch (error) {
      handleApiError(error, "Failed to create Color");
    }
  },

  /**
   * Update an existing Color
   */
  updateColor: async (
    storeId: string,
    ColorId: string,
    data: { name: string; value: string }
  ): Promise<Color | undefined> => {
    try {
      const response = await axios.patch<UpdateColorResponse>(
        `${domin}/api/${storeId}/color/${ColorId}`,
        data
      );
      return response.data.updatedColor;
    } catch (error) {
      handleApiError(error, "Failed to update Color");
    }
  },

  /**
   * Delete a Color
   */
  deleteColor: async (
    storeId: string,
    ColorId: string
  ): Promise<string | undefined> => {
    try {
      const response = await axios.delete<DeleteColorResponse>(
        `${domin}/api/${storeId}/color/${ColorId}`
      );
      return response.data.message;
    } catch (error) {
      handleApiError(error, "Failed to delete Color");
    }
  },
};
