import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listRecebiveis,
  createNewLead,
  createRecebivel,
  transitionRecebivel,
  assignRecebivel,
  type RecebivelFilters,
  type NewLeadCreate,
  type RecebivelCreatePayload,
  type TransitionRequest,
} from "@/lib/api/recebiveisService";

const RECEBIVEIS_KEY = "recebiveis";

/**
 * Fetch recebíveis with optional filters.
 */
export function useRecebiveis(filters: RecebivelFilters = {}) {
  return useQuery({
    queryKey: [RECEBIVEIS_KEY, filters],
    queryFn: () => listRecebiveis(filters),
  });
}

/** Alias for backward compatibility */
export const useProspectionWorkflows = useRecebiveis;

/**
 * Create a new lead (cedente + recebível atomically).
 */
export function useCreateNewLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewLeadCreate) => createNewLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECEBIVEIS_KEY] });
    },
  });
}

/**
 * Create a new recebível (with or without invoice data).
 */
export function useCreateRecebivel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RecebivelCreatePayload) => createRecebivel(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECEBIVEIS_KEY] });
      queryClient.invalidateQueries({ queryKey: ["approved-recebiveis"] });
    },
  });
}

/** Alias for useCreateRecebivel - used by NewReceivableModal */
export const useCreateReceivable = useCreateRecebivel;

/**
 * Transition a recebível to a new status.
 */
export function useTransitionRecebivel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recebivelId,
      data,
    }: {
      recebivelId: string;
      data: TransitionRequest;
    }) => transitionRecebivel(recebivelId, data),

    onMutate: async ({ recebivelId, data }) => {
      await queryClient.cancelQueries({ queryKey: [RECEBIVEIS_KEY] });
      const previousData = queryClient.getQueriesData({ queryKey: [RECEBIVEIS_KEY] });

      queryClient.setQueriesData(
        { queryKey: [RECEBIVEIS_KEY] },
        (old: any) => {
          if (!old?.items) return old;
          return {
            ...old,
            items: old.items.map((r: any) =>
              r.id === recebivelId ? { ...r, status: data.status } : r
            ),
          };
        }
      );

      return { previousData };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]: [any, any]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [RECEBIVEIS_KEY] });
    },
  });
}

/** Alias - useTransitionWorkflow accepts workflowId (recebivelId) */
export const useTransitionWorkflow = useTransitionRecebivel;

/**
 * Assign a recebível to a user.
 */
export function useAssignRecebivel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recebivelId,
      assignedTo,
    }: {
      recebivelId: string;
      assignedTo: string;
    }) => assignRecebivel(recebivelId, assignedTo),

    onMutate: async ({ recebivelId, assignedTo }) => {
      await queryClient.cancelQueries({ queryKey: [RECEBIVEIS_KEY] });
      const previousData = queryClient.getQueriesData({ queryKey: [RECEBIVEIS_KEY] });

      queryClient.setQueriesData(
        { queryKey: [RECEBIVEIS_KEY] },
        (old: any) => {
          if (!old?.items) return old;
          return {
            ...old,
            items: old.items.map((r: any) =>
              r.id === recebivelId ? { ...r, assigned_to: assignedTo } : r
            ),
          };
        }
      );

      return { previousData };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]: [any, any]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [RECEBIVEIS_KEY] });
    },
  });
}

/** Alias - useAssignWorkflow accepts workflowId (recebivelId) */
export const useAssignWorkflow = useAssignRecebivel;
