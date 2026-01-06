import { Color_API } from "@/API/ColorApi";
import { Color } from "@prisma/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

export const useGetColors = (
  storeId: string
): UseQueryResult<Color[] | undefined, Error> => {
  return useQuery({
    queryKey: ["colors", storeId],
    queryFn: () => Color_API.getColors(storeId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: Boolean(storeId),
  });
};

export const useGetColor = (
  storeId: string,
  colorId: string
): UseQueryResult<Color | undefined, Error> => {
  return useQuery({
    queryKey: ["color", storeId, colorId],
    queryFn: () => Color_API.getColor(storeId, colorId),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(storeId && colorId),
  });
};

export const useAddColor = (): UseMutationResult<
  Color | undefined,
  Error,
  { storeId: string; name: string; value: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, name, value }) =>
      Color_API.createColor(storeId, { name, value }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["colors", variables.storeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["color", variables.storeId, _data?.id],
      });
    },

    onError: (error) => {
      console.error("Error adding Color:", error.message);
    },
  });
};

export const useUpdateColor = (): UseMutationResult<
  Color | undefined,
  Error,
  {
    storeId: string;
    colorId: string;
    name: string;
    value: string;
  }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, colorId, name, value }) =>
      Color_API.updateColor(storeId, colorId, { name, value }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["colors", variables.storeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["color", variables.storeId, variables.colorId],
      });
    },

    onError: (error) => {
      console.error("Error updating Color:", error.message);
    },
  });
};

export const useDeleteColor = (): UseMutationResult<
  string | undefined,
  Error,
  { storeId: string; colorId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, colorId }) =>
      Color_API.deleteColor(storeId, colorId),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["colors", variables.storeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["colors", variables.storeId, variables.colorId],
      });
    },

    onError: (error) => {
      console.error("Error deleting Color:", error.message);
    },
  });
};
