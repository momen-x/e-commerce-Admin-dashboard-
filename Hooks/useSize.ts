import { SIZE_API } from "@/API/SizeApi";
import { Size } from "@prisma/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

export const useGetSizes = (
  storeId: string
): UseQueryResult<Size[] | undefined, Error> => {
  return useQuery({
    queryKey: ["sizes", storeId],
    queryFn: () => SIZE_API.getSizes(storeId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: Boolean(storeId),
  });
};

export const useGetSize = (
  storeId: string,
  sizeId: string
): UseQueryResult<Size | undefined, Error> => {
  return useQuery({
    queryKey: ["size", storeId, sizeId],
    queryFn: () => SIZE_API.getSize(storeId, sizeId),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(storeId && sizeId),
  });
};

export const useAddSize = (): UseMutationResult<
  Size | undefined,
  Error,
  { storeId: string; name: string; value: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, name, value }) =>
      SIZE_API.createSize(storeId, { name, value }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["size", variables.storeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["sizes", variables.storeId],
      });
    },

    onError: (error) => {
      console.error("Error adding size:", error.message);
    },
  });
};

export const useUpdateSize = (): UseMutationResult<
  Size | undefined,
  Error,
  {
    storeId: string;
    SizeId: string;
    name: string;
    value: string;
  }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, SizeId, name, value }) =>
      SIZE_API.updateSize(storeId, SizeId, { name, value }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["sizes", variables.storeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["size", variables.storeId, variables.SizeId],
      });
    },

    onError: (error) => {
      console.error("Error updating size:", error.message);
    },
  });
};

export const useDeleteSize = (): UseMutationResult<
  string | undefined,
  Error,
  { storeId: string; sizeId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, sizeId }) => SIZE_API.deleteSize(storeId, sizeId),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["sizes", variables.storeId],
      });

      queryClient.invalidateQueries({
        queryKey: ["size", variables.storeId, variables.sizeId],
      });
    },

    onError: (error) => {
      console.error("Error deleting size:", error.message);
    },
  });
};
