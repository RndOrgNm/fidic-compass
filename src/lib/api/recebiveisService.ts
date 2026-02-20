import { FUNDS_API_BASE_URL } from "./config";

// ── Enums ──────────────────────────────────────────────────────────────────────

export type ProspectionStatus =
  | "lead"
  | "contact"
  | "documents"
  | "credit_analysis"
  | "approved"
  | "rejected";

export type ProspectionStep =
  | "initial_contact"
  | "proposal_sent"
  | "document_collection"
  | "risk_assessment"
  | "committee_review"
  | "completed";

export type CreditAnalysisStatus =
  | "pending_documents"
  | "in_analysis"
  | "approved"
  | "rejected";

export type Segment =
  | "comercio"
  | "industria"
  | "servicos"
  | "agronegocio"
  | "varejo"
  | "insumos";

// ── Response types ─────────────────────────────────────────────────────────────

export interface Recebivel {
  id: string;
  cedente_id: string;
  status: ProspectionStatus;
  current_step: ProspectionStep;
  assigned_to: string | null;
  pending_items: string[];
  sla_deadline: string | null;
  estimated_volume: number;
  created_at: string;
  updated_at: string;
  /** Receivable fields (null until receivable is created) */
  invoice_number: string | null;
  nominal_value: number | null;
  due_date: string | null;
  debtor_name: string | null;
  debtor_cnpj: string | null;
  credit_analysis_status: CreditAnalysisStatus | null;
  risk_score: number | null;
  segment: Segment | null;
  rejection_reason: string | null;
  cedente_name: string | null;
  cedente_cnpj: string | null;
  cedente_segment: Segment | null;
  receivable_value: number;
  total_steps: number;
  completed_steps: number;
  days_in_progress: number;
}

export interface RecebivelListResponse {
  items: Recebivel[];
  total: number;
}

export interface NewLeadCreate {
  company_name: string;
  cnpj: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  segment: Segment;
  estimated_volume: number;
  assigned_to?: string | null;
}

export interface NewLeadResponse {
  cedente_id: string;
  recebivel_id: string;
  workflow_id: string; // alias for recebivel_id (backward compat)
  company_name: string;
  cnpj: string;
  segment: Segment;
  status: ProspectionStatus;
  estimated_volume: number;
}

export interface RecebivelCreatePayload {
  cedente_id: string;
  status?: ProspectionStatus;
  current_step?: ProspectionStep;
  assigned_to?: string | null;
  estimated_volume?: number;
  invoice_number?: string | null;
  nominal_value?: number | null;
  due_date?: string | null;
  debtor_name?: string | null;
  debtor_cnpj?: string | null;
  segment?: Segment | null;
  risk_score?: number | null;
}

export interface TransitionRequest {
  status: ProspectionStatus;
  current_step?: ProspectionStep;
  pending_items?: string[];
}

export interface AssignRequest {
  assigned_to: string;
}

export interface ApproveRequest {
  risk_score: number;
}

export interface RejectRequest {
  reason: string;
}

// ── Filters ────────────────────────────────────────────────────────────────────

export interface RecebivelFilters {
  status?: ProspectionStatus;
  assigned_to?: string;
  cedente_id?: string;
  segment?: Segment;
  limit?: number;
  offset?: number;
}

// ── Helper ────────────────────────────────────────────────────────────────────

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

// ── API functions ──────────────────────────────────────────────────────────────

export async function listRecebiveis(
  filters: RecebivelFilters = {}
): Promise<RecebivelListResponse> {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.assigned_to) params.set("assigned_to", filters.assigned_to);
  if (filters.cedente_id) params.set("cedente_id", filters.cedente_id);
  if (filters.segment) params.set("segment", filters.segment);
  if (filters.limit != null) params.set("limit", String(filters.limit));
  if (filters.offset != null) params.set("offset", String(filters.offset));

  const qs = params.toString();
  const url = `${FUNDS_API_BASE_URL}/recebiveis${qs ? `?${qs}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  return handleResponse<RecebivelListResponse>(response);
}

export async function createNewLead(data: NewLeadCreate): Promise<NewLeadResponse> {
  const response = await fetch(`${FUNDS_API_BASE_URL}/recebiveis/new-lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse<NewLeadResponse>(response);
}

export async function createRecebivel(
  data: RecebivelCreatePayload
): Promise<Recebivel> {
  const response = await fetch(`${FUNDS_API_BASE_URL}/recebiveis`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse<Recebivel>(response);
}

export async function getRecebivel(recebivelId: string): Promise<Recebivel> {
  const response = await fetch(
    `${FUNDS_API_BASE_URL}/recebiveis/${recebivelId}`,
    { method: "GET", headers: { "Content-Type": "application/json" } }
  );

  return handleResponse<Recebivel>(response);
}

export async function transitionRecebivel(
  recebivelId: string,
  data: TransitionRequest
): Promise<Recebivel> {
  const response = await fetch(
    `${FUNDS_API_BASE_URL}/recebiveis/${recebivelId}/transition`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  return handleResponse<Recebivel>(response);
}

export async function assignRecebivel(
  recebivelId: string,
  assignedTo: string
): Promise<Recebivel> {
  const response = await fetch(
    `${FUNDS_API_BASE_URL}/recebiveis/${recebivelId}/assign`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assigned_to: assignedTo } as AssignRequest),
    }
  );

  return handleResponse<Recebivel>(response);
}

export async function approveRecebivel(
  recebivelId: string,
  riskScore: number
): Promise<Recebivel> {
  const response = await fetch(
    `${FUNDS_API_BASE_URL}/recebiveis/${recebivelId}/approve`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ risk_score: riskScore } as ApproveRequest),
    }
  );

  return handleResponse<Recebivel>(response);
}

export async function rejectRecebivel(
  recebivelId: string,
  reason: string
): Promise<Recebivel> {
  const response = await fetch(
    `${FUNDS_API_BASE_URL}/recebiveis/${recebivelId}/reject`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason } as RejectRequest),
    }
  );

  return handleResponse<Recebivel>(response);
}

export async function getRecebiveisByCedente(
  cedenteId: string
): Promise<Recebivel[]> {
  const response = await fetch(
    `${FUNDS_API_BASE_URL}/recebiveis/cedente/${cedenteId}`,
    { method: "GET", headers: { "Content-Type": "application/json" } }
  );

  return handleResponse<Recebivel[]>(response);
}
