import type { CedentePipelineStatus } from "@/data/pipelineData";

/** Single source for Cedentes pipeline status display titles. Change here to update labels across the app. */
export const CEDENTES_STATUS_LABELS: Record<CedentePipelineStatus, string> = {
  lead: "Lead",
  due_diligence: "Due Diligence",
  documentacao_pendente: "Documentação Pendente",
  cedente_ativo: "Cedente Ativo",
  bloqueado_desistencia: "Bloqueado/Desistência",
};

/** Statuses where the card can be deleted (terminal/rejected states). */
export const CEDENTES_TERMINAL_STATUSES: CedentePipelineStatus[] = ["bloqueado_desistencia"];

export function isCedenteTerminal(status: CedentePipelineStatus): boolean {
  return CEDENTES_TERMINAL_STATUSES.includes(status);
}

/** Kanban columns with id, title (from labels), and color. STATUS_ORDER derived from id order. */
export const CEDENTES_COLUMNS: { id: CedentePipelineStatus; title: string; color: string }[] = [
  { id: "lead", title: CEDENTES_STATUS_LABELS.lead, color: "border-slate-500" },
  { id: "due_diligence", title: CEDENTES_STATUS_LABELS.due_diligence, color: "border-blue-500" },
  { id: "documentacao_pendente", title: CEDENTES_STATUS_LABELS.documentacao_pendente, color: "border-yellow-500" },
  { id: "cedente_ativo", title: CEDENTES_STATUS_LABELS.cedente_ativo, color: "border-green-500" },
  { id: "bloqueado_desistencia", title: CEDENTES_STATUS_LABELS.bloqueado_desistencia, color: "border-red-500" },
];

/** Badge config for list views. Label from CEDENTES_STATUS_LABELS. */
export const CEDENTES_STATUS_BADGES: Record<CedentePipelineStatus, { label: string; className: string }> = {
  lead: { label: CEDENTES_STATUS_LABELS.lead, className: "bg-slate-100 text-slate-800" },
  due_diligence: { label: CEDENTES_STATUS_LABELS.due_diligence, className: "bg-blue-100 text-blue-800" },
  documentacao_pendente: {
    label: CEDENTES_STATUS_LABELS.documentacao_pendente,
    className: "bg-yellow-100 text-yellow-800",
  },
  cedente_ativo: { label: CEDENTES_STATUS_LABELS.cedente_ativo, className: "bg-green-100 text-green-800" },
  bloqueado_desistencia: { label: CEDENTES_STATUS_LABELS.bloqueado_desistencia, className: "bg-red-100 text-red-800" },
};
