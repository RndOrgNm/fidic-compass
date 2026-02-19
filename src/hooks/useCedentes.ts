import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listCedentes,
  updateCedente,
  createCedente,
  type CedenteFilters,
  type CedenteUpdatePayload,
  type CedenteCreatePayload,
  type CedentePipelineItem,
} from "@/lib/api/cedenteService";
import type { CedentePipelineStatus } from "@/data/pipelineData";

const CEDENTES_KEY = "cedentes";

export function useCedentes(filters: CedenteFilters = {}) {
  return useQuery({
    queryKey: [CEDENTES_KEY, filters],
    queryFn: () => listCedentes(filters),
  });
}

export function useUpdateCedente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CedenteUpdatePayload }) =>
      updateCedente(id, payload),

    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: [CEDENTES_KEY] });
      const previousData = queryClient.getQueriesData({ queryKey: [CEDENTES_KEY] });

      queryClient.setQueriesData(
        { queryKey: [CEDENTES_KEY] },
        (old: { items: CedentePipelineItem[]; total: number } | undefined) => {
          if (!old?.items) return old;
          return {
            ...old,
            items: old.items.map((c) =>
              c.id === id
                ? {
                    ...c,
                    ...(payload.status && { status: payload.status as CedentePipelineStatus }),
                    ...(payload.pending_items !== undefined && { pending_items: payload.pending_items }),
                    ...(payload.status_started_at && {
                      days_in_status: 0,
                      status_started_at: payload.status_started_at,
                    }),
                  }
                : c
            ),
          };
        }
      );

      return { previousData };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        (context.previousData as [unknown, unknown][]).forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey as unknown[], data);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [CEDENTES_KEY] });
    },
  });
}

export function useCreateCedente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CedenteCreatePayload) => createCedente(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CEDENTES_KEY] });
    },
  });
}
