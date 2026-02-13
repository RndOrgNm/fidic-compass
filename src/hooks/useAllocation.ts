import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listAllocationWorkflows,
  transitionAllocationWorkflow,
  createAllocationWorkflow,
  type AllocationWorkflowFilters,
  type TransitionAllocationRequest,
  type AllocationWorkflowCreate,
  type AllocationStatus,
} from "@/lib/api/allocationService";

const WORKFLOWS_KEY = "allocation-workflows";

/**
 * Fetch allocation (matching) workflows with optional filters.
 */
export function useAllocationWorkflows(filters: AllocationWorkflowFilters = {}) {
  return useQuery({
    queryKey: [WORKFLOWS_KEY, filters],
    queryFn: () => listAllocationWorkflows(filters),
  });
}

/**
 * Transition a workflow to a new status (e.g. drag-and-drop between columns).
 * Uses optimistic updates for instant UI feedback.
 */
export function useTransitionAllocationWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workflowId,
      data,
    }: {
      workflowId: string;
      data: TransitionAllocationRequest;
    }) => transitionAllocationWorkflow(workflowId, data),

    onMutate: async ({ workflowId, data }) => {
      await queryClient.cancelQueries({ queryKey: [WORKFLOWS_KEY] });
      const previousData = queryClient.getQueriesData({ queryKey: [WORKFLOWS_KEY] });

      queryClient.setQueriesData(
        { queryKey: [WORKFLOWS_KEY] },
        (old: { items: any[]; total: number } | undefined) => {
          if (!old?.items) return old;
          return {
            ...old,
            items: old.items.map((wf) =>
              wf.id === workflowId ? { ...wf, status: data.status as AllocationStatus } : wf
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
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_KEY] });
    },
  });
}

/**
 * Create a new allocation (matching) workflow.
 * Invalidates the allocation workflows list on success.
 */
export function useCreateAllocationWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AllocationWorkflowCreate) => createAllocationWorkflow(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_KEY] });
    },
  });
}
