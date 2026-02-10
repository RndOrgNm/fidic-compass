import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listProspectionWorkflows,
  createNewLead,
  transitionWorkflow,
  assignWorkflow,
  type WorkflowFilters,
  type NewLeadCreate,
  type TransitionRequest,
} from "@/lib/api/prospectionService";

const WORKFLOWS_KEY = "prospection-workflows";

/**
 * Fetch prospection workflows with optional filters.
 */
export function useProspectionWorkflows(filters: WorkflowFilters = {}) {
  return useQuery({
    queryKey: [WORKFLOWS_KEY, filters],
    queryFn: () => listProspectionWorkflows(filters),
  });
}

/**
 * Create a new lead (cedente + workflow atomically).
 * Invalidates the workflows list on success.
 */
export function useCreateNewLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewLeadCreate) => createNewLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_KEY] });
    },
  });
}

/**
 * Transition a workflow to a new status (used by drag-and-drop).
 * Invalidates the workflows list on success.
 */
export function useTransitionWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workflowId,
      data,
    }: {
      workflowId: string;
      data: TransitionRequest;
    }) => transitionWorkflow(workflowId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_KEY] });
    },
  });
}

/**
 * Assign a workflow to a user.
 * Invalidates the workflows list on success.
 */
export function useAssignWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workflowId,
      assignedTo,
    }: {
      workflowId: string;
      assignedTo: string;
    }) => assignWorkflow(workflowId, assignedTo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_KEY] });
    },
  });
}
