import { CATEGORY_API } from "@/API/CategoryApi";
import { Category } from "@prisma/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";


export const useGetCategories = (
  storeId: string
): UseQueryResult<Category[] | undefined, Error> => {
  return useQuery({
    queryKey: ["categories", storeId],
    queryFn: () => CATEGORY_API.getCategories(storeId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: Boolean(storeId),
  });
};

export const useGetCategory = (
  storeId: string,
  categoryId: string
): UseQueryResult<Category | undefined, Error> => {
  return useQuery({
    queryKey: ["category", storeId, categoryId],
    queryFn: () => CATEGORY_API.getCategory(storeId, categoryId),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(storeId && categoryId),
  });
};

export const useAddCategory = (): UseMutationResult<
  Category | undefined,
  Error,
  { storeId: string; name: string; billboardId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, name, billboardId }) =>
      CATEGORY_API.createCategory(storeId, { name, billboardId }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["categories", variables.storeId],
      });
    },

    onError: (error) => {
      console.error("Error adding category:", error.message);
    },
  });
};


export const useUpdateCategory = (): UseMutationResult<
  Category | undefined,
  Error,
  {
    storeId: string;
    categoryId: string;
    name: string;
    billboardId: string;
  }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, categoryId, name, billboardId }) =>
      CATEGORY_API.updateCategory(storeId, categoryId, {
        name,
        billboardId,
      }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["categories", variables.storeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["category", variables.storeId, variables.categoryId],
      });
    },

    onError: (error) => {
      console.error("Error updating category:", error.message);
    },
  });
};

// ============================================
// DELETE CATEGORY
// ============================================
export const useDeleteCategory = (): UseMutationResult<
  string | undefined,
  Error,
  { storeId: string; categoryId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, categoryId }) =>
      CATEGORY_API.deleteCategory(storeId, categoryId),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["categories", variables.storeId],
      });
    },

    onError: (error) => {
      console.error("Error deleting category:", error.message);
    },
  });
};
