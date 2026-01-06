import { BILLBOARD_API} from "@/API/BillboardApi";
import { Billboard } from "@prisma/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";


export const useGetBillboards = (
  storeId: string
): UseQueryResult<Billboard[] | undefined, Error> => {
  return useQuery({
    queryKey: ["billboards", storeId],
    queryFn: () => BILLBOARD_API.getBillboards(storeId),
    staleTime: 2 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: Boolean(storeId),
  });
};

export const useGetBillboard = (
  storeId: string,
  billboardId: string
): UseQueryResult<Billboard | undefined, Error> => {
  return useQuery({
    queryKey: ["billboard", storeId, billboardId],
    queryFn: () => BILLBOARD_API.getBillboard(storeId, billboardId),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(storeId && billboardId),
  });
};

export const useAddBillboard = (): UseMutationResult<
  Billboard | undefined,
  Error,
  { storeId: string; label: string; imageUrl: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, label, imageUrl }) =>
      BILLBOARD_API.createBillboard(storeId, { label, imageUrl }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["billboards", variables.storeId],
      });
    },

    onError: (error) => {
      console.error("Error adding billboard:", error.message);
    },
  });
};


export const useUpdateBillboard = (): UseMutationResult<
  Billboard | undefined,
  Error,
  {
    storeId: string;
    billboardId: string;
    label: string;
    imageUrl: string;
  }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, billboardId, label, imageUrl }) =>
      BILLBOARD_API.updateBillboard(storeId, billboardId, {
        label,
        imageUrl,
      }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["billboards", variables.storeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["billboard", variables.storeId, variables.billboardId],
      });
    },

    onError: (error) => {
      console.error("Error updating billboard:", error.message);
    },
  });
};

// ============================================
// DELETE BILLBOARD
// ============================================
export const useDeleteBillboard = (): UseMutationResult<
  string | undefined,
  Error,
  { storeId: string; billboardId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, billboardId }) =>
      BILLBOARD_API.deleteBillboard(storeId, billboardId),  

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["billboards", variables.storeId],
      });
    },

    onError: (error) => {
      console.error("Error deleting billboard:", error.message);
    },
  });
};
