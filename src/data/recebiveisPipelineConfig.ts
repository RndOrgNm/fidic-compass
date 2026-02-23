/** Single source for Recebíveis pipeline status display titles. Change here to update labels across the app. */
export const RECEBIVEIS_STATUS_LABELS = {
  identificados: "Identificados",
  due_diligence: "Em Due Diligence (CDD) de recebíveis",
  custodia_registro: "Em Custódia / Registro",
  inadimplencia_risco: "Inadimplência / Risco elevado",
  encerrado: "Encerrado",
  rejeitado: "Rejeitado",
} as const;

/** Status type derived from config — add/remove status here to update across the app. */
export type RecebivelStatus = keyof typeof RECEBIVEIS_STATUS_LABELS;

/** Kanban columns with id, title (from labels), and color. STATUS_ORDER derived from id order. */
export const RECEBIVEIS_COLUMNS: { id: RecebivelStatus; title: string; color: string }[] = [
  { id: "identificados", title: RECEBIVEIS_STATUS_LABELS.identificados, color: "border-slate-500" },
  { id: "due_diligence", title: RECEBIVEIS_STATUS_LABELS.due_diligence, color: "border-blue-500" },
  { id: "custodia_registro", title: RECEBIVEIS_STATUS_LABELS.custodia_registro, color: "border-yellow-500" },
  { id: "inadimplencia_risco", title: RECEBIVEIS_STATUS_LABELS.inadimplencia_risco, color: "border-orange-500" },
  { id: "encerrado", title: RECEBIVEIS_STATUS_LABELS.encerrado, color: "border-green-500" },
  { id: "rejeitado", title: RECEBIVEIS_STATUS_LABELS.rejeitado, color: "border-red-500" },
];

/** Badge config for list views. Label from RECEBIVEIS_STATUS_LABELS. */
export const RECEBIVEIS_STATUS_BADGES: Record<RecebivelStatus, { label: string; className: string }> = {
  identificados: { label: RECEBIVEIS_STATUS_LABELS.identificados, className: "bg-slate-100 text-slate-800" },
  due_diligence: { label: RECEBIVEIS_STATUS_LABELS.due_diligence, className: "bg-blue-100 text-blue-800" },
  custodia_registro: { label: RECEBIVEIS_STATUS_LABELS.custodia_registro, className: "bg-yellow-100 text-yellow-800" },
  inadimplencia_risco: { label: RECEBIVEIS_STATUS_LABELS.inadimplencia_risco, className: "bg-orange-100 text-orange-800" },
  encerrado: { label: RECEBIVEIS_STATUS_LABELS.encerrado, className: "bg-green-100 text-green-800" },
  rejeitado: { label: RECEBIVEIS_STATUS_LABELS.rejeitado, className: "bg-red-100 text-red-800" },
};
