/**
 * Shared React Query keys for pipeline and related data.
 * Used for cache invalidation when external changes occur (e.g. Funds Agent modifies pipeline).
 */
export const PIPELINE_QUERY_KEYS = {
  prospectionWorkflows: "prospection-workflows",
  recebiveisChecklist: "recebiveis-checklist",
  cedentes: "cedentes",
  cedentesChecklist: "cedentes-checklist",
  cedentesAtivos: "cedentes-ativos",
  allocationWorkflows: "allocation-workflows",
  monitoramento: "monitoramento",
  approvedWorkflows: "approved-prospection-workflows",
  allocatedWorkflows: "allocated-workflows",
  fundsActive: "funds-active",
} as const;

/** All query key prefixes that should be invalidated when the pipeline changes externally */
export const PIPELINE_INVALIDATE_KEYS: readonly string[] = [
  PIPELINE_QUERY_KEYS.prospectionWorkflows,
  PIPELINE_QUERY_KEYS.recebiveisChecklist,
  PIPELINE_QUERY_KEYS.cedentes,
  PIPELINE_QUERY_KEYS.cedentesChecklist,
  PIPELINE_QUERY_KEYS.cedentesAtivos,
  PIPELINE_QUERY_KEYS.allocationWorkflows,
  PIPELINE_QUERY_KEYS.monitoramento,
  PIPELINE_QUERY_KEYS.approvedWorkflows,
  PIPELINE_QUERY_KEYS.allocatedWorkflows,
  PIPELINE_QUERY_KEYS.fundsActive,
];
