import { FUNDS_API_BASE_URL } from "./config";
import type { CedentePipelineStatus } from "@/data/pipelineData";

export type CedenteStatus =
  | "lead"
  | "due_diligence"
  | "documentacao_pendente"
  | "cedente_ativo"
  | "bloqueado_desistencia";

export type Segment =
  | "comercio"
  | "industria"
  | "servicos"
  | "agronegocio"
  | "varejo"
  | "insumos";

export interface CedenteResponse {
  id: string;
  company_name: string;
  cnpj: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  segment: Segment;
  credit_score: number;
  status: CedenteStatus;
  approved_limit: number;
  assigned_to: string | null;
  pending_items: string[];
  status_started_at: string;
  created_at: string;
  updated_at: string;
}

export interface CedenteListResponse {
  items: CedenteResponse[];
  total: number;
}

export interface CedenteFilters {
  status?: CedenteStatus;
  segment?: Segment;
  limit?: number;
  offset?: number;
}

export interface CedenteUpdatePayload {
  status?: CedenteStatus;
  assigned_to?: string | null;
  pending_items?: string[];
  status_started_at?: string;
}

/** Pipeline item shape expected by CedenteCard, CedentesKanban, etc. */
export interface CedentePipelineItem {
  id: string;
  companyName: string;
  cnpj: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  segment: string;
  creditScore: number;
  status: CedentePipelineStatus;
  totalReceivables: number;
  approvedLimit: number;
  createdAt: string;
  assigned_to: string | null;
  pending_items: string[];
  days_in_status: number;
}

function daysBetween(start: string, end: Date = new Date()): number {
  const s = new Date(start).getTime();
  const e = end.getTime();
  return Math.floor((e - s) / (1000 * 60 * 60 * 24));
}

export function mapCedenteToPipelineItem(r: CedenteResponse): CedentePipelineItem {
  return {
    id: r.id,
    companyName: r.company_name,
    cnpj: r.cnpj,
    contactName: r.contact_name,
    contactEmail: r.contact_email,
    contactPhone: r.contact_phone,
    segment: r.segment,
    creditScore: r.credit_score,
    status: r.status as CedentePipelineStatus,
    totalReceivables: 0,
    approvedLimit: r.approved_limit,
    createdAt: r.created_at,
    assigned_to: r.assigned_to,
    pending_items: r.pending_items ?? [],
    days_in_status: daysBetween(r.status_started_at),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      errorMessage =
        typeof errorData.detail === "string"
          ? errorData.detail
          : errorData.detail?.[0]?.msg || errorMessage;
    } catch {
      errorMessage = response.statusText || `HTTP ${response.status}`;
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function listCedentes(
  filters: CedenteFilters = {}
): Promise<{ items: CedentePipelineItem[]; total: number }> {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.segment) params.set("segment", filters.segment);
  if (filters.limit != null) params.set("limit", String(filters.limit));
  if (filters.offset != null) params.set("offset", String(filters.offset));

  const qs = params.toString();
  const url = `${FUNDS_API_BASE_URL}/cedentes${qs ? `?${qs}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await handleResponse<CedenteListResponse>(response);
  return {
    items: data.items.map(mapCedenteToPipelineItem),
    total: data.total,
  };
}

export async function getCedente(id: string): Promise<CedentePipelineItem | null> {
  const response = await fetch(`${FUNDS_API_BASE_URL}/cedentes/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (response.status === 404) return null;
  const data = await handleResponse<CedenteResponse>(response);
  return mapCedenteToPipelineItem(data);
}

export async function updateCedente(
  id: string,
  payload: CedenteUpdatePayload
): Promise<CedentePipelineItem> {
  const body: Record<string, unknown> = {};
  if (payload.status != null) body.status = payload.status;
  if (payload.assigned_to !== undefined) body.assigned_to = payload.assigned_to;
  if (payload.pending_items != null) body.pending_items = payload.pending_items;
  if (payload.status_started_at != null) body.status_started_at = payload.status_started_at;

  const response = await fetch(`${FUNDS_API_BASE_URL}/cedentes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await handleResponse<CedenteResponse>(response);
  return mapCedenteToPipelineItem(data);
}
