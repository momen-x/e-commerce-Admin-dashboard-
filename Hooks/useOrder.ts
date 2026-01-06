import { Order_API } from "@/API/OrderApi";
import { Order, OrderItems } from "@prisma/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

// Define a proper type for the extended Order with product info
export type ExtendedOrder = Order & {
  orderItems: OrderItems[];
  product?: {
    name: string;
    price: number;
    id: string;
  };
};

export const useGetOrders = (
  storeId: string
): UseQueryResult<Order[] | undefined, Error> => {
  return useQuery({
    queryKey: ["orders", storeId], // Fixed typo: "Orderss" → "orders"
    queryFn: () => Order_API.getOrders(storeId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: Boolean(storeId),
  });
};

export const useGetOrder = (
  storeId: string,
  orderId: string
): UseQueryResult<Order | undefined, Error> => {
  return useQuery({
    queryKey: ["order", storeId, orderId],
    queryFn: () => Order_API.getOrder(storeId, orderId),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(storeId && orderId),
  });
};

export const useAddOrder = (): UseMutationResult<
  Order|undefined,
  Error,
  {
    storeId: string;
    productId: string;
    isPaid: boolean;
    phone: string;
    address: string;
    orderItems: OrderItems[];
  }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, phone, address, isPaid, orderItems, productId }) =>
      Order_API.createOrder(storeId, {
        productId,
        phone,
        address,
        isPaid,
        orderItems,
      }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orders", variables.storeId], // Fixed: "Order" → "orders"
      });
    },

    onError: (error) => {
      console.error("Error adding Order:", error.message);
    },
  });
};

export const useUpdateOrder = (): UseMutationResult<
  Order|undefined,
  Error,
  {
    storeId: string;
    orderId: string;
    productId: string;
    isPaid: boolean;
    phone: string;
    address: string;
    orderItems: OrderItems[];
  }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storeId,
      orderId,
      productId,
      isPaid,
      phone,
      address,
      orderItems,
    }) =>
      Order_API.updateOrder(storeId, orderId, {
        productId,
        isPaid,
        address,
        orderItems,
        phone,
      }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orders", variables.storeId], // Fixed: "Orders" → "orders"
      });
      queryClient.invalidateQueries({
        queryKey: ["order", variables.storeId, variables.orderId],
      });
    },

    onError: (error) => {
      console.error("Error updating Order:", error.message);
    },
  });
};

export const useDeleteOrder = (): UseMutationResult<
  string|undefined,
  Error,
  { storeId: string; orderId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, orderId }) =>
      Order_API.deleteOrder(storeId, orderId),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orders", variables.storeId],
      });
    },

    onError: (error) => {
      console.error("Error deleting Order:", error.message);
    },
  });
};