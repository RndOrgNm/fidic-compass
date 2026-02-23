import type { ProspectionStatus } from "@/lib/api/prospectionService";

/** Single source for Recebíveis pipeline status display titles. Change here to update labels across the app. */
export const RECEBIVEIS_STATUS_LABELS: Record<ProspectionStatus, string> = {
  lead: "Lead",
  contact: "Em Contato",
  documents: "Documentação",
  credit_analysis: "Análise de Crédito",
  approved: "Aprovado",
  rejected: "Rejeitado",
};

/** Kanban columns with id, title (from labels), and color. STATUS_ORDER derived from id order. */
export const RECEBIVEIS_COLUMNS: { id: ProspectionStatus; title: string; color: string }[] = [
  { id: "lead", title: RECEBIVEIS_STATUS_LABELS.lead, color: "border-slate-500" },
  { id: "contact", title: RECEBIVEIS_STATUS_LABELS.contact, color: "border-blue-500" },
  { id: "documents", title: RECEBIVEIS_STATUS_LABELS.documents, color: "border-yellow-500" },
  { id: "credit_analysis", title: RECEBIVEIS_STATUS_LABELS.credit_analysis, color: "border-purple-500" },
  { id: "approved", title: RECEBIVEIS_STATUS_LABELS.approved, color: "border-green-500" },
  { id: "rejected", title: RECEBIVEIS_STATUS_LABELS.rejected, color: "border-red-500" },
];

/** Badge config for list views. Label from RECEBIVEIS_STATUS_LABELS. */
export const RECEBIVEIS_STATUS_BADGES: Record<ProspectionStatus, { label: string; className: string }> = {
  lead: { label: RECEBIVEIS_STATUS_LABELS.lead, className: "bg-slate-100 text-slate-800" },
  contact: { label: RECEBIVEIS_STATUS_LABELS.contact, className: "bg-blue-100 text-blue-800" },
  documents: { label: RECEBIVEIS_STATUS_LABELS.documents, className: "bg-yellow-100 text-yellow-800" },
  credit_analysis: { label: RECEBIVEIS_STATUS_LABELS.credit_analysis, className: "bg-purple-100 text-purple-800" },
  approved: { label: RECEBIVEIS_STATUS_LABELS.approved, className: "bg-green-100 text-green-800" },
  rejected: { label: RECEBIVEIS_STATUS_LABELS.rejected, className: "bg-red-100 text-red-800" },
};
