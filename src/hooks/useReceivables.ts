import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createReceivable,
  type ReceivableCreatePayload,
} from "@/lib/api/receivableService";

const RECEIVABLES_KEY = "receivables";

/**
 * Create a new receivable.
 * Invalidates receivable-related queries on success.
 */
export function useCreateReceivable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReceivableCreatePayload) => createReceivable(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECEIVABLES_KEY] });
      queryClient.invalidateQueries({ queryKey: ["approved-receivables"] });
    },
  });
}
