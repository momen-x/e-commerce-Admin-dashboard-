import domin from "@/lib/domin";
import { Order, OrderItems } from "@prisma/client";
import axios from "axios";

// Response Types
interface GetOrderResponse {
  orders: Order[];
}

interface OrderResponse {
  order: {
      storeId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    isPaid: boolean;
    phone: string;
    address: string;
    product:{name:string,price:number,id:string},
    orderItems: OrderItems[];
  };
}

interface UpdateOrderResponse {
  updatedOrder: Order;
}

interface DeleteOrderResponse {
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

export const Order_API = {
  getOrders: async (storeId: string): Promise<Order[] | undefined> => {
    try {
      const response = await axios.get<GetOrderResponse>(
        `${domin}/api/${storeId}/order`
      );
      return response.data.orders;
    } catch (error) {
      handleApiError(error, "Failed to fetch Orders");
    }
  },
  getOrder: async (
    storeId: string,
    orderId: string
  ): Promise<Order | undefined> => {
    try {
      const response = await axios.get<OrderResponse>(
        `${domin}/api/${storeId}/order/${orderId}`
      );
      return response.data.order;
    } catch (error) {
      handleApiError(error, "Failed to fetch Order");
    }
  },

  /**
   * Create a new Order
   */
  createOrder: async (
    storeId: string,
    data: {
      orderItems: OrderItems[];
      productId: string;
      phone: string;
      address: string;
      isPaid: boolean;
    }
  ): Promise<Order | undefined> => {
    try {
      const response = await axios.post<OrderResponse>(
        `${domin}/api/${storeId}/order`,
        data
      );
      return response.data.order;
    } catch (error) {
      handleApiError(error, "Failed to create Order");
    }
  },

  /**
   * Update an existing Order
   */
  updateOrder: async (
    storeId: string,
    orderId: string,
    data: {
      orderItems: OrderItems[];
      productId: string;
      phone: string;
      address: string;
      isPaid: boolean;
    }
  ): Promise<Order | undefined> => {
    try {
      const response = await axios.patch<UpdateOrderResponse>(
        `${domin}/api/${storeId}/order/${orderId}`,
        data
      );
      return response.data.updatedOrder;
    } catch (error) {
      handleApiError(error, "Failed to update Order");
    }
  },

  /**
   * Delete a Order
   */
  deleteOrder: async (
    storeId: string,
    orderId: string
  ): Promise<string | undefined> => {
    try {
      const response = await axios.delete<DeleteOrderResponse>(
        `${domin}/api/${storeId}/order/${orderId}`
      );
      return response.data.message;
    } catch (error) {
      handleApiError(error, "Failed to delete Order");
    }
  },
};
