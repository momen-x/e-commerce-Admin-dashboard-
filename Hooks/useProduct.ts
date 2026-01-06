// useProduct.ts (Hooks)
import { Product_API } from "@/API/ProductApi";
import { Product } from "@prisma/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

export const useGetProducts = (
  storeId: string
): UseQueryResult<Product[] | null, Error> => {
  return useQuery({
    queryKey: ["products", storeId],
    queryFn: () => Product_API.getProducts(storeId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: Boolean(storeId),
  });
};

export const useGetProduct = (
  storeId: string,
  productId: string
): UseQueryResult<Product | null, Error> => {
  return useQuery({
    queryKey: ["product", storeId, productId],
    queryFn: () => Product_API.getProduct(storeId, productId),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(storeId && productId),
  });
};

export const useAddProduct = (): UseMutationResult<
  Product | null,
  Error,
  {
    storeId: string;
    categoryId: string;
    sizeId: string;
    colorId: string;
    name: string;
    images: string[];
    price: number;
    isFeatured?: boolean;
    isArchived?: boolean;
  }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storeId,
      categoryId,
      sizeId,
      colorId,
      name,
      images,
      price,
      isFeatured,
      isArchived,
    }) =>
      Product_API.createProduct(storeId, {
        categoryId,
        sizeId,
        colorId,
        name,
        images,
        price,
        isFeatured,
        isArchived,
      }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["products", variables.storeId],
      });
    },

    onError: (error) => {
      console.error("Error adding product:", error.message);
    },
  });
};

export const useUpdateProduct = (): UseMutationResult<
  Product | null,
  Error,
  {
    storeId: string;
    productId: string;
    categoryId: string;
    sizeId: string;
    colorId: string;
    name: string;
    images: string[]; // ← Fixed
    price: number;
    isFeatured?: boolean;
    isArchived?: boolean;
  }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storeId,
      productId,
      categoryId,
      sizeId,
      colorId,
      name,
      images,
      price,
      isFeatured,
      isArchived,
    }) =>
      Product_API.updateProduct(storeId, productId, {
        categoryId,
        sizeId,
        colorId,
        name,
        images,
        price,
        isFeatured,
        isArchived,
      }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["products", variables.storeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["product", variables.storeId, variables.productId],
      });
    },

    onError: (error) => {
      console.error("Error updating product:", error.message);
    },
  });
};

export const useDeleteProduct = (): UseMutationResult<
  string | null,
  Error,
  { storeId: string; productId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, productId }) =>
      Product_API.deleteProduct(storeId, productId),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["products", variables.storeId],
      });
    },

    onError: (error) => {
      console.error("Error deleting product:", error.message);
    },
  });
};
